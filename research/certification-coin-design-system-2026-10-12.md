# 第二语言认证币设计与生产系统综合研究报告
## ——统一币背、正面币章语言、材质/漫反射、碎裂、二维—三维协同进化与人类审美闭环

**日期：2026-10-12**  
**性质：独立综合研究报告 / research synthesis**  
**适用对象：The Second Language 认证币体系、仇视之龙样币、后续所有章节认证币与可能的实体纪念币翻译版本**  
**仓库快照：本报告整理时项目主分支 HEAD 为 cf48bf0e21643f169dc2768e16d81755e7688c04。**  
**注意：本报告汇总并系统化 2026-10-12 连续多轮研究及审阅结论，用作后续协议设计、样币制作和工具链重构的研究依据；它不自动替换现有 protocol/COIN_CRAFT.md，未获项目确认的数值均应视为研究建议或试样包络，而非行业强制标准。**

---

## 0. 执行摘要

本轮连续研究最终形成的核心结论不是一套“怎样把 AI 图做成 3D”的技巧，而是一种更完整的认证币生产哲学：

> **认证币首先必须是一件成立的币章雕塑，之后才是数字媒介作品。AI 概念图与 3D 模型不是原稿与复制品，而是两个能力互补、彼此校正、共同逼近一个稳定 Design Kernel 的活跃表示。局部问题可以局部编辑，但候选必须始终是完整作品；客观问题由 Codex/工具链内部消化，真正难以程序化的高级审美分歧才交给用户做少量高质量偏好判断。**

整个体系由以下几条支柱构成：

1. **统一币背不是第二幅主题画，而是认证权威面。**  
   背面应建立第二语言长期稳定的系列身份：项目印玺、章节身份、微刻节律与安静的外围结构场。默认只依赖基材、镌刻、浮雕和表面处理，不施彩、不发光、不承担第二套叙事。

2. **正面采用“币章核心优先、数字能力逐级授权”的层级协议。**  
   设计、雕塑、材质、表面光学必须先成立；施彩、发光、雾、粒子属于权限越来越高的附加层，不能补救结构失败。

3. **对金属币而言，“漫反射质感”主要不是 diffuse，而是 rough specular。**  
   银币的柔和、雾面、霜面、缎面不应靠把 metallic 降低成灰塑料，而应保持真实金属属性，通过 roughness、micro-normal、finish mask、anisotropy 和中性 IBL 控制反射分布。

4. **碎裂不是“撒几块碎片”，而是结构损伤事件。**  
   对一般延性金属，应采用 deformation-first / fracture-second：受力、压陷、折曲、减薄、剪切、撕裂、撕裂唇、离体主碎片、次级碎片和微屑形成因果链。主碎片必须有来源、厚度、可回拼关系和旧表面/侧缘/新断面的区分。

5. **AI 设计稿与 3D 模型应协同进化，不强映射。**  
   AI 图负责构图、视觉故事、气势、造型语言和审美搜索；3D 负责空间一致性、隐藏面、真实厚度、接触、物理和可生产性。两者通过结构渲染包、增量设计 delta 和审阅反复互相纠错，而不是要求 Render(Model)=Concept。

6. **禁止“脱离母体的局部候选资产”。**  
   局部问题可以用 mask、sculpt、boolean、局部 remesh、inpaint 等方法编辑，但必须始终在当前完整原图/完整原模型上下文中操作。局部 crop 只是计算或审阅视图，不能晋升为新的设计母稿或独立局部模型。

7. **建立 Human Preference Gate。**  
   Codex 先内部生成、修改、比较、淘汰；只有当多个完整候选都已经客观成立、差异主要属于审美取舍时，才向用户展示 2–3 个统一视图下的完整成品候选。优先用成对比较 + “是否已可推进”的绝对锚点，而不是要求用户对大量粗糙中间稿做质检。

这套方法的目标，是从工程结构上阻止三类常见退化：

- “漂亮 AI 图贴在圆片上”的二维假币；
- “结构正确但缺乏设计”的程序化粗糙雕塑；
- “局部修得越来越多、整体却越来越失控”的长期漂移。

---

# 1. 项目现状与问题定义

当前第二语言项目已经有多轮认证币/纪念币研究积累：

- protocol/COIN_CRAFT.md 已明确完整币、正侧背连续、主形优先、灰模审查、破口厚度、跨币缘爪、材质与动效分层等基本原则；
- certification-v2 曾实现统一背面，但本质仍偏“项目名 + 罗马数字 + COLLECTION”的原型模板；
- 仇视之龙已形成 AI 概念、自动 3D 重建、网格修复、Blender 工作副本与多轮审阅资料；
- 用户已明确指出：源 AI 图本身存在设计问题，图到 3D 又会引入新的映射问题；模型必须允许用户参与审阅；
- 最新 AI 设计稿相较早期方案已经明显减弱“全图 AI 色泽感”，转向古银/深银统一基材、局部暗红眼口、左上破损和爪部黑雾，更接近纪念币；
- 现有白模与新 AI 稿暂未互通，因此两者不能做逐项误差证明，但可以用来分别观察“二维设计的表达能力”和“失去颜色/高光后真实几何留下什么”。

当前真正要解决的不是某一枚龙币，而是：

**如何建立一套可以长期覆盖数百枚认证币、同时允许高艺术上限、可控生产、可审阅返工、可兼容数字与实体版本的设计—建模—材质—特效—人机协作系统。**

---

# 2. 统一币背：从“模板背面”升级为认证权威面

## 2.1 基本定位

统一币背不应承担另一幅章节主题画，也不应只是廉价模板。

最合适的角色是：

> **Archive Seal / 认证印玺面 / Medallic Authority Face**

正面负责“这一章是什么作品”；背面负责“这件作品属于第二语言认证体系、它是谁、它在这个系列里的身份是什么”。

这个架构与成熟系列纪念币常见的“稳定共同面 + 可变主题面”逻辑一致，也能解决仇视之龙已经暴露的问题：如果背面再加入中央竖瞳、满铺鳞甲、第二条龙或强主题图案，会与正面争夺焦点；如果只放项目名与大罗马数字，又会显得像 UI 模板而非收藏币。

## 2.2 建议的统一几何协议

所有几何建议以币直径 D 归一化，避免未来尺寸变化导致整套协议重做。

### Z0：中央印玺

中央采用第二语言已有的“开卷书”图形，但不能直接把 PWA 蓝色图标贴上去。

应重新雕成真正的币章：

- 左右书页形成轻微起伏；
- 中央书脊为最低或内收结构；
- 页缘形成较高明暗边；
- 原图中的文字线改为浅阴刻；
- 不依赖蓝/白配色；
- 默认通过材质与光照读取“打开的书”。

建议宽度约 0.18D。

### Z1：四十微刻节律环

印玺外围可设置 40 个极浅微刻，推荐 10×4 分组。

其作用不是齿轮装饰，而是近看才能发现的“章节节律”，对应第二语言每章 40 个主词的结构。

要求：

- 远看不形成转速表/机械齿轮感；
- 近看有收藏细节；
- 不能与正文铭文争夺视觉；
- 可作为长期系列独有微特征。

### Z2：身份铭文保护区

约 r=0.19–0.28D 建立稳定铭文区。

建议：

上弧：THE SECOND LANGUAGE  
下弧：CHAPTER CERTIFICATION

章号使用固定宽度形式，例如 CH-0003，而非无限扩展的罗马数字。对数百枚甚至上千枚系列而言，CCCLXXV 一类编号视觉上无法长期稳定。

章节日期可作为更低层级微铭文，但不应与章号争抢。

### Z3：安静结构场

约 r=0.30–0.47D 默认保持大量负空间。

这是统一币背的关键：背面虽然统一，但不能把外圈完全锁死，因为仇视之龙一类作品需要爪、压痕、裂口、颈部等真实结构从正面经过币缘延续到背面。

因此：

- 普通币：Z3 基本安静；
- 包边/抓握作品：允许结构进入；
- 碎裂作品：允许真实断口跨越；
- 不能为了统一模板让正面结构在币缘突然消失。

### Z4：币缘

约 r=0.47–0.50D。

默认连续，可包含统一细密边刻/倒角；当作品真实发生抓碎、咬穿、爆破等结构事件时允许被打断。

## 2.3 结构模板分类

可以建立三类结构模板，但它们不是收藏等级：

- **S / Standard**：普通统一背面；
- **W / Wraparound**：正面主体真实跨越币缘进入背面；
- **F / Fractured**：边缘/币体出现结构性破裂或缺损。

仇视之龙应当成为 W/F 类压力样币。

