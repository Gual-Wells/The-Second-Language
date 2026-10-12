# 仇视之龙三维样币：工程停滞根因、工具/模型重选与可执行生产架构研究

> 2026-10-13 · 独立技术研究报告 · 本报告为**选型和工程建议**，不是新设计协议、用户艺术验收、模型完成证明，也不修改 Canonical C/M。  
> 仓库调查基线：`Gual-Wells/The-Second-Language@56732ed3256e0299ced8cff9632434de44dfee94`。外部工具核查截至 2026-10-13。  
> 适用对象：已存在旧版真实三维样币，并已有用户批准正面稿图的「仇视之龙」。不能把此案例偷换成从零建模，也不能将技术测试件提升为美术母版。

## 0. 执行结论

**根因不是单纯“GPU 太弱”或“TRELLIS.2 模型不够强”，而是将 image-to-3D 整物体生成、低维局部形变和删面工作，当成了既有高密度艺术网格的受控雕塑/局部重建。** TRELLIS.2 已验证生成能力，却没有为“旧网格 + 局部编辑掩码 + 新稿图 + 保护未修改区域”提供即用的完整编辑接口；Blender 的局部 Lattice/BMesh 已验证可操作，但此前并未建立足以完成新指节、完整断口、真实碎块及侧背接触的雕塑生产流程。

**采用策略：保留旧高价值雕塑母版；把 Blender 作为生产主引擎，以 Trimesh/Open3D 做诊断、Manifold3D/Blender Boolean 做有效输入上的实体操作、原生 Sculpt/局部重新建模做艺术形体；Codex 负责操作、对照和证据闭环；Kaggle 只按需运行生成、分件研究模型或材质推理。** Blender MCP 可评估为交互控制升级；PartField、PartCrafter、Prox-E 为不同等级的受控研发候选，而非必须先部署的阻塞前提。

这不是声称“自动化必然达到名家雕塑水准”。真正的艺术品质仍须在完整母体中以固定视角、多视角灰模及审美评估迭代，无法由文件生成成功、单一重投影误差或拓扑指标替代。

## 1. 仓库现状：必须继承什么，已经成功什么

### 1.1 本轮权威与不可覆盖的资产

- **正式视觉目标**：`../concept-anchor-v1/assets/reviewed-fourth.png`（与 `selected-anchor.png` 相关采纳说明并存）；仓库记录文件 SHA-256 为 `6608204082a4036120e0c2b607fad6f27b2aa16fa3122afa37a43ac94d4f967d`。被否决的是后来整币重新生成的三维候选，**不是**正式 AI 正面稿图。
- **旧工程母版**：`original-eye-v5/working-master.blend`，仓库记载 SHA-256 `29d468975ebb83d3295f88318c3fcc505c6e73624566455c6aeded65f58b6303`。相关大文件实际位于原工作机 D 盘；本报告未直接装载该本机大文件，以下以已提交脚本、说明和 JSON 回执为事实边界。
- 保护原眼、头、角、嘴和龙身的已被认可优点，及作品完整体量与曲线；新爪形、缺口、碎片和侧背真实接触是**待转译目标**，旧网格在这些已变化对象上不能拥有永久美术权威。
- 统一币背为系列级需求，但纹样尚未在这里指定；本报告不设计币背图案，不重启被叫停的三视图生成，不自动改变既有 `protocol/COIN_CRAFT_TEMPORARY.md` v1.2。

依据：[当前设计/执行状态](../../certification-coin-execution-state-2026-10-12.md)、[旧网格 retarget README](../old-mesh-retarget-20261013/README.md)、[当前临时协议](../../../protocol/COIN_CRAFT_TEMPORARY.md)。

### 1.2 真正发生过的局部编辑

现有 `old-mesh-retarget-20261013` 回执记录：

| 项目 | 已记录结果 | 正确解释 |
|---|---:|---|
| 正式图稿/旧渲染 SIFT 配准 | 33 个内点，中位误差 1.6446px，画幅尺度约 1.155 | **全局视图配准**成立，不等于每个指节已获得准确三维对应 |
| 上爪姿态编辑 | 13,795 个受影响顶点 | 已有真实局部位移 |
| 下爪姿态编辑 | 8,320 个受影响顶点 | 已有真实局部位移 |
| 未修改抓握区之外的顶点 | 485,573，原坐标保持 | 当前局部编辑的保护能力成立 |
| 最大位移 | 0.035965 模型单位 | 只能证明几何变动，不证明造型质量 |
| 新艺术 mesh 创建 | false | 未创造缺失的关节、断口或碎片 |
| 艺术采用 | false | 尚非完成品 |

