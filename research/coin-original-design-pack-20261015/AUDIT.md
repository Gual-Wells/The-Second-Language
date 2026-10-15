# 清理与修订记录 · 2026-10-15

旧包基线：5e17c6ff844ebb2b317b176e38ed01de10ad7213。详细机器记录见spec/audit-and-removal.json。

## 从活动包与Git当前版本删除八份错误稿

| 文件 | 实质问题 |
|---|---|
| blank-triptych-a2-rejected.png | 修改字向未成功，新增拼写错误 |
| blank-four-edge-v1-rejected.png | 相位重复，完整名称被花饰拆开 |
| blank-four-edge-v2-superseded.png | 误将两个方位翻成币背 |
| blank-four-edge-final.png | 固定相位与轮廓无法可靠维持，由同一数据生成的投影替换 |
| foundation-front-obliques-profiles.png | 标注的侧视仍是斜视，指节/投影漂移 |
| foundation-rear-edges-v1-superseded.png | 背面组中混入正面 |
| foundation-rear-obliques-and-edges.png | 齿纹重新出现，上下缘视角和形体不稳定 |
| foundation-rest-master-v1.png | 背面缺口与正面不一致 |

原用户图片、认可正面和旧模型未删除。错误稿退出当前文件树；旧提交可恢复，D盘本地历史目录也保留恢复件，不混进本次设计ZIP。

## 保留和改进

旧完整主稿v2只作为本轮观感修订的父本。新visuals/foundation-refined.png清理了意外齿纹与中央不可靠侧影，保留完整龙、银色、书徽与特别币信息，减轻大面随意划痕。它仍是观感候选；字距、角度、卷草分布和截面按确定性数据执行。

原币胚图仅用于统一背面风格参考，其旧侧面不再提供几何权威。新包不保留任何生成式“精准四视图”作为施工图。

## 避免重复失败

- AI视觉探索保留在完整作品层面。
- 所有重复字体与母纹统一成可编辑轮廓和复制规则。
- 角度从统一工程零点算，不从每张图各自找一个中心。
- 背面由同一世界坐标映射，避免上爪/缺口左右对不上。
- 新制定值标明工作设计，不伪装原稿实测。
- 有机隐藏形体继续需要真实三维证明，不能靠多生几张图宣称解决。

本轮两个内置imagegen请求：第一个网络失败未返回文件，重试返回一张修订稿。没有新订阅、外部付款或云GPU任务。

