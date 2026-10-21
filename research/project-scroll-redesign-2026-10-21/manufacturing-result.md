# 项目启程纪念卷轴：本轮制作结果与留存

记录日期：2026-10-21。此报告按实际文件、制作日志与独立审查整理，保留退稿、修订和证据边界；不保存隐藏推理链。记录截点为本地冻结及 `verification.json` 的 `2026-10-21T14:15:51.267Z` 检查。**本件当前是经 agent review、可供用户评价的已制作样品，尚非用户认可的作品。发布地址、发布提交与实际发布时间在本报告截点尚未记录。**

## 1. 当前对象与状态

| 项目 | 本次固定记录 |
| --- | --- |
| 作品 | *The Second Language — A Day in Another Tongue*／《第二语言——另一种语言里的一日》 |
| 身份 | 私人项目启程纪念；`category=project-commemorative` |
| 归属 | Gual Wells；`workId=SL-PROJECT-BEGINNING-20261021` |
| 制作时刻 | `2026-10-21T12:10:23.227Z`，纸面写作 `21 October 2026 / 20:10:23.227 +08:00` |
| 内容 SHA-256 | `4a83d1952e133bcecd6c1aa2e14a788159b410e9a6ea2a7f5bcf42610943e37b` |
| 内容短记 | `4A83 D195 2E13 3BCE` |
| canonical artPlanDigest | `e2e11c35d07383023cf454646d8ea7434f1b16622f5deae15cc2acf390065e9b` |
| 冻结 | `surfaces.json::stage=frozen`；`frozenAt=2026-10-21T14:14:11.152Z` |
| 审查身份 | `artisticApproval=agent-review-for-user-evaluation`；`userAccepted=false` |
| 事件边界 | `issued=false`、`attestation=null`、`projectFoundedAt=null`；截点的 `publishedAt=null` |

制作时间属于本件制作记录，不能用来推定项目诞生日。正文的启程是委托对象，不是考试通过、章节认证或能力完成事件。当前固定原件见 [最终六层清单](../../web/labs/project-beginning/assets/surfaces.json)，独立整件审查见 [v2 报告](candidate-whole-review-v2.md)。

## 2. 退稿与研究重新开始

1. 先前《The Returning Thread／回返的线》曾部署，随后被用户否决：纸张工艺、艺术流程和主题均未满足委托。正式目录中的旧入口已撤下，原作与旧审查作为失败档案保留。不能用后来的新制作撤销这项否决，也不能将先前代理放行追认为用户采用。撤下事实、当时源提交及部署记录在 [PROCESS_LOG.md](PROCESS_LOG.md)；失误复盘在 [review-failure.md](review-failure.md)。
2. 重新核对项目使命与原始用户决定：这是私人英语学习项目，完整理解词语、辨认语境、听读与主动表达、持续建设章页共同构成其对象。新文书将“词语起步—日常语境—招呼得到回应—未来章页继续”写入主体。雨、面包和门口为原创近景，未冒充用户经历、教材原文或成立日纪实。来源映射见 [theme-and-design-recap.md](theme-and-design-recap.md)。
3. 用户先明确第五章纸张仍不足，再明确应研究第一章从不合格、技术改革到多种技艺结合的完整过程。**第五章不是本件的合格纸张标准，没有将两个样品平均为材料目标。** 第一章的材料设计、年龄位置、微表面、连续纸膜、墨印、照明与整页形成共同提供工艺依据；不能缩成复制成品或一次图像参考。
4. 第一章来源锁定旧工艺提交 `17acb31e0241180b5f0c19b463492cc6ef756c80`。[first-chapter-source-index.json](first-chapter-source-index.json) 从不可变 Git 对象实际读取所选 **43 项**源文件字节并求 SHA-256；它固定来源，不证明新作艺术质量。源码重建和艺术形成分别见 [技术重建](first-chapter-process-reconstruction.md)、[工艺形成](art-craft-formation.md)。

## 3. 本件实际工序

