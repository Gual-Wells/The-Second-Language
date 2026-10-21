# 卷轴动作声音纠正研究（2026-10-22）

范围：只读检查动作、现有录音、可再分发录音来源，提供本轮修复的声音设计依据与原件；不修改宿主、声音引擎或建模，不购买，不发布。主线在研究期间同时施工，以下“原实现”指本轮纠正前的实现，不能当作修复后源码的状态说明。

## 结论与可信度

- VERIFIED：原实现的 `SoundDirector.motion()` 没有使用 viewer 已提供的 `phase`、`paperProgress`。它按全局进度阈值播放短皮革、布、书本声，纸声按累计进度循环轮替三条翻页录音；不是依据真实皮扣动作进行的材料拟音。许可、文件可解码、音量合格不能证明艺术适配合格。
- VERIFIED：真实皮扣动画已有明确的卸力、脱孔、抽尾、停针、移开与离场阶段，羊皮纸在全局进度 `.40` 后才展开。没有必要增加碰撞求解器来取得这些已有的动作信号。
- 推荐：仅保留一层皮革连续摩擦、一层纸卷摩擦，按实际动作坐标速度驱动；金属声只保留少量明确接触点。停止把翻书、放书声当作卷轴连续摩擦。无运动时不应出声。
- VERIFIED：取得作者发布的真正“展开羊皮卷”录音，以及皮革拉伸录音的公开 HQ MP3 预听副本，来源、原 bytes、许可与 SHA 已留存。
- 未听审：当前工具可读取录音、解码、统计波形与能量，但没有可用的人类听觉判断或听审工具。因此本报告不声称候选听感已经通过；波形均匀也不代表音色正确、没有人声或噪声。

## 一、资源选择：先使用真实材料与动作

### A. 优先纸卷录音：Spell Scroll

- 作者：**spookymodem**。
- 作者发布页：<https://lpc.opengameart.org/content/spell-scroll>。
- 原文件：<https://lpc.opengameart.org/sites/default/files/Unrolling%20Parchment.wav>。
- 作者说明动作：展开魔法卷轴；标题为 `Spell Scroll`，文件名 `Unrolling Parchment.wav`。
- 许可：[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)。允许再分发与改编，必须著录作者、作品名、来源、许可及衍生处理，不意味着整个项目必须改用相同许可。
- 持久原件：`web/labs/certification-reader/assets/audio-sources/material-recordings/unrolling-parchment.wav`，555,232 bytes。
- SHA-256：`0ecdba822baa623f478a0131c20eaf175e9494f8fb534d666427685813c9e54f`。
- 实际 WAV：44,100 Hz、16-bit PCM、stereo，解码时长 **3.147347 秒**。
- 单声道 22,050 Hz 分析：peak `.113342`，RMS `.008944`（约 `-40.97 dBFS`）。这是技术分析版本的数值，不可直接与声卡实听响度等同。
- 原始双声道峰值约 `-18.2 dBFS`，没有接近满幅的原始响度，不能对所有素材应用相同 boost 后宣称平衡。

**100 毫秒能量粗注（只说明信号，不替代听审）：**

| 原录音秒数 | 实测信号特征 | 衍生处理注意 |
| --- | --- | --- |
| 0–.50 | 低电平，约 -63 至 -81 dBFS RMS | 不宜把此段空白当成动作起声 |
| .50–1.70 | 第一段活动区，峰段约 1.3–1.5 | 可抽取材料床，须保留自然包络；不是已证实平稳 loop |
| 1.70–1.80 | 明显低谷 | 不要误作连续摩擦的中断感 |
| 1.80–2.70 | 第二段活动区，有自然起伏 | 可作为另一动作段候选，不能因方向反转就倒放原声音 |
| 2.80–尾 | 基本低电平或静音 | 不宜整文件生硬重复导致周期性停顿 |

它比“bookFlip”更符合作者声明的目标动作，但不能仅凭名称保证厚古羊皮纸的最终音色；小样应克制混入，允许用户试听后再定音色。

### B. 优先皮革录音：Leather Stretched

- 作者：**altfuture**。
- 作者发布页：<https://freesound.org/people/altfuture/sounds/174638/>。
- 许可：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)，作者页明示可复制、修改与分发。
- 本轮取得的是作者页实际公开的 HQ 预听文件：<https://cdn.freesound.org/previews/174/174638_3015949-hq.mp3>。
- 持久原件：`web/labs/certification-reader/assets/audio-sources/material-recordings/altfuture-leather-stretched-hq-preview.mp3`，612,480 bytes。
- SHA-256：`aae6b357aaf6dc2f4fcc70724e26f0d59c082ff4b84f4d2ca4c7edc965a9616f`。
- 预听文件实际为 **48 kHz stereo MP3**，解码有效时长 **24.998005 秒**。容器报告约 25.03 秒，包含 MP3 的封装/解码延迟。
- **不可混淆**：作者标注的 96 kHz/24-bit、13.7 MB WAV 原件需要登录下载，本轮没有取得该 WAV，不能把预听版著录为无损原录音。
- 22,050 Hz 单声道分析 RMS 约 `-35.48 dBFS`，peak `.629639`。

