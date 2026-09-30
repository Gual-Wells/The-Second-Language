# 第二语言

GitHub 仓库：[Gual-Wells/The-Second-Language](https://github.com/Gual-Wells/The-Second-Language)。本仓库包含课程生成协议、VIX 数据操作工具、阅读 PWA 与 Cloudflare 服务端。

线上阅读器：[the-second-language.pages.dev](https://the-second-language.pages.dev/)。云端服务已部署，首次通行密钥已登记；正式 100 词章节仍需完成。

一个由 Codex 建设每日英语课程、由 PWA 按日期与章节阅读的个人项目。项目目前处于初建设阶段：优先把推荐、完整内容建设、阅读与反馈通路做成可用的整体。`protocol/` 是供 Codex 定时任务执行的工作说明；`work/` 用来保存运行中的判断和进度；最终课程正文只包含协议规定的三部分。

## 目录

- `protocol/`：推荐、文档建设及每日运行说明。
- `scripts/`：读取 VIX 索引、标注 VIX、整理与发布章节的辅助命令。
- `web/`：面向 iPhone 17 的日期、章节、正文阅读和学习反馈 PWA；沿用课表项目的 2008 年风格蓝色界面。
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

将 Codex 桌面端定时任务绑定到此 Git 项目的固定工作目录，选择 `gpt-6-sol` 与 `high`，提示词指向 `AGENTS.md` 和 `protocol/DAILY_RUN.md`。每天的实际运行以 `work/runs/<run-id>/` 的中间文档续作，不依赖聊天历史。定时任务需要本地项目可用、电脑和桌面应用运行，并预先具备 VIX 写入与后端发布权限。若任务使用另一工作树，需让 `SECOND_LANGUAGE_CREDENTIAL_FILE` 指向本机忽略的发布凭据文件，并保持同日期中间文档可续用。

当前未创建真实 Codex 定时任务。线上尚无正式课程章节。

正式课程使用 `YYYY-MM-DD` 日期；VIX 辅助索引源文件中的已推荐标记只使用 `MM-DD`。`chapters/demo/` 是两词交互演示，不代表正式课程。正式章节须完成 100 个主词及其关联派生词的建设，并按 `protocol/DAILY_RUN.md` 发布。

## 云端架构

`worker/` 延续课表项目的同域 Pages 网关 → Worker → D1 模式。`worker/migrations/` 建立章节索引、阅读状态和认证表。章节正文以内容摘要作为不可变 KV key 写入 `CHAPTERS`，D1 持有当前发布版本与元数据。KV 跨地区传播可能延迟，因此新章推送在发布至少两分钟后发送。浏览器读写使用通行密钥会话，Codex 发布使用单独的 `PUBLISH_TOKEN`。
