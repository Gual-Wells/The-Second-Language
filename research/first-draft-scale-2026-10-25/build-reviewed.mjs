// Local semantic/factual corrections; preserve the direct first-draft snapshot.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const here=path.dirname(fileURLToPath(import.meta.url));
const original=await fs.readFile(path.join(here,'calibrated/first-draft.json'),'utf8');
assert.equal(createHash('sha256').update(original).digest('hex'),'bdd430e311a193e4e9125cf026c582a713f4aafa0c491becfd0da5947dbf43dd');
const articles=JSON.parse(original),changes=[];
function repair(id,text,translation,reason){
  const s=articles.flatMap(a=>a.paragraphs.flat()).find(s=>s.id===id);assert.ok(s,id);
  const before=structuredClone(s);Object.assign(s,{id:id.replace('FC','FCR'),text,translation});
  changes.push({reason,before,after:structuredClone(s)});
}
repair('FC021',
  'The purchase reverses their positions as petitioner and decision-maker: Lopakhin once asked the owners to act, but now Anya asks him to stop the axes until her mother leaves.',
  '这次购买对调了请求者与决策者的位置：洛帕欣曾请求旧主人采取行动，现在则是安雅请求他暂停砍树，直到母亲离开。',
  'Make the two exchanged functions explicit; do not imply the former owner became a servant.');
repair('FC025',
  "The prospect of exploitation gives him a way to pay his debts; the family's departure, however, catches him by surprise.",
  '开发的前景给了他偿还债务的办法；然而，这家人即将离开的消息却让他十分意外。',
  'Avoid combining breathlessness, thanks and noticing luggage into a falsely precise sequence.');
repair('FC030',
  "The train's departure approaches, and Varya and Lopakhin are finally left alone, but their talk moves between luggage, future work and the weather.",
  '火车发车的时间越来越近，瓦丽娅和洛帕欣终于有了独处的机会，谈话却在行李、今后的工作和天气之间游移。',
  'Reflect the actual topics and remove the added exclusive Chinese only.');
await fs.writeFile(path.join(here,'calibrated/reviewed.json'),JSON.stringify(articles,null,2)+'\n');
await fs.writeFile(path.join(here,'calibrated/local-corrections.json'),JSON.stringify({originalDigest:'bdd430e311a193e4e9125cf026c582a713f4aafa0c491becfd0da5947dbf43dd',scope:'Three local corrections after ordinary review; not a second shortened whole draft.',changes},null,2)+'\n');
console.log('Three local corrections recorded; direct draft preserved.');
