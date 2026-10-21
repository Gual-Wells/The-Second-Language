# 特殊纪念卷轴重做：工艺考究与过程档案

用户要求留存本次考究日志和制作工艺研究。此处是可恢复研究入口，记录结论、依据、失败与实际制作，不保存隐藏推理链，不搬运含凭据的整段会话。

## 当前状态与约束

《The Returning Thread／回返的线》被用户否决，已从正式目录撤下。其原件与旧审阅只作失败档案，先前代理放行不能代表用户认可。

新作《The Second Language — A Day in Another Tongue》现已完成分层材料装配、真排印、首稿退回后的修订、实际运行观察和独立整件复审。内容 SHA-256 为 `4a83d1952e133bcecd6c1aa2e14a788159b410e9a6ea2a7f5bcf42610943e37b`，六层 PNG 已按受审 draft 原字节提升并冻结。当前身份是 **`agent-review-for-user-evaluation`／可供用户评价的已制作样品**；`userAccepted=false`，不声称用户已经接受纸张或整件艺术。

本次记录截点为冻结后的本地检查 `2026-10-21T14:15:51.267Z`。发布地址、发布提交和实际发布时间尚未记录；制作时刻不等于项目成立日。最新工序、失败／修订、冻结摘要与完整英中先读 [manufacturing-result.md](manufacturing-result.md)。

纸张唯一质量基准为第一章最终纸面及其从v1到v6、再到v12成品的完整工艺形成过程。第五章纸张仍不够好，不能作合格材料锚点或与第一章平均。参考不等于照抄第一章成品；也不等于只把它喂给图像工具。

## 从这里恢复研究

| 文件 | 内容与证据边界 |
| --- | --- |
| [manufacturing-result.md](manufacturing-result.md) | 本轮制作总报告：退稿、工序、首稿失败、修订、原字节冻结、检查范围与完整英中。当前为代理审查后待用户评价，未记录发布。 |
| [PROCESS_LOG.md](PROCESS_LOG.md) | 已发生动作的时间顺序：旧作撤下、研究重启、暂停、装配、宿主参数覆盖与定向修订。 |
| [theme-and-design-recap.md](theme-and-design-recap.md) | 项目真实使命、特殊纪念身份、两样品语义形成过程；含已核的用户原话定位。 |
| [review-failure.md](review-failure.md) | 先前艺术放行失误、主题来源断裂及局部修复被扩大为整体通过。 |
| [paper-process-recap.md](paper-process-recap.md) | 纸张工序职责、第五章不足、本轮遗漏与显示保真误称。 |
| [first-chapter-process-reconstruction.md](first-chapter-process-reconstruction.md) | 第一章从初始资源到材质／纸膜／光照／墨／印迹的实际技术演变，按源代码和日志重建。 |
| [art-craft-formation.md](art-craft-formation.md) | 历次材料与艺术否决、实际提示词及技术显示如何相互影响；不从最终成品倒推一次生成。 |
| [first-chapter-source-index.json](first-chapter-source-index.json) | 43个所选关键来源的不可变commit、路径、实际Git字节SHA及在线链接；不是艺术合格证明。 |
| [design.md](design.md)、[theme-review.md](theme-review.md) | 新的语义候选及设计阶段质疑。实际版式服从真实母图、字形与整页修订，不由设计坐标表自动批准。 |
| [generation.json](generation.json)、[source/](source/) | 已实际发生的图像调用、输入／prompt与原始输出。保留候选产生时的身份，不能倒写成生成即采用。 |
| [candidate-paper-review.md](candidate-paper-review.md) | 只审无字母图的材料基础、风险与后工序职责，未批准纸张成品。 |
| [manufacturing-plan.md](manufacturing-plan.md) | 分层材料、折形、墨印、宿主差异和实际受光的试制方案；不是最终采用结论。 |
| [trial-asset-manifest.json](trial-asset-manifest.json) | 试制输入的原尺寸、字节、摘要、许可与传递方式；保留当时的 trial 状态。 |
| [candidate-whole-review-v1.md](candidate-whole-review-v1.md) | 首稿整件审查，定位诗末与姓名仅3px的粘连，明确要求修订，未放行。 |
| [typesetting-inspection-f51c7f6f9399cd1c.json](typesetting-inspection-f51c7f6f9399cd1c.json) | 首稿字库／bounds等检查。机械无碰撞未发现其阅读层级缺陷。 |
| [trials/v1-front.png](trials/v1-front.png)、[trials/v1-surfaces.json](trials/v1-surfaces.json) | 首稿平面原件和原manifest，保留失败身份，不覆盖成修订稿。 |
| [typesetting-inspection-4a83d1952e133bce.json](typesetting-inspection-4a83d1952e133bce.json) | 修订内容的实际Aboensis字形、字号／位置、英中和输出检查；当时仍为draft。 |
| [trial-runtime.json](trial-runtime.json)、`trial-*.png` | 修订稿的实际运行快照和手机模拟观察，包括材料恢复值、GPU宽尺度配对及开合状态；不冒称实体设备验收。 |
| [candidate-whole-review-v2.md](candidate-whole-review-v2.md) | 对修订后实际整页和细看重审；允许固定版本供用户评价，不是用户认可。 |
| [trials/v2-surfaces.json](trials/v2-surfaces.json) | 冻结前的v2 draft manifest；六层摘要与最终原字节一致，留存提升前身份。 |
| [最终 surfaces.json](../../web/labs/project-beginning/assets/surfaces.json) | 六层最终PNG摘要、冻结时刻和绑定的审查；明确`userAccepted=false`。 |
| [verification.json](verification.json) | 冻结后本地正式bundle的入口／原件／交互检查；解码相同只叫原件传递，不叫GPU着色保真。 |

研究以旧工艺仓库提交`17acb31e0241180b5f0c19b463492cc6ef756c80`为恢复锚点；每个原代际README还记载其当时基线和反馈。源代码、许可、脚本、截图、原始素材和用户反馈分别作证，不能把某一项当作全部过程。

## 已确认的关键认识

第一章不是一次“古纸生图”的成功。最初有许可明确的旧纸资源和原生分层；其后出现花哨、污脏、过净、高光洗旧、现代圆边、霉变、末圈白线及印迹贴图感等失败。素材编辑、位置相关的年龄设计、扫描微表面、墨层／印迹、连续GPU卷膜、共同法线／深度及正视保真逐步各司其职，才形成后来采用的组合。

重新制作要恢复这些职责与已解决问题，不机械重演每一轮失败。新的物象、轮廓或折史可以不同；其材料和实际呈现必须经完整工艺形成。图像只是基底／年龄的一部分，微法线不是全纸老化，二维解码逐像素相同也不是实际Three着色保真。

研究记录随真正发生的制作补充，历史试制文件保留其当时状态。当前的冻结与代理整件审查只绑定本次具体原件；发布及用户评价应分别据实际发生的事实记录，不从本索引推断完成。
