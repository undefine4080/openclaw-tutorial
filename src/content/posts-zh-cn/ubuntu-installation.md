---
title: 本地安装部署 OpenClaw — Ubuntu 全流程
description: 用旧电脑 + Ubuntu + OpenClaw 搭建成本为零的 AI 助手。无需 Mac Mini，无需云服务器，无需显卡，Linux 的稳定性加上 OpenClaw 的兼容性，让旧笔记本变成全天候在线的私人 AI。
pubDate: 2026-04-01
lastUpdated: 2026-04-01
tags: ['installation', 'ubuntu', 'linux', 'getting-started']
difficulty: beginner
estimatedTime: '45 minutes'
prerequisites: ['一台旧电脑（建议 2015 年后）', 'U盘（至少 8GB）', '网络连接']
category: installation
order: 1
featured: true
---

> 旧电脑 + Ubuntu + OpenClaw = 成本为零的 AI 助手长期运行方案。
> 不需要 Mac Mini，不需要云服务器，不需要显卡——Linux 的稳定性加上 OpenClaw 的兼容性，
> 足以让你的旧笔记本变成一台全天候在线的私人 AI。

---

## 一、为什么选 Ubuntu + OpenClaw

### Mac Mini 方案的门槛

很多人第一次听说 OpenClaw，都会问："我需要买 Mac Mini 吗？"

不需要。

官方 GitHub README 里原话是这么说的：

> "A Mac mini is optional — some people buy one as an always-on host, but a small VPS, home server, or Raspberry Pi-class box works too."

Mac Mini 之所以受欢迎，是因为它小巧、安静、功耗低，适合长期开机。但它的价格（对很多人来说）是道坎——一台 Mac Mini M4 最低也要 799 美元，而且你还得有苹果生态的积累。

而你家里，很可能就有一台旧笔记本躺在抽屉里吃灰。

### Linux 跑 AI Agent 的天然优势

Linux 不只是服务器专属，跑个人 AI 助手它有几个天然优势：

**稳定性。** Linux 没有 Windows 那种不加提示的强制系统更新（通常需要手动配置才避免），也没有 macOS 的系统完整性保护动不动卡死进程。一个跑在 systemd 下的服务，除非你主动重启或者断电，否则它可以稳定运行几个月甚至一年以上。

**资源占用。** Linux 没有图形桌面的那些后台服务，内存占用通常明显低于 Windows（作者经验）。OpenClaw Gateway 本身就很轻量，官方文档说"512MB-1GB RAM 足够个人使用"，配合 Ubuntu Server 甚至可以把内存压到 512MB。

**长期运行。** 这一点最关键。OpenClaw 的 cron 定时任务和 heartbeat 心跳检测，都依赖 Gateway 持续运行。Linux 的 systemd 守护进程是目前最可靠的进程管理方式，崩溃自动拉起，一跑就是几个月甚至一年。

### 旧电脑配置要求

官方 FAQ 给出的数据：

| 级别 | CPU | 内存 | 磁盘 | 典型设备 |
|------|-----|------|------|----------|
| 最低 | 1 核 | 1 GB | 500 MB | 2010 年后旧笔记本 |
| 推荐 | 1-2 核 | 2 GB+ | 2 GB+ | 2015 年后主流笔记本 |

我自己跑 OpenClaw 的是一台 2015 年的 ThinkPad X250，8GB 内存，Ubuntu 24.04 Desktop 跑起来毫无压力。CPU 占用常年低于 5%，内存占用稳定在 1.2GB 左右（含桌面环境）。

---

## 二、准备工作

### 硬件最低配置

先确认你的旧电脑能不能跑：

- **CPU**：任意 64 位处理器，Intel i3 / AMD Ryzen 3 或以上级别
- **内存**：最低 2GB（低于 2GB 需要额外配置 swap）
- **磁盘**：至少 20GB 可用空间（Ubuntu 安装需要 25GB 左右）
- **网络**：有线网或 WiFi（Ubuntu 24.04 原生支持大多数 WiFi 芯片）
- **最重要的一条**：确保电脑可以接电长期开机，电池老化不是问题

### 备份 Windows 数据

如果你的旧电脑还装着 Windows，第一件事是备份数据。

Ubuntu 安装过程会格式化目标磁盘的系统分区。如果你在同一块磁盘上安装，会清空 Windows 系统区和用户文件区。

**需要备份的内容：**
- 文档、图片、下载文件夹（复制到外接硬盘或 U 盘）
- 浏览器书签（Chrome / Firefox 均有导出功能）
- 任何重要文件

双系统方案是可以做的，但**建议第一次先全盘装 Ubuntu**，把旧 Windows 当作一个"已备份的系统"——很多人装了 Ubuntu 之后就再也没回去过 Windows。

