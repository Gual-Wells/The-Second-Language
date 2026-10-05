# 第二语言后端存储可选方案

日期：2026-10-05。状态：研究与建议，尚未选定或实施迁移，不构成已启用运行协议。

## 结论

建议优先保留现有 D1 关系数据与 Cloudflare Worker，把需要不断积累的音频、原始模型返回和不可变正文接到正规对象存储。首选 D1 + R2；R2 支付验证失败时，D1 + 腾讯 COS 为国内支付备选；D1 + Backblaze B2 为免费私有对象存储候选。Turso 为关系数据库将来容量不足时的首选迁移候选。OCI 200GB 适合作为更远期的大容量自管方案，不需要现在为此重建后端。

用户提供的 DIGR 独立报告作为候选与资源资料使用。本轮针对部署决策重新查阅官方价格、接入、支付与限制，不把不同类型资源的 GB 直接相加排序，也不把“理论分散额度”当成单个项目容量。

## 项目实况

本轮只读管理 API 与 SELECT，未启用订阅、创建资源、修改正式数据或触发模型生成。私有查询输出在 `.cache/storage-selection-probe.json`，不进入 Git。

2026-10-05 本次查询：

- 正式主库：196,608 bytes（192 KiB）。
- 正式练习库：495,616 bytes（484 KiB）。
- 两库合计：692,224 bytes（676 KiB），不到 1 MB。
- 发音缓存：6 个记录，音频合计 188,616 bytes，最大 65,448 bytes。
- 正式 `practice_media`：0 个记录。因此没有完整正式雅思长期容量实测，不能用试验数据声称已证明一年运行容量。
- R2 管理 API 返回 403 / 10042：`Please enable R2 through the Cloudflare Dashboard.` 当前账户未开通 R2。
- 正式章节 KV 在查询窗口内最大存量约 37,422 bytes；正式练习媒体 KV 暂无数据。账户其他试听 namespace 仍有数据。

上一轮查询，2026-10-04 UTC 日：D1 全账户读取 38,212 行、写入 2,586 行，分别远低于免费每天 500 万行与 10 万行。昨天邮件明确确认耗尽的是全账户 KV 每日 1,000 次 put，不能将其当成 D1 容量耗尽。

目前实际分布：

| 材料 | 当前存储 | 推荐用途匹配 |
|---|---|---|
| 章节目录、修订、登录、读书进度、控制、余额记录 | 主 D1 | 保留关系数据库 |
| 雅思题目、答案、答卷、队列与批改索引 | 练习 D1 | 保留关系数据库 |
| 日课与临时正文 Markdown | 章节 KV | 可逐步迁到对象存储；每次正文写入少，非首要高频负荷 |
| 点击词句的短音频 | 练习 D1 BLOB | 当前可用；有对象存储后将媒体文件迁出，保留描述与缓存状态 |
| 听力与考官音频、口语原声、转换 WAV、各路模型请求/原返回/解析/清单 | 媒体 KV | 对象存储优先升级部分 |

现行 `pronunciation_audio` 每段 BLOB 上限 1 MiB；D1 官方单行上限为 2,000,000 bytes。短音频暂存可行，持续扩展的媒体库需要独立空间。完整模型原返回应原样保存，数据库保留定位索引而非以摘要替代证据。

## 推荐组合与排序

| 项目顺位 | 组合 | 解决的问题 | 工程变化 | 判断 |
|---|---|---|---|---|
| 1 | D1 + R2 + 原有 Worker | KV 写入瓶颈、音频长期积累 | 统一对象读写适配，媒体与旧数据渐进迁移 | 首选，需验证实际卡片开通 |
| 2 | D1 + 腾讯 COS + 原有 Worker | 国际开通失败时的文件存储 | S3/签名适配与访问验证 | 国内支付可行的备选，已有腾讯账号 |
| 3 | D1 + B2 + 原有 Worker | 免绑卡起步的 10GB 私有文件层 | S3 或 B2 Native 适配、流量与速率验证 | 免费路线候选，尚未开户测试 |
| 4 | Turso + R2/COS/B2 + Worker | 将来关系数据单库容量或共享日额度不足 | D1 API 替换，SQL/事务语义核对 | 数据库迁移优先候选，当前无容量迫切性 |
| 5 | Neon Postgres + 其对象存储 + Worker | 希望改用完整 Postgres 后端 | SQL 方言、事务、连接与计算时数管理 | 可行但改动比保留 D1 更大 |
| 6 | OCI 自建数据库/文件服务 + Cloudflare Worker | 真实几十到上百 GB 需求 | 主机、系统更新、数据库、备份恢复均需维护 | 大容量储备方案，开户与可用机型待验证 |

