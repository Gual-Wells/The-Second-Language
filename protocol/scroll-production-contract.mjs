// Data-only authoring contract; executable rendering belongs to the fixed craft.
import {BACKGROUND_REASONING_EFFORT} from './background-codex.mjs';
export const SCROLL_MODEL=Object.freeze({model:'gpt-6.1-sol',reasoningEffort:BACKGROUND_REASONING_EFFORT});
// Completed originals keep their recorded policy; a default upgrade never
// changes their evidence or grants a new attempt at an unknown result.
export const isScrollModel=value=>value?.model===SCROLL_MODEL.model&&['xhigh','ultra'].includes(value.reasoningEffort);
export function canonical(value){if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';if(value&&typeof value==='object')return '{'+Object.keys(value).sort().filter(k=>value[k]!==undefined).map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';return JSON.stringify(value);}
export function contentIdentityContent(record){return {schema:'second-language.scroll-content.v1',workId:record.workId,certificationId:record.certificationId??null,chapterId:record.chapterId,chapterDigest:record.chapterDigest,ownerId:record.ownerId,recipient:record.recipient,passedAt:record.passedAt??null,madeAt:record.madeAt,...(!record.certificationId?{sampleTime:record.sampleTime,issued:false}:{}),copy:record.copy};}
export async function scrollContentSHA(record){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical(contentIdentityContent(record)))))].map(x=>x.toString(16).padStart(2,'0')).join('');}
const s={type:'string'},num={type:'number'},arr={type:'array',items:s,minItems:1,maxItems:60};
const obj=(properties,required=Object.keys(properties))=>({type:'object',properties:Object.fromEntries(Object.entries(properties).map(([k,v])=>[k,('enum'in v||'const'in v)&&!v.type?{type:'string',...v}:v])),required,additionalProperties:false});
const copyProperties={rubric:s,institution:s,artTitle:s,verse:arr,colophon:arr,sealLegends:arr,status:s};
const copy=obj({...copyProperties,translation:obj(copyProperties)});
const block=obj({role:{enum:['rubric','institution','artTitle','verse','colophon','identity','status']},start:{type:'integer',minimum:0},count:{type:'integer',minimum:1,maximum:60},x:num,y:num,width:num,fontSize:num,lineHeight:num,align:{enum:['left','center','right']},color:s});
export const scrollArtSchema=obj({schema:{const:'second-language.scroll-art-plan.v1'},intention:s,sourceLinks:{type:'array',minItems:2,maxItems:8,items:obj({quote:s,meaning:s,contribution:s})},copy,layout:obj({blocks:{type:'array',minItems:5,maxItems:18,items:block},seal:obj({x:num,y:num,width:num,height:num}),safe:obj({x:num,y:num,width:num,height:num}),composition:s}),material:obj({paperId:{enum:['first-v6-lossless','first-v6','project-beginning']},useHistory:s,exposedSide:{enum:['left','right','top','bottom']},wearStrength:{type:'number',minimum:0,maximum:.12},folds:s}),imageRequest:obj({required:{type:'boolean'},role:{enum:['paper']},prompt:s,reason:s})});
export const scrollReviewSchema=obj({approved:{type:'boolean'},notes:s,checks:obj(Object.fromEntries(['source','translation','theme','material','layout','dynamic','engineering'].map(k=>[k,{type:'boolean'}]))),issues:{type:'array',items:s,maxItems:30}});
export function validateArt(plan,chapter){
 if(plan?.schema!=='second-language.scroll-art-plan.v1')throw Error('Unrecognized scroll art plan');
 const p=plan.copy,t=p?.translation;if(!p||!t||p.institution!=='The Second Language')throw Error('Project copy identity missing');
 for(const key of ['rubric','institution','artTitle','status'])if(typeof p[key]!=='string'||!p[key].trim()||typeof t[key]!=='string'||!t[key].trim())throw Error('Missing bilingual '+key);
 for(const key of ['verse','colophon','sealLegends'])if(!Array.isArray(p[key])||!p[key].length||p[key].length!==t[key]?.length||p[key].some(v=>typeof v!=='string'||!v.trim()))throw Error('Incomplete bilingual '+key);
 if(JSON.stringify(p.sealLegends)!==JSON.stringify(['The Second Language','In remembrance']))throw Error('Keep the accepted remembrance die');
 if(!Array.isArray(plan.sourceLinks)||plan.sourceLinks.length<2||plan.sourceLinks.some(v=>!chapter.markdown.includes(v.quote)||v.quote.length<3))throw Error('Art references must quote the fixed chapter');
 const counts={};for(const b of plan.layout.blocks){if(!['left','center','right'].includes(b.align)||![b.x,b.y,b.width,b.fontSize,b.lineHeight].every(Number.isFinite)||b.fontSize<38||b.fontSize>145||b.width<200||b.lineHeight<b.fontSize*.8||!/^#[a-f0-9]{6}$/i.test(b.color))throw Error('Unsafe typesetting block');const lines=b.role==='identity'?Array(4):Array.isArray(p[b.role])?p[b.role]:[p[b.role]];if(!Number.isInteger(b.start)||!Number.isInteger(b.count)||b.start<0||b.start+b.count>lines.length)throw Error('Block range does not match copy');for(let i=b.start;i<b.start+b.count;i++){const k=b.role+':'+i;if(counts[k])throw Error('Duplicate printed line');counts[k]=true;}}
 for(const role of ['rubric','institution','artTitle','verse','colophon','status'])for(let i=0;i<(Array.isArray(p[role])?p[role].length:1);i++)if(!counts[role+':'+i])throw Error('Unprinted '+role);
 for(let i=0;i<4;i++)if(!counts['identity:'+i])throw Error('Unprinted event identity');
 const safe=plan.layout.safe;if(!safe||safe.x<70||safe.y<70||safe.x+safe.width>1978||safe.y+safe.height>2798)throw Error('Writing area leaves safe paper');
 if(!['first-v6-lossless','first-v6','project-beginning'].includes(plan.material.paperId)||plan.material.wearStrength<0||plan.material.wearStrength>.12)throw Error('Unsupported material recipe');
 return plan;
}
