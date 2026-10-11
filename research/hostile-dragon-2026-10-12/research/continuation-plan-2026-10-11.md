# 仇视之龙：额度纠错与继续制作

核查时间：2026-10-11 16:39 北京时间。此文件取代旧恢复说明的额度预算；旧成果保留。

## 实际状态

- 今天14:05的后台续作已经消耗本轮额度，1536生成成功，48张真实模型视图已保存于 `working/resume-2026-10-11/server-renders/`。
- 导出被拒绝，未下载TRELLIS.2可编辑模型。现有本地Hunyuan GLB是另一生成结果，不能冒充本轮模型。
- 实时免费账户：base 300秒，remaining 178.067729秒，下一刷新2026-10-12 06:05:43 UTC，即北京时间14:05:43。
- 原脚本误将120秒声明当120秒额度门槛。xlarge按2倍预留，出口需要240秒。报错显示120 requested但178 remaining仍拒绝，与这个机制相符。
- 实测生成扣除121.932271额度秒，之后178秒不够240秒的导出门槛。不能靠原样每天重复1536生成解决。
- 会话状态是服务器gr.State，不是本地潜变量备份；原进程已退出，默认状态清理可发生。没有验证旧会话恢复成功，也不承诺能提取该次原模型。
- C仅约0.33GB，D约27GB。本轮文件、缓存、下载、渲染及日志全在D。

## 已完成的继续工作

1. 阅读本轮灰模与PBR正/背图：仍存在镜像背面龙头、上爪指节圆鼓、眼眶敌意/近眼强调不足；不能进入最终材质特效验收。
2. 修正旧双调用脚本：1536以已测生成消耗+240秒导出预留计算，起始规划365秒；免费base不足时拒绝启动，不再重走生成后导出受阻路径。365是本候选的保守规划，非平台通用硬限。
3. 找到运行中的合并生成/导出端点 `prithivMLmods/TRELLIS.2-Text-to-3D`，源pin `1838678c08b59708c8f645350b4bbd748b0b60fb`，使用Microsoft TRELLIS.2-4B权重。
4. 源码检查确认 `/generate_3d` 在一次120秒xlarge调用内生成并导出GLB，声明预留240秒；绕开第二次GPU准入门槛。它仍使用同一账户配额，没有轮换账户或购买订阅。
5. 连接实服务核对API字段，保留1536、seed38017、12步、500000面与4K纹理。合并服务中间简化到1M面且可能退到remesh=False，不能宣称与官方分步结果完全一致；须回读GLB审查。
6. `working/resume-combined.py --check-only` 已通过源pin、服务运行、接口配置和实时额度核查；结果configured_waiting_for_quota，没有提交GPU任务。
7. 共用GLB检查器已用现有完整GLB验证；检查文件完整性不代表艺术质量。检查脚本可将新渲染与源工程保存到独立输出目录。

## 受控续作

`working/resume-combined.py --wait-reset` 仅等一次已知刷新（最长22小时），刷新后再核查源码/服务/余额并提交一次合并任务。若被其他任务消耗额度、服务变化、超时或失败，则保存状态停止，不循环跨日或自动重生成。等待阶段不调用模型、低频本机停止标志检查，不弹PowerShell窗口。

后台只做有限的模型取得与本地预览渲染，不自动做艺术采用、正式认证或生产发布。已成功的GLB不重生成。用户如取消，先在 `working/combined-next-reset/STOP` 写入停止标志；生成已提交后结果可能未知，不能贸然再启动。

程序产物：`working/combined-next-reset/status.json`、`candidate.glb`、`provenance.json`、`candidate-master.blend`与`review/`。凭据仅从私有hf-token.txt读取，不出现在交付物。

## 模型到手后的制作顺序

1. 灰模正/侧/背检查与拆分可编辑部分。
2. 首先处理重复背面龙头与两爪跨缘延续；不以覆盖贴图假装修好背面。
3. 局部重塑眼睑/眉嵴、瞳孔方向、掌指压力与币缘破口，保留主形和真正厚度。
4. 几何通过后才做金属分区、眼口独立光效、真实碎片与局部雾效。
5. 多角度实物图及可把玩页交用户验收。当前未通过艺术关口，不接正式项目。

## 可验证来源

- 账户quota.json、旧runner.log、实际server-renders和本次preflight记录。
- HF ZeroGPU倍额与刷新规则：https://huggingface.co/docs/hub/spaces-zerogpu
- HF官方额度检查说明：https://huggingface.co/buckets/huggingface/skills/tree/skills/huggingface-zerogpu/references/how-quota-works.md
- Gradio会话状态生命周期：https://www.gradio.app/guides/resource-cleanup
- 合并服务不可变源码：https://huggingface.co/spaces/prithivMLmods/TRELLIS.2-Text-to-3D/blob/1838678c08b59708c8f645350b4bbd748b0b60fb/app.py

本轮未购买服务、未迁移数据库、未修改正式项目；新增持续成本为零。后台就绪不等于可编辑模型已到手，完成以实际文件和状态为准。
