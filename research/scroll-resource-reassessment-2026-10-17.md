# 卷轴项目：完整资产、成熟效果与制作路线重评估

2026-10-17。研究基线：`codex/medieval-scroll-lab-2026-10-16`，`07fd71f`，研究开始时工作树干净。此轮不修改样品、不购买资产、不新增订阅。公开网页、创作者资料、仓库源码与原作演示分别核查；不将商品描述当成已取得并验证的源文件。

## 当前产品判断

**用户已否决增强版的雾、木轴、收束带质量。**之前19项检查只验证基本运行，不能支持美术通过。已获认可的基础版仍是参考入口；两个样品均保留，不将增强版作为正式采用版本。

关键失误不是 Three.js 能力不足，而是我主要复用了引擎/数学/素材，随后自行填补缺失的美术资产、动作和效果导演，最终又用“工程运行正常”过早结束制作。今后优先取得和复现完整作品、可编辑资产或已有成品效果，再做有限适配。资源是否成熟，必须同时看外观与实际交付，而不能只看库名、星数、分辨率和“game-ready”标签。

## 一、先回答结构与做旧

### 木轴不构成中古正式文书的统一下端结构

此前依据不足：15世纪意大利祈祷卷的收藏记录、19世纪 Esther 卷轴与现代幻想道具不是同一种对象。不能混合后声称“中古正式卷轴的轴在下端”。

