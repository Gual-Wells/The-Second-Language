# ChatGPT API 的独立 Codex 接手

2026-11-01 用户决定：第二系列各项目的 ChatGPT API 工作失败后，应有本机 Codex 自动化接手路径。既有 API 模型与档位不变；后台 Codex 的新调用统一 high，文本使用 gpt-6.1-sol、图片理解使用 gpt-6.1-terra。本协议只覆盖 ChatGPT API 适配，不用 Codex 伪造 Kokoro 音频、Whisper 转写或腾讯评分。

## 任务与原件

章节答疑仍优先沿 cloud-v1、固定章节 digest 和完整会话执行。明确 API 拒绝、网络结果未知、配置不可用或答复格式无效后，原问题沿原 ID 进入本机接手队列。原 API 的 attempt、响应、usage、unknown/sending 状态保留，不重新发送 API，也不把一次 Codex 接手伪称原 API 成功。

`codex_fallback_json` 保存 schemaVersion、from、apiAttempt、apiOutcomeUnknown、at、reason；业务路线转 legacy/pending，撤销原 claim。新独立 claim 与同版全文/会话绑定，完成继续使用原答案与通知 outbox 事务。API 迟到受路线/claim 保护，不能覆盖 Codex 答案、追加第二个回复或再次触发通知。已保存完整有效 API 答案而回推中断时，先恢复该答案；原件暂不可读时不盲目新生成。

新增 0028 迁移只为已有失败且没有完整成功原件的 cloud 问题建立同样接手标记；不迁移旧 legacy 未知发送，不改过去回答。用户重试 Codex 已知失败时保 legacy，不能因 API 开关开启又回到付费 API。Codex 自身的未知调用保原 started 标记，先找回原结果，不能自动再发。

## 执行与响应时间

`scripts/question-codex-fallback-worker.mjs --once` 只领取一份带接手标记的任务；不读取 API key、不调用 Responses API。统一隐藏系列泵负责检查和并发，计划检查间隔为 15 秒；是否已部署、实际周期与共享并发以本轮安装回执为准。电脑关闭、未登录 CLI、网络不可用或前一任务仍占用时不能保证 15 秒开始，更不能保证 15 秒完成。旧一分钟 ChapterQuestions 仍只承担章节测试、口答核对及质检，不另启一个问答 API 轮询器。

项目受保护的 `/api/questions/jobs/fallback-status` 仅向既有发布身份返回 pending 布尔、数量及在途数，不返问题、正文、账户或答案。系列管理员的存储/用量角色不因此取得私人任务权限；本机各执行器使用各自既有凭据。

API 新增 45 秒响应头连接截止：未取得响应头时可停止等待并保存未知状态；取得响应头即取消该计时，之后 SSE 沿原 600 秒完整任务时限。不能用 45 秒全请求 signal 误杀较长正文流。明确 HTTP 错误立即接手，不等待原五分钟工作租约到期。

## Codex 隔离与复用

共用 `scripts/lib/codex-data-runner.mjs` 使用订阅认证、`--output-schema`、`--ephemeral`、固定模型/high、独立 D 盘目录及最小环境；不把 API key、发布 token 或连接器给模型。现役 CLI 已实际接受同套禁用工具/子代理参数，执行为 read-only，模型只解释 stdin 数据；图片需要时通过原生 `-i` 附件传入，不能由模型自行检索别的文件或发外部请求。

identity/inputDigest 在调用前冻结。独占 started 标记阻止同输入并发重复；成功保存受检结果与摘要后可重推复用。返回数据仍须经过项目业务校验、原 generation/claim/owner/version CAS，schema 成功不代表语义已正确。CLI 诊断、SQL 夹具、线上实际接手、真机通知分别验收，不互相替代。

本机接手会使用 Codex 订阅额度，额度未知或不足时保任务；不新增购买、充值、订阅或跨日付费 API 重试。
