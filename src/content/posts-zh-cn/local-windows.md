---
title: 本地安装部署 OpenClaw —— Windows 全流程
description: Windows 上通过 WSL2 安装部署 OpenClaw 的完整指南，包含 9 个常见踩坑的解决方案，从系统要求到成功运行的完整流程
pubDate: 2026-03-29
lastUpdated: 2026-03-29
tags: ['installation', 'windows', 'wsl2', 'local-deployment']
difficulty: beginner
estimatedTime: '30 minutes'
prerequisites: ['Windows 10 1903+', 'WSL2', 'Basic terminal knowledge']
category: 'installation'
order: 2
---

# 本地安装部署 OpenClaw —— Windows 全流程

## 一、先说结论：用 WSL2，不要原生 Windows

你可能在网上看到过 OpenClaw 提供了 Windows PowerShell 安装脚本：

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

心想直接跑一下不就完事了？

别急。

原生 Windows 上跑 OpenClaw，目前处于"勉强能用"的状态。不是说完全不能跑，而是你会踩到一堆意想不到的坑：

- **安装阶段**：`sharp` 等 native 包的 postinstall 脚本在 PowerShell 里会因语法解析问题直接报错（管道符 `||` 被误识别），导致 npm/pnpm/安装脚本三种方式全部失败 [[1]](https://github.com/openclaw/openclaw/issues/25282)
- **运行时**：每次执行命令都会弹出一个黑色控制台窗口一闪而过，跑个 cron 定时任务能给你弹 47 个窗口 [[2]](https://github.com/openclaw/openclaw/issues/22851)
- **中文乱码**：PowerShell 默认用 GBK 编码，exec 工具输出的中文全部变成 `??????` [[3]](https://github.com/openclaw/openclaw/issues/56462)
- **Gateway 重启**：`openclaw gateway restart` 在 Windows 上会同时启动 3 个进程竞争端口 [[4]](https://github.com/openclaw/openclaw/issues/52044)
- **路径解析**：workspace 放在 `~/.openclaw/` 下面时，路径会被错误展开成双重叠加的怪物路径 [[5]](https://github.com/openclaw/openclaw/issues/56591)

OpenClaw 团队确实在积极修复这些问题（GitHub 上能看到大量 `fix(windows):` 开头的 PR），但截至目前，这些问题还没有全部合入稳定版。

而 WSL2 呢？它就是 Linux。上面这些坑全部不存在。官方文档也明确写了：

> 在 Windows 上，我们强烈建议你在 WSL2 下运行 OpenClaw。

所以，除非你只是想跑个 `openclaw --version` 截个图，否则请直接用 WSL2。

---

## 二、前置准备：你的 Windows 需要什么

在开始之前，确认一下你的环境：

| 项目 | 要求 |
|------|------|
| 系统版本 | Windows 10 版本 1903+（内部版本 18362+）或 Windows 11 |
| CPU 虚拟化 | 必须在 BIOS/UEFI 中开启（Intel VT-x 或 AMD-V） |
| 硬件 | 至少 4GB 内存，建议 8GB+ |
| 磁盘空间 | 至少 5GB 可用空间（WSL + Ubuntu + OpenClaw） |
| 网络 | 需要访问 GitHub 和 npm（国内网络可能需要代理） |

怎么检查 Windows 版本？按 `Win + R`，输入 `winver`，回车，弹窗里会显示版本号。

怎么检查虚拟化是否开启？打开任务管理器（`Ctrl + Shift + Esc`）→ 性能 → CPU，右下角应该显示"虚拟化：已启用"。如果显示"已禁用"，你需要重启进 BIOS/UEFI 设置，找到 Intel VT-x / AMD-V / SVM Mode 之类的选项并开启。不同主板的 BIOS 界面不一样，搜一下你的主板型号 + "开启虚拟化"就能找到教程。

---

## 三、第一步：安装 WSL2 + Ubuntu

### 3.1 一条命令搞定

以管理员身份打开 PowerShell（右键开始菜单 → "终端(管理员)"），然后执行：

```powershell
wsl --install
```

这条命令会自动完成以下操作：
- 启用"适用于 Linux 的 Windows 子系统"功能
- 启用"虚拟机平台"功能
- 下载并安装默认的 Linux 发行版（Ubuntu）
- 安装 WSL2 Linux 内核更新包

如果装完后 Windows 提示需要重启，那就重启，别犹豫。

### 3.2 想指定 Ubuntu 版本？

如果你想用特定版本的 Ubuntu（比如 Ubuntu 24.04 LTS），可以这样：

```powershell
# 查看可用的发行版列表
wsl --list --online

# 安装指定的发行版
wsl --install -d Ubuntu-24.04
```

### 3.3 首次启动设置

安装完成后，会自动弹出一个终端窗口，要求你创建 Linux 用户名和密码。几个注意点：

- 用户名用纯英文小写，不要用中文
- 密码输入时不会显示任何字符，这是 Linux 的正常行为
- 记住你设的密码，后面 `sudo` 会用到

### 3.4 验证安装成功

在 PowerShell 中执行：

```powershell
wsl --list --verbose
```

输出应该类似：

```
  NAME            STATE           VERSION
* Ubuntu          Running         2
```

确认 VERSION 是 2（不是 1）。如果是 1，执行：

```powershell
wsl --set-default-version 2
wsl --set-version Ubuntu 2
```

---

## 四、第二步：配置 WSL 环境

### 4.1 启用 systemd（关键步骤）

OpenClaw 的 Gateway 需要 systemd 来管理后台服务。WSL2 默认不开启 systemd，需要手动配置一下。

打开 WSL 终端（在 PowerShell 里输入 `wsl` 回车），执行：

```bash
sudo tee /etc/wsl.conf >/dev/null <<'EOF'
[boot]
systemd=true
EOF
```

然后从 Windows 侧关闭 WSL 让配置生效。注意，这条命令要在 PowerShell 里执行，不是 WSL 里：

```powershell
wsl --shutdown
```

重新打开 Ubuntu（开始菜单里搜 "Ubuntu" 或在 PowerShell 里输入 `wsl`），验证 systemd：

```bash
systemctl --user status
```

如果输出一堆 `.service` 的状态信息而不是报错，就说明 systemd 正常工作了。

### 4.2 更新系统包

顺手把系统包更新一下：

```bash
sudo apt update && sudo apt upgrade -y
```

可能需要几分钟，取决于网络和需要更新的包数量。不更新也不影响后面的安装，但建议跑一下。

---

## 五、第三步：安装 OpenClaw

### 5.1 一键安装

在 WSL 终端中执行：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

这个安装脚本会自动处理以下事情：
1. 检测并安装 Node.js（如果没有的话）
2. 通过 npm 全局安装 OpenClaw
3. 启动新手引导流程（onboard wizard）

如果 `curl` 命令不存在，先装一下：

```bash
sudo apt install -y curl
```

然后重新执行安装命令。

### 5.2 安装脚本做了什么？

了解一下心里有数：

| 步骤 | 说明 |
|------|------|
| 检测操作系统 | 识别 macOS / Linux / WSL |
| 安装 Node.js | 安装 Node 24（如果没有） |
| 安装 Git | 如果没有 Git 就装一个 |
| npm 全局安装 | `npm install -g openclaw@latest` |
| 启动引导 | 运行 `openclaw onboard` |

### 5.3 跑新手引导

安装脚本会自动启动新手引导。如果你跳过了，或者以后想重新配置，随时可以手动运行：

```bash
openclaw onboard --install-daemon
```

新手引导会依次让你配置几个东西：

1. **模型和认证** — 选择 AI 模型提供商（OpenAI、Anthropic、DeepSeek 等），输入 API Key。先跑起来的话选个便宜的就行，后面随时可以换。
2. **工作区** — 智能体文件存放位置，默认 `~/.openclaw/workspace`，直接回车。
3. **Gateway** — 网关配置，默认端口 18789，默认绑定 localhost，直接回车。
4. **渠道（可选）** — 可以连接飞书、Telegram、Discord 等。暂时不连没关系，Web UI 就能聊天。
5. **守护进程** — 安装 systemd 服务，让 Gateway 开机自动运行。选 Yes。
6. **健康检查** — 自动启动 Gateway 并验证。

### 5.4 验证安装

引导完成后，跑两个命令确认一切正常：

```bash
openclaw doctor
openclaw gateway status
```

`openclaw doctor` 应该输出绿色的 ✅，`gateway status` 应该显示 Gateway 正在运行。

---

## 六、第四步：打开 Web UI，开始聊天

```bash
openclaw dashboard
```

这个命令会尝试自动打开浏览器。在 WSL 环境下可能不会自动打开，没关系，手动来就行。

打开你 Windows 上的浏览器（Chrome、Edge 都行），访问：

```
http://127.0.0.1:18789/
```

如果打不开，别慌。WSL2 的网络在大部分情况下会自动把端口转发到 Windows 的 localhost，但偶尔会抽风。解决方法见下一章"常见踩坑记录"。

打开 Web UI 后你应该能看到聊天界面。随便发一条消息试试，比如：

> 你好，请介绍一下你自己

收到回复的话，恭喜——OpenClaw 已经在你的 Windows 上跑起来了 🎉

---

## 七、常见踩坑记录

### 坑 1：`wsl --install` 报错 "WSL2 requires virtualization enabled"

CPU 虚拟化没有在 BIOS 中开启。

重启电脑进 BIOS/UEFI，找到 Intel VT-x / AMD-V / SVM Mode，开启，保存退出重启。

另外确保 Windows 功能中"虚拟机平台"已启用。PowerShell（管理员）执行：

```powershell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

然后重启。

### 坑 2：`wsl --install` 下载失败，报网络错误

网络问题导致下载 Linux 内核更新包失败。手动下载安装：

1. 浏览器打开 https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi
2. 下载后双击安装
3. 然后重新执行 `wsl --install`

### 坑 3：WSL 安装路径或用户名含中文导致报错

WSL 对中文路径和特殊字符支持不好，会引发各种莫名其妙的错误。确保 WSL 的 Linux 用户名是纯英文小写。Windows 用户名如果是中文，WSL 通常没事，但如果你手动改过 WSL 安装路径，确保路径里没有中文和空格。

### 坑 4：systemd 没生效，Gateway 装不上

症状是 `openclaw gateway install` 报错，或者 `systemctl` 命令找不到。

原因通常是 `/etc/wsl.conf` 配置后没有正确重启 WSL。确保按这个顺序来：

```bash
# 1. 写入配置
sudo tee /etc/wsl.conf >/dev/null <<'EOF'
[boot]
systemd=true
EOF

# 2. 从 Windows PowerShell 完全关闭 WSL（不是在 WSL 里）
wsl --shutdown

# 3. 重新打开 Ubuntu，验证
systemctl --user status
```

### 坑 5：Windows 浏览器打不开 `http://127.0.0.1:18789/`

WSL 里 `curl http://127.0.0.1:18789/` 正常返回，但 Windows 浏览器显示"无法访问此网站"。原因是 WSL2 默认使用 NAT 网络模式，localhost 转发偶尔不工作。

**方案 A — 启用 Mirrored 网络模式（推荐，Windows 11 效果最佳，Windows 10 部分版本也支持）：**

在 Windows 上创建或编辑 `C:\Users\<你的用户名>\.wslconfig` 文件：

```ini
[wsl2]
networkingMode=mirrored
```

然后在 PowerShell 中 `wsl --shutdown`，重新打开 Ubuntu 再试。

**方案 B — 开放防火墙：**

如果 Mirrored 模式开了还是不通，可能是防火墙拦了。PowerShell（管理员）执行：

```powershell
New-NetFirewallRule -DisplayName "WSL" -Direction Inbound -InterfaceAlias "vEthernet (WSL)" -Action Allow
```

**方案 C — 手动端口转发：**

上面两个都不行的话（比如你用的是 Windows 10），手动转发端口。PowerShell（管理员）：

```powershell
$WslIp = (wsl -- hostname -I).Trim().Split(" ")[0]
netsh interface portproxy add v4tov4 listenaddress=127.0.0.1 listenport=18789 connectaddress=$WslIp connectport=18789
```

### 坑 6：`openclaw` 命令找不到

安装完成后输入 `openclaw` 提示 `command not found`，这是 npm 全局安装的 bin 目录没有在 PATH 里。执行：

```bash
echo 'export PATH="$(npm prefix -g)/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### 坑 7：npm 全局安装报 EACCES 权限错误

`npm install -g openclaw` 报 `EACCES: permission denied`，说明 npm 全局安装目录没有写权限。

最简单的办法是直接用安装脚本，它会自动处理这个问题：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

如果你想手动解决，可以修改 npm 全局安装路径到用户目录：

```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### 坑 8：连了 VPN 后 WSL 断网

 VPN 一开，WSL 里面就上不了网了，`apt update` / `curl` 全部失败。VPN 的路由策略覆盖了 WSL2 的虚拟网络。

最简单的办法是先关掉 VPN，在 WSL 里把安装和配置搞定。如果必须同时用 VPN，试试在 `.wslconfig` 中配置 `networkingMode=mirrored`。不过部分企业 VPN 会强制接管所有路由，这种情况下只能找 IT 部门加白名单。

### 坑 9：VirtualBox 和 WSL2 冲突

装完 WSL2 后 VirtualBox 的虚拟机启动不了或频繁崩溃。WSL2 使用的 Hyper-V 和旧版 VirtualBox 不兼容。升级 VirtualBox 到 6.1 或更高版本就好了。

---

## 八、进阶（可选）

### 设置开机自动启动 Gateway

如果你希望每次开机后 OpenClaw 自动运行，不需要手动打开 WSL：

先让 WSL 服务在未登录时也能运行：

```bash
# 在 WSL 中执行
sudo loginctl enable-linger "$(whoami)"
```

然后在 Windows 启动时自动启动 WSL。PowerShell（管理员）：

```powershell
schtasks /create /tn "WSL Boot" /tr "wsl.exe -d Ubuntu --exec /bin/true" /sc onstart /ru SYSTEM
```

把 `Ubuntu` 替换成你实际的发行版名称（`wsl --list --verbose` 查看）。

重启电脑后验证。在 WSL 中执行：

```bash
systemctl --user status openclaw-gateway --no-pager
```

显示 `active (running)` 就说明开机自启成功了。

### 局域网其他设备访问 OpenClaw

想让手机、iPad 或其他电脑也能访问你 Windows 上的 OpenClaw，需要做端口转发。

PowerShell（管理员）：

```powershell
$WslIp = (wsl -- hostname -I).Trim().Split(" ")[0]
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=18789 connectaddress=$WslIp connectport=18789
```

防火墙放行：

```powershell
New-NetFirewallRule -DisplayName "OpenClaw Web UI" -Direction Inbound -Protocol TCP -LocalPort 18789 -Action Allow
```

然后其他设备浏览器打开 `http://<你Windows的IP>:18789/` 就能访问了。

注意 WSL 的 IP 每次重启都会变，重启后需要重新执行端口转发命令。可以写个脚本放到开机启动里自动化。

### 更新和卸载

更新：

```bash
npm install -g openclaw@latest
openclaw doctor
```

卸载：

```bash
npm uninstall -g openclaw
openclaw gateway uninstall
```

---

## 写在最后

整个安装过程总结起来就 4 步：

```
安装 WSL2 + Ubuntu → 配置 systemd → 跑安装脚本 → 打开浏览器
```

遇到问题别慌，90% 的坑都在上面的"常见踩坑记录"里了

**参考链接：**
- [OpenClaw 官方文档 - Windows (WSL2)](https://docs.openclaw.ai/platforms/windows)
- [OpenClaw 入门指南](https://docs.openclaw.ai/start/getting-started)
- [OpenClaw 安装器文档](https://docs.openclaw.ai/install/installer)
- [Microsoft WSL 官方安装指南](https://learn.microsoft.com/windows/wsl/install)
- [Microsoft WSL 故障排除](https://learn.microsoft.com/windows/wsl/troubleshooting)
