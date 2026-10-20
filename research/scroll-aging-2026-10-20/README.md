# 第五章皮扣做旧工艺研究与实践

2026-10-20。起点：`15e3c5f`，开始前工作区干净。独立样品`/labs/chapter-scroll-v18/`，与v17比较；没有接入正式颁发。所有新增文件、原生工程与浏览器临时数据在D盘。

## 资料与判断

本轮先读保护机构资料和成熟材质制作流程，再在既有扫描材质上叠层，没有新做整件AI图或重新构造皮扣。

| 依据 | 对样品的实际影响 |
| --- | --- |
| [加拿大文物保护研究所：皮革、皮肤和毛皮](https://www.canada.ca/en/conservation-institute/services/preventive-conservation/guidelines-collections/caring-leather-skin-fur.html) | 粒面、受力磨耗、手部油污和生物损坏不是同一现象。选择仍可使用的旧物状态，排除霉变与严重失效。 |
| [CCI：金属物件](https://www.canada.ca/en/conservation-institute/services/preventive-conservation/guidelines-collections/metal-objects.html) | 稳定铜合金包浆可以是棕色；不为表现年代感强加粉状绿色腐蚀。样品用棕色暗层与接触处的暖色金属反射区分。 |
| [Adobe：Edge Damages](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/mesh-based-generators/mask-generators/edge-damages) | 参考曲率/遮蔽遮罩驱动磨耗的成熟方法；不是把统一污渍乘到所有表面，也未声称调用了Substance软件。 |
| [Blender Geometry/Pointiness](https://docs.blender.org/manual/en/latest/render/shader_nodes/input/geometry.html) | 实际使用本机Cycles烘焙物件相关遮罩，再供Three.js静态材质使用。 |
| [英国国家档案馆：羊皮纸文书](https://live-www.nationalarchives.gov.uk/about/visit-us/researching-here/handling-documents/handling-parchment-documents/) | 羊皮纸不是焦纸。保留已有纸膜和文书层，本轮不以额外烧边、霉点或全局降清晰度统一风格。 |

保护资料说明真实现象；磨耗范围、颜色权重和保存状态是本次艺术选择，不能反过来称为历史事实或年代测定。

## 实践：物件坐标中的分层材料

`web/labs/chapter-scroll-v18/aging.js`是本轮材质权威。扫描资源、CC0来源与原件SHA见`.cache/keeper-physical/material-sources.json`及v17 CREDITS。

### 皮革

1. 继承Poly Haven粒面扫描，不把年代感画成与动作脱离的屏幕滤镜。
2. 沿实际250.0688mm材料长度和18mm带宽取样；折返、实际已选孔及带尾位置由v17路径元数据读取。
3. 压实/油脂形成的暗润层与磨穿后较浅的纤维分开。长边、带尾、孔缘磨耗不等强、不连续铺满。
4. 穿孔/扣框附近与固定折返部位有少量不均匀细折痕，未画一道均匀黑线。
5. 原始平展UV没有为2.5mm切面提供足够厚度取样。切面和孔内壁改用材料长度×厚度坐标取样，并抑制退化切线产生的长条法线伪影。**不移动任何顶点**。

### 铜合金

1. 从原生场景的同一金属UV图集烘焙R=3.2mm邻域可见度、G=Pointiness、B=前后朝向外露程度；32采样、1024平方，烘焙脚本见下。
2. 暗层优先落在接触与隐蔽部位；凸起且常被触碰的冠部有不完整的暖色磨亮。
3. 保留cgbookcase扫描中的细坑与法线；粗糙度随包浆/磨光变化，反射仍随真实灯光与形体变化。
4. 遮蔽烘焙描述闭扣时容易长期接触的区域，只影响包浆权重；实时光照和阴影继续动态计算。

雾染完全继承v17已修复的坐标/流体路径，不用雾遮掩材质。正文、字体、章节艺术图、羊皮纸基色/法线/粗糙度、卷展几何和印记均保持原件。

## 实际迭代和限制

- 第一轮金属粗糙度过高，铜件看起来接近皮革；已恢复更明确的金属高光，并保留局部暗包浆。
- 切边最初仍有拉长条纹，已单独处理切面采样与法线权重。原网格的切面分段和轮廓不在本轮改造，放大时仍可见部分原生多边形痕迹。
- 没有新增结构缺损、凹坑雕刻或破边几何；这些会涉及当前已认可的机构形体。现在的老化主要由扫描、区域遮罩与PBR通道体现。
- 实际iPhone17 Safari、用户的色彩/古旧感验收仍未知；本机Chrome检查不能代替。

## 不变量及恢复

认可的v17 GLB继续直接复用，SHA256：`a6084299daf55d9ead8e7905ab973fe6be9ec88a6a7f26914230c1f04e959668`。无新GLB复制，无单轴缩放，无新骨架，无修改解扣路径。

本机原生输入：`.cache/keeper-v17-native/keeper-physical.blend`，SHA256 `ba95bb3ebc448759b3984a6bd23b97bcd73040d92348dc89085c9f6ffc6d4831`。`scripts/bake-keeper-age-masks.py`检查该摘要，输出独立`.cache/keeper-v18-native/keeper-material-study.blend`；不会覆盖输入。该原生文件保存的是遮罩烘焙场景，不冒称网页最终分层材质也已完整搬进Blender。

```powershell
& 'D:/CodexStorage/tools/blender-5.1.2-windows-x64/blender.exe' --background --python scripts/bake-keeper-age-masks.py
& 'C:/Users/huawei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' scripts/build-scroll-v18.mjs
& 'C:/Users/huawei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' scripts/inspect-scroll-aging.mjs
$env:SCROLL_SAMPLE_VERSION='18'
$env:SCROLL_EVIDENCE_DIR='research/scroll-aging-2026-10-20'
& 'C:/Users/huawei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' scripts/verify-scroll-v17.mjs
```

v17两个资源URL改为明确的同级目录，供v18打包复用，避免`import.meta.url`落在新bundle目录而请求不存在的GLB或噪声源码。v17既有bundle与原页不重建；不是一次新的动作实现。验证脚本增加可选版本/证据目录，默认仍验证v17。

## 验证与交付

`inspection.json`及`v17/v18-keeper.png`为实际同角度对照；另有v18脱针、退带、闭卷和展开截图。模型、路径与比例未变，不为材质重复运行原66姿态接触检查。

首次开合/预热、反向、中途反向、真实上下文恢复、减少动态、雾染有限输入与局部交互、内容摘要及无写请求，以`verification.json`和发布后的`live-verification.json`为准。正式文书摘要仍为`a2a75215f25dc0fc40f047fd6f6648a4625ae13be7b3fa2ffca5fe72e37f43a0`。

没有新订阅、付费生成、云GPU或收费素材。页面播放只有静态资产与本机着色器；新增一张约0.81MiB遮罩，无持续云推理费用。

本地首次准备4.32秒；开合唯一帧间隔中位16.7ms、p95 33.4ms，仅为本机Chromium。全部既有交互检查通过，没有新着色器在首次动作中编译。

任务末尾已实际尝试余额与容量更新，现有发布凭据缺失：`SECOND_LANGUAGE_PUBLISH_TOKEN`或忽略的`.cache/deployment-secrets.json`。旧快照保留；归档已排队，不代表原生缓存已永久归档。此限制不影响已有Wrangler授权的静态预览发布。
