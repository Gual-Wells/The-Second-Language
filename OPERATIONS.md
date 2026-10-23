# 运行与部署

此文件只说明工具如何连接；每天推荐、词典整合与创作判断以 `protocol/` 为准。运行命令均从项目根目录执行。`work/runs/` 可自由存放续作资料，不把密钥放进去。

## 新正式实事日课（2026-10-23）

主协议CURRENT_AFFAIRS.md与DAILY_RUN.md。新流程从第1章开始，旧章/旧未完业务只读封存，不回填、不撤VIX标记、不迁移正文；正式新申请不再取旧章。旧原件通过publisher `GET /api/chapters?archive=1` 和 `GET /api/chapters/ID?digest=SHA&archive=1` 可核对，归档器已显式使用archive读取。原件、历史成绩及收费资产不删，物理紧凑索引维护保持。

部署先对主库应用0018_current_affairs.sql，再对PRACTICE_DB应用0009_current_affairs_scope.sql，随后部署API Worker与v45静态壳。迁移不回填旧行；新来源绑定及新雅思来源快照保持不可变。正文仍用原SHA定义，来源包独立以摘要在OneDrive永久封存，D1只存小引用。部署后无新章时正式列表为空，项目特殊纪念卷轴继续保留。

日课入口为scripts/run-daily.ps1，gpt-6.1-sol/xhigh、`--search`，领取休息先于模型。`powershell.exe -NoProfile -File scripts/activate-affairs-tasks.ps1` 先显示实际任务路径；显式 `-Apply` 只把DailyCodex未来Action切到本工作区，备份原XML，保留03:00、Principal及Settings，不停止正在执行的其它进程。永久归档任务已经使用本工作区，不重复改其它任务。生产核对见research/current-affairs-runtime-2026-10-23.md。

按需取材：current-affairs-pool.mjs find→current-affairs.mjs discover/read（live web/PDF原文用import）→模型实际阅读/与VIX共同选择→原时点标注→全义三部分建设→pack-current-affairs.mjs绑定source-notes→pack-chapter.mjs→publish-chapter.mjs。章节meta保留contentPolicy并另设sourcePolicy；具体命令、读件边界和字段看CURRENT_AFFAIRS。没有新增付费API或常驻爬虫。

## 正式章节认证与纪念卷轴（2026-10-23）

使用主库迁移`0017_chapter_certifications.sql`，不迁移雅思库或实验认证库。先部署数据库迁移，再部署API Worker，最后发布v43 Pages壳。`deploy-certification-reader.mjs --production`只发布Pages，不能替代Worker上线。UI是章节测试首次真实满分认证→本人申请→后台制作/核验→本人领取→设置认证阅览；旧第一/第五章研究样品不升级、不补造历史成绩。项目纪念仍为独立类别。

工艺/合同入口：`protocol/SCROLL_CRAFT.md`、`SCROLL_PRODUCTION.md`、`SCROLL_BACKEND.md`。`node scripts/scroll-worker.mjs`只处理一次真实队列任务；空队列退出，不调用模型。创作与独立图审实际使用`gpt-6.1-sol/xhigh`，图像按需走Codex内置生图，未配置付费API回退。正常返修与进程恢复采用检查点；未知调用先找回原件或取得明确单次重试授权，不能用resume清除保护。正式已领取资产不因模板更新重排字、换时间或重制。

本机受忽略的`.cache/local-services.json`配置已有`publisherCredentialFile`、`privateCacheDirectory`、`archiveStateDirectory`、`nativeCraftDirectory`，可选`networkProxy`；均不提交凭据。本轮实际服务位于D盘`second-language-certification-reader`工作区，复用原凭据、OneDrive DPAPI与归档账本。新增缓存/构建/原件都在D；Worker依赖复用maintenance入口，其node_modules实体经realpath核实仍在旧C盘活动项目，未热搬、未新增安装，也不冒称已经迁走。后续恢复可通过`PLAYWRIGHT_MODULE`、`CHROME_PATH`、`SECOND_LANGUAGE_PYTHON`、`SECOND_LANGUAGE_CODEX_EXECUTABLE`明确定位，不能把本机路径写成网络安装保证。

