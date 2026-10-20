"""Exploratory benchmark; tsrs does NOT preserve Effect diagnostics. Run from repo root.
Usage: python3 docs/investigations/tsrs-benchmarks/run.py /absolute/path/to/tsrs
Installs are separate. Only run in a disposable checkout without live dev outputs.
"""
import hashlib
import json
from pathlib import Path
import shutil
import statistics
import subprocess
import sys
import time

root = Path.cwd()
out = root / 'docs/investigations/tsrs-benchmarks'
candidate = str(Path(sys.argv[1]).resolve())
packages = ['core', 'api', 'data', 'jobs', 'web']
manifests = {root / 'packages' / p / 'package.json': (root / 'packages' / p / 'package.json').read_bytes() for p in packages}
records = []
outputs = {}

def run(label, cmd, iteration):
    start = time.perf_counter()
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    elapsed = time.perf_counter() - start
    log = f'{label}-{iteration}.log'
    (out / log).write_bytes(result.stdout)
    records.append(dict(label=label, iteration=iteration, command=cmd, seconds=elapsed, exit=result.returncode, log=log))
    (out / 'runs.json').write_text(json.dumps(records, indent=2) + '\n')
    print(label, iteration, round(elapsed, 3), result.returncode, flush=True)
    return result.returncode

def clean():
    for p in packages:
        shutil.rmtree(root / 'packages' / p / 'dist', ignore_errors=True)
    for path in [root / 'node_modules/.vite', root / 'packages/web/node_modules/.vite']:
        shutil.rmtree(path, ignore_errors=True)

def snapshot():
    return {str(f.relative_to(root)): hashlib.sha256(f.read_bytes()).hexdigest()
            for p in packages for f in sorted((root / 'packages' / p / 'dist').rglob('*')) if f.is_file()}

try:
    for compiler in ['baseline', 'candidate']:
        for path, original in manifests.items():
            data = json.loads(original)
            if compiler == 'candidate':
                for task in ['typecheck', 'build']:
                    if data['scripts'][task].startswith('tsc '):
                        data['scripts'][task] = '"' + candidate + '"' + data['scripts'][task][3:]
                path.write_text(json.dumps(data, indent=2) + '\n')
            else:
                path.write_bytes(original)
        # Warm up; setup/network/install not included. No statistical diagnostics flags.
        run(compiler + '-typecheck-warmup', ['pnpm', 'typecheck'], 0)
        for i in range(1, 6):
            run(compiler + '-typecheck', ['pnpm', 'typecheck'], i)
        for i in range(1, 4):
            clean()
            run(compiler + '-build-clean', ['pnpm', 'build'], i)
        outputs[compiler] = snapshot()
        for i in range(1, 6):
            run(compiler + '-build-warm', ['pnpm', 'build'], i)
finally:
    for path, original in manifests.items():
        path.write_bytes(original)
    (out / 'output-hashes.json').write_text(json.dumps(outputs, indent=2) + '\n')
    summary = {}
    for label in sorted({r['label'] for r in records}):
        rows = [r for r in records if r['label'] == label]
        values = [r['seconds'] for r in rows]
        summary[label] = dict(median=statistics.median(values), minimum=min(values), maximum=max(values), exits=[r['exit'] for r in rows])
    (out / 'summary.json').write_text(json.dumps(summary, indent=2) + '\n')
