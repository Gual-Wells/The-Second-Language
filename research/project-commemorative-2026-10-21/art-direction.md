# The Returning Thread · 回返的线

项目特殊纪念卷轴艺术方案，2026-10-21。

制作状态：艺术方向与文书定稿；实际字形排印、资产生成、成品审阅、冻结和发布由主执行者继续。本文件只记结论、理由、可核事实及制作约束。

## 1. 身份与创作决定

这是为 **Gual Wells** 制作的《第二语言》项目私人纪念艺术品。它纪念人与项目之间正在形成的联系；当前制作日只作为本件作品的制作记录，不解释为项目诞生日。作品类别应独立标记为 `project-commemorative`，不放入章号、不绑定考试资格或章节通过事件。

艺术题名：**The Returning Thread**／**回返的线**。

核心意象：一段旧羊皮纸细裂缝，由约七针褪色砖红丝线逐次穿合。线从小孔进入、在背面隐去、稍远处又返回正面。裂缝两端逐渐收束，纸纹仍在，大片空白仍可承载言语。缝补是这幅小画的具体动作，不是对受誉者经历、性格或伤痛的推断。

项目联系是一项当代艺术解释：另一种语言逐渐进入个人生活，形成可以继续书写的连接。正文坚持写可见的线、羊皮与空处，让这件作品单独阅读时也成立；项目的准确名称和个人联系由题头与归属尾记承担。

采用这一意象的理由：纸与线属于作品自身的材料世界，克制而可细看；“隐去—回返”的短促动作可以由文字和图像共同呈现。它与第一章的地图／水流、第五章的芦管／手迹／种子具有实质差别。

## 2. 全部英文与中文

下列英文是同一份固定文书。纸面、释读和内容摘要都应从该源文取值。标点使用实际字体核过的字形；不由图像工具生成任何字母。中文供释读，纸面保持英文。

| 角色 | 英文定稿 | 中文释读 |
| --- | --- | --- |
| 题头／项目名 | The Second Language | 第二语言 |
| 艺术题名 | The Returning Thread | 回返的线 |
| 题辞第1行 | The thread enters the parchment | 细线穿入羊皮纸， |
| 题辞第2行 | and passes out of sight. | 从眼前隐去。 |
| 题辞第3行 | A little farther on, it returns. | 再往前一点，它便回返。 |
| 题辞第4行 | The seam holds the page; | 缝线维系着纸页； |
| 题辞第5行 | the page keeps room for words. | 纸页为言语留着空处。 |
| 归属第1行 | Made for Gual Wells, | 为 Gual Wells 而作， |
| 归属第2行 | in remembrance of The Second Language. | 以纪念《第二语言》。 |
| 藏记第1行 | The Second Language | 第二语言 |
| 藏记第2行 | In remembrance | 留作纪念 |
| 作品状态 | Private commemorative work | 私人纪念作品 |
| 制作记录标签 | Made | 制作于 |
| 短摘要标签 | Content mark | 内容短记 |
| 完整摘要释读标签 | Content SHA-256 | 内容 SHA-256 摘要 |
| 发布时间释读标签 | Published | 发布于 |

### 连续英文原文

The thread enters the parchment and passes out of sight. A little farther on, it returns. The seam holds the page; the page keeps room for words.

Made for Gual Wells, in remembrance of The Second Language.

### 连续中文释读

细线穿入羊皮纸，从眼前隐去。再往前一点，它便回返。缝线维系着纸页；纸页为言语留着空处。

为 Gual Wells 而作，以纪念《第二语言》。

### 身份和时间约束

- 纸面状态固定为 `Private commemorative work`，可正式发布此私人纪念作品；考试认证仍保持独立，`attestation` 为 `null`，不得沿用旧章节尾记中的 `trial successfully completed`。
- 不使用 `Chapter`、`Certificate`、`Awarded`、`Attested`、`Royal` 或 `Specimen` 作为本件的身份字样。后者只属于既有未颁发章节样品。
- 主执行者在冻结前选定并保存真实的制作时刻。元数据使用 RFC3339 毫秒时间、UTC 归一；纸面按 Asia/Shanghai 显示英文日期与 `HH:mm:ss.SSS +08:00`。这记录本件制作，项目成立日期仍为空。
- 纸面记录三行：`Made 21 October 2026`、真实固定时刻、`Content mark` 加实际内容 SHA-256 前16位（四位一组）。完整64位放释读与清单。根据信息冻结时刻构造真实值；禁止为了排版预造时间或短码。
- 实际发布成功后另记 `Published`；不把本文日期或计划中的状态当成发布证据。打开作品不改正文、身份、时间或摘要。

