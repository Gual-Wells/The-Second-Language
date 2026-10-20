# 雾染：开合响应、区域差异与过密涡流

2026-10-20。基线`7cb2b46`，分支`codex/medieval-scroll-lab-2026-10-16`，开始前干净。独立试样`/labs/chapter-scroll-v20/`。本轮只维护雾染，v19纸张、文书、皮扣原模型、解扣路径与多道做旧保持。

## 已确认的回退及局限

当前v19仍直接导入v17的雾层。v18/v19没有进一步削弱流场，问题集中在v14→v17修复时的取舍，而非每轮都叠加衰减。

| 项目 | v14 | v17—v19 | 影响 |
| --- | --- | --- | --- |
| 对象速度输入限幅 | ±0.6 | ±0.18 | 实际运动尚未进入求解器就可能被削弱 |
| 纸缘耦合系数 | 5.5 | 1.25 | 仅比较最大输入时上限约降至原来的1/14.7；这不是实屏强度的直接测量 |
| 皮扣耦合系数 | 5.0 | 1.5 | 相同上限比较约降至原来的1/11.1 |
| 速度滤波 | 无 | 120ms | 短暂动作更容易被抹平 |
| 环境旋度驱动倍率 | 1.15 | 2.6 | 动作相对环境更不明显 |

v17阻止NaN进入求解器是必要修复：错误的皮扣半径字段曾使闭卷阶段紊乱。本轮保留正确投影、有限值检查、屏外处理、进度跳变保护及闭纸不充当两条发射带的限制，没有回滚到不安全的v14输入。

旧`flow.js`将同一三频噪声旋度施加到全场。细频噪声振幅虽低，求导会放大频率的贡献，细小涡动并不弱。八个随机区域只改变雾的浓淡，没有各自的速度行为。另有涡量补偿持续强化卷动，持续源项又把空间噪声写进浓度。以上共同造成“复杂但到处相似”的观感。全局速度上限还可能压平速度差异；没有GPU读回证明旧场有多少像素实际触顶，因此这一项仅列为可能因素。

## 资源检查与方法选择

实际检查并继续运行现有MIT流体核心，而非再做一个求解器；同时阅读成熟方法后只替换场景驱动层。

- [原项目及许可](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation)：项目已有其压力投影、平流和涡量补偿实现。
- [Bridson等人的Curl-Noise原论文](https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph2007-curlnoise.pdf)：空间调制放在流函数中，再求旋度；可组合不同尺度、局部范围及移动对象。这里采用这项构造方法，没有宣称实现论文的任意固体边界。
- [GPU Gems 38](https://developer.nvidia.com/gpugems/gpugems/part-vi-beyond-triangles/chapter-38-fast-fluid-dynamics-simulation-gpu)：核对求解步骤与旋涡补偿。
- [GPU Gems 3第30章](https://developer.nvidia.com/gpugems/gpugems3/part-v-physics-simulation/chapter-30-real-time-simulation-and-rendering-3d-fluids)：半拉格朗日平流的数值平滑、移动物体和浓度输运。本轮没有贸然扩成三维流体或加入额外平流通道。

## 实际调整

1. **流动主体**：缓慢转向的宽域漂移叠加四个狭长区域，各区分别有生命周期、方向、半径和两种不同节奏的速度起伏。存在相对安静的区域，也有较快的经过、拉伸和换向；没有固定左向右入口。
2. **局部卷动**：较细噪声只在活动区域内少量出现；涡量补偿从1.8降至0.38。试制时发现圆形局部区域仍容易自带一对涡旋，最后改为沿运动方向拉长的雾带，并加入宽域输运。不是把全屏小涡换成全屏大圆涡。
3. **浓淡与流动解耦**：八处源区独立交错生长、漂移和消弭；源项保留多尺度不规则密度，但不再直接复制速度噪声。降低对现有浓度的覆盖，让开合留下的通道、回卷和尾流可持续一段时间。
4. **动作响应**：纸缘5.8、皮扣4.6，输入限幅±0.32，滤波65ms。依然跟随实际投影速度，而非在固定两端周期喷雾；停止动作后力逐渐归零。数值是此版艺术调校参数，不是认证协议的硬标准。
5. **时间步进**：维持30Hz雾模拟，保留不足一步的余量，最多追赶三步；后台恢复和跳变重置运动采样，避免积压造成巨力。纸面仍按屏幕刷新调度。速度网格96、染料512与上一版一致，没有靠降低画质换性能。

第一轮过于柔软、接近大块模糊背景，未采用；随后恢复密度细节。第二轮仍过于成团卷动，再调整为狭长流动区域。最终对照保存在本目录，网页样品只交付最后一轮。

## 证据及其边界

`scripts/inspect-scroll-v20-mist.mjs`同时实际运行三份GPU雾场：v19、v20、有相同种子与时间但关闭对象耦合的v20。后两份在动作前逐像素一致；之后的差异来自动作，不是两份随机天气不同。输入为可重复的合成开合轨迹，不能冒充真实卷轴的几何检查，也不能以差异大小自动认定艺术通过。

- `comparison-06s.png`：静置；`comparison-10s.png`/`comparison-22s.png`：开启/收起；`comparison-36s.png`：动作结束后的环境。
- `field-comparison.json`：原始逐秒状态及像素差异。全部动作输入有限，无浏览器脚本异常。
- `actual-*.png`：实际v20卷轴在闭卷、开合、展开及结束后的画面，不是雾场测试台代替实装。
- `verification.json`：完整卷轴必要回归；`live-verification.json`为部署后的同项核对（仅实际生成后才有效）。

仍是单层二维屏幕雾染，不能产生真实三维体积遮挡、湿度凝结或任意物体流固耦合。这一层的自然感最终由运动中的实屏观感判断，不能由函数数量、随机数、像素差异或帧率证明。当前浏览器证据来自本机Chromium模拟402×874/DPR3，不是iPhone Safari真机测量。

## 构建与恢复

```powershell
& 'C:/Users/huawei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' scripts/build-scroll-v20.mjs
& 'C:/Users/huawei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' scripts/inspect-scroll-v20-mist.mjs
$env:SCROLL_SAMPLE_VERSION='20'
$env:SCROLL_EVIDENCE_DIR='research/scroll-mist-v20-2026-10-20'
& 'C:/Users/huawei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' scripts/verify-scroll-v17.mjs
```

v20复用v19材质文件。`v19/finishing.js`的资源URL改为显式指向v19，避免被新bundle错误解析成v20/assets；v19原bundle保留，旧样品输出不变。验证脚本补建自身D盘临时目录，避免新版本首次验证因目录不存在而启动失败。

本轮无收费调用、新订阅、素材采购或云端训练。发布使用当前提交的Git archive构造白名单静态包，不复制其他任务未提交的页面，不部署到main生产分支。
