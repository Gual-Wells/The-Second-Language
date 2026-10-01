# 第二语言语音朗读研究（非运行协议）

状态：2026-10-01 的研究设计；未生成语音、未启用音频服务、未改变正式或临时发布流程。用户已暂停正式课程测试。

## 结论与现状

机器翻译处理语言转换；词汇、例句和文章的发音应由 TTS 生成。课程现有 `USE` 与 `SENTENCE` 编码可承接音频，但第二部分的 `EXAMPLE:U001` 可重复，没有每条例句独立身份。现行章节 `chapter.json` 主要存正文，Worker 将 Markdown 写入 KV，发布请求上限为 5 MB；项目尚无 R2 绑定。把 MP3 的 base64 塞进 Markdown 或章节 JSON 会增大阅读请求、离线缓存与版本更新负担，也可能超过发布请求限制。

建议把“一章可下载的发布内容”定义为正文、音频清单和若干不可变音频文件的组合：正文仍保持三部分；`chapter.audio.json` 记录音频与章节编码的对应关系，实际压缩音频存入私有 R2。PWA 只在读者点按播放或主动下载本章语音时取音频。章节正文摘要与清单绑定，正文修订后不展示旧版语音。作为个人导出物，可以另行打包 ZIP，但线上阅读请求不内嵌音频字节。

## 合成方案比较

| 候选 | 适合之处 | 对本项目的关键边界 |
| --- | --- | --- |
| Azure Speech 的支持 IPA 的 en-US 神经语音 | SSML `<phoneme alphabet="ipa">` 能为重音、同形异音词与派生词指定读音；Speech SDK 的 `<bookmark>` 事件可取得文章句子的音频偏移；支持压缩 MP3。 | 要增加 Azure Speech 资源与密钥，并逐一确认所选语音支持需要的 SSML 标签；长文章应分段合成，REST 文档说明单次结果超过 10 分钟会截断。技术上最适合音标教学与句子定位。 |
| Cloudflare Workers AI `@cf/deepgram/aura-2-en` | 沿用当前 Cloudflare 账户，提供多种声音与 MP3/Opus/AAC；官方标价为每千字符 0.03 美元。 | 当前模型接口列出文本、声音和音频格式，未给出 IPA 音素指定或句子书签接口；因此不能只靠它保证标题音标与音频严格一致。适合作为例句或文章候选，仍需听审。 |
| OpenAI `gpt-4o-mini-tts` | 可用指令调整音色、语速和表达，输出 MP3 等格式，适合自然文章朗读。 | 公开 speech 接口不提供与 Azure SSML 等价的 IPA 音素或句子书签控制；对教学用同形异音词只能靠输入与听审，不能把提示词当作发音保证。 |

初步技术首选是**同一套支持 IPA 的 en-US Azure 神经语音**贯穿词、例句与文章，先听审一组多音词、词族和短语，再决定具体声音与服务。此处是研究偏好，并未选定付费供应商。如果希望只使用现有 Cloudflare 账户，可研究 Aura-2 朗读例句与文章，但词条音标准确性必须另行解决。使用 Web Speech 浏览器现场发声可作临时降级，不具备稳定的发布音频文件与跨设备一致声音。

## 发布数据与生产顺序