共享原生资产按`scroll-base-files.json`冻结/上传/回读注册，命令与真正Blender恢复检查见STORAGE。`.cache/scroll-base/registered.json`记录当前实际注册摘要，后台只引用该版本。按指定摘要可运行`node scripts/register-scroll-base.mjs restore SHA256`从云端恢复到全新目录，不能偷偷用旧本机文件弥补遗漏。常规原件备份同时登记`.cache/runtime-sources.json`的显式artifactRoots与work/scroll；浏览器临时文件和原始CLI日志不归档。原件ZIP按独立分卷和恢复索引处理，每对象必须小于存储接口上限。

Windows安装：`powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -File scripts/install-scroll-task.ps1`。新增`SecondLanguage-ScrollProduction`，沿用既有主体/每分钟触发、IgnoreNew，最长三小时；隐藏启动器避免蓝色窗口。`-RefreshArchive`只在归档未运行时备份并切换其action到此工作区，不更改日课/练习/答疑的调度。电脑关闭/用户环境不可运行时不会在云端凭空制图；资格与任务在服务器保留，恢复本机后领取继续。服务错误及模型未知状态明确保存，不能由空队列成功退出推断艺术合格。

必要核对：`check-certification-lifecycle.mjs`真实SQLite事务/领取/恢复保护，`check-certification-produced-package.mjs DIRECTORY`校验真实未颁发制作包与后端合同，`check-certification-flow-ui.mjs`隔离移动UI全态，`verify-project-beginning.mjs`及`verify-scroll-production-sound.mjs`保留原项目作品/已批准声音。实际模型/图像调用、艺术审阅、原件恢复及上线记录见`research/certification-reader-2026-10-23/`，不把隔离夹具写成真实用户通过或物理iPhone验收。

## 本地阅读器

### 独立认证与纪念币试验

入口 `/labs/certification/`，API `/api/certification-lab`，复用正式通行密钥会话和同源校验。只绑定 `CERTIFICATION_LAB_DB`（`the-second-language-certification-lab`），初始化 SQL 为 `trials/certification-lab/schema.sql`；不对正式 `DB`／`PRACTICE_DB` 应用该 SQL。此库保留试验答卷、测试认证和反馈，不能视作已完成正式资产归档。正式读后记录不动。

`node scripts/check-certification-lab.mjs` 检查随机组卷、隐藏答案、固定章节版本、幂等及唯一证书；`node scripts/check-certification-ui.mjs` 使用真实页面、内存数据库与软件 WebGL 检查触控流程、三维碰撞、运动权限及反馈。全部在隔离环境，不调用收费 API。截图和测量在 `.cache/certification-lab/`，不能据此宣称真机帧率。

Three.js 0.186.1 和 Rapier 0.21.0 仅在打开场景时加载，锁定包版本与 SHA-512，库源码及 MIT／Apache 2.0 许可保留在 `web/labs/certification/vendor/`。如需恢复供应商文件，执行 `node trials/certification-lab/prepare-assets.mjs`，需要 Python 安全解包。声音使用版本化确定性合成，无 TTS 请求；碰撞不上传、不写 KV，退出场景停止声音与物理。试验完成后仍按 BALANCES 更新额度。

闭环检查命令：`node scripts/check-publishing-closure.mjs` 与 `node scripts/check-practice-closure.mjs`。二者使用独立内存 SQLite 和模拟外部服务，不写正式库、不调用真实推理；检查发布版本、休息、额度记录、完整/微缩四科、答卷重试、原声揭示顺序、建设停止与明确续作。点读永久复用、口语保真/代偿、答疑与存储恢复使用各自已有专项检查，具体证据和限制见 `research/closed-loop-review-2026-10-06.md`。

```sh
node scripts/serve.mjs
```

打开 `http://127.0.0.1:4173`。演示章节只有两个词，不是正式课程，也不会写入 VIX。

## 每日 Codex 任务

### Windows 后台启动

四个本机计划任务（日课、雅思、章节答疑、永久归档）统一使用 `scripts/BackgroundTask.cs` 编译的无控制台 Windows 程序。子 PowerShell 使用 `UseShellExecute=false`、`CreateNoWindow=true`，输出进入私有 `.cache/background/` 日志，进程退出码原样交还计划任务；日课/雅思原有工作日志继续保留。空答疑队列安静退出，不启动 Codex 或查询模型余额。

安装或更换工作树后，用 Windows PowerShell 5.1 执行：

```powershell
powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -File scripts/install-background-tasks.ps1 -CredentialFile <本机发布配置文件>
```