## 2.4 背面材质原则

统一的是几何语言和身份，不是固定金色/银色。

- 银币：银；
- 铜币：铜；
- 金币：金；
- 木质纪念币：木；
- 数字版本：沿用正面真实基材。

背面默认：

- No Applied Chroma；
- 无 emissive；
- 无 bloom；
- 无独立烟雾；
- 无第二套粒子叙事。

只允许正面已经存在的真实结构/效果跨越币缘自然延续，并应在靠近中央印玺时衰减，保护系列身份。

## 2.5 不把数据库搬到币上

不建议把 certification UUID、hash、二维码、完整答卷信息等全部刻进币背。

认证数据库已经承担不可变记录与唯一认证关系；币是收藏器物，不是许可证标签。

币背只需保留人类可读身份：

- THE SECOND LANGUAGE；
- CHAPTER CERTIFICATION；
- CH-XXXX；
- 可选日期/版本微铭文。

真正的认证 ID、首次满分记录、资产版本、源资产散列、协议版本等继续由系统权威记录保存。

---

# 3. 正面统一规范：Medallic Core / Digital Aura

正面不能简单复制背面“绝对禁色”的规则，因为某些主题确实可能需要颜色或光学语义。

更稳妥的体系是：

> **正面首先必须作为币章独立成立，之后才逐级获得施彩、发光、雾和粒子的使用权。**

建议层级：

## G0 — Design Kernel

负责：

- 构图；
- 主体；
- 动作；
- 剪影；
- 主次关系；
- 视觉故事。

这是“雕什么”的层，而不是“怎样渲染”。

## G1 — Sculptural Core

负责：

- 真实浮雕；
- 完整三维结构；
- 倒扣；
- 币缘穿越关系；
- 爪/嘴/角/裂口；
- 重要鳞缘；
- 接触阴影所需真实体积。

改变剪影、厚度、接触与可绕看关系的东西必须是真几何。

## G2 — Medallic Material

负责基材：

- 银；
- 金；
- 铜；
- 木；
- 其他明确材料。

材料本身的颜色不是“施彩”。

因此协议应使用 **No Applied Chroma / 默认不施彩**，而不是笼统说“无色”。

## G3 — Surface Optics

这是以后认证币真正的高级区，应优先于彩绘。

包括：

- 磨砂；
- 镜面；
- Reverse Proof；
- Satin；
- Frosting；
- 氧化；
- 局部抛光；
- 拉丝；
- 微刻；
- 潜像式纹理；
- 局部粗糙度变化；
- 各向异性。

现实精品币大量依靠这些差异制造层次，而不是依赖颜料。

## G4 — Applied Chroma

油墨、彩印、珐琅、彩绘、覆层等颜色默认关闭。

只有当主题核心语义无法通过 G0–G3 忠实表达时才允许启用。

优先测试：

> 去掉这个颜色后，能否通过浮雕、纹理方向、磨砂、镜面、氧化或材质变化表达它真正承担的信息？

若可以，就不施彩。

“龙红一点更凶”“森林绿一点更像森林”“水蓝一点更像水”不应成为授权理由。

红罂粟、具有明确身份语义的发色、极光/彩虹等颜色本身就是现象、需要忠实保留原作色彩的艺术主题，才可能通过。

## G5 — Digital Aura

包括：

- emissive；
- bloom；
- 局部雾；
- 粒子；
- 魔法能量；
- 数字动态。

默认关闭。

它只能强化已经成立的作品，不能承担结构和辨识。

---

# 4. REST / AWAKENED：数字币与现实币的桥梁

建议每枚数字认证币都有两个明确状态。

## REST / 静息态

这是权威收藏状态。

默认：

- 无烟；
- 无粒子；
- 无自动动画；
- 无大面积 emissive；
- 无 bloom 依赖；
- 如果 G4 获批，施彩可保留，因为它等价于实体表面工艺。

REST 用于：

- 认证档案图；
- 缩略图；
- 设计验收；
- 材质对比；
- 资产长期保存；
- 实体版翻译基准。

## AWAKENED / 唤醒态

用户真正触摸、旋转或主动触发后，数字媒介独有能力才出现。

例如仇视之龙：

- 眼口暗红 emissive 缓慢出现；
- 爪边少量局部黑雾；
- 裂口偶尔落下微尘；
- 某些微刻在特定视角产生类似潜像/表面动画效果。

理想体验应是：

> 第一眼，它是一枚高级纪念币。  
> 拿起来以后，才发现它不可能只是一枚现实纪念币。

这比始终冒烟、始终红灯更高级，也更容易长期保持系列收藏品质。

---

# 5. 实体币与数字币：Design Kernel 统一，制造实现分叉

不建议要求所有数字币 STL 都能直接进入传统压铸。

现实高浮雕硬币会受到：

- 金属流动；
- 模具寿命；
- 压力；
- 坯体厚度；
- 脱模；
- 倒扣；
- 独立碎片；
- 强度

等限制。

因此应冻结的是 **Design Kernel**：

- 主体；
- 构图关系；
- 关键剪影；
- 主要浮雕层级；
- 重要跨缘事件；
- 主要材质意图。

然后允许两种实现：

### Digital Master

正式数字原件，可拥有：

- 倒扣；
- 包到背面的爪；
- 独立碎片；
- 更高浮雕；
- AWAKENED Aura。

### Physical Translation

实体铸造版可以因为制造约束：

- 减少倒扣；
- 压低浮雕；
- 把漂浮碎片改成 incuse/relief；
- 调整断口。

但不能擅自改变 Design Kernel。

实体币不是“缩水数字币”，而是**同一设计的实体铸造翻译版**。

---

# 6. 当前仇视之龙样币：为什么新 AI 稿方向更得体

最新 AI 设计稿相较早期方案的进步主要不是“龙更精细”，而是视觉信息开始服从币章：

- 古银/深银统一基材；
- 颜色压缩到眼与口的暗红局部；
- 黑雾集中在破损位置；
- 破口、爪、币缘、龙体仍然是主要造型信息；
- 即使想象关闭红光，仍大体像一件金属雕塑。

这说明“从 AI 稿阶段就限制彩色和特效依赖”的方向是有效的。

但仍有典型 AI 风风险：

- 左半部鳞片、脊刺、裂片、反光密度过高；
- 头顶/后脑堆叠大量相近尖刺；
- 几乎每条硬边都有漂亮高光；
- 全图信息频率偏高；
- 依赖 AO、戏剧化反射和局部高对比维持层级。

这类“每一处都精致、每一处都闪、几乎没有安静区”的状态，是常见 AI 美术感来源。

现有白模虽然与新 AI 稿尚未直接互通，但它提供了另一个重要观察：关掉色彩与漂亮渲染以后，真正留下的是大角、头颅、张嘴、颈部、两组爪、破口等几何事实；很多依靠纹理和明暗成立的细节会立刻弱化。

因此必须把“AI 漂亮成品图”从结构权威位置移走。

---

# 7. 从单一概念图升级为 M0–M3 双重权威体系

建议不再使用一个笼统的“正面设计稿”，而是把视觉设计与三维权威拆成至少四类产物。

## M0 — Medallic Design Master

最高设计权威。

负责：

- 主形；
- 剪影；
- 构图；
- 部件边界；
- 浮雕关系；
- 币缘穿越关系。

禁止：

- 靠颜色解释结构；
- 靠烟解释结构；
- 靠高光解释结构；
- 靠 bloom 解释结构。

M0 不是“漂亮渲染”，而是一份雕塑师和建模工程真正能读懂的设计。

## M1 — Sculptural Specification

三维几何权威。

负责：

- 正/45°/侧/背；
- 剖面关系；
- 浮雕级别；
- 接触关系；
- 破口；
- 重要部件编号；
- 隐藏面连续。

它不负责“漂亮”。

## M2 — Material / Finish Design

材质权威。

负责：

- 银/铜/金/木；
- 镜面；
- 磨砂；
- 氧化；
- 拉丝；
- 局部抛光；
- 粗糙度区域。

禁止把固定灯光、高光和阴影烘死在材料本身。

## M3 — Digital Aura Design

可选数字效果权威：

- emissive；
- bloom；
- 雾；
- 粒子；
- 魔法碎屑；
- 动态。

不能修补 M0/M1 的失败。

---

# 8. AI 稿阶段的“反 AI 风剥离测试”

以后每一枚币在 AI 概念阶段就应做四层剥离。

### Test 1：去色

移除 Applied Chroma。

如果作品立即失去主题和层级，说明设计过度依赖色彩。

### Test 2：去光效

