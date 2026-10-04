# 短句试听反馈与雅思声音风格

后续决定：本人已明确选择 Kokoro Heart 为主力；已记录于 `protocol/AUDIO_EXTENSION.md`。其余 Kokoro 音色尚未试听，不因目录支持而视为通过。此决定尚未完成正式日课音频及雅思媒体默认值的工程切换。

研究日期：2026-10-04。本轮回收两次独立试听页的真实反馈；没有新合成、替换正式声音或写入正式章节/练习数据库。原始反馈、音频与测量完整保存在忽略的 `.cache/`，本文只记录项目判断所需的汇总。

## 本人反馈及修正

| 本次音色 | 听感 / 5 | 合格 | 备注要点 | 当前建议 |
|---|---:|---|---|---|
| Kokoro Heart | 5 | 是 | 自然、日常 | 日课点读与朗读首选候选 |
| Orpheus Tara | 5 | 是 | 自然、真实，仿佛有麦克风滤镜 | 对话与考官候选，核对清晰度后再扩大使用 |
| Fish Free 默认音色 | 3 | 否 | 太慢、声音太爆、日常感差 | 当前默认音色退出优先池，不推断整个模型所有音色失败 |
| MAI Flash Harper | 4 | 是 | 声音太爆，效果和价格不匹配 | 不作为主选 |
| MAI 2.1 Harry | 5 | 是 | 可用，自然感不如前面，男声价值 | 男声与既有声音备用 |
| Aura 2 Apollo | 5 | 是 | 声音表现好，但主观偏慢、价格高 | 不因上一轮认可就固定为唯一考官声音 |

两次测试评分维度不同、材料长度和任务不同，不能计算跨轮分数变化的统计意义。上一轮 George 被否定，换成 Heart 后获认可，说明音色是关键变量，模型不应与单一音色混为一谈。本次多数满分，备注比评分更能区分个人选择：自然、舒适、正常节奏、足够清楚与价格共同决定。

## 音频本身的检查

用 ffmpeg `ebur128=peak=true` 检查同一句话的原始 MP3；短片测量不是模型总体质量指标。

| 音色 | 总文件秒数（含静音） | 综合响度 LUFS | 真峰值 dBFS | MP3 码率约 kb/s |
|---|---:|---:|---:|---:|
| Heart | 4.73 | -25.7 | -8.6 | 57 |
| Fish 默认 | 5.83 | -12.4 | -0.9 | 128 |
| Tara | 3.89 | -28.4 | -13.4 | 32 |
| Flash Harper | 4.90 | -18.6 | -0.8 | 160 |
| Harry | 4.61 | -22.9 | -5.3 | 160 |
| Apollo | 4.61 | -23.3 | -7.8 | 48 |

Fish 比 Heart 高约 13.3 LU，Flash 高约 7.1 LU；较高响度可能影响爆音感，但测量没有证明源波形已经削波。Tara 的低码率是滤镜感的可能因素之一，不能排除模型生成的声色，也不能靠重新提高编码码率恢复已丢失的细节。Apollo 与 Harry 文件时长相同，主观慢感不能简单用总时长解释。

工程建议：正式播放前统一响度并留峰值余量，保留供应商原始音频；试听比较也应先统一响度。先修音量问题，再决定是否值得再次试某个音色，不需要为了调音量重新付费合成。

已有 Whisper 核对中五个候选文字一致，Tara 将最后的 steps 识别成 sets。这只是一个待听审的分歧，不据此直接断言 TTS 误读，也不把一次准确转写当作长文、数字及异读词全面合格。

## 雅思官方证据

1. [IELTS 听力格式](https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-listening)：四段覆盖日常对话、日常独白、教育讨论和学术独白，使用英、澳、新西兰、北美等口音。场景有差异，不能一律按新闻播音制作。
2. [官方 Part 1 家具交易样题原文](https://ielts.org/cdn/computer-delivered-sample-tests-listening/ielts-listening-computer-delivered-note-completion-transcript.pdf)：有口头承接、犹豫、缩略形式和数字自我修正；生活语境与题目证据结合，而非逐词教材朗读。
3. [官方发布的 2022 IELTS/DET 比较研究](https://ielts.org/cdn/Research/comparison-of-ielts-academic-and-duolingo-english-test-cushing-et-al-2022.pdf)，PDF 第 31 页 Table 12：将 IELTS 材料描述为自然的语调和停顿；报告所分析样本的对话/独白语速为 3.34/3.78 音节每秒。这是所分析样本，不是当下所有试卷的强制合成速率。
4. [British Council 关于口语自然交流](https://takeielts.britishcouncil.org/blog/ielts-focus-why-ielts-speaking-feels-more-natural)：安静受控环境、人与人互动、适当停顿及跟进问题。
5. [IELTS 口语格式](https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-speaking)：Part 1 访谈、Part 2 提示卡及个人陈述、Part 3 讨论，评分涉及正常速度与易懂程度。考生发音评分不等于考官的音色规范。
6. [2006 年口语互动研究](https://ielts.org/researchers/our-research/research-reports/the-interactional-organisation-of-the-ielts-speaking-test)：真实考官互动受到标准化流程约束。作为较早研究，它提醒声音自然与随意改变考试流程是不同问题；不将旧研究的每项微观规则直接当作当前规范。

据此推导项目目标：自然、清楚、情境合适。日常/学生对话用自然承接、连读、合理弱读和节奏；独白按导览/讲授身份组织；考试指令较清楚平稳。模拟考官有自然问句语调但保持中立、简洁和考试节奏，不做夸张表演或不断附加私人评论。无需人为加入背景噪声、失真、密集口头禅或过度吞音。

## 社区反馈及其边界

- [考官风格讨论](https://www.reddit.com/r/IELTS/comments/1haxqvb/about_speaking_examiners/)：有人遇到冷淡/机械表现，评论也指出考官有友好和克制等差异。个体经验不能证明所有考官应采取一种固定风格。
- [口语交流结构讨论](https://www.reddit.com/r/IELTS/comments/1lnqt9n/whats_the_speaking_test_really_like_is_the/)：既有接近自然谈话的体验，也有强调提问/追问而非双方自由闲聊的解释。
- [官方材料语速体验讨论](https://www.reddit.com/r/IELTS/comments/1vqbk1b/stuck_at_band_6/)：部分考生认为剑桥材料语速与考试相近，也有反馈 British Council 样题更快。主观感受存在分歧，不拿一条帖子制定统一语速。

## 建议的项目方向（待进一步内容验证）

日课优先 Heart；候选第二自然声音为 Tara。听力按材料场景配置人物声音，而非因“标准”默认只有 Harry；Harry 可留作男声/较正式叙述选择。口语考官优先验证 Heart/Tara 的自然问句，Apollo 留作可用备选。其他性别与口音优先在低成本已可用模型里选择合适音色，尚未试听的音色不继承已合格标记。

短句偏好不会自动改写正式后台：当前代码仍把听力映射至 MAI 2.1、口语提问映射至 Aura 2。后续正式改造需让模型/音色由材料角色选取、写入媒体身份并绑定内容摘要；保留多口音、声音连续性、全文忠实、答案附近发音和未知收费结果不自动重付等既有要求。自然感优先并不替代这些内容条件。
