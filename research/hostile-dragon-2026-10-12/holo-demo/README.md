# 仇视之龙 · 全息艺术卡视觉小样

日期：2026-10-10。独立艺术试样，不属于任何正式章节或认证资产。未改变正式工程及制作协议。

入口：https://the-second-language-holo-lab.pages.dev/

本机入口：index.html，需要同目录 style.css、app.js 和 assets/dragon-original.png。

## 实际制作

主画面使用内置 imagegen 生成，原始图像1024×1536。保持原件，副本存 assets/dragon-original.png。它是二维原创图像；没有完整三维网格、二维骨骼或独立龙头/爪图层。代码实现的是可拖动平面、小幅倾斜、局部箔面着色、红光、局部轻微雾光、原画对照、近看及双指缩放。不把二维图像的光泽效果声称为真实空间全息或雕塑。

光学效果为本地原创 WebGL shader，未复制研究参考站的卡图或源码。没有生产后台、KV、D1、分析模型实时调用、音效或背面。这轮专门评估视觉和交互。

## 验证与发布

review/verification.json 保存 Chromium 模拟手机视口测试结果；拖动停止自动演示、双指缩放、释放指针、材质开关及无横向溢出均已检查。review/front.png、foil.png、detail.png 为实际运行截图，demo.mp4 为实际页面逐帧录制，不是图生视频。尚未做 iPhone17 真机 Safari/PWA、持续发热和手感验收。

发布为独立 Cloudflare Pages 纯静态项目。没有新增订阅或外部付费模型调用；图像使用现有工具额度，具体额度刷新规则不在本小样中推定。

生成提示词见 PROMPT.md。资产、代码和记录均实际存D盘。
