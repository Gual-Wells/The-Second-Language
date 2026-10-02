# 第二语言

GitHub 仓库：[Gual-Wells/The-Second-Language](https://github.com/Gual-Wells/The-Second-Language)。本仓库包含课程生成协议、VIX 数据操作工具、阅读 PWA 与 Cloudflare 服务端。

线上阅读器：[the-second-language.pages.dev](https://the-second-language.pages.dev/)。云端服务已部署，首次通行密钥已登记；正式 40 词章节仍需完成。

一个由 Codex 建设每日英语课程、由 PWA 按日期与章节阅读的个人项目。项目目前处于初建设阶段：优先把推荐、完整内容建设、阅读与反馈通路做成可用的整体。`protocol/` 是供 Codex 定时任务执行的工作说明；`work/` 用来保存运行中的判断和进度；最终课程正文只包含协议规定的三部分。

## 目录

- `protocol/`：推荐、文档建设、长篇质量工作流、章节内关联编码及每日运行说明。
- `research/`：百词旧稿与三词交互稿的对照研究；分析依据与尚未固化的备选做法。
- `scripts/`：读取 VIX 索引、标注 VIX、整理与发布章节的辅助命令。
- `web/`：面向 iPhone 17 的日期、章节、正文阅读和学习反馈 PWA；[界面基线](web/DESIGN.md)记录从课表项目迁移而来的完整视觉与交互规则。
- `worker/`：Cloudflare Worker、D1、KV 和单人通行密钥登录。
- `chapters/`：课程正文。`demo` 是界面演示，不是正式每日课程。
- `work/`：可自由建立的中间文档；不作为课程正文发布。

命令与部署顺序见 [OPERATIONS.md](OPERATIONS.md)。

## 本地预览

需要 Node.js 22 或更新版本。在项目根目录运行：

```sh
node scripts/serve.mjs
```

浏览器打开 `http://127.0.0.1:4173`。本地预览会使用演示章节和浏览器内的阅读状态；线上使用 Worker、D1 与 KV。

## 定时任务入口

北京时间每日 **03:00** 的本机计划任务调用 `scripts/run-daily.ps1`，使用已登录的 Codex CLI、`gpt-6-sol` 与 `high`。任务先领取后端一次性控制状态，再按 `protocol/DAILY_RUN.md` 执行；临时需求按 `protocol/TEMPORARY.md` 处理。每天的实际运行以 `work/runs/<run-id>/` 的中间文档续作，不依赖聊天历史。定时任务需要本地项目可用、电脑和 Codex 登录状态有效，并预先具备 VIX 写入与后端发布权限。

线上尚无正式课程章节。

正式课程使用 `YYYY-MM-DD` 日期；VIX 辅助索引源文件中的已推荐标记只使用 `MM-DD`。`chapters/demo/` 是两词交互演示，不代表正式课程。正式章节须完成 40 个主词及其关联派生词的建设，并按 `protocol/DAILY_RUN.md` 发布。

## 云端架构

`worker/` 延续课表项目的同域 Pages 网关 → Worker → D1 模式。`worker/migrations/` 建立章节索引、阅读状态和认证表。章节正文以内容摘要作为不可变 KV key 写入 `CHAPTERS`，D1 持有当前发布版本与元数据。KV 跨地区传播可能延迟，因此新章推送在发布至少两分钟后发送。浏览器读写使用通行密钥会话，Codex 发布使用单独的 `PUBLISH_TOKEN`。

临时页有单独的索引、阅读入口与通知队列。测试页可直接复用已有文档；复习页只从正式已发布章节摘取词条、例句与第三部分对应原句。临时页发布后 48 小时失效，Worker 定时物理删除正文与索引；浏览器不会离线缓存临时正文。阅读器设置中的临时需求与休息安排均为一次性开关。

顶栏“表达练习”是按申请生成的长期第四部分练习册，来源从第一章累计到申请时的最新章，当前阅读章可作为焦点。题目、来源、写作答案、口语文字练习与反馈存于独立 D1 `PRACTICE_DB`；参考答案仅在主动揭示后返回。真实口语录音、转写和发音分析仍待私有对象存储与语音模型接入，不把文字练习当作完整口语评分。生成与批改协议见 `protocol/EXPRESSION.md`，题目研究见 `research/ielts-speaking-writing-questions.md`。

新正文按 `protocol/ANNOTATIONS.md` 在词条、用法、例句和文章句子间建立章节内编码，并为第三部分逐句配对连续可读的译文。只有真正使用目标用法的句子附 `USE` 编码与可点高光；承接句仍有译文。正式日课按 `protocol/QUALITY_WORKFLOW.md` 保存逐词材料去向、权威草稿与语义审阅结果。测试临时页的发布与删除均不写正式章节、日课运行或 VIX 标注。
