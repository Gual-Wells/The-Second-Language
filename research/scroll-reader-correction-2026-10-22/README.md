# 正式卷轴阅览与动作拟音纠错

2026-10-22。委托：纠正羊皮纸／皮扣声音与动作不对应；正式目录仅纪念篇；默认声音开启；原声音按钮改为英文原稿／中文译稿的文书设置。

## 原件与身份保持

用户随后澄清：纸上已有时间和认证码便是正确，只是古字体不易辨认。已直接核对纪念篇原件／同源记录：制作／纪念时间为`2026-10-21T12:10:23.227Z`，北京时间`2026-10-21 20:10:23.227 +08:00`；纸面短码`4A83 D195 2E13 3BCE`，完整内容SHA`4a83d1952e133bcecd6c1aa2e14a788159b410e9a6ea2a7f5bcf42610943e37b`。不改时间、不重新排纸、不重铸内容身份，不把制作时间改称未知的项目成立日／部署事件。

第一／第五章样品先前虽带未颁发标记，也不应由此进入正式目录。此次撤出生产catalogue和生产viewer profile；不销毁其研究原件，也不伪造真实成绩或通过事件。正式发布纪念作品与考试颁发是两个状态。

## 已落实的行为

- 只列“项目纪念”，所有正文／原件继续读取既有冻结层。
- 音乐／拟音在真实进入点击中默认开启；删除声音设置与旧关闭偏好读取，不绕过浏览器自动播放限制；再次触碰可重试解锁。退出停声、后台暂停，迟到解码不能复活声音。
- “文书”控件打开同源、易读的英文原稿与中文译稿，含题头、题辞、落款、藏记、状态；制作时间、短码、完整SHA单列并可复制。面板按钮／滚动不触发卷轴开合。
- 拟音不再按总进度轮换书本／翻页／放书／cloth／latch片段。连续实录床由实际`paperProgress`及皮扣`angle/along/feed/slide`差分驱动，静止／跳转不造动作声。针框只在真实prong完成park和反向seat时轻触。
- 采用已获再分发许可的羊皮卷录音与皮革拉伸录音；保留原件与作者页证据。一次性离线截取／下混／去DC／短同源接缝／软瞬态压缩／增益，网页轻微低通与`.90–1.06`变速，不加噪声伪造材质。
- 持指静止不再收到pointermove时，AudioParam在音频时钟180ms内退零，不留JS轮询。轻触接触声与连续摩擦是不同机制；两层不全程叠响。

## 可恢复入口

- [资源与动作研究](audio-research.md)：作者素材、许可、真实皮扣阶段及采样限制。
- [衍生参数](audio-derivatives.json)：原件和实际循环纹理摘要、截取、压缩、增益。
- [实际路径验证](motion-verification.json)：读取同一MaterialPath和keeper-path，而非另写假进度；纸与皮革分段、往返、park／seat、静止与跳转保护。
- [真实WebAudio验证](material-playback-verification.json)：实际浏览器解码、材质总线Analyser输出；持指静止后实测为零，暂停／退出源清空。
- `verification.json`：完整实际UI、真实复制剪贴板、默认解锁、冷页迟到解码、无账户写入与资源／源码回读。文件只有实际运行完成后才存在。
- `release.json`、`live-verification.json`：正式发布与线上检查结果，只有完成后才记录。
- 实录原件与署名见`web/labs/certification-reader/assets/audio-sources/material-recordings/`；统一许可入口`web/labs/certification-reader/AUDIO_CREDITS.md`。

工序脚本为`decode-scroll-leather.mjs`、`build-scroll-material-audio.py`；声音映射为`material-motion.js`，调度仍基于原WebAudio播放／生命周期，未引入Wwise/FMOD运行依赖或新的服务器。

## 成熟方法与判断边界

采用常见的实际参数驱动声音方法，参考Audiokinetic的[RTPC](https://www.audiokinetic.com/fr/library/edge/?id=quickstart_sample_integration_rtpc.html&source=SDK)与原生WebAudio的[循环区间](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/loopStart)、[播放速率](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/playbackRate)。复用当前小规模WebAudio即可，不为几个材料层引入大型中间件。这里是艺术化响应，不是受力声学求解器。

资源作者描述、许可、信号分段和实际波形输出不能替代人耳。现工具没有进行人工音色听审；手机扬声器／耳机的自然度与混音仍需实际听感评价，不把测试通过写成艺术验收。无新增订阅、付费API、Kaggle任务、逐章生成或持续成本。

## 实际验证结果与观测修复

完整本机验证28项通过，错误／缺失资源／账户写请求均为空。冷页延迟音频下载直到退出再放行，解码也未复活声音。初次取证遇到CDP不能读取已导航页面的模型响应体，属于取证盲区；同浏览器实际fetch补读SHA后通过，原`browser-failure.json`留存，不冒称产品资源404。宿主viewer源文件统一为LF；浏览器实际测试使用的bundle已由同样源代码编译，未因换行规范改动行为。

`check-balances.mjs`已实际执行，因本机缺少publisher凭据，额度／容量更新失败保留旧值；永久归档只是排队，未冒称OneDrive完成。真实原件、许可、代码和研究保存于D盘及本次Git提交。发布结果另记release.json。

## 第三方网页脚本与推送保护

首次源提交的推送被GitHub Push Protection实际拒绝，原因是第三方Freesound作者网页内置脚本含被识别为Mapbox访问令牌的内容。没有绕过保护；作者页改为去脚本／属性的可见文字摘存，并记录下载原字节SHA和清理后的摘存SHA，原HTML仅留D盘忽略缓存。真实素材原件、作者署名与CC BY／CC0许可不变。拒绝的提交未进入远端main，本地修正该未发布提交后重新正常推送。