## 3. 整页构图与字级

复用已验证的 300 × 420 mm、2048 × 2868 排字坐标与卷膜比例。所有坐标为制作起点，以实际 Aboensis 字形边界为最终依据。建议安全框为 `(210, 180, 1628, 2610)`。

这是一张“上部单块文字—下部独幅细瘦小画—页脚归属”的页。正文统一靠左，题头、题名、正文共享起笔线；图像居中偏下，没有侧栏，也没有横向插画夹在双节居中诗之间。

| 区块 | 坐标与字级起点 | 处理 |
| --- | --- | --- |
| 题头 | x340，基线y320；60px | The Second Language；低饱和红褐 |
| 题名 | x340，基线y520；118px；最大宽1480 | 单行 The Returning Thread；深褐近黑；须实测单行，若超宽优先调整版心／题名字级至108px，禁止压扁字形 |
| 题辞 | x340，首基线y865；94px；行距138；最大宽1460 | 按上述五行排；第5行基线1417；同一字级、同一左边线；不设额外大首字、不加花边 |
| 图像 | x744，y1535；560 × 660范围内等比放置 | 细瘦、竖向小画，核心线迹稍斜；留出完整透明余边，不让纸色形成矩形贴片 |
| 归属 | x340，首基线y2350；62px；行距88 | 两行；Gual Wells与整句同级，不机械放大全页姓名 |
| 制作记录 | x340，首基线y2570；42px；行距68；宽940 | 日期／毫秒时间／短摘要各一行；实际量字，不与藏记争位 |
| 藏记 | x1390，y2545；300 × 138 | 复用v12小长方母版与真实吃墨、肩墨、独立压痕；不变更印文和机构身份 |
| 状态 | x340，基线y2790；40px | Private commemorative work；清晰但视觉退后 |

上下空处是作品结构：题名后留约220px，诗与小画之间保留约100px，小画与归属之间保留约150px。像素起点不凌驾于字形：出界、坏分行或侵入画面时，重新整理这些区块；保持正文94px附近的可读字级。

默认全部英文采用 **Aboensis** 真字库排印。沿用仓库字库字节摘要 `0ad00fb94899b3a8277680377eb7270c5fb3ee73dd9fefbd6fb31d9f94c4707b` 作为待实际文件回核的基准。图像不带姓名、题辞、日期、印文、假字或手写符号；字体加载／缺字失败保留工作并报错。

墨色：正文约 `#30261F`，题头约 `#6B4339`，题名与归属随正文。仅图像丝线采用低饱和砖红 `#875148` 附近的范围，藏记维持深褐近黑；避免增加鲜红大面积或金色光效。

## 4. 独立图像制作 brief

### 图像职责

新建一幅透明小画即可。它是对缝补工艺的当代手稿式绘画，不是馆藏照片、扫描件、整页羊皮或纸膜替身。主卷轴本身的 alpha 和几何保持完整；小画中可见的细裂缝不承诺真实穿孔、线体厚度或另一套三维机构。

### 可直接交给生图工具的英文 brief

> An original, restrained miniature study for a contemporary keepsake inspired by European medieval manuscript craft. An extremely narrow, gently bending slit in pale aged parchment is joined by about seven fine stitches of faded brick-red silk. Each stitch enters a tiny paired hole, disappears to the reverse, and returns through the next hole; the short crossings rest close to the parchment rather than floating above it. The two ends of the slit taper quietly into the intact surface. Delicate parchment fibres, a few subtle warm brown ink shadows, and minute variations in the thread show the work of the hand. A slender vertical composition with generous transparent space around it, fine sepia drawing with very light tempera-like washes, quiet and materially convincing. The visible parchment around the seam dissolves irregularly into full transparency so there is no rectangular page or sticker outline. The seam remains slim, a small mended imperfection, never a wide wound or a torn-open gash. This is a unique illustration, not a reproduction of any historical object. No text, letters, glyphs, pseudo-writing, numerals, signatures, seal, border, needle, hand, book, flowers, leaves, seed, river, map, crown, cross, gold, wax, wooden rod, scene, background, cast shadow onto a background, modern product photography, mould, or scorch marks. Transparent RGBA output.