关闭 emissive/bloom。

如果主体身份塌掉，说明作品靠“红灯”等视觉捷径。

### Test 3：去烟雾、粒子和微漂浮装饰

如果破坏、动作或威胁感消失，说明特效替代了结构。

### Test 4：换成统一灰泥柔光

去除漂亮金属反射与戏剧化 AO。

如果这时主形、动作、视觉中心和核心美感崩溃，说明问题不是材质，而是**根本没有完成雕塑设计**。

这条比“禁色”更重要。

一张图即使全银灰，也可能充满 AI 高光、AI 裂纹、AI 噪声和 AI 装饰；真正需要保护的是：

> **造型权威不能被渲染权威替代。**

---

# 9. 高光没有设计权威

概念图中的高光只能描述“表面大概想呈现什么感觉”，不能被当成可复制几何或贴图事实。

真实高光应由：

- 几何；
- PBR；
- 环境；
- 相机；
- 光照

重新计算。

这对阻止 AI 风尤其重要，因为图像模型极擅长制造“看起来像高级金属”的白边和亮斑，但它们不必对应真实曲率或正确微表面。

---

# 10. “漫反射质感”研究：必须先改正术语

数字建模里经常把不同现象都叫“漫反射”，至少应拆开四类：

| 常见称呼 | 实际意义 | 对认证币的重要性 |
|---|---|---|
| Diffuse BRDF | 非金属表面/体散射，如 Lambert、Oren–Nayar | 木、石、陶、灰模重要 |
| Rough Specular | 微表面粗糙造成镜面反射扩宽 | **金属币最重要** |
| Diffuse IBL / Irradiance | 环境低频照明 | 所有材质重要，但它是光 |
| Diffuse / Albedo Map | 传统工作流的非金属本征色贴图 | 金属不应把它当灰色着色层 |

对裸露金属：

- metallic 应基本保持 1；
- roughness 控制镜面微表面的扩散；
- base color 对金属主要参与反射颜色；
- 不应通过 metallic=0.3 + gray base color 模拟“磨砂银”。

否则得到的是灰塑料/灰泥，不是银。

---

# 11. 粗糙金属的物理核心：microfacet / GGX

现代实时 PBR 通常使用微表面统计模型。

glTF 参考 BRDF 使用 Trowbridge–Reitz / GGX 一类 microfacet 分布。

roughness 越大：

- 微表面法线分布越宽；
- 镜面反射向更多方向扩散；
- 环境图像逐渐失焦；
- 高光变宽变柔。

因此“高级漫反射金属”的本质通常是：

> **粗糙镜面反射，而不是把金属变成 diffuse。**

OpenPBR 进一步明确区分：

- base_diffuse_roughness；
- specular_roughness。

对金属认证币，后者才是核心。

---

# 12. 现实铸币 finish 可以直接翻译成数字材质语言

现实 Proof/Reverse Proof/Frost/Satin 等工艺为数字币提供了极好的设计范式。

| 现实工艺 | 数字对应 |
|---|---|
| 镜面抛光 | 低 roughness |
| Satin | 中等、均匀 roughness + 极弱微纹 |
| Frosting | 高 roughness + 高频各向同性 micro-normal |
| 局部抛光 | finish mask 下的低 roughness 区 |
| 拉丝 | roughness + anisotropy + 有方向 micro-normal |
| 激光微刻 | normal/height 或真实细微几何 |
| 氧化凹槽 | layer/material mask + roughness + 色调改变 |
| Proof/Reverse Proof | 同一金属基材上的 finish mask 反转 |

重点不是“给银币选一个灰色”，而是建立：

> **Surface Finish System / 表面工艺系统。**

---

# 13. 建议的五尺度材质实现

## 13.1 Macro Geometry

真实雕塑：

- 龙角；
- 嘴；
- 爪；
- 币缘；
- 铭文；
- 主要浮雕；
- 裂口；
- 明显沟槽。

必须是真几何。

Normal map 不能改变轮廓、厚度、接触阴影与绕看结构。

## 13.2 Meso Relief

中尺度镌刻：

- 浅刻线；
- 鳞面纹；
- 锤纹；
- 腐蚀坑。

可通过高模烘焙 normal 或有限 displacement。

## 13.3 Micro Normal

肉眼不应该看到单独颗粒，但光学上能让反射变柔。

目标不是“看到噪点”，而是：

> **看到光被这些微结构整体散开。**

如果 micro-normal 读成一层砂粒，就是磨砂塑料感。

## 13.4 Statistical Roughness

更小的亚像素结构无需逐一建模，用 roughness 表达其统计效果。

## 13.5 Directional Finish

仅在真实加工有方向性时使用 anisotropy：

- 拉丝；
- 放射车纹；
- 机械币缘加工。

普通 frosting 不应为了“高级”乱开 anisotropy。

---

# 14. 为什么统一 Noise → Roughness 往往很廉价

成熟币面的 roughness 有工艺因果：

- 高点因为摩擦变亮；
- 凹槽可能氧化变暗、变粗；
- Proof field 高度镜面；
- 浮雕主体可能 frosting；
- 边缘有加工方向；
- 新断口反射行为不同；
- 磨损沿真实接触和凸起发生。

因此：

> **roughness map 首先是一张工艺地图，其次才有微小随机变化。**

而不是一张全局 Noise。

现有 COIN_CRAFT 已经有“区域材质区别、磨损沿真实凸起、避免全局噪声”的方向，本研究为它补上了完整 PBR 理由。

---

# 15. Blender → glTF → Babylon 的推荐材质架构

当前项目路线：

Blender → GLB → Babylon.js

是可行的，但应区分：

## 母版材质

可在 Blender/OpenPBR/MaterialX 方向保存高保真资产。

OpenPBR 适合表达更完整的材质语义。

## 运行材质

glTF 2.0 负责稳定传递：

- Base Color；
- Metallic；
- Roughness；
- Normal；
- AO；
- 可选 anisotropy。

GLB 是 delivery artifact，不应成为永久美术母版。

Babylon 当前 OpenPBR 对 base_diffuse_roughness 等部分能力并不完全等价于离线母版，但对金属认证币的核心 metallic/specular roughness 路线影响较小，因为金属霜面本来就不应靠 diffuse roughness 实现。

---

# 16. 环境光是金属材质的一部分，而不是“页面背景”

一个粗糙金属如果没有合适环境，甚至很难看出自己是什么材质。

金属的主要视觉信息来自它反射的环境。

即使 PWA canvas 透明，也应使用**不可见但参与反射的 neutral studio environment**。

可以包含：

- 大面积柔和白色 softbox；
- 较暗黑卡；
- 低频灰环境；
- 少数大尺度亮区。

理想结果：

旋转硬币时，高光真实沿浮雕流动，而不是贴图上的白斑跟着币一起转。

---

# 17. 高级磨砂银的目标不是“没有高光”

漫/雾面感强不等于没有高光。

如果银币被做成：

- 灰；
- 低反射；
- 没有环境高光，

结果通常是灰塑料。

高级 frosted/satin 银应当仍然强烈响应环境，只是响应从尖锐白点变成宽大、柔和、连续移动的亮区。

因此材质验收不能只看静态截图，必须慢速旋转观察“光流”。

坏的 AI/PBR 会暴露为：

- 高光画死；
- 阴影固定；
- 每个鳞片都同时闪；
- 白点跳动；
- 材质没有连续光学行为。

---

# 18. Specular Aliasing：认证币的高风险问题

认证币天然包含：

- 尖角；
- 鳞边；
- 铭文；
- 高频 normal；
- 细刻线。

这很容易在手机分辨率下出现：

- 白点闪烁；
- crawling；
- 转动时高光跳跃。

Babylon 的 enableSpecularAntiAliasing 可以作为 A/B 测试工具。

但不能无条件强制，因为 anti-aliasing 可能通过增加有效 roughness 吃掉金属锐度。

最终应以真机转动效果决定。

---

# 19. Tone Mapping 也会制造“AI 宣传图感”

即使材质正确，重电影调色仍然可能：

- 压高光；
- 拉对比；
- 扭色相；
- 提饱和度；
- 制造暖冷强偏色。

因此建议建立两条渲染路径：

### Art Preview

允许适度艺术调色，用于展示。

### Certification Reference Render

强制：

- Neutral IBL；
- 中性曝光；
- Khronos PBR Neutral 等中性 tone mapping；
- 固定相机/光照；

用于：

- 材质审核；
- 版本比较；
- 跨设备核对；
- 最终资产验收。

---

# 20. 不把 AI Beauty Render 直接转成权威 PBR