**100 毫秒能量粗注：**

- `.50–.90 秒`有明显强能量段，最高短时 RMS 约 `-17.7 dBFS`；`7.50 秒`与`24.70 秒`也有突峰。若直接 loop 大段会产生额外“碰撞/拉响”节拍。
- `14.70–16.10 秒`能量相对连贯，大约 `-46 至 -38.6 dBFS`，可作为较轻连续摩擦床的候选区间；这是能量依据，不是对其音色的听审通过。
- `3.50–5.00 秒`也可作备选，但能量变化较大。
- 衍生应剪出不带孤立强冲击的片段，淡化接缝，保留来源与处理记录。原 MP3 ReplayGain 不能当成应用最终播放增益的真值。

### C. 备用纸张：Luckius Various Paper Sound Effects

- 作者发布页：<https://opengameart.org/content/various-paper-sound-effects>，作者 **Luckius**，CC0。
- 原 ZIP：<https://opengameart.org/sites/default/files/sounds_6.zip>，974,191 bytes；SHA-256 `aa1889414310c7cfdd8dc291c19d4e4fc21ec987e9238b0d961fb72449c263a4`。
- 缓存：`.cache/scroll-reader-correction-2026-10-22/audio/luckius-paper-source.zip`。
- 作者说明为游戏地图开合录音，包含纸张揉压、撕裂及其他动作。撕裂与揉成团并不对应本项目健康卷轴，不应为了“古旧”增加毁损动作声。
- 四条 `Paper Sound` 的实际 WAV 解码时长约 `.488/.546/.697/2.589 秒`。其中第四条最长且能量较均匀，可作备用；不是“作者确认古羊皮纸”的素材。四条已在同缓存提取，原 ZIP 保留，未入运行资产。

### D. 已有 Kenney：缩减而不是全部换名继续叠加

