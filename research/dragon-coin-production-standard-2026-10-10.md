# 仇视之龙：高标准数字纪念币制作研究

2026-10-10。研究前工作区 `codex/monthly-gallery-2026-10-10`，HEAD `e0a6d020c41cb8cd210eb4786df785b23930c895`，工作树干净。正式制作标准是 `../protocol/COIN_CRAFT.md`。新数据、浏览器profile、参考截图和反馈原件实际存D。

## 1. 研究结论与范围

需要采用整枚定制雕塑的制作流程：整体构图/主形 → 次形与受力 → 细雕 → 运行拓扑/烘焙 → 金属打样 → 局部效果 → 原页把玩。此结论有专业来源支持；当前没有新样币，不代表已验证Agent能达到目标质量。

VERIFIED：私有实验反馈 `2285949d-f294-4101-a8ad-e354e428b47c`，2026-10-10 08:50北京时间。全景/氛围/声音/操作4，币2、演化3、流畅度5。用户取消场景和图书馆日历，要求集中制作完整纪念币，之后指定仇视之龙；明确此前全部样品都不是高标准。

代码证据：月厅复用扫描回廊成四翼、中心程序贴图平面；币是圆盘/环加Fern/Whale/Gothic Statue的实例和深度压缩。它验证加载/缓存/引擎/反馈，没有负责整体雕塑。失败根因是造型方法与艺术判断，不应要求用户降低标准，也不能用更大纹理、更复杂照明补救。

## 2. 已实际读取的直接来源

