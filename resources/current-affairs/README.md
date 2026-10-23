# 实事来源池

用途：为以后 **VIX 候选与现实材料协同选择、第三部分创作**提供来源入口。当前已入库、可离线检索，**尚未接入每日生产、采集器或自动任务**。不改变卷轴、雅思、VIX 标注或任何已发布内容。

- [完整可浏览目录](CATALOGUE.md)
- [机器可读来源](sources.json)
- [大型目录扩池入口](discovery-catalogues.json)
- [协议复盘与未来接线设计](../../protocol/CURRENT_AFFAIRS.md)
- [本次研究和验证边界](../../research/current-affairs-pool-2026-10-23.md)

## 本批规模及实际核验

核验日期：2026-10-23。四批 337 条来源观测，合并六组重复后为 **331 个发布来源**。同一机构的语言版、专题、下属栏目不另拆数；这不是331个独立事件证人，也不是331个已证明可自动抓取全文的站点。

| 入口核验 | 个数 | 含义 |
|---|---:|---|
| `opened` | 282 | 实际打开官方发布入口；其中少数只返回页面框架，notes 已说明 |
| `search-confirmed` | 12 | 官方搜索结果确认入口，但直接读取未成功；尚不能作正文证据 |
| `blocked` | 37 | 已实际尝试读取，受到 robots、认证、拒绝、超时等限制；保留待复核 |

| 访问说明 | 个数 | 含义 |
|---|---:|---|
| `open` | 255 | 本次公开入口/列表可读；不代表全站全文免费、未来读取稳定或允许转载 |
| `mixed` | 24 | 有公开内容，也可能有订阅、资产权限或其它限制；需逐篇判断 |
| `subscription` | 1 | 本次观察有明确订阅限制 |
| `unknown` | 51 | 目前无法可靠判定内容可读性，包括搜索确认、失败或页面壳 |

`verification` 与 `access` 回答不同问题。Nature 的官方搜索确认可与订阅风险同时成立；ETH Zurich、FIS、World Sailing 等打开页面壳不等于获取文章列表。工具读到入口也不等于本机未来采集器已通过测试。更详细情况见各条 `notes` 与 `observations`。

### 内容范围

| 类型 | 数量 |
|---|---:|
| 综合及专业媒体、公共广播 | 95 |
| 科学机构与研究机构 | 50 |
| 博物馆、图书馆等文化机构 | 22 |
| 体育机构 | 16 |
| 国际组织 | 19 |
| 统计机构 | 18 |
| 公共机构 | 23 |
| 消费者组织 | 6 |
| 产品与服务发布方 | 16 |
| 交通运营方 | 15 |
| 公民社会机构 | 28 |
| 标准机构与开源项目 | 23 |
| **合计** | **331** |

覆盖综合事件、科学、文化、体育、公共生活、健康、气候、价格、服务变化、消费者权益、数字产品和技术发布。以英语入口为主，保留一条含西语内容的混合入口。覆盖全球及多个地区，但没有声称完整覆盖每个国家、政治观点或人群。

## 怎么查

不装新依赖，使用项目现有 Node.js。从仓库根目录运行：

```sh
node scripts/current-affairs-pool.mjs check
node scripts/current-affairs-pool.mjs stats
node scripts/current-affairs-pool.mjs find --topic climate --access open --verification opened
node scripts/current-affairs-pool.mjs find --region africa --type edited-news
node scripts/current-affairs-pool.mjs find --text subscriptions --limit 10
node scripts/current-affairs-pool.mjs find --role technical-release --json
```

不同参数交集筛选；重复同种参数也是交集。`--topic/--region` 精确匹配小写 slug，`--text` 搜名称、ID、说明、主题及地区子串。结果按登记顺序返回，不代表排名、偏好或自动推荐。无匹配不是世界上没有相应来源，可以用同义词、较宽主题或大型目录继续找。

脚本只读本地数据；唯一写入选项 `catalogue --write` 重新生成本目录 `CATALOGUE.md`。不会联网、标 VIX、请求模型、写数据库或启动后台采集。

## 字段及维护

| 字段 | 含义 |
|---|---|
| `id`、`name` | 稳定来源标识及显示名；不是权威或可信分 |
| `home`、`entryUrl` | 官网及本次确认/尝试的发布入口；入口不是任意文章的 canonical URL |
| `sourceType`、`role` | 发布者类型、默认内容角色；具体文章仍可能是评论、广告、转载或声明 |
| `topics` | 可多选的检索提示，不是词汇义项分类或冻结题材 |
| `regions` | 已统一成 slug 的机构所在地/覆盖背景提示，未分离测绘；不能直接算地区平衡或报道覆盖率 |
| `language` | 入口主要语言；逐篇确认原语言，不把机器翻译当英语原生用法证据 |
| `access`、`verification`、`checkedOn` | 上述观测状态与日期；不是长期健康承诺 |
| `evidenceUrl`、`notes` | 官方关联、实际读取情况与特殊限制；搜索URL也不等于读取成功 |
| `observations` | 本批来源观测；重复合并项保留多次观测，避免抹掉失败或限制 |

添加来源时从官方身份/导航确认实际入口，记录真实观测。未核验的猜测 RSS/API 不入库。更新失败时保留旧观测和实际结果，不把“不能打开”改成“不存在/不可靠”，也不绕过认证、付费或技术限制。按同一机构/出版品牌检查重复，不只按域名：GOV.UK 内不同公共机构可分开；同品牌不同栏目不凑数。

同一新闻经通讯社转载到多站，不自动算多份独立证据。MIT 与 MIT Technology Review、同传媒集团、联合机构发布等关系要在实际采用时判断；本轮没有完成全球所有权和编辑独立性审计。

## 超出331条的扩展空间

已核实三个官方发现入口，单独登记，**不冒充已逐站审核的池内来源**：

- [Media Cloud Directory](https://www.mediacloud.org/media-cloud-directory)：官方页面称收录25,000余媒体及100多个国家的整理集合；可按地区/主题继续发现。
- [ReliefWeb Sources](https://apidoc.reliefweb.int/read/resources/sources/)：官方文档说明1,000余来源及可分页的 `/v2/sources`；默认可含 inactive，需筛选状态。
- [GDELT](https://www.gdeltproject.org/data.html)：可作为事件与原始URL发现工具；所留DOC文档是2017年版本，不据此承诺当前配额或时窗。

本轮只核实官方介绍/文档，没有批量导入、注册账号或实测这些 API。以后扩池仍需逐个确认原发布者、现行入口、内容角色和文章，不把目录收录当质量与转载许可。

## 成本与存储

本批只有静态元数据、说明和离线检索脚本，实际存 D 盘并随 Git 版本化；不占生产 D1/KV、不建立新闻全文仓库、不增加固定订阅。未来检索和阅读仍消耗实际工具/模型用量；只按需取材料，不每日扫描全部331站或外部数万来源。RSS/API若以后接入，需另行验证当前能力和使用条件。