输出采用竖幅／接近方幅原件，不强制把工具输出拉成560×660。保存实际原尺寸、原文件、工具结果标识及可观察参数；初次成功资产优先修订利用。读图核查：针脚数量约七即可，不追求机械等距；必须看得出两侧对应穿孔、进出关系、细缝收束与透明边缘。

## 5. 此件羊皮的差异

建议独立制作无字纸胚，或对现有母材作有结构的独立衍生；两种方式均须冻结实际原件。差异由轮廓、折痕、磨耗与纸色共同形成：

- 主色为偏暖的灰象牙色，中央保留温润、低反光、细微刮削纹；不把纸面漂白。右上方略薄、偏冷，下左方略厚、偏蜜色。变化缓慢且不规则。
- 上边轻微斜切，左上角有一个很浅的不对称肩部；右边在约y1850处有一处小短缺口，长度控制在整页宽的2%以内。底边较平，只有不连续磨耗。四边不做等量撕裂或焦圈。
- 一道很浅的旧横向压折位于约y2190、即小画与归属之间。它为版面留白提供物理节奏，不横穿题辞或制作记录。左下边缘可有一条短斜折，但与记录文字安全框保持间隔。
- 接触暗润集中于右上边与下左边，折谷只有少量沉积；中央不铺均匀脏点，且不叠加另一道假缝。年龄色差主要进入基色，微粒才进入微法线，避免把色斑浮雕化。
- 背面以同一张羊皮的裁边、透明alpha、厚薄方向和主折相互对应。可以朴素留空；不补虚构题署或假档案记录。

这一材料选择与居中小缝形成“大片完好、少量可见工艺”的关系。须在真实正视光照下保留灰暖差、刮削与墨迹，避免靠强光或整体提亮吞掉细节。

## 6. 成熟来源与采用边界

1. [The Morgan Library & Museum：Hol(e)y Moly! Historical Damage and Repairs in Medieval Manuscripts](https://www.themorgan.org/blog/holey-moly-historical-damage-and-repairs-medieval-manuscripts)。馆方说明 Berthold Sacramentary（MS M.710，Weingarten，1215–1217）留有普通缝补及彩色丝线装饰修补，并展示细长切口的缝合。本件只借“纸上细孔—线进出—接缝仍可见”的工艺逻辑。馆方全文直接打开返回403；当轮检索返回了馆方页面的相关说明，未下载或取用其图像。
2. [Bodleian Libraries／Andrew Honey：A conservation perspective on imperfect parchment](https://hab.bodleian.ox.ac.uk/en/blog/blog-post-26/)。已当轮直接读取全文。文中以 MS. Laud Lat. 117 的缝补、残存小孔、后期彩线说明羊皮制作与书写过程会留下可见的材料决定；也明确指出现存线不总能确认为最初制作者之线。本件据此保留材料痕迹，且把小画明确作为当代创作。

以上依据支持意象的可制作性和材料判断，不证明某一种统一的“中古证书格式”。本件不采用原作的宗教图像、贵金属装饰、文书权威、版式、文字或图像像素。图像资产由主执行者原创生成并记录实际工具。

## 7. 与前作的差异及成品审阅重点

| 方面 | 第一章v12 | 第五章v14 | 本件 |
| --- | --- | --- | --- |
| 核心关系 | 图中墨线与真实水域 | 气息、手迹与种子 | 线的穿入、隐去与回返 |
| 图像 | 左侧狭长河流边画 | 上中部横向小画 | 下中部竖向缝补小画 |
| 正文 | 右侧两段 | 居中双节 | 上部靠左单一五行题辞 |
| 归属 | 章节试炼尾记 | 章节试炼尾记 | 项目私人纪念尾记 |
| 材料重点 | 既有v6纸胚 | 独立v14羊皮 | 灰象牙色、上斜肩／右短缺口、图文之间浅压折 |

成品艺术审阅绑定最终正文与实际资产摘要。先查看真实整页，再细看字形、针脚、藏记与纸缘：题名应从容，正文应可读，小画应足够小而非稀薄；线的进出与小孔应有因果关系；灰暖纸色与旧墨在正视光照下仍能分辨；身份、固定时间、完整英中及摘要应一致。实际开合、反向、皮扣、雾染、声音、缓存和后台暂停仍由共用运行器核验。

创作配置要求由主执行者记录为 `gpt-6.1-sol / xhigh`。本方案遵循该专用创作策略；实际会话与工具可观察证据应随生产记录保存，策略声明本身不作为模型执行证明。图像工具不暴露的型号或质量写“未核实”。
