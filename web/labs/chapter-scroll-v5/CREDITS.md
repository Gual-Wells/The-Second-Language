# 第五版 · 纸膜、清晰度与运动修订

第一章设计试样，未颁发；不调用生产认证、学习记录或付费生成接口。前四版保留。

## 资源与改动

- 复用 [第三版](../chapter-scroll-v3/CREDITS.md) Three.js 0.186.1/MIT、Paperlab 固定提交 `41914833cb9ae12b32a8cbbdee4723f5b12158af`/Apache-2.0、Aboensis/SIL OFL、Poly Haven Studio Small 09/CC0。
- Paperlab 的卷绕公式移植到顶点着色器；文字UV固定，正背面分开。展开后保留上下端卷藏曲率、轻微非均匀起伏。有限差分法线与阴影深度使用同一变形。它是有依据的艺术形态，不是羊皮材料实验或有限元仿真。
- [Cannon-es](https://github.com/pmndrs/cannon-es) 0.20.0/MIT，版本锁定的完整ESM和许可文件在vendor。本版用其质量、弹簧与阻尼，产生取环惯性及回摆。保留第四版已认可的皮扣图像；外围皮革网格轻微弯曲，中央铜框区域保持刚性。**仍是正视2.5D道具，不是真实三维解舌扣，也不是皮革有限元。**
- 雾染复用 [Pavel Dobryakov WebGL Fluid](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation/tree/a2d292931f19d9b3b9f564e23e6c32729d2121c3)/MIT。512染料场、64速度场、超出屏幕的连续输入、轻微运动耦合。运动不额外制造染料。它是二维流动，不是三维体积烟或实测空气动力。
- 皮膜由内置imagegen编辑第四版原稿：去除大块水渍/积垢，保留干燥纤维、压折与细微边损。原始PNG为1024×1536；**不把放大后的画布冒称高分辨率扫描**。细微表面仍用第四版Poly Haven Leather Red 02/CC0的normal/roughness，幅度进一步减小，非历史羊皮实测扫描。
- 真实字体排字2048×2868，取消整体墨层模糊。300×420mm是本项目选择的名义比例，不是中世纪通行规格。标题和正文是古文书启发的现代纪念排版；Aboensis来源于15世纪瑞典法书，非英国某个王室文书的复原。
- 渲染使用明确物理像素缓冲，支持当前DPR3；上限350万像素避免意外超大缓冲。细看提供全页/放大切换。刷新跟随浏览器60/120Hz请求，不再主动将雾限到24fps；真实设备能否持续该帧率仍待实机确认。

## 研究依据

- [鲁汶大学卷藏文书展平记录](https://www.kuleuven.be/charters/exhibits/show/flattening-rolled-charters/flattening-rolled-charters)：长期卷藏、皮膜异质性和残余应力；亦说明部分木杆可能是19世纪保管改制。
- [英国国家档案馆羊皮环境研究](https://cdn.nationalarchives.gov.uk/documents/appropriate-environmental-conditions-for-parchment.pdf)：含水变化影响胶原结构与机械性质；不足以推出本样品的具体卷曲数值。
- [Codex Sinaiticus羊皮保护评估](https://www.codexsinaiticus.org/en/project/conservation_parchment.aspx)：皮膜的毛孔、厚薄、瘢痕与色泽变化；古旧不限于积污与烧边。
- [Three官方高密度显示指南](https://threejs.org/manual/pages/responsive.html)：显示尺寸与drawing buffer分开控制，兼顾像素密度及最大缓冲。

原稿、提示词、资产摘要、截图与验证结果在仓库 `research/scroll-lab-v5/`。所有运行素材同源。无新增订阅或收费外部API调用；内置生图产品额度无法单独计量。
