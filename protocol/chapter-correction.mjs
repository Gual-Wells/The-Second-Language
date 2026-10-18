import {validateAnnotatedContent,validateTeachingLayout} from '../web/annotations.js';

// Main-protocol repairs may add omitted usages and their examples/article use.
// Existing identities still belong to their original chapter and word.
export function validateChapterCorrection(original,markdown){
 const before=validateAnnotatedContent(original),after=validateTeachingLayout(markdown,'etymology-fused-v1');
 if(JSON.stringify(before.words)!==JSON.stringify(after.words))throw Error('主词身份或顺序不能改变');
 for(const [id,use]of before.uses)if(after.uses.get(id)?.wordId!==use.wordId)throw Error('已有 USE 身份或所属主词不能改变');
 const ids=new Set(after.sentences.map(s=>s.id));
 for(const s of before.sentences)if(!ids.has(s.id))throw Error('已有句子身份不能删除');
 return after;
}
