// Compile and retain the actual external-search request. This module performs
// no searches, model calls, source acquisition, selection or publication.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const digest=x=>createHash('sha256').update(x).digest('hex');
export function compileDiscoveryRequest({queries,responseLength='long'}) {
  if(!Array.isArray(queries)||queries.length<1||queries.length>4)throw Error('Provide 1–4 actual query objects');
  if(!['short','medium','long'].includes(responseLength))throw Error('Invalid response length');
  const search_query=queries.map(({q,domains})=>{
    if(typeof q!=='string'||!q.trim())throw Error('A nonempty actual q is required');
    // A logged description is not necessarily the real request. For NEW
    // requests, catch this easy typo before it reaches the search tool.
    if(/\bsite\.[a-z0-9]/i.test(q))throw Error('Use site:domain or the explicit domains field; site.domain is not a site operator');
    if(/\bsite:\s+/i.test(q))throw Error('Do not put whitespace after site:');
    const request={q};
    if(domains!==undefined){
      if(!Array.isArray(domains)||!domains.length||domains.some(d=>typeof d!=='string'||!/(?=.{2,253}$)^[a-z0-9]+(?:[.-][a-z0-9]+)*$/i.test(d)))throw Error('domains must contain bare domain filters, without schemes, paths or whitespace');
      request.domains=[...new Set(domains)];
    }
    return request;
  });
  return {search_query,response_length:queries.length===4&&responseLength==='short'?'medium':responseLength};
}
export async function saveDiscoveryObservation(directory,{actualRequest,actualResult,requestedAt,receivedAt,scope}) {
  if(typeof scope!=='string'||!scope.trim())throw Error('An explicit search scope is required');
  for(const value of [requestedAt,receivedAt])if(!Number.isFinite(Date.parse(value)))throw Error('Actual timestamps are required');
  if(Date.parse(receivedAt)<Date.parse(requestedAt))throw Error('Result time precedes request');
  const normalized=compileDiscoveryRequest({queries:actualRequest?.search_query,responseLength:actualRequest?.response_length});
  if(JSON.stringify(normalized)!==JSON.stringify(actualRequest))throw Error('Record the exact compiled request without extra or silently normalized fields');
  if(actualResult===undefined)throw Error('The actual returned result is required, including failures');
  directory=path.resolve(directory);
  if(process.platform==='win32'&&!/^D:\\/i.test(directory))throw Error('Discovery observations must reside on D:');
  await fs.mkdir(directory,{recursive:true});
  if(process.platform==='win32'&&!/^D:\\/i.test(await fs.realpath(directory)))throw Error('Discovery observations physically resolve outside D:');
  const raw=JSON.stringify(actualResult),record={schemaVersion:1,kind:'external-search-observation',requestedAt,receivedAt,scope,actualRequest,resultSha256:digest(raw),actualResult,notice:'Search output is a discovery lead, not an original read, permission or semantic acceptance.'};
  const filename=path.join(directory,requestedAt.replace(/[:.]/g,'-')+'-'+record.resultSha256.slice(0,12)+'.json');
  await fs.writeFile(filename,JSON.stringify(record,null,2)+'\n',{flag:'wx'});
  return filename;
}