| 工序 | 实际采用的做法与观察 | 留存／限制 |
| --- | --- | --- |
| 新基图与小画 | 生成独立无字纸胚，实际输入第一章 v6 母材作为参考；另作空白开书、窗板与疏雨、小块面包的透明小画。用户要求先研究完整工艺后，曾暂停装配，保留两图为候选。此后经母图检查、实际材料及排字装配，才成为本件输入。 | 实际调用、输入和 prompt 在 [generation.json](generation.json)，原始输出在 [source/](source/)。没有因生成完成便宣布纸张成立。图像模型名称和质量档工具未公开，未补造。 |
| 基色、年龄与裁形 | 新纸自己的暖旧色进入书写区，带有潮线、接触差异、细纹及两道主折。母图审查曾指出潮线轮廓主次、局部擦薄辨识和折唇重复受光的风险，随后在整页与实际受光中复看。 | [母图审查](candidate-paper-review.md)只审输入。未记录为已发生的局部修图，不追写成后期修复；整页复审没有发现必须先重生纸胚的阻断缺陷。 |
| 资源传递 | 纸胚源图为 **1060×1484 RGBA**，无损编码为本件 WebP；小画 **1635×962 RGBA** 原字节复制。未裁切、镜像、锐化、程序重绘或把整张色渍转成高度。最后排印面为 **2048×2868**，名义纸幅 **300×420mm**。 | [trial-asset-manifest.json](trial-asset-manifest.json)保留试制时资源清单及原尺寸；排印面的像素数不代表源纸图增加了扫描细节。 |
| 独立微表面 | 复用第一章 v4 已有、许可明确的 Rob Tuytel／Poly Haven Leather Red 02 扫描 normal、roughness；原通道不改色、不重采样。它们作为低幅皮面微结构近似，粗糙度经保留的纸材路径映射至哑光范围。 | 不是本件羊皮纸的实测扫描。来源、许可与摘要在 art-plan、资源清单和第一章索引中各有记录。 |
| 宿主异步覆盖修复 | 共用 v19 器物继承的 v17 准备链，会把微表面设回 Clamp／1×1、normalScale `.11`，并带入第五章折形。本件在完整异步准备结束后显式恢复 Repeat **1.4×2.1**、normalScale **.035**、印压 **.0045**，使用本件折线。 | 运行快照实际读到恢复后的值；未以模板配置存在代替运行值。第一章／第五章不因本件而被重写。 |
| 主要形体与照明 | 在原连续 GPU 卷膜、共享残余形变／法线／深度路径上，按本纸实际两道主折作浅幅近似。保留 v6 的低反光、无重复 tone mapping 与原色保护；快照为 sheen0、specular0、envMapIntensity `.07`。 | 新折形不是测绘所得真实厚度。母图已有的折唇明暗须与几何和受光一起判断，不能把主折做成硬绳，或靠漂白解决竞争。 |
| 真排印 | 原始 **Aboensis** OTF 经 FontFace 实际加载，用浏览器 Canvas2D 排字；基字形、清楚字芯、轻微旧墨分层保留。小画独立合入，不生成正文文字，不用现代项目图标贴纸。 | [最终内容的排字检查](typesetting-inspection-4a83d1952e133bce.json)记录真实字形 bounds、字体摘要、英中与碰撞检查；检查完成时仍明确是 draft，未自授艺术批准。 |
| 藏记与承墨 | 使用 v12 小长方藏记，文字为 `The Second Language / In remembrance`。保留稳定印模、冻结接触缺损、独立肩墨、光学密度合成与 relief 分工。 | 不以火漆、王权或外部授奖身份代替私人归属。印迹层与纸面、微表面共同呈现；未做通道消融，不能逐点宣称实物物性成立。 |
| 实际呈现 | 使用真实共享 Three 运行器、现有物理扣具与 v20 雾染，在 Chrome **402×874、DPR2** 手机模拟保存展开、细看、末圈、闭合和独立 GPU 器物输出。 | 首次检查页放在根目录导致相对资源 404；改为正式 bundle 同目录后重新检查。失败那次未计作资源通过。 |

制作方案的原始起点和职责划分保留于 [manufacturing-plan.md](manufacturing-plan.md)。本报告记录其实际落实及修订，不将方案表中的拟定坐标冒充最后排印。

## 4. 首稿失败与定向修订