Adobe Substance Sampler 等工具可以从图片估计：

- Normal；
- Height；
- Roughness；
- Base Color；
- Metallic。

技术上“AI 图 → PBR”当然能做。

但单张 beauty render 是欠约束反演：

某个区域变亮可能来自：

- 几何朝向；
- 灯光；
- roughness；
- metal F0；
- 后期；
- AO；
- 生成模型随手画的白边。

所以不应采用：

AI 稿 → 自动 Image-to-Material → 正式材质

更安全的是：

> **AI 稿 → 解释“这里想表达什么工艺” → Finish Mask → 程序生成/艺术家调整 PBR 属性。**

AI 从“猜物理参数的人”回到“提出工艺意图的人”。

---

# 21. 专业材质采集路线

未来若建立银、铜、古铜、木材等真实参考库，可采用：

- cross-polarized 采集；
- photometric stereo；
- 多角照明；
- 多角材质恢复；
- 真实 PBR 扫描。

原则是：

Albedo/Base Color 尽量去掉固定灯光、阴影和镜面。

MERL BRDF Database 等测量库可用于研究真实材料与微表面模型差异，但更适合验证和研究，不应直接变成项目贴图仓库。

---

# 22. 建议建立正式 Surface Finish Protocol

每个金属资产不再用“银色材质”描述，而应由以下对象组成：

> substrate + finish regions + roughness + micro-normal + optional anisotropy + patina

例如银币：

| 区域 | 物理身份 | 视觉意图 |
|---|---|---|
| Field | silver / polished | 接近 Proof 镜面 |
| Main Relief | silver / frost | 柔和宽反射 |
| Secondary Relief | silver / satin | 次级层次 |
| Highest Wear | silver / burnished | 高点局部重新变亮 |
| Recess | silver + patina | 暗、粗、低对比 |
| Broken Edge | fresh metal | 较亮、较锐 |
| Reeded Edge | machined metal | 可选方向性 anisotropy |

只用一个银色基材，也能产生丰富视觉层次。

---

# 23. 不应伪造统一“行业 roughness 数值”

不建议写死：

Frost=0.65  
Satin=0.42  
Proof=0.08

并称为行业真值。

视觉结果还取决于：

- BRDF 实现；
- normal 强度；
- IBL；
- 曝光；
- tone mapping；
- 屏幕；
- 几何尺度。

更好的方案是建立第二语言自己的材质校准片：

- 同一银基材；
- 同一浮雕；
- roughness 连续变化；
- 固定 Neutral IBL；
- 分别在 Blender、Khronos glTF Viewer、Babylon 页面观察；
- 真机核对。

然后项目内部冻结：

proof_v1  
satin_v1  
frost_v1  
burnished_v1

这些是项目渲染链校准结果，不是假装普适物理常数。

---

# 24. 运行压缩：优先保护 micro-normal 与 roughness

认证币真正吃画质的不一定是 baseColor，而常常是：

- normal；
- roughness；
- finish mask。

若压缩让 roughness 梯度 banding 或 micro-normal 糊掉，satin/frost 的差异会直接消失。

建议：

- 母版保存高质量无损纹理；
- 运行包独立生成 KTX2；
- 对 normal 等高质量数据优先测试 UASTC；
- 压缩前后 A/B 比较：
  - 粗糙度过渡；
  - 鳞片高光；
  - 霜面；
  - 手机旋转 shimmer。

---

# 25. 仇视之龙的材质路线建议

REST 样币应先完全关闭：

- 红眼；
- 口中红光；
- 黑雾；
- 粒子。

只靠 finish 建立层级：

- 龙头：较细腻 satin/frost；
- 眼眶/口腔：更深、更粗的局部氧化；
- 角/爪尖：真实受磨高点 burnish；
- Field：与龙体 roughness 明显分开；
- 新断口：更新鲜、更亮、反射更锐。

整枚币旋转时，应出现：

Field 退后 → 龙头出现 → 大角滑过宽高光 → 眼眶加深 → 爪尖出现锐亮 → 断口显出新鲜金属。

如果做不到，说明材质设计还没有完成，不应靠加红光补救。

---

# 26. 碎片建模：当前真正的问题不是“碎片不够精细”

仇视之龙当前左上币缘的问题，本质是：

> **把“碎片”当成视觉元素，而没有建模一次金属币缘被爪捏坏的结构损伤事件。**

成熟基本单位不应是 fragment，而应是：

**受力 → 塑性压陷/折曲 → 局部减薄与剪切 → 撕裂 → 残留撕裂唇 → 离体主碎片 → 次级碎片 → 微屑。**

---

# 27. 当前碎裂表现的主要不成熟点

| 当前表现 | 为什么不成熟 | 应有状态 |
|---|---|---|
| 多面体碎块像石头 | 金属被做成陶瓷/混凝土爆裂 | 金属先塑变再撕脱 |
| 爪与缺口因果弱 | 像爪旁边刚好有洞 | 指腹/爪尖必须对应压坑与裂纹起点 |
| 缺失体积与碎片不匹配 | 碎片像后来撒的装饰 | 大碎片必须来自可定位母体区域 |
| 碎片尺寸相近 | 典型 Voronoi/AI rock debris | 附着瓣、大块、小块、微屑有层级 |
| 断口像二维锯齿 | 没有币厚 | 正面—侧缘—背面连续断面 |
| 碎片表面身份不清 | 看不出哪里是原币面/断面 | 旧币面、原侧缘、新断面明确分区 |
| 漂散分布均匀 | 像构图粒子 | 密度和方向由撕裂与受力决定 |

---

# 28. 金属默认采用 deformation-first / fracture-second

一般银、铜、金和普通币用合金不应像玻璃一样瞬间碎成多面体。

延性金属断裂通常伴随：

- 塑性变形；
- 局部减薄；
- 颈缩；
- 剪切；
- 微孔洞形核、长大、聚合；
- 撕裂唇。

对数字艺术而言不需要显微级有限元，但视觉上必须遵守一个核心约束：

> **看见碎片之前，先看见材料曾经承受过力。**

如果某枚币确实要像晶体一样爆碎，应明确把“脆性/超自然材料行为”设为主题规则，而不是让默认金属偷偷表现成石头。

---

# 29. Houdini 路线的关键启发

## MPM Post-Fracture

非常适合第二语言的思想：

- 先模拟材料真实形变；
- 到最终状态再根据 stretching/bending 等信息切高质量渲染几何；
- Align Fractures to Stretch Points 可让破裂沿真实拉伸方向；
- Close Gaps 可避免塑性金属尚未真正断裂时出现大量不真实小缝。

核心设计语言：

> 不要先画裂缝。先让币被爪捏坏。达到极限以后，裂缝才出生。

## RBD Metal

适合更便宜地探索：

- bending；
- denting；
- tearing；
- angular plasticity。

它可以提供变形/破坏参考，但不能因为有“专业破碎节点”就自动获得艺术设计。

---

# 30. M1-D Structural Damage & Fragment Provenance Protocol

建议把碎裂正式纳入 M1 Sculptural Core，而不是 M3 特效。

## D0 — Damaged Master

先得到尚未完全分离的连续受损母体：

- 压陷；
- 折曲；
- 拉薄；
- 局部流动。

## D1 — Contact Field

明确：

- 爪尖；
- 指腹；
- 币缘接触；
- 压力来源。

主要破坏必须可追溯到受力位置。

## D2 — Tear Network

设计：

- 主撕裂；
- 少数短支裂；
- 剪切区；
- 裂纹终止。

禁止全币蜘蛛网。

## D3 — Fragment Provenance

所有主碎片必须从 D0 的同一受损母体实际切出。

不能凭空另建“漂亮石块”。

## D4 — Fracture Surface

新鲜断面需要：

- 撕裂唇；
- 薄韧带；
- 毛刺；
- 真实厚度；
- 与旧币面不同的材质/几何身份。

## D5 — Debris Hierarchy

形成尺度层级：

附着金属瓣 → 主碎片 → 次级碎片 → 微屑

禁止全都一样大、一样厚、一样远。

## D6 — Digital Delivery

- 主碎片：真实 mesh；
- 重要次级碎片：真实 mesh；
- 微小金属屑/灰尘：可 particle；
- AWAKENED 可做运动；
- REST 必须有确定、跨设备一致的静态状态。

---

# 31. 建立“回拼不变量”

建议使用：

> **Pre-Separation Damaged Master**

作为碎片来源基准。

不是未受损原币，而是“已经被压弯、压薄，但还没完全裂开”的那一刻。

随后：

残余母币 + 主碎片逆变换 ≈ 分离前受损母体

