# 首次卷展、皮扣与雾染维护

2026-10-18；基线`72650010114ac45f63b8b486ad455de67784474d`。用户初步肯定第五章后，要求说明系列保留/章节变化并核查雾染、皮扣和首次开合卡顿。本轮只维护v12/v13运行体验，不改文书、图案、排版、时间或纪念资产身份，不启用正式认证。

## 保持与变化

共同保持：羊皮质感语言、Aboensis书写、长方藏记、Gual Wells归属与真实记录格式、连续卷展、残余纸边卷曲、原皮环和刚性铜扣、屏外自然供雾。第五章原有专门设计：芦管/折页/橡实的小画、双节题辞、横向图像及居中排印、尾记重排，以及既有羊皮母材的镜像变体。

## 查证的问题

1. 旧setup在环境、normal/roughness异步加载完成前就启用操作，且resize可能先绘制一次未完成的材料，后续再换着色配置。
2. 皮扣的hoop在`opacity===1`与淡出期间切换opaque/transparent；新可见材料、不同透明路径和深度程序有首次使用编译成本。程序原本没有显式预热。实际本机GPU对照中，首次开新增2个程序，首次合新增6个；软件渲染的早期诊断中首次合新增5个。两种环境不得混为一个统计。
3. 原动画按`performance.now()-start`推进。渲染停顿后会直接跳到墙上时间对应位置；原本正确的松扣/退出轨迹因缺帧被跳过，不应为修正时序重画皮扣或加入弹簧。
4. canvas中途轻触先在pointerdown清掉目标，pointerup再按当前位置判断方向；开卷前半段的轻触可能继续开，违背途中反向语义。
5. 雾染每显示帧执行一次流体/供雾，多次全屏写入不必跟随纸面最高刷新率。原纸面已有dirty控制，静止时不会重复画纸；没有把这一点误报成旧版缺陷。

## 修改

- 共用运行模块`web/labs/chapter-scroll-runtime/scroll-object.js`等待完整材料，预载纹理、异步编译并对闭合/松环/淡出/展开做真实隐藏绘制，准备完成才允许交互。图形上下文恢复后同样准备。预热成本仍存在，显示在藏卷准备阶段。
- 皮扣仍用v8模型/形态与路径、真实深度测试、刚性金属及完全退出后的转角。所有阶段采用同一透明渲染配置，避免动作期间切换程序路径。
- `motion.js`对单帧计入时间上限50ms。长停顿不会消费完整动作；极低帧率下会延长播放，不宣称通过计时修正可以提高硬件算力。后台恢复排除隐藏时长；canvas途中轻触保存原目标以正确反向。
- 雾染沿用v6空间/动力参数和原Pavel Fluid，独立最高30Hz预算，保留余量避免帧率取整造成不规则更新。染料分辨率256、显示最高DPR1，仅作用于柔和雾层；纸张分辨率、字体、网格与阴影不降级。没有新增喷口、动作染料、夸张推力或将雾关停。
- 既有vendor新增两个可选配置；旧页不传配置时仍为512和最高DPR2。MIT许可继续保留，无新动效框架、付费素材或生成调用。

## 对照及验收边界

`node scripts/profile-scroll-motion.mjs baseline 3`在本地按固定commit回放旧app/vendor；`after 3`运行当前版本。相同402×874、DPR3、Intel UHD/D3D11硬件WebGL，分别从闭卷和展开冷启动，再重复反向。具体数据在baseline-dpr3.json及after-dpr3.json；早期baseline.json是SwiftShader诊断，不能混用于硬件帧率比较。

硬件基线首次开/合的最大进度跳步约22.5%/11.2%；修复后约1.0%/1.2%；首次动作不再新增着色程序。重复播放原本已接近稳定，所以只看重播不足以验证。记录帧间隔与预热成本，不把一次本机测量说成iPhone保证。实际本机首次冷准备约8秒，后续上下文复用可短至约0.8至3秒；这是加载阶段的成本，不能将它描述为消失或作出iPhone耗时承诺。

`node scripts/verify-scroll-runtime.mjs [immutable-origin]`实际核对两章完整身份、同GPU下改动前后纸面PNG一致、持续雾染且纸面不空转、途中轻触反向、预热程序数量稳定、真实WebGL上下文丢失/恢复后重新预热、细看、首章印记切换和减少动态。原始样品PNG是软件渲染生成，不能拿它的字节摘要与另一GPU的Canvas2D光栅结果直接比较；本验证将固定commit旧程序和新版放在同一后端比较，文书原件/资产/内容摘要保持不变。

实际逐阶段画面见local/live-keeper-frames.png，雾染见local/live-v13-mist.png。仅在真实屏幕下才能最终判断雾层柔和度、取环观感和iPhone冷启动帧率，仍需用户反馈。

## 成熟方案依据

- [Three WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html)：compileAsync要求环境/照明先就绪，initTexture用于提前准备首次纹理使用；本项目调用已有接口，未换渲染框架。
- [MDN WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)：编译/上传引起的同步等待和高分辨率绘制成本；保留前端渐进降级。
- [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)：刷新驱动和后台行为。计时约束由项目根据动作完整性选择，不冒称规范强制50ms。

本轮无新增模型/生图、GPU云服务或订阅。余额/容量仍按原任务收尾更新；预览发布保持独立scroll-lab，不改变正式认证状态。

## 实际发布

线上版本：<https://3cf5906a.the-second-language.pages.dev/labs/chapter-scroll-v13/>；第一章为同域`/labs/chapter-scroll-v12/`。独立预览别名仍为scroll-lab.the-second-language.pages.dev。live-verification.json已确认两章实际交互与运行资源字节；asset-manifest.json记录本轮运行资源和保持的艺术资源摘要。v12/v13原目录的deployment/manifest继续记录最初样品发布，不把历史记录改写成这一轮的测量。
