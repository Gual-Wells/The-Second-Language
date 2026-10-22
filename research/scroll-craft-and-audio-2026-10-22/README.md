# 工艺规程落地与卷轴拟音重制

2026-10-22。开始基线 `c60c58c351567146a4d7ab8a7e05c7f7d772675d`，分支 `codex/project-commemorative`，开始前干净。制作时主线新增当日日课 `e857854e4d25c4a8ae7c19dacf6a9f948dd8d468`；已快进纳入，没有改日课或运行教学任务。本轮不重制纸面，不改制作时刻、哈希、身份、测试／认证后台或音乐。

## 一、工艺从研究记录变为执行规程

新增 [SCROLL_CRAFT](../../protocol/SCROLL_CRAFT.md)，由CHARTER和AGENTS明确引入；CHARTER保留产品、任务及封存职责，规程承担实作，不新增平行业务系统。

实际重读第一章v1→v12的源码级工艺重建和原件索引、历史统一复盘、v19材质及v20雾的制作／失败记录，并核当前纸面、shader、异步材质适配、皮扣材质代码。规程将每道工序的输入、位置依据、通道、产物与返修写清，涵盖：

- 无字皮膜的裁制、卷藏史、接触磨耗、潮线沉积、磨薄和边损的关联设计；不是“无霉、无焦边”几条禁令。
- 独立normal／roughness／几何／字墨／印压，以及真字、吃墨、渗边、肩墨、压力与shader合成。
- v6显示保真与卷膜连续、v17/v19异步覆盖陷阱、v19皮革／铜件完整离线工序、UV和真实纹理编码。
- v20分区雾／动作耦合、关键姿态预热、单独声音工序、作用域检查、定向返修与冻结。

明确排除未沿用的滤镜分支，未编造纸张“几十道程序”。第一章完整制作能力是参考，构图／污斑坐标不是全系列必须复制的模板。第五章纸张及退稿作品没有被追认为合格。通用创作worker、真实颁发与完整母版永久归档仍未因此上线。

## 二、上一版声音为何需要更换

用户已否定v40听感。代码事实是：很短的纸／皮革录音选段经tanh压缩和约10.9／15.2倍增益，等RMS后循环，随速度改变playbackRate。由此存在重复、材料起伏被压平、低频杂音抬升和音高随动作改变的风险。技术播放通过不构成听感通过；本轮不争辩“其实是录音所以不是合成”。旧文件和原著录保留，仅撤出当前声轨。

### 成熟方法与选用范围

