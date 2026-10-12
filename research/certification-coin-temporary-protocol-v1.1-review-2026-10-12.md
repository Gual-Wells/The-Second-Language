# 纪念币临时约束协议 v1.1 全局复核

日期：2026-10-12

本文件记录对 `protocol/COIN_CRAFT_TEMPORARY.md` v1.0 的全局复核、外部研究依据和 v1.1 的关键修正。重点不是增加流程，而是修正“C/M从一开始完全对称”这一过度简化。

## 1. 核心修正：初始化非对称，迭代才双向

v1.0 说“C 与 M 可以轮流领先”，这在已有同谱系设计承载模型以后成立，但不适用于从零开始的新艺术对象。

更准确的关系是：

`K + 项目资源/参考 → C-anchor → M0-design → C1 ↔ M1 ↔ ...`

C-anchor 不需要是最终定稿，但必须已经完整表达主体、构图、主剪影、视觉重心、关键动作、大尺度比例和主要形面语言，足以给第一份真正承载审美决定的3D提供视觉依据。

Autodesk Maya官方教程明确把2D drawing/sketch/photo用于定义3D模型的silhouette和character lines：
https://help.autodesk.com/cloudhelp/2020/ENU/Maya-GettingStarted/files/GUID-297946F9-44E6-4FA8-B47D-7C6066C8F272.htm

Gnomon多个专业工作流同样采用“2D ideation/initial sketch → 3D blockout → 3D反馈 → 2D refine/paintover”的循环：
- https://thegnomonworkshop.com/workshops/visual-development-for-environments
- https://www.thegnomonworkshop.com/workshops/design-futuristic-architecture-using-blender
- https://thegnomonworkshop.com/blog/modeling-a-stylized-character-for-games/

DreamCraft3D也不是从空白3D开始对称优化，而是先用2D reference image指导geometry sculpting，之后才进入3D scene与3D-aware diffusion prior的alternating optimization：
https://arxiv.org/abs/2310.16818

因此协议必须区分“第一份艺术模型从哪里来”和“有模型以后怎样协同”。

## 2. M-tech 与 M-design

技术脚手架不应取得审美权威。

M-tech包括空白币坯、圆片、尺度/相机框、材质球、boolean/碎裂测试件、与作品无关的校准模型，以及仅按文字自由拼出的粗糙blockout。

M-design则必须来自：
- 当前/历史认可C的转译、生成或参考建模；
- 同一作品谱系的Canonical M；
- 真实扫描/实体模型等本身已经承载设计事实的来源。

M-tech可以验证技术，但默认不能作为下一轮AI设计的审美条件。否则程序默认几何会成为“错误祖先”。

## 3. 防止另一端的固着：第一张AI图也不自动成为真理

Design fixation研究说明，设计者会持续复制已有example/prototype特征，并且常低估这种影响：
- https://www.designsociety.org/publication/28853/reducing_and_perceiving_design_fixation_an_initial_results_from_an_nsf-sponsored_workshop
- https://www.designsociety.org/publication/39836/design_fixation_to_examples_a_study_on_the_time_decay_of_fixation

因此C-first不等于first-image-wins。

在新题材不确定性很高时，可先探索少量完整作品级Concept Set，再选择C-anchor。Lean的Set-Based Concurrent Engineering同样主张在证据不足时保持多个可行方案，按分析和测试逐步淘汰：
https://www.lean.org/lexicon-terms/set-based-concurrent-engineering/

## 4. Authority Freshness

权威不是永久的。

如果K-fixed、主体身份或核心构图发生重大变化，旧M-design对受影响部分进入stale状态。它仍可提供尺度、技术和历史对比，但不能继续主导新审美方向；必要时对该设计对象重新进行C-first bootstrap。

Bootstrap按设计对象判断，而不是按“文件里有没有mesh”判断。已有币坯或统一背面不代表全新的正面龙头已有设计承载模型。

## 5. K-fixed / K-open

