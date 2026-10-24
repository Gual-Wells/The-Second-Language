// Offline editorial decisions, separate from the two frozen experimental drafts.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const read=async name=>JSON.parse(await fs.readFile(path.join(here,`variants/${name}.json`),'utf8'));
const light=[...await read('light-first'),...await read('light-second')];
const compact=[...await read('compact-first'),...await read('compact-second')];
const keptLight={
  A05:'Keep nutrition/process explanation rather than compressing it into a dense set of terms.',
  A11:'Keep museum attribution, observed detail and space for forty target uses.',
  A14:'Keep qualified claims and the experience of reading the literary passage.',
  A17:'Keep constitutional reasoning and procedural scaffolding; clarify an inherited baseline ambiguity separately.',
  A21:'Keep the fermentation process and sensory explanation rather than a short list of target terms.',
  A31:'Keep the literary sequence and pacing, not only the plot outcome.',
  A38:'Keep medical conditions and explanatory steps explicit.',
  A39:'Keep the heritage/conservation explanation and its relationship to the physical object.'
};
const selected=compact.map(a=>structuredClone(keptLight[a.id]?light.find(b=>b.id===a.id):a));
const repairs=[];
let serial=0;
function replace(articleId,id,replacements,reason,type='compression-repair'){
  const a=selected.find(a=>a.id===articleId);
  for(const p of a.paragraphs){const i=p.findIndex(s=>s.id===id);if(i<0)continue;
    const before=structuredClone(p[i]);
    const after=replacements.map(s=>({id:`R${articleId.slice(1)}${String(++serial).padStart(3,'0')}`,...s}));
    p.splice(i,1,...after);repairs.push({articleId,type,reason,before,after});return;
  }
  throw Error(`Missing repair anchor ${articleId}/${id}`);
}
function edit(a,id,text,translation,uses,reason,type){replace(a,id,[{text,translation,uses}],reason,type);}
edit('A01','CFA01006',
  "To be precise, NASA gives the change in the pair's orbital speed as about 11.7 microns per second, an approximation with a stated precision.",
  '准确地说，NASA给出的双小行星系统公转速度变化约为每秒11.7微米，这是注明了精度的近似数值。',
  ['U04005','U00607','U04011'],'Restore the measured object and quantity.');
replace('A01','CFA01010',[
  {text:"The impact did not reverse the asteroids' direction.",translation:'这次撞击并未逆转小行星的运动方向。',uses:['U04301']},
  {text:'NASA states that the system was not on an Earth-impact trajectory and that DART could not put it on one.',translation:'NASA说明，该系统原本不处于撞向地球的轨道上，DART也不可能使它进入这样的轨道。',uses:[]}
],'Separate the direction observation from NASA\'s actual Earth-impact statement.');
edit('A03','CFA03004',
  'A short route helps little if its connection leaves too early; a coherent network coordinates these parts.',
  '如果接驳车过早离站，一条短线路也帮不上多少忙；协调一致的交通网络会统筹这些环节。',
  ['U00901'],'Make network coherence refer to coordinated parts, not the failed connection.');
edit('A03','CFA03007',
  'Adding trips, extending routes or creating connections are forms of adaptation through which the authority can adapt the network.',
  '增加班次、延长线路或建立接驳联系，都是交通部门可以用来调整网络的适应性改变。',
  ['U00102','U00109'],'Retain verb and process noun in a less circular construction.','readability-refinement');
