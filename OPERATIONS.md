# 运行与部署

此文件只说明工具如何连接；每天推荐、词典整合与创作判断以 `protocol/` 为准。运行命令均从项目根目录执行。`work/runs/` 可自由存放续作资料，不把密钥放进去。

## 本地阅读器

```sh
node scripts/serve.mjs
```

打开 `http://127.0.0.1:4173`。演示章节只有两个词，不是正式课程，也不会写入 VIX。

## 每日 Codex 任务

在 Codex 桌面端将定时任务绑定本仓库，使用 `gpt-6-sol`、`high`。任务提示词可直接写：

> 阅读本仓库 AGENTS.md 与 protocol/DAILY_RUN.md，按当前日期继续或开始每日第二语言课程运行。充分使用 work/runs/<日期>/ 的中间文档，完成 100 个主词的推荐、VIX 标注、双教材完整整合、三部分正文与发布；运行窗口结束时记录 resume.md，并在下一次唤醒继续同一运行。

定时任务与机器保持运行。若当日工作未结束，下次唤醒继续 `work/runs/<YYYY-MM-DD>/`；不要重新选词。目标日期和 VIX 的 `MM-DD` 标注标签必须分别保存。

可用的确定性工具：

```sh
node scripts/prepare-vix.mjs YYYY-MM-DD
node scripts/vix-candidates.mjs --vix=<VIX目录> --out=work/runs/YYYY-MM-DD/candidates.json
node scripts/feedback-snapshot.mjs YYYY-MM-DD
node scripts/mark-vix.mjs --vix=<VIX目录> --selection=work/runs/YYYY-MM-DD/selection.json
node scripts/publish-vix.mjs --vix=<VIX目录> --selection=work/runs/YYYY-MM-DD/selection.json
node scripts/pack-chapter.mjs YYYY-MM-DD
node scripts/publish-chapter.mjs YYYY-MM-DD
```

`prepare-vix` 将 VIX 的当前 `main` 固定到 commit，并下载辅助索引、两份 textbook 和构建脚本到 `.cache/vix/<commit>/`；它要求运行环境可访问 GitHub API 和 raw 文件。若命令行网络不可用，Codex 可用已连接的 GitHub 仓库工具取得同一 commit 的文件。`publish-vix` 要求 `GITHUB_TOKEN` 或 `GH_TOKEN`，反馈与章节发布要求 `SECOND_LANGUAGE_API_URL`、`SECOND_LANGUAGE_PUBLISH_TOKEN`。给定日期正式正文存于 `chapters/YYYY-MM-DD/chapter.md`；同目录 `meta.json` 需含 `date`、`title`、`subtitle`、`number`、`wordCount: 100`、`runId`、已提交的 `vixCommit` 和 `protocolCommit`。`pack-chapter` 会检查两部分各有相同顺序的 100 个主词。

## Cloudflare 资源与发布顺序

需要有权限的 Wrangler 会话。先在 `worker/` 安装 `pnpm install`，创建 D1 数据库 `the-second-language` 与 R2 bucket `the-second-language-chapters`，把实际 D1 ID、正式 Pages 域名及推送公钥填入 `worker/wrangler.jsonc`。Pages 域名要同时填入 `APP_ORIGIN` 与 `APP_URL`；`APP_ORIGIN` 不带尾部斜线。Worker 名为 `the-second-language-api`，Pages 项目名为 `the-second-language`，网关通过同域 service binding 调用 Worker。

1. 在 Worker 配置目录运行 D1 migration：`wrangler d1 migrations apply DB --remote`。
2. 将 `PUBLISH_TOKEN`、`ENROLLMENT_KEY`、`VAPID_PRIVATE_KEY`、`VAPID_SUBJECT` 设为 Worker secrets；将 VAPID 公钥配置为 `VAPID_PUBLIC_KEY`。发布 token 只给 Codex 的发布环境，不交给浏览器。推送不用时可暂不配置 VAPID。
3. `wrangler deploy` 发布 API Worker。执行 `node gateway/build.mjs`，再在 `worker/gateway/` 按该目录配置发布 Pages。Pages `API` service binding 指向已发布的 Worker。
4. 用 `worker/admin/open-enrollment.sql` 将单人通行密钥登记窗口开放五分钟，再在正式站点输入初始化密钥登记。成功后窗口关闭。需要重置时按 `worker/admin/reset-auth.sql` 明确操作。
5. 首次真实章节按 `protocol/DAILY_RUN.md` 完成、暂存并提交。确认按日期可读后才发送新章推送。

本仓库不保存实际 secrets、Cloudflare 资源 ID 或真实学习内容的演示替身。部署前把配置中的占位值换成实际资源，不要发布占位配置。
