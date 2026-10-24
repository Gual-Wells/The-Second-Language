# 完整教材工艺与真实文章组：建设及发布记录

## 状态与实际范围

核心提交：`358f3bfdb0007c2cab608485a14189087e850803`，基于 `dbbcbef59f986c1eedebdd94cec844cde6955b13`。已发布GitHub main与任务分支、API Worker及PWA v47。此次建设恢复生产方法并接通多篇阅读，不重新生产今天的正式章，不重新择词、标VIX或调用TTS；不能将隔离样例通过称为真实新章内容已经合格。

研究依据：[质量抽样](chapter-quality-comparison-2026-10-24.md)、[生产回退取证](daily-production-regression-and-multi-article-design-2026-10-24.md)。现行执行入口：[TEACHING_AUTHORING](../protocol/TEACHING_AUTHORING.md)、DAILY_RUN、QUALITY_WORKFLOW、CURRENT_AFFAIRS。研究报告保留当时快照；本记录说明后续建设状态。

## 实际建设

- `prepare-teaching-materials`复用固定教材读取器，按每个明确主词、词族和补查项独立定位Collins/Oxford；实际全文、查询结果、原例候选保留在D盘不可变逐词包。原例候选不是语义解析结果，须阅读原件。不再从缺条目的旧混合lookup集合筛选来冒充完整补查。
- `assemble-teaching`只装配模型亲写的第一二部分及文章组，检查实际材料去向与全义引用，没有范文自动补例回退。冻结范围不能被候选探索替换，材料或正文漂移会停止打包。归并、例句教学价值、标签和内容质量仍须实际判断。
- 第三部分不限固定篇数，词间与词内义项的取用次序完全自由；跨篇分布、自然复现、承接句均允许。全组覆盖全部用法，每篇围绕有材料支撑的真实对象完整成立；现实实用在适合部分偏重，不靠新闻风味、虚构中心或风险劝导替代内容。
- ARTICLE只提供篇目身份；SENTENCE仍全章唯一。来源包增加同源的篇目标题及实际采用URL引用，服务端核对正文与来源的一致性，并拒绝没有篇目标记的新制作版本。已有原件读取及原身份幂等重试保持。
- 手机阅读器复用原索引位置提供篇目检索与定位；译文、高光、点读与纯净模式保持。现实参考在原sheet按篇筛选，无新请求通路。快捷答疑通过真实手势提交篇名、准确原句标记与整章digest。
- 未新增D1表、逐篇数据库实体、后台监测器、订阅或收费服务。正文/来源仍走原OneDrive及章级索引，音频沿既有文本复用和未知计费保护。篇数增加后音频费用按实际文本计算，不把75000字符规划预留当正文上限。

## 用真实固定输入核验材料恢复

只读使用今天已冻结的50主词及原VIX输入 `2dc445b7978adf783eb0b8a461b24c18aed85d55`：291个明确查询词形、419份去重现代教材条目，50个材料包合计908894字节。数量只说明取得范围，不证明语义完整。

取证时缺失的7个Collins独立词头全部恢复：budgetary、compensatory、consultative、street cred、interpretative、proportionality、verifiable。其中interpretative为转引，不能计作新增义；其余6个词头的8条标记原例都在完整原件中。新材料包不是已经修订好的教学正文，必须由实际作者将其解释、标签与例句完整用于成稿。

## 实际后台目录兼容

日课、归档及卷轴在second-language-certification-reader；答疑/测试/质检与音频准备在second-language-maintenance，雅思仍有独立旧入口。没有假定一次提交能更新所有本机副本。

发现维护目录质检契约仍默认40词且旧解析器不识别ARTICLE。在共享Questions互斥锁可取得时，备份后仅原子同步 `web/annotations.js`、`protocol/chapter-quality-contract.mjs`。维护目录其他未提交脚本和模型设置未被覆盖，不切换任务目录、不搬活动资料、不领取模型队列。备份及摘要回执在本机 `.cache/teaching-release/maintenance-compat-20261024-091519/`。

