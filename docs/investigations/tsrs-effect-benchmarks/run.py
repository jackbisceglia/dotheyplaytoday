"""Run from the isolated repo root after pnpm install and pnpm build.
Usage: python3 docs/investigations/tsrs-effect-benchmarks/run.py /path/to/effect-tsgo
Candidate package must be 0.63.0; baseline tsc must still be patched with 0.51.1.
Runs sequentially, rotating variant order. Restores package manifests on exit.
"""
import hashlib,json,os,re,shlex,shutil,statistics,subprocess,sys,time
from pathlib import Path
root=Path.cwd(); out=root/'docs/investigations/tsrs-effect-benchmarks'; cli=str(Path(sys.argv[1]).absolute())
packages=['core','api','data','jobs','web']
manifests={root/'packages'/p/'package.json':(root/'packages'/p/'package.json').read_bytes() for p in packages}
variants={'baseline':'tsc','go-control':shlex.quote(cli)+' tsc@7.1.0-beta','rust':shlex.quote(cli)+' tsrs@0.20.1-ts7.1.0-beta'}
baseline_version=subprocess.check_output([str(root/'node_modules/.bin/tsc'),'--version'],text=True).strip()
candidate_version=subprocess.check_output([cli,'tsrs@0.20.1-ts7.1.0-beta','--version'],text=True).strip()
if baseline_version != 'Version 7.0.2+effect-tsgo.0.51.1':
 raise RuntimeError('Use an isolated origin/main baseline checkout before the dependency upgrade: '+baseline_version)
if 'effect-tsgo.0.63.0' not in candidate_version:
 raise RuntimeError('Expected @effect/tsgo 0.63.0: '+candidate_version)
records=[]; snapshots={}
def select(variant):
 for path,original in manifests.items():
  data=json.loads(original)
  for task in ['build','typecheck']:
   script=data['scripts'][task]
   if script.startswith('tsc '): data['scripts'][task]=variants[variant]+script[3:]
  path.write_text(json.dumps(data,indent=2)+'\n')
def clean():
 for p in packages: shutil.rmtree(root/'packages'/p/'dist',ignore_errors=True)
 for p in ['node_modules/.vite','packages/web/node_modules/.vite']: shutil.rmtree(root/p,ignore_errors=True)
def run(variant,task,i,cmd):
 name=f'{variant}-{task}-{i}'; start=time.perf_counter()
 p=subprocess.run(cmd,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
 elapsed=time.perf_counter()-start
 (out/(name+'.log')).write_bytes(p.stdout)
 row=dict(variant=variant,task=task,iteration=i,command=cmd,compiler=variants[variant],seconds=elapsed,exit=p.returncode)
 records.append(row); (out/'runs.json').write_text(json.dumps(records,indent=2)+'\n')
 print(name,round(elapsed,3),p.returncode,flush=True)
 if p.returncode: raise RuntimeError(name+' failed; no speedup claim')
def snapshot(variant):
 snapshots[variant]={str(f.relative_to(root)):hashlib.sha256(f.read_bytes()).hexdigest() for p in packages for f in sorted((root/'packages'/p/'dist').rglob('*')) if f.is_file()}
 (out/'output-hashes.json').write_text(json.dumps(snapshots,indent=2)+'\n')
try:
 for variant in variants:
  select(variant);run(variant,'typecheck-warmup',0,['pnpm','typecheck'])
 for task,n in [('typecheck',5),('build-clean',3),('build-warm',5),('emit',5)]:
  for i in range(1,n+1):
   names=list(variants); names=names[i%3:]+names[:i%3]
   for variant in names:
    select(variant)
    if task=='build-clean':clean()
    cmd=['pnpm','typecheck'] if task=='typecheck' else ['pnpm','build'] if task.startswith('build') else ['pnpm','--filter','!@dtpt/web','-r','run','build']
    run(variant,task,i,cmd)
    if task=='build-clean' and i==3:snapshot(variant)
 # Incremental core only, isolated caches; opt-in experiment, not current repo behavior.
 cache=out/'.cache';cache.mkdir(exist_ok=True)
 for variant in variants:
  cmd=([str(root/'node_modules/.bin/tsc')] if variant=='baseline' else [cli,'tsc@7.1.0-beta' if variant=='go-control' else 'tsrs@0.20.1-ts7.1.0-beta'])
  info=cache/(variant+'.tsbuildinfo')
  args=cmd+['-p','packages/core/tsconfig.json','--noEmit','--incremental','--tsBuildInfoFile',str(info),'--pretty','false']
  for i in range(1,4):
   info.unlink(missing_ok=True);run(variant,'incremental-cold',i,args)
  for i in range(1,6):run(variant,'incremental-warm',i,args)
 shutil.rmtree(cache)
finally:
 for path,original in manifests.items():path.write_bytes(original)
 summary={}
 for variant in variants:
  for task in sorted({r['task'] for r in records}):
   rows=[r for r in records if r['variant']==variant and r['task']==task]
   if not rows:continue
   values=[r['seconds'] for r in rows]
   summary[variant+'-'+task]=dict(median=statistics.median(values),minimum=min(values),maximum=max(values),exits=[r['exit'] for r in rows])
 (out/'summary.json').write_text(json.dumps(summary,indent=2)+'\n')