允许少量体积成为微屑损失，但不能：

- 缺半枚币却只有三个无关块；
- 凭空多一块；
- 碎片与缺口无法匹配。

建议每块保存：

- fragment_id；
- source_patch_id；
- rest_transform；
- detached_transform；
- damage_level；
- fracture_material。

内部提供 Reassembly Mode，一键把主要碎片放回源位置。

对不上，直接返工。

---

# 32. 每个主碎片至少有三种表面身份

1. **原币外表面**  
   原本的古银、磨砂、抛光、浮雕。

2. **原币侧缘**  
   边刻、滚边、真实币厚。

3. **新鲜断面**  
   刚撕开的内部金属。

数字实现建议：

- 宏观卷曲、撕裂唇、厚度变化：真实几何；
- 中尺度断面起伏：几何或 displacement；
- 微观 dimple/grain：normal + roughness。

RBD Interior Detail 一类方法适合只给内部断面增加细节；不应把统一 fractal noise 铺到整块碎片。

---

# 33. 仇视之龙左上破口的具体重建建议

以下是样币探索建议，不是行业标准：

1. 从完整、有真实厚度和边刻的 intact master 开始；
2. 两根主要爪尖/指腹真实跨正面—侧缘—背面形成夹持；
3. 先完全不生成碎片，只做压陷、折曲、局部鼓起、减薄、剪切；
4. 固定 pre-separation damaged master；
5. 设计 1 条主撕裂 + 少数短支裂；
6. 首轮仅做约 1–2 个主碎片；
7. 至少一块主片同时带有原币面、原边刻、新断面；
8. 再增加少量次级小片；
9. 至少保留一处尚未完全脱离的卷曲金属瓣/薄韧带；
10. 使用同一 cutter/fracture field 同时生成母体缺口和碎片互补面；
11. 完成 REST 灰模后再摆碎片；
12. 最靠近断口的主片最大，外侧逐渐变成更小片和微屑；
13. 黑雾最后加入，只负责悬浮/强化，不负责解释断裂。

最终应该让观察者看出：

> 这只爪怎样把金属挤坏、撕开，然后哪些真正属于这枚币的部分被扯出去。

而不是“龙爪旁边有一团破碎特效”。

---

# 34. 碎裂工具角色分配

| 技术 | 适合承担 | 不适合承担 |
|---|---|---|
| Houdini MPM | 高质量受力/塑变/撕裂参考；从 strain 决定破裂 | 直接替代艺术设计 |
| Houdini RBD Metal | 更快探索 bending/denting/tearing | 默认随机 fracture |
| 定向 Boolean/Cutter | 锁定批准的主撕裂线和互补碎片 | 生产海量随机块 |
| RBD Interior Detail | 只处理新断裂面 | 往旧币面铺岩石噪声 |
| Blender Exact Boolean/Sculpt | 最终切分、局部形变、英雄级返修 | 一次 boolean 就宣称完成 |
| ZBrush Live Boolean/Sculpt | 撕裂唇、毛刺、卷曲、英雄断口 | 替代来源关系 |
| Chaos/Blast 类框架 | 学习 cluster/chunk hierarchy | 默认做实时爆炸 |
| glTF/Babylon | 保存确定碎片节点和预制姿态 | 手机现场随机重算破碎 |

---

# 35. 碎裂验收门槛

| 门槛 | 合格 | 一票返工 |
|---|---|---|
| 受力因果 | 裂口与爪接触/压痕一致 | 洞和爪只是靠近 |
| 塑性门 | 裂前有永久变形 | 金属像玻璃直接炸 |
| 回拼门 | 主片来自受损母体 | 漂浮块找不到来源 |
| 厚度门 | 正侧背断裂连续 | 纸片裂纹 |
| 层级门 | 附着瓣/大块/小块/微屑 | 等大多面体 |
| 断面门 | 旧币面/侧缘/新断面分明 | 整块同一种石头纹 |
| 灰模门 | 关材质雾光仍读出“被捏裂” | 靠烟尘才像破碎 |
| 旋转门 | 360° 来源和厚度都成立 | 正面好看侧背穿帮 |
| 特效门 | 雾只强化已有碎片 | 粒子替代大碎片 |
| 运行门 | REST 确定且一致 | 每次随机炸不同 |

据此，断口、撕裂瓣、主碎片和重要次级碎片应正式归属 M1；断面材质归 M2；极小金属屑、尘粒和黑雾才属于 M3。

---

# 36. 为什么 AI 设计稿不能被建模标准完全约束

“碎片必须可回拼”“断面必须有厚度”“金属先塑变再撕裂”这些规则对 3D 模型非常有效，但很难要求 diffusion 图像生成器在一张图里严格实现。

如果因此放弃 AI 设计稿，让 Codex 只按工程规范自己建模，又会得到另一种失败：

- 解剖和厚度可能正确；
- 拓扑可能干净；
- 碎片可能可回拼；
- 但整个东西像规范驱动的工程拼装；
- 失去构图、气势、视觉节奏和高级设计属性。

因此不能选择：

“忠于 AI 错误”  
或  
“脱离 AI 自己做一个正确模型”

二选一。

---

# 37. 正确关系：异构双表示协同进化

AI 设计稿与 3D 模型应被视为两个不同的设计假设：

C_k = 第 k 版 AI Visual Design State  
M_k = 第 k 版 3D Model State

两者共享一个稳定中心：

K = Design Kernel

理想更新关系：

C(k+1) 由 C(k) + M(k) 的结构渲染 + K + 审阅反馈产生；

M(k+1) 由 M(k) + C(k+1) 中被接受的设计增量 + K + 三维约束产生。

最终目标不是：

Render(M_k) = C_k

而是：

> **两种表示对真正重要的共享设计事实越来越一致。**

---

# 38. 外部研究对“协同进化”的支持

## DreamCraft3D

其 coarse-to-fine 过程包含 3D 场景与更 3D-aware 的 diffusion prior 的交替强化，属于典型 mutually reinforcing improvement 思路。

它说明“二维先验指导 3D，3D 状态再反过来改善二维先验”并非只是一种项目直觉。

## CraftsMan3D

其流程把 coarse mesh 渲染为 normal 等二维结构表示，再通过扩散模型增强，并把结果反向监督 3D。

这直接证明：

> 3D → 2D 中间表示 → AI 增强/设计 → 3D

可以成为真实生产回路。

## GeoStyle

说明图像即使不具备逐点 3D 真值，仍可作为几何风格、比例、剪影、显著形态的软指导。

## 专业 concept art 工作流

真实视觉开发长期存在：

2D sketch → 3D blockout → render → 2D paintover → 3D refine

这本来就不是第一张概念图永久统治所有后续阶段。

## 新一代 image-to-3D / multi-view

Pixal3D、TRELLIS、Hunyuan3D 等方向持续改善 2D–3D correspondence 和多视图一致性，但这只能提高“忠实搬运”的能力。

如果输入概念本身错了，越高 fidelity 反而越准确地放大错误。

因此 correspondence 是工具，不是设计权威。

---

# 39. 谁对什么事实拥有权威

建议正式建立如下权限表：

| 设计属性 | AI 概念权 | 3D 模型权 | 映射强度 |
|---|---:|---:|---|
| 情绪、气势、视觉故事 | 主 | 辅 | 很软 |
| 正面构图/视觉重心 | 主 | 共同验证 | 软—中 |
| 主剪影 | 共同 | 共同 | 中—强 |
| 龙头转向/眼神方向 | 共同 | 共同 | 强 |
| 大尺度比例 | 共同 | 共同 | 中—强 |
| 角/爪/碎片造型语言 | AI 提出 | 3D 落实/纠错 | 中 |
| 掌部/指节/真实厚度 | 参考 | 主 | 不追二维错误 |
| 正侧背连续 | 很弱 | 主 | 3D 权威 |
| 断裂来源/碎片回拼 | 视觉意图 | 主 | 3D 权威 |
| 漂浮碎片视觉节奏 | 主 | 共同 | 软 |
| 微裂纹/鳞纹 | 共同 | 共同 | 弱 |
| 材质审美 | 主 | 共同 | 中 |
| 真 roughness/PBR | 参考 | 主 | 物理权威 |
| 高光/固定阴影 | 表现参考 | 渲染器主 | 不映射 |
| 黑雾/光效构图 | 主 | 空间实现 | 软—中 |

核心原则：

> **不是哪张图权威，而是哪一种表示对哪一种事实拥有权威。**

---

# 40. Bridge Render Pack：让 3D 反过来约束下一轮 AI

