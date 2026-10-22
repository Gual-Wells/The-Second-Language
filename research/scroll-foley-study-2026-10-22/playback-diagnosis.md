# v41 卷轴拟音播放诊断

2026-10-22；独立只读复核。用户反馈为“节奏和动作对不上，声音也很劣质”。本记录没有将信号测量或代码检查当作听审；未宣称素材听感合格。本次仅新增本文件，不改生产声音。

## 已核代码与录音

- `web/labs/certification-reader/sound.js::_performance()`：将全局纸／扣进度映射为录音offset；速度归零即结束，后续重新定位；允许drift重定位。
- `material-motion.js::materialMotion()`：angle／along／feed／slide的加权变化驱动同一条皮革录音；这是人工运动强度，不是接触力求解。
- `chapter-scroll-v17/keeper-motion.js::MaterialPath.sample()`、`chapter-scroll-runtime/motion.js::Motion`：扣具phase与5.6秒smoothstep动画。
- `scripts/build-scroll-performances.py`及v41 WAV：固定选段、处理及真实字节。纸张作者素材为干竹叶替代拟音，皮革源为拉伸；来源标题不能证明适配当前动作。

## 1. 默认动作已重拼皮革表演

用真实MaterialPath、5.6秒smoothstep、60Hz帧序列驱动现有SoundDirector；用记录start／stop的无声节点替代WebAudio节点。它复核代码的源区间与时间，不测设备声音延迟，也不是听审。

| 开卷启动时间（秒） | 实际播放的皮革原片区间（秒） |
| --- | --- |
| 0.083 | 0.004–1.237 |
| 1.350 | 0.833–1.483 |
| 2.117 | 1.825–2.058 |

原片约404ms被重复，约342ms被跳过。along／feed／slide阶段之间的自然停顿使target归零并重启；因此“只有异常慢拖才重定位”的描述不充分。rate=1与loop=false不等于保留整段自然表演。

同一皮革拉伸录音还承担弯折卸力、带尾穿框、皮扣滑过纸面，缺少行为和接触材质区分。

## 2. 文件开头未对齐可听瞬态

对最终v41 WAV按10ms窗计算RMS；“明显能量”取该文件最强窗RMS的10%，不是人耳阈值；“主峰”是最强能量窗，不自动等价于应该对齐的物理撞击。

| 片段 | 首个明显能量（片内秒） | 最强窗（片内秒） |
| --- | ---: | ---: |
| buckle-park | 0.040 | 0.110 |
| buckle-seat | 0.060 | 0.290 |
| paper-open | 0.230 | 0.900 |
| paper-close | 0.400 | 0.470 |

现有停针阈值是pin越过−1.16，正常开卷约2.069秒触发；以文件起点播放，最强窗落在约2.179秒。复扣阈值r≤.012，合卷约5.373秒触发；最强窗落在约5.663秒，已晚于5.6秒动画结束。纸段也有明显首声等待。

应逐条选出真实动作瞬态，记录onset／impactAnchor并对齐；不能机械把RMS最大值当作接触，也不能把开始播放当成接触已对齐。

## 3. 现有机构的编排时间轴

正常帧率、完整5.6秒动画；r=globalProgress/.4。数值用于编排检查，运行以实际机构phase为准。针角／r阈值仍是工程代理，须配对应姿态画面确认接触，并非已求解的碰撞力。

| 开卷阶段 | r范围 | 时间（秒） |
| --- | --- | --- |
| 卸力／弯折 | 0–.18 | 0–0.9193 |
| 退孔 | .18–.36 | 0.9193–1.3381 |
| 退带尾 | .36–.72 | 1.3381–1.9856 |
| 收针 | .72–.79 | 1.9856–2.0984 |
| 皮扣滑离纸卷 | .79–.94 | 2.0984–2.3327 |
| 空中移离，应静音 | .94–1 | 2.3327–2.4244 |
| 展纸 | 扣具离场后 | 2.4244–5.6000 |

合卷：纸0–3.1756秒；空中移回3.1756–3.2673秒；滑回3.2673–3.5016秒；抬针3.5016–3.6144秒；穿回带尾3.6144–4.2619秒；对孔4.2619–4.6807秒；回落扣紧4.6807–5.6000秒。不得用倒放开卷声音替代这些行为。

## 4. 推荐的有限声轨方案

五类cue足够：皮革曲挠、带尾穿框、皮纸滑动、针框接触、纸卷开合。每条保存source／cut／direction／onset／impactAnchor／gain／phase；必要时少量同材质变体。金属不配弹簧锁、不作夸张铃响；空中移动不配风声。是否合适仍须结合画面听审。

- **自动开合**：进入真实phase时只触发一次匹配长度的表演；取消globalProgress×duration与drift-resync。优先离线选段／编排，不需要实时伸缩。接触素材裁到正确瞬态，允许短余响。
- **不预排完整墙钟5.6秒**：现有Motion按实际呈现帧计时并限制长帧推进；一次预排全声轨会在卡帧时先跑完。按机构phase触发，必要时仅短前瞻调度。
- **手动拖动**：维护phase、方向、累计行程、lastMovedAt及一条摩擦voice即可。按足够行程和最短间隔触发约150–250ms自然片段；保持原速，不每帧seek，当前片段尚未到续接点不重触发。
- **停手保护**：每stroke一个idle定时器（可从90ms试调）；运动帧仅更新lastMovedAt。定时器到期若输入仍新鲜则约剩余等待，否则约30ms淡出并停止。JS阻塞时短片段本身也会在约250ms内结束。金属接触余响不跟摩擦voice一起被切断；隐藏／退出仍清理。
- 上述时长是候选调音参数，不是已验收的声学标准。不引入新引擎、网络生成或常驻任务。

## 5. 成熟资源及适用边界

- [Godot动画音轨](https://docs.godotengine.org/en/stable/tutorials/animation/animation_track_types.html#audio-playback-track)：借用音频波形／方法事件直接关联动画位置的工作流，无需引入Godot。
- [Howler.js](https://github.com/goldfire/howler.js#documentation)：MIT；命名sprite、每次播放独立ID、缓存／淡化／移动端解锁已成熟。本项目已有多数能力，换库本身不能修好素材与编排。
- [IRCAM时间调度教程](https://ircam-ismm.github.io/webaudio-tutorials/scheduling/timing-and-scheduling.html)、[sc-scheduling](https://github.com/ircam-ismm/sc-scheduling)：音频时钟与短lookahead；后者BSD-3-Clause。可在真有调度需求时使用，不必为几条cue引入完整框架。
- [IRCAM颗粒教程](https://ircam-ismm.github.io/webaudio-tutorials/scheduling/granular-synthesis.html)、[Tone GrainPlayer](https://tonejs.github.io/docs/15.1.22/classes/GrainPlayer.html)：窗口与重叠颗粒是成熟备选，但不会自动改善坏录音，不能默认拿来处理清楚的金属瞬态。
- [SoundTouchJS](https://github.com/cutterbl/SoundTouchJS)：已有AudioWorklet及离线变速；当前主线MPL-2.0，旧LGPL信息不适用当前版本。默认固定动画不需要增加实时DSP与检验负担。

## 6. 下一轮应交付的证据

独立候选页先展示无音乐开卷、无音乐合卷、慢拖／停手／反向，再与音乐合听；同时保留实际扣针、带尾、纸卷的同步视频与cue日志。先审核材质，再审核接触／节奏。源许可、无削波、能量非零、暂停清理都只能证明相应技术属性，不能代替听感认可。候选未经审核不直接包装为生产听感修复成功。