本轮发现更直接的[鲁汶大学文书修复记录](https://www.kuleuven.be/charters/exhibits/show/flattening-rolled-charters/flattening-rolled-charters)：文书原来折叠送达；可能在19世纪改为卷藏，其中一些在**顶部**接木杆。因此照片中的木杆还可能是后来的收藏/保存结构，并非文书原制。

[英国国家档案馆 Pipe Rolls 指南](https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/medieval-financial-records-pipe-rolls-1130-1300/)描述多张皮膜的拼缀、卷藏和防护；[Chancery 说明](https://www.nationalarchives.gov.uk/education/students/videos/spotlight-on/spotlight-on-chancery/spotlight-on-chancery-transcript/)还区分记录卷与向收件人发送的文书。不能因为同称 scroll/roll 就假设器制相同。

**设计结论，而非用户新决定：**本项目可选择“卷藏的羊皮文书”或“中古幻想艺术卷轴”。前者不预设必须有木轴，后者可以采用做得好的木轴与收束结构，但应视作艺术选择。此轮没有替用户删掉木轴或确定最终形制。

### 当前做旧的真实构成

- `chapter-scroll/assets/parchment-cron.png` 原有裂口、色斑和折痕，原分辨率628×470；不是实物皮膜扫描或完整PBR。
- v2 `document.js / ageSkin` 叠加边缘暖褐晕染、边缘淡水痕、短细线，以及程序生成的微小凹凸。它们不是根据一件实物的磨损分布制作的美术层。
- 墨迹为独立字体画布；轻微模糊后再叠清晰原字，另有随机细点擦除。随机擦除并不等于经过设计的墨迹老化。
- v2 `scroll-object.js / createShaft` 是原生旋转体加Poly Haven扫描木纹；`createBand / updateBand` 是原生窄带与近似展开路径，没有现成绳结资产或解绳动作。
- v2 `mist.js` 采用Drei云实例与预烘焙JangaFX云密度，但外观、拉伸、流动和构图主要由我临时组织；不是完整成熟雾效的直接复现。

应保留真实英文排版、独立墨层、固定UV和分层组织；重新选择美术基底与动作，不继续靠增加随机噪声来掩盖基础材料问题。

[Codex Sinaiticus保护研究](https://www.codexsinaiticus.org/en/project/conservation_parchment.aspx)区分制皮结构与退化，并指出保存良好的皮膜可以长期保持较好状态；[两份历史皮膜文书的研究](https://pmc.ncbi.nlm.nih.gov/articles/PMC7662666/)观察到暴露区域、积尘折线和折角损失之间的联系。对本项目有用的是这些**分布关系**，并非要求建立损伤物理模拟。

下一版旧化应由选定的实物/成熟艺术资源决定：底色、皮膜厚薄与透光感、卷折/接触区磨损、局部字迹变化共同协调。古旧不等于整圈烧边、全页黄褐或均匀破洞；中心书写区保持有尊严的正式文书观感。

## 二、已经找到的卷轴资产

| 候选 | 本轮核实到了什么 | 本项目用途与尚缺证据 |
|---|---|---|
| [NOQTA Antique Scroll Map](https://noqtame.com/p/antique-scroll-map.en) | 创作者页面显示一次性$10、Blender文件及收展动作；公开5.2秒演示视频实际加载播放。作者说明为骨骼/驱动器结构，进游戏引擎前烘焙动作 | 值得作为完整动作/卷芯结构候选；其双轴、清浅纸面与阿拉伯文字不能直接成为我们的外观。未购买、未取得源文件，网页导出及许可仍需实际核对。作者参数不是本项目已验证数据 |
| [Parchment Scroll Old Rigged Animated](https://www.cgtrader.com/3d-models/interior/office-interior/parchment-or-scroll-old-with-rig-and-animations) | 商品页显示$16、两种打开方式、贴图及多种交换格式 | 可比较无复杂附件的卷展本体；商品同时列动画源与glTF不意味着该glTF已含完整动画。未购入、未验证源文件；不按“photorealistic”文字评定艺术质量 |
| [Fab Single Roll / Dyem0H](https://www.fab.com/listings/afecc311-c83f-4146-b370-ee4410ed9edf) | 商品页声明绑定、PBR和PSD，列出FBX及转换格式 | 可编辑贴图对长期章节模板有价值。网页抓取能读说明，但实际浏览器商品页返回403；价格与最终所购许可未核实，不算已验证成品 |
| [Rolled Parchment / SM5 by Heledahn](https://sketchfab.com/3d-models/rolled-parchment-90df513fa91e42d8a2c56801ddac97fd) | Sketchfab公开API确认CC BY、可下载标记、约5104面、平台动画数0 | 免费外观/道具候选，不是已具备收展动画的模板；未取得源包，不冒称可即用 |
| [Scroll (game ready asset) / Aparicio Silva 3D](https://sketchfab.com/3d-models/scroll-game-ready-asset-c1503d2292c74faebf83a5937646c1c7) | API确认CC BY、约7444面、平台动画数0 | 只能先列静态资产候选。需看实际纸面、轴、UV与闭合态，不拿“game ready”代替适配检查 |
| [Blender Burning Parchment / pizzabrian](https://sketchfab.com/3d-models/blender-burning-parchment-and-procedural-flame-3b931cc669964e49a246ac958e49c23b) | 页面标CC BY并描述Blender动画；API中的平台动画数0 | 不能把Blender程序材质/动画宣传等同于可直接在Three.js播放。火焰不是当前需求，不优先 |

没有找到已经核实可取得、同时满足“古朴正式外观＋合适收束＋可信解绳＋闭合至展开全过程＋可替换文字”的免费完整资产。它是当前检索结论，不是宣称市场上不存在。尤其**绑绳的已完成解绳动画仍是资源缺口**，不再假装一条程序带已经解决。

付费资产可以作为一次购买、多个章节共用的制作基础；不能据此自动购买。需区分项目嵌入与原始资产再分发：[Fab许可摘要](https://www.fab.com/eula)、[CGTrader条款](https://www.cgtrader.com/pages/terms-and-conditions)。公开仓库不能简单成为付费模型下载镜像；“No AI”也不应望文生义，须核对实际条款与拟用方式。

## 三、收展与变形：可复用的工程作品

### 完整离线动作交给网页播放，优先研究

[Paper Crumple / item-develop](https://github.com/item-develop/paper-crumple-demo)提供MIT源码以及实际FBX、EXR变形资源。本轮从固定提交`f84648b001dd13becda7a629ab5398cecfe3a252`取得约3.1MB必要文件，**原样在本地HTTP服务中运行**，402×874触摸模拟下加载画布与变形纸张，无脚本错误、无失败资源请求，没有安装Houdini。

它展示的是揉纸，不是我们的卷轴外观，也不是拿来直接替换卷轴的成品。价值是验证一个可用分工：作者在专门工具中做好形态与动作，网页复用动作数据和渲染代码，正文图层仍可替换。不是让Codex再次在网页中手写复杂变形。[作者技术说明](https://tympanus.net/codrops/2026/09/19/crumbled-paper-houdini-vat-threejs/)及仓库都开放了具体实现，源码调试参数也支持指定纸张帧查看。

实际选型先尝试现成卷轴资产的**烘焙骨骼/形态键＋glTF**；仅当所选资产确实需要更复杂的软体动作，才考虑已有VAT播放方案。不是为了采用某项技术反过来改变产品形态。

[Blender glTF说明](https://docs.blender.org/manual/en/5.1/addons/import_export/scene_gltf2.html)明确区分可导出的变换、骨骼与形态键动画。Blender中的任意修改器、驱动器、绳索物理不能自动跟随文件进入浏览器。采购/选用前最有价值的小试验是：导出一次，在网页里看闭合、中途、展开和反向，不先围绕未验证的导出搭完整产品。

### 其他展开路径

- [akella/UnrollingImages](https://github.com/akella/UnrollingImages)：实际有卷曲图像的shader实现，README许可允许项目整合，但不允许把资源原样再售/再分发。可学习/适配卷曲，不是古卷美术资产。固定提交`28000ef2de029c59d4fd863a02958b4a72607cd9`；本轮其旧线上演示返回403，未宣称在线效果已验收。
- 现用Paperlab仍可作为基础版的回退与对照。其已有卷径/长度关系有用，但不再把它作为排除外部完整卷轴绑定资产的理由。
- [GSAP](https://gsap.com/pricing/)可承担成熟时间线、反向与多段联动；官方目前说明免费。它能替代零散动作调度，不能替代美术资产和高质量动作本身。

## 四、雾效：从完整效果起步，不再先造云团

| 资源 | 本轮实际状态 | 判断 |
|---|---|---|
| [Three.quarks官方原生演示](https://demo.quarks.art/vanilla.html)及[源码](https://github.com/Alchemist0823/three.quarks) | 实际浏览器打开，WebGL画布正常，无脚本错误；所到默认示例为枪口火焰。运行库MIT；当前源码支持贴图序列、生命周期、批处理与JSON效果 | 优先找其中已有烟雾/soft-particle完整预设复现。不能因火焰演示运行就宣布适合本卷轴。代码包无需React；官方可视编辑器与开源运行库是不同产品 |
| [Quarks编辑器](https://quarks.art/) | 官方免费档可体验但不能导出所制JSON；Starter列$12/月 | 不因这个导出限制否决免费运行库，也不擅自订阅。先检查开源例子是否已有可用效果 |
| [hmans Soft Fog源码](https://github.com/hmans/composer-suite/blob/aa076d6330c654ecbbde9c88171a51e79a0001fe/apps/vfx-composer-examples/src/examples/FogExample.tsx) | 源码实际读取：雾粒子、慢速运动、深度软化；MIT。旧线上示例实际404，依赖基线较旧 | 对交界处软化有直接参考价值；若复现需保留完整软粒子渲染链，不能再抽一张烟贴图后随意拉伸。不是已验证的现代Three.js即插即用组件 |
| [The Sleepers成品](https://projects.thibautfoussard.com/the-sleepers/)与[作者拆解](https://tympanus.net/codrops/2026/07/10/the-sleepers-creating-an-atmospheric-webgl-experience-with-lightweight-techniques/) | 实际进入场景查看，作者明确其雾主要是材质着色技巧，并非真正体积雾 | 适合学习整体气氛与克制的层次；不直接当作器物外独立烟雾。网页可参观不意味着所有模型、音乐可复用，本轮没取用其素材 |
| [Pavel WebGL Fluid Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation) | MIT，实际打开并触发拖动，二维流动与涡旋正常 | 若目标是“动态雾染/墨染”，它比拉伸云团更接近一种可研究路径；默认彩色发光外观不合本项目。需要先用完整原作验证单色/透明合成，不能只因流动漂亮即选用 |
| [Cientos Smoke](https://cientos.tresjs.org/api/staging/smoke) | 阅读了实际Smoke.vue；旧仓库已迁入[TresJS单仓库](https://github.com/Tresjs/tres)，不是整个项目停更 | 仍主要是烟纹理透明平面抽象，不因换成Vue就获得更好的美术。当前不为它迁移PWA框架 |
| [Babylon Node Particle Editor](https://doc.babylonjs.com/features/featuresDeepDive/particles/) | 官方有完整可视化编辑与可加载结果；维护者论坛说明该编辑器节点目前生成CPU粒子逻辑，与引擎另有的GPU粒子不同 | 成熟替代工具链候选，不应把“有节点编辑器”误称为自带免费高质量烟雾资产，或为了一个粒子层更换整个PWA引擎 |

选型应先区分：柔和悬浮薄雾、具有涡旋的雾染、卷轴动作引起的短时烟尘。可用同一资产家族协调，但不必强行用一种云组件模拟全部。

## 五、纸面、字迹、灯光与其他前端工具也重新评估

| 部分/工具 | 可以拿来什么 | 本项目具体判断 |
|---|---|---|
| 现成卷轴资产的纸膜、UV、PBR及贴图源文件 | 配套皮膜颜色/厚薄/粗糙度/折痕关系，而不是一张底图包办一切 | 比先随意找一张黄色纸图更值得优先。需要看真正展开近景；贴图中的预写文字必须能独立替换 |
| [Getty开放藏品](https://www.getty.edu/about/whatwedo/opencontent.html)及[手稿制作资料](https://www.getty.edu/news/making-a-medieval-manuscript-from-raw-materials-to-illuminated-masterpiece/) | 正式书写秩序、材料、初字/留白和实际保存状态 | 适合作风格锚点；单张文物图不自动成为PBR，纹理使用要对应具体图像权利，而非泛称“博物馆图片免费” |
| [Missaali](https://ctan.org/pkg/missaali)与已有Aboensis | 有实际历史字形依据的OFL字体 | 前者偏正式Textura，后者为中古草书。可比较标题与正文的正式感；Missaali并非通用现代字体，作者指出缺阿拉伯数字，不能无检查替换全页。暂不改变已认可字迹 |
| [Three.js LightKit](https://threejs-lightkit.com/) | 在可视环境中试HDR、曝光和色调并保存预设，免于盲写几盏灯 | 可研究的灯光导演工具；未购买、未集成、完整授权/价格未核实。重点是以实物/成熟作品的光感为参照，不为器物加无关眩光 |
| [PixiJS过滤器与混合](https://pixijs.com/8.x/guides/components/filters) | 正视2D/2.5D层的成熟合成、遮罩、位移与纹理 | 若优质资源以分层贴图/烘焙帧交付，可用。不能再用简单裁切假装纸真的卷起，也不能让不同状态突然切换到另一个器物 |
| [Rive网页运行时](https://rive.app/docs/runtimes/web/web-js) | 成熟状态机、可替换文本、透明画布、自托管运行文件 | 候选设计/动画工具，尚未找到并验证符合要求的现成古卷Rive作品；不将工具能力当成已有美术。需要设计源和可导出成品才有意义 |
| [Spline导出](https://docs.spline.design/exporting-your-scene/web/exporting-as-code)与[独立托管](https://docs.spline.design/exporting-your-scene/web/exporting-as-self-hosted-project) | 现成社区场景与可视化编辑 | 官方文档明确：不同导出方式保留事件/动画的能力不同，完整自包含的self-hosted ZIP列Enterprise。不能直接推荐为无持续依赖的免费替代 |
| [Spine](https://esotericsoftware.com/spine-runtimes-license) | 成熟二维网格变形与动画制作 | 工具本身适合分层美术，但有专门编辑器/运行时授权。未找到已验收卷轴资产，不为研究先买软件 |

检索也接触到Perfect Parchment艺术背景包及Adobe社区羊皮纸材料。但前者当前原始商店取得/许可未核实，后者检索能找到不等于已核对具体材料下载及授权，本轮都没有列为可直接使用的高质量皮膜来源。

## 六、建议的制作组织

建议先用一件成熟资产做**一套可复用器物模板**，每章只替换真实英文与认证数据；原生代码主要负责装配、状态、交互与项目风格衔接。

1. 先挑完整卷轴的原作外观与动作；优先验证已带动画的本体，其次才是静态道具。木轴、闭合体和展开面要属于同一件物体。
2. 先原样运行/播放，确认原作确实好。不要一拿到资源就同时改材质、动作、渲染，丢失成功基线。
3. 以明确的中古文书/艺术资源为美术参考，形成皮膜、字迹、闭合态和展开态的同一设计；没有合适收束资源时明确保留这个缺口，继续找或制作有参考的离线动作，不用临时带状几何顶替成品。
4. 先用作者提供动作的网页导出结果验证连续性，再嵌入独立样品。能用骨骼/形态键就先用，不为形式先进强推VAT或实时物理。
5. 保留同一UV上的可替换真实文字；字体/材质与正文独立。后续章节复用母版，不逐章重做一套动画。
6. 雾效先独立复现一个已经好看的成熟效果，再定制色调、密度、位置及动作关联；不能把一张新烟图塞回失败的旧雾布局就叫升级。
7. 在iPhone目标视口看美术与动作之后，再决定透明合成、细节层和性能取舍。固定正面、无火漆、可独立保留器物、完整英文及原PWA视觉兼容继续成立。

这是一条研究后的建议，尚未选定购买对象或完成新样品。现有结果足以支持“改为成熟作品/资产优先的组装路线”，还不足以宣布某个商品已经解决全部美术与运行问题。

## 七、证据、成本与下一步

源仓库核对pin：

- Three.quarks `de7c207f791c8b2260c43334a282976221688b1b`；运行包peer声明Three.js >=0.182.0，项目目前0.186.1。声明相容不等于整套效果已实测。
- hmans/composer-suite `aa076d6330c654ecbbde9c88171a51e79a0001fe`。
- Pavel WebGL Fluid `a2d292931f19d9b3b9f564e23e6c32729d2121c3`。
- Cientos旧仓库 `836292475789f5d42f933a02ed90ad944514e02a`；README明确迁至TresJS单仓库。
- Paper Crumple `f84648b001dd13becda7a629ab5398cecfe3a252`。

公开API返回、原作浏览器结果与截图、下载核对文件均在D盘`.cache/scroll-reuse-research/`。只研究现有源；没有上传别人的未授权素材，没有导入新的应用依赖，没有修改或部署卷轴样品，没有对外发信。源码pin与实际可用性分别记录，不以搜索摘要代替取得文件。

本轮费用0，新增持续成本0；两款明确标价的完整动作资产分别是$10/$16的一次购买候选，不是已获选、已购买或已证明能在我们的PWA直接运行。下一步最有价值的工作是原样复现候选完整卷轴动作及一款成熟烟雾效果，先展示成功基线，再做有限定制。
