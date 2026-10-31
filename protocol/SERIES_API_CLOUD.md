# 第二系列 API 云端执行

2026-10-31 用户决定：第二语言、第二算法、课表、账单的共用 ChatGPT API 任务均应在电脑关闭后执行。这里只迁移这些 API 任务；Codex 教材研究、出版和既有休息安排各沿原协议。

## 运行与权限

- `worker/api-clock` 是无数据库、无密钥的定时路由器。每分钟通过 Cloudflare 原生 Service Binding RPC 调用四个固定项目入口的 `run()`；不接收任务输入，也不返回私人结果。
- 各入口只使用自身数据库、既有队列和业务完成事务。第二语言的管理权限限于路由与汇总额度，不绑定其他项目数据库。
- 第二语言、课表的原提醒 Cron 保留；API 执行是另一 RPC invocation，不与提醒合用 Free D1 每次 50 查询预算。第二算法由独立 Worker 执行，正文上下文由 Pages 从固定版本准备，禁止截断或改用新版本。
- 入口为 `LanguageAPIExecutor`、`AlgorithmAPIExecutor`、`ScheduleAPIExecutor`、`LedgerAPIExecutor`。均不提供公开 HTTP 的运行接口，不接受调用者指定任务、账户或原文。

## 共用传输

权威实现是 `worker/src/shared/cloud-responses.mjs`，其他项目保留同字节副本及 MIT `eventsource-parser`。发送标记在唯一一次 provider POST 之前持久保存；请求仅存摘要，不复制图片 data URL。完整 SSE 原件分块保存，完整终态先保存再提交业务结果。流帧沿已有成熟解析器处理，不自行按换行猜帧。

同一个任务与 attempt 的已存成功结果只补业务提交，不再次生成。断流、5xx、发送后终止以及结果持久化不明均保留为待核对；不能因新机器、新代次、反馈或配置变化自动重发。收到终态后不等待 EOF。分片不拆 Unicode 代理对；wire 上限 2 MiB，每片最多 256 Ki 字符且低于 D1 行上限。

每项目用持久锁限制同时一份调用；租约续期保留业务 fencing。现有模型档位与完整任务语义保留，不以云化为由换模型或缩短正文。

## 迁移

旧任务保留 `legacy`，新任务只在 `API_CLOUD_ENABLED=true` 时进入 `cloud-v1`。已有收费结果及未知结果不自动重排。用户明确重试已知失败或反馈旧事项时，才允许建立新的 cloud attempt，并以原状态、代次、错误和版本 CAS 防止并发绕过 unknown。

启用前必须完成：各自数据库迁移、保护密钥绑定、各执行器发布、静态壳及 Pages 问答上下文支持、真实小样验证和队列只读核对。旧本机执行器在这个窗口内保留；不能仅凭代码提交或 dry-run 停用。停用仅限 API 任务，不停日课出版、提醒或归档服务。

当前开发提交默认关闭云开关。已建空 Secrets Store 和账单独立 D1，保护入口中的密钥配置及真实云调用尚待完成；代码与 mock 成功不等同生产云化成功。

## 密钥与额度

仅由 Cloudflare Secrets Store 保护入口保存 `SECOND_SERIES_OPENAI_KEY`，权限 `Workers`，各实际执行器引用绑定。Agent 不读取本地明文再上传，不把密钥放进配置、日志、Git、对话或前端。平台填写入口是 https://dash.cloudflare.com/?to=/:account/secrets-store 。

每项目只上报 token、响应数、未知/处理中计数和时间；第二语言的固定 RPC 接收器分别绑定来源。不传 task、请求/响应 ID、章节、图片、问题或答案。完整累计快照按来源替换，重复上报不重复相加；本机旧用量另存 `local-shared`。用量更新时间与余额证据时间分离，未知费用不冒称零，云用量不能刷新旧余额的核实日期。

账单是新项目，当前有云识别后端基础，正式 PWA 登录、上传审核与真实现金账尚未接入。账单图片确认后按默认 72 小时清理；未确认默认 7 天。图片不进入永久文件归档或请求副本；只长期保留文字、核对信息与收费证据。此期限是业务数据库的删除期限，平台自身短期恢复窗口按平台规则处理。

验证入口：`scripts/check-cloud-responses.mjs`、`check-cloud-questions.mjs`、`check-series-usage.mjs`、`check-series-usage-ui.mjs`、`check-series-api-clock.mjs`；其他项目沿其独立检查。真实部署仍须验证匿名边界、现有身份、旧历史、运行日志和收费次数。