不能继续每轮都让 AI“重新画一枚仇视之龙币”。

应从当前真实 3D 输出：

- Clay；
- Depth；
- Normal；
- Silhouette；
- Object-ID；
- Material-ID；
- 固定相机 beauty render；
- 必要时侧/背/45°结构视图。

然后下一轮 AI 以这些结构结果作为条件，探索：

- 更好的爪形；
- 更好的碎片视觉节奏；
- 更好的龙首细节；
- 更好的币章构图。

ControlNet 的 Depth/Normal/Canny 等结构控制与 IP-Adapter 类参考图控制可以组合：

- 结构来自 3D；
- 风格/视觉身份来自当前概念；
- 新一轮 AI 只在有真实支架的空间里探索。

这与无条件重抽整币完全不同。

---

# 41. AI 新图只产生 Proposal，不自动产生 3D 命令

假设 AI 新图把一块碎片画成很漂亮的卷曲三角片。

Codex 先判断：

- 是否改善负空间；
- 是否增强力量方向；
- 是否减少杂乱；
- 是否让破口更高级；
- 是否抢龙头焦点。

若有价值，它成为 design proposal。

然后 3D 再翻译：

- 能否从母体真实切出；
- 厚度是否合理；
- 原币边刻落在哪里；
- 撕裂根部在哪里；
- 能否回拼；
- 是否需要改变破口。

最终 3D 可以与 AI 图不逐像素相同，但要保留该提案的设计价值。

随后再把真实 3D 渲染回 AI 回路。

---

# 42. Selective Correspondence：只对该强约束的东西强约束

不能把全图 RGB 差异做成强优化目标，否则 3D 会被逼着复制：

- AI 高光；
- 假阴影；
- 错误材质；
- 不可能细节。

建议：

- silhouette：较强；
- 关键 landmark / region mask：较强；
- 认可的 depth / normal：中强；
- RGB / perceptual similarity：弱；
- 高光与固定阴影：基本不参与几何约束。

这就是选择性对应，而不是“软映射”一句话带过。

---

# 43. 防止错误互相强化：Design Kernel + Divergence Review

协同进化可能把错误越做越确定：

AI V1 画错 → 3D V1 半正确实现 → render 回 AI → AI V2 因结构条件更强把错误画得更确定 → 3D V2 更忠实。

因此必须有不属于任何单个 C/M 版本的 Design Kernel。

仇视之龙当前 Kernel 可至少包括：

- 龙头向右转；
- 近侧眼仇视观看者；
- 左上/右下夹持；
- 左上爪造成币缘破坏；
- 币仍然读作完整收藏器物；
- 碎片来自币本体；
- 背面不争夺主焦点。

每轮还应把 C 与 M 差异分类为：

- AI hallucination；
- 3D implementation defect；
- intentional translation；
- new design proposal；
- unresolved。

不能看到“不一样”就修。

之前原眼被误诊为空眼眶、随后加错眼球/竖瞳，就是典型反例。

---

# 44. Representation Contract：关键部件的跨表示合同

每一个关键设计对象可保存：

- object_id；
- design intent；
- hard invariants；
- concept authority；
- model authority；
- mapping strength；
- current disagreement；
- accepted translation。

例如 BREAK_A：

AI 负责：

- 破坏位置；
- 总体轮廓；
- 视觉爆发方向；
- 碎片层级；
- 负空间。

3D 负责：

- 爪受力；
- 塑性变形；
- 真实厚度；
- 母体缺口；
- 主碎片来源。

共享：

- 破口总体大小；
- 主碎片位置范围；
- 视觉方向。

自由：

- 微小毛刺；
- 具体微裂纹；
- 小碎屑坐标。

这样 Codex 不再面对含糊要求：

“尽量照图建，不合理的地方自己改。”

---

# 45. 进一步修正：禁止脱离母体的“局部候选”

用户进一步指出一个极其重要的问题：

> 局部设计分歧不应单独生成新的局部 AI 稿图或独立局部模型。局部生成极易丢失全局上下文，造成比例、视觉重心、风格、币缘关系和空间连续性漂移。

这一判断应正式升级为资产架构规则。

### 禁止

完整 C7 → 截左上爪 → 单独生成 claw-v2.png → claw-v2 成为设计母稿

完整 M5 → 单独做一个新爪/fragment cluster → 做漂亮以后粘回 M5

### 允许

C7 → C7 + ΔBRK-A  
C7 → C7 + ΔBRK-B  
C7 → C7 + ΔBRK-C

M5 → M5 + ΔBRK-A  
M5 → M5 + ΔBRK-B  
M5 → M5 + ΔBRK-C

A/B/C 始终是**同一个完整作品的分支**。

---

# 46. “局部”只能是编辑范围，不能变成新的设计上下文

这条需要精确定义。

并不是禁止：

- mask；
- local sculpt；
- local remesh；
- local boolean；
- inpaint；
- ROI crop；
- 局部放大。

而是：

> **这些都只能作为内部计算/编辑手段，最终候选和权威资产必须回到完整原图/完整原模型。**

图像 inpainting 的成熟方向本身也是：

base image + selection/mask + 非破坏修改

即使内部为了分辨率裁 ROI，结束后也要回贴完整画布。

3D 端同理：可以只对局部重建、雕刻、布尔，但最终必须在整枚币上评估。

---

# 47. 原位修改不等于覆盖唯一母版

“直接在原图和原模型修改”应理解为：

> **始终在原完整对象上下文中修改，同时通过 version/layer/variant 保留父版本。**

不是 Ctrl+S 覆盖唯一母稿。

可以借鉴：

- OpenUSD Layer/VariantSet；
- Blender Multires；
- Shape Keys（适合拓扑稳定变形）；
- Modifier；
- Sculpt Mask；
- 完整 Scene Variant（适合碎裂等拓扑改变）。

像币缘破裂会改变拓扑，不应硬塞进 Shape Key；应建立完整场景分支，但未变对象继续共享。

---

# 48. 3D 多视图一致性进一步支持“完整资产候选”

近年的 3D editing 研究持续强调：

局部或单视图修改后，其他视图很容易不一致。

因此第二语言的规则应非常明确：

左上破口不是“一个局部碎裂模型”，它同时属于：

- 正面破口；
- 侧壁；
- 背面破口；
- 币厚；
- 爪接触；
- 整体负空间。

所以：

- 局部 zoom 可以看；
- 局部 mask 可以雕；
- 内部求解可以只算那一块；
- **评价对象必须重新回到整枚币。**

---

# 49. 全资产候选规则

| 对象 | 权威资产 | 允许 | 禁止 |
|---|---|---|---|
| AI Concept | 完整 C_k | 在完整原图上 mask/layer/inpaint，生成完整 C_k^A/B/C | 单独爪/眼/碎片图作为新设计稿 |
| 3D Model | 完整 M_k | mask sculpt、modifier、variant、局部 remesh/boolean | 单独漂亮局部模型后粘回 |
| 局部特写 | View only | 放大审查 | 晋升为权威资产 |
| Bridge Render | 完整固定视图 | AI↔3D 传递结构/审美 | 只给对方局部 crop |
| Candidate | 完整作品状态 | A/B/C 并行比较 | A=一只爪，B=另一只爪 |
| 用户反馈 | 主观审美权威 | 比较成熟完整候选 | 替 Codex 筛垃圾中间稿 |

---

# 50. Codex 内部筛选，人类只处理高价值审美不确定性

用户不应该成为“AI 美术质检员”。

Codex 应自己完成大量内部：

生成/修改 → 自审 → 结构检查 → 全局检查 → 淘汰 → 再修改

即使内部出现十几个 variant，真正交给用户的应只剩：

- 2–3 个；
- 都已达到相对成熟；
- 客观结构问题不再明显主导；
- 差异主要属于高级审美取舍。

如果用户还要反复指出：

“这个指头断了”  
“这个碎片悬空”  
“这个龙头又变形了”

说明 Human Preference Gate 被过早触发。

---

# 51. Human Preference Gate：比“你觉得哪个好看”更正式

主观评价更适合：

### Pairwise / 小规模相对比较

A vs B  
或  
A / B / C

相对判断通常比稳定的绝对分数更容易。

### 再加 Absolute Anchor

例如：

“最佳候选是否已经达到可以继续进入下一阶段？”

这样避免只知道 A>B，却不知道 A/B 是否都很差。

### 允许 Hybrid Preference

“更喜欢 B 的碎片节奏，但 A 的破口更有力量。”

这类反馈对设计最有价值。

### 必须允许

- 都不行；
- 难以区分；
- 无明显偏好；
- 某一局部组合优于整个候选。