这些顺位依据当前项目适配、正常可用成本、支付可达性与迁移影响，非单纯免费容量排序。若把“绝不绑卡且严格零账单”设为硬条件，先验证 B2 免费私有桶；不能把 R2 免费用量承诺成无需订阅或不会发生超额费用。

## 对象存储

### R2

标准存储每月包括 10 GB-month、100 万 Class A 操作、1,000 万 Class B 操作，免公网流出费；超出标准存储部分 $0.015/GB-month。需要单独开 R2 subscription；不要求先购买 $5/月 Workers Paid。现有账户尚未开通。

官方支付列表包含 UnionPay、Mastercard 和 PayPal，但这不能保证某张中国银联储蓄卡一定通过发卡行、验证与后续扣款。尚未实际绑卡，不将其标成已支付成功。Apple Pay 也不等于 Apple 礼品卡余额。

仅为预算比较按 $1 = ¥7 计算，非实时汇率：

| 稳定平均对象存量 | R2 标准存储费/月 |
|---:|---:|
| 不超过 10GB | ¥0 |
| 20GB | 约 ¥1.05 |
| 50GB | 约 ¥4.20 |
| 100GB | 约 ¥9.45 |

表中不含超额操作、税、账单单位向上取整或模型费。对个人项目，操作量预计处于免费用量内，但必须由实际计量核对，不能据此保证固定零费用。容量是存量免费额度，不是每月可以永久新加 10GB。

