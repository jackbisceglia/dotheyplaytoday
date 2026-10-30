"""Additional compiler acceptance probes. Run before upgrading baseline dependencies."""
import json,subprocess
from pathlib import Path
root=Path.cwd();out=root/'docs/investigations/tsrs-effect-benchmarks';cli='/tmp/tsrs-retest-candidate/node_modules/.bin/effect-tsgo'
compilers={'baseline':[str(root/'node_modules/.bin/tsc')],'go-control':[cli,'tsc@7.1.0-beta'],'rust':[cli,'tsrs@0.20.1-ts7.1.0-beta']}
f=root/'packages/core/src/tsrs-compatibility-probe.ts';config=root/'packages/core/tsconfig.retest.json';info=out/'probe.tsbuildinfo';records=[]
assert not f.exists() and not config.exists()
def run(name,label,args):
 p=subprocess.run(compilers[name]+args,capture_output=True,text=True)
 (out/f'acceptance-{label}-{name}.log').write_text(p.stdout+p.stderr)
 records.append(dict(compiler=name,probe=label,command=compilers[name]+args,exit=p.returncode))
 print(label,name,p.returncode,flush=True)
try:
 for severity,strict in [('warning',False),('suggestion',False),('suggestion',True),('off',False)]:
  f.write_text('import { Effect } from "effect";\nEffect.succeed(1);\n')
  config.write_text(json.dumps({'extends':'./tsconfig.json','include':['src/tsrs-compatibility-probe.ts'],'compilerOptions':{'plugins':[{'name':'@effect/language-service','overrides':[],'diagnosticSeverity':{'floatingEffect':severity},'ignoreEffectSuggestionsInTscExitCode':not strict}]}}))
  for name in compilers:run(name,severity+('-strict' if strict else ''),['-p',str(config),'--noEmit','--pretty','false'])
 config.write_text(json.dumps({'extends':'./tsconfig.json','include':['src/tsrs-compatibility-probe.ts']}))
 for name in compilers:
  info.unlink(missing_ok=True)
  for label,source in [('clean','export const valid = 1;\n'),('error','import { Effect } from "effect";\nEffect.succeed(1);\n'),('fixed','export const valid = 2;\n')]:
   f.write_text(source)
   run(name,'incremental-'+label,['-p',str(config),'--noEmit','--incremental','--tsBuildInfoFile',str(info),'--pretty','false'])
finally:
 f.unlink(missing_ok=True);config.unlink(missing_ok=True);info.unlink(missing_ok=True)
 (out/'acceptance.json').write_text(json.dumps(records,indent=2)+'\n')