Design Kernel如果把当前所有细节都冻结，也会成为新的形式主义来源。

v1.1只允许真正跨迭代保护的事实进入K-fixed：
- 用户明确要求；
- 已采用的关键优点；
- 系列级硬要求；
- 作品身份。

尚有设计分歧的内容属于K-open或候选状态，不应提前升级成硬约束。

## 6. 局部编辑增加 Collateral Drift Rule

局部可以mask、inpaint、sculpt、boolean、remesh，但编辑授权只覆盖目标变化。

如果同时改变未授权区域、已认可主形、构图重心、比例或材质身份，默认视为collateral drift，只有重新审查并主动接受后才能保留。

这与localized editing研究的目标一致：修改目标区域，同时尽量保持其余内容稳定。
- LIME, WACV 2025:
  https://openaccess.thecvf.com/content/WACV2025/html/Simsar_LIME_Localized_Image_Editing_via_Attention_Regularization_in_Diffusion_Models_WACV_2025_paper.html
- Layered Diffusion Brushes, ICCV 2025:
  https://openaccess.thecvf.com/content/ICCV2025/html/Gholami_Streamlining_Image_Editing_with_Layered_Diffusion_Brushes_ICCV_2025_paper.html

## 7. 谱系与非破坏式资产

OpenUSD VariantSets支持把多个资产变体保留在同一组合体系中并非破坏切换；Blender Modifier Stack同样体现了非破坏修改思想：
- https://openusd.org/release/intro.html
- https://docs.blender.org/manual/en/latest/modeling/modifiers/introduction.html

NIST对Digital Thread的研究强调跨设计、制造和检查的数据关联与traceability：
https://www.nist.gov/publications/testing-digital-thread-support-model-based-manufacturing-and-inspection

项目不必强制使用USD或MBSE，但应维持：
`parent → delta → candidate → canonical`
而不是靠文件名和聊天记忆猜来源。

## 8. 用户偏好回路继续保留，但不做固定末期投票

Preferential Bayesian Optimization说明，当目标无法可靠写成标量时，可以通过pairwise preference优化潜在效用：
https://proceedings.mlr.press/v70/gonzalez17a.html

2026年的异方差偏好研究进一步说明，不同设计比较的用户置信度本身会变化：
https://proceedings.mlr.press/v327/sinaga26a.html

因此协议继续区分：
- 解释性介入：继续自动猜测会造成高代价漂移时尽早问；
- 审美性介入：多个成熟完整候选之间做少量高价值比较。

允许“难分”“都不行”“A的X+B的Y”，不强制高精度打分。

## 9. v1.1 相比 v1.0 的全局改进

新增或明确：
1. Concept-first Bootstrap。
2. M-tech / M-design分离。
3. C-anchor不是最终稿，也不是第一张AI图自动胜出。
4. 按设计对象判断是否已有有效M。
5. Authority Freshness / stale模型。
6. K-fixed / K-open。
7. Collateral Drift Rule。
8. 下游可以并行研究，但不能反向替上游验收。
9. 明确问题收敛条件，而不是靠阶段打勾。

保留v1.0已经正确的：
- 完整母体上的局部编辑；
- C/M按事实分配权威；
- set-based完整候选；
- 风险触发成熟方案研究；
- Human Preference Gate；
- Canonical rebase；
- 材质、碎片和Digital Aura的质量底线；
- 当前作品状态与通用方法协议分离。

## 10. 最终模型

新艺术对象：

`K-fixed + K-open + 项目资源/参考 → [必要时Concept Set] → C-anchor → M0-design`

有有效模型以后：

`C ↔ M-design`

并行但从属：

`F / A`

局部修改：

`Canonical → delta candidate → full-asset review → accept/reject → rebase`

M-tech始终在艺术权威链之外。

这既避免“从零低质量Codex建模成为第一依据”的工程谬误，也避免回到“AI图必须最终冻结后3D才能开始”的另一种线性误区。
