# 供多个项目长期共用的订阅资产库

日期：2026-10-05，北京时间。研究建议，未购买订阅、未迁移数据。

> 用户后续暂定采用 Microsoft 365 个人版；具体购买、开发者资格、持续授权、文件数量、Range、迁移与恢复以 [OneDrive 专项研究](onedrive-personal-integration-2026-10-05.md) 为当前接入研究依据。订阅尚未购买，自动接入尚未实测。

## 结论

若愿意为一项本来就有独立使用价值的长期订阅付费，优先考虑 **Microsoft 365 个人版 / 家庭版**。它的价值包括桌面办公、跨设备同步、个人文件与项目档案；不是为了第二语言单独租一块空间。

如果更看重 Google AI 研究工具与 Google 生态，再考虑 Google One 的 AI Plus / AI Pro。如果更多未来项目是 AI 数据与模型工程，Hugging Face PRO 是开发价值更明确的专项候选，但其支付与直接文件服务能力仍须验证。

“订阅资产库”在这里承担正式正文、音频、原声、模型证据、附件和导出备份；任务队列、认证、状态与实时查询索引仍由 D1 等数据库承担。买 1 TB 文件空间不等于买 1 TB 的在线 SQL 数据库。

## 当前官方报价与统一预算

中国区人民币报价直接使用官方页面；外币预算按本轮 ECB 英文页面 2026-10-02 快照 EUR/USD=1.1225、EUR/CNY=7.5259 推导 USD/CNY≈6.7046，EUR/CNY≈7.5259。实际结算受地区、税费、渠道和银行汇差影响。外币“年化”只乘十二，不假装已取得年付折扣。

| 候选 | 容量 | 价格与人民币预算 | 独立产品价值 | 支付 / 工程资格 |
| --- | --- | --- | --- | --- |
| Microsoft 365 个人版 | 1 TB，单人 | 398 元/年，折约 33.17 元/月；真正月付 39 元 | Word/Excel/PowerPoint/Outlook/OneNote 等、同步与恢复、相关 Copilot 权益 | 中国官方页面列出支付宝、银联、Visa、Mastercard；特定卡及渠道以实际结账为准；Graph 授权待验证 |
| Microsoft 365 家庭版 | 最多六人，每人 1 TB | 498 元/年，折 41.50 元/月；真正月付 50 元 | 家人各自使用应用和独立空间；AI 仅订阅所有者 | 不等于本人单账户得到统一 6 TB；不能用虚构成员来规划项目池 |
| Google AI Plus / Google One | 当前所见美区页面 2 TB | 9.99 美元/月，约 67 元/月；月付年化约 804 元 | Drive/Gmail/Photos、部分 Gemini 与 Google AI 产品权益 | 官方支持通过 iOS App Store 订阅；账户地区、资格、苹果余额和当地价格均需本人实际验证 |
| Google AI Pro / Google One | 当前所见美区页面 5 TB | 19.99 美元/月，约 134 元/月；月付年化约 1,608 元 | 更高 Gemini 配额、Pro、Deep Research 等 | 不能沿用旧“AI Pro 只有 2 TB”的资料；具体权益和付款因地区不同 |
| Hugging Face PRO | 1 TB 私有存储 | 9 美元/月，约 60.34 元/月；年化约 724 元 | 模型、数据集、Buckets、AI 开发生态和相关 PRO 权益 | 官方明确 PRO 仅信用卡，银联储蓄卡尚未证明能用；以后万事达也需确认信用卡属性及循环扣款支持 |
| Dropbox Plus | 2 TB | 本轮页面显示欧元 9.99/月，约 75.18 元；支付周期与当地报价待结账确认 | 跨平台同步、分享、文件恢复、文档工作流 | API 能力应按具体端点验证；支付方式待查；相较微软附加办公价值较少 |