replace('A04','CFA04004',[
  {text:'Preserving a familiar language and learning another need not be mutually exclusive goals.',translation:'保留熟悉的语言与学习另一种语言，不必成为互相排斥的目标。',uses:['U03607']},
  {text:'The two languages can be mutually supportive when concepts transfer between them.',translation:'当概念能够在两种语言之间迁移时，它们可以相互支持。',uses:['U03606']}
],'Make goals, rather than languages themselves, mutually exclusive.');
replace('A06','CFA06005',[
  {text:'An imprecisely described sample can make a precisely calculated percentage misleading.',translation:'如果样本描述得不准确，即使百分比算得精确，也可能产生误导。',uses:['U04014','U04007']},
  {text:'This imprecision concerns representation, so broader coverage is an enhancement of knowledge, not proof that disease newly appeared.',translation:'这种不准确涉及样本的代表性，因此覆盖范围扩大意味着认识得到增进，并不证明疾病刚刚出现。',uses:['U04015','U02102']}
],'Retain sample limitations while giving the inference its own sentence.');
replace('A06','CFA06006',[
  {text:'To isolate a potentially infectious patient is to separate that person from others to limit spread along a relevant route.',translation:'隔离可能具有传染性的患者，是将其与他人分开，以限制经相关途径发生的传播。',uses:['U03105']},
  {text:'An isolation ward serves that purpose; someone there can still feel isolated and need support against isolation.',translation:'隔离病房服务于这一目的；身在其中的人仍可能感到孤立，需要支持来缓解孤独。',uses:['U03116','U03110','U03113']}
],'Restore separation, purpose and conditional route instead of promising reduced spread.');
replace('A06','S0206',[],'Remove a duplicate One Health introduction; the following integrated explanation retains it.','redundancy');
edit('A07','CFA07004',
  'A tangible sculpture and an intangible experience can form one work: its tangibility permits direct examination, while the encounter may survive in memory.',
  '一件可触的雕塑与一次无形的体验可以共同构成作品：它的有形性使直接观察成为可能，而相遇的体验可能留在记忆中。',
  ['U04701','U04706','U04704'],'Retain the possibility rather than guarantee of a remembered encounter.');
edit('A08','S0267',
  'Such a painting can be uncompromisingly modern in form while leaving the human meaning of modernity open.',
  '这样的画作可以在形式上毫不妥协地现代，同时让现代性对人的意义保持开放。',
  ['U01110'],'Replace a weakened singular antecedent with an explicit object.');
edit('A09','CFA09005',
  'A dyer preserves fine light details in darker areas with considerable discrimination, so the textile design records a sequence of skilled actions.',
  '染匠凭借细致的辨别力，在深色区域内保留精细的浅色细节，因此纺织图案记录了一连串熟练的操作。',
  ['U01813','U04804'],'Give the judgement to the dyer rather than to wax lines.');
edit('A10','CFA10005',
  'A population is evolvable partly because its members differ in their genetic inheritance.',
  '种群能够演化，部分原因在于成员所继承的遗传特征有所不同。',
  ['U02806','U02306'],'Preserve inherited characteristics, not the process of transmission; the prior Through repair was rejected by final semantic review.');
edit('A10','S0342',
  'Later inheritors of this scientific tradition receive both powerful explanations and questions about the world in which those explanations were made.',
  '这一科学传统的后继者，既承接有力的解释，也承接关于这些解释形成于何种世界的问题。',
  ['U02809'],'Name the tradition after the prior antecedent was removed.');
edit('A12','CFA12004',
  'Coherent beams maintain phase relationships over a useful interval; this coherence lets suitable waves combine coherently into stable interference patterns.',
  '相干光束在有用的时间间隔内保持相位关系；这种相干性使合适的光波能相干叠加，形成稳定的干涉图样。',
  ['U00904','U00918','U00910'],'Restore the limited interval rather than imply perpetual phase stability.');
replace('A16','CFA16006',[
  {text:'In the 1840s, the Corn Laws restricted grain imports; harvest failure and the Irish famine brought their consequences into urgent focus.',translation:'19世纪40年代，《谷物法》限制谷物进口；歉收与爱尔兰饥荒使其后果成为迫切问题。',uses:[]},
  {text:'Peel sought repeal despite landowner resistance and division within his party.',translation:'尽管地主反对、党内存在分歧，皮尔仍寻求废除这些法律。',uses:[]}
],'Separate historical pressure from an asserted single psychological cause.');
edit('A16','CFA16007',
  'Changing the Corn Laws was a policy shift; Peel had to shift his position on grain imports.',
  '改变《谷物法》是一次政策转变；皮尔必须改变自己在谷物进口问题上的立场。',
  ['U04503','U04502'],'Use the documented policy change without inventing a change in political loyalty.');