1. **正文先稳定。** Codex 完成教材和文章审阅，确定美式音标、主词/派生词/短语实际要读出的英文文本。TTS 输入去掉 Markdown 格式、中文释义、编码与译文。标题里的音标是发音依据，不应把 IPA 符号逐个念出来。例句读整句；文章保留段落语气。歧义词可在 SSML 中对具体英文片段指定音素，不能机械地把同一拼写的所有位置都强制成同一读音。
2. **稳定例句身份。** 后续可把例句标记扩展为 `<!-- EXAMPLE:E001 USE:U001 -->`，同一个 `USE` 下的多个例句各有独立 `E` 编码；旧版 `EXAMPLE:U001` 继续可读。`USE`、`E`、`SENTENCE` 分别定位标题发音、例句和文章句子。
3. **生成不可变文件。** 每个短词音频、每条例句音频和文章段落音频按“实际朗读文本＋发音覆盖＋语音模型/声音/参数”求摘要命名；相同读音可以复用，修订后生成新文件。文章按自然段或场景合成，保留自然上下文；用 SDK 书签记录每个 `S` 句的起始偏移，以后一书签或段落末尾推得结束偏移，并听审分句边界。完整文章播放按段落连续衔接，点按单句可从对应偏移播放到句末。若书签质量不可靠，可为单句生成独立片段，但不应把逐句片段机械串接成唯一的全文朗读版本。
4. **清单最后生效。** 示例：`{chapterDigest, voice, format, uses:{U001:{text,ipa,asset}}, examples:{E001:{use:"U001",asset}}, article:{segments:[{asset,cues:{S001:[startMs,endMs]}}]}}`。先上传并核对音频文件，再发布清单；后端仅把 `chapterDigest` 与当前正文摘要一致、所指文件齐全的清单标为可用。语音处理失败时可继续发布完整文字课程，阅读器不显示失效播放键；之后可独立补发音频清单，不重写日课正文或 VIX 标注。

## 云端与 iPhone 阅读器

私有 R2 bucket 通过现有 Worker 绑定；同域 `/api/audio/<asset>` 路由检查与章节相同的登录状态，再从 R2 流式返回 `audio/mpeg`、长度与 Range 响应。需要先核对清单归属，不能允许任意 R2 key 枚举。R2 标准存储目前有每月 10 GB 免费额度和免外网流出费用；与 Pages 静态资源的单文件 25 MiB、免费站点 20,000 文件限制相比，更适合按天累积大量音频。KV 的单值虽可达 25 MiB，也不适合作为长期媒体库。实际费用主要取决于 TTS 字符量；例如 Aura-2 按官方当前单价，若一天合成 20,000–40,000 英文字符，单日约 0.60–1.20 美元，仅为方案比较的粗估。

第一部分把低视觉权重的播放键置于音标后、“例句”跳转键前；第二部分每条例句有独立播放键；第三部分吸顶工具区加入“朗读 / 暂停”与速度，句子可有单独播放入口。音频播放中的句子使用与用法高光不同的轻提示，不占用原有“点句跳用法”手势。iPhone 必须由读者操作启动有声播放，不自动随推送或进入章节发声。正式章节音频按需缓存，提供主动“下载本章语音”选项；退出登录时清除音频缓存。48 小时临时页音频不做持久离线缓存，临时音频随页面过期删除；复习页可复用正式章节中相同原句的资产或时间片段。

## 需要后续小样本确定的点

在不触碰正式课程的独立样本中，听审所选 en-US 语音是否正确处理教材 IPA、重音、同形异音词和含目标词的自然句；确认书签偏移与 iPhone 上的段落跳播。确认具体语音与地区价格、账户开通、音频编码和用户偏好的语速后，再把本研究转成运行协议及工程任务。当前不执行该样本测试。

## 官方依据

- [Azure SSML 音素与 IPA](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-pronunciation)、[SSML 书签与事件](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-structure)、[Speech REST 音频格式与长度](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech)。
- [Cloudflare Aura-2 英语 TTS](https://developers.cloudflare.com/workers-ai/models/aura-2-en/)、[R2 Worker 绑定与 Range](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/)、[R2 价格](https://developers.cloudflare.com/r2/pricing/)、[Pages 限制](https://developers.cloudflare.com/pages/platform/limits/)、[KV 限制](https://developers.cloudflare.com/kv/platform/limits/)。
- [OpenAI 语音合成](https://developers.openai.com/api/docs/guides/text-to-speech)、[iOS WebKit 有声媒体播放策略](https://webkit.org/blog/6784/new-video-policies-for-ios/)。