来源：[微软中国定价与支付](https://www.microsoft.com/zh-cn/microsoft-365/onedrive/onedrive-plans-and-pricing)、[Google 套餐](https://one.google.com/about/plans)、[Google iOS 订阅方式](https://support.google.com/googleone/answer/9003633?hl=en)、[HF PRO 价格](https://huggingface.co/pricing)、[HF 存储额度](https://huggingface.co/docs/hub/storage-limits)、[HF 付款限制](https://huggingface.co/docs/hub/billing)、[Dropbox 定价](https://www.dropbox.com/plans)、[ECB 汇率快照](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html)。

订阅附加 AI 权益不等于 OpenRouter 充值余额；不能未经核实就抵扣第二语言的 Whisper、OpenRouter、腾讯等实际调用预算。GPU/云计算也不会因为购买网盘空间自动免费。

## 针对当前用户的排序

1. **Microsoft 365 个人版。** 综合国际品牌、中文支付、价格、Windows+iPhone、办公与多项目文件价值最合适。1 TB 能覆盖此前十年压力规划约 276 GB（含空闲余量），但还须扣除个人文件、其他项目、保留版本和备份的占用。
2. **Google One AI Plus 2 TB。** 如果常用 Gmail/Drive/Google AI 并确认能够正常订阅，它的单账户容量比微软个人版更大。若 Google AI Pro 的独立研究工具会成为长期常用资产，再把 Pro 5 TB 提到前面；不能只因容量更大就默认为最佳性价比。
3. **Hugging Face PRO。** 更适合之后多个 AI 数据工程共用；当前支付是明确待确认项，其品牌覆盖面与消费者办公生态也不等于微软/Google。
4. **Dropbox Plus。** 有成熟文件工作流价值，但在目前预算与附加价值目标下不优先于上述产品。

家庭版不是单人排名中的自动升级：只有真实家庭成员需要使用时，每年多 100 元的价值才明显。本人需要统一 2 TB、5 TB 时，应看单账户扩容或 Google，而不是把“6×1 TB”当成统一桶。

学生教育权益也可能与 Microsoft 365 桌面应用重叠；应查询本人已获得的服务，但不把随学籍到期的容量当作永久自有空间。长期订阅和存储所有权优先放在本人可持续控制的个人账户。

## 接入第二语言的必要适配

OneDrive 的 Microsoft Graph 官方支持私人账户授权读取，并支持在实际下载 URL 上发送 Range；下载 URL 是短期的，永久资产目录应保存稳定文件 ID 和摘要，而不是过期的签名 URL。[官方下载接口](https://learn.microsoft.com/en-us/graph/api/driveitem-get-content?view=graph-rest-1.0)

建议先用免费 5 GB 验证，再作购买决定：

- 取得程序访问资格与持续授权，确认凭证更新不会要求每天手工登录。
- 从 Cloudflare 后端读取私有文件；正文、短 MP3、长音频分别验证。
- 在 iPhone PWA 验证重复点读、拖动定位和分段响应，确认不会为几 KB 朗读下载整章大包。
- 验证限流和失效时仍可读取已缓存材料，并有原件的完整本地导出。
- 将资产库按项目分目录，保持稳定业务 ID、摘要、内容清单及恢复资料；D1 保存对应的位置与状态。

只有满足这些条件，才把该订阅称为已合格的在线永久文件源。现阶段它的个人使用与档案价值已可比较，项目完整接入没有宣称已经测试成功。

## 未列入主推荐的产品

- **iCloud+**：中国区 2 TB 为 68 元/月，个人 iPhone 备份价值强，但不提供本项目需要的通用个人文件后端接入形式；中国大陆 iCloud 明确由云上贵州运营，与用户最新运营方偏好不符。[价格](https://support.apple.com/zh-cn/108047)、[运营方说明](https://support.apple.com/zh-cn/111754)
- **pCloud Lifetime**：一次性购买形态有吸引力，但品牌、生态和长期经营承诺不等于微软/Google；本轮官方入口显示的促销报价也不一致，不据旧折扣建议购买。
- **B2 / R2 / AWS S3 等对象存储**：适合多项目基础设施，技术适配直接；其独立价值主要仍是项目存储，缺少本轮要求的办公、个人生活或研究产品附加值，可以作为性能层或工程备选，而非默认个人综合订阅。

## 静态化目标仍保留

购买综合订阅能把持续费用变成个人长期使用的综合服务成本，但不能让停付费后的超额文件自动拥有永久保留权。因此继续保留可独立恢复的本地原件与完整导出；未来停订时，可迁移或撤去热层，不要求重做音频、不以供应商续费作为唯一原件的生存条件。

没有实施购买、授权或生产迁移。本轮没有发生新增模型消耗，也没有发送第二语言通知。
