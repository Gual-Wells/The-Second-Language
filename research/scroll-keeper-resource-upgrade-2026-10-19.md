# 皮扣资产工具链升级与雾染资源实测

## 任务边界与新路线

用户已否决v14及本轮v15程序皮扣的艺术效果，明确Kaggle用于皮扣建模；雾效需进一步调查社区实现和文献。旧皮扣的轮廓、金属/皮革区分及陈旧感是艺术参照，不能反过来证明旧图器制无误。新路线优先完整资产和有参照的三维生成/制作，不继续在浏览器拼基础几何并靠细密贴图交差。

Kaggle本身只提供计算，不自动解决美术、拓扑和结构。实际采用标准仍是同一个物件：静物、侧背、材料、松扣/取下的可解释性和放回卷轴后的视觉关系。生成结果不等于成品，不能把技术COMPLETE当作艺术合格。

## 皮扣结构依据与资源选择

1. [York Archaeology原始报告](https://www.collections.yorkarchaeologicaltrust.co.uk/files/original/74504/GB2837-PUB-AY-17-15-Medieval-Finds-from-York_P-Ottaway-N-Rogers.pdf)：实际读取纸本2892–2897页文字和图1468/1469/1473。用于识别单框、针轴、针托、固定片、皮带连接关系；并不说明现代卷轴附件有唯一历史标准。
2. [该馆14世纪末皮护臂](https://www.collections.yorkarchaeologicaltrust.co.uk/s/collections/item/122895)：记录扣具通过皮带折返和tunnel stitching固定。可作为装配依据，不把皮护臂形状照搬为卷轴。
3. [Cotswold扣具](https://cotswoldarchaeology.co.uk/museum/buckle-and-plate/)实际年代为1550–1650，**不采用其“发现于中古城镇”代替器物年代**。
4. [Staffs FLO的中古铜扣扫描](https://sketchfab.com/3d-models/wmid-03de3d-medieval-buckle-5ab15a97faeb464787ec60226b5c95ac)有CC BY及原始考古记录，是真实器物形态候选；还未取得可编辑文件，不冒称已可直接复用。
5. 社区[Cyril43皮带](https://sketchfab.com/3d-models/leather-belt-8cba1fb2d0b6442cb0b7aa903025676c)及[C.U.V皮带](https://sketchfab.com/3d-models/leather-belt-78b2b486c65e4fc59498bc17038eef78)声明CC BY，但当前取得与三维检验尚未完成。现代腰带也不能仅凭PBR称为符合项目风格。

已有T4环境曾在龙币项目实际取得完整可编辑GLB。此次复用其微软TRELLIS.2固定源码`75fbf0183001ed9876c8dbb35de6b68552ee08bd`、模型revision、受限DINO权重授权核验、已构建几何算子及已修复的LazyModel流程。输入是项目自有旧皮扣图片，按比例缩放、透明合成到黑底并补方形边界，不使用本轮被否决的网页几何作训练/目标。

私有Notebook：`gualwells/scroll-keeper-material-study-20261019`；请求的session timeout为1800秒，**不能把它当作包含平台启动的真实墙钟上限**。首次提交漏了kernelspec，在模型运行前失败，消耗约14.484秒GPU；修正配置后提交v2，保留原始失败回执。不能将这次脚本错误归咎于模型、地区或平台额度。

v2最终成功取得可编辑GLB，实际代码执行648.99秒。长时间RUNNING、日志空白和运行中quota临时显示6015秒，曾被误解为空转扣用量；结束后平台将总用量校正为685.187秒（剩107314.813秒）。最终日志显示模型代码到19:16:37 UTC才开始执行，早期无日志阶段的确切平台原因仍未知。不能继续声称“浪费约100分钟GPU”。日志流连接失败也不代表内部未执行。详情、真实渲染和限制见`scroll-keeper-kaggle-v2/README.md`。未取消该运行，准备的启动probe未提交，避免在成功后无必要重复验证。

后续必须先看生成的真实灰模及PBR正/斜/侧/背，核对针、框、孔和皮带的边界。若整体资产的机构被融合，只能作为材料/形体研究，不直接挂上动画。须决定是否用成熟DCC重新分件/绑定，不能再次依赖平面放大、alpha淡出或无边界的软变形冒充解扣。

## 雾：先运行原作，再选适配方法

实测入口`scripts/inspect-fog-resources.mjs`，原作截图与错误记录在`scroll-lab-v15/resource-trials/`。本机402×874 Chromium，不是iPhone Safari认证。

| 资源 | 实际取得/验证 | 本项目判断 |
|---|---|---|
| [Realistic Smoke Wisps](https://github.com/zlollo/realistic-webgl-smoke) | pin `87c1d57fded21f60b0ae18f7f7d979bcf4d8ab60`，MIT；原样运行minimal，实见柔软细烟，无脚本错误 | 渲染链有用，原作是单点香烟上升，不能原样冒充环境雾。项目知名度/长期稳定性尚无充分证据，不因功能表完整就称行业标准 |
| [Donitzo体积渲染器](https://github.com/Donitzo/three.js-volume-renderer) | pin `5bce88363582e5ac6f70b167f08a798d8094312e`，MIT；原作启动、载入4D NIfTI数据，无脚本错误 | 能播放真实FDS烟数据；仍需去掉示例天空/调色/GUI后检验，不把GUI遮住的默认截图算项目美术验收。射线步数、体数据体积和移动端成本需权衡 |
| [hmans Soft Fog](https://github.com/hmans/composer-suite/blob/aa076d6330c654ecbbde9c88171a51e79a0001fe/apps/vfx-composer-examples/src/examples/FogExample.tsx) | 重新读源，采用烟纹理、粒子随机方向/旋转和深度软化；旧线上地址已失效 | 技术链可参考，但尚未取得可直接交付的完整现代化雾效，不能只复制接口名 |
| [WildSmoke作者页](https://autumnyq.github.io/WildSmoke/) | 论文、作者的重建及再模拟展示；页面仍标Code coming soon，提供序列/权重链接 | 数据驱动4D烟雾是有价值的备选；当前未核实资产许可、读取成本与网页交互适配，不把论文结果当即插即用产品 |

### 方法认识

[Bridson等Curl Noise论文](https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph2007-curlnoise.pdf)说明速度可由势的旋度得到，尺度和时间可分别控制，边界/运动物体还需要相应处理。不能把“加了simplex/curl”当作自然雾的充分条件。当前程序二维速度加法也不能冒称已经实现论文中的完整固体边界条件。

[NIST FDS/Smokeview](https://pages.nist.gov/fds-smv/)代表离线物理模拟与可视化路线，适合研究高质量体数据或烘焙序列；不是要求iPhone浏览器实时运行消防模拟。

v15继续用染料场直接着色，速度提升后出现油纹；静态噪声遮罩又出现云斑背景。这两个结果均被保留为失败依据。新研究将“运动场、密度出生/消亡、粒子/体积渲染”分开，优先复用已实际好看的渲染链。

独立粒子适配试验`/labs/scroll-atmosphere-study/`保留原作的GPU状态纹理、3D simplex导数、点精灵、焦散/软化和预乘透明合成，改为空间区域出生、独立寿命、双向流动和卷缘局部速度响应。它没有温度、湿度、压力和真实纸张障碍碰撞，不称物理标定仿真。初轮曾有散景圆片感，尚在检视，未接入正式藏卷。

## 交付约束

新资源与研究结果先独立检视，失败的v15程序皮扣不得借Kaggle之名继续发布。原样品保留，不改真实测试/认证。新资产的可编辑原件、模型/源图pin、许可及派生关系一起保存；凭据留D盘私有配置。Kaggle使用已有免费周期额度，不新购GPU或订阅。
