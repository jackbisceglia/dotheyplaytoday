from pathlib import Path
import subprocess,json,re
out=Path('docs/investigations/tsrs-effect-benchmarks');root=Path.cwd();cli='/tmp/tsrs-retest-candidate/node_modules/.bin/effect-tsgo'
compilers={'baseline':[str(root/'node_modules/.bin/tsc')],'go-control':[cli,'tsc@7.1.0-beta'],'rust':[cli,'tsrs@0.20.1-ts7.1.0-beta']}
records=[]
f=root/'packages/core/src/tsrs-compatibility-probe.ts'
assert not f.exists()
try:
 for label,source in [('clean',None),('effect','import { Effect } from "effect";\nEffect.succeed(1);\n'),('typescript','export const mismatch: string = 123;\n')]:
  if source: f.write_text(source)
  for name,cmd in compilers.items():
   argv=cmd+['-p','packages/core/tsconfig.json','--noEmit','--pretty','false']
   p=subprocess.run(argv,capture_output=True,text=True)
   (out/f'probe-{label}-{name}.log').write_text(p.stdout+p.stderr)
   records.append(dict(probe=label,compiler=name,source=source,command=argv,exit=p.returncode,diagnostics=sorted(x for x in p.stdout.splitlines() if re.search(r'(suggestion|warning|error) TS\d+',x))))
   print(label,name,p.returncode,flush=True)
  if source: f.unlink()
finally:
 f.unlink(missing_ok=True)
 (out/'probes.json').write_text(json.dumps(records,indent=2)+'\n')
