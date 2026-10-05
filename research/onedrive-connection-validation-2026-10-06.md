# OneDrive 接入验证

用户已完成中国家庭版试用订阅及仅个人账户的应用注册。客户端 ID 是公开应用标识，不是授权凭据。

当前增加 `scripts/onedrive-connect.mjs` 与 `scripts/lib/onedrive-local.mjs`，只验证个人账户的设备授权和 Graph 文件通路，不修改生产存储、VIX、休息设置或现有音频。

## 账户操作

应用注册 → The Second Language → 身份验证 → 高级设置 → 允许公共客户端流：是 → 保存。

验证采用 `consumers` 的设备授权，不需要用户创建或发送客户端密钥，也不需要回调 URI。正式 Cloudflare 后端持续授权与凭据存储另行建设；不能把本机验证通过当成后端迁移完成。

## 工具

```powershell
node scripts/onedrive-connect.mjs begin <客户端ID>
node scripts/onedrive-connect.mjs finish
node scripts/onedrive-connect.mjs verify
node scripts/onedrive-connect.mjs verify <已有音频文件绝对路径>
```

准备好登录后才 begin，按真实响应给出的网址、代码和有效期完成授权。权限先使用 `Files.ReadWrite.AppFolder` 与 `offline_access`，不默认扩大到整个网盘。如果容量查询或其他操作被此权限拒绝，保留该结果，再判断端点或权限调整。

凭据及待授权设备代码使用 Windows DPAPI 当前用户加密，放入受 Git 忽略的 `.cache`。凭据不写命令行参数、环境变量、日志或研究报告；刷新成功后保存新凭据。它们只适用于当前 Windows 用户，不直接复制密文到 Cloudflare。

验证步骤独立记录：应用目录、全账户容量、刷新令牌续期、独立小文本上传/完整下载/哈希核对、音频文件往返和 Range 读取。默认音频只是 0.1 秒静音 WAV 探针，不代表 Bella、MP3 解码、Cloudflare 播放代理或 iPhone 播放已经验证。真正音频可提供已有文件，无需收费重新生成。

本轮独立验证文件留在应用目录中，名称包含随机运行标识；不覆盖正式文件。结果写 `.cache/onedrive-verification.json`。下载跳转到预授权 URL 时不转发 Graph Bearer Token，也不在日志里打印预授权 URL。

后续依次验证 Cloudflare 私有访问、iPhone 真实音频播放、上传会话与大文件、存储原件及兼容读取，再迁移永久数据。任务实际结束时按已有 `BALANCES.md` 更新额度快照。

## 已取得的实际结果

北京时间 2026-10-06 01:35 起完成本机验证，结果保存于忽略目录中的 `onedrive-verification.json`：

- 本人已完成微软设备授权，权限保持 `Files.ReadWrite.AppFolder`，没有扩大到整个网盘。
- `/me/drive/special/approot` 创建并返回 `Apps/The Second Language`。
- 容量查询成功，返回 `driveType=personal`、状态 `normal`，总容量 `1104880336896` 字节；查询时使用量 `1255767` 字节。此接口快照取得于测试文件上传前，不当作上传后的精确当前用量。
- 刷新令牌实际换取新访问凭据成功，并保存新凭据。
- 51 字节文本上传后完整下载，SHA-256 一致；Range 返回 206 且字节一致。
- 复用已有 Bella 单词 MP3，7488 字节，上传后完整下载摘要一致；Range 返回 206 且字节一致。没有新 TTS 消耗。
- 此结果证明家庭版试用的个人网盘可以使用所需基本文件接口。仍没有验证 Cloudflare 到 Graph 的实际连接、iPhone 播放、长期刷新或批量迁移，因此生产存储不切换。

依据：[设备授权](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-device-code)、[公共客户端配置](https://learn.microsoft.com/en-us/entra/identity-platform/scenario-desktop-app-configuration)、[应用目录权限](https://learn.microsoft.com/en-us/graph/onedrive-sharepoint-appfolder)、[文件下载与 Range](https://learn.microsoft.com/en-us/graph/api/driveitem-get-content?view=graph-rest-1.0)。

## 同日后续正式实施

以上“未验证、暂不切换”属于 01:35 接入阶段。随后已完成 Cloudflare 到 Graph 私有存取、既有全文/六段点读迁移、正式 Range 读回、章节包复用、普通恢复及不依赖 Cloudflare 的直接恢复，生产已启用永久存储。完整结果与真机验证边界见 [正式升级记录](service-and-storage-release-2026-10-06.md)，执行按 OPERATIONS.md / protocol/STORAGE.md；不得用本节前的阶段性限制覆盖后续已验证设施。