安装脚本先编译版本化启动器、备份四个任务 XML，仅替换已有任务的 action；保留触发时间、用户、登录方式、休息流程及 IgnoreNew 设置。安装失败还原已修改的 action。它不新建定时安排、不启动模型，也不停止已经运行的日课。恢复旧 action 可使用 `.cache/task-runner/<安装时间>/` 内的任务 XML；重新注册时保留原用户身份。计划任务需维持当前 Windows 用户可运行状态，不能据此宣称电脑关机后仍能答疑。

直接用 PowerShell 的 `-WindowStyle Hidden` 可能先分配控制台再隐藏，不能作为无闪窗保证。当前原生启动器不依赖 VBScript、常驻窗口、Windows 服务或管理员密码；源码纳入仓库，生成的 exe、任务 XML 和日志留在忽略目录。纯轮询仍产生正常网络请求，零模型调用不等于零 Cloudflare 用量。

本机的定时任务每日北京时间 **03:00** 调用 `scripts/run-daily.ps1`，由已登录的 Codex CLI 以 `gpt-6.1-sol`、`xhigh` 和live search运行本协议。先领取后端一次性控制状态；休息开关只跳过下一次定时运行并自动复位。任务提示词核心为：

> 定时入口先领取当天运行控制，休息则直接结束；非休息日 Codex 阅读 AGENTS.md、protocol/DAILY_RUN.md、protocol/QUALITY_WORKFLOW.md、protocol/CONTENT.md、protocol/TEMPORARY.md 和 protocol/ANNOTATIONS.md，先处理已领取的临时需求，再完成 40 个主词的推荐、VIX 标注、逐词双教材交接、三部分正文、语义审阅与发布。续作写入 work/，未完成时记录 resume.md。

2026-10-24定时必读清单明确加入RECOMMENDATION与CURRENT_AFFAIRS。择词前实际读取feedback-snapshot；候选导出保留全量未标记词，同时附原始可见通用英语多词表成员关系及owner说明，既不打分也不按owner筛难度。实事与早期生活收益的取舍写入selection.md，第三部分通过article-plan及成稿语义回看兑现；整体挑战适度上调且不因实用性降低。只更新尚未冻结选择，已冻结/已标注运行保护不变。生效依赖实际Daily Action指向本工作区；无前端或Worker改动，不要求重复部署静态资产。

定时任务与机器保持运行。若当日工作未结束，下次唤醒继续同一工作目录下的 `work/runs/<YYYY-MM-DD>/`；不要重新选词。使用另一工作树时，把 `SECOND_LANGUAGE_CREDENTIAL_FILE` 指向本机忽略的 `.cache/deployment-secrets.json`，并确保中间文档可续用。目标日期和 VIX 的真实 `YY-MM-DD` 标注标签必须分别保存，后者为目标日期去掉年份前两位。

可用的确定性工具：

```sh
node scripts/claim-run.mjs YYYY-MM-DD
node scripts/prepare-vix.mjs YYYY-MM-DD
node scripts/vix-candidates.mjs --vix=.cache/vix/<inputCommit> --out=work/runs/YYYY-MM-DD/candidates.json
node scripts/feedback-snapshot.mjs YYYY-MM-DD
node scripts/prepare-vix-marking.mjs YYYY-MM-DD
node scripts/mark-vix.mjs --vix=work/runs/YYYY-MM-DD/vix-marking --selection=work/runs/YYYY-MM-DD/selection.json
node scripts/publish-vix.mjs --vix=work/runs/YYYY-MM-DD/vix-marking --selection=work/runs/YYYY-MM-DD/selection.json
node scripts/pack-chapter.mjs YYYY-MM-DD
node scripts/publish-chapter.mjs YYYY-MM-DD
node scripts/build-review.mjs work/temporary/ID/plan.json
node scripts/publish-temporary.mjs --page=work/temporary/ID/page.json
node scripts/delete-temporary.mjs 临时页ID
```