脚本使用 `geometry_0`、原生 Lattice、顶点权重、固定包络位置及三维位移，确实保存了可关闭修改器的工作副本。早期 `pose-a` 曾折叠爪尖；`pose-c` 在拆分旧浮块时残留相连薄壳；`pose-d` 保留全部原构件。需要区分**变形器正确执行**和**高质量雕塑被完成**。

数据：[修订回执](../old-mesh-retarget-20261013/revision.json)、[SIFT 配准](../old-mesh-retarget-20261013/image-registration.json)、[实际变形脚本](../old-mesh-retarget-20261013/retarget-old-claws.py)。

### 1.3 生成与背面处理的已知失败

- 旧 TRELLIS.2 512 生成取得真实 GLB，原件 `370,709` 顶点/`476,593` 面；官方修复重导变为 `692,339` 顶点/`970,260` 面；这只是网格密度变化，不是艺术质量提升的证据。[原报告](../kaggle-test/outputs/art-review-512/mesh-review.json)、[修复报告](../kaggle-test/outputs/official-repair-review/mesh-review.json)。
- 2026-10-13 新批准图的**整币**重新生成已完成导出，但侧背出现重复浮雕、撕裂/孔洞和错误侧缘，已被用户否决；该样品必须隔离为失败证据，不能借新生成稿替代旧母版。
- 早期 `reverse-sculpt-v2` 用 `bmesh.bisect_plane` / `delete` / `holes_fill` 删除约 `146,667` 个面，回执记录 `filled_cut_faces:0`；`quiet-repaired-v4` 类似尝试删除约 `297,265` 个面仍记录 `filled_cut_faces:0`。这**不能单凭数字证明必有未封口漏洞**，但绝不能把“删除错误面”写成“有效三维背面已重新建设”。[记录 A](../kaggle-test/outputs/reverse-sculpt-v2/reverse-study.json)、[记录 B](../kaggle-test/outputs/quiet-repaired-v4/reverse-study.json)。
- 旧模型侧背仍有扇状残余、薄壳、抓握接触与破口未完成，不应通过削平背面、生成大圆盘或者材料/灯光覆盖来回避。

### 1.4 Kaggle 实际能力边界

仓库曾在 Kaggle 实测两张 Tesla T4、每卡约 14.56 GiB 可用显存，完成 TRELLIS.2 512 推理及导出；部分 BF16 注意力、依赖和稀疏算子通过特定适配运行。**两张卡并不是任意模型可共享的连续约 29GB VRAM。** 2026-10-13 样币任务后回执记录剩余 `97,325.987` GPU 秒（约 27.0 h）是**当时快照，不是本报告的实时额度**。

现有本机是 Blender 4.5.3 / MX250；此前 CUDA Cycles kernel 加载失败而回退 CPU 渲染，这不等于本机不能建模、拓扑分析或用 Workbench 渲染；也不证明必须把每次几何编辑都搬去 Kaggle。参见 [Kaggle 生产参考](../kaggle-test/PRODUCTION_REFERENCE.md)。

## 2. 失败机制：五种不应再混同的能力

1. **Image-to-3D 生成**：从图像猜出完整三维。正面信息无法唯一确定背面、指爪包缘和断口深度，模型必然引入先验猜测。生成成功不意味着旧母版已被编辑。
2. **既有网格变形**：Lattice / Armature / Shape Key 能移动原表面，但不凭空建立新指节、全新断裂拓扑或正确的隐藏接触。
3. **几何结构修改**：Boolean、BMesh、局部重网格能产生体积、开口、桥接和分件；其可靠性取决于输入是否语义正确、局部实体是否有效。
4. **艺术雕塑**：掌指关节面、骨骼力量感、鳞片起伏、咬合关系等需要有造型目标的 Sculpt/Surface Reconstruction，不是靠增加随机细节或统一形变代替。
5. **材质与展示**：PBR/环境光/烟雾可增强感知，无法修复错误的几何、拓扑与背面。

