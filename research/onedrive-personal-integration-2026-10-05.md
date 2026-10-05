# Microsoft 365 个人版：第二语言接入专项研究

日期：2026-10-05，北京时间。用户已暂定采用 Microsoft 365 个人版订阅。

状态：具体平台研究与接入设计；没有购买、取得 Microsoft 授权、调用个人 Graph 文件接口或迁移生产数据。现有工程核查基线为 `f3ec4ba9c77b3d05f5a12f4fb636d8bf8b2fb509`。

> 章节读取和近期空间的后续设计见 [章节级自动预加载研究](chapter-loading-and-working-set-2026-10-05.md)：用户已修正为打开章节后默认自动下载本章已有音频，只提供一个开关；使用章节清单与批量文件块，不再按阅读位置细粒度预取，不自动预生成收费声音。

## 1. 结论和当前边界

暂定组合为 **Microsoft 365 个人版的 OneDrive 永久文件基座 + 现有 Cloudflare 后端与 D1 + 可撤除的播放缓存 + 独立本地恢复副本**。

这项订阅的容量和个人综合使用价值符合当前需求。完整生产资格仍需实际验证：自建应用注册、持续授权、个人账户上传和下载、Cloudflare 访问、iPhone 播放与历史小文件读取。购买成功不能替代上述验证。

本轮发现两个具体需要处理的事项：

1. **购买支付与开发者身份验证分开。** 中国 Microsoft 365 商店支持的支付方式不能直接证明 Entra 新账户验证接受银联储蓄卡。
2. **容量够，不代表几十万个独立文件都适合桌面同步。** 正式实现要同时规划文件数量、资产目录体积和播放范围读取。

## 2. 购买、账户与固定费用