`prepare-vix` 首次将 VIX 的当前 `main` 固定到 commit，续作只恢复/校验同一锁定输入，并分段下载辅助索引、两份 textbook 和构建脚本到 `.cache/vix/<commit>/`，逐文件验证 Git blob 摘要；它要求运行环境可访问 GitHub API 和 raw 文件。若命令行网络不可用，Codex 可用已连接的 GitHub 仓库工具取得同一 commit 的文件。冻结selection后才运行prepare-vix-marking；标注与发布使用独立工作副本，不修改原输入。工作副本重跑不覆写，发布commit另记meta/回执，不修改冻结selection。远端main变化时保留原选择及未提交标注待核对，不能刷新输入重选。`publish-vix` 优先使用 `GITHUB_TOKEN` 或 `GH_TOKEN`，没有环境变量时读取本机 GitHub Git 凭据。反馈与章节发布优先读取环境变量 `SECOND_LANGUAGE_API_URL`、`SECOND_LANGUAGE_PUBLISH_TOKEN`；本机部署环境也可从忽略的 `.cache/deployment-secrets.json` 自动取得发布 token，默认连接线上站点。给定日期正式正文存于 `chapters/YYYY-MM-DD/chapter.md`；同目录 `meta.json` 需含 `date`、`title`、`subtitle`、`number`、`wordCount: 40`、`runId`、已提交的 `vixCommit` 和 `protocolCommit`。`pack-chapter` 会检查两部分各有相同顺序的 40 个主词。

内容续作以 `work/runs/<date>/words/` 的逐词材料、`article-plan.md`、`article.md`、`continuity.md` 和必要时的 `resume.md` 为交接点；这些文件由 Codex 按内容自由写，不进入发布正文。`pack-chapter` 能核对第三部分带或不带 `USE` 的句子都已逐句翻译，并核对每个用法至少被标出一次；教材保真与用法是否真实成立仍由 Codex 在发布前审阅。

## 原声设施（正式录制、采集、接管与反馈）

执行要求见 `protocol/SPEAKING_PIPELINE.md`，上传、私有文件及在线队列设计见 `research/speaking-facilities-engineering.md`。正式 PWA 已接通原声入口，实际主通路见 protocol/SPEAKING_RUNTIME.md；下列工具用于保留的补听与腾讯专项。

```sh
node scripts/speaking-handoff.mjs .cache/口语采集/manifest.json
node scripts/speaking-assess-sentence.mjs .cache/口语专项/plan.json --dry-run
node scripts/speaking-assess-sentence.mjs .cache/口语专项/plan.json
node scripts/speaking-assess-word.mjs .cache/单词专项/plan.json --dry-run
node scripts/speaking-assess-word.mjs .cache/单词专项/plan.json
node scripts/speaking-detail.mjs .cache/补听计划.json --dry-run
node scripts/speaking-detail.mjs .cache/补听计划.json
```

本地采集清单包含 attemptId、jobId、test、原声定位与 calls；每项 call 含 routeId 和相对当前清单的 file，该私有 JSON 文件含 raw、parsed、metadata。接管写入忽略目录 `work/expression/reviews/`，全部返回保留。腾讯专项先核对本人实际原话与短句裁剪位置；计划字段及限制见接入设计，不用参考范文评测原答卷。

正式采集器运行在主 Worker，0004 迁移将其数据库接入 PRACTICE_DB。当前 OneDrive 永久文件基座提供私有存储，PRACTICE_MEDIA KV 只作故障兼容；不依赖 R2。独立 Worker 配置样本和 schema.sql 仍保留作移植参考，不重复应用到正式库。OpenRouter 密钥只放服务端 secret；腾讯密钥只在私有工具配置，不交给浏览器。

默认四路是 Whisper、Gemini Flash、Qwen、GPT Audio；GPT Audio 增加独立声音观察，不取代其他主路。Qwen 可多次补听；专项计划包含 id、attemptId、parentJobId，以及各有 id、provider、focusPrompt 的 tasks。当前 provider 支持 qwen 和 gpt-audio，云队列复用完整 WAV；片段尚需受控上传和原声关系校验。本机 `.cache/speaking-backend.json` 只保存 baseUrl 与 controlToken，控制工具经 HTTPS POST `/speaking/details` 入队，不持有 OpenRouter 推理职责。Worker 用 SPEAKING_CONTROL_TOKEN 验证私有控制身份；正式原声补听使用 publisher 凭据与 speaking-practice.mjs details，独立 Worker 控制配置仅作备用。

额度池为 OpenRouter 共享钱包、Cloudflare Whisper 和腾讯专项。按 protocol/BALANCES.md 在任务末尾查询、携带归一化记录并发布更新余额页，低额度提前提醒。不自动付款，不安排额度不足后的跨日/每小时重试。已得材料保留，已缓存音频复播不生成；未知计费结果不自动重付。腾讯不足可由 Qwen 提供定性代偿，不补造量化分数；无语音依赖任务继续。

