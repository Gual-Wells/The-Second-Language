# 第二语言纪念认证文书

2026-10-18修订。用户明确转向**纯文字方印、具名受誉者、可永久收藏的纪念艺术文书**。本版取代v10图标圆印及匿名the learner要求；不恢复章节简介、主题感想或学习寄语。旧预览与研究原件保留。

## 一、身份、职责与真实状态

- USER-DECISION：项目受誉者为**Gual Wells**。公开显示身份唯一入口为`web/owner-identity.js`，稳定主体键仍为`second-language-owner`。这是用户自定的项目身份，不推断证件姓名。不得为改显示名重置Passkey、会话、已存答卷或学习进度；本轮未改认证鉴权。
- 文书同时完成认证和纪念：指明谁、通过哪章的何种考核、谁授予、为何永久留存、怎样识别这一份。艺术性由书写、材料、用印、版式和时间的具体性承载，不把教材文章改写成散文。
- 最新独立试样`/labs/chapter-scroll-v11/`；正式章节测试仍为testing=true、certification=false。此样品没有真实通过事件，不启用发证。末尾Specimen — Not issued及页面中文说明一直保留，包括导出。
- 未来正式规则：每次独立随机重试不限次；首次核定全部正确后唯一永久认证，后续可测试但不重复发证。制作失败不撤销通过、不要求重考。口答识别疑义按CHAPTER_TESTS核定，不伪造分数、旁证、学位、IELTS band或外部机构背书。

## 二、正文：文书职责而非题材介绍

### 拟定英文

The Second Language / Charter of Attainment / Granted unto / Gual Wells

Chapter I / The Line on the Map（章序及题名随真实章节变化）

> Be it known that Gual Wells has passed the prescribed examination for the chapter herein named, having answered every question correctly.

> In recognition of this attainment, The Second Language grants this charter unto Gual Wells, to stand in its permanent record as a memorial of the achievement.

> In witness whereof, this charter bears the mark of The Second Language.

### 审阅准则

1. 第一句确认对象和通过事实；having answered的主语为Gual Wells。不得扩称永久掌握该章每个义项。
2. 第二句明确发行主体、授予行为、永久记录与纪念职责。memorial指该次学习成果，不是逝世纪念；不加入章内人物、场景或虚构奋斗经历。
3. 第三句完成印证；whereof回指前述认证与授予，不虚构见证人或人的亲笔签署。
4. herein、unto、whereof适度保留契据式语气；不用伪中古英语拼写、错误拉丁文、圣职/王权或一串难懂古词装庄严。
5. 不设固定词数填空预算。逐句检查语法、语用、职责和事实范围，再与实际排印全文、中文译文逐项核对。
6. 每轮回复附实际英文和对应中文，包含标题、印文、记录与状态。不能让更好的中文掩盖较差的英文。

## 三、身份、时间与哈希

- 正式输入绑定固定章节`chapterId/chapterNumber/chapterDigest/displayTitle`及首次通过事件`attestation.id/attemptId/assessmentVersion/allCorrect/passedAt/recipientId/recipientName`。姓名在该次颁发时快照固定，未来更名不改历史文书。
- 生产权威必须在服务器验证完整保存的试卷、答卷与通过事件。实验页`assertCharter`只是展示输入契约，客户端拼出一个对象并不获得认证权威；不据此写正式记录。
- 时间记录RFC3339含毫秒与时区，摘要前归一为UTC；显示按Asia/Shanghai，以英文月名日期和`HH:mm:ss.SSS +08:00`分行。日期样式可仿书吏尾记，毫秒与哈希本身是现代信息，不能宣称历史惯例。毫秒表示记录分辨率，不许夸大服务器时钟准确度。
- 正式passedAt只取真实首次通过时间，不取章节发布日期、领取或渲染时间。样品使用独立`proof.sampleTime`，明确是样品制作时间，`attestation=null`；时间固定，不每次打开刷新。当前样品为2026-10-18T00:05:59.135+08:00。
- **不再使用顺序发行编号；也不把随机识别码冒称哈希。**本版SHA-256处理`digestPayload`定义的版本化UTF-8 JSON位置数组：状态域、章节身份/版本/题名、受誉主体/姓名、事件关联、UTC时间、艺术/模板版本、机构、标题、授予称谓、章序、记录标识、完整正文、印文和样品状态。
- 采用受限位置数组消除对象键顺序歧义；不是自写通用RFC8785/JCS库。修改数组格式必须升schema版本。纸面展示完整摘要前16位大写十六进制，四位一组；完整64位摘要与规范原文可在藏卷记录/原件清单核对。短码只作人用识别，唯一性/存档以全摘要与事件ID为准；哈希不是签名或鉴权。
- 样品与issued的状态、事件数据均参与摘要，样品哈希不可能在不变更内容的情况下充当正式证书哈希。纸面内容摘要不同于PNG/GLB文件字节摘要，二者分别记录，不混称。
- 正式颁发后封存事件、正文、全摘要、艺术版本/种子、文件摘要及可重放参数。先取已存原件，不因重开/重导出而随机改印或改日期。完整产物按STORAGE入文件基座，D1留紧凑身份与索引。

