# 认证与主题纪念币：第二轮研究与测试

2026-10-09 开始、2026-10-10 发布准备。第一轮反馈依据见 [前轮复盘](certification-feedback-review-2026-10-09.md)。本轮是独立体验样件；正式读后记录与认证功能没有替换。用户允许少量付费及有权参考、借鉴、复用公开资源。

## 本轮实际产物

- 新地址 `/labs/certification-v2/`；第一轮 `/labs/certification/` 保留。
- 第三章原创语义题库 29 题、20 个不同学习目标，每份独立抽取 16 个不同目标、再随机题目与选项。排除词形变换填空；包含少见义、专门义、同词不同对象与行为方向、关系理解。满分才通过，重测不限次，唯一测试认证不变。**不是 40 词全量掌握证明，也不是正式 Codex 自由出题已经实现。**
- 三枚分别设计的主题图像：地图森林勘界、河流账本、湿地复苏；真实斜削边缘、双面几何、金属环境反射及浅凹凸贴图。细节来自图像，**没有把贴图浮雕冒称真实雕刻网格**。
- 广场三份 12／12／14 秒主题声，独立剪辑真实环境录音与拟音；罐内六份成熟自然碰撞短音。播放只读取静态文件，不调用模型，不向后台写交互事件。
- 手机运动需要授权与十二次稳定静止采样；分离线性加速度与重力、屏幕坐标变换。真实圆柱硬币、币间碰撞、运动学罐壁、固定 1/60 秒物理步长、独立 Worker、实例化绘制、视觉帧确认控制消息积压。
- 提交按钮常驻视口，草稿与进度恢复；前台作答时间和离开次数随答卷保存；反馈携带两个场景的有限摘要，仍可导出。前台时间也不等于注意力或真实考试耗时。

## 研究、取用与授权