腾讯单词工具支持模式 0/4，字母映射与 IPA 分别调用；录音模式只发一个音频包。裁词边界和不同模式的评分量纲须核查，不用低分直接诊断。全部原包保留。最新实际返回、收费及能力取舍见 `research/openrouter-speech-evidence-2026-10-04.md`。

## Cloudflare 资源与发布顺序

现有站点位于 `https://the-second-language.pages.dev/`。Worker 名为 `the-second-language-api`，Pages 项目名为 `the-second-language`。D1 数据库 `the-second-language` 存章节发布索引、阅读状态和认证资料；KV 命名空间 `the-second-language-chapters` 按摘要存正文。账号 R2 尚未启用，因此项目不依赖 R2。资源 ID、公钥和域名已写入 `worker/wrangler.jsonc`；密钥保存在 Cloudflare secrets 和本机忽略的 `.cache/deployment-secrets.json`，切勿提交。

表达练习使用单独 D1 `the-second-language-practice`，数据库绑定 `PRACTICE_DB`，迁移目录为 `worker/practice_migrations/`。在 `worker/` 运行 `wrangler d1 migrations apply PRACTICE_DB --remote`。表达练习的文字作答不进入原有 `DB` 或 Git；PWA 已接录音/已有文件提交，原件和多路返回永久存 OneDrive，故障兼容副本使用私有 PRACTICE_MEDIA KV。可选 `PRACTICE_READ_TOKEN` 是未来 Chat/MCP 只读接入的独立 Worker secret；不得向 Chat 提供 `PUBLISH_TOKEN`。本机 `scripts/practice-job.mjs` 的建设与批改命令仍使用发布令牌。

表达练习监测脚本 `scripts/run-practice.ps1` 先通过 `node scripts/practice-job.mjs next` 轻量检查申请、文字/听力/阅读答卷与原声转换/分析队列；空队列不启动模型，有工作才使用 `gpt-6-sol`、`high` 继续 `work/expression/` 的中间文档。该脚本与每日 03:00 日课独立，部署与本地凭据确定后已有 SecondLanguage-PracticeCodex 每三十分钟 Windows 任务；若在另一 worktree 运行，先设置 `SECOND_LANGUAGE_CREDENTIAL_FILE` 为当前机器上忽略的正式凭据文件。手动命令：

```sh
node scripts/practice-job.mjs next
node scripts/practice-job.mjs claim <请求ID>
node scripts/practice-job.mjs source <章节ID> <固定摘要>
node scripts/practice-job.mjs publish <请求ID> work/expression/<请求ID>/set.json
node scripts/practice-job.mjs review-claim
node scripts/practice-job.mjs review-complete <答卷ID> work/expression/reviews/<答卷ID>/review.json
```

发布前 Worker 的 `PRACTICE_DB` 迁移必须完成；随后先发布 Worker，再发布 Pages 的新外壳。用户申请只写练习库，不改日课、临时页或 VIX。实际题目经原创研究建设后才发布，不能把演示题混入正式练习册。

1. 在 Worker 配置目录运行 D1 migration：`wrangler d1 migrations apply DB --remote`。
2. 将 `PUBLISH_TOKEN`、`ENROLLMENT_KEY`、`VAPID_PRIVATE_KEY`、`VAPID_SUBJECT` 设为 Worker secrets；将 VAPID 公钥配置为 `VAPID_PUBLIC_KEY`。发布 token 只给 Codex 的发布环境，不交给浏览器。推送不用时可暂不配置 VAPID。
   可在 `worker/` 本机运行 `node --input-type=module -e "import { generateVapidKeys } from '@mmmike/web-push'; console.log(await generateVapidKeys())"` 生成公私钥；私钥不要提交到 Git。
