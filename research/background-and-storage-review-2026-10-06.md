# 后台体验修复与永久存储组织复核

## 本次后台修复

实际四个任务原先直接启动 powershell.exe。答疑每分钟、归档每五分钟，已有 Hidden 参数仍可能在控制台创建后才隐藏；日课和雅思尚无隐藏参数。日课本轮正在运行，不中止工作，只隐藏已确认属于项目的窗口。

采用 .NET Framework WindowsApplication 启动器，编译为 Windows 子系统程序，自身无控制台；以 CreateNoWindow=true、UseShellExecute=false 启动 PowerShell，重定向标准输出/错误。复用 Windows 自带运行时，不引入 VBScript 依赖、常驻服务或新的模型账户。安装只替换四个任务的 action，版本化 exe 避免覆盖正在运行的启动器；安装前备份 XML，失败回滚 action。

本机验证：

- exe PE 子系统为 2（Windows GUI），不是控制台程序。
- 实际 PowerShell 测试进程 GetConsoleWindow 返回 0；含空格路径及参数往返一致。
- 退出 0/7 分别准确传回 0/7，中文日志正确。
- 四个任务的 triggers、principals、settings XML 安装前后完全一致。
- 正式答疑空检查通过新任务执行成功，未触发模型。
- 正在运行的日课窗口已隐藏，原进程继续运行。

空队列不启动 Codex。普通 HTTPS 轮询依然消耗网络与 Cloudflare 请求量；实际教学分析仍使用 Codex 套餐额度。当前运行前提仍是电脑、Windows 用户会话、网络与登录有效。

## 存储的实际组织

| 层 | 实际职责 | 运行上的变化 |
|---|---|---|
| 主 D1 | 课程身份及版本、会话、答疑队列、运行状态、文件位置/摘要/历史版本 | 查询状态留在关系库，正文和大文件通过索引取回 |
| 练习 D1 | 雅思申请、题目、参考答案、答卷、采集记录和批改关系 | 独立业务关系保存，点读 BLOB 经核验迁出到文件键 |
| OneDrive 应用目录 | 正文永久文件、点读与练习音频、原声、原始模型返回、过程材料与快照 | 文件按 SHA-256 去重；逻辑键更新保留旧版本；回读摘要成功才登记 |
| 近期 KV | 三十天章节缓存及故障兼容副本 | 缓存过期回读永久原件，不重付音频生成 |
| 设备 CacheStorage | 用户打开章节后的已有音频包 | 默认预下载，可关闭；缓存可清理，退出清除，不充当永久原件 |
| 恢复快照 | 两库结构/数据、过程资料分块、资源 itemId 与独立恢复索引 | 可以仅凭 Microsoft 授权恢复到独立目录，无须生产 D1 健在 |

详细权威协议为 protocol/STORAGE.md；上一轮真实发布与验证为 research/service-and-storage-release-2026-10-06.md。本次复核本机保存的恢复结果：普通恢复 main 1,160 行、practice 6 行、1,287 份工作资料；仅 Microsoft 直接恢复 main 1,208 行、practice 11 行、1,338 份工作资料，两次完整性与外键均通过。这是已发生的测试记录，不宣称本轮重做了全量恢复。

六段既有 Bella 音频及一份正式全文已经真实迁移核验；正式私有读取、Range、旧版文件读取、缓存缺失、重复点读复用和音频包预下载已验证。改动改变了线上写入、定位、读取、缓存失效和故障恢复路径，具有真实运行意义。

## 界限

OneDrive 是大文件库，1 TB 不是 D1 SQL 容量；业务关系仍由两份 D1 承担。单文件接口及免费 Worker 外部请求限制仍存在，原声按轮分批采集，每轮一个新模型调用。订阅与有效授权需要持续维护。文件存储失败保留原副本/待归档，不将未知收费结果重新生成；本机过程资料未完成归档时，关机不会使它立即进入云端。新启动器解决桌面闪窗，不把本地服务变成全天在线云端服务。

## 官方依据

- [Microsoft ProcessStartInfo.CreateNoWindow](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.processstartinfo.createnowindow?view=netframework-4.8.1)：与 UseShellExecute=false 配合避免创建控制台。
- [OpenAI Codex 配置参考](https://learn.chatgpt.com/docs/config-file/config-reference)：个人访问、审批和应用工具默认权限的配置字段。个人配置备份及实际账户信息未进入公开仓库。
