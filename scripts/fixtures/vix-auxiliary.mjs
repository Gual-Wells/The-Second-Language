// Synthetic auxiliary-index transport fixture. No source corpus or real teaching.
import {gitBlobSha} from '../lib/vix-auxiliary.mjs';
export function auxiliaryFixture(words,{label=null}={}){
 const body=value=>Buffer.from(JSON.stringify(value)+'\n'),ranks=words.map((_,i)=>i+1),scope={domainId:'domain_general_english',section:'word'};
 const counts={collections:1,records:words.length,marked:label?words.length:0,unmarked:label?0:words.length,dateFiles:label?1:0};
 const paths={structure:'data/seed-access/structure.json',markHash:'data/seed-access/mark-hash.json',records:'data/seed-access/records-000.json'};
 const collection='fixture-collection',bodies=new Map();
 bodies.set(paths.structure,body({schemaVersion:2,ordinalBase:1,scope,collections:[{id:collection,name:'Fixture',label:'Fixture',count:words.length,priorityGlobalRanks:ranks,displayGlobalRanks:ranks,letters:[]}]}));
 bodies.set(paths.records,body(words.map((w,i)=>[w.entryId,i+1,w.text,collection,i,label?[label]:[]])));
 const {collections,...hashCounts}=counts;
 bodies.set(paths.markHash,body({protocol:'vix-seed-access-mark-hash/1',schemaVersion:1,ordinalBase:1,scope,counts:hashCounts,byGlobalRank:Object.fromEntries(words.map((w,i)=>[i+1,[w.entryId,label?[label]:[]]]))}));
 const dates=[];if(label){const file='data/seed-access/dates/'+label+'.json';bodies.set(file,body({protocol:'vix-seed-access-date/1',schemaVersion:1,date:label,globalRanks:ranks}));dates.push({path:file,date:label,count:words.length,gitBlobSha:gitBlobSha(bodies.get(file))});}
 const manifest={protocol:'vix-seed-access/2',schemaVersion:2,ordinalBase:1,scope:{...scope,records:words.length},binding:{marks:{labelFormat:'YY-MM-DD',externalDateMeaning:true,yearBase:2000}},source:{seedRevision:8,inputs:{meta:{path:'FORBIDDEN-source-trap.json'}}},recordTuple:['entryId','globalRank','text','collectionId','sourceOrder','markDates'],counts,structure:{path:paths.structure,gitBlobSha:gitBlobSha(bodies.get(paths.structure))},markHash:{path:paths.markHash,gitBlobSha:gitBlobSha(bodies.get(paths.markHash))},dates,records:[{path:paths.records,gitBlobSha:gitBlobSha(bodies.get(paths.records)),count:words.length,globalStartRank:1,globalEndRank:words.length}]};
 bodies.set('data/seed-access/manifest.json',body(manifest));return bodies;
}
