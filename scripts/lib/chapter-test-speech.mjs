import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {chapterAnswerSchema,validateChapterInterpretations} from '../../protocol/chapter-test-contract.mjs';
import {chapterAnswerPrompt} from '../../protocol/chapter-test-prompt.mjs';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function cached(file,produce){try{return JSON.parse(await readFile(file,'utf8'));}catch{}const value=await produce();await writeFile(file,JSON.stringify(value,null,2));return value;}
async function convert(file,output,root){const ffmpeg=process.env.SECOND_LANGUAGE_FFMPEG||path.join(root,'.cache/tools/ffmpeg.exe'),r=spawnSync(ffmpeg,['-y','-v','error','-i',file,'-vn','-acodec','pcm_s16le','-ar','16000','-ac','1',output],{windowsHide:true,encoding:'utf8'});if(r.error)throw Error('本机音频转换工具暂不可用');if(r.status!==0)throw Object.assign(Error('原声解码未完成；原文件已保留'),{decodeError:true});return readFile(output);}
export async function prepareChapterQuestionAudio({job,paper,directory,root,call,asset,runModel}){
 const checks=[];for(const q of paper.items.filter(q=>q.type==='oral')){
  const dir=path.join(directory,'audio',q.id);await mkdir(dir,{recursive:true});
  const clip=await call('/api/practice/pronunciation',{text:q.prompt,kind:'sentence'});let status=clip;
  for(let i=0;status.state==='calling'&&i<60;i++){await sleep(5000);status=await call('/api/practice/pronunciation/'+clip.id,null,'GET');}
  if(status.state!=='ready')throw Error(`题目 ${q.id} 音频状态 ${status.state}；保留原请求，不重复收费生成`);
  const check=await cached(path.join(dir,'check-'+clip.id+'.json'),async()=>{const original=path.join(dir,'question.mp3'),wav=path.join(dir,'question.wav');await writeFile(original,await asset('/api/practice/pronunciation/'+clip.id+'/audio'));const bytes=await convert(original,wav,root);return call(`/api/chapter-tests/jobs/${job.id}/check-question`,{claim:job.claim,id:q.id,text:q.prompt,audioId:clip.id,wav:bytes.toString('base64')});});
  q.audioId=clip.id;q.audioCheckDigest=check.evidenceDigest;checks.push({id:q.id,prompt:q.prompt,transcript:check.transcript});await writeFile(path.join(directory,'paper.audio.json'),JSON.stringify(paper,null,2));
 }
 if(!checks.length)return paper;
 const schema={type:'object',properties:{checks:{type:'array',items:{type:'object',properties:{id:{type:'string'},ok:{type:'boolean'},reason:{type:'string'}},required:['id','ok','reason'],additionalProperties:false}}},required:['checks'],additionalProperties:false};
 const fingerprint=createHash('sha256').update('audio-context-audit-v2:'+JSON.stringify(checks)).digest('hex');const audit=await cached(path.join(directory,'audio-audit-'+fingerprint+'.json'),()=>runModel(schema,'你核对章节题目合成音频的转写是否保留了原题完整语义和提问。尤其核对否定、人物、目标词、数值、关键关系和问题末尾。这不是字面转写一致性检查。允许标点、大小写、英美拼写、正常分词和声音相同的所有格写法差异（例如 residents’ 与 resident’s 在该位置声音相同，不能靠转写的撇号位置判断合成读错）。ASR 有时把同音/近同音词选成错误拼写，例如美式英语中的 tidal/title；若完整语境明确指向原题义项，音频提供的任务事实与提问仍完整，不能仅凭一个转写拼写差异判音频失败。不要自动修正真的缺失的否定、人名、数量、必要条件或问题结尾；这些导致语义不同才 ok=false。无法确认时说明限制，不能假装音素已经验证。此检查基于ASR，不声称验证了实际声音的音素质量。每个 id 一个检查，只输出schema JSON。资料：'+JSON.stringify(checks),'audio-audit'));
 if(audit.checks?.length!==checks.length||checks.some(q=>audit.checks.filter(x=>x.id===q.id&&x.ok===true&&x.reason?.trim()).length!==1))throw Error('题目音频存在疑义；保留已生成资产，需核对后发布');paper.audioAudit=audit;return paper;
}
export async function interpretChapterAnswers({job,directory,root,call,asset,runModel}){
 const evidence=[];for(const q of job.questions){
  const previous=job.previous?.items.find(x=>x.id===q.id&&x.state==='resolved');if(previous)continue;
  const dir=path.join(directory,q.recordingId);await mkdir(dir,{recursive:true});
  const taken=await cached(path.join(dir,'whisper.json'),async()=>{const original=path.join(dir,'original.audio'),wav=path.join(dir,'analysis.wav');await writeFile(original,await asset(`/api/chapter-tests/${job.id}/answers/${q.id}/${q.recordingId}`));try{const bytes=await convert(original,wav,root);return await call(`/api/chapter-tests/jobs/${job.id}/transcribe/${q.recordingId}`,{claim:job.claim,wav:bytes.toString('base64')});}catch(e){if(e.decodeError||e.status===422||e.status===409)return{transcript:'',unavailable:e.message};throw e;}});
  evidence.push({id:q.id,recordingId:q.recordingId,whisper:taken});
 }
 const inputs={...job,claim:undefined,evidence},partialPaper={items:job.questions.map(x=>({...x,type:'oral'}))};
 let value=await cached(path.join(directory,'interpretation.initial.json'),()=>runModel(chapterAnswerSchema,chapterAnswerPrompt(inputs),'interpretation-initial'));value={items:validateChapterInterpretations(partialPaper,value)};
 const unclear=value.items.filter(x=>x.state==='uncertain');let supplement=false;
 for(const q of job.questions.filter(q=>unclear.some(x=>x.id===q.id))){if(evidence.find(x=>x.id===q.id)?.whisper.silence)continue;const record=await cached(path.join(directory,q.recordingId,'qwen.json'),()=>call(`/api/chapter-tests/jobs/${job.id}/supplement/${q.recordingId}`,{claim:job.claim}));if(record.parsed?.transcript){evidence.find(x=>x.id===q.id).qwen=record;supplement=true;}}
 if(supplement){const retry={...inputs,evidence,previous:{items:value.items.filter(x=>x.state==='resolved')}};const final=await cached(path.join(directory,'interpretation.final.json'),()=>runModel(chapterAnswerSchema,chapterAnswerPrompt(retry),'interpretation-final'));value={items:validateChapterInterpretations(partialPaper,final)};}
 return value;
}
