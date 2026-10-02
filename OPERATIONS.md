# 运行与部署

此文件只说明工具如何连接；每天推荐、词典整合与创作判断以 `protocol/` 为准。运行命令均从项目根目录执行。`work/runs/` 可自由存放续作资料，不把密钥放进去。

## 本地阅读器

```sh
node scripts/serve.mjs
```

打开 `http://127.0.0.1:4173`。演示章节只有两个词，不是正式课程，也不会写入 VIX。

## 每日 Codex 任务

本机的定时任务每日北京时间 **03:00** 调用 `scripts/run-daily.ps1`，由已登录的 Codex CLI 以 `gpt-6-sol`、`high` 运行本协议。先领取后端一次性控制状态；休息开关只跳过下一次定时运行并自动复位。任务提示词核心为：

> 定时入口先领取当天运行控制，休息则直接结束；非休息日 Codex 阅读 AGENTS.md、protocol/DAILY_RUN.md、protocol/QUALITY_WORKFLOW.md、protocol/CONTENT.md、protocol/TEMPORARY.md 和 protocol/ANNOTATIONS.md，先处理已领取的临时需求，再完成 40 个主词的推荐、VIX 标注、逐词双教材交接、三部分正文、语义审阅与发布。续作写入 work/，未完成时记录 resume.md。

定时任务与机器保持运行。若当日工作未结束，下次唤醒继续同一工作目录下的 `work/runs/<YYYY-MM-DD>/`；不要重新选词。使用另一工作树时，把 `SECOND_LANGUAGE_CREDENTIAL_FILE` 指向本机忽略的 `.cache/deployment-secrets.json`，并确保中间文档可续用。目标日期和 VIX 的 `MM-DD` 标注标签必须分别保存。

可用的确定性工具：

```sh
node scripts/prepare-vix.mjs YYYY-MM-DD
node scripts/claim-run.mjs YYYY-MM-DD
node scripts/vix-candidates.mjs --vix=<VIX目录> --out=work/runs/YYYY-MM-DD/candidates.json
node scripts/feedback-snapshot.mjs YYYY-MM-DD
node scripts/mark-vix.mjs --vix=<VIX目录> --selection=work/runs/YYYY-MM-DD/selection.json
node scripts/publish-vix.mjs --vix=<VIX目录> --selection=work/runs/YYYY-MM-DD/selection.json
node scripts/pack-chapter.mjs YYYY-MM-DD
node scripts/publish-chapter.mjs YYYY-MM-DD
node scripts/build-review.mjs work/temporary/ID/plan.json
node scripts/publish-temporary.mjs --page=work/temporary/ID/page.json
node scripts/delete-temporary.mjs 临时页ID
```

`prepare-vix` 将 VIX 的当前 `main` 固定到 commit，并分段下载辅助索引、两份 textbook 和构建脚本到 `.cache/vix/<commit>/`，逐文件验证 Git blob 摘要；它要求运行环境可访问 GitHub API 和 raw 文件。若命令行网络不可用，Codex 可用已连接的 GitHub 仓库工具取得同一 commit 的文件。`publish-vix` 优先使用 `GITHUB_TOKEN` 或 `GH_TOKEN`，没有环境变量时读取本机 GitHub Git 凭据。反馈与章节发布优先读取环境变量 `SECOND_LANGUAGE_API_URL`、`SECOND_LANGUAGE_PUBLISH_TOKEN`；本机部署环境也可从忽略的 `.cache/deployment-secrets.json` 自动取得发布 token，默认连接线上站点。给定日期正式正文存于 `chapters/YYYY-MM-DD/chapter.md`；同目录 `meta.json` 需含 `date`、`title`、`subtitle`、`number`、`wordCount: 40`、`runId`、已提交的 `vixCommit` 和 `protocolCommit`。`pack-chapter` 会检查两部分各有相同顺序的 40 个主词。

内容续作以 `work/runs/<date>/words/` 的逐词材料、`article-plan.md`、`article.md`、`continuity.md` 和必要时的 `resume.md` 为交接点；这些文件由 Codex 按内容自由写，不进入发布正文。`pack-chapter` 能核对第三部分带或不带 `USE` 的句子都已逐句翻译，并核对每个用法至少被标出一次；教材保真与用法是否真实成立仍由 Codex 在发布前审阅。

## Cloudflare 资源与发布顺序

现有站点位于 `https://the-second-language.pages.dev/`。Worker 名为 `the-second-language-api`，Pages 项目名为 `the-second-language`。D1 数据库 `the-second-language` 存章节发布索引、阅读状态和认证资料；KV 命名空间 `the-second-language-chapters` 按摘要存正文。账号 R2 尚未启用，因此项目不依赖 R2。资源 ID、公钥和域名已写入 `worker/wrangler.jsonc`；密钥保存在 Cloudflare secrets 和本机忽略的 `.cache/deployment-secrets.json`，切勿提交。

表达练习使用单独 D1 `the-second-language-practice`，数据库绑定 `PRACTICE_DB`，迁移目录为 `worker/practice_migrations/`。在 `worker/` 运行 `wrangler d1 migrations apply PRACTICE_DB --remote`。表达练习的文字作答不进入原有 `DB` 或 Git；PWA 录音提交未启用，不能用 D1 BLOB 顶替对象存储。可选 `PRACTICE_READ_TOKEN` 是未来 Chat/MCP 只读接入的独立 Worker secret；不得向 Chat 提供 `PUBLISH_TOKEN`。本机 `scripts/practice-job.mjs` 的建设与批改命令仍使用发布令牌。

表达练习监测脚本 `scripts/run-practice.ps1` 先通过 `node scripts/practice-job.mjs next` 轻量检查申请与答卷队列；空队列不启动模型，有工作才使用 `gpt-6-sol`、`high` 继续 `work/expression/` 的中间文档。该脚本与每日 03:00 日课独立，部署与本地凭据确定后可另设周期性 Windows 任务；若在另一 worktree 运行，先设置 `SECOND_LANGUAGE_CREDENTIAL_FILE` 为当前机器上忽略的正式凭据文件。手动命令：

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
3. 在 `worker/` 运行 `wrangler deploy` 发布 API Worker，执行 `node gateway/build.mjs`，再运行 `wrangler pages deploy dist --project-name the-second-language --branch main --cwd gateway` 发布 Pages。Pages `API` service binding 指向已发布的 Worker。
4. 在 `worker/` 运行 `pnpm exec wrangler d1 execute DB --remote --file=admin/open-enrollment.sql`，将单人通行密钥登记窗口开放五分钟。读者在正式站点点击“登录”，输入本机 `.cache/deployment-secrets.json` 中的 `ENROLLMENT_KEY`，完成设备通行密钥登记与登录。成功后窗口关闭。需要重置时按 `worker/admin/reset-auth.sql` 明确操作。
5. 首次真实章节按 `protocol/DAILY_RUN.md` 完成、暂存并提交。KV 在不同地区可能延迟可见；后端在发布至少两分钟后才尝试新章推送，并只推送当前版本。正式发布后须从线上按日期回读。

本仓库不保存实际 secrets，也不把两词演示章节当作正式课程。需要重新部署到另一账号时，应重建资源并更换配置中的资源 ID 与域名。
