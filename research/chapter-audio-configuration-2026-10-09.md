# 章节音频选配、复用与发音覆盖研究（2026-10-09）

## 结论与边界

现有系统按模型、音色、input、format、声音策略摘要原子领取付费生成；已成功 MP3 与完整描述保真保存在 OneDrive，D1 保存不可变紧凑索引。相同输入跨 kind/章节共享，不因 read/write storage 或重播重新生成。旧版未描述指定读音，按同拼写复用不足以表达同形异音。

本次增量采用文字 + 标题实际音素：普通句子保留旧 descriptor；标题指定音素时加入可执行覆盖 input 与版本化 pronunciation 元数据。主标题/二级标题相同读音合并，不同读音区分；第二部分词汇标题通过同章节第一部分词汇模型取读音，不再生成一套标题音频。例句与第三部分逐句按真实英文全文，跨部分恰好相同也共享。预下载包保留新 identity，旧包仍支持无音素的普通文本。

不改已发布正文/IPA、不改 EXAMPLE 编码语法、不按例句序号识别音频、不把整章连续朗读和逐句点读混为同一合成。整个内容永久保存策略沿用既有架构，仅暂存报价有十分钟确认期限。

## 实际路线验证

本机只向已有 Cloudflare 后台发起两个短句探针：input 的显示词均为 record，音素分别为 həlˈO 和 ɡʊdbˈI，各重复两次。两项后台 HTTP 200，MP3 可解码。Cloudflare Whisper 返回 Hello, hello. / Goodbye goodbye.，原声时长 1.425 / 1.6 秒，共约 2.35094 Neurons。这证明当前 OpenRouter Kokoro 音素语法不是被忽略或照字符念出来；不依赖预先提供 transcript。

探针文件与真实返回保存在忽略目录 .cache/phoneme-probe/；API 的原 MP3 已按实际 input 身份永久保存。没有生成整章或确认测试用的正式用户批量申请。探针总输入约七十字符，按路线规划价不足人民币 0.001 元（估算，非独立核实账单）。

音素映射基于作者 Misaki 的 US vocabulary 与 Markdown 音素语法。处理常见美式双元音、affricate、rhotic、词典 e/ɛ 约定与长度符；不支持的符号或结构拒绝收费生成并进入核对，不猜读音。两份真实本机章节当前提取均无不支持单元。路线对照验证不等同于全词表严格语音学审听或永久供应商保证；听感异常仍需针对具体资产纠正，新版本不能覆盖旧原件。

## 字符与费用

以下是两份本机真实章节的去重合成 input 字符（包括标题覆盖语法），假设相应声音全部尚未生成；实际已有章节报价会减去成功缓存。使用 $0.62–$0.99/M 字符、7 元/美元预算换算，非即时人民币汇率。

| 章节 | 项目 | 独立声音 | 输入字符 | 人民币预计 |
| --- | --- | ---: | ---: | ---: |
| 2026-10-06 | one | 59 | 1428 | 0.0062–0.0099 |
| 2026-10-06 | two | 185 | 11330 | 0.0492–0.0785 |
| 2026-10-06 | three | 116 | 14048 | 0.0610–0.0974 |
| 2026-10-09 | one | 74 | 1766 | 0.0077–0.0122 |
| 2026-10-09 | two | 148 | 9229 | 0.0401–0.0640 |
| 2026-10-09 | three | 128 | 12889 | 0.0559–0.0893 |

三个项目都选时联合去重，不能把分项范围无条件相加。上述样本全新音频约 0.10–0.19 元/章；真正支出以路由供应商账单为准。未来章节更长、API价变、额外语音审核均可能改变费用。下一章 UI 取近期三章范围作为样本预估，不把今天样本当严格上限。

## 来源

- [OpenRouter TTS](https://openrouter.ai/docs/guides/overview/multimodal/tts)：input 是语音文本；instructions 并非 Kokoro 的通用发音强制接口，不能靠多写 prompt 保证读音。
- [Kokoro 官方演示源码](https://huggingface.co/spaces/hexgrad/Kokoro-TTS/blob/0464d168a1713c5d419b27b92e120eac8e05bc7b/app.py)：作者展示 Markdown 链接音素覆盖。
- [Misaki 作者源码](https://github.com/hexgrad/misaki/blob/main/misaki/en.py)：US_VOCAB、G2P.preprocess/tokenize 处理指定音素；其音素体系不能原样等同所有词典 IPA。
- [OpenRouter Kokoro](https://openrouter.ai/hexgrad/kokoro-82m)：规划起价 $0.62/M 字符。
- [DeepInfra Kokoro](https://deepinfra.com/hexgrad/Kokoro-82M/api)：本次公开页原生价格 $0.99/M 字符；范围不是保证实际 OpenRouter 上限。

## 工程验收

确认前无 TTS；同 quote 重复确认不重复任务；固定 digest；无 cancel；受保护游标与终态；休息/重发不消耗下一章配置；新章发布一次原子入队；普通旧索引兼容、不同音素身份区分、相同音素无重付；iPhone 模拟视口设置页与确认页保持原风格。最小必要回归检查均通过，真实 iPhone 触摸/用户主观发音质量仍需使用反馈。
