import {randomUUID} from 'node:crypto';
import {publisherConfig} from './lib/publisher-config.mjs';
const args=Object.fromEntries(process.argv.slice(2).map(v=>{const m=/^--([a-z-]+)=(.*)$/.exec(v);if(!m)throw Error('参数必须为 --name=value');return[m[1],m[2]];}));
if(!args.chapter)throw Error('用法：node scripts/publish-temporary-test.mjs --chapter=YYYY-MM-DD --id=UUID --title=标题');
const {base,token}=await publisherConfig(),headers={authorization:`Bearer ${token}`,'content-type':'application/json'};
const sourceResponse=await fetch(new URL('/api/chapters',base),{headers});
if(!sourceResponse.ok)throw Error('正式章节目录暂不可用');
const chapter=(await sourceResponse.json()).chapters.find(c=>c.id===args.chapter);
if(!chapter)throw Error('只能使用已发布的正式章节');
const response=await fetch(new URL('/api/temporary-tests',base),{method:'POST',headers,body:JSON.stringify({id:args.id||randomUUID(),chapterId:chapter.id,digest:chapter.digest,title:args.title||'章节理解 · 临时测试'})});
const result=await response.json();if(!response.ok)throw Error(result.error||'临时测试申请失败');
console.log(JSON.stringify({...result,url:`https://the-second-language.pages.dev/?temporary=${result.id}`,chapterId:chapter.id,digest:chapter.digest},null,2));
// This queues the teacher. Its completion publishes the final balance snapshot.