edit('A17','S0551',
  "The 1954 opinion restored the cases to the Court's docket for further argument about the form of the decrees.",
  '1954年判决将案件恢复到最高法院案卷，以继续论辩救济命令的形式。',
  [],'Clarify restored Supreme Court docket, distinct from the later remand; verified in the frozen National Archives opinion.','inherited-baseline-clarification');
edit('A19','CFA19008',
  'Water conservation begins with choosing suited plants, helping gardeners conserve water rather than imitate another climate.',
  '节水始于选择适地植物，帮助园艺者节约水资源，而不是仿造另一种气候。',
  ['U01209','U01201'],'Give prudent resource use to gardeners, not plant physiology.');
edit('A20','CFA20003',
  "The recipe's published yield is approximately four half-pint jars of finished preserves, not that volume of fresh berries.",
  '该配方公布的成品产量约为四个半品脱罐，指制成的糖渍果品，而非同体积的新鲜草莓。',
  ['U00605'],'Restore the recipe antecedent after the intervening pot description.');
edit('A20','CFA20004',
  "The Center warns that non-sugar substitutes can alter preservation requirements: a flavour enhancer cannot reproduce sugar's other functions.",
  '该中心提醒，非糖替代物可能改变保藏要求：增味剂不能重现糖的其他功能。',
  ['U02103'],'Retain the qualified effect of substitutes.');
edit('A22','CFA22001',
  'Lifting the dampers lets the pianist sustain a note; this sustain can overlap tones or connect notes across hand movements.',
  '抬起制音器使钢琴家能够延续音符；这种延音可以使乐音重叠，或在手的移动过程中把音符连接起来。',
  ['U04610','U04611'],'Translate tones and hand movements without changing them to timbre or hand switching.','translation-repair');
replace('A22','CFA22006',[
  {text:'Students may eagerly anticipate the day they master a phrase.',translation:'学生可能热切期待自己掌握一个乐句的那一天。',uses:['U00504']},
  {text:'Anticipatory listening and anticipative attention prepare the next movement before its sound arrives.',translation:'预期性的聆听与前瞻性的注意，使下一个动作在声音到来前就得到准备。',uses:['U00512','U00510']}
],'Restore eager expectation, distinct from prediction, and keep the motor preparation separate.');
edit('A23','CFA23002',
  'During slipping, friction tends to reduce relative speed; repeated friction can wear surfaces and cause frictional heating as energy dissipates.',
  '在滑动期间，摩擦倾向于降低相对速度；反复摩擦可能磨损表面，并在能量耗散时产生摩擦热。',
  ['U02503','U02502','U02506'],'Restore tendencies and possible wear rather than unconditional outcomes.');
replace('A23','S0695',[],'Remove repeated heating explanation already retained in the repaired sentence.','redundancy');
edit('A23','CFA23008',
  'The driver need not reverse the engine: reverse gear redirects its output so selecting reverse lets the vehicle reverse.',
  '驾驶者无须使发动机反转：倒车齿轮改变其输出方向，因此挂入倒挡便能让车辆倒车。',
  ['U04307','U04310','U04309','U04306'],'Restore the transitive use reverse the engine, not a different intransitive construction.');
replace('A24','CFA24001',[
  {text:"The James Webb Space Telescope's sunshield was folded for launch and fully deployed on 4 January 2022.",translation:'詹姆斯·韦布空间望远镜的遮阳板在发射时折叠，于2022年1月4日完成展开。',uses:[]},
  {text:'Under remote control, supports extended, instruments moved farther from the shield, and five membranes were tensioned into a heat barrier.',translation:'在遥控下，支撑结构伸出，仪器移到离遮阳板更远的位置，五层薄膜被张紧，形成隔热屏障。',uses:[]}
],'State completion on the date and physical separation distance without implying disconnection.');
replace('A24','CFA24003',[
  {text:'As the universe expands, the wavelengths of travelling light can stretch, producing a red shift, even from visible light into infrared.',translation:'随着宇宙膨胀，传播中的光的波长可能拉长，产生红移，甚至从可见光移入红外范围。',uses:['U04544']},
  {text:'This does not require objects to look red.',translation:'这并不要求物体看起来是红色的。',uses:[]}
],'Identify the wavelength that stretches and retain the colour misconception separately.');
edit('A24','CFA24004',
  'Travel time lets distant observations reveal galaxies at earlier stages, while infrared instruments widen the accessible history.',
  '光的传播时间使遥远的观测能呈现星系较早阶段的样貌，而红外仪器拓宽了可以探查的历史范围。',
  [],'Specify earlier stages rather than ambiguously earlier galaxies.');
