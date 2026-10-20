# 皮革与铜件：多道做旧、手工制作痕迹及中世纪风味

2026-10-20。基线`750696c`，开始前干净，沿用分支`codex/medieval-scroll-lab-2026-10-16`。用户指出v18做旧不足、与羊皮纸复杂处理不相称且缺少中世纪风味。本轮独立样品`/labs/chapter-scroll-v19/`，仍未颁发。

## 复盘

v18在通用扫描材质上增加局部色差和粗糙度，宏观老化仍偏弱；制造痕迹与使用后的损伤也未共同呈现。单纯加大随机污斑只会得到迷彩斑驳，不能解决这个问题。

本轮实际重读第一章v6的显示保真/做旧取舍、第五章v14的图稿和处理脚本、v18层代码。第一章的经验包括：宽尺度磨耗需要在真实着色中保留；高光会洗掉做旧；边损不能均匀铺满，古旧不包括霉变。羊皮纸也并非靠程序数量取胜，而是原始材料稿、轮廓、痕迹分布、微表面、变形和显示共同成立。

找到并检查了项目已经保存的v14独立老化皮革/古铜材质原稿。它们包含比通用扫描更好的艺术老化方向，本轮复用这些原稿及既有CC0微表面，再在Blender中进行结构相关的多道处理。没有重新生图，也没有用整件旧扣具照片代替机构。

## 调研与设计取舍

