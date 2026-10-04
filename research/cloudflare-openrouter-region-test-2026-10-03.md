# Cloudflare 后端与 OpenRouter 地区通路实测

日期：2026-10-03。用户授权独立 Cloudflare 后端测试，同时自行进行另一项云端测试。本次使用同一 OpenRouter 账户/key、同一 76.796 秒真实录音；不给模型确认稿、旧转写或参考答案。测试资源独立于正式 PWA、Workers、数据库、KV 和 VIX。结构化摘要见 `outputs/cloudflare-openrouter-region-test-2026-10-03.json`。

## 已取得的结论

**本机的地区门禁，在本次 Cloudflare 云端通路上没有出现。Gemini 3.8 Flash 与 GPT Audio 均可调用。**

此前本机被识别为 CN，两款原声请求均返回地区门禁 403。本次独立 Worker 使用默认 Cloudflare Cron 调度，没有显式地域 placement，也没有伪造地区请求头。OpenRouter 的 trace 返回 `loc=US`、`colo=EWR`；路由 metadata 同样显示 EWR。Gemini 短文字请求在北京时间 17:33 返回 OK，原声阶段约 17:35 开始；GPT Audio 也进入其实际供应商。

这支持报告中“当前请求地区影响端点筛选”的解释。它证明当前账户/key 对这两款模型并非在所有执行环境都不可用；没有测试 Anthropic，也没有证明所有供应商资格已通过。US/EWR 是本次请求观测，不是固定出口承诺。

## 实际返回和费用

按预算汇率 ¥7/$，非即时外汇报价；仅列 OpenRouter 返回的模型 usage 费用。

| 请求 | 返回 | 用时 | 费用 |
|---|---|---:|---:|
| Gemini 3.8 Flash，短文字 | 200，OK | 1.125 秒 | ¥0.000063 |
| GPT Audio，短文字 | 400，供应商要求输入或输出至少有音频 | 0.647 秒 | 未返回 usage |
| Gemini 3.8 Flash，完整原声与分析 | 200，完整转写及声音意见 | 7.356 秒 | ¥0.026786 |
| GPT Audio，完整原声与结构化分析 | 200，但模型回答音频不可访问 | 2.235 秒 | ¥0.181521 |
| GPT Audio，完整原声、仅要求转写 | 200，完整转写 | 2.729 秒 | ¥0.184128 |

五次 OpenRouter 请求实际返回费用合计 **$0.056071，约 ¥0.392497**。第二项已到 OpenAI 原生参数检查，属于格式要求，不是地区拦截。第一次 GPT 原声结果也记录了 767 音频输入 tokens；第二次仍为 767。简化提示的同时将输出预算从 4096 降为 1024，未单独分离两个变量，不宣称已确定首次无法访问回答的唯一原因。

若只重复本次成功请求 30 次，Gemini 原声加分析约 ¥0.80，GPT Audio 仅转写约 ¥5.52。两种任务不同，不能用这份样本预算承诺完整口语批改的固定月费。Qwen 前次同段录音加分析约 ¥0.00459/次，30 次约 ¥0.14。

## 教学数据的质量

### Gemini 3.8 Flash

成功识别 one by one、complicated problems 和完整结尾；输出保留一些 uh、重复或半截词。与 149 词确认稿相比，规范化后 156 词、9 次词级编辑（约 6.04%）。这些差异混合了可能的真实犹豫、词语替换和遗漏，不是发音错误率。

模型把原句中的 study, plan 识别成 start plan，然后批评缺少 planning/to plan。不能把此项建议当成用户实际语法错误。另将原句 I can focus 改为 I focus 后提出时态建议，亦不采用。关于节奏较平、重音和辅音清晰度的意见仍只是待核对声音观察，没有可靠音高、音素测量或独立听审。本次尚未显示它的教学诊断明显优于 Qwen。

### GPT Audio

首次结构化分析只有“无法访问音频”的回复。仅要求转写后，完整识别原声；与确认稿 149 词相比只有一次词语替换：complicated → complex，约 0.67%。它未保留 Qwen/Gemini 记录的重复和半截词，因此不能只按编辑比例宣布它更忠实或更适合流利度评价。

成功转写证明该通路实际可用，也说明模型对自身访问能力的表述可能不可靠。当前 GPT Audio 取得的是转写结果，未取得可用的原声诊断，不能宣布完整口语声音分析通过。

## 运行中的处理

- Cloudflare 部署和临时 KV 所需权限通过用户设备授权取得。密钥仅保存在忽略目录与测试 Worker secret，没有进入公开代码或输出。
- 本机 workers.dev 域名解析得到异常地址，HTTPS 连接未通过；因此使用 Cloudflare 内部 Cron 触发、独立临时 KV 回收结果。正式 API 和 PWA 没有增加测试路由。
- Workers 不支持 `redirect: error`，首次调用停在运行时兼容错误，尚未请求模型。改为 manual，不自动把带授权的请求转发至重定向目标；修正版本完成测试。
- 每个测试阶段有独立结果键，完成后不重复调用。原声暂存于独立 KV，测试结束由 API 删除整个测试 Worker 与测试 KV，两个删除请求均返回成功 200；云端测试密钥、录音副本及定时触发随资源删除。
- 原始返回与完整录音保留在本机忽略目录。正式 attempt、课程、VIX 标注、正式数据库、生产 PWA 均未修改。

## 对长期工程的含义

Cloudflare 能承担本项目候选模型的云端调用，但本次验证的是 **Cron 触发**。Cloudflare 官方说明 Cron 在空闲机器上调度，而默认 HTTP Worker 的部署与调用者接入有关；iPhone HTTP 请求是否得到相同地区判定仍未验证。因此当前可确认独立云端任务调用成功，不能直接将现有生产 HTTP 后端标记为已经解决地区限制。

候选后续通路是私有录音 → 后端任务 → 模型数据 → Codex 教学接管 → PWA。模型的可用性、实际音频处理和诊断质量分别保存；当前 Qwen 继续可用，Gemini/GPT Audio 成为已通过本次云端地区通路的候选。

官方依据：[Cloudflare Cron 调度与传播](https://developers.cloudflare.com/workers/configuration/cron-triggers/)、[默认 HTTP Worker placement](https://developers.cloudflare.com/workers/configuration/placement/)、[跨区域子请求头行为](https://developers.cloudflare.com/fundamentals/reference/http-headers/)、[Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/)。外部资料解释环境行为，具体模型成功与费用依据本机保存的真实 API 返回。
