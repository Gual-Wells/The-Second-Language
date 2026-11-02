import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {runDailyPipeline} from './lib/daily-pipeline-runner.mjs';
const [date,flag,codexExecutable]=process.argv.slice(2);
if(flag!=='--codex'||!codexExecutable||process.argv.length!==5)throw Error('用法：run-daily-pipeline.mjs DATE --codex CODEX_EXE');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
console.log(JSON.stringify(await runDailyPipeline({root,date,codexExecutable}),null,2));