3. 从项目根目录运行 `node scripts/deploy-app.mjs`，顺序发布 API Worker、构建网关并发布 Pages，随后核验同源会话 JSON 与私有接口认证。Pages `API` service binding 指向已发布的 Worker；前端发布必须包含 `worker/gateway/dist` 的代理，不能直接部署 `web/`，否则 `/api/*` 会退化成静态网页。手动等价步骤是在 `worker/` 运行 `wrangler deploy`、`node gateway/build.mjs`、`wrangler pages deploy dist --project-name the-second-language --branch main --cwd gateway`。
4. 在 `worker/` 运行 `pnpm exec wrangler d1 execute DB --remote --file=admin/open-enrollment.sql`，将单人通行密钥登记窗口开放五分钟。读者在正式站点点击“登录”，输入本机 `.cache/deployment-secrets.json` 中的 `ENROLLMENT_KEY`，完成设备通行密钥登记与登录。成功后窗口关闭。需要重置时按 `worker/admin/reset-auth.sql` 明确操作。
5. 首次真实章节按 `protocol/DAILY_RUN.md` 完成、暂存并提交。KV 在不同地区可能延迟可见；后端在发布至少两分钟后才尝试新章推送，并只推送当前版本。正式发布后须从线上按日期回读。

本仓库不保存实际 secrets，也不把两词演示章节当作正式课程。需要重新部署到另一账号时，应重建资源并更换配置中的资源 ID 与域名。


第四部分 v2：微缩规格与难度见 PRACTICE_SIZES.md；阅读见 READING.md；原声操作见 SPEAKING_RUNTIME.md 和 scripts/speaking-practice.mjs。正式 Worker 已绑定 AI、私有媒体兼容 KV、OpenRouter secret；分钟任务采集原声，Codex 本机转换和分析，日课仍独立北京时间 03:00。日课点读固定 Kokoro Bella，由 Cloudflare 按需生成并永久复用；第一部分只读词汇标题对应音标，第二部分标题复用该音标、例句整句，第三部分整句。practice 0006 迁移新增 audio_key，已核验点读移出 D1 BLOB；失败时保留旧副本，不重新生成收费音频。听力通过 practice-audio.mjs cast 冻结授权音色池的人物绑定，后台校验同人同声；口语考官固定 Bella。长期预生成整章朗读仍是可选扩展，不增加每日生产负担。

## 当前答疑与永久存储设施（2026-10-06）

主库应用 migrations/0005 至 0008；练习库应用 practice_migrations/0006 至 0008。按现行配置先发布 Worker，再 build gateway / 部署 Pages。`ONEDRIVE_ENABLED=true`，`ONEDRIVE_KEY` 只存 Worker secret；本机同一密钥和 Microsoft OAuth 由 DPAPI 保存，不进入 Git。应用仅授权个人 OneDrive 的 Apps/The Second Language 文件夹，应用客户端 ID 是公开标识，不是密码。

首次迁移：`node scripts/onedrive-connect.mjs begin 69e35375-8fe6-497b-9e02-7e7425058e19` 发起设备登录，浏览器授权后执行 `node scripts/onedrive-connect.mjs finish` 保存授权，再用 `verify` 验证应用目录；`node scripts/onedrive-install.mjs` 安装加密连接。先检查 status / 写入回读验证，随后启用开关、部署并运行 `node scripts/storage-upgrade.mjs migrate`。现有正式连接已完成，不为普通发布重新授权或生成加密密钥。部署/恢复到别的 Windows 用户时重新授权，不能把旧 DPAPI 文件当可移植凭据。

`SecondLanguage-ChapterQuestions` 每分钟执行 run-questions.ps1，Codex gpt-6-sol/high 接收全文与会话、回推章节答疑；空队列不启动模型。`SecondLanguage-PermanentArchive` 每五分钟检查 storage-maintain.mjs 的普通归档队列，也接受任务末尾即时触发；同类型任务 IgnoreNew，隐藏运行。两者与原有日课、雅思监测独立，不改休息设置。运行需当前 Windows 用户会话、有效网络及相应登录。正式 credentials 文件通过包装脚本的 CredentialFile 指向本机忽略路径。

末尾 check-balances.mjs 更新余额页，并排入永久归档；migrate/packs/backup 由独立服务执行，不阻塞下一份问答。状态在本机 `.cache/storage-upgrade/request.json`，成功删除，失败保留原因和需要处理标记。Cloudflare OAuth 到期由已有 Wrangler 刷新一次，刷新失败需要重新登录；不把失效凭据当额度归零。

备份恢复：`node scripts/storage-restore.mjs` 根据最近快照在 `.cache/storage-restore/` 新建两库和工作资料，核验摘要、外键、完整性，绝不覆盖生产库。快照按历史摘要读取，后来的工作文稿修改不会破坏以前的备份。详细永久原件、音频包、兼容回退与临时页排除规则见 STORAGE.md；QA 契约见 CHAPTER_QUESTIONS.md。

