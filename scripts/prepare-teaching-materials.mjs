import path from 'node:path';
import {prepareTeachingMaterials} from './lib/teaching-authoring.mjs';
const [date,...args]=process.argv.slice(2);
if(!/^20\d{2}-\d{2}-\d{2}$/.test(date||'')||new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date)throw Error('用法：node scripts/prepare-teaching-materials.mjs DATE [--scope=候选范围.json] [--additional=补查词.json]');
const options={};for(const arg of args){const m=/^--(scope|additional)=(.+)$/.exec(arg);if(!m)throw Error('未知材料参数');options[m[1]+'File']=path.resolve(m[2]);}
const result=await prepareTeachingMaterials(process.cwd(),date,options);
console.log(JSON.stringify({words:result.packets.length,commit:result.commit,manifest:`work/runs/${date}/teaching/materials.json`,unlocatedTerms:result.packets.filter(p=>p.unlocatedTerms.length).map(p=>({word:p.word,terms:p.unlocatedTerms})),notice:'逐词打开材料包读完整原文。无命中不等于教材不存在：检查父条、拆行词组与交叉引用再判断。候选和去向记录不证明语义正确。'},null,2));