来源原件已在 `web/labs/certification-reader/assets/audio-sources/kenney-rpg-audio.zip`，许可文件 `KENNEY_LICENSE.txt`，[官方发布页](https://kenney.nl/assets/rpg-audio)。

- 可保留一条经过低音量处理的 `metalClick` 供明确针框接触候选，不代表已经实听确认其大小/材质完全匹配。当前扣具无独立弹簧锁，不能默认把 `metalLatch` 的闭锁语义塞给它。
- `beltHandle`、`handleSmallLeather` 为约 .3–.5 秒短操作声，`clothBelt` 约 .72 秒；它们可以用于将来听审对照，无法单靠文件名证明它们可循环成真实皮革折伸。
- 未使用的 `creak1/2/3` 已从同一原 ZIP 提取，时长约 `.661/.830/.338 秒`。技术上完整可解码；不能因叫 creak 就认定是皮革，也不应未经听审全部叠入。
- `bookOpen/Close`、`bookPlace` 是短起落/放置语义，`bookFlip` 是翻页语义。本轮不应继续用于卷纸连续摩擦或正常展开末端的“咚”声。

## 二、绑定真实机制，而不是全局进度配音

源码证据：`web/labs/chapter-scroll-v17/keeper-motion.js::MaterialPath.sample`、`keeper.js::update/snapshot`，v19 继承 v17，主要增加材质做旧，未另改皮扣机械分段。

`RELEASE_END=.40`；皮扣本地进度 `r=clamp(globalProgress/.40,0,1)`。

| 本地 r / 全局 progress | 已实现动作 | 最小声音设计 |
| --- | --- | --- |
| 0–.18 / 0–.072 | 卸孔受力，angle 上升至 .55 rad | 很轻的皮革弯折摩擦，跟随 `abs(dAngle/dt)`，不必打金属点 |
| .18–.36 / .072–.144 | 皮尾沿孔释放，along 至 10 mm（r=.34 完成） | 皮革层跟随 `abs(dAlong/dt)`；没有真实接触求解，不虚构一次“弹锁” |
| .36–.72 / .144–.288 | tail withdrawal，feed 从 0 至 1 | 皮革主段，跟随 `abs(dFeed/dt)`，可比卸力段略强 |
| .72–.79 / .288–.316 | 针绕铰链转至停针，pin 的二段旋转结束于 r=.78 | 轻微针框接触只在接近真实停针终点时一次；不是进入 phase 就敲一次 |
| .79–.94 / .316–.376 | 松开的环带移开，slide 从 0 至 1 | 仅在带子仍滑过卷面时留一层小摩擦，跟随 `abs(dSlide/dt)` |
| .94–1 / .376–.40 | 整件离场 | 不给空中平移加皮革噪声/风声 |
| 1 / .40–1 | 皮扣已移开，羊皮纸展开 | 纸卷材料层跟随 `abs(dPaperProgress/dt)`；无翻页、放书脉冲 |

收起反向执行相同机械分段，用同类真实材料录音，不倒放一条展开录音冒充物理。针复位只在接近 fastened 终点时轻触。反复拖动时使用阶段武装/离开阈值的回滞或最小运动行程，防止在同一接触点前后抖动连击。

**真实信号与推导边界：**当前机制是经过设计的材料曲线路径与刚性针，不是接触力求解器。`pin/angle/along/feed/slide` 是真实渲染使用的动画参数；“停针触框”声音是基于该几何动作的设计标记，不宣称物理碰撞测得的力或声音。

viewer 已有 `paperProgress` 与 `phase`。最小补充是把 closure snapshot 的少量标量 `r,phase,pin,angle,along,feed,slide,depart,visible` 送给声音；不需要复制骨架顶点、逐顶点碰撞或再造一个声音用机械模型。

## 三、连续声音的成熟适配方法

业界常用参数控制：游戏内的速度/动作量通过响应曲线映射到音量、音高/滤波，连续混合层依据参数区域淡入淡出。可参考 Audiokinetic 官方 [RTPC 曲线](https://www.audiokinetic.com/library/edge/?id=controlling_property_values_using_game_parameters&source=Help) 与 [连续 Blend Container](https://www.audiokinetic.com/en/public-library/2024.1.7_8863/?id=blend_container_property_editor&source=Help)。这里采用相同控制思想即可，没必要给网页安装 Wwise 运行时或增加新服务。

适合本项目的小规模实现：

1. 差分取实际标量速度，先对 dt 和跳转作保护。静态 seek、重载、布局改变不能被当成快速摩擦动作。
2. 通常仅一层材料床在场：皮扣阶段皮革，展开阶段羊皮纸；偶尔加一条短金属接触。不给全部材料各放一条泛音。
3. 速度曲线可用 soft-knee/平方根压缩，避免快速拖动变成巨响。先以纸速约 `.4–.6 单位/秒`、feed 约 `2–3 单位/秒` 作归一化调参起点，并根据实际动画轨迹校准，不写成物理常数。
4. 输出音量变化约 40–70ms attack、80–120ms release；停止、后台、离开、断开交互时立即使目标归零，并停止/过期任何待播放动作。短暂淡出避免点击声，不意味着让动作结束后继续响很久。
5. 变速范围只作轻微材料响应，例如 `.90–1.10`。WebAudio 的 [playbackRate](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/playbackRate) 是重采样速度变化，也会改变音高，不是独立保音高时间伸缩；不要用大幅变速补救不适配录音。
6. 连续片段需去除空白、明显冲击，再做边界交叠或合适循环点。没有经过技术和听感验证的 loop 不宣称无缝；原始展开动作录音也不应无条件整段 loop。
7. 调增益前先看源电平。优先纸声原件比皮革原件 RMS 更低；控制总线 headroom。试听须包括 iPhone 扬声器和耳机，代码中的 `.2` 不等于相同主观响度。

## 四、本轮交付、验收与待确认

- 原始优先录音保存在 `web/labs/certification-reader/assets/audio-sources/material-recordings/`，该目录 `CREDITS.md` 记录作品署名、许可与本轮衍生；作者网页及分析 JSON 在本研究目录 `audio-sources/`。下载时未登录、未购买，没有新增持续成本。此研究子任务未修改运行声音资产或引擎，主任务已据此进行实现，运行状态以主任务最新源码及验证为准。
- `signal-analysis.json` 含原文件 SHA、单声道分析元数据与 100ms RMS；所有条目都标记 `audition: not-listened`。分析转成 22,050 Hz 单声道仅在内存进行，不覆盖源文件。
- 备用 CC0 纸声 ZIP、20条 Kenney 原始候选只在 D 盘任务缓存；没有把无关全部资源打包进入 PWA。
- 作者源页许可已实际读取、源文件 bytes 已下载成功。CC BY 原件及其衍生需在实际发布的 `AUDIO_CREDITS.md` 保留 title/author/source/license/change notice；本研究文件不是发布著录的替代品。
- 最小技术验收：动作参数驱动、不动静音、反向无倒放、接触无连发、隐藏/离开无迟到音、重开不叠实例；不能通过这些测试就声称音色、古旧感或自然度通过。
- 需要后续真实听审的只有明确小集合：纸卷主层、皮革主层与一条针框轻触，分别单独听，再看实物运动听组合。不再让用户在十几种随机音效中替工程排错。

### 归档来源说明

`spell-scroll-author-page.txt`、`leather-stretched-author-page.txt` 是2026-10-22实际作者发布页的可见文字摘存（已移除脚本／属性，不作为原始HTML字节），用于证明当时的作者/许可和公开文件来源。预听 MP3 与无损 WAV 的差异已在上文明确，未冒充取得需登录的原 WAV。