因此，现有停滞的主要原因是 **从第 2 层长时间停留，却希望得到第 3、4 层的产物**。现有提交的日志可以证明具体脚本效果，但不能仅凭这些文件完整归因 Codex 每次会话的全部 token/耗时分配；要做会话级性能审计需另取完整执行轨迹。

## 3. 核心生产栈：现成可用与需验证的工具

| 工具 | 应承担的工作 | 现有验证/限制 | 采用建议 |
|---|---|---|---|
| **Blender 4.5.3** + `bpy`/`bmesh` | 真正的资产母版、Sculpt、非破坏修改器、分件、装配、Boolean、渲染 | 本项目已有 Blender 脚本工作证据；高级局部雕塑质量尚待检验 | **立即主线** |
| **Trimesh** (MIT) | 连通分量、网格统计、射线/空间查询、导入输出、分件比对 | CPU 友好；分件语义不是自带神谕 | **立即主线** |
| **Open3D** (MIT) | 邻接、非流形/自交/封闭性检查、点云、几何诊断 | 不自动理解「爪」与「币缘」 | **诊断主线** |
| **Manifold3D** (Apache-2.0) | 实体交并差、切除后获得有效实体 | 官方要求有效 manifold 输入；原始破损 AI 网格常须先局部修复/重建 | **针对有效输入采用** |
| **PyMeshLab** (GPL) | 去重、清理、简化、重采样、局部修复 | 大规模重采样易破坏爪尖/细节，按对象使用 | **按需** |
| **Blender Cell Fracture** (GPLv3+) | 对干净实体产生有厚度的破碎片候选 | 扩展声明兼容 Blender 4.2+，用户评价亦反馈切割/间隙问题；不理解受力美术 | **破口试验** |
| **Blender 官方 MCP Server** | Codex/LLM 对 Blender 正在运行场景执行可控操作与读取结果 | 官方要求 Blender 5.1+；需另装服务器、扩展和客户端；允许执行 LLM 代码，存在数据安全风险 | **独立沙盒测试，不阻塞 4.5.3** |
| **TRELLIS.2-4B** | 新物体/局部原型候选；几何通过后的已有 mesh 材质生成 | 本项目 image-to-3D 已成功；没有即用的精确旧网格局部编辑接口；texturing 独立 pipeline 尚未在现有 T4 全流程验证 | **保留辅助** |
| **PartField** | AI 生成网格的部件特征/层级分割候选 | 官方专门讨论 TRELLIS 类碎裂连接问题；T4 和复杂龙币效果未验证；NVIDIA 许可限非商业教育/研究 | **限定用途研究** |
| **PartCrafter** (MIT 代码) | 图像驱动多部件三维原型候选 | 官方说明最低 8GB CUDA VRAM；显存够不代表精细龙爪艺术质量/旧母版原位编辑 | **Kaggle 对照实验** |
| **Prox-E** (MIT 代码) | 真正朝已有网格结构局部编辑的研究型框架 | 使用 SuperDec、上一代 TRELLIS、VLM、CUDA 渲染与多个检查点，不能等同于已适配的 TRELLIS.2；模型/依赖许可须单独核对 | **中期研究、不设为必需** |
| **VoxHammer** | 原生 3D latent 编辑研究参考 | 官方要求 >=40GB GPU，强烈推荐 A100 80GB；本账号 T4 不满足 | **当前排除正式部署** |
| **Three.js/glTF** | 仅从已通过艺术验收的母版派生 Web 交互资产 | 现有项目已实现查看器；实时版限制不可反向压缩艺术母版 | **延续** |

**许可证边界**：不要把 GitHub 上「可看源码」等同于「可商用」。特别是 PartField 的 NVIDIA License 第 3.3 条明确要求非商业研究/教育；研究输出、模型权重、数据与衍生物应另作授权核查。Prox-E 主代码是 MIT，不表示其所调用的 TRELLIS/SuperDec/第三方 VLM 资产拥有同一许可证。GPL Python/Blender 扩展的分发义务也应依具体分发方式审查。不要因为本文标注可能可用而自动发布第三方权重或代码。

## 4. Kaggle / TRELLIS.2 能做什么、不能做什么

本项目固定使用的微软 TRELLIS.2 源版本为 `75fbf0183001ed9876c8dbb35de6b68552ee08bd`，模型 pin 见 `../kaggle-test/sources/generation-model-pins.json`。

### 4.1 Image-to-3D 管线的根本边界