| 一手来源 | 实际作用与取舍 |
| --- | --- |
| [Three 官方 Rapier instancing 示例](https://github.com/mrdoob/three.js/blob/dev/examples/physics_rapier_instancing.html) | 参考实例化与物理对象关系；本轮使用已有固定 Three 0.186.1 和 Rapier 0.21.0，不追随 dev 浮动版本 |
| [Three MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html)、[LatheGeometry](https://threejs.org/docs/pages/LatheGeometry.html) | 有厚度内外壁、IOR／transmission、旋转成型边缘；玻璃会增加渲染成本，不能只凭材质名称声称真实感已合格 |
| [Rapier rigid bodies](https://rapier.rs/docs/user_guides/javascript/rigid_bodies/)、[collision detection](https://rapier.rs/docs/user_guides/javascript/advanced_collision_detection/) | `setNextKinematicTranslation/Rotation` 让罐壁推动币；接触开始与相对速度共同触发声音，持续承重不重复响 |
| [W3C orientation/motion](https://www.w3.org/TR/orientation-event/) | `total − linear = gravity`，设备／屏幕轴映射、权限与异常读数；缺少有效 linear 时不猜测重力 |
| [Luke Turnbull 多线程 Three 示例](https://github.com/luketurnbull/threejs-offscreen-canvas) | 参考拆分物理与渲染、插值的经验；其 60/120 Hz 是作者项目描述，不是本项目数据。未确认许可，未复制代码，也未引入其 SharedArrayBuffer 部署要求 |
| [Kenney Impact Sounds](https://kenney.nl/assets/impact-sounds)、[Casino Audio](https://kenney.nl/assets/casino-audio) | 实际下载原包并检查附带 CC0 许可证，取轻金属碰撞及纸张拟音 |
| [thedapperdan 币落玻璃](https://freesound.org/people/thedapperdan/sounds/199922/) | 实际取得公开高品质预览，CC0；截取三段，不以合成正弦冒充真实币音 |
| [Blender Foundation / YoFrankie! 环境音，Lamoot 提交](https://opengameart.org/content/ambient-mountain-river-wind-and-forest-and-waterfall) | 实际下载并解出六份 FLAC，使用 forest、river、stream、wind，CC BY 3.0；原作者及改编说明在页面与 CREDITS 保留 |
| [kurt Stream Sounds](https://opengameart.org/content/stream-sounds) | 实际取得原包，使用 stream2，CC BY 3.0；用于湿地回水层 |

Freesound 的另外两份自然录音在本机和 Cloudflare 固定白名单取回均失败，**没有使用、没有假装已取得**。失败的临时取回接口已从最终版本移除。TinyWorlds Forest Ambience 也取得但分类为音乐，本轮没有用来冒充现场录音。

完整署名见 [CREDITS](../web/labs/certification-v2/CREDITS.md)；剪辑位置、混音参数和原录音 SHA256 见 [sound-build.json](../web/labs/certification-v2/assets/sound-build.json)。复制 Three 固定版本的 `RoomEnvironment` 仅改相对 import，沿用其 MIT 许可；Rapier Apache-2.0 许可保留在第一轮 vendor。

## 声音与币面创作意图

| 章 | 币面设计 | 主题声音顺序 |
| --- | --- | --- |
| 地图上的那条线 | 雨林树冠、河道、勘界图线、指南针与山地层次 | 展开地图 → 林间与河流勘查 → 收拢纸张 |
| 河流的账本 | 旧桥、河镇、账本页、水位尺与鹭鸟 | 翻页 → 分隔记录声 → 河水涨落 → 收起记录 |
| 水回来的地方 | 蜿蜒回水、芦苇、白鹭、涟漪、山地与飞鸟 | 稀疏风声 → 溪水出现 → 水量增加 → 林间生命与保留的河水 |

这些是独立编排的声音作品，仍须用户判断能否在听感上辨识主题。尤其地图／账本都包含纸张、河水，**不因文件不同就宣称主题辨识已经成功**。不加入英文旁白，不以固定数值种子或音高变化代替主题表达。第三章结尾仍有水质责任，声音没有强行写成彻底胜利。

自然音层归一化后再编排，以免纸张瞬态遮蔽环境；主题目标 -21 LUFS／-3 dBTP，碰撞目标峰值 -8 dB，实际输出还经过 MP3 编码和淡化，不把目标当测量值。九份解码测量均无削顶：主题峰值 -2.8～-6.4 dB；碰撞 -8.0～-8.6 dB。主题约 12.04／12.04／14.03 秒，包含编码填充。播放限制最多六个声音并发、48ms 碰撞间隔、力度映射与最终压缩限幅。

原图生成设计要求保存如下；三次均为新图，没有把未授权素材上传编辑：

> 共同要求：正面正交圆形纪念币贴图，居中、完整圆形约占画面 96%，透明或中性外部区域，香槟青铜与少量银色细节，真正雕刻师式精细主题构图；不要文字、标识、水印、侧视透视或把主体变成平面图标。
>
> 湿地币：恢复的蜿蜒水流、芦苇、白鹭、涟漪、远山、日出和飞鸟，表现水回归生命。
>
> 地图币：热带雨林树冠、测绘边界、指南针、河流与山地，表达地图与现实土地的关系。
>
> 账本币：河流、旧石桥、河镇、档案账本页、水位标尺和鹭鸟，表达河流记录与积累。

## 实测发现的缺陷与修复

1. **慢帧后摇罐越界：**手动摇罐用了墙上时间相位，忙帧后运动学壁跳变形成过大速度。改为模拟时间相位，两个轴均平滑收尾；姿态变化也限速。没有用夹回位置掩盖越界。
2. **500 枚初始超容器：**方形中心阵列只容纳十三枚／层，最上层出生在盖外。改为十九枚／层的六角排列，保留圆柱及互相接触。
3. **切换后仍发声：**隐藏场景尚有 Worker 消息到达，重新触发撞击音。接收端在隐藏／暂停状态不播放新碰撞，仍保留当前状态。
4. **持续积压渲染消息：**慢渲染时不继续排入无限快照，以帧确认只保留最新状态和最多三条强碰撞摘要；物理独立运行，不做逐帧网络上传。
5. **虚假的低帧间隔：**原诊断排除了大于 150ms 的慢帧，会掩盖卡顿。记录真实交付间隔，不再过滤慢帧，也不以截图模拟宣称手机 FPS。
6. **答卷提交不常驻：**将提交栏固定到视口底部，保留答题区余量，重新验证进度恢复与可见位置。

## 验证证据与边界

| 检查 | 本轮结果 |
| --- | --- |
| `node scripts/check-certification-v2.mjs` | 21 项通过；200 次独立随机抽取；题目与答案身份正确，旧版默认八题不变，提交密封、计时、唯一认证与运动数学检查 |
| `node scripts/check-certification-lab.mjs` | 原版 23 项通过；旧版既有题、答卷和声音函数未改写 |
| `node scripts/check-certification-v2-ui.mjs` | 完整 30 项通过，无 JS 错误；真实 MP3 解码播放、三个主题、32/128/500 物理场景、权限拒绝回退、重新校准、草稿、反馈及隐藏停止 |
| `V2_QUIZ_ONLY=1 node scripts/check-certification-v2-ui.mjs` | 改为常驻提交栏后额外 9 项通过，截图确认蓝银界面、控件可见且不横向溢出 |
| `node scripts/check-certification-physics.mjs` | 不依赖渲染的实际 Rapier Worker：静置休眠、摇晃、倾斜、倒置、回正、暂停恢复及三个数量档，边界和真实接触核验 |
| iPhone 尺寸画面 | 402×874、402×714 触控 Chromium / 软件 WebGL；逐一查看广场、三枚主题与玻璃罐，**不是实体 iPhone Safari** |

本机软件 WebGL **严重缓慢**：32／128／500 在该环境中的渲染交付 P95 约 2.28／5.43／8.08 秒，不能称性能合格。Node 独立实际物理检查中，500 枚激活时物理循环批次 P95 约 0.27–0.29 秒且存在降速；该批次可含多个固定步，不是单步时长。这明确表示 500 枚有性能风险，尚不能承诺 iPhone 17 上流畅。保留默认 32 枚与 128／500 压力档，真实手机反馈仍是下一道必要门槛。正式实现可能需要降低非必要玻璃／阴影成本、改善接触睡眠与碰撞事件开销，不能为提速取消币间接触或以球体代替币。

题库本轮只验证原创封闭式语义题与流程，不把 16 题声明成统计校准过的十分钟容量。前台时间保存在答卷，不把两个申请时间之差当完成时间。用户评分、主题辨识、真实运动方向、实体手机体验仍未验证。

## 资源与下一步

三次内置 imagegen 生成原创币面；没有调用新的外部付费音频 API，没有新订阅。内置生成没有返回可独立核对的人民币账单，不虚构金额或声称一切免费。所有播放为同源静态资源，交互不写 KV，答卷与反馈使用已有独立实验 D1；不新建正式数据库，不修改休息安排。

下一步只按新版真实反馈收敛：优先声音主题辨识、币面／玻璃可读性、轻重摇晃和 500 枚性能。认可前不替换正式读后记录，不宣布正式收藏完成。原答卷、原反馈和第一轮页面可继续比较。部署与任务末尾余额核对按现有入口执行。

## 发布核验

2026-10-10：API Worker 版本 `f67af920-2e12-41ad-8cd4-19c0b1f058da`；Pages 部署 `cacaf6a0`。线上二十二份新版文件逐份字节一致，旧实验页面 HTTP 200，匿名认证实验 API HTTP 401。线上没有提交伪造试卷或评分。研究记录与代码按已授权路径提交到 GitHub。

任务末尾额度核对成功，余额页已更新，永久归档已排队；本轮外部模型余额未发生推理消费。尚无实体 iPhone 的新反馈，不把测试完成写成产品采用。
