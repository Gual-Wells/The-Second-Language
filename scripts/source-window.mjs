import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateReadRecord} from './lib/current-affairs-reader.mjs';
import {sourceWindows} from './lib/source-window.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),[file,...args]=process.argv.slice(2),options={};
if(!file)throw Error('source-window.mjs READ-RECORD --find TEXT [--from N --limit N]，或 READ-RECORD --start N --end N');
for(let i=0;i<args.length;i+=2){if(!['--find','--from','--limit','--start','--end'].includes(args[i])||args[i+1]===undefined||options[args[i]]!==undefined)throw Error('原文窗口参数无效');options[args[i]]=args[i+1];}
if(options['--find']!==undefined&&(options['--start']!==undefined||options['--end']!==undefined))throw Error('查位置与读原段分开执行，不隐式选择语境');
if(options['--find']===undefined&&(options['--from']!==undefined||options['--limit']!==undefined))throw Error('检索分页仅用于--find模式，不静默忽略参数');
const recordFile=path.resolve(root,file),raw=JSON.parse(await fs.readFile(recordFile,'utf8')),record=await validateReadRecord(recordFile,{root,sourceId:raw.sourceId,url:raw.canonicalUrl}),text=await fs.readFile(record.textPath,'utf8');
const result=sourceWindows(text,options['--find']!==undefined?{literal:options['--find'],from:Number(options['--from']??0),limit:Number(options['--limit']??40)}:{start:Number(options['--start']),end:Number(options['--end'])});
console.log(JSON.stringify({sourceId:record.sourceId,url:record.canonicalUrl,readDigest:record.textDigest,readRecord:recordFile,...result},null,2));
