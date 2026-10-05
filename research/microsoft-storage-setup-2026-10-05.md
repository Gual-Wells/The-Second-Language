# Microsoft 365 / OneDrive 开通指引

日期：2026-10-05。本项目暂定 Microsoft 365 个人版 OneDrive 作为永久文件基座；D1 继续管理高频小型状态与索引。

## 先确认程序接入资格

1. 用你长期持有的个人 Microsoft 账户登录 [OneDrive](https://onedrive.live.com/)，先打开一次网盘。最终项目文件归此账户所有。
2. 打开 [Azure 门户](https://portal.azure.com/)，或 [Microsoft Entra 管理中心](https://entra.microsoft.com/)，找到 **Entra ID → 应用注册 → 新注册**。如果可以进入，已有开发入口可以继续使用。
3. 如果没有目录或订阅、需要信用卡验证，优先尝试 [Azure for Students](https://azure.microsoft.com/en-us/free/students/)。官方学生计划不要求信用卡，实际学籍是否通过按验证结果确定。东北大学或 UTA 的有效学籍都可以按网站要求尝试，不预先声称一定通过。
4. 能注册后，应用名填 `The Second Language`，支持的账户类型选 **仅个人 Microsoft 账户**；若实际界面没有此项，选支持个人 Microsoft 账户的类型。不要选仅学校/企业单租户。
5. 创建后记下 **应用程序（客户端）ID**。回调地址、权限与凭证等接入配置待工程准备好后由我配合设置，不自行随便填一个网址。客户端 ID 不是密码。

微软当前应用注册说明列出活跃 Azure 订阅、可用租户和至少 Application Developer 权限；新的 Entra ID Free 注册仍可能要求信用卡身份验证。购买 Microsoft 365 本身不证明开发资格已经打通。[应用注册官方流程](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app)、[Entra 免费账户验证](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/microsoft-entra-id-free)

## 再开通容量

1. 打开 [微软中国官方 OneDrive 计划页](https://www.microsoft.com/zh-cn/microsoft-365/onedrive/onedrive-plans-and-pricing)，选择 **Microsoft 365 个人版，年付 398 元**。当前包含 1 TB（1000 GB），月付为 39 元。中国页面列出支付宝与银联等方式，具体交易以结账结果为准。
2. 使用前面的个人 Microsoft 账户购买。支付后回到 OneDrive，确认空间显示 1 TB；学校账户不是永久文件资产的所有者。
3. 不需要额外购买商业版、Azure 虚拟机或 Azure 存储套餐。本项目使用应用注册调用个人网盘，不是把 1 TB 改造成新的 Azure SQL 数据库。
4. 然后由工程完成个人账户的一次授权、少量文件上传/下载/范围读取、Cloudflare 访问与 iPhone 播放验证，再迁移正式数据。

应用注册账户与文件所有者可以不同，但开发应用也应长期可控制。若学校管理员限制应用注册，或毕业后会失去管理入口，应先解决这个实际问题，不让永久运行依赖临时学校权限。

目前尚未登录账户验证、购买、授权或迁移。程序持续刷新授权、订阅续费与独立恢复副本仍需工程配套，购买容量不等于项目接入已经完成。
