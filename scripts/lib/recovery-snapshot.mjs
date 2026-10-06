import {createHash} from 'node:crypto';
import {graphRequest,downloadItem} from './onedrive-local.mjs';
export async function latestRecoverySnapshot(){
 const root=await(await graphRequest('/me/drive/special/approot')).json();
 const item=await(await graphRequest(`/me/drive/items/${encodeURIComponent(root.id)}:/recovery-index.json`)).json();
 const index=await(await downloadItem(item.id)).json();if(index.version!==1||!Array.isArray(index.snapshots))throw Error('恢复索引无效');
 const latest=index.snapshots.at(-1);if(!latest)throw Error('没有独立恢复快照');
 const bytes=Buffer.from(await(await downloadItem(latest.itemId)).arrayBuffer());if(createHash('sha256').update(bytes).digest('hex')!==latest.digest)throw Error('恢复清单摘要不一致');
 return JSON.parse(bytes.toString('utf8'));
}