### 下载 Ubuntu 镜像

去 [ubuntu.com/download/desktop](https://ubuntu.com/download/desktop) 下载 **Ubuntu 24.04 LTS Desktop** 镜像文件（ISO，约 4.5GB）。

LTS（Long Term Support）版本意味着 5 年官方维护周期，2029 年之前都不用换系统。

### 制作 Ubuntu 安装 U 盘

你需要一个大容量 U 盘（至少 8GB），以及一个用来制作启动盘的工具。

**Windows 上推荐 Rufus（免费、快速）**

1. 插入 U 盘，下载 [Rufus](https://rufus.ie/zh/)
2. 打开 Rufus，设备选择你的 U 盘
3. 引导类型选择"选择"按钮，找到下载好的 Ubuntu ISO 文件
4. 分区方案选择"GPT"，目标系统类型"UEFI（非 CSM）"
5. 点击"开始"，等待写入完成

**macOS / Linux 上用 balenaEtcher（跨平台）**

1. 下载 [balenaEtcher](https://etcher.balena.io/)
2. 选择 Ubuntu ISO 文件
3. 选择目标 U 盘
4. 点击"Flash"，等待完成

> 💡 **提示**：写入镜像会清空 U 盘原有数据，确认 U 盘里没有重要文件。

---

## 三、安装 Ubuntu Desktop

### BIOS / UEFI 设置

把制作好的 U 盘插入旧电脑，开机。

开机时按 **F2**（或 **Del** / **Esc**，不同品牌按键不同）进入 BIOS/UEFI 设置界面。

需要确认两个设置：

1. **启动顺序**：把 U 盘调到最前面，确保从 U 盘启动而不是硬盘
2. **关闭 Secure Boot**：大多数 Linux 发行版需要关闭 Secure Boot 才能正常启动，找到"Secure Boot"选项，设置为"Disabled"

保存设置并重启。

### Ubuntu 安装过程

正常从 U 盘启动后，你会看到 Ubuntu 的试用界面（"Try Ubuntu"），可以直接体验桌面环境而不安装。这里我们直接点击桌面上的**"Install Ubuntu"**图标开始安装。

**关键步骤：**

1. **语言**：选择"简体中文"或"English"，根据你的偏好来
2. **键盘**：默认即可
3. **安装类型**：
   - 选"清除磁盘并安装 Ubuntu"（全盘安装，推荐第一次尝试）
   - 如果你想保留 Windows 做双系统，选"其他选项"手动分区（需要一点 Linux 分区知识）
4. **时区**：输入"Shanghai"或让系统自动检测
5. **用户名和密码**：记住你的密码——后面安装软件和配置服务都需要 sudo 权限
6. **等待安装**：大约 10-20 分钟，完成后点击"现在重启"

重启后会要求拔出 U 盘，然后正常进入 Ubuntu 桌面。

### 安装后首次配置

进入桌面后，第一件事是更新系统。打开"终端"（快捷键 **Ctrl + Alt + T**），输入：

```bash
sudo apt update && sudo apt upgrade -y
```

这会更新所有软件包到最新版本，通常需要 5-10 分钟。

**然后安装 openssh-server（方便后续远程操作）：**

```bash
sudo apt install -y openssh-server
sudo systemctl enable --now ssh
```

**接着安装 Python（后续很多 skill 需要它）：**

```bash
# Ubuntu 24.04 通常自带 Python 3，先确认一下
python3 --version

# 如果没有或版本低于 3.8，安装它
sudo apt install -y python3 python3-pip python3-venv

# 创建一个常用的 Python 虚拟环境目录（方便后续 skill 使用）
mkdir -p ~/python-envs
python3 -m venv ~/python-envs/default
```

如果你的电脑 WiFi 驱动在安装时没有自动识别，先用有线网解决网络问题，大多数 Intel / Realtek / MediaTek 无线芯片在连接网络后会自动下载驱动。

---

## 四、安装 Node.js 与 OpenClaw

### 安装 Node.js

OpenClaw 要求 Node.js **22.14 或更高版本**，官方推荐 **Node 24**。

Ubuntu 24.04 默认仓库里的 Node.js 版本可能不够新，我们需要通过 NodeSource 安装脚本获取最新版。

在终端里依次执行：

```bash
# 下载并执行 NodeSource 安装脚本（安装 Node 24）
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -

# 安装 Node.js 和 build-essential（编译工具）
sudo apt install -y nodejs build-essential

# 验证安装
node --version   # 应该显示 v24.x.x
npm --version    # 应该显示 10.x.x 或更高
```

> 💡 **推荐使用 fnm 版本管理器**：如果你以后需要切换 Node 版本（比如跑其他项目），可以装 fnm：
> ```bash
> curl -fsSL https://fnm.vercel.app/install | bash
> fnm install 24
> fnm use 24
> ```
> fnm 是一款快速的 Node 版本管理器，支持 fish/zsh/bash。

### 一键安装 OpenClaw

Node.js 就绪之后，安装 OpenClaw 只需要一行命令：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

这个安装脚本会：
1. 检测你的操作系统（Linux）
2. 确认 Node.js 版本符合要求
3. 通过 npm 全局安装 OpenClaw
4. 完成后提示运行 `openclaw onboard`

### 运行 Onboard 向导

安装完成后，启动引导配置流程：

```bash
openclaw onboard --install-daemon
```

`--install-daemon` 参数会让向导自动配置 systemd 守护进程，实现开机自启。

Onboard 会一步步引导你配置：

- **工作目录**：默认 `~/.openclaw/workspace`，直接回车
- **LLM Provider**：输入你的 API Key（Anthropic / OpenAI / MiniMax 等）
- **消息渠道**：飞书、Telegram、Discord 等（可选，后面也能再配）
- **守护进程**：systemd 服务，后台长期运行那种

配置完成后，向导会显示 **Control UI 地址**（通常是 `http://127.0.0.1:18789/`），打开浏览器访问即可看到 OpenClaw 的控制面板。

**验证安装成功：**

```bash
openclaw --version      # 查看版本号
openclaw gateway status  # 查看 Gateway 运行状态
openclaw doctor          # 全面检查配置问题
```

如果一切正常，你会看到 `Runtime: running` 的输出。

> 🎉 **到这里，OpenClaw 已经安装完成并运行在后台了。**

---

## 五、用 systemd 让 OpenClaw 常驻后台

### systemd 是什么

systemd 是 Linux 的服务管理器，负责启动、停止、监控后台服务。用它管 OpenClaw，意味着三件事：

- **开机自启**：电脑重启后自动拉起，不需要手动操作
- **崩溃自愈**：OpenClaw 意外崩了？systemd 会自动重启它
- **日志管理**：所有输出自动记到系统日志，查问题很方便

`openclaw onboard --install-daemon` 已经帮我们配置好了 systemd 服务，但如果需要手动管理，下面的命令会用到。

### 常用管理命令

```bash
# 查看运行状态
openclaw gateway status

# 停止服务
openclaw gateway stop

# 启动服务
openclaw gateway start

# 重启服务（改配置后重启生效）
openclaw gateway restart
```

**直接操作 systemd：**

```bash
# 查看 systemd 服务状态（带详细信息）
systemctl --user status openclaw-gateway

# 实时查看日志（排查问题时非常有用）
journalctl --user -u openclaw-gateway -f

# 最近 100 行日志
journalctl --user -u openclaw-gateway -n 100
```

> 💡 **`journalctl` 是排查 OpenClaw 问题的首选工具**，当你的 Bot 不回消息、连接失败、或者任何奇怪的问题时，先用 `-f` 实时看日志，大部分时候错误原因就写在日志里。

### 开机自启

如果 `--install-daemon` 没能自动启用开机自启，手动开启：

```bash
# 启用开机自启
loginctl enable-linger $USER

# 确认服务是否设置开机自启
systemctl --user list-unit-files | grep openclaw
```

---

## 六、常见问题与踩坑

这一章是重点，我从官方文档和实际部署经验里整理出最常见的坑，帮你提前避雷。

### 1. 安装完成后 `openclaw: command not found`

这是最常见的问题，十有八九是 **npm 全局 bin 目录没加入 PATH**。

**排查步骤：**

```bash
# 第一步：确认 npm prefix 在哪里
npm prefix -g
# 输出类似：/home/你的用户名/.npm-global

# 第二步：看看这个路径在不在 PATH 里
echo $PATH | tr ':' '\n' | grep npm
# 如果没有输出，说明就是这里的问题
```

**解决方法——设置用户级 npm 全局目录：**

```bash
mkdir -p "$HOME/.npm-global"
npm config set prefix "$HOME/.npm-global"
```

然后把下面这行加到你的 `~/.bashrc`（或 `~/.zshrc`）文件末尾：

```bash
export PATH="$HOME/.npm-global/bin:$PATH"
```

保存后执行：

```bash
source ~/.bashrc
```

再试 `openclaw --version`，应该就能正常工作了。

### 2. npm 安装时报 `EACCES` 权限错误

Linux 上有些系统把 npm 全局目录指向了 root 拥有的路径，普通用户没有写入权限。

**官方推荐的解决方案**（同样适用上面第一条）：

```bash
mkdir -p "$HOME/.npm-global"
npm config set prefix "$HOME/.npm-global"
export PATH="$HOME/.npm-global/bin:$PATH"
```

把 export 那行加到 `~/.bashrc` 里让它永久生效。

### 3. sharp 构建失败（npm install 时报错）

如果你在 npm 全局安装时遇到 sharp（图片处理库）构建失败，尝试：

```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
```

这会让 sharp 使用内置的 libvips 而不是系统版本，避免版本冲突。

### 4. OpenClaw 安装脚本卡住不动

脚本运行时没有任何输出？加 `--verbose` 参数看详细过程：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --verbose
```

如果看到脚本在"Install Node"阶段很久不动，说明 Node.js 安装可能有问题，可以手动先装 Node.js（参考第四章），然后重新运行安装脚本并加 `--no-onboard` 跳过 Node 安装步骤：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
```

### 5. Gateway running 但 Bot 不回消息

通常问题出在 **pairing（配对）设置**上。OpenClaw 默认 DM 策略是"配对模式"——陌生人的消息会被静默拦截，只有你授权的账户才能触发 Bot。

**排查命令：**

```bash
# 查看渠道连接状态
openclaw channels status --probe

# 查看当前所有 pairing 请求
openclaw pairing list --channel telegram   # 替换成你用的渠道
```

如果你用的是 Telegram，给自己发一条消息，然后查看 pairing list——你会看到一个 pending 请求，用下面的命令批准：

```bash
openclaw pairing approve --channel telegram <配对码>
```

批准之后，Bot 就会正常回复你的消息了。

### 6. cron 定时任务不触发

如果你的每日提醒、每日摘要没有按时执行，首先确认：

```bash
# Gateway 是否在运行
openclaw gateway status
# 应该显示 Runtime: running

# cron 是否启用
openclaw cron status
```

**关键点**：cron 任务依赖 Gateway 持续运行。如果 Gateway 停了（比如手动关闭了电脑），cron 任务不会"补发"，下次 Gateway 启动时任务才会重新开始计时。

如果你需要 24/7 运行的 cron 任务，确保你的电脑保持开机，或者考虑把 OpenClaw 部署在一台常年开机的设备上（旧笔记本 + 合上盖子 + 接电 = 天然的静音服务器）。

### 7. 内存不够用

旧电脑只有 1-2GB 内存的话，跑 Ubuntu Desktop + OpenClaw 会比较吃力。以下优化可以改善：

**添加 swap（虚拟内存）：**

```bash
# 创建 2GB swap 文件
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 永久启用
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 降低 swap 使用频率（内存不足时才用 swap）
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

**关闭不必要的桌面服务：**

```bash
# 关闭蓝牙（省内存 + 省电）
sudo systemctl disable bluetooth

# 关闭不需要的启动项（在"启动应用程序"里取消勾选）
```

**或者，直接用 Ubuntu Server（无桌面）代替 Desktop**：Ubuntu Server 最低只需要 512MB 内存，整个系统占用不到 1GB，剩下的全给 OpenClaw。

### 8. 排查问题的标准流程

遇到任何问题，先跑一遍这个"前 60 秒检查清单"：

```bash
# 1. 快速状态
openclaw status

# 2. 完整报告
openclaw status --all

# 3. Gateway 健康检查
openclaw gateway status

# 4. 自动修复（很多配置问题用它能自动修复）
openclaw doctor

# 5. 实时日志（最有用，看正在发生什么）
openclaw logs --follow
```

这 5 条命令按顺序执行，能覆盖大多数常见问题。如果还有疑问，OpenClaw 官方文档和 Discord 社区都很活跃。

---

## 总结

用旧电脑装 Ubuntu + OpenClaw，其实比想象中简单得多：

1. Ubuntu 24.04 LTS 对旧硬件极其友好，4GB 内存的笔记本跑起来毫无压力
2. OpenClaw 安装脚本几乎是一键搞定，Node.js 自动装，systemd 自动配
3. Linux + systemd 的组合让"长期稳定运行"变成默认状态，不需要任何额外配置
4. 成本为零——一台你本来要扔掉的旧笔记本，变成了全天候在线的私人 AI 助手

Mac Mini 是一个好方案，但不是唯一的方案。你手里如果有旧电脑，现在就可以动手了。

---

> **参考资料**
> - [OpenClaw 官方安装文档](https://docs.openclaw.ai/install)
> - [OpenClaw Node.js 配置指南](https://docs.openclaw.ai/install/node)
> - [OpenClaw FAQ](https://docs.openclaw.ai/help/faq)
> - [OpenClaw Troubleshooting](https://docs.openclaw.ai/help/troubleshooting)
> - [Ubuntu 24.04 LTS 下载](https://ubuntu.com/download/desktop)
> - [OpenClaw GitHub 仓库](https://github.com/openclaw/openclaw)
