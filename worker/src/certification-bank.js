// Original, reviewed functional-test questions grounded in chapter 2026-10-09.
// Answers are served only after immutable submission. This is not an IELTS paper.
const one=(id,target,prompt,options,explanation)=>({id,target,type:'single',prompt,options:options.map((text,i)=>({id:`${id}-${i}`,text})),correct:[`${id}-0`],explanation});
const many=(id,target,prompt,options,indices,explanation)=>({id,target,type:'multi',prompt,options:options.map((text,i)=>({id:`${id}-${i}`,text})),correct:indices.map(i=>`${id}-${i}`),explanation});
const gap=(id,target,prompt,correct,explanation)=>({id,target,type:'gap',prompt,correct,explanation});
export const bank=[
one('a1','amphibian','The rescue team ordered an amphibian that could land on the river and later take off from a runway.\n这里 amphibian 指什么？',['可水陆起降的飞机','一只被救助的两栖动物','只在海上航行的船','潜水救援队员'],'land、take off 和 runway 限定为水陆两用飞机，不是动物义。'),
one('a2','amphibian','A frog is an amphibian. The museum also displays an amphibian used by pilots.\n两处 amphibian 的关系是什么？',['同一词形在这里分别指动物与水陆两用飞机','第二处仍然指动物，因为词性相同','第二句一定在使用比喻，不能指飞机','两处都只表示“水中的”'],'相同名词词形不等于相同义项；pilots 与 displays 支持飞机义。'),
one('aq1','aquatic','The centre offers aquatic sports, but its garden contains aquatic plants.\n哪种解释同时符合两处 aquatic？',['前者是水上／水中运动，后者是在水中或水边生活的植物','前后都表示只能在海水中生活','前后都表示陆生植物','前者是危险运动，后者是侵入性植物'],'aquatic 的范围不限于海水；修饰 sports 与 plants 时所指关系不同。'),
gap('aq2','aquatic','用 aquatic 的正确形式填一个词：\nThe lesson takes place entirely in a swimming pool, so it is an ______ activity.',['aquatic'],'an aquatic activity 指水中活动；不要求也不暗示“咸水”。'),
one('c1','canopy','The pilot could see the forest canopy through the aircraft canopy.\n哪一种转述准确？',['飞行员透过驾驶舱舱盖看到了森林树冠层','飞行员透过降落伞看到了床罩','两处 canopy 都是森林树冠层','驾驶舱被森林枝叶直接遮住了'],'forest canopy 与 aircraft canopy 分别限定两个本章真实义项。'),
many('c2','canopy','选出 canopy 在以下具体场景中的两种准确理解。',['A canopy above the bed：床上方的罩篷','The forest canopy：整座森林的地下根系','The aircraft canopy：驾驶舱透明舱盖','A parachute canopy：降落伞的背带'],[0,2],'床罩和透明舱盖正确；树冠层不是根系，降落伞 canopy 是伞衣而非背带。'),
one('co1','compost','We compost the peelings, then add the compost to the soil.\n前后两处 compost 有什么不同？',['前者是把废料制成堆肥的动词，后者是堆肥名词','前者是盆栽土名词，后者是施肥动词','两处都是表示“把废料扔掉”的动词','两处都只表示人工化学肥料'],'句法上 compost the peelings 为动词，the compost 为名词；意思也不是单纯丢弃。'),
gap('co2','compost','在 compost / composting 中选一个，使句意与结构合适：\nBy ______ the leaves instead of burning them, the gardeners produce material that improves the soil.',['composting'],'介词 by 后需要动名词；把叶片制成堆肥才与后面的用途一致。'),
one('cs1','consultation','After consultation of the archive, she arranged a consultation with a lawyer.\n两处 consultation 应如何理解？',['前者查阅资料，后者向律师咨询','前者会诊，后者查阅资料','两处都指所有居民共同投票','两处都表示已经作出了最终决定'],'consultation of the archive 与 with a lawyer 给出不同关系；咨询本身不等于作出决定。'),
many('cs2','consultation','哪些句子中的 consultation 不能直接理解为“公开协商”？选两项。',['The surgeon charged for a private consultation.','The council opened public consultation on the bridge.','Consultation of the records revealed an earlier agreement.','The community was invited to a consultation meeting.'],[0,2],'外科医生的私人会诊，以及查阅记录，均不是本句的公开协商义。'),
one('d1','deteriorate','The report says conditions deteriorated after the repair.\n这句话实际断言了什么？',['修理之后状况变差了，但没有单凭 after 证明修理是原因','修理改善了状况','修理之前状况已经变好','修理一定是状况恶化的唯一原因'],'deteriorated 表示恶化；after 是时间关系，不能擅自增强为唯一因果。'),
gap('d2','deteriorate','用 deteriorate 或 deterioration 填空：\nThe inspection documented a gradual ______ in water quality, rather than a sudden improvement.',['deterioration'],'a gradual 后在此需要名词；意思为水质逐渐恶化，与 improvement 对照。'),
one('dn1','downstream','Pollution was detected downstream of the outlet.\n以下哪一说法可从句子本身推出？',['污染出现在沿水流越过排口之后的位置','污染一定在排口以北','污染一定在入海口','污染与排口一定没有关系'],'downstream 以水流方向为参照，既不等于北／南，也不保证就是河口。'),
one('dn2','downstream','They moved the sampling station upstream to avoid water that had already passed the factory.\n这里为什么选择 upstream？',['希望在水流到达工厂之前取样','希望在地图更低的位置取样','希望在盐度更高的海水中取样','upstream 本身表示干净，任何位置都一样'],'upstream 提供相对水流位置；句子表达目的，不保证新地点绝无其他污染。'),
one('e1','estuary','A channel widens where river water meets the sea and tides affect the water level.\n哪个词最准确概括本章对应的地形？',['estuary','meadow','thicket','dune'],'河流入海、开阔并受潮汐影响的河口湾，对应 estuary；不是任意淡水湖。'),
many('e2','estuary','哪些信息直接支持把一处水域描述为 estuary？选两项。',['它位于河流进入海洋的区域','它受潮汐影响','它一定完全没有盐','它只指任何人工储水池'],[0,1],'入海与潮汐支持河口湾；不能强加“完全无盐”或人工池的定义。'),
one('i1','invasive','The questions were invasive, although the interview involved no medical procedure.\n这里 invasive 最接近什么？',['问题侵犯了个人隐私或私人领域','问题需要把器械导入身体','问题传播了一种外来植物','问题一定由外来者提出'],'questions 的上下文支持隐私侵扰义；不能仅因为词形相同选择医学或生物义。'),
many('i2','invasive','选出 invasive 在句中使用正确的两项。',['A rapidly spreading weed was described as invasive.','An invasive test introduced an instrument into the body.','Every species from another country is necessarily invasive.','A non-invasive scan necessarily gives no useful information.'],[0,1],'侵入扩散与医疗器械进入体内均是本章义项；外来不必然侵入，非侵入也不等于无效。'),
one('l1','lagoon','The engineers built a lagoon to hold stormwater temporarily.\n此句 lagoon 表示什么？',['人工暴雨蓄水池','任何一处河口湾','围住全部海洋的珊瑚礁','只能含咸水的天然海岸泻湖'],'built、engineers 和 hold stormwater 限定工程义；不能强加天然咸水地形。'),
one('l2','lagoon','A coastal lagoon is partly separated from the open sea by a sandbar.\n哪一种改写保留了意思？',['沙洲使该浅水域与外海部分隔开','这是一条完全不受海水影响的高山河流','泻湖本身就是沙丘','水域必须位于河流最上游'],'lagoon 与 sandbar 是不同对象；partly separated 也不是完全没有水体联系。'),
one('m1','mitigate','The barriers mitigated flood damage, but several houses were still affected.\n哪一种理解准确？',['屏障减轻了损害，并未把损害全部消除','屏障彻底消除了洪水','屏障必然加重损害','后半句证明 mitigated 用错了'],'mitigate 表示减轻，并不要求问题完全消失；后半句与之相容。'),
gap('m2','mitigate','从 mitigate / prevent 中选择更符合已知事实的一项：\nThe measures did not stop the flooding, but they helped to ______ its impact.',['mitigate'],'已知洪水没有被阻止；减轻 impact 对应 mitigate，prevent 会把缓解加强为阻止。'),
one('p1','proposal','The council rejected the proposal, even though the proposal was detailed.\n关于该计划的状态，哪一种理解正确？',['详细的建议仍未被采纳，不能当作已实施的安排','因为有细节，所以一定已经实施','proposal 在这里表示拒绝本身','被拒绝后，句子的两个 proposal 不再指同一建议'],'proposal 是提议，detailed 不改变 rejected 所说明的未采纳状态。'),
one('p2','proposal','A proposal to restore the marsh was discussed.\n以下哪一句额外增加了原句没有给出的事实？',['The marsh has already been restored.','People discussed a suggested restoration plan.','Restoring the marsh was proposed.','The sentence describes discussion of a plan.'],'讨论建议不保证已经完成恢复；其余为同义转述。'),
one('s1','species','The survey counted twelve species, not twelve individual animals.\n作者刻意区分什么？',['十二种生物与十二只个体','十二个栖息地与十二种天气','十二株植物与十二种肥料','十二条支流与十二处沙洲'],'species 是种类，不是个体数量；句中 not 明确区分。'),
gap('s2','species','用 species 的正确词形填空：\nOnly one ______ was found at the first site, but six ______ were found at the second. 两空同一个形式，只填一次。',['species'],'species 的单复数形式相同；one 和 six 的差别不能靠添加复数后缀体现。'),
one('t1','tributary','The stream is a tributary of the river.\n如果顺水追踪这条小溪，最符合句意的关系是什么？',['小溪流入这条河','河一定从小溪流出后直接入海','小溪与河之间没有水体联系','小溪必定是一条人工水渠'],'tributary of 表示支流汇入干流；不能额外断言人工、入海或反向关系。'),
one('t2','tributary','The tributary joined the river upstream of the village.\n哪种位置描述准确？',['汇流点在河水流到村庄之前的位置','汇流点必在村庄南面','村庄必定位于海边','upstream 把 tributary 改成了河口湾'],'同时理解支流汇入与相对水流方向；不能拿方位或河口概念替代。')
];
export const chapter={id:'2026-10-09',title:'水回来的地方',number:'第 3 章',bankVersion:'comprehension-lab-v1',digest:'40be00ad89aa366e033f6f36905278822d3963a17787119e60db5a2305cd2dc0'};