## 四、艺术独特性与内容隔离

固定：机构文字、认证标准、纯文字方印母版、正式语域、基本纸幅/字体、身份字段格式。不能每章换机构印章，造成发行身份漂移。

变化：章序/正式题名、真实通过时间、摘要及由全摘要导出的固定艺术种子；该种子控制落墨接触、针孔缺墨、肩部余墨和克制的收笔弧度/长度。不同证书有手工落印感，同一证书重开一致。当前实现不承诺每章独立定制一张新羊皮或一套新字体。

后续材料变体可从审核过的纸张母版、裁边和书写手势中选取，颁发前冻结版本；不靠随意随机污点或不断增加装饰堆出差异。章内文学质量不得成为艺术品质量的上限：正文不读取教学范文，不拼接教材例句，不让模型以故事摘要自动生成“纪念段”。题名只负责识别认证对象。若未来题名有事实错误须先修章节，不由艺术层悄悄改名。

## 五、纯文字方印 `SL-TEXT-SQUARE-1`

- USER-DECISION：不再采用有图标圆章。方印只排The / Second / Language / Attested四行；无开卷、现代应用框、火漆或他人的纹章。使用既有OFL Aboensis字库，与正文同一种书写气质。
- 研究采用中世纪notarial mark的身份收束、字形与书写关系，**不仿冒任何真实公证人的签押**。方形墨压章是本项目的当代组合设计，不声称欧洲中世纪普遍用此式。受誉者名字下的弧线只是装饰性收笔，不冒充Gual Wells亲笔签名。
- 896²印版：外框inset102、线宽16；内框inset129、线宽4.4；边线有小幅弯折而非现代UI圆角。四行基线282/424/570/710，字号106/135/131/80；底部分界横线y617。母版固定小伤，变量吃墨与保存痕迹分层处理。
- 保留v10近墨黑深褐与真实越出印模的肩部余墨，纸纹透出。余墨复用已审核的独立素材，不把文字整体模糊成贴纸；源素材不用于生成字迹或编号。
- 压痕与墨密度独立，复用v8的法线+高度合成。不能把透明墨边做成白色发光边；不能用全页发灰证明古旧。无霉变，不以高光掩盖纸损。

## 六、纸幅、排印、交互

- 从名义300×420mm改为**270×360mm、约3:4**，图面2048×2732；是为本项目姓名层级及方印尾记配置的设计尺寸，不伪称统一历史规格。沿用已认可v6羊皮资产，窄幅比例调整，没有虚构全新实物扫描。
- 机构270/88；文书题465/116；Granted unto为655/72；姓名850/184，收笔930；章序1030/66；题名1150/104，可两行（行距108，最低84）。字体只用实际已加载的Aboensis，失败停止制作，不偷偷回退现代系统字。
- 正文左右236，首基线1320。两行题名启用紧凑上区：授予称谓615、姓名810、收笔890、章序985、题名1095/1203、正文1360，不机械地向下推挤尾记。正文78，必要时只降到76或74，行距字号×1.23取整，段后22；测实际绘制底部<=2215，超出要求另一布局，不压扁字形。
- 方印盒(253,2220,390,390)；尾记从x825，Record/短摘要/英文日期/精确时间分别在2280/2370/2455/2530。未颁发标识基线2630，远离纸张破损外缘。不要重演上一草稿把状态字排到裁边外的问题。
- 全页、细看、释读与记录均保留。长数字在释读中可精确核对，不以中世纪字体替代机器可读数据。
- 连续GPU卷展、残余卷曲、皮环略松后轴向退出、金属扣刚性、真实透视及前后遮挡继续用v8；雾染用v6。此轮不改已验证的动作求解，不恢复果冻皮扣或亮白断线。
- 仅发布scroll-lab预览分支，保留旧版，正式产品认证能力不变。结束按BALANCES更新余额/容量；实际iPhone/Safari性能仍须实机验收，浏览器软件WebGL检查不冒充实机帧率。

## 七、研究依据及采用边界

- [ASChart/KCL](https://aschart.kcl.ac.uk/tech/tech_intro.html)：文书职责、受益人、日期、处分/印证等结构；不照抄宗教、王权、诅咒或特定法律事实。
- [St Andrews大学典藏：notarial marks](https://university-collections.wp.st-andrews.ac.uk/2023/06/23/notarial-marks-in-the-st-andrews-burgh-charters/)：手绘标记兼具身份和视觉表达、固定形制与手工差异；不是方形墨章的直接历史证据。
- [Missouri大学Fragmenta Manuscripta](https://library.missouri.edu/specialcollections/exhibits/show/fragmenta-manuscripta/manuscript-decoration/monograms-stamps-ownership-doo)：字母组合、所有权标记与不同地区印证习惯；不将跨时代材料混称单一标准。
- [RFC3339](https://www.rfc-editor.org/info/rfc3339/)与[RFC8785](https://www.rfc-editor.org/info/rfc8785/)：现代时间表达与确定编码背景；本版受限位置数组不声称完整实现JCS。完整代码、英中审核和实际图面在`research/scroll-lab-v11`。