| 项目 | v1 首稿 | v2 修订稿 |
| --- | --- | --- |
| 内容 SHA-256 | `f51c7f6f9399cd1c87bb3935ed8f9bf3c0e9e878baf3975d37d19effac3aac85` | `4a83d1952e133bcecd6c1aa2e14a788159b410e9a6ea2a7f5bcf42610943e37b` |
| draft manifest 原字节 SHA | `09093512b2c6ce4cb022c2d797eb97c8206d16fbd5a84189cd7b34990669c2b6` | `7edb3e15ceed240bd85f6cfb5cdbdab82a8b53efdaf0f7012e353447a9657ab5` |
| 诗末到姓名 | 末句 glyph 底 y2309；姓名顶 y2312；仅 **3px** | 末句 glyph 底 y2219；姓名顶仍 y2312；**93px** |
| 实际修订 | 独立整件审查指出姓名粘成诗的下一行；不能采用或发布 | 诗末两行基线上提 **90px**，保留字号／行距；姓名不下挤。记录小字下移 **15px**，藏记上提到 y2525，重新形成尾段 |
| 审查 | [candidate-whole-review-v1.md](candidate-whole-review-v1.md)：有必修版式缺陷 | [candidate-whole-review-v2.md](candidate-whole-review-v2.md)：实际重看整页／细看，未发现仍阻断这一版本样品供用户评价的艺术问题 |

这次失败说明，字体已加载和字符不碰撞并不能保证阅读层级。修订后先读完诗末，再进入私人尾记；不是仅修改一个检测数值。上斜折穿过首节前两行也在 v2 复看：深褐字芯仍清楚，未被折唇高光洗掉。审阅者将其保留为可由用户继续评价的折史，没有追加第一章本身不曾满足的“折线一律不得过字”要求。

v1 原平面图和原 manifest 现存于 [trials/v1-front.png](trials/v1-front.png)、[trials/v1-surfaces.json](trials/v1-surfaces.json)；平面原字节 SHA 为 `b5b5b6e41df5763a9826e8b20f9c1ee9ba7e46a05d46c752f4830b80917134f7`。v2 的冻结前 manifest 现存于 [trials/v2-surfaces.json](trials/v2-surfaces.json)。当前 `trial-open*`、`trial-detail*` 等文件属于后续实测，不能拿来冒充 v1 原截图；v1 报告保留了其当时实际所看图像的摘要。

## 5. 六层冻结与原字节提升

v2 审查绑定的六张 draft PNG 未再次重排、重绘或重新编码，按原字节提升为 `final-*`；冻结改变的是采用清单及状态。报告整理时实际读取六个 final 文件求 SHA，并与最终清单、归档的 `trials/v2-surfaces.json` 对应项核对：**六项文件摘要、字节数和尺寸均一致**。原 draft 文件名已不在展示资产目录，归档 manifest 固定其冻结前身份。

| 最终文件（目录 `web/labs/project-beginning/assets/`） | 尺寸 | bytes | 原字节 SHA-256 |
| --- | --- | ---: | --- |
| `final-front.png` | 2048×2868 | 10893789 | `b82b5c4c8e220443e8c4ae0a1b84aeaa908f88e6cd2c53fb5231e09aceacae7b` |
| `final-back.png` | 2048×2868 | 10392202 | `925c1db1f8810d452a318fb75b30f2a53790be6c05a4cd04fbf9cc883d7b715e` |
| `final-ink.png` | 2048×2868 | 579734 | `2007be6f580a5cc72f24388bf4eb487290063136e60937a6114d2c16917ecb5a` |
| `final-relief.png` | 2048×2868 | 136060 | `030eb09ed2ee219a5ee3508e3cca6832635d7199470c8425ab8451cf0bf6ae29` |
| `final-seal-ink.png` | 784×360 | 143133 | `7e6e6ab3541b1807fd75da6b761f58144f1922578a4de203ec655891d8d61cea` |
| `final-seal-mask.png` | 784×360 | 51055 | `d8411063350187c541bc503775180041dcea1ecbd5a9726ab7b0e69dafc135fc` |

最终 manifest 绑定 v2 审查文件，其原字节 SHA 为 `127804603748e673dd18cf12f065c2e47f3bd47f48f0554edc9e0cda7785fb23`。该绑定是代理对特定图稿的审查记录；`frozen` 指制作原件冻结，不表示用户已接受材料、艺术或真机表现。资源中保留的 `...sheet-trial` 名称及试制阶段说明也不能被读成用户批准。