---

# 52. 不建议频繁让用户打大量维度分

例如：

构图 8.3  
力量感 7.9  
精致度 8.7

会制造虚假的测量精度。

人的绝对尺度会随上下文漂移。

更可操作的数据往往是：

- B > A；
- B ≈ C；
- B 已经可接受；
- B 仍不可接受；
- 喜欢 B 的碎片节奏，但喜欢 A 的破口；
- 这次我没有足够把握。

偏好系统应保存不确定性，而不是把每次点击当成绝对真理。

---

# 53. 候选展示必须标准化

为了防止用户实际在比较灯光/镜头而不是设计：

AI 概念候选：

- 完整币；
- 同尺寸；
- 同背景；
- 同观看距离；
- 同主相机；
- 可附局部 crop，但 crop 只是说明视图。

3D 候选：

- 同相机；
- 同 neutral material；
- 同光照；
- 同转台路径；
- 同样的正/45°/侧/背输出。

否则 A 用强侧光、B 用平光，会污染审美判断。

---

# 54. 周期性 Rebase：防止“连续原位修改”本身造成累积漂移

原位修改虽然比独立局部重生成稳定，但长期会出现另一种风险：

今天改爪；  
明天改破口；  
后天改角；  
再改龙身；

每次都只改一点，十几轮后整体作品可能在无意识中远离最初优点。

因此每经过若干已接受的重要 delta，应生成新的：

**Canonical Concept C(k+1)**  
**Canonical Model M(k+1)**

把已批准 delta 合并，再做：

- 全局 silhouette compare；
- 构图 compare；
- 保护区 diff；
- Design Kernel 检查；
- 与上一 canonical 的整币对比。

旧 canonical 永久保留。

谱系应是：

C7 → accepted deltas → C8

而不是在同一张 PSD/Blend 上无限叠 100 次修改。

---

# 55. 最终建议的完整状态机

**Canonical Concept + Canonical Model**

↓

发现局部/全局设计问题

↓

在两个完整母体上建立可逆 delta variants

↓

AI 概念与 3D 模型双向协同迭代

↓

Codex 内部结构 QA、材质 QA、全局构图 QA、候选淘汰

↓

得到 2–3 个真正成熟的完整成品候选

↓

**Human Preference Gate**

↓

用户选择 / 否决 / 混合偏好 / 无偏好

↓

Codex 把偏好翻译成设计修改，而非逐字机械照抄

↓

Concept / Model 继续互相收敛

↓

全局复核

↓

Promote 为下一版 Canonical

↓

进入下一问题或材质/动效阶段

---

# 56. 把这一体系落回仇视之龙

对当前样币，建议下一阶段不要继续追求“一张最终完美 AI 图”，也不要直接把当前图再次扔进 image-to-3D。

更合理的下一步是建立第一组真正可迭代的：

- Canonical Concept；
- Canonical Model；
- Bridge Render Pack；
- Design Kernel；
- Representation Contract；
- Δ-variant；
- Human Preference Gate。

优先问题顺序应围绕当前最明显的设计/结构风险：

1. 左上爪与破口；
2. 碎片 provenance、塑性撕裂与视觉节奏；
3. 龙头后方角/棘/疑似旧爪融合；
4. 龙身/颈胸形态归属；
5. 两组爪的掌部与指节连接；
6. 正侧背连续；
7. 材质 finish；
8. 最后才是红眼、红口、黑雾和微粒。

每个问题都不得生成独立局部“成品”，而应从当前完整资产分支多个完整候选。

---

# 57. 推荐的仇视之龙一次真实偏好回路示例

当前左上破口不成熟，建立问题 BRK-01。

内部探索：

### Candidate A

- 破坏范围较小；
- 一个主卷曲片；
- 少量微屑；
- 完整币感最强。

### Candidate B

- 更强的斜向撕裂；
- 两个主片形成明显力量方向；
- 破坏感更强。

### Candidate C

- 保留更多币缘；
- 碎片数量最少；
- 更强调爪的压迫而不是爆裂。

但 A/B/C 都必须输出：

- 完整 AI Concept；
- 完整 3D；
- 正/45°/侧/背；
- 同 neutral material；
- 同镜头与照明。

Codex 先排除：

- 解剖问题；
- 回拼失败；
- 破口厚度错；
- 碎片抢焦点；
- 视觉杂乱；
- 侧背穿帮。

最后可能只给用户 A/B。

用户反馈可能是：

> A 整体更高级，但 B 的主碎片方向更有力量。

Codex 不应机械拼接图片，而应把这句话转换为新的设计 delta：

- 保留 A 的破坏量/负空间；
- 引入 B 的主力方向；
- 重新做结构合法的母体与碎片；
- 再生成下一组完整候选。

这才是有效的人机审美闭环。

---

# 58. 统一生产质量门禁

建议后续认证币统一包含以下门禁。

## 58.1 设计门

- 完整币构图成立；
- 主题不靠标题解释；
- 有明确主焦点；
- 负空间成立；
- 关色/关光/关雾后仍成立；
- AI 高频装饰不主导。

## 58.2 雕塑门

- 灰模正/45°/侧/背全部成立；
- 主剪影清楚；
- 接触关系真实；
- 正侧背连续；
- 重要部件不是球/管/锥占位；
- 局部修改后回看整枚币。

## 58.3 材质门

- metallic/roughness 物理逻辑正确；
- finish 有工艺因果；
- 不靠固定高光；
- 不用统一噪声；
- neutral reference render 通过；
- 转台光流自然；
- 真机无严重 specular shimmer。

## 58.4 碎裂门

采用第 35 节完整 QA。

## 58.5 数字特效门

- REST 完整；
- AWAKENED 才出现数字 Aura；
- 无光源不发光；
- bloom 不承担主体；
- 雾必须有局部来源与衰减；
- 大碎片不用 particle；
- 关特效仍是完整作品。

## 58.6 人类审美门

- 仅成熟完整候选；
- 同视图/同材质/同光照；
- Pairwise/小规模偏好；
- 有“都不行”和混合偏好；
- 反馈被翻译成设计增量；
- 不让用户做基础 QA。

---

# 59. 推荐的数据结构草案

为了后续 Codex 可实际管理这套体系，可以建立如下概念数据。

## Design Kernel

- coin_id
- theme
- core_story
- front_focus
- hard_invariants
- reverse_class
- material_intent
- prohibited_shortcuts

## Representation Object

- object_id
- design_intent
- concept_authority
- model_authority
- mapping_strength
- hard_invariants
- current_disagreement
- accepted_translation
- status

## Concept State

- concept_version
- parent_version
- full_asset_path
- accepted_deltas
- rejected_deltas
- bridge_inputs
- protected_regions
- review_status

## Model State

- model_version
- parent_version
- full_asset_path
- topology_state
- accepted_deltas
- fragment_provenance
- material_bindings
- bridge_render_pack
- review_status

## Delta Variant

- issue_id
- variant_id
- target_regions
- parent_concept
- parent_model
- concept_delta
- model_delta
- objective_fixes
- known_tradeoffs
- internal_score_notes
- human_gate_eligible

## Human Preference

- issue_id
- candidate_ids
- preferred
- confidence
- acceptable_to_advance
- liked_attributes
- disliked_attributes
- hybrid_request
- free_text
- timestamp

这些字段用于可追踪性，不意味着要把审美强行算法化。

---

# 60. 研究引用与外部参考

以下资料是本轮研究中用于验证方向的代表性来源。正式协议落地时仍应固定版本/快照，避免把可变网页当成长期权威。

## 铸币、浮雕与表面工艺

- U.S. Mint — Coin Production / Design and Selection / Die Making / Sculpting  
  https://www.usmint.gov/learn/production-process/coin-production  
  https://www.usmint.gov/learn/production-process/die-making  
  https://www.usmint.gov/learn/production-process/sculpting

- U.S. Mint — American Women Quarters common/series design context  
  https://www.usmint.gov/news/press-releases/mint-announces-designs-for-2025-american-women-quarters-program-coins.html

- Royal Mint — Britannia security / surface animation  
  https://www.royalmint.com/aboutus/press-centre/the-royal-mint-unveil-the-worlds-most-visually-secure-bullion-coin/

- Royal Mint — small-scale design / negative space discussion  
  https://www.royalmint.com/shop/limited-editions/national-gallery/striking-the-national-gallery-2-coin-edwina-ellis/

- Royal Canadian Mint — finishes / Proof / Reverse Proof / Specimen  
  https://www.mint.ca/en-us/blog/whats-in-a-finish