[Audiokinetic的项目实践](https://www.audiokinetic.com/ko/blog/reverse-collapse-codename-bakery/)将Foley复用与具体动画时序调校结合；[Bahn的实际Foley系统](https://bahnproductions.com/gameaudio/foley/)区分事件型动作与持续行为。本项目采用这一分工：有限录音表演与明确接触事件，绑定现有实际机构坐标；不为一个网页器物引入Wwise／Unreal，不重造声学求解器。

[Web Audio已发布规范](https://www.w3.org/TR/2021/REC-webaudio-20210617/#dom-audioscheduledsourcenode-stop)允许尚未结束的source用新的stop时间覆盖旧时间；此处据此用音频时钟截止处理停手，不增加常驻轮询。保持原生pitch=1和非循环播放。source结束后不因同一持续动作而反复播放尾巴。

## 三、新录音与加工

| 作者发布源 | 实际取得 | 用途与限制 |
| --- | --- | --- |
| [Vrymaa: Parchment - Unroll](https://freesound.org/people/Vrymaa/sounds/753282/) | 作者公开HQ MP3，543936 bytes，CC0；非原始WAV | 干竹叶模拟古卷修复，非古羊皮实录。两段不同正向表演分别用于展开／卷回，卷回是同材质替代，不假称录到了该方向。 |
| [Joao_Janz: Leather Belt Stretching 1_8](https://freesound.org/people/Joao_Janz/sounds/493154/) | 作者公开HQ MP3，75720 bytes，CC0；非原始24-bit WAV | 明确皮带弯折／拉伸，承担松孔、退带和滑离。 |
| [Joseph SARDIN: Belt buckle](https://bigsoundbank.com/belt-buckle-s0575.html) | 作者在页面结构化数据公开的48kHz/16-bit mono WAV，587618 bytes，CC0 | 短选段轻触，替换旧通用金属点击；不虚构弹簧锁。 |

原下载、48kHz单声道解码、SHA、下载URL／作者与许可保存在 [sources.json](../../web/labs/certification-reader/assets/audio-sources/performance-recordings/sources.json)；[具体选段和加工](audio-derivatives.json)可恢复。可见作者信息经去脚本后保存，无整站脚本／令牌入Git。

选段保留自然包络和瞬态，只做DC去除、宽缓低频／高频清理、材质各自固定增益、12／35ms首尾淡化。纸段增益.55、皮革2、扣.65；没有RMS统一抬升、tanh压缩、循环接缝、倒放或变调。最终纸open3.04s／close3.30s、皮革2.18s、两扣接触.32／.38s；峰值约.264–.477，16-bit PCM48kHz。

复现：`scripts/fetch-scroll-foley-sources.mjs` → `scripts/decode-scroll-performance.mjs` → `scripts/build-scroll-performances.py`。原文件永久复用，不必每次联网重取。脚本依赖本机已有Node／Chrome／Playwright／Python numpy，实际缓存与输出在D盘；未安装大型新工具或购买生成服务。

## 四、动作绑定与首声问题

运行代码在 `sound.js` 的 `_performance()` 与 `motion()`，材料速度来源仍为 `material-motion.js` 和真实 `MaterialPath`：

- 纸只在扣具移除、实际纸进度变化时发声，开合选不同片段。
- 皮革跟随angle／along／feed／slide，空中depart不加风声；有限表演从当前材料位置继续。特别慢的拖动允许短交叉淡化重定位，保持原速度／原音高；这是实用编排，不是高保真任意时间伸缩。
- 针在实际停针／复扣位置各一次轻触，带行程回滞避免阈值抖动连击。
- 停手后音频时钟在180ms内淡出，无pointermove也能安静；反向切换正向表演，暂停／退出清理，晚到结果不复活声。

首次实际分析器检查暴露额外问题：AudioContext已`running`但前25个约18ms采样时currentTime仍0，第26帧才到.010667；第一段皮革峰窗RMS仅约6.9e-5，而非稳定时应有水平。没有把门槛下调放行。改为真实手势内启动静音单帧、与取回解码并行，确认音频时钟推进才置unlocked。UI不等待该promise。修正后同一动作实测皮革峰窗RMS约.00669、纸约.03078，停手均0；数值只证明实际出声／停止，不证明优美。

第一次加预热将解码放到预热后，导致“立即退出、晚到解码”的检查不再触发真实解码而超时。已改成预热与解码并行，仍保留epoch／active检查；后续完整检查通过。对应失败保存在 `resolved-late-decode-check-failure.json`，不误报成当前浏览器故障。

## 五、实际检查与尚需试听

- `motion-verification.json`：真实机构路径、纸／皮革分离、两方向、静止／seek／过晚帧静音、针框两接触位置。
- `material-playback-verification.json`／`playback-candidate.json`：真实WebAudio解码／输出、native rate1／loop=false、开合不同片段、停手安静及pause／exit清理；不以恒定响度为目标。
- `verification.json`：真实页面入口、原件／时间／摘要、真开合与音乐续播、文书英中／复制／键盘／模态、隐藏／恢复、离开及晚到解码。所有显示声音资源真实加载，API仅只读demo模拟，没有真实用户数据写入。
- `actual-opening-mix.wav`：实际页面5.6秒开卷声轨，包含未改背景音乐；从最终WebAudio输出经MediaRecorder Opus采集后转WAV，**不是无损录音母版**。供试听，不声称已经听审通过。

本机Chrome的iPhone尺寸模拟，不是物理Safari验收；本环境没有听审工具，作者描述和波形只能支持资源选择／技术诊断，最终材质听感仍待用户实际试听。不用以上检查把候选包装为已获艺术批准。

正式目录仍仅项目纪念；正文、羊皮纸、扣具几何／做旧、雾染及正确时间／内容码保持原件。无新订阅、付费模型、Kaggle任务或持续费用。发布与在线回读另见 `release.json`／`live-verification.json`，未生成这些证据前不宣告完成。

## 六、实际发布与在线回读

- 代码 `8cc091186f6cf02ca10776876be6862f41d96e0a` 已推送main及本分支，并发布PWA v41。[固定部署](https://4a72a023.the-second-language.pages.dev)，[主站](https://the-second-language.pages.dev)。没有更新独立API Worker或打开认证／自动创作服务。
- 当前展示闭包85文件、53558687字节；本地与线上完整交互均通过。线上实际取得的静态字节逐项与发布Git提交核对；SW、声音代码／清单／新纸卷声音另直接回读。真实匿名session为200／未登录，practice为401，没有真实学习数据写入。
- **首载限制仍保留**：前两次线上全流程因既有约10MB的front/back PNG超过30秒下载上限失败。直接curl随后约3–5秒取完，隔离Chrome的HTTP2／HTTP1并发下载约5–6秒完成，未改产品代码的再次完整检查通过。证据为两份live-load-failure、transfer-probe及最终live-verification；不能据此证明确切根因或声称所有网络首载问题已解决。没有为了通过改小纸面或放宽所有超时。
- 任务末尾按约定实际执行额度／存储更新，仍缺本机publisher凭据，未覆盖旧余额。永久归档已排队，**没有核实OneDrive归档完成**；原件、源录音、工艺、代码和展示已进Git。静态Pages发布凭据独立可用，不把部署成功当作私有原件已备份。
