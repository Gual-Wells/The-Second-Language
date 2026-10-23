#!/usr/bin/env node
// Private, on-demand source reading only. Does not create a chapter or publish anything.
import {repositoryRoot,loadReaderConfig,discoverMaterials,readMaterial,importReadMaterial,listMaterials} from './lib/current-affairs-reader.mjs';

const help = `Usage:
  node scripts/current-affairs.mjs sources
  node scripts/current-affairs.mjs discover YYYY-MM-DD [--source id] [--topic slug] [--offline] [--json]
  node scripts/current-affairs.mjs read YYYY-MM-DD --source id --url https://official/article [--refresh] [--offline]
  node scripts/current-affairs.mjs import YYYY-MM-DD --source id --url https://official/article --file D:\\task\\original.txt --method codex-web|codex-pdf --evidence "actual tool reference" --read-at ISO_TIMESTAMP --scope "actual sections/pages read"
  node scripts/current-affairs.mjs list YYYY-MM-DD

New chapters may resume; existing meta must use sourcePolicy=current-affairs-v1.
Legacy chapters remain archived.
Discovery stores titles/URLs/raw dates, not facts or feed excerpts.
Read saves actual extracted text privately under D: .cache/current-affairs-research.
CLI output is metadata and paths only; use textPath to read the private original.
Import copies actual UTF-8 tool original text; summaries and rewrites are not originals.
Provide the actual tool read time, evidence reference and explicit reading scope.
Evidence references are not machine verified or signed proof of semantic completeness.
Codex must read the original text and judge its limits; metadata never verifies facts.
No automatic selection, VIX marking, model scoring, scheduling or publishing.
`;
try {
  const [command='help',date,...args]=process.argv.slice(2);
  if(command==='help'||command==='--help') {console.log(help);}
  else if(command==='sources') {
    if(date) throw Error('sources accepts no arguments');
    const {config,sources}=await loadReaderConfig();
    console.log(JSON.stringify({feeds:config.feeds.map(f=>({sourceId:f.sourceId,name:sources.get(f.sourceId).name,feedUrl:f.url,defaultEnabled:f.defaultEnabled,format:f.format,rightsMode:f.rights.mode,verifiedAt:f.verification.checkedAt,topics:sources.get(f.sourceId).topics})),notice:'Small verified allowlist; not all 331 sources are scanned.'},null,2));
  } else {
    if(!['discover','read','import','list'].includes(command)) throw Error(help);
    const options={root:repositoryRoot,sourceIds:[]};
    let json=false;
    for(let i=0;i<args.length;i++) {
      const key=args[i];
      if(['--offline','--refresh','--json'].includes(key)) {
        if(key==='--offline') options.offline=true;
        if(key==='--refresh') options.refresh=true;
        if(key==='--json') json=true;
        continue;
      }
      const valueOptions={'--topic':'topic','--url':'url','--file':'textFile','--method':'acquisitionMethod','--evidence':'evidenceRef','--read-at':'readAt','--scope':'readScope'};
      if(key!=='--source' && !valueOptions[key]) throw Error('Unknown argument: '+key);
      const value=args[++i];
      if(!value||value.startsWith('--')) throw Error('Missing value for '+key);
      if(key==='--source') options.sourceIds.push(value);
      else options[valueOptions[key]]=value;
    }
    const importArguments=['textFile','acquisitionMethod','evidenceRef','readAt','readScope'];
    if(command==='discover') {
      if(options.refresh||options.url||importArguments.some(key=>options[key]!==undefined)) throw Error('discover accepts only source/topic/offline/json options');
      const result=await discoverMaterials(date,options);
      console.log(JSON.stringify(json?result:{researchDate:date,file:result.file,items:result.items.length,networkRequests:result.networkRequests,observations:result.observations.map(({sourceId,status,asOf,stale,error})=>({sourceId,status,asOf,stale,error})),notice:'Candidate metadata only. Read selected official originals before understanding or using facts.'},null,2));
      if(result.observations.length && result.observations.every(o=>!o.items.length && ['failed','unavailable-offline'].includes(o.status))) process.exitCode=2;
    } else if(command==='read') {
      if(options.sourceIds.length!==1||!options.url||options.topic||json||importArguments.some(key=>options[key]!==undefined)) throw Error('read requires one --source and --url; optional --refresh/--offline only');
      console.log(JSON.stringify(await readMaterial(date,{...options,sourceId:options.sourceIds[0]}),null,2));
    } else if(command==='import') {
      if(options.sourceIds.length!==1||!options.url||options.topic||options.offline||options.refresh||json||importArguments.some(key=>options[key]===undefined)) throw Error('import requires one --source, --url, --file, --method, --evidence, --read-at and --scope');
      console.log(JSON.stringify(await importReadMaterial(date,{...options,sourceId:options.sourceIds[0]}),null,2));
    } else {
      if(args.length) throw Error('list accepts only a date');
      console.log(JSON.stringify(await listMaterials(date),null,2));
    }
  }
} catch(error) {
  console.error(error.message);
  if(error.observationPath) console.error('Observation: '+error.observationPath);
  process.exitCode=1;
}