edit('A25','CFA25001',
  "Utah courts explain that a conservator's appointment order and letters specify limited or full authority over another person's financial affairs.",
  '犹他州法院说明，财产监护人的任命命令与证明文书，会明确其对他人财产事务拥有有限还是全面的权限。',
  ['U01214'],'Keep financial/property scope distinct from authority over all personal affairs.');
edit('A28','CSA28004',
  'Retained urine can allow bacteria to multiply and burden the bladder and urinary system; repeated infections can become a persistent problem.',
  '潴留的尿液可能让细菌繁殖，并加重膀胱和泌尿系统的负担；反复感染可能成为一再出现的问题。',
  ['U03807'],'Make the repeated/persistent problem idiomatic in Chinese.','translation-repair');
edit('A29','CSA29004',
  'The aim is to restore chewing and appearance; restoration requires surfaces and supports that accommodate forces within a moving mouth.',
  '目标是恢复咀嚼功能与外观；咀嚼功能与外观的恢复，需要表面与支撑结构适应活动口腔内的作用力。',
  ['U04102','U04112'],'Avoid calling appearance a function.');
edit('A33','CSA33003',
  'A reversible process can be undone so that both the system and its surroundings return to their initial states; reversibility requires that complete return.',
  '可逆过程能够被逆转，使系统及其周围环境都恢复初始状态；可逆性要求的是这种完整的恢复。',
  ['U04324','U04326'],'Define the ability to undo a process, not return during the forward process.');
edit('A33','CSA33004',
  'If the change is carried out reversibly, reversing it restores the system without leaving a net alteration in its surroundings.',
  '如果变化以可逆方式进行，将它逆转就能恢复系统，而不在周围环境留下净改变。',
  ['U04327'],'Make reversal explicit before asserting no net change in surroundings.');
edit('A37','CSA37005',
  'Two-way communication connected floor reporters with a director in the booth, letting a network transmit interviews as the director coordinated coverage.',
  '双向通信将会场记者与控制间导播连接起来，使电视网能在导播协调报道时播送采访。',
  ['U04902'],'Use the television production role, not a film director.','translation-repair');
edit('A43','CSA43003',
  'Teeth found in Sussex in 1822 resembled iguana teeth but were much larger, while scattered bones left their arrangement uncertain.',
  '1822年在萨塞克斯发现的牙齿形似鬣蜥牙齿，却大得多，而零散骨骼的排列仍不确定。',
  [],'Make the comparison express the actual larger fossil teeth.');
edit('A51','CSA51004',
  "Secondary eyewall formation can affect a strong hurricane's intensity, so these changing observations offered material for further work, including research on electrification.",
  '第二道眼墙的形成可能影响强飓风的强度，因此这些变化中的观测为后续研究提供了材料，包括对带电过程的研究。',
  [],'Translate the atmospheric electrification process accurately.','translation-repair');
await fs.writeFile(path.join(here,'variants/selected.json'),JSON.stringify(selected,null,2)+'\n');
await fs.writeFile(path.join(here,'reviews/selection-decisions.json'),JSON.stringify({
  status:'Editorial provenance; final peer review is recorded separately in selected-first.md and selected-second.md.',
  selection:selected.map(a=>({id:a.id,variant:keptLight[a.id]?'light':'compact',reason:keptLight[a.id]||'Compact preserves the useful explanation after the explicit repairs recorded here.'})),
  repairs
},null,2)+'\n');
console.log(JSON.stringify({articles:selected.length,light:Object.keys(keptLight).length,compact:selected.length-Object.keys(keptLight).length,repairs:repairs.length}));
