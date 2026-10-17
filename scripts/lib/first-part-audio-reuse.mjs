import {pointAudioKeys,isPointAudioClip} from '../../web/audio-plan.js';
import {hash} from './textbook-sources.mjs';

export async function reuseFirstPartAudioPack({chapterId,baseDigest,targetDigest,markdown,request}){
 const source=await request(`/api/storage/chapters/${chapterId}?digest=${baseDigest}`);
 if(!source.clips?.length)return{clips:0,packs:0,note:'旧版没有可复用的预下载清单；点读关联保持，不生成音频'};
 if(source.chapterId!==chapterId||source.digest!==baseDigest||!Array.isArray(source.packs))throw Error('旧音频清单身份不符');
 const keys=pointAudioKeys(markdown),clips=source.clips.filter(c=>isPointAudioClip(c,keys)),manifest={...source,digest:targetDigest,clips},text=JSON.stringify(manifest),digest=hash(Buffer.from(text)),key=`chapter-audio/${chapterId}/${targetDigest}/${digest}.json`;
 const receipt=await request('/api/storage/objects?key='+encodeURIComponent(key),'PUT',text);if(receipt.digest!==digest)throw Error('新清单存储摘要不符');
 await request('/api/storage/publish-pack','POST',{chapterId,digest:targetDigest,manifestKey:key});
 const saved=await request(`/api/storage/chapters/${chapterId}?digest=${targetDigest}`);if(JSON.stringify(saved)!==text)throw Error('新版音频清单回读不符');
 return{clips:clips.length,packs:source.packs.length,originalPackFilesReused:true,ttsCalls:0};
}