生产库不可用时使用 `node scripts/storage-restore.mjs --direct`：只需有效 Microsoft 应用目录授权，从 app folder 的 recovery-index.json 读取快照位置，不读 Cloudflare 或 publisher 凭据。快照附有全部分块的直接 itemId，重建的原件目录仍包含永久文件版本索引；恢复后再建立新 Cloudflare 资源与服务器授权。

成功点读现用 pronunciation_results 的二进制摘要与 chapter_audio_scopes/chapter_audio_clips 的紧凑关系；migrate 核验原字节后转存完整描述，不重新合成。旧 URL、既有音频包及旧对象目录可继续读取。备份本身直接写 OneDrive，不为每次快照扩大 D1 目录；成功结果与章节关联采用追加检查点，其他小表完整导出。新数据页 gzip 压缩，旧快照仍兼容。恢复检查点遗失时从独立 OneDrive 恢复索引重建，永久资产不自动清理。

该通路验证：`node scripts/check-compact-pronunciation.mjs`、`node scripts/check-storage-scan.mjs`、`node scripts/check-storage-read.mjs`；真实恢复运行 storage-restore --direct，在独立目录验证。新表容量模型 research/d1-production-registry-capacity-2026-10-06.json 包含完整三摘要与每段一个章节关联，不能等同两库总空间。归档结果保存实际 capacity，120 MiB 提示核查、160 MiB 前安排维护；点读入口在练习库 200 MiB 或应急音频 31 MiB 时停止新的收费调用，原结果继续复用。检查点表不允许直接改行/删除；未来修订应采用新生成身份，结构迁移需要重新核验检查点。

## 任务末尾额度更新

执行本协议所涉及的日课、推送、练习建设、批改、声音分析或测试工作时，最后按 `protocol/BALANCES.md` 查询各方额度，携带核对时间、核实状态与任务用量估算，发布更新到余额页并提示低额度。页面显示上一次任务的记录，浏览时不实时查询。不自动付款，不安排余额不足后的跨日轮询/重试；已有材料与未知计费保护继续有效。

## iPhone 阅读器交互检查

正式交互规则见 `protocol/READER_INTERACTION.md`。`node scripts/check-reader-ui.mjs` 用隔离接口检查前端草稿、手势、雅思科目导航、计时与上传保护；需要 Playwright 和 Chromium，截图留在忽略的 `.cache/reader-ui/`。可设置 `UI_CHAPTER_DIR=chapters/YYYY-MM-DD` 检查真实 40 词长章，`BROWSER_EXECUTABLE` 指定已安装浏览器。与 `check-practice-closure.mjs`、`check-publishing-closure.mjs`、`check-chapter-questions.mjs` 配合验证权限、答案隐藏和状态闭环，不调用真实收费模型、不写正式学习数据。

当前壳版本 v25，新增手势、设置导航、安全文本排版和雅思工作区模块一并预缓存。发布仍使用 `scripts/deploy-app.mjs` 保留 Pages API 网关，最后执行 `scripts/check-balances.mjs`。模拟检查不能宣称真实 iPhone 的键盘、触摸和后台音频全部验收。

## 章节音频选配（v24）

v25 点读范围见 READER_INTERACTION.md 和 research/reader-point-audio-scope-2026-10-09.md。无需 D1 迁移；清洗运行 `node scripts/clean-point-audio.mjs --apply`，再运行 `node scripts/storage-upgrade.mjs packs` 并回读历史和现行版本清单。核查先于清洗写入；清洗只调整可变清单，保留收费原件及不可变恢复索引，不调用模型。

见 protocol/AUDIO_CONFIGURATION.md。main D1 增量迁移 0009_audio_requests.sql，原有练习库不改。node scripts/deploy-app.mjs 保留同源 Pages 网关。scripts/install-audio-task.ps1 -CredentialFile <忽略的发布凭据文件> 安装独立无窗口 SecondLanguage-AudioPreparation，每分钟检查一次，在本机在线时执行已确认的申请，不调用 Codex；其他四个任务时刻不改。node scripts/check-audio-config.mjs 检查确认与不可撤销、版本/游标和去重；现有发布/发音/UI检查同步覆盖本功能。

## Windows 构建存储（2026-10-10）