官方 `Trellis2ImageTo3DPipeline` 实现包含图像预处理、稀疏结构采样、shape SLat、形状解码、texture SLat、导出/后处理等。可以保留 shape/texture latent 供恢复、解码和实验。但是标准 `run(image, ...)` **不提供已经定义好语义的**「old_mesh + region_mask + target_image + hard_preserve」编辑契约。

潜变量可访问 **不等于** 旧 mesh 局部可精确保真地修改；更高输出分辨率 **不等于** 侧背可被正确决定；运行两张 T4 **不等于** 可以无修改运行所有后续编辑模型。

官方固定源码：[image pipeline](https://github.com/microsoft/TRELLIS.2/blob/75fbf0183001ed9876c8dbb35de6b68552ee08bd/trellis2/pipelines/trellis2_image_to_3d.py)、[README](https://github.com/microsoft/TRELLIS.2/blob/75fbf0183001ed9876c8dbb35de6b68552ee08bd/README.md)。

### 4.2 已有网格材质生成是另一种能力

`Trellis2TexturingPipeline.run(mesh, image, ...)` 包含 mesh shape SLat 编码以及条件 PBR 生成。这是*已有形状的材质处理*，不能替代新的指节、真实破口和侧背结构。

官方：[texturing pipeline](https://github.com/microsoft/TRELLIS.2/blob/75fbf0183001ed9876c8dbb35de6b68552ee08bd/trellis2/pipelines/trellis2_texturing.py)、[example_texturing.py](https://github.com/microsoft/TRELLIS.2/blob/main/example_texturing.py)。

建议到**几何验收后**，先在测试 mesh 上做 512 的文本/材质预检，测显存、导出前后形状偏差、PBR 等效性；在未实测前标记 `UNKNOWN` 而非 `VERIFIED`。

### 4.3 其他模型的实际投资边界

- **PartField**：更适合解决“旧 mesh 内哪些表面属于一只爪”而非直接改好爪。先从完全公开、获许可的中性测试网格开始，单独建 PyTorch/CUDA 环境，不在目前工作的 TRELLIS.2 环境里无条件升级依赖。聚类输出只是候选标签，真正接触处人工/程序几何复核。
- **PartCrafter**：更适合做分件结构候选而非受保护旧模型的局部替换。官方 8GB 最低要求只是条件之一；试验须限制部件数、显存、输入图像和单次预算。不能只因它生成多个部件就认为接缝、尺寸和雕塑质量自动成立。
- **Prox-E**：存在 `--input_mesh`、`--edit_instruction` 及结构代理体→编辑→生成闭环；设计意图非常符合问题，但实际依赖上一代 TRELLIS、SuperDec、VLM、FlashAttention 和额外 CUDA 构建。常规 FlashAttention-2 对 Turing T4 有兼容障碍；不宜假定在现有镜像直接跑通。优先阅读分件/保留机制、抽取可借鉴流程，再决定是否值得独立适配。
- **VoxHammer**：官方最低 40GB GPU，因此当前按硬件排除，不为迁移而中断生产。

## 5. 正确的资产结构：保护优点，而不是“全部固定”或“推倒重来”

采用 `parent → reversible delta → tested candidate → accepted canonical` 的资产谱系。以下只是**建议的可编辑部件划分**，不是要求马上破坏现有 mesh：

| 逻辑层 | 处理原则 |
|---|---|
| 龙头/原眼/角/嘴 | 旧认可高精度表面为保护资产，设保护 mask 和快照；没有明确设计授权不重雕 |
| 躯干和主体浮雕 | 保留被认可体量/曲线；将影响范围限于与新爪及结构相接的局部 |
| 左上爪 | 可先用旧爪作定位和可复用部分；需要时局部重新建掌骨、指节、爪尖，分件雕塑再整合 |
| 右下爪 | 保留已认可气势；补足回扣指、侧背真实接触；不能只调整正面轮廓 |
| 币坯/侧缘/背面结构 | 可建立干净的参数化**技术实体基底**；它是 M-tech，不因此成为审美设计权威；不要把原有艺术有效结构一起削平 |
| 左上破口 | 从真实币缘实体切削，生成有厚度的断面，再局部雕塑破裂与挤压 |
| 碎块 | 尽量保留从断口局部取材的来源关系；独立的可移动对象可以保持独立 mesh |
| 统一币背 | 另有系列级设计研究；这里仅约束与现有跨缘爪和侧壁的真实衔接 |
| 材质/光效/黑雾 | 后置独立层；不得修饰遮盖尚未通过的灰模错误 |

**分件不等于全部外观上硬切割。** 将建模对象划分清楚是为了可操作和可回退，最终视觉上应通过雕塑与装配过渡使其自然连续；数字展示也不强制所有碎块和装饰合成一个 manifold mesh。

## 6. 推荐的实际编辑手段：按难度阶梯选取

1. **局部姿态已存在时**：Lattice、Shape Key、骨骼、比例变形。保留但不要无限调整位移系数企图生成关节新结构。
2. **缺失新的宏观形面时**：用曲线/截面/基础体块建立可控的大形，再在参考图、旧母体和多角度约束下 Sculpt；程序性 blockout 不得变成取代批准稿的审美祖先。
3. **需要真正缺口时**：先确认局部币坯是封闭实体，对其用 Manifold3D/Blender Boolean；若输入薄壳/非流形，先做区域隔离、重建和质量检查；再 Sculpt 断口边沿及挤压关系。
4. **需要浮游碎片时**：Cell Fracture 或受控 Voronoi 对局部实体产生碎裂候选，筛选成“短、厚、不规则且可解释来源”的碎块，手工/代码重雕，非自动均匀拼图。
5. **需要精细纹理与形面时**：先完成掌骨/指节/爪尖和真实接触，再局部添加鳞片、划痕、金属微表面；不能撒噪声取代造型。
6. **需要与批准稿进一步吻合时**：在已有合理三维基础上，用固定相机与关键点、轮廓/边界、保护区和几何正则联合比较。单视图图像优化不能决定隐藏的背部厚度。

### 独立的网格诊断关

对旧 `geometry_0` 先构建：连通分量尺寸、面邻接、边界边、非流形边、自交候选、细小退化面、法线方向、局部壳层、厚度和不同局部间的空间关系。原 mesh 的“相同 `x,z` 平面范围”不等于“同一语义对象”；务必加入深度、面邻接和可视性。

分割方案分两层：
- **基础确定性分析**：Trimesh/Open3D/BMesh，透明可复算；用于定位可编辑区域和明显坏连接。
- **AI 候选语义标注**：PartField（许可与显存通过后）可提出爪/躯干/币缘等面簇，须回投完整母体审查；不允许把标签未经检查直接作为破坏性布尔掩码。

对人为漂浮的碎块不要套用“整币必须单体 watertight”这一错误总规则；根据实体类型分别验收。

## 7. 最小可行的生产演示（MVP）：只验证左上抓握/破缘

不能以“继续长期优化全币”替代工具能力证明。下面是推荐顺序，不宣称它是新的强制设计协议。

### E0：冻结基线与可回退结构

输入旧母版哈希 + 已批准视觉稿哈希；只在副本上工作。导出固定视角的原网格灰模（正/左右 45°/侧/背）、局部抓握特写、基准网格报告与保护区点集。先查本地文件和现有工作副本是否相符，禁止仅凭报告推定文件仍在且相同。

**完成条件**：前后可追踪、脚本可复跑、母版零覆盖。失败就停止后续破坏性操作。

### E1：定位真正的局部结构

先作连通分量分析、厚度/壳层/重叠诊断、投影与对应点构建。圈定：爪掌、主要指节、爪尖、币缘断口、与之相连的碎片和必须保留的躯干。

**完成条件**：每个可编辑区域能解释来源；已识别的混乱壳层有隔离与回退方案；不以矩形坐标阈值当成最终部件身份。

### E2：只在副本建立**真实破缘**

用局部有效币坯制作有厚度的破口，切出真正的断裂形面，保留批准稿的爪尺度/破口遮挡关系及龙身体量。此时不做全币背图案、PBR、烟雾或整币再生成。

**完成条件**：正面可读、斜/侧面有真实深度、与母体连续合理、原眼头角躯干未被误改。若失败，针对输入拓扑/布尔/雕塑各自定位问题，而不是盲目提升生成分辨率。

### E3：雕塑左上爪并完成接触

在旧爪优点和批准稿约束下，对指节、掌部、爪尖创建可编辑的局部雕塑结构。局部可建立新网格、局部 remesh/Boolean/桥接，受影响区域之外不发生非授权漂移。爪要在正/斜/侧视角读作有力量的“捏碎币身”。

**完成条件**：关节形面清晰、爪尖运动方向自然、抓握深度与断口配合、没有悬浮交叠或突然折断的薄壳；并提供多视角实际几何证据。到这里才有资格说“局部重塑能力得到初步验证”。

### E4：碎块、下爪和侧背延续

在完整母体中完成与破缘来源相符的碎块，下爪回扣指与侧背接触。独立碎块有体积，但无需都融合到主网格。背面暂为系列币背的结构接口，不擅自创作统一纹样。

**完成条件**：正面与隐藏视角不互相矛盾，爪延伸到侧背且不会出现镜像龙头、扇状误生成结构或失去职责的浮动壳层。

### E5：全局几何审查 → 材质 → 交互导出

经审查接受的 M-design 才进统一币背艺术转译。随后按高精度母版 → 金属/氧化/眼口发光/黑雾独立层 → Web GLB 派生的顺序制作。优先采用 Blender PBR 与 CC0 HDRI/纹理基底；TRELLIS.2 现成 shape-conditioned texturing 可后置对照。

**完成条件**：独立的艺术母版 `.blend`、真实可旋转三维 GLB、按角色分类的几何完整性报告、固定角度灰模/材质图、原件/变更哈希和一份明确的艺术验收决定。GLB 导出成功本身不能充当验收。

## 8. 工程调度和节制：什么操作应该消耗哪些资源

| 工程动作 | 优先运行位置 | 资源/风控规则 |
|---|---|---|
| mesh 检查、局部分件、代理体/Boolean、Workbench 灰模 | 本机 Blender/Python CPU | 避免昂贵 GPU 往返；工作副本和输出留在 D 盘 |
| 复杂 AI 分件与分件生成 | Kaggle T4，先短探测 | 独立 Notebook/requirements，不覆盖已有 TRELLIS.2 成功环境；监测显存、额度、下载和 checkpoint |
| Prox-E 及 GPU 要求高的编辑模型 | 先离线源码研究、后独立环境探测 | 不能因“代码公开”就放行不受支持的 T4 作业 |
| LLM/Blender 操控 | Codex + 本机 Blender 脚本；MCP 验证后可增量引入 | MCP 5.1+ 必须 sandbox，执行代码可删除/读取数据；保持操作日志和资产隔离 |
| 艺术比较 | 固定相机/一致灰模、完整母体多角度 | 不用面数、像素小改或 GPU 耗时替代审美 |
| 高质渲染/材质 | 几何通过后，按瓶颈选择本机/云 GPU | 原形状错误时不得继续为表面特效付出主工时 |

**停止/升级条件**：同一局部办法连续失败且没有几何增量时，停止继续调参，形成失败归因后改变**工具等级**：Lattice → 对象分件 → 实体重建 → 艺术 Sculpt → 必要时 AI 辅助；禁止循环整币采样、后期补写验收或把工具预检写作美术完成。

**可量化但不可替代审美的检查**：保护区原坐标或表面距离；局部几何修改范围和来源；边界/非流形统计；侧视厚度；真实接触与断口关联；固定视角下的参考轮廓/关键点误差；多视角截图和主观作品身份评估。指标共同使用，避免只优化单张正面图。

## 9. 专项工具的验证协议（哪些要做，哪些不必做）

| 专项 | 最小试验 | 通过门槛 | 未通过的处理 |
|---|---|---|---|
| Blender 5.1+ MCP | 单独安装/沙盒打开测试工程，列对象、复制对象、加修改器、渲染截图 | 受控操作/结果回读/回退均成功；没有访问真实凭据 | 保留现有 4.5.3 headless Python，MCP 暂不引入 |
| Manifold3D | 干净测试币坯 + 一个受控局部破口 Boolean；再试修复过的局部旧 mesh | 面/体积与边界有效、局部剪影正确 | 先诊断重建输入，不直接对整张薄壳 mesh 强制布尔 |
| Cell Fracture | 小型实体的局部受力方向碎裂、重合与缝隙检查 | 碎块厚度、接触/缺口来源成立，可独立微雕 | 改程序性断裂面/局部手工设计，放弃自动均匀碎块 |
| PartField | 中性样例 → 局部龙爪邻接模型 → 全旧 mesh | 对象标签明显优于纯坐标分割，且能控制误分割 | 不作为生产依赖；保持确定性选择 + 局部人工核验 |
| PartCrafter | 非正式局部结构输入，减小 part/token 数 | 显存稳定、可导出、关节/装配有真实增益 | 只记研究结果，不用无意义样本污染母版 |
| Prox-E | 查看官方自带 demo，核对各依赖/VRAM/许可证，再决定短跑 | 可在可承受资源下稳定做**已有模型**编辑，并证明未修改区保真 | 作为算法参考，不为模型兼容迁移付出无界成本 |
| TRELLIS.2 texturing | 对几何已验证的小型 GLB 做 512 材质测试 | 带 PBR 输出、材质结构合理，mesh 差异可归因 | 使用 Blender 原生 PBR，不阻塞样币 |

这里每个试验都应记录 `UNTESTED → WORKING → VERIFIED/REJECTED` 的可验证事实，区别于“工具具备理论功能”的判断。

## 10. 建议的立即行动与非目标

**先执行**：基线检查、局部网格体检、局部有效币缘实体的真实缺口试验、左上爪的可编辑局部雕塑。它们不依赖新收费服务，也不依赖 PartField/Prox-E 安装。先完成一个高质量局部，才能证明重选工具能够转化为三维质量进展。

**并行短试**：独立 Blender 5.1 MCP 的能力与安全测试，以及 PartField 对旧 AI 网格语义分件的实际增益评估。试验结果没有通过不能阻塞基础 Blender 流程。

**暂不做**：重新整币 AI 采样、将新失败网格当工程祖先、用材质掩盖灰模问题、强制把所有艺术对象变成单一网格、为了尝试新模型更换整套已工作的 Kaggle 环境、在未经许可审核的情况下把研究权重用于正式商业流水线。

**不触碰**：原始 `.blend`、已批准的正式稿图、正式 PWA 产品、当前币背设计权威与既有协议文档。

## 11. 外部一手参考（核对于 2026-10-13）

1. Blender 官方 MCP 与警告（需 Blender 5.1+，执行 LLM 代码无内建安全保障）：https://www.blender.org/lab/mcp-server/
2. Blender Python API / BMesh：https://docs.blender.org/api/5.1/ ；Sculpt：https://www.blender.org/features/sculpting/
3. Blender Cell Fracture 官方扩展与兼容版本：https://extensions.blender.org/add-ons/cell-fracture/ ；https://extensions.blender.org/add-ons/cell-fracture/versions/
4. Trimesh：https://github.com/mikedh/trimesh ；Open3D：http://www.open3d.org/docs/latest/
5. Manifold3D 源码与非流形输入限制：https://github.com/elalish/manifold ；https://github.com/elalish/manifold/wiki/Manifold-Library
6. PyMeshLab：https://pymeshlab.readthedocs.io/
7. Microsoft TRELLIS.2 固定生产使用版本：https://github.com/microsoft/TRELLIS.2/tree/75fbf0183001ed9876c8dbb35de6b68552ee08bd
8. NVIDIA PartField 与 License（非商业研究/教育限制）：https://github.com/nv-tlabs/PartField ；https://github.com/nv-tlabs/PartField/blob/main/LICENSE
9. PartCrafter（最低 GPU 显存与多部件生成）：https://github.com/wgsxm/PartCrafter
10. Prox-E SIGGRAPH 2026（`--input_mesh`、上代 TRELLIS + SuperDec/VLM）：https://github.com/etaisella/Prox-E
11. VoxHammer 官方要求 >=40GB 显存：https://github.com/Nelipot-Lee/VoxHammer
12. Poly Haven CC0 HDRI/纹理：https://polyhaven.com/ ；ambientCG CC0：https://ambientcg.com/

## 12. 与现有文档的关系

- 作品当前状态与用户设计授权仍以 [certification-coin-execution-state](../../certification-coin-execution-state-2026-10-12.md) 和 [COIN_CRAFT_TEMPORARY](../../../protocol/COIN_CRAFT_TEMPORARY.md) 为准。
- 本报告解释为什么上一阶段“工作很多、质量增量很少”，并提出工具重选和能力验证方案。它不会自动改变任何 `K-fixed`、`Canonical C/M`、用户已做的设计判断。
- 未读取到的本机大型 Blend/GLB、未实际测试的 Kaggle AI 编辑管线、尚未取得的 Blender MCP 运行回执，继续明确为 **UNKNOWN**。后续如有新证据，可对照验证后修订本报告，不能把建议倒填为既有成功事实。
