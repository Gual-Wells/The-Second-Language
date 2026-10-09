# 第二语言 · The Second Language

面向个人的英语学习系统：Codex 按协议建设课程与分析答卷，iPhone PWA 提供阅读、点读、雅思练习和章节答疑。课程、原声与反馈保留可核对的版本和来源。

[正式阅读器](https://the-second-language.pages.dev/) · [操作与部署](OPERATIONS.md) · [工作约定](AGENTS.md) · [界面设计](web/DESIGN.md)

## 学习功能

| 入口 | 当前能力 |
| --- | --- |
| 每日章节 | 40 个主词，词汇与用法、例句与翻译、连续长文；VIX 加权推荐，辅助标签使用真实 `YY-MM-DD` 日期 |
| 阅读 | 章节册搜索与月历从章首打开；七日条、词条索引、用法回看与逐句译文；保存各部分位置，双击非英文句子区域进入／退出纯净模式 |
| 点读 | 第一部分词汇标题按音标；第二部分标题返回第一部分、例句整句；第三部分整句。固定 Kokoro Bella，默认下载本章已有音频，不自动合成 |
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

电脑离线时云端已有材料仍可读取；新课程、批改与答疑需要本机任务恢复运行。空队列检查不调用 Codex，但仍有网络请求。正式离线冷启动登录不作完整可用承诺。

## 权威协议入口

| 范围 | 协议 |
| --- | --- |
| 日课 | [DAILY_RUN](protocol/DAILY_RUN.md)、[QUALITY_WORKFLOW](protocol/QUALITY_WORKFLOW.md)、[ANNOTATIONS](protocol/ANNOTATIONS.md) |
| 雅思 | [EXPRESSION](protocol/EXPRESSION.md)、[PRACTICE_SIZES](protocol/PRACTICE_SIZES.md)、[LISTENING](protocol/LISTENING.md)、[READING](protocol/READING.md) |
| 发音与原声 | [VOICE_ROUTING](protocol/VOICE_ROUTING.md)、[SPEAKING_PIPELINE](protocol/SPEAKING_PIPELINE.md)、[SPEAKING_RUNTIME](protocol/SPEAKING_RUNTIME.md) |
| 答疑与界面 | [CHAPTER_QUESTIONS](protocol/CHAPTER_QUESTIONS.md)、[READER_INTERACTION](protocol/READER_INTERACTION.md) |
| 存储与额度 | [STORAGE](protocol/STORAGE.md)、[BALANCES](protocol/BALANCES.md)、[CLOUDFLARE_RESOURCES](protocol/CLOUDFLARE_RESOURCES.md) |

`research/` 是历史研究依据；价格、旧方案和试听结论以现行协议及配置为准。

### 章节认证与纪念币功能试验

[独立测试页](https://the-second-language.pages.dev/labs/certification/)沿用正式站登录。第三章八道理解题由原创样题库独立随机组卷，可以不限次重测；满分只生成一份测试认证及固定声音身份。祭坛可拖动观赏、点币试听；玻璃罐用真实三维碰撞，提供 32／128／500 枚示意币、手机摇晃与手动摇晃，并保存反馈草稿。试验不替换正式读后记录，不授予正式认证，不调用付费模型。500 枚的手机性能和听感尚需真机验收。范围见 [CERTIFICATION_RESEARCH](protocol/CERTIFICATION_RESEARCH.md)。

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
node scripts/check-publishing-closure.mjs
node scripts/check-chapter-questions.mjs
node scripts/check-reader-ui.mjs
```

界面检查需要 Playwright 与 Chromium；`BROWSER_EXECUTABLE` 可指定浏览器，`UI_CHAPTER_DIR` 可指定本机真实章节。全部请求隔离，不调用付费模型、不写正式数据；截图存入忽略的 `.cache/reader-ui/`。浏览器模拟不等于 iPhone Safari 真机验收。

正式发布使用 `node scripts/deploy-app.mjs`，同时部署 API Worker 与带 service binding 的 Pages 网关；不能直接以普通静态 `web/` 部署替代网关。任务结束执行 `node scripts/check-balances.mjs` 更新额度并排入归档。额度不足不自动次日恢复，已有产物保留，需用户明确续作；不自动付款。

本机日课北京时间 03:00 执行；一次性休息安排由用户设置。雅思与答疑使用独立队列，安静启动器避免控制台闪窗。任务安装、日志、凭据与恢复命令见 [OPERATIONS.md](OPERATIONS.md)。

## Intellectual property and third-party materials

Original application code, protocols, workflow design, instructional organization, documentation, project-specific datasets and other material owned or licensable by Gual Wells are governed by [GW-ROL-1.1](LICENSE), a **reference-only, non-open-source** license. External readers may study the system and independently learn from or reimplement ideas and methods that are not protected by exclusive rights, but no permission is granted to copy, republish, adapt, redistribute, commercially exploit, or use substantial protected portions as AI training/retrieval corpora except where applicable law allows or with prior written permission.

Third-party packages, model/provider outputs, voices, APIs, dictionary or textbook material, examination-source material, trademarks and media remain governed by their respective rightsholders and terms. AI-generated or AI-assisted artifacts are protected only to the extent applicable law recognizes protectable human authorship, selection, arrangement, editing or other rights; provenance labels do not expand those rights.

### 章节音频选配

设置中的“音频配置”可为下一章一次性准备词汇、例句、范文逐句音频，也可对已有章节申请。已有章节先显示费用预估，再确认不可撤销；后台沿用 Kokoro Bella 与永久音频库。相同文字、音色和读音跨部分/章节复用；标题不同读音通过音素覆盖区分。预下载开关仍只下载已生成音频。协议与运行入口见 [AUDIO_CONFIGURATION](protocol/AUDIO_CONFIGURATION.md)。
