import {validateAnnotatedContent,validateTeachingLayout} from '../web/annotations.js';
import {audioUnits} from '../web/audio-plan.js';

export function validateFirstPartUpgrade(original,markdown){
 const before=validateAnnotatedContent(original),after=validateTeachingLayout(markdown,'etymology-fused-v1');
 const boundary=text=>text.search(/^<!-- PART:two -->\s*$/m);
 if(original.slice(boundary(original))!==markdown.slice(boundary(markdown)))throw Error('第二、三部分必须逐字节保留');
 if(JSON.stringify(before.words)!==JSON.stringify(after.words))throw Error('主词身份或顺序不能改变');
 const identities=parsed=>[...parsed.uses].map(([id,v])=>[id,v.wordId]);
 if(JSON.stringify(identities(before))!==JSON.stringify(identities(after)))throw Error('USE 身份、所属主词或顺序不能改变');
 if(JSON.stringify(audioUnits(original))!==JSON.stringify(audioUnits(markdown)))throw Error('声音输入不能改变');
 return after;
}
