---
title: Install OpenClaw on Ubuntu Desktop from Scratch
description: A complete guide for beginners to install Ubuntu Desktop on an old Windows PC and deploy OpenClaw AI agent, dual-boot setup for better performance
pubDate: 2026-03-15
lastUpdated: 2026-03-15
tags: ['openclaw', 'ubuntu', 'installation', 'tutorial']
difficulty: beginner
estimatedTime: '2 hours'
prerequisites: ['A working Windows PC', '8GB+ RAM', 'An 8GB+ USB drive']
alternates:
  zhCN: /zh-cn/posts/install-openclaw-on-ubuntu-desktop
---

# 0 基础在 Ubuntu Desktop 上安装 OpenClaw 完整指南

## TL;DR（30 秒快速总结）

OpenClaw 在 Ubuntu 原生环境下运行性能最佳，相比 Windows 和 WSL2 有明显优势。安装流程：准备 8GB+ U 盘 → 下载 Ubuntu 24.04 LTS ISO → 用 Rufus 制作启动盘 → 从 U 盘启动安装 Ubuntu → 在 Ubuntu 上一键安装 OpenClaw → 配置 AI 模型 → 完成！全程约 2-3 小时。

## 为什么要用 Ubuntu 而不是 Windows 或 WSL2？

在开始之前，先回答一个重要问题：为什么要折腾安装 Ubuntu，直接在 Windows 上用 WSL2 不行吗？

### Ubuntu 原生环境的 7 大优势

1. **完全的硬件访问**：Ubuntu 直接访问 CPU、GPU、内存，没有虚拟化层，性能最优
2. **完整的 systemd 支持**：OpenClaw 需要 systemd 进行进程托管，Ubuntu 原生支持，无需额外配置
3. **更好的网络处理**：没有 WSL 网络隔离问题，OAuth 回调、WebSocket 连接都更稳定
4. **更高的性能表现**：没有虚拟化开销，CPU、GPU、内存效率都更高
5. **更好的稳定性**：适合 24/7 长期运行，不用担心 Windows 更新或 WSL 重启
6. **简单的配置**：不需要配置 .wslconfig、wsl.conf 等复杂文件
7. **完整的 Linux 生态**：可以充分利用 Linux 工具和库

### WSL2 的 4 大致命问题

根据实际部署经验，WSL2 存在以下问题：

1. **环境变量死锁**：CLI 可能被配置文件锁死，无法执行任何命令
2. **systemd 版本隔离**：WSL2 默认不启动 systemd，需要手动配置，而且容易出错
3. **网络隔离**：OAuth 回调无法穿透 WSL 网络隔离，Google Gemini 等需要 OAuth 的服务无法使用
4. **服务版本不一致**：CLI 升级后，后台 systemd 服务可能仍指向旧版本，导致功能异常

### Windows 原生的局限性

- **systemd 不支持**：Windows 不支持 systemd，OpenClaw 守护进程无法运行
- **性能开销**：Windows 系统本身的开销较大
- **兼容性问题**：许多 Linux 原生工具不支持
- **不适合 24/7 运行**：Windows 更新和重启会中断服务

**结论**：如果你有一台旧 Windows 电脑，安装 Ubuntu 双系统是运行 OpenClaw 的最佳选择。

## 前置要求

开始之前，请准备以下物品：

### 硬件要求
- ✅ 一台能开机的 Windows 电脑（推荐 8GB+ 内存，4GB 也能跑但性能会受限）
- ✅ 至少 50GB 的空闲硬盘空间（建议 100GB+）
- ✅ 一个 8GB 或更大的 U 盘（数据会被清空，务必备份）
- ✅ 稳定的网络连接

