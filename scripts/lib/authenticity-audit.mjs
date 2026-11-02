import fs from 'node:fs/promises';
import path from 'node:path';
import {assembleUsageContextCollection} from './usage-context-authoring.mjs';
import {authenticCoverage} from '../../protocol/authentic-context-coverage.mjs';
import {validateReadRecord} from './current-affairs-reader.mjs';
export async function auditAuthenticity(root,words,{strictWitnesses=false}={}){
  const originals=new Map();
  for(const word of words)for(const c of word.contexts||[])for(const e of c.sourceEvidence||[]){
    if(originals.has(e.url))continue;
    const file=path.resolve(root,e.readRecord),raw=JSON.parse(await fs.readFile(file,'utf8'));
    const record=await validateReadRecord(file,{root,sourceId:raw.sourceId,url:e.url});
    originals.set(e.url,{url:e.url,text:await fs.readFile(record.textPath,'utf8')});
  }
  const {parsed}=assembleUsageContextCollection(words,{expectedWordCount:words.length});
  return authenticCoverage({parsed,words,originals:[...originals.values()],strictWitnesses});
}