来源：[R2 定价](https://developers.cloudflare.com/r2/pricing/)、[开通](https://developers.cloudflare.com/r2/get-started/)、[Cloudflare 支付](https://developers.cloudflare.com/billing/get-started/create-billing-profile/)。

### 腾讯 COS

已有腾讯云实名认证和支付通路，国内费用中心官方支持微信与网银充值。可由 Cloudflare Worker 鉴权后访问私有 COS；模型推理仍由 Cloudflare 发出，不随存储迁移改变 OpenRouter 通路。

当前官网报价示例为标准存储 ¥0.118/GB/月、公网下行 ¥0.5/GB；须在选定地区后核对，不能把这个示例当成所有地区统一价格。按此示例，10GB 存量 + 3GB 下载约 ¥2.68/月，50GB + 10GB 下载约 ¥10.90/月，另计操作等费用。无需为几元级的对象存储先购买云服务器。

如果音频经 Worker 代理，COS 送到 Worker 的流量也属于公网下载；不能因为对用户同域访问就漏算。选区及 Cloudflare 到 COS 的实际响应需在独立样本验证。

来源：[COS 当前报价](https://buy.cloud.tencent.com/price/cos)、[腾讯国内充值](https://cloud.tencent.com/document/product/555/7425)。

### Backblaze B2

前 10GB 存储免费；现行标准价格 $6.95/TB/月；一般免费流出量为月平均存量的三倍，超过后 $0.01/GB，官方列有 CDN/计算伙伴免费流出例外。不能直接宣称任意下载路径均免流量。

免费私有桶是本项目可以研究的免绑卡路径。官方新手指南对第一次公共桶明确要求支付历史或小额卡片验证，我们使用私有桶并由 Worker 鉴权，不需要为朗读公开原声文件。账号注册、API 与 Cloudflare 访问尚未实际测试；超出免费额度的支付方法对用户卡片仍待验证。

按 $1 = ¥7，仅存储超出免费 10GB 部分粗算，50GB 约 ¥1.95/月、100GB 约 ¥4.38/月；另核对账户操作政策、实际下载与付款可用性。

来源：[B2 价格](https://www.backblaze.com/cloud-storage/pricing)、[私有桶及 API 开通](https://www.backblaze.com/docs/en/cloud-storage-get-started-with-a-backblaze-integration)。

### Neon Object Storage

官方最新介绍支持每项目 5GB、私有桶、S3 兼容。作为单个项目使用这一免费对象层是正常用途，可与 D1 搭配，不要求一起换 Postgres。超过 5GB 后价格、传输和操作细目应在实际项目账户核对。它是可补充候选，容量与当前 Worker 的直接绑定便利性均不如 R2，因此暂不排在 R2 之前。

来源：[Neon 2026-10-02 免费计划](https://neon.com/blog/neon-free-plan-1-gb-per-project)、[Neon 完整后端](https://neon.com/blog/neon-backend-is-ga)。

## 关系数据库候选

| 方案 | 免费范围 | 适配与开户判断 |
|---|---|---|
| 现有 D1 | 单库 500MB；账户共 5GB；每天 500万行读/10万行写 | 已部署，关系、约束、队列、Passkey 均已使用；有余量，不因音频瓶颈迁走 |
| Turso | 账户 5GB；每月 5亿行读/1,000万行写；免费起步无需卡 | libSQL/SQLite，与当前 SQL 最接近；不是 D1 API 原样替换，需核对 batch、事务与结果结构 |
| Neon | 每项目 1GB PG + 5GB 对象；100 CU-hours/月 | 正常单项目额度；不能以 100 项目相乘给第二语言承诺 100GB 单库。Postgres 迁移成本中等 |
| CockroachDB Basic | 官方按每组织每月 $15 资源抵扣说明，相当于组合 5,000万 RU 与 10GiB | 需确认免费账户/支付模式；Postgres 兼容不等于 SQLite 兼容，大文件仍需对象存储 |
| TiDB Starter | 每个免费实例 5GiB 行存储 + 5GiB 列存储，最多五实例免费范围 | 无卡起步候选，SQL 为 MySQL 路线；不把列存储或五实例简单当单库文件空间 |
| Cosmos DB | 生命周期免费 25GB + 1,000 RU/s | 容量大；应用关系查询与事务需改写。与 Azure 学生订阅资格分别核对，不为容量优先转 NoSQL |
| OCI 自建 | 200GB 系统盘/数据盘总额；A1 免费总 2 OCPU/12GB RAM | 开户须合格信用/可当信用卡使用的借记卡。机型容量、闲置回收、系统维护与独立备份是真实运行成本 |
| Oracle Autonomous | 独立报告约 20GB/库并提示总限额需开户确认 | 仍需 Oracle 开户与 Oracle SQL/API 适配，当前无胜过 D1 + 对象存储的项目理由 |

Neon 的一个具体风险：官方免费计算 100 CU-hours，每分钟实际访问 PostgreSQL 会阻止五分钟闲置休眠。若最低 0.25 CU 连续在线 30 天，简单推算需 180 CU-hours；不能给“每分钟免费答疑监测”直接换上这个数据库后仍宣称免费额度充足。待办监测保留在 D1，或采用实际有任务才访问 PG 的触发方式。此推算不是已测的 Neon 账单。

Turso 有官方 Cloudflare Worker 接入说明，故作为未来数据库迁移备选优先于需要自管服务器的方案。超出免费用量后的支付能力必须另确认，免费注册无需卡不等于长期付费支持银联。

来源：[D1 限额](https://developers.cloudflare.com/d1/platform/limits/)、[D1 定价](https://developers.cloudflare.com/d1/platform/pricing/)、[Turso 免费计划](https://turso.tech/pricing)、[Workers 接 Turso](https://developers.cloudflare.com/workers/tutorials/connect-to-turso-using-workers/)、[Neon 新计划](https://neon.com/blog/neon-free-plan-1-gb-per-project)、[Neon 休眠](https://neon.com/docs/manage/endpoints/)、[Cockroach Basic 免费抵扣](https://docs.cockroachlabs.com/docs/cockroachcloud/plan-your-cluster-basic)、[TiDB 免费实例](https://docs.pingcap.com/tidbcloud/serverless-faqs/?plan=starter)、[Cosmos 免费层](https://learn.microsoft.com/en-us/azure/cosmos-db/free-tier)、[OCI Always Free](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm)、[OCI 开户付款](https://www.oracle.com/cloud/free/faq/)。

## 外部报告其余资源的项目位置

- Hugging Face 100GB 私有空间：可作为真正语言研究数据集、词典和自己口语语料的档案候选；不当通用动态关系数据库或未经验证的日常 TTS 音频 CDN。整理数据集与保留原始材料是有意义的用途；下载速率、访问接口、私人音源生命周期还需验证。
- Google Compute 30GB：同为自管且有绑卡/性能约束，对当前项目没有足以代替 D1 的优势。
- BigQuery、Tinybird：适合未来统计分析，不负责日课发布事务与答卷队列。
- Cloudflare AI Search、Zilliz、Qdrant、Pinecone、Upstash Vector：搜索/向量层，当前问题不需要新增；词汇推荐继续按 VIX 索引与协议运行。
- Cloudinary：存储、带宽、转换共享 credit；本项目纯音频和 JSON 使用普通对象存储更容易估算。
- Durable Objects：需要强一致协作/连接状态时再考虑，单用户已有 D1 原子领取，不必为本次容量改成另一套实体数据库。
- GCS、Tigris、Upstash Blob、OCI Object：正规对象存储备选，但免费容量、已有接入、开户或流量相较前三项暂无当前明显优势；不能把这些空间加成一个透明大桶。
- GitLab、GitHub Releases、Pages：继续用于代码和合法的版本化静态资源；不用作有随机写入、私有答卷及队列的权威数据库。
- Firestore、Aiven、Supabase、Atlas、Convex、Appwrite：各有产品价值，但本项目现有登录、关系库、Worker 已完成，换完整平台暂不能直接解决 KV 音频写入瓶颈。
- Upstash Redis、Redis Cloud：缓存/状态空间，不替代当前长期数据库与媒体存储。
- Telegram：依报告结论不选作外部 PWA 权威文件后端。

Hugging Face 资料：[存储额度](https://huggingface.co/docs/hub/storage-limits)、[存储桶](https://huggingface.co/docs/hub/storage-buckets)。其他未入选项以用户报告提供的资源信息作背景，不逐一宣称已开户或验证。

## 容量如何按当前产品估算

不要求每天生成整章音频，发音依点击按需缓存；因此不能按“一年每天全章配音”给当前产品报价。

已有代码事实：`scripts/practice-audio.mjs` 将听力最终 MP3 编码为 128 kbit/s；`scripts/speaking-practice.mjs` 将提交原声转为 16kHz、16bit、单声道 PCM WAV；本机 Kokoro 4.73 秒样本检查约 57 kbit/s，仅作短样本观察。

- 最终 30 分钟听力 MP3 约 28.8 MB。
- 原声分析 WAV 每分钟约 1.92 MB，7–10 分钟为 13.44–19.2 MB。
- 还要保留原录音、合成片段、考官音频、四路原返回与反馈。先以每套 60–120MB 作对象空间规划区间，不作为正式整套实测消耗；报告和额外补听数量会改变它。
- 每月 4 套：一年新增约 2.88–5.76GB；每月 8 套：约 5.76–11.52GB。此为上述规划区间的线性推算，不含点击发音、重复答题、修订和备份。
- 云端不存 ffmpeg 临时 PCM 拼接文件；保真目标所需原声与实际提交分析 WAV 则保存。每份保留材料都有明确用途，不能因容量随意删除原模型证据。

关系库主要增长目录、题目、答案、答卷和状态，文件内容独立后相对缓慢。没有正式题集规模实测，现阶段不承诺“500MB 可使用具体多少年”。每轮任务记录实际新增字节与累计存量后再修正预测。

## 可渐进实施的工程方案

1. 文件清单记录 `backend / key / digest / bytes / mime / owner / lifecycle`，使用者凭现有章节、答卷或句子关联查找；后端凭据不进入 PWA。
2. 同一文本、声音、模型和参数摘要复用同一发音资产。新增对象层后保留当前缓存身份，重复点击不重新调用 TTS。
3. 先升级正式口语与练习音频/报告；再迁短音频 BLOB，最后按必要性迁章节正文。D1 保持任务、会话、答卷与目录权威，不在本次引入多主数据库。
4. 先保存对象并核对字节/摘要，再提交 D1 可见指针。外部对象存储与 D1 没有跨服务事务；暂存孤立对象可清理，但不让数据库指向未完成文件。
5. 老资产仍按原后端读，新资产写目标后端；核对拷贝完成后再切读。不能只加入 `PRACTICE_R2` 绑定：当前 `mediaBytes` 会优先只读 R2，已有 KV 文件会读不到。口语已预留 `SPEAKING_ASSETS` 原生对象接口，短音频仍直接读 D1，章节仍用 KV 字符串，都需要分别接到同一个明确的资产定位方案。
6. 私有音频继续经过现有登录检查。音频支持 Range 和流式返回，正文/题目不改变 PWA 语义与视觉。
7. 临时页 48 小时删除自己的临时材料；复用正式章节音频时仅解除临时引用，不删除正式资产。正式原声、模型返回与章修订按永久用途保留，任何删除规则先明确。
8. 测试使用独立数据与本机中间文件，不将每个过程动作持续写入正式 KV。文字答疑待办在 D1 索引读取，空队列不写对象或启动模型。
9. 新增资源计量记录存量、读写操作、下载量及预计增长，不用 Whisper Neurons 代替整个 Cloudflare 资源余量。原有余额警报仍按不足三次最大用户任务判断；容量另用任务能否容纳新增材料与剩余空间展示，不虚构充值余额。
10. 保留可导出的 D1 快照与文件清单，用户原声和完整结果有独立恢复副本。第二个云平台可用于备份，避免为当前需要建立复杂多云实时同步。

本轮仅形成研究和可实施顺序。下一步首先验证所选对象服务的开户/支付与独立私有对象读写；成功后才建设上述适配并渐进发布，不提前删除或搬移正式数据。