## 6. 检查实际支持什么

- **排印检查**：原字库加载、输出 PNG 尺寸及摘要、文字 bounds 与碰撞检查有记录；`errors=[]`、`missing=[]`。题头 52px、项目名 124px、副题 82px、首节 86px、末节 90px、尾记 56px、制作记录 42px、状态 40px。小画位于首三行与末两行之间；实际藏记框为 x310／y2525／300×138。数值用于恢复本件，不形成其他作品的自动审美门槛。
- **实际 GPU 观察**：[trial-runtime.json](trial-runtime.json)记录324个内区点的近似透视配对，亮度差约 **+1.583**、对比比约 **1.008**、相关约 **.963**。它支持所取内区宽尺度年龄／色差未被明显洗平的有限观察；不是精确变形 UV、微纹理量测、物理羊皮证明或艺术评分。独立审查同时实际看原稿、GPU 整页和细看图，没有由数字代替观看。
- **冻结后交互检查**：[verification.json](verification.json)在本地正式 bundle 路径检查项目入口、旧退稿缺席、无虚构章节／认证、固定制作时刻与内容身份、冻结原件、无运行时排字、实际材料 profile、开合及退出停止声音状态。`errors=[]`、`missing=[]`、`writes=[]`。画布解码的2048×2868正面与冻结 PNG 像素相同，仅证明原件传递，不证明着色之后相同。
- **未覆盖的范围**：上述环境是 Chrome 手机模拟，不是实体 iPhone／Safari 色彩、触控或帧率验收；整件审查没有重新逐帧审完整开合。运行记录的声音未试听，不能从退出清理状态推导听感、无缝循环或音频艺术已经验收。用户实际评价仍未发生。

## 7. 完整英文与中译

下列文字与实际 `art-plan.json`、排字检查及冻结内容身份对应。中文为作品的完整翻译，未另加获奖、受苦、学习完成等经历。

### 题头与题名

| 英文 | 中文 |
| --- | --- |
| A project remembrance | 项目特别留念 |
| The Second Language | 第二语言 |
| A Day in Another Tongue | 另一种语言里的一日 |

### 题辞

> With a first word, the work begins:
> rain at the shutter, bread upon the board,
> a greeting answered at an open door.
>
> Page will follow page.
> Another tongue enters the day.

> 这项工作，始于第一个词：
> 窗板边的雨，木案上的面包，
> 敞开的门口，一声招呼有了回应。
>
> 一页之后，还将有一页。
> 另一种语言，走进这一日。

### 私人尾记、藏记与纸面记录

| 英文 | 中文 |
| --- | --- |
| For Gual Wells, | 为 Gual Wells 而作， |
| to mark the beginning of The Second Language. | 纪念《第二语言》的启程。 |
| The Second Language / In remembrance | 第二语言／留作纪念 |
| Made 21 October 2026 | 制作于2026年10月21日 |
| 20:10:23.227 +08:00 | 20:10:23.227，东八区 |
| Content mark 4A83 D195 2E13 3BCE | 内容短记 4A83 D195 2E13 3BCE |
| Private commemorative work | 私人纪念作品 |

档案完整摘要标签为 `Content SHA-256`／“内容 SHA-256 摘要”，数值为本报告第1节的64位内容摘要；它与纸面短记承担不同长度的身份记录。预留的 `Published`／“发布于”是标签译文；本截点没有相应发布时刻，不填造地址或日期。

## 8. 当前留存结论

本轮完成了退稿撤下后的来源恢复、完整第一章工艺研究、新主题文字、独立母图与小画、分层材料装配、真字库排印、一次明确退稿与修订、实际运行观察、重新整件审查和原字节冻结。v2 审阅允许这一固定版本作为待用户评价的已制作样品呈现；没有用户接受或实体设备验收结论。

本报告仅新增制作留存及目录导航，没有修改设计、艺术计划、原件或 UI，没有提交、推送或部署。实际发布后应另据发布事实补提交、URL及时间，不以本报告代替发布回读。