### 软件准备
- ✅ 下载 Ubuntu 24.04 LTS ISO 镜像：[https://ubuntu.com/download/desktop](https://ubuntu.com/download/desktop)
- ✅ 下载 Rufus 启动盘制作工具：[https://rufus.ie/zh/](https://rufus.ie/zh/)
- ✅ 准备一个模型 API Key：
  - DeepSeek：[https://platform.deepseek.com/](https://platform.deepseek.com/)（注册即送额度，推荐新手）
  - OpenAI：[https://platform.openai.com/](https://platform.openai.com/)
  - 其他支持 OpenAI 兼容 API 的服务商

### 预估时间
- 下载 Ubuntu ISO：20-40 分钟
- 制作启动盘：10-30 分钟
- 安装 Ubuntu：30-60 分钟
- 安装配置 OpenClaw：30-60 分钟
- **总计**：约 2-3 小时

## 步骤 1：准备工作

### 1.1 检查系统信息

首先确认你的电脑支持 UEFI 启动模式：

1. 按 `Win + R` 键，输入 `msinfo32`，回车
2. 在"系统摘要"中查看以下信息：
   - **BIOS 模式**：应该是 **UEFI**（不是 Legacy）
   - **安全启动状态**：应该是 **关闭**（Disabled）
   - **物理内存**：记录你的内存大小，后续分区时需要

如果安全启动状态是开启的，需要进入 BIOS 关闭：
1. 重启电脑
2. 根据主板品牌进入 BIOS（不同品牌热键不同）：
   - 微星（MSI）：Delete 或 F11
   - 华硕（ASUS）：Delete 或 F2
   - 技嘉（Gigabyte）：Delete 或 F2
   - 戴尔（Dell）：F2 或 F12
   - 惠普（HP）：F10 或 ESC
3. 找到"Security Boot"或"安全启动"选项，设置为 **Disabled** 或 **关闭**
4. 保存并退出 BIOS

### 1.2 为 Ubuntu 划分硬盘空间

在 Windows 中为 Ubuntu 划分空闲分区：

1. 右键点击"此电脑" → "管理"
2. 选择"磁盘管理"
3. 找到你的系统盘（通常是 C 盘）
4. 右键点击 C 盘 → "压缩卷"
5. 在"输入压缩空间量"中输入要分配给 Ubuntu 的大小（至少 50000 MB，建议 100000 MB）
6. 点击"压缩"

完成后，磁盘管理中会出现一个未分配的空间，这就是 Ubuntu 的安装空间。

### 1.3 下载必要文件

1. **下载 Ubuntu 24.04 LTS**：
   - 访问 [https://ubuntu.com/download/desktop](https://ubuntu.com/download/desktop)
   - 点击"Download"按钮下载 ISO 镜像（约 3.7GB）
   - 等待下载完成

2. **下载 Rufus**：
   - 访问 [https://rufus.ie/zh/](https://rufus.ie/zh/)
   - 下载"便携版"（Portable）
   - 解压到任意目录

## 步骤 2：制作 Ubuntu 启动盘

### 2.1 使用 Rufus 制作启动盘

1. 插入 U 盘（数据会被清空，务必备份重要文件）
2. 以管理员身份运行 Rufus
3. 在 Rufus 界面中进行以下配置：
   - **设备**：选择你的 U 盘
   - **引导类型选择**：点击"选择"，选择下载的 Ubuntu ISO 文件
   - **分区类型**：GPT（如果你的电脑是 UEFI 模式）
   - **目标系统类型**：UEFI（非 CSM）
   - **文件系统**：FAT32
   - **簇大小**：默认即可
4. 点击"开始"按钮
5. 如果提示"以 ISO 镜像模式还是以 DD 模式写入？"，选择 **ISO 镜像模式**
6. 如果提示"下载新的 EFI 镜像"，选择 **是**
7. 等待制作完成（10-30 分钟，取决于 U 盘速度）

### 2.2 验证启动盘

1. 制作完成后，Rufus 会显示"准备就绪"
2. 在文件资源管理器中打开 U 盘，应该能看到 Ubuntu 的安装文件
3. 拔出 U 盘

## 步骤 3：安装 Ubuntu Desktop

### 3.1 从 U 盘启动

1. 关闭电脑
2. 插入制作好的 Ubuntu 启动盘
3. 开机时，根据主板品牌按对应的快捷键进入启动菜单：
   - 微星（MSI）：F11
   - 华硕（ASUS）：F8 或 ESC
   - 技嘉（Gigabyte）：F12
   - 戴尔（Dell）：F12
   - 惠普（HP）：F9
   - 联想（Lenovo）：F12 或 F10
4. 在启动菜单中选择你的 U 盘（通常显示为 USB 或 UEFI: USB）
5. 等待进入 Ubuntu 安装界面

### 3.2 进入安装流程

1. 在 Ubuntu 启动菜单中，选择 **"Try Ubuntu"**（试用 Ubuntu）
2. 进入 Ubuntu 桌面后，双击桌面上的 **"Install Ubuntu 24.04 LTS"** 图标
3. 选择语言：推荐选择 **English**（可以避免路径中包含中文导致的问题）
4. 点击"Continue"

### 3.3 安装设置

1. **键盘布局**：选择你的键盘布局（通常是 US English）
2. 点击"Continue"
3. **安装类型和更新**：选择 **"Normal installation"**（正常安装）
   - 勾选"Download updates while installing Ubuntu"（安装时下载更新）
   - 勾选"Install third-party software for graphics and Wi-Fi hardware..."（安装第三方驱动）
4. 点击"Continue"
5. **安装类型**：选择 **"Install Ubuntu alongside Windows Boot Manager"**（与 Windows 共存）
6. 点击"Install Now"
7. 如果提示"Write the changes to disks?"，点击 **"Continue"**

### 3.4 配置分区（如果选择手动分区）

如果你选择手动分区，按照以下比例分配：

| 分区 | 挂载点 | 大小 | 类型 | 用途 |
|------|--------|------|------|------|
| 根分区 | `/` | 空闲空间的 30% | Ext4 | 系统文件 |
| 启动分区 | `/boot` | 512 MB | Ext4 | 启动引导 |
| 交换分区 | swap | 物理内存的 2 倍 | Linux swap | 虚拟内存 |
| 用户分区 | `/home` | 剩余所有空间 | Ext4 | 用户数据 |

例如，如果你分配给 Ubuntu 100GB，有 16GB 内存：
- 根分区 `/`：约 30GB
- 启动分区 `/boot`：512MB
- 交换分区 swap：32GB
- 用户分区 `/home`：约 37.5GB

### 3.5 完成安装

1. **选择地区**：选择你的时区（如 Shanghai）
2. 点击"Continue"
3. **设置用户信息**：
   - **Your name**：输入你的名字
   - **Your computer's name**：输入计算机名（如 ubuntu-desktop）
   - **Pick a username**：输入用户名（建议小写，如 yourname）
   - **Choose a password**：设置一个强密码（务必记住！）
   - 不勾选"Log in automatically"（自动登录）或"Require my password to log in"（需要密码登录）
4. 点击"Continue"
5. 等待安装完成（10-30 分钟）
6. 安装完成后，点击 **"Restart Now"** 重启
7. 拔出 U 盘
8. 重启后，你会看到操作系统选择界面，选择 **Ubuntu** 进入系统

## 步骤 4：首次启动 Ubuntu

### 4.1 完成初始设置

1. 进入 Ubuntu 桌面后，系统可能会提示你进行初始设置：
   - 选择是否开启位置服务：推荐关闭
   - 选择是否连接在线账户：可以跳过
   - 设置隐私设置：推荐选择推荐设置
2. 打开"设置"（Settings）：
   - 检查"关于"（About）→ "操作系统"（OS）信息
   - 确认 Ubuntu 版本为 24.04 LTS

### 4.2 更新系统

打开终端（Terminal），输入以下命令：

```bash
# 更新软件包列表
sudo apt update

# 升级已安装的软件包
sudo apt upgrade -y

# 清理不需要的软件包
sudo apt autoremove -y
```

### 4.3 安装必要的工具

```bash
# 安装 Node.js 22（OpenClaw 要求）
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# 验证 Node.js 版本
node -v
# 应该输出 v22.x.x

# 验证 npm 版本
npm -v
# 应该输出 10.x.x 或更高

# 安装一些有用的工具
sudo apt install -y git curl wget htop vim
```

## 步骤 5：安装 OpenClaw

### 5.1 使用官方一键安装脚本

```bash
# 一键安装 OpenClaw
curl -fsSL https://openclaw.ai/install.sh | bash

# 等待安装完成...
```

### 5.2 验证安装

```bash
# 检查 OpenClaw 版本
openclaw --version

# 运行环境诊断
openclaw doctor
```

### 5.3 配置 OpenClaw

```bash
# 运行配置向导
openclaw onboard --install-daemon
```

向导会询问你以下问题：
1. **选择默认模型**：选择你准备好的 API Key 对应的模型（如 DeepSeek）
2. **选择 IM 通道**：选择飞书（Feishu）或 Telegram
3. **是否启用守护进程**：选择 **Yes**

### 5.4 配置 API Key

如果你选择 DeepSeek，配置 API Key：

```bash
# 设置 DeepSeek API Key
openclaw config set env.DEEPSEEK_API_KEY "your-deepseek-api-key-here"
```

如果你选择 OpenAI，配置 API Key：

```bash
# 设置 OpenAI API Key
openclaw config set env.OPENAI_API_KEY "your-openai-api-key-here"
```

### 5.5 启动 OpenClaw 服务

```bash
# 启用并启动 OpenClaw Gateway 服务
systemctl --user enable --now openclaw-gateway.service

# 检查服务状态
systemctl --user status openclaw-gateway.service

# 检查 OpenClaw 详细状态
openclaw status --deep
```

### 5.6 打开 OpenClaw 仪表板

```bash
# 打开 Web 仪表板
openclaw dashboard
```

这会在浏览器中打开 OpenClaw 的 Web 界面，你可以在那里配置和管理你的 AI 智能体。

## 步骤 6：配置飞书或 Telegram 通道

### 6.1 配置飞书（推荐）

飞书是国内用户的首选，原因：
- ✅ 国内网络直连，无需代理
- ✅ 注册零门槛
- ✅ 长连接模式不需要公网域名
- ✅ 国内职场普及率高

**配置步骤**：

1. **创建飞书应用**：
   - 访问 [https://open.feishu.cn/app](https://open.feishu.cn/app)
   - 创建"企业自建应用"
   - 记录 App ID 和 App Secret

2. **配置应用权限**（必须配置以下 3 个权限）：
   - `im:message:send_as_bot`（发送消息）
   - `im:message.p2p_msg:readonly`（读取私聊消息）
   - `im:message.group_at_msg:readonly`（读取群组 @ 消息）

3. **配置事件订阅**：
   - 选择"长连接"模式
   - 添加事件：`im.message.receive_v1`
   - 创建版本、提审、发布

4. **在 OpenClaw 中添加飞书通道**：
   ```bash
   openclaw channels add feishu
   # 输入 App ID 和 App Secret
   ```

5. **重启 Gateway**：
   ```bash
   openclaw gateway restart
   openclaw logs --follow
   # 看到 "feishu connected" 表示成功
   ```

### 6.2 配置 Telegram（可选）

Telegram 需要代理环境，适合有代理条件的用户。

**配置步骤**：

1. **创建 Telegram Bot**：
   - 在 Telegram 中搜索 @BotFather
   - 发送 `/newbot` 命令
   - 按提示设置 Bot 名称
   - 记录 Bot Token

2. **在 OpenClaw 中添加 Telegram 通道**：
   ```bash
   openclaw channels add telegram
   # 输入 Bot Token
   # dmPolicy 选择 pairing
   ```

3. **重启 Gateway**：
   ```bash
   openclaw gateway restart
   openclaw logs --follow
   # 看到 "telegram connected" 表示成功
   ```

## 常见问题及解决方案

### Ubuntu 安装问题

**Q: 无法从 U 盘启动**
- A: 检查 BIOS 启动顺序，确保 U 盘排在第一；尝试更换 USB 接口；确保 U 盘制作成功

**Q: 安装过程中卡住**
- A: 检查 ISO 镜像是否下载完整；尝试重新制作启动盘；在 BIOS 中关闭 Secure Boot

**Q: 安装后无法启动 Windows**
- A: 使用 Ubuntu 中的 Boot Repair 工具修复引导；确保安装时选择了"与 Windows 共存"

### OpenClaw 安装问题

**Q: 找不到 openclaw 命令**
- A: 将 `$(npm prefix -g)/bin` 添加到 PATH：
  ```bash
  echo 'export PATH="$(npm prefix -g)/bin:$PATH"' >> ~/.bashrc
  source ~/.bashrc
  ```

**Q: Node.js 版本过低**
- A: 使用 nvm 安装最新版：
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  source ~/.bashrc
  nvm install 22
  nvm use 22
  ```

**Q: systemd 服务无法启动**
- A: 检查 systemd 是否正常运行：
  ```bash
  systemctl --user status
  ```
  如果报错，可能是 systemd 配置问题，需要检查 `/etc/systemd/user.conf`

**Q: 模型调用失败**
- A: 检查 API Key 是否正确；检查网络连接；使用 `openclaw status --deep` 检查系统状态

### 性能问题

**Q: OpenClaw 响应很慢**
- A: 检查系统资源使用情况：
  ```bash
  htop
  ```
  如果内存不足，考虑增加交换分区或升级硬件

**Q: GPU 无法使用**
- A: 安装 GPU 驱动：
  ```bash
  sudo apt install -y nvidia-driver-535
  ```
  重启后检查：
  ```bash
  nvidia-smi
  ```

## 总结

完成以上步骤后，你已经在 Ubuntu Desktop 上成功安装了 OpenClaw！

### 回顾关键步骤

1. ✅ 确认电脑支持 UEFI，关闭安全启动
2. ✅ 在 Windows 中为 Ubuntu 划分硬盘空间
3. ✅ 下载 Ubuntu 24.04 LTS 和 Rufus
4. ✅ 使用 Rufus 制作 Ubuntu 启动盘
5. ✅ 从 U 盘启动安装 Ubuntu
6. ✅ 安装 Node.js 22
7. ✅ 一键安装 OpenClaw
8. ✅ 配置 API Key 和 IM 通道
9. ✅ 启动 OpenClaw 服务

### Ubuntu vs Windows WSL2 的性能对比总结

| 指标 | Ubuntu 原生 | Windows WSL2 | Windows 原生 |
|------|------------|-------------|--------------|
| 硬件访问 | 完整 | 虚拟化 | 完整 |
| systemd 支持 | 原生 | 需配置 | 不支持 |
| 网络隔离 | 无 | 有 | 无 |
| OAuth 回调 | 正常 | 黑洞 | 正常 |
| 虚拟化开销 | 无 | 有 | 无 |
| 24/7 运行 | 优秀 | 一般 | 不推荐 |
| 配置复杂度 | 简单 | 复杂 | 不适用 |
| 性能表现 | 最佳 | 良好 | 较差 |

### 下一步

1. **探索 OpenClaw 功能**：学习如何创建和管理 AI 智能体
2. **集成更多模型**：尝试接入 DeepSeek、OpenAI、Gemini 等多个模型
3. **配置多通道**：同时接入飞书、Telegram 等多个 IM 通道
4. **优化性能**：根据需要调整系统配置，提升性能
5. **备份配置**：定期备份 `~/.openclaw` 目录，避免配置丢失

### 有用的命令

```bash
# 检查 OpenClaw 状态
openclaw status
openclaw status --deep

# 查看日志
openclaw logs
openclaw logs --follow

# 重启服务
openclaw gateway restart

# 检查系统健康
openclaw doctor

# 打开仪表板
openclaw dashboard

# 查看 Gateway 服务状态
systemctl --user status openclaw-gateway.service

# 查看 Gateway 服务日志
journalctl --user -u openclaw-gateway.service -f
```

## 参考资料

- OpenClaw 官方文档：[https://docs.openclaw.ai](https://docs.openclaw.ai)
- Ubuntu 官方网站：[https://ubuntu.com](https://ubuntu.com)
- Rufus 官方网站：[https://rufus.ie](https://rufus.ie)
- DeepSeek 平台：[https://platform.deepseek.com](https://platform.deepseek.com)

---

**恭喜你！** 你现在拥有了一个运行在 Ubuntu Desktop 上的 OpenClaw AI 智能体，相比 Windows 和 WSL2，性能更优、配置更简单、稳定性更好。开始享受你的 AI 同事吧！