个人版当前中国官方价格为 **398 元/年**，年付折合约 **33.17 元/月**；真正月付为 **39 元/月**。1 人使用，OneDrive 1 TB（1000 GB），最多同时使用 5 台设备。中国官方购买页列出支付宝、银联、Visa、Mastercard；具体卡种与结账方式以实际支付结果为准。[官方价格与支付](https://www.microsoft.com/zh-cn/microsoft-365/onedrive/onedrive-plans-and-pricing)

选择本人长期控制的 **个人 Microsoft 账户**作为文件所有者。学校账户可以帮助取得开发资格，但学校 OneDrive 空间不作为永久资产库。个人和工作/学校 OneDrive 不可合并，只能并行使用。[账户区别](https://support.microsoft.com/en-gb/onedrive/how-do-i-merge-my-onedrive-for-home-with-my-onedrive-for-work-or-school)

本项目不需要购买 Microsoft 365 商业版、Azure 虚拟机、Azure Blob 或 Entra P1/P2。普通文件上传、下载与目录接口不在当前 Microsoft Graph 按调用计费清单中；据此预算不另列 Graph 文件 API 调用费，但不将这解释为无限请求或无限带宽的承诺。[Graph 计费清单](https://learn.microsoft.com/en-us/graph/metered-api-list)

成本分开记录：398 元/年为个人综合订阅；OpenRouter、腾讯等生成消耗仍独立；Cloudflare 若将来需要升级，也不含在微软订阅里。初始设计不要求新增 R2 付费存储。

## 3. 应用注册：购买前值得先完成的具体检查

微软应用注册快速入门目前要求可用的 Entra 租户、活跃 Azure 订阅及至少 Application Developer 权限。新的 Microsoft Entra ID Free 账户官方说明要求信用卡验证，但 Entra ID Free 本身不收费。[应用注册前提](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app)、[免费身份服务与验证要求](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/microsoft-entra-id-free)

因此不能宣称“支付宝买完个人版就一定能注册应用”。也不能把个人版购买当成必然创建了可管理应用的企业租户。

按下列顺序检查：

1. 用本人已有 Microsoft/Azure 账户进入 [Azure 门户](https://portal.azure.com/)，查看是否已有可注册应用的目录；没有注册新租户的必要就复用已有目录。
2. 若无开发入口，尝试 [Azure for Students](https://azure.microsoft.com/en-us/free/students/)：官方注明不需要信用卡，需要学生资格验证。东北大学或 UTA 的有效学籍可以按官网要求尝试验证，未实际验证前不声称某个学籍一定合格，也不默认只能等待 UTA。
3. 已有学校租户是否允许学生注册应用，取决于学校管理员配置；不能把学生账户等同于个人拥有该租户。
4. 若上述均不可用，再评估之后的万事达能否通过验证；信用卡与储蓄卡不混称。微软商店的银联支持不用于推断 Azure 验证结果。

应用开发目录与资产所有者可以不同：注册支持个人 Microsoft 账户登录的应用，让本人个人账户授权其 OneDrive。文件持续归个人账户所有，而不是移进学校租户。

这里尚未登录用户的 Microsoft 账户查看实际资格，不能将任何路线标为已经打通。

## 4. 持续授权与权限

个人账户采用 **用户授权的 delegated OAuth**，服务端完成授权码交换，明确请求 `offline_access`。[官方权限与 offline_access 说明](https://learn.microsoft.com/en-us/entra/identity-platform/scopes-oidc) 不把企业应用无人登录的 client-credentials 权限模型直接套到个人 OneDrive。

优先验证 `Files.ReadWrite.AppFolder`：微软官方支持 OneDrive for home，并把应用读写范围限制到 `Apps/{应用名称}`。此位置仍计入本人 OneDrive 配额，用户仍可手动修改或删除文件。[应用目录](https://learn.microsoft.com/en-us/graph/onedrive-sharepoint-appfolder)

AppFolder 与本项目需要的上传会话、指定文件下载、配额读取等端点组合必须实测。部分端点的权限表列出的是 `Files.ReadWrite`，不能仅据 AppFolder 概述断言全部兼容。若确有端点不兼容，先评估替代端点；需要扩大权限时清楚说明实际原因，不默认申请整个网盘的最高权限。

持续运行采用服务端刷新令牌；不要注册成依赖浏览器 SPA 刷新的流程。官方默认刷新令牌期限区分 SPA 的 24 小时和其他场景的 90 天，刷新会返回新令牌，令牌也可能提前被撤销。这支持平时自动续期，不能保证永远不用重新授权。[刷新令牌规则](https://learn.microsoft.com/en-us/entra/identity-platform/refresh-tokens)

工程设计：

- 客户端密钥或证书保存在 Worker 私密配置；可变刷新令牌加密保存，并持久化成功刷新后返回的新值。
- 用短期租约协调并发刷新，避免多次同时写入覆盖新凭证。租约与凭证行使用少量 D1 写入，不逐次写 KV。
- 不在 PWA、本地可公开输出、Git 或研究文档里保存令牌；日志不打印授权返回和预授权 URL。
- 用户撤销授权或出现 `invalid_grant` 时停止循环重试，保留文件与索引，提示一次重新连接。授权故障不启动 TTS。
- 密钥/证书有效期及到期提醒是维护项，不能用自动刷新令牌掩盖应用凭证自身的过期。

个人文件 API 连接不改变现有 PWA 通行密钥登录，用户不会每次播放都被要求登录 Microsoft。

## 5. 文件分配和数据库边界

| 位置 | 内容 | 原件或副本 |
| --- | --- | --- |
| 个人 OneDrive 应用目录 | 正式章节版本、题目与参考答案、音频、答卷、原声、分析 WAV、多路原始返回、过程资料、清单和数据库导出 | 正式永久文件原件 |
| 主 D1 / 练习 D1 | 登录、请求、任务状态、章节和答卷关系、当前视图、来源索引、活跃生成记录、近期位置索引 | 在线关系与控制状态 |
| Cloudflare 与手机缓存 | 经授权的近期正文和播放数据 | 可撤除副本；丢失后读取已有原件 |
| 本地非同步备份目录或独立磁盘 | 校验后的资产包、目录清单、数据库导出与恢复说明 | 独立恢复副本 |
| 临时页的独立文件区域 | 临时测试/复习页及独占附件 | 48 小时生命周期，不混入永久封装 |

OneDrive 不适合作为不断打开、修改的在线 SQLite 文件，也不会增加 D1 单库容量。D1 的静态导出可以作为档案，活跃数据库仍由 D1 服务读写。

当前核查到：`pronunciation.js` 将 MP3 存在 `pronunciation_audio.audio BLOB`；`practice-media.js` 选择 R2 或 KV；`private-assets.js` 为口语提供 KV 适配；当前 `wrangler.jsonc` 只有两个 D1 和两个 KV 的绑定，没有现成 OneDrive 或 R2 文件基座。接入不能只改一个 bucket 名称。

正式永久文件全部保留，临时页到期解除引用并清除独占文件。临时页使用了正式原声或正式音频时，仅清理临时引用，不删除共享原件。账户会话和网络缓存仍正常过期。

## 6. 容量、文件数量和索引空间

容量沿用可复算的 [容量模型](storage-capacity-forecast-2026-10-05.json)：每周 1.5 套、每套 1.5 次完整回答，全部约 15,000–16,000 主词，以及正式版本与原始证据。十年正常唯一存量 85–145 GB；压力唯一存量 230 GB；再预留 20% 空闲容量，压力规划 **276 GB**。为第二语言安排约 300 GB 规划空间，余下约 700 GB 可供本人其他用途，不把 300 GB 写成课程的硬内容上限。

1 TB 是全账户额度，个人照片、其他项目、部分邮箱附件及回收站等占用都要从真实剩余空间扣除。Graph 的 quota 提供 `total/used/remaining/deleted/state`；个人账户反映多个微软服务的统一云存储配额，不能误标为本项目独占空间。[配额字段](https://learn.microsoft.com/en-us/graph/api/resources/quota?view=graph-rest-1.0)

与容量不同，小文件数量需要处理。现有模型中央/密集/压力情景为约 272,000 / 384,000 / 496,000 个点读资产，尚未加全部保留版本和其他文件。微软建议同步总量不超过 300,000 项；超过时即使未全部同步也可能影响表现。Windows 百万项预览有指定环境要求，不作为本项目的生产前提。该建议不是 Graph 个人网盘只能存 300,000 个文件的硬上限。[文件与同步限制](https://support.microsoft.com/en-us/onedrive/restrictions-and-limitations-in-onedrive-and-sharepoint)

建议：

- 较长听力与原声保留独立文件；不改音质以压缩容量。
- 历史词汇、例句短音频可以封装为若干较小的不可变文件包，每个成员仍保存原始完整 MP3 字节、独立生成描述与摘要，并在清单里记载 offset/length。读取只拿该成员的字节，不把包解释成连续拼接播放的音轨。
- 初始验证封装约 2–8 MiB，选择满足正常播放和恢复的大小；不是正式固定上限。不把全部课程压成只能整体下载的巨大 ZIP。
- 新点读先保存独立文件或近期暂存；封装完成并逐成员核实后切换位置，才可以删除旧的独立物理副本。音频内容、生成身份和调用证据不删除。
- 音频封装不再 ZIP 压缩 MP3；较冷的 JSON 和过程文档可以可逆压缩归档。
- 历史资产详情使用分片清单；D1 保存活跃记录和粗粒度的分片位置，避免每条资产都复制一整套文本与多张关系表。近期元数据可查，冷查找从清单恢复；不在每次点击时遍历全盘。

上述分片清单用于应对 D1 索引空间的已知风险：此前 40 万条资产按每条 2–4 KB 元数据估算会占 0.8–1.6 GB，不能直接塞进一个免费 D1 库（当前免费单库上限 500 MB）。实际在线索引设计要按字段及 SQLite 索引开销再估算，文件外置不能自动消除这个问题。[D1 限制](https://developers.cloudflare.com/d1/platform/limits/)

## 7. 下载、iPhone 点读与复用

```text
iPhone PWA → 原有 Cloudflare 鉴权和业务 API
             → D1 / 分片清单定位稳定资产
             → 命中播放缓存，或读取个人 OneDrive 已有文件
             → 返回单词、句子或听力音频
```

永久索引保存 `driveId/itemId`、文件摘要和尺寸；封装成员额外记录字节位置。预授权下载 URL 只临时使用，不是永久资产身份。

Graph `/content` 返回下载重定向；Range 要发送到实际 `@microsoft.graph.downloadUrl`，不能仅向 `/content` 发送后假设成功。官方允许 Range 不能生成时返回完整 `200`，因此必须验证响应状态、Content-Range 与长度。[下载与范围读取](https://learn.microsoft.com/en-us/graph/api/driveitem-get-content?view=graph-rest-1.0)

范围读取实现需要两层换算：PWA 请求某音频自己的字节范围；后台将其换算成包内范围；回复给 PWA 的 Content-Range 仍以该音频的长度计，而不是包的长度。HEAD 利用已核实的元数据返回长度，不为 HEAD 下载整个文件。

单个短文件遇到完整 200 可以按经过大小控制的整文件路径处理；封装文件若不支持范围读取，只能采用大小受控、经校验的整包缓存/切片退路。长录音不得每次拖动都先下载全文件。独立读取与封装读取都未合格时，不能迁移正式音频。

重复点击先查实际生成描述（文本、模型、音色、速度、格式、协议版本）。已有音频只读取；播放缓存丢失、URL 过期、OneDrive 暂时断连均不视为音频未生成。同角色声音路由、Bella 非听力路由保持原协议。

文件读取均由后端完成，私有源凭据不交给手机。共享缓存查找必须在业务鉴权之后；未揭示参考答案、他人不可访问的录音、已过期临时页不能通过缓存路径越权读取。

## 8. 上传、故障与额度

上传先固定文件摘要与业务身份，再上传，核实目标文件，登记位置，最后提交可见的业务状态。上传状态不明时检查目标文件，而不是再次执行内容生成或付费 TTS。

大录音使用上传会话和可恢复的顺序分片。微软建议超过 10 MiB 的文件使用可恢复上传，非最后分片按 320 KiB 的整数倍配置；实际个人权限组合待验证。上传会话地址属于临时授权能力，不公开。[上传会话](https://learn.microsoft.com/en-us/graph/api/driveitem-createuploadsession?view=graph-rest-1.0)

不宣称个人网盘有某个已确认的固定 API 日限额：官方 Graph 支持 429 限流并要求按 Retry-After 退避；SharePoint 企业租户的数字不能冒充本人的 Personal 配额。播放按需读取，任务按较低并发批量传输，不高频全盘扫描。[限流处理](https://learn.microsoft.com/en-us/graph/throttling)

Cloudflare 仍然有自己的请求、CPU、数据库和 KV 配额；1 TB 订阅不会扩大它们。历史 KV 写入事故不会因为买了微软订阅自动消失。新通路要移走音频、模型证据的逐份 KV 写入，并保留少量业务索引写入，不把位置缓存换成每次播放写 KV。[Workers 限制](https://developers.cloudflare.com/workers/platform/limits/)、[KV 限制](https://developers.cloudflare.com/kv/platform/limits/)

加入任务末尾的存储快照：全账户总量、已用、剩余、本人项目实际文件占用或估算占用、核对时间、查询是否成功。余额页仍显示上次任务记录，浏览时不查询 Graph。任务的新增存储预估按日课/完整雅思/微缩雅思/作答/测试/复习分开；只读复习不默认复制正式资产。

付费模型的低额度报警继续遵循用户已确定的“三次最大消耗任务”阈值；微软返回的 nearing/critical 是供应商空间状态，不能混称为该推理余额阈值。订阅到期与凭证失效是维护通知，不能用“存储够三次任务”掩盖它们。

## 9. 停订与恢复

订阅过期后 OneDrive 配额回到 5 GB；超额会停止新增/同步，官方说明持续超额三个月可能冻结，六个月后可能删除文件。不要把这些时间窗当成灾备保留保证。[停订规则](https://support.microsoft.com/en-gb/accounts-billing/subscriptions/what-happens-when-my-microsoft-365-subscription-expires)

因此永久保存目标必须有独立恢复副本。正常 OneDrive 双向同步会传播误删除，不能把同步目录本身算作独立备份；Files On-Demand 占位文件也不是离线原件。

保留本地完整文件、摘要清单、资产位置清单、两个数据库的导出以及恢复说明。按正式任务增量落盘，不强制每天下载整库。若本机没有足够磁盘，确认独立存储位置后再将 OneDrive 作为唯一在线源；此时本地磁盘容量约束需要明确，不能以“已有备份”掩盖未完成下载。

静态化时可关掉播放热层、导出并迁出 OneDrive 原件，音频不用再生成。只改变云端文件位置不会自动替代活跃 D1 或恢复 PWA 服务；文件保留与项目继续在线是两个目标。

## 10. 最小实测与增量接入顺序

这些检查仅验证真实剩余风险，不建立形式化的大型测试工程。

1. 免费个人 OneDrive 阶段完成应用注册与授权；记录实际 quota、账户类型和持续刷新结果。
2. 在独立测试目录上传现有 Bella 短音频、现有较长音频和小型文本；下载核实摘要；不调用新 TTS、不标注 VIX、不发布日课。
3. 从 Cloudflare 私有后端读取这些文件，验证刷新与 URL 过期恢复；不直接暴露长期凭据。
4. iPhone PWA 验证首播、复播、拖动、背景切回、短音频包读取；确认复播没有 TTS 调用。
5. 核实购订后的实际 1 TB quota。上述 API 资格检查无需等到购买才开始。
6. 增量新增文件提供者与位置目录；先接新资产，保持旧 KV/BLOB 的读取退路，再复制已有正式资产并核实。未核实原件不删除，迁移不触发重新配音。
7. 点读 BLOB、口语文件、听力与题目附件分别迁移，后续再调整正文历史归档；两个现有 D1 的业务关系不一次性重建。

尚未完成的真实验证不打勾。本轮只建立研究与接入依据，不修改生效运行协议或部署，也不触碰休息设置和通知。