`worker/gateway/build-path.mjs` 是构建与发布输出的共同定位入口。Windows 默认输出到 `D:/CodexStorage/builds/the-second-language/pages`；可用 `SECOND_LANGUAGE_BUILD_ROOT` 指定 D 盘父目录，构建会检查其实际路径仍在 D，拒绝 C 盘或符号链接目标。非 Windows 仍使用原 `worker/gateway/dist`。

`deploy-app.mjs` 仅为当前发布进程设置 D 盘 TEMP/TMP 和 Wrangler 日志，不改用户全局环境。现有旧 checkout 的 `worker/gateway/dist` 已联接到当前 D 构建，`worker/.wrangler/tmp` 已联接到 `D:/CodexStorage/tmp/the-second-language/wrangler`。重新构建和 Wrangler dry-run 已验证实际落盘；不要让新的普通 C 目录替代这些联接。独立纪念币第二轮实验缓存也已校验迁往 D。

正式旧 checkout 与共享运行时尚未整仓迁移，生产队列仍运行在既有入口。此状态是等待安全停写窗口，不表示所有 C 数据已迁完；不能热搬活动数据库或以旧恢复副本覆盖新状态。新项目默认在 D workspace 创建。

## 句子点读与章节测试维护（2026-10-10）

当前答疑/章节测试、音频准备与归档运行器位于 `D:/CodexStorage/workspaces/second-language-maintenance`。同一隐藏 WindowsApplication 启动器与原任务互斥/触发/用户保持；新工作产物、日志、临时目录在 D。原日课与雅思运行器暂留既有工作路径，不热搬共享运行时和其他对话在用目录。

本机忽略文件 `.cache/runtime-sources.json` 的 `roots` 记录原生产工作目录。归档服务同时检查这些目录的既有待归档记录，并保存旧工作成果与新 D 工作成果，不遗落旧日课/雅思产物。既有预算计数、恢复快照、上传账本迁入 D；不能通过换目录重置归档预算保护。路径调整前保存任务 XML，核对任务空闲及互斥锁，不更改原排期或身份。

该文件的 `linkedDirectoryRoots` 记录获准归档的实际任务目录或专用父目录，路径必须绝对且可解析。当前日课 C→D 联接属于正式运行入口，不能按 `Dirent.isDirectory()` 为 false 当成不存在。新建/迁移 D 盘运行目录时同步登记；优先沿用已登记的专用日课目录，不把整个 D 盘列为允许来源。归档核查真实目标，未登记顶层联接会使本轮失败并保留待办，任务内部联接继续跳过；目录名含凭据保护关键字也不打包。`node scripts/check-work-archives.mjs` 验证 Windows junction、超 8 MiB 分块重建、历史摘要复用、凭据目录和外部联接边界。只改此本机归档器不需要部署 Worker 或 Pages。

`retire-word-audio.mjs --apply` 从既有不可变章节清单按原件摘要重新打包句子，下载每个旧包一次；不调用模型，不删除收费原件及历史索引。`clean-point-audio.mjs` 的全池关联修复仍保留供单独维护，常规取消词汇功能无需扫描全部付费返回。

章节测试运行 `question-worker.mjs` 与现有答疑共用排队；`--tests-only` 可进行明确的实际出题验收。数据库迁移 0010 新增测试状态、0011 清除未执行下一章选配中的词汇项，原件未删除。测试前后均查询额度，正式认证与纪念币仍不启用。

## 词源与章节质检（v34）
新课先读 ETYMOLOGY.md；`node scripts/lookup-textbooks.mjs YYYY-MM-DD word [related-word]` 从固定 VIX 资料取得候选和原文定位。首次安装本更新对主库执行 `0014_chapter_quality.sql` 迁移，再部署 Worker 和 Pages。原 `run-questions.ps1` 自动处理 chapter-quality，无新监测器或订阅；work/quality 纳入永久工作归档。每个自然工作块可让出给答疑/测试，失败由界面明确继续。

确定性检查：`node scripts/check-chapter-quality.mjs`（内存库、来源引用、范围、签发竞争及完整执行器夹具）；`node scripts/check-reader-ui.mjs`（iPhone 视口隔离界面）；原答疑/章节测试检查继续适用。语义校准仅显式执行 `node scripts/calibrate-chapter-quality.mjs --execute`，使用既有 Codex 额度；结果是小样，不等于全章准确率。完整报告、证据和模型返回在文件基座，D1 仅指针和进度。
