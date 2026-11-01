// Explicit, locally authorized re-authoring keeps the original frozen selection
// and VIX receipt. It never turns a new policy into permission to revise history.
import fs from 'node:fs/promises';
import path from 'node:path';
import {validateAuthoringRevision} from '../../protocol/chapter-authoring-revision.mjs';
export {AUTHORING_REVISION_KIND,validateAuthoringRevision} from '../../protocol/chapter-authoring-revision.mjs';
export async function loadAuthoringContract(root,date,selection,{meta}={}){
  if(!meta){try{meta=JSON.parse(await fs.readFile(path.join(root,'chapters',date,'meta.json'),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}}
  if(!meta?.authoringRevision)return {policy:selection.authoringPolicy||'sourced-collection-v1'};
  const revision=meta.authoringRevision;
  // Validate the path shape before resolving it; never follow an arbitrary file.
  if(typeof revision.baselineFile!=='string'||!new RegExp('^work/runs/'+date+'/revisions/[A-Za-z0-9_-]+/baseline\\.json$').test(revision.baselineFile))throw Error('章节重编基线路径无效');
  const realRoot=await fs.realpath(root),file=await fs.realpath(path.join(realRoot,revision.baselineFile)),relative=path.relative(realRoot,file);
  if(relative.startsWith('..')||path.isAbsolute(relative)||process.platform==='win32'&&!/^D:[\\/]/i.test(file))throw Error('章节重编基线须实存本项目D盘');
  return validateAuthoringRevision(revision,{selection,baselineText:await fs.readFile(file,'utf8'),meta,date});
}