实际维护入口验证：今天已发布正文解析为50个质检/测试主词、191个第三部分音频句；三篇隔离样例解析为50主词、50句。音频准备原扫描器天然忽略ARTICLE及标题，不需要复制或重做收费资产；雅思来源取得是固定全文，不按第三部分单篇解码。

## 验证

| 检查 | 结果及边界 |
|---|---|
| check-teaching-authoring | 独立派生补查、不可变恢复、冻结范围保护、教材/原例去向、拒绝自动补例、乱序跨篇覆盖及实际50词打包通过；全部隔离，无语义质量冒称 |
| check-current-affairs-package | 原读件、原输入、冻结选择、正文/来源摘要及休息/封存保护通过 |
| check-current-affairs-backend | 内存SQLite/Worker/文件基座夹具通过；篇目不符和新制作缺ARTICLE被拒，来源及历史隔离保持 |
| check-daily-affairs | 原输入恢复、反馈复用、先休息后模型、实际Max启动参数、PowerShell BOM/语法通过 |
| check-article-collection-ui | 17项通过，含乱序三篇、篇目过滤与跳转、译文/高光、位置恢复、来源筛选，以及实际长按发出的篇名/句子标记/digest；无付费或正式业务调用 |
| check-reader-ui | 使用今天真实50词正文，103项通过，零JavaScript错误、零实际外部业务请求 |
| check-reader-position | 同一真实长章：44项内部坐标、20项自然边界、3个静态跳转及沉浸控件通过 |

界面检查是402×874等手机触摸视口的Chromium模拟，不冒称实体iPhone/Safari的验收。测试复用已安装Playwright，修正旧脚本对缺失私有依赖副本的引用；模拟滚动完成后再启动点击，保留“滚动取消待处理手势”的真实要求。常规业务按钮绕过阅读双击识别，避免来源入口点击被延迟滚动取消。

## 发布与读回

- GitHub Git HTTPS传输多次reset，使用项目既有Git Database API方式上传相同Git树与相同提交，核对SHA后非强制更新main及任务分支；没有用逐文件提交覆盖历史。核心main已读回为358f3bf。
- Worker版本：`436eba19-02eb-4238-8d1c-d7b2c35c40dc`。
- Pages部署：`https://963e6411.the-second-language.pages.dev`；正式入口 `https://the-second-language.pages.dev/`。
- 北京时间2026-10-24 17:32读回正式域的9份v47 JS/CSS/SW资产，与本机SHA逐字节一致；会话JSON与私有接口401保护正常。
- 线上当前正文摘要仍为 `532149cdb22a35db628df81ad35206c9db1c9bb69b26df0ee46f1c26f781565e`，来源摘要仍为 `37afe0f535f2530be348a5686a14d19005bf9052e87bbac4dae83e3e9b260360`，选择摘要与冻结selection一致，正式目录仍仅今天第1章。未发布测试课或重发今天正文。
- 实际日课任务下一次为北京时间 **2026-10-25 05:00**，读取本次已更新的run-daily.ps1，Max/50/05:00及隐藏启动器保持。05:00为开始生成，完成完整审阅后发布，无固定结束期限。

首份新流程实产仍须逐词核对教材、逐篇审阅真实内容，再核对全组逐义真用及译文。结构通过不是文章质量或用户学习收益已达成的证据。此次不恢复旧章、旧分类/固定连载方案，不改变雅思设计或卷轴工艺。

收尾已按BALANCES更新余额与容量页，永久归档交由原独立队列处理。本轮没有新增订阅或主动TTS/外部推理调用；OpenRouter共享余额约$3.999，处于既有低余额提醒范围，Cloudflare 10000 Neurons，腾讯9978次为估算。OneDrive约1.18GB/1.10TB，三库仍约1.52MB、1.79MB、0.086MB；与未来实际文章音频费用分开，不承诺多篇与原章字符量相同。