- Royal Canadian Mint — The Jack Pine 等将原画颜色转译为浮雕/纹理/finish 的案例  
  https://www.mint.ca/en-us/shopping/archives/2026/the-jack-pine-by-tom-thomson-2-oz-fine-silver-coin-lc

- Perth Mint — coin colouring process  
  https://www.perthmint.com/news/collector/coin-collecting/how-coins-are-coloured/

## PBR / 材质 / glTF

- Blender Principled BSDF  
  https://docs.blender.org/manual/en/latest/render/shader_nodes/shader/principled.html

- OpenPBR  
  https://academysoftwarefoundation.github.io/OpenPBR/

- Khronos glTF 2.0 Specification  
  https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html

- Khronos glTF PBR overview  
  https://www.khronos.org/gltf/pbr

- Khronos PBR Neutral Tone Mapper  
  https://www.khronos.org/news/press/khronos-pbr-neutral-tone-mapper-released-for-true-to-life-color-rendering-of-3d-products

- Babylon.js PBR / OpenPBR documentation  
  https://github.com/BabylonJS/Documentation/blob/master/content/features/featuresDeepDive/materials/using/masterPBR.md  
  https://github.com/BabylonJS/Documentation/blob/master/content/features/featuresDeepDive/materials/using/OpenPBR.md

- Adobe Substance 3D Sampler — Image to Material / Multiangle to Material  
  https://experienceleague.adobe.com/en/docs/substance-3d-sampler/using/filters/tools/image-to-material  
  https://experienceleague.adobe.com/en/docs/substance-3d-sampler/using/filters/tools/multiangle-to-material

- Poly Haven technical texture standards  
  https://docs.polyhaven.com/technical-standards/textures

- MERL BRDF Database  
  https://www.merl.com/research/downloads/BRDF/

## 金属破坏、碎裂、布尔与雕塑

- SideFX Houdini — Metal Destruction  
  https://www.sidefx.com/docs/houdini/destruction/metal.html

- SideFX MPM Post-Fracture  
  https://www.sidefx.com/docs/houdini/nodes/sop/mpmpostfracture.html

- SideFX MPM Metal configuration  
  https://www.sidefx.com/docs/houdini/mpm/mpmconfigmetal.html

- SideFX RBD Interior Detail  
  https://www.sidefx.com/docs/houdini/nodes/sop/rbdinteriordetail.html

- ZBrush Live Boolean  
  https://help.maxon.net/zbr/en-us/Content/html/user-guide/3d-modeling/modeling-basics/creating-meshes/live-boolean/live-boolean-mode/live-boolean-mode.html

## 2D–3D 协同、生成式设计与编辑

- DreamCraft3D — Hierarchical 3D Generation with Bootstrapped Diffusion Prior  
  https://arxiv.org/abs/2310.16818

- CraftsMan3D  
  https://craftsman3d.github.io/

- GeoStyle  
  https://changwoonchoi.github.io/GeoStyle/

- PyTorch3D — Fit a mesh via differentiable rendering  
  https://pytorch3d.org/tutorials/fit_textured_mesh

- Hugging Face Diffusers — ControlNet  
  https://huggingface.co/docs/diffusers/using-diffusers/controlnet

- Hugging Face Diffusers — IP-Adapter  
  https://huggingface.co/docs/diffusers/using-diffusers/ip_adapter

- Hunyuan3D 2.1  
  https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1

- Adobe Photoshop Generative Fill（base image + selection 的非破坏式思路）  
  https://helpx.adobe.com/photoshop/using/generative-fill.html

- OpenUSD — composition / layers / variants  
  https://openusd.org/release/intro.html

- Blender Shape Keys / Sculpt / non-destructive editing documentation  
  https://docs.blender.org/manual/en/latest/animation/shape_keys/introduction.html  
  https://docs.blender.org/manual/en/latest/sculpt_paint/sculpting/introduction/index.html

---

# 61. 与现有项目文件的关系

本报告应与以下现有资料配套阅读：

- protocol/COIN_CRAFT.md  
  当前认证币制作协议与已知质量门槛。

- protocol/CERTIFICATION_RESEARCH.md  
  认证逻辑研究。

- research/chapter-certification-and-coins-2026-10-09.md  
  章节认证与纪念币早期研究。

- research/dragon-coin-production-standard-2026-10-10.md  
  龙币生产路线研究。

- research/hostile-dragon-2026-10-12/README.md  
  仇视之龙设计与三维重建共同审阅资料。

- research/hostile-dragon-2026-10-12/kaggle-test/outputs/COIN_ART_DIRECTION.md  
  当前样币艺术方向与已确认问题。

本报告的作用不是覆盖这些历史材料，而是把 2026-10-12 后续多轮研究的核心结论统一到一套可继续演化的系统视角中。

---

# 62. 建议后续正式协议拆分

如果未来把研究结论真正升级为协议，建议不要把所有东西继续塞进单个 COIN_CRAFT.md。

可考虑拆成：

1. **COIN_DESIGN_KERNEL.md**  
   统一设计语言、正背面职责、AI Concept 与 Design Kernel。

2. **COIN_REVERSE_PROTOCOL.md**  
   Archive Seal / 统一认证币背。

3. **COIN_SCULPTURE_PROTOCOL.md**  
   M0/M1、灰模、多视图、结构连续。

4. **COIN_SURFACE_FINISH_PROTOCOL.md**  
   M2、PBR、roughness、micro-normal、finish。

5. **COIN_DAMAGE_FRAGMENT_PROTOCOL.md**  
   M1-D、塑性破坏、fragment provenance、回拼。

6. **COIN_DIGITAL_AURA_PROTOCOL.md**  
   M3、REST/AWAKENED、emissive、雾、粒子。

7. **COIN_COEVOLUTION_PROTOCOL.md**  
   Concept ↔ Model、Bridge Render、Representation Contract。

8. **COIN_HUMAN_PREFERENCE_GATE.md**  
   完整候选、人类审美问答、偏好记录、Canonical promotion。

本报告则作为这些协议的研究母本和跨层解释。

---

# 63. 最终总原则

将全部研究压缩后，最值得长期冻结的不是某个具体 roughness 值、某个 AI 模型、某个破碎节点或某张样币图，而是下面这些原则：

### 原则一：币章优先

每一枚认证币先作为币章成立，再谈数字特效。

### 原则二：背面负责权威，正面负责作品

背面统一、克制、可长期扩展；正面拥有题材自由，但必须先完成雕塑。

### 原则三：表面工艺优先于施彩，施彩优先于发光，发光优先于雾/粒子

越往后，越需要证明不可替代。

### 原则四：AI 图不是几何真理，3D 也不是审美真理

两者对不同事实拥有不同权威。

### 原则五：不强映射，但必须保持同一 Design Kernel

允许翻译，不允许失去主题和关键不变量。

### 原则六：局部问题只能局部编辑，不能脱离完整作品生成新的局部权威资产

局部是编辑范围，不是新的设计世界。

### 原则七：所有主碎片都必须真正来自币

碎裂必须是结构损伤事件，不是装饰粒子。

### 原则八：材质不是贴图效果，而是光学表面系统

金属雾面主要靠 rough specular，而不是把 metallic 降成灰色塑料。

### 原则九：用户负责高级审美，不负责基础质检

Codex 应在内部把明显失败候选淘汰，只把成熟完整方案交给用户比较。

### 原则十：长期迭代必须可追溯、可回滚、可 rebase

任何高质量协同进化系统都不能把“不断修改”误当成“不断进步”。

---

## 结语

第二语言认证币如果沿这套方向推进，其长期上限不应被理解成“AI 每章生成一张好看的币图”，也不应被理解成“程序每章生成一个结构正确的 3D 圆片”。

真正有潜力形成项目独有品质的，是一条更严格但也更开放的路线：

> **AI 负责不断提出具有艺术价值的视觉假设；3D 负责把这些假设转化为真实、连续、可绕看、可验证的器物；材质系统负责让几何通过真实表面光学而不是贴图高光获得收藏质感；碎裂等复杂事件建立可追溯的结构来源；数字特效只在静息币章已经成立之后出现；Codex 在两个表示之间持续翻译、反证和内部淘汰；最终由用户在少量成熟完整候选之间提供真正有价值的审美偏好。**

这条路线的目标不是让 AI 更“听话”，也不是让模型更“物理正确”，而是让**设计、建模、材质、数字媒介与人的审美判断形成一个不相互替代、而能相互纠错的生产系统**。

如果做到这一点，认证币才有可能长期保持统一收藏品质，同时允许每一枚币拥有真正独立的设计上限。
