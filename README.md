# 第二语言 · The Second Language

面向个人的英语学习系统：Codex 按协议建设课程与分析答卷，iPhone PWA 提供阅读、点读、雅思练习和章节答疑。课程、原声与反馈保留可核对的版本和来源。

[正式阅读器](https://the-second-language.pages.dev/) · [操作与部署](OPERATIONS.md) · [工作约定](AGENTS.md) · [界面设计](web/DESIGN.md)

## 学习功能

2026-10-27 新协议及对应实现正在本轮整合，发布状态以部署与章节执行记录为准。下表说明新单正文的行为；已有冻结选择及历史章节继续各自原内容合同。

| 入口 | 当前能力 |
| --- | --- |
| 每日章节 | 50个主词，按词条与真实语义用法连续阅读；每个 USE 就地嵌入 1–5 份取优语境，多份须有不同收益，VIX结合实际材料判断推荐 |
| 词源与讲解 | 一级词头下集中讲词源；双教材同一用法融合讲解，保留独有信息及原例的原件、定位与去向，不要求全部原例都展示 |
| 章节质检 | 标题旁“质检”按需申请，固定原章与教材来源；逐项核查、反证复核、永久报告；与章节测试及学习者认证分开 |
| 章节测试与认证 | 二十题随机理解测试，可独立重测；新具资格试卷全部明确正确后，保存本章唯一首次通过事件及版本，之后重测不覆盖 |
| 纪念卷轴 | 首次通过后明确申请独立创作，审阅及永久封存后领取；设置“认证阅览”只列已领取章号与独立项目纪念，提供纯享开合及英中释读 |
| 阅读 | 章节册搜索与月历从章首打开；七日条、词条索引、用法回看；每份语境一个完整译文块，默认马赛克隐藏、可反复揭示并保存状态；双击非英文句子区域进入／退出纯净模式 |
| 点读 | 新正文只点读语境中的完整英文句子；冻结历史章保留原第二／三部分整句范围。固定 Kokoro Bella，默认不提前生成；可一次选配，主动点读按需生成或复用，已有音频可下载、不自动播放 |
| 临时页 | 按申请建设测试或复习页，48 小时有效；不改变日课与 VIX |
| 雅思 | 仅完整／微缩两种全科申请；听力、阅读、写作、口语依次组织，按科目与 Task／Part 作答 |
| 作答分析 | 原声录制／上传、写作及文字补充草稿、隐藏参考答案、独立答卷与 Codex 教学反馈 |
| 章节答疑 | 顶栏入口与新回复红点；长按词汇标题／英文句子或双击句中词可直接申请；绑定整章全文和摘要，本机 Codex 服务处理并回推 |
| 设置 | 阅读、学习安排、服务与账户分组；目标、一次性临时需求与休息、通知、上次任务核对的额度记录 |

完整雅思听读各 40 题；微缩听读各 24 题，保留完整题型族并采用平均及以上难度；两者写作均为 Task 1／2，口语均为 Part 1／2／3。微缩不换算官方成绩。参考答案由服务器隐藏，主动揭示才下发；口语文字补充不能替代原声发音评价。

听力采用授权九女声／五男声池，整段脚本先按人物均衡分配，同人同声。其他发音及口语考官固定 Bella。原声分析固定 Whisper、Gemini Flash、Qwen、GPT Audio 四路保存完整返回后交由 Codex；腾讯按需要作专项评测，Qwen 可补听。同模型重复不是独立共识。

## 工程组织

```text
iPhone PWA → 同源 Pages 网关 → Cloudflare Worker
                                   ├─ D1：认证、工作状态、业务索引
                                   ├─ 近期缓存与兼容副本
                                   └─ OneDrive 应用目录：永久文件基座
本机计划任务 → Codex：课程／练习／反馈／答疑
普通后台脚本 → 归档、音频包、独立恢复快照（不调用模型）
```

这是单人系统。通行密钥保护个人界面；供应商密钥、发布凭据与 Microsoft 授权只留在服务端或本机忽略目录。OpenRouter 推理由 Cloudflare 后端发出，浏览器不持有模型密钥。

正式章节及历史版本、音频、参考答案、答卷、模型返回与反馈永久保存。OneDrive 是文件基座，D1 承担状态和紧凑索引；近期缓存与浏览器下载不代替永久原件。未知计费结果不自动重试，存储故障不视为“尚未生成”。临时页按生命周期清理；个人原声不进入 Service Worker 离线音频缓存。

电脑离线时云端已有材料仍可读取；新课程、批改、答疑与卷轴制作需要本机任务恢复运行。空队列检查不调用 Codex，但仍有网络请求。正式离线冷启动登录不作完整可用承诺。

## 权威协议入口

| 范围 | 协议 |
| --- | --- |
| 词源与教材质检 | [ETYMOLOGY](protocol/ETYMOLOGY.md)、[CONTENT](protocol/CONTENT.md)、[CHAPTER_QUALITY](protocol/CHAPTER_QUALITY.md) |
| 日课与真实语境 | [AUTHENTIC_CONTEXT](protocol/AUTHENTIC_CONTEXT.md)、[DAILY_RUN](protocol/DAILY_RUN.md)、[QUALITY_WORKFLOW](protocol/QUALITY_WORKFLOW.md)、[ANNOTATIONS](protocol/ANNOTATIONS.md) |
| 雅思 | [EXPRESSION](protocol/EXPRESSION.md)、[PRACTICE_SIZES](protocol/PRACTICE_SIZES.md)、[LISTENING](protocol/LISTENING.md)、[READING](protocol/READING.md) |
| 发音与原声 | [VOICE_ROUTING](protocol/VOICE_ROUTING.md)、[SPEAKING_PIPELINE](protocol/SPEAKING_PIPELINE.md)、[SPEAKING_RUNTIME](protocol/SPEAKING_RUNTIME.md) |
| 答疑与界面 | [CHAPTER_QUESTIONS](protocol/CHAPTER_QUESTIONS.md)、[READER_INTERACTION](protocol/READER_INTERACTION.md) |
| 章节认证与卷轴 | [CHAPTER_TESTS](protocol/CHAPTER_TESTS.md)、[CERTIFICATION_READER](protocol/CERTIFICATION_READER.md)、[CHARTER](protocol/CHARTER.md)、[SCROLL_CRAFT](protocol/SCROLL_CRAFT.md) |
| 存储与额度 | [STORAGE](protocol/STORAGE.md)、[BALANCES](protocol/BALANCES.md)、[CLOUDFLARE_RESOURCES](protocol/CLOUDFLARE_RESOURCES.md) |

`research/` 是历史研究依据；价格、旧方案和试听结论以现行协议及配置为准。

对尚未冻结 selection 的新运行，采用[真实语境逐义教学](protocol/AUTHENTIC_CONTEXT.md)：按字典序组织50个主词，依次呈现词源、具体用法与核心义、就地语境及所需解释，不再独立组织第二部分例句集和第三部分文章组。按[实事协同协议](protocol/CURRENT_AFFAIRS.md)从[实事与真实材料来源池](resources/current-affairs/README.md)及按需补充的材料与VIX双向判断推荐，并用[制作工具](protocol/TEACHING_AUTHORING.md)独立补查完整双教材与真实词族。默认feed只提供发现捷径，不限定来源池。

2026-10-27已部署新合同的作者装配、来源/正文封存、阅读器、音频、答疑/测试/质检和复习支持，具体测试、实际运行目录同步及线上回读见[实施记录](research/authentic-use-implementation-2026-10-27.md)。这是下一新运行的工程基线；既有正式首章原件、休息与空音频设置未变，新格式首份全章尚未生成或完成学习效果校准。

每个实际语义用法（USE）取优1–5份语境；3份仅在各有独立收益时作为偏好，一份已经充分就保留一份，增加的每份都须说明它补了什么。优先保真缩编原文中实际使用目标义的局部，保留原来的指南、话轮、裁定等语言行为；必要短摘和有理由的教学例句回退均诚实标明。共享仅自然允许，不为提高覆盖数主动选词、合篇或拉长语境。

每份语境有稳定context身份、英文句子标记和一个完整中文译文块，不逐句配译。译文始终占位，默认马赛克隐藏，点击可反复显示／隐藏；显隐状态按已认证用户、不可变章节摘要与context身份隔离保存，同一context自然复用时同步。隐藏译文不进入复制文本或屏幕阅读器名称；无稳定用户身份或本机存储不可用时仍可当次切换。来源按钮查看该份语境实际采用的来源。

已有冻结选择或VIX标注的运行继续原合同；冻结历史章保留原三部分、逐句译文、篇目导航和音频范围，可继续读取，不自动转码、重选、重标或改写原件。已有原件、冻结输入、学习记录及付费产物保留，雅思和卷轴工艺不变。

内容继续按[质量与规模规范](protocol/QUALITY_SCALE.md)在写前计划、首次成文、续写和语义审阅中保质精简，不以删义、降难、硬字数或用法密度评分减负。`chapter-footprint.mjs --draft DATE`提供只读途中观察，未完稿不冒充完稿效率；不以整章生成后统一缩略作为默认流程。

历史三部分流程的[首章实际双语试验](research/quality-scale-2026-10-25/README.md)保留原稿、两种试稿和交叉审阅，研究稿不自动替换正式第一章；用户随后授权的[第一章重做](research/chapter-one-rebuild-2026-10-25.md)已发布：原选词、VIX及前两部分保留，第三部分为12,771英文词，较原版减少37.1%。[前置设计研究](research/first-draft-scale-2026-10-25/README.md)保留分母分析、方法取舍及隔离首次创作小样；这些历史记录不作为新格式已经发布的证明。

### 正式章节测试

章节标题页与正文末尾均可申请/查看测试，历史章的末尾入口仍在第三部分。每次新申请从固定版本的完整章节独立生成二十道理解题：十三道文字单选/多选，固定七道听题口答，目标约十分钟完成；草稿保存在本机，提交后保存不可改写的答卷及逐题解析，可不限次重新申请。听说题采用 Bella 题音、Whisper 转写和本机 Codex 内容核对，必要时 Qwen 补听；不评价口语表现，未听清只补录对应题。原声与结果永久保存，核对期间可继续学习。

2026-10-23用户授权接通章节认证：新具资格的正式二十题全部明确正确后，服务器在最终成绩同一事务保存本章唯一首次通过；绑定真实章节版本、姓名和毫秒时间，重测不覆盖。临时／运维验证及旧无资格试卷不补造认证。认证是私人学习纪念资格，不是外部机构学历或全量掌握证明；纪念币不接正式流程。见 [CHAPTER_TESTS](protocol/CHAPTER_TESTS.md)。

词汇点读已正式取消；新正文只提供语境完整英文句子的 Bella 点读，词条／用法标题、词源、释义、译文及来源说明不发音，标题长按答疑保留。历史章仍可点读第二部分例句与第三部分整句，第二部分词汇标题返回第一部分对应标题。音频默认不提前生成，收费历史原件不删除。

2026-10-18 已完成获批七章的第一部分释义融合与词源升级：280 个主词、1,411 个原用法编号保留，第二、三部分逐字节不变，2,511 条句子音频复用，无新增 TTS。新旧正文及音频包已核验；范围外用法和待核实例外见 [执行记录](research/legacy-first-part-upgrade-2026-10-18.json)，不等同于全章重新质检。

评判生题质量可通过临时页书架打开独立 48 小时章节测试：同正式十三道文字、七道听说及提交判分链路，原章节与正式成绩保持不变。运维入口 `node scripts/publish-temporary-test.mjs --chapter=YYYY-MM-DD --id=UUID --title=标题`，生命周期与隔离见 [TEMPORARY](protocol/TEMPORARY.md)。

### 章节认证与纪念币功能试验

[独立测试页](https://the-second-language.pages.dev/labs/certification/)沿用正式站登录。第三章八道理解题由原创样题库独立随机组卷，可以不限次重测；满分只生成一份测试认证及固定声音身份。祭坛可拖动观赏、点币试听；玻璃罐用真实三维碰撞，提供 32／128／500 枚示意币、手机摇晃与手动摇晃，并保存反馈草稿。历史试验不授予正式章节认证，不授予正式认证，不调用付费模型。500 枚的手机性能和听感尚需真机验收。范围见 [CERTIFICATION_RESEARCH](protocol/CERTIFICATION_RESEARCH.md)。

首轮用户体验未通过：部分理解题可保留，八题容量不足，场景、美术、声音与摇晃方案均未采用。原测试页保留作比较；[反馈与成熟实现研究](research/certification-feedback-review-2026-10-09.md)明确下一轮的题目质量、约十分钟容量、材质美术及正确运动要求，不能以已有逻辑检查替代产品验收。

第二轮已提供 [新版测试页](https://the-second-language.pages.dev/labs/certification-v2/)：十六道独立随机理解题、常驻提交栏、三枚原创主题币面和三份主题声音、成熟自然碰撞音、独立物理 Worker 与稳定手机校准。第一轮仍可比较；不替换正式认证。500 枚保持真实币间接触，但性能与主题听感仍须 iPhone 真机验收，软件 WebGL 检查不能冒称流畅。详见 [第二轮研究与实测](research/certification-v2-research-and-tests-2026-10-10.md)及 [素材授权](web/labs/certification-v2/CREDITS.md)。

## 目录与使用

- `web/`：原生 HTML／CSS／JavaScript PWA，唯一界面样式为 `styles.css`。
- `worker/`：API Worker、Pages 网关、两库增量迁移。
- `scripts/`：发布、运行控制、VIX、声音采集、归档恢复与验证。
- `protocol/`：现行协议；`work/` 保存可续作中间文档。
- `chapters/`：课程产物；`demo/` 仅作演示，不能当正式日课发布。

Node.js 22+（数据库检查需要支持 `node:sqlite` 的版本）：

```sh
node scripts/serve.mjs
```

打开 `http://127.0.0.1:4173`，仅预览演示课程。真实雅思、答疑与私有资料需要正式后端和认证。

```sh
node scripts/check-practice-closure.mjs
node scripts/check-default-controls.mjs
node scripts/check-current-affairs-backend.mjs
node scripts/check-chapter-questions.mjs
node scripts/check-reader-ui.mjs
node scripts/check-context-reader.mjs
```

界面检查需要 Playwright 与 Chromium；`BROWSER_EXECUTABLE` 可指定浏览器，旧章检查的`UI_CHAPTER_DIR`可指定本机真实章节。全部请求隔离，不调用付费模型、不写正式数据；旧章UI截图存入忽略的 `.cache/reader-ui/`，新单正文、整块译文、隔离与交互检查结果存入 `.cache/context-reader/`。新格式已检查402×874及320×620触控模拟视口，浏览器模拟不等于 iPhone Safari 真机验收。旧`check-publishing-closure.mjs`与`check-audio-config.mjs`夹具尚未适配当前来源封存/50词流程，不列为现行门槛。

正式发布使用 `node scripts/deploy-app.mjs`，同时部署 API Worker 与带 service binding 的 Pages 网关；不能直接以普通静态 `web/` 部署替代网关。任务结束执行 `node scripts/check-balances.mjs` 更新额度、存储用量并排入归档；归档完成后再次核对存储大小。设置中的“存储空间”显示 OneDrive、三座 D1 与账户共享 KV 的上次用量、上限和核对时间；只核对容量可运行 `node scripts/check-storage-usage.mjs`。额度不足不自动次日恢复，已有产物保留，需用户明确续作；不自动付款。

本机日课北京时间05:00检查安排，使用 `gpt-6.1-sol/ultra`；默认休息，用户关闭休息后仅放行下一次新领取运行，领取后恢复休息。雅思、答疑/测试/质检及卷轴的新主调用也统一ultra，子代理默认max可按需要降低，见[后台执行设置](protocol/BACKGROUND_AUTOMATION.md)。各服务仍用独立队列，安静启动器避免控制台闪窗。任务安装、日志、凭据与恢复命令见 [OPERATIONS.md](OPERATIONS.md)。

## Intellectual property and third-party materials

Original application code, protocols, workflow design, instructional organization, documentation, project-specific datasets and other material owned or licensable by Gual Wells are governed by [GW-ROL-1.1](LICENSE), a **reference-only, non-open-source** license. External readers may study the system and independently learn from or reimplement ideas and methods that are not protected by exclusive rights, but no permission is granted to copy, republish, adapt, redistribute, commercially exploit, or use substantial protected portions as AI training/retrieval corpora except where applicable law allows or with prior written permission.

Third-party packages, model/provider outputs, voices, APIs, dictionary or textbook material, examination-source material, trademarks and media remain governed by their respective rightsholders and terms. AI-generated or AI-assisted artifacts are protected only to the extent applicable law recognizes protectable human authorship, selection, arrangement, editing or other rights; provenance labels do not expand those rights.

### 章节音频选配

设置中的“音频配置”默认不生成。新格式提供`contexts`（语境英文整句）范围，可为下一新章一次性选配，首次发布后恢复不生成；已有章节按固定版本显示可用范围，冻结历史章仍为第二部分例句／第三部分范文。旧存选配不自动映射为新格式授权，需重新选择适用范围。已有章节先显示费用预估，再确认不可撤销；后台沿用Kokoro Bella与永久音频库，相同文字、音色和读音跨章节复用。预下载开关仍只下载已生成音频。协议与运行入口见 [AUDIO_CONFIGURATION](protocol/AUDIO_CONFIGURATION.md)。

### 月度纪念展厅实验（历史样件）

[月度展厅样件](https://the-second-language.pages.dev/labs/monthly-gallery/) 使用固定版本 Babylon.js、授权立体资产和静态象征声音，支持横竖屏、慢速环游、近看、三种环境及三十台布局。三枚样币与反馈独立于正式章节认证；原两轮测试页继续保留。实体 iPhone 的艺术、声音及性能仍待用户验收，正式申领/场景演化及纪念日历尚未启用。用户反馈已取消展厅和图书馆日历展柜，样件仅保留比较；现行决定见 [CERTIFICATION_RESEARCH](protocol/CERTIFICATION_RESEARCH.md)，选型与验证见 [本轮研究](research/monthly-gallery-implementation-2026-10-10.md)，素材许可见 [CREDITS](web/labs/monthly-gallery/CREDITS.md)。

### 认证阅览

首次通过后，在章节测试窗口明确申请本章纪念卷轴。专用创作与独立审阅的新调用采用`gpt-6.1-sol/ultra`，子代理默认max；文图、构图和纸张使用史按章设计，复用已认可机构与工艺，不将旧成品换标题或镜像。旧成功xhigh记录保真复用，不因升级重制。通过审阅并完整封存、回读后才显示领取；失败保留同一任务、认证和原件，未知计费不自动重试。

设置 → 认证阅览：目录保留独立“项目纪念”，正常章卷只列本人已领取章号，不显示题名或锁定占位。进入纯享卷轴后保留真实解扣与交互雾染，音乐和v42材质拟音默认开启；“文书”提供同源完整英中、真实首次通过／制作／发布时刻及内容短码／完整SHA，可复制。第一／第五章旧研究样品仍不升格，未来真实新通过须另作正式件。藏馆与取藏转场已取消。见[现行规范](protocol/CERTIFICATION_READER.md)、[工艺主协议](protocol/CHARTER.md)及[风格核对](research/certification-reader-2026-10-23/theme-consistency.json)。

固定项目作品与共享运行器进入静态发布闭包；每份新章卷的身份、艺术方案、六张冻结纸层及原生恢复包经OneDrive内容寻址保存，D1只保留资格／状态和指针。已领取章卷通过同源私有接口动态读取，不加入公开静态作品清单，不需逐章重新部署网站。打开卷轴不调用模型、不刷新身份。实现、发布与真实作品状态分别以执行记录核对；本机隔离测试不产生正式认证，浏览器模拟不冒称实体iPhone验收。

项目启程纪念作品 **The Second Language — A Day in Another Tongue** 已按第一章完整工艺研究重做；无考试通过事件、不杜撰成立日。原版 **The Returning Thread（回返的线）** 已被用户否决撤下，其[记录](research/project-commemorative-2026-10-21/README.md)只作失败复盘。第一章v1—v12源码考究、真实提示词、候选修订、材质与实装证据保存于[制作研究档案](research/project-scroll-redesign-2026-10-21/README.md)，工艺总入口见[CHARTER](protocol/CHARTER.md)，实际制材／墨印／装配／返修按[SCROLL_CRAFT](protocol/SCROLL_CRAFT.md)。目录／文书纠错见[前次记录](research/scroll-reader-correction-2026-10-22/README.md)。2026-10-23用户采用v5纸卷声与A/B皮扣声，正式阅览和试听共用v42声音引擎，正常自动开合末段保留渐弱微声；[实装与发布记录](research/scroll-sound-adoption-2026-10-23/README.md)包含真实播放、生命周期、缓存及许可核对。此前[工艺规程与拟音重制](research/scroll-craft-and-audio-2026-10-22/README.md)的v41声音已被此版取代。

### 单枚精品纪念币制作（历史探索）

用户已暂停纪念币并转为羊皮卷轴。仇视之龙的雕塑、正侧背、抓握破口、金属与烟光资料保留比较，不自动恢复制作。历史标准见 [COIN_CRAFT](protocol/COIN_CRAFT.md)与[制作标准研究](research/dragon-coin-production-standard-2026-10-10.md)。