| 来源 | 已核对内容与本轮使用 |
| --- | --- |
| [British Museum，1855,0804.77](https://www.britishmuseum.org/collection/object/H_1855-0804-77) | 十五世纪皮革鞋的刻带与细切纹说明。借用手工刻划的工艺语汇，没有称该鞋就是皮带结构的直接证据。该站直接读取返回403，使用官方搜索返回的对象描述。 |
| [CBA研究报告80，中世纪村落发掘](https://archaeologydataservice.ac.uk/catalogue/adsdata/arch-281-1/dissemination/pdf/cba_rr_080.pdf) | 扣板上的边线、波线冲点、成排冲纹等。作为简单刻线/压纹的依据，不把复杂纹章、宗教图案或宝石附加到项目上。使用官方检索返回的相关原文段落；PDF全文抓取因体积被web工具拒绝，没有声称通读全报告。 |
| [London Museum，89.65](https://www.londonmuseum.org.uk/collections/v/object-31229/belt/) | 十五世纪初皮带含铜合金构件、局部刻饰与圆顶铆件，且该件丝织覆盖被馆方标为特殊情况。没有把所有装饰当成中世纪日用物的通用要求。 |
| [CCI皮革资料](https://www.canada.ca/en/conservation-institute/services/preventive-conservation/guidelines-collections/caring-leather-skin-fur.html)、[金属资料](https://www.canada.ca/en/conservation-institute/services/preventive-conservation/guidelines-collections/metal-objects.html) | 材料/加工、物理磨损、油污、稳定包浆及活跃劣化分别理解。本样品选择陈旧而仍可使用的藏卷配件，不增加霉变或大范围粉化腐蚀。 |
| [Blender材质与贴图工作流](https://docs.blender.org/manual/en/latest/render/shader_nodes/index.html)、[Poly Haven技术标准](https://docs.polyhaven.com/en/technical-standards/textures) | 颜色、法线和粗糙度各承担不同信息；原生节点分层后烘焙，网页不叠加越来越重的实时噪声计算。 |

本轮中世纪气质来自简单刻划、旧铜加工、手工皮革和整体色泽的协调。已有扣具工作结构保持；不是一个单一时代/地域的考古复制品。

## 可编辑工艺流程

`scripts/bake-keeper-v19-materials.py`创建具名节点框，原生工程保存到D盘`.cache/keeper-v19-native/keeper-finishing-workshop.blend`。各阶段可单独检查和调整，输出颜色/ORM/法线，不是只记录一串程序名称。

### 皮革

1. **皮料基础**：扫描微粒与v14旧皮稿叠合，保留旧裂网、较宽压褶和皮色的不均匀。
2. **长期手持/穿带**：按实际折返、扣框轨迹和带尾位置布置压磨与暗润区，改变反射粗糙度。
3. **粒面磨穿**：不连续的长边、带尾区域露出较浅的暖褐纤维，损伤量不均匀。
4. **反复屈折**：局部细裂和断续的横向压褶，主要集中于折返/扣框区域；避免整条布满同强度鳄鱼纹。
5. **手工刻划**：两道细窄刻带与带尾小菱形压纹，刻深和色泽随磨耗变浅；不加入新身份图标或现代装饰字。
6. **微表面整合**：压痕、细裂、粒面和打磨分别影响高度/法线与粗糙度。皮料切面、孔内壁和正面粒面使用不同取样；切面不印上外表压纹。

### 铜件

1. **旧铜基底**：复用保存的古铜原稿和扫描细坑，保持细密真实感。
2. **加工痕迹**：浅压平痕、局部修锉、细坑影响实际光照下的法线。
3. **简单刻饰**：扣框成对细刻槽，随曲面环绕；未改变工作截面与扣针搭框位置。
4. **氧化与接触**：棕色暗层及隐蔽处少量灰绿，受已有接触遮罩控制；不涂到皮革上。
5. **后续磨亮**：凸部局部露出温暖铜色，反射、金属度和粗糙度与暗层有所区别。

所有高度都是显示微表面，不移动原模型顶点，不声称对该古旧材质做了物理扫描反演。

## 实际迭代

- 最初只用通用扫描和程序层，材质仍过于现代、皮面偏均匀，铜件形成大块金黑迷彩；未采用该轮外观。
- 实际查看v14已保存原稿后，将其纳入原生分层管线，降低人为大斑块，恢复细密旧皮/旧铜纹理。旧作原件可复用，但不把旧扣具的孔洞或机构错误复制回来。
- 原始切面UV造成长条纹，最后按材料法线区分粒面与切面，孔壁也单独处理。保留原轮廓、倒角和工作比例。
- 全尺寸无损PNG母版保留于D盘缓存；最终WebP逐像素核对误差为0。第一次用Image.save复制时实际仍写出PNG，已通过RIFF/WEBP头检查发现并纠正，最终使用Raw视图的save_render与100质量无损编码，没有将改扩展名冒充压缩。

## 恢复、资源与身份

```powershell
& 'D:/CodexStorage/tools/blender-5.1.2-windows-x64/blender.exe' --background --python scripts/bake-keeper-v19-materials.py
& 'D:/CodexStorage/tools/blender-5.1.2-windows-x64/blender.exe' --background --python scripts/pack-keeper-v19-materials.py
& 'C:/Users/huawei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' scripts/build-scroll-v19.mjs
& 'C:/Users/huawei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' scripts/inspect-scroll-v19-aging.mjs
$env:SCROLL_SAMPLE_VERSION='19'
$env:SCROLL_EVIDENCE_DIR='research/scroll-aging-v19-2026-10-20'
& 'C:/Users/huawei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' scripts/verify-scroll-v17.mjs
```

- 母版皮革4096×512；铜件2048×2048；PNG和实际WebP的字节摘要、编码尺寸、像素误差见`material-manifest.json`。
- 新增六张WebP合计约12.75MiB，原GLB直接复用，不复制16MB模型。UV按真实材料长度/宽度重新映射，模型和曲线变形仍为v17。
- GLB摘要仍为`a6084299daf55d9ead8e7905ab973fe6be9ec88a6a7f26914230c1f04e959668`；原生输入Blend仍为`ba95bb3ebc448759b3984a6bd23b97bcd73040d92348dc89085c9f6ffc6d4831`。
- 纸膜、正文和第五章艺术身份未重写，原文书摘要仍为`a2a75215f25dc0fc40f047fd6f6648a4625ae13be7b3fa2ffca5fe72e37f43a0`。该摘要是文书身份；新皮扣的实际素材另由本轮manifest标识，不宣称整件所有字节都没变。
- 旧材质原件及原始提示词在`research/scroll-lab-v14/`，CC0源扫描在`.cache/keeper-physical/`及原GLB；新网页资源已存仓库。没有新增生图、模型推理、Kaggle提交、订阅或付费素材。

## 验证与验收

`inspection.json`和同角度v18/v19实际渲染对照用于材质检视；没有改变网格/运动，不重复原66姿态接触检查。首次动作/预热、反向、雾染、恢复、减少动态与无学习写请求沿用实际检查脚本。结果记入`verification.json`，线上结果另记。

当前仍是艺术候选，原件解析度、节点层数、PBR通道和功能检查不能代替用户对古旧感、风味和协调性的判断。本机iPhone尺寸Chromium不能冒称真实iPhone Safari验收。

本地功能检查首次准备3.87秒，开合帧间隔中位16.7ms、p95 33.5ms；随后切面微表面又做了一次着色调整，由最终局部渲染与发布后的全流程检查覆盖。相同GLB实际摘要核验通过。

末尾已执行余额/容量查询，因现有`SECOND_LANGUAGE_PUBLISH_TOKEN`或忽略的部署凭据文件缺失而未完成，旧记录保留；永久归档已排队，不声称本地原生工程已永久入库。Wrangler静态预览授权可用。