| 来源 | 直接支持的认识 | 如何用于本项目 |
|---|---|---|
| [U.S. Mint雕塑流程](https://www.usmint.gov/content/usmint/us/en/learn/production-process/sculpting.html) | 图稿转实体/数字雕塑、修正、试制核验 | 采用由构图到体积与试样的顺序；数字幻想币不强制受压铸限制 |
| [Perth Mint龙与虎高浮雕古银币](https://www.perthmint.com/shop/collector-coins/coins/dragon-and-tiger-2022-2-kilo-silver-antiqued-high-relief-coin/) | 官方设计强调眼、颌、高浮雕和古银处理，设计者Neil Hollis | 提炼眼颌焦点、金属亮暗工艺。其尺寸不是样币标准；本轮浏览器产品图未完整加载，不称逐角度目视验证 |
| [CIT Thunder Dragon](https://www.cit.li/coin/31101/thunder-dragon/) | 官方说明凹面与超高浮雕形成冲出币的视觉；已目视官网正面展示 | 币载体参与形体，不复制武士/龙构图、不增加其他人物叙事 |
| [CIT Great Gilded Dragon](https://www.cit.li/coin/30335/great-gilded-dragon/) | 官方形态/表面资料，已实际查看官网正面 | 整体轮廓与刻纹统一；亲和龙姿态不适合仇视，只研究整体资产设计，不照搬 |
| [Maxon Narnia制作团队访谈](https://www.maxon.net/en/article/the-chronicles-of-narnia) | 龙形经历比例修正、拓扑和材质设计；鳞片方向根据体表规划 | 支持主形先行、细节沿结构；完整角色的制作步骤按刚性币需求裁剪 |
| [Maxon Character Creation](https://www.maxon.net/en/solutions/character-creation) | 主形关注轮廓/比例，生产分阶段 | 设灰模检查，避免用细节掩盖失败；不把购买专业工具等同质量 |
| [Maxon Sculpting](https://help.maxon.net/zbr/en-us/Content/html/features/main-features/sculpting/sculpting.html) | 分层雕塑和可形成倒扣的三维工具 | 区分高度纹理与真实嘴/爪/背面几何，工具能力不冒充Agent成果 |
| [Gnomon Fantasy Sculpting](https://www.thegnomonworkshop.com/workshops/fantasy-sculpting) | 公开课程介绍讨论龙与主体的构图、姿态和空间关系 | 支持共同构图；只读取公开简介，未观看付费课程、不声称掌握完整教学 |
| [Matt Bonaccorsi纪念币概念](https://www.artstation.com/artwork/6a0xJx) | 作者介绍线稿用于后续低浮雕雕塑 | 概念与模型分阶段；不复制作者图稿 |
| [Khronos glTF PBR](https://www.khronos.org/gltf/pbr) | 金属/粗糙度/法线等机制，法线不能改变几何外形 | 解释分区材质与几何烘焙取舍；不据PBR字样宣布写实 |
| [Blender Multires文档](https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/multiresolution.html)、[5.0发布说明](https://www.blender.org/download/releases/5-0/) | 官方检索与发布资料支持多分辨率雕塑和烘焙 | 免费候选主工具。手册直接访问失败，仅依据官方检索和可读发布内容；制作阶段固定实际版本验证，不能假称逐项跑通 |
| [Babylon透明渲染](https://doc.babylonjs.com/features/featuresDeepDive/materials/advanced/transparent_rendering/) | 透明排序、混合、深度的行为与局限 | 烟雾/角膜/粒子合成需实测，后处理不默认保留正确背景alpha |
| [W3C Pointer Events](https://www.w3.org/TR/pointerevents3/#the-touch-action-css-property)、[WebKit iOS tapping](https://webkit.org/blog/5610/more-responsive-tapping-on-ios/) | 手势预声明、捕获/取消与浏览器默认行为 | 不全页拦截再合成点击；局部输入区在Safari另验 |

各条只保留可读材料直接支持的概述。本项目比例、预算、验收门槛及对仇视之龙的细化是独立判断，不冒称行业统一标准。两份CIT官网参考截图已目视；它们为研究资料，保留在忽略的D目录 `.cache/dragon-standard-references`，不混入项目可分发美术资产。

## 3. 为什么这些捷径不成立

- 圆盘贴独立雕塑已失败，无法负责连续侧背、表情及抓握。
- 精美图转高度图可辅助局部浮雕，不能表达倒扣、真实口腔、抓到背面的爪和独立断片。
- 文生3D本轮没有本机实测的精确造型/编辑源保证，不能直接发布；未来最多草模辅助，仍经过完整灰模验收。
- 管/球/角和重复鳞片脚本可做阻塞验证，但不是精雕；继续叠烟光会固化坏主形。
- 百万面/8K/Bloom不是品质证据，会引入包体、透明与功耗问题。
- 先做收藏界面而不做币会再次把精力移到已经可运行的外围。

“手搓”解释为实际逐处负责定制造型、修正和审阅，允许工具/程序辅助；不能借这个词谎称已进行手工雕刻。整枚可编辑艺术源比单个不可修改渲染图更重要。一枚成功也不能证明每日同质量批量生产可行。

## 4. 仇视之龙的艺术核心

转头与近眼瞪视负责敌意；两组斜向夹持负责压迫；左上断裂及侧背指爪负责动作真实性；暗红与黑雾强化这一动作。必须从币被抓碎的关系整体设计，不能给通用龙头加红眼就交付。

眼神由眼眶、眉、眼睑、颧与瞳孔共同产生；单纯放大圆眼会变成卡通。头颈体块必须在中性灰模成立；角、牙、鳞片只能支持既有结构。指爪的掌部、关节弯折、指腹压力、背面钩和币的形变共同表达抓握。

背面可设计为包绕指爪/压痕主导，低浮雕龙印辅助；也可以延续头颈/脊线。本轮采用前者作初案，避免额外整条龙挤压正面焦点，按实际作品可修正。不复制实体法币面值或肖像要求。

最重要的内部对照是无纹理/无发光的正侧背灰模。默认手机尺寸就要有眼神与夹持主次，放大才出现鳞脊/刻纹/断面细节。全表面同强度纹理会产生廉价噪声；烟光完全关闭时仍须是完整雕塑。

## 5. 原页把玩的可行性边界

透明显示一般可实现，但页面看得见不等于能操作。月厅的整canvas相机输入不能直接去背景塞正文。候选是透明非命中canvas、实体投影局部输入区和本体轨迹球四元数旋转，捕获只延续币开始的手势。

越界爪、细孔、破口与第二指从币外加入的归属尚未Safari实测。大矩形或球形输入区会吞正文，不能代替用户要求。不会承诺像素级穿透已经实现；协议将此设为单独放行关口。主页面布局/原有手势不为币全面改造。

## 6. 能力、成本及下一步

本轮C约0.60GiB、D约32.4GiB；新增目录/profile实际在D。未在PATH检出Blender，不能宣称拥有已可运行雕刻/烘焙环境；制作前还要核查可用安装，以D路径和缓存配置为准。未安装新工具或大模型，无收费模型调用、新订阅或新增持续成本。

协议的12–25万三角、2K/4K、10–25MiB和60fps是工程探索起点，均非实测或通用质量标准；性能预算可改，不能砍眼爪剪影换取纸面指标。运行GLB之外的shader/粒子/音频也必须入永久资产清单。

下一步制作一枚可绕看的结构灰模，内部失败先修改，不给用户发不合格占位品。雕塑采用前不建新展柜、不接正式认证。最终以实体iPhone17视觉、输入、透明和持续运行验收；桌面测试只证明其覆盖范围。数百枚同水平制作的工时、成本和稳定性仍未知。
