# 古旧正式文书修订 · 来源与边界

第一章独立设计试样，尚未颁发；不写学习、答卷、认证或VIX数据。正文仍是真实英文排字，固定正视、连续卷展、透明对象导出均沿用已有组件。

## 保留与改动

- 卷展、真实字库及基本渲染复用[第三版](../chapter-scroll-v3/CREDITS.md)与[基础版](../chapter-scroll/CREDITS.md)。Paperlab固定版本 `41914833cb9ae12b32a8cbbdee4723f5b12158af` / Apache-2.0，Aboensis / SIL OFL，Three 0.186.1 / MIT。上游完整许可沿用对应目录。
- 雾效继续使用 [Pavel Dobryakov 的 WebGL Fluid Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation/tree/a2d292931f19d9b3b9f564e23e6c32729d2121c3)，MIT；许可证也保留在本版vendor文件头及[第三版许可文件](../chapter-scroll-v3/licenses/Fluid-MIT.txt)。保留既有求解器，新增相互独立的染料与速度输入接口。超出显示范围的场域承接连续宽域输入；卷展只注入轻微速度，不制造额外雾量。不是三维烟雾或经过实验校验的气固耦合模拟。
- 环境光继续使用 Sergej Majboroda 的 [Studio Small 09](https://polyhaven.com/a/studio_small_09)，CC0；直接复用第三版原文件。
- 新增 Rob Tuytel 的 [Leather Red 02](https://polyhaven.com/a/leather_red_02) 1k OpenGL normal与roughness，CC0。仅以低幅度提供皮材微观表面参考，粗糙度限定在偏哑光范围；未使用其红色albedo，不把鞣制皮革扫描冒称历史羊皮纸实测。去掉第三版以颜色图充当高度的凹凸近似。
- 纸膜、皮环由内置imagegen在第三版原件上分别修订。无花饰、无边框；纸膜加强局部水损、折线积尘和边缘耗损。皮环退去鲜红高光，铜扣增加暗色氧化与少量接触腐蚀。原始PNG、实际提示词、WebP派生摘要在仓库`research/scroll-lab-v4/`。图片不是历史实物扫描。
- 延续第二版将材料、污渍与墨层分别处理的思路；本轮墨迹局部微损由原生排版层控制，不在字母背后生图伪造英文。字迹磨损是美术近似。

皮环仍为固定正视2.5D资产，退环动作没有变成真实解扣。光照、纸厚、皮革刚度与立体裂口仍有后续空间。样品只接受画面与交互实际评价，不用功能检查代替审美通过。

资料依据、运动尺度假设和本轮验证见[制作记录](https://github.com/Gual-Wells/The-Second-Language/tree/codex/medieval-scroll-lab-2026-10-16/research/scroll-lab-v4)。无新增订阅、无收费外部API或Kaggle用量。运行时全部素材同源。
