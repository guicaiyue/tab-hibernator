# 网页休眠大师 (Tab Hibernator)

一个基于 WXT 框架开发的浏览器插件，可以自动休眠不活跃的标签页以节省内存和CPU资源。

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=guicaiyue/tab-hibernator&type=Date)](https://star-history.com/#guicaiyue/tab-hibernator&Date)

## 功能特性

- 🛌 **自动休眠**：自动检测并休眠不活跃的标签页
- ⏰ **可配置延迟**：自定义标签页休眠的时间延迟（默认5分钟）
- 🎯 **智能过滤**：自动排除活动标签页、固定标签页、正在播放音频的标签页
- 🔒 **标签页锁定**：支持锁定重要标签页，防止被意外休眠
- 📝 **白名单支持**：支持设置域名白名单，防止特定网站被休眠
- 📊 **实时统计**：显示标签页统计信息（总数、活动、休眠、有声）
- 🎛️ **手动控制**：支持手动休眠所有非活动标签页

## 安装方法

### 🏪 应用商店安装（推荐）

- **Chrome Web Store**: 搜索"网页休眠大师"或"Tab Hibernator"
- **Firefox Add-ons**: 搜索"Tab Hibernator"
- **Microsoft Edge Add-ons**: 搜索"网页休眠大师"或"Tab Hibernator"

### 🛠️ 开发者安装

#### Chrome/Edge 浏览器

1. 打开浏览器的扩展管理页面：
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`

2. 开启「开发者模式」

3. 点击「加载已解压的扩展程序」

4. 选择项目中的 `.output/chrome-mv3` 文件夹

5. 插件安装完成后，会在浏览器工具栏显示一个蓝色的「Z」图标

## 使用说明

### 基本使用

1. 点击浏览器工具栏中的插件图标打开控制面板
2. 插件会自动开始监控标签页活动
3. 超过设定时间未活动的标签页将自动休眠

### 设置配置

在插件弹窗中可以配置：

- **休眠延迟时间**：设置标签页多长时间未活动后进入休眠（单位：分钟）
- **白名单域名**：添加不希望被休眠的网站域名，每行一个

### 手动操作

- **立即休眠**：点击「休眠所有非活动标签页」按钮可立即休眠所有符合条件的标签页
- **标签页锁定**：在标签页列表中点击锁定图标（🔓/🔒）可锁定/解锁标签页，被锁定的标签页不会被自动或手动休眠
- **单个标签页操作**：在标签页列表中可对单个标签页进行休眠、锁定、关闭等操作
- **刷新统计**：点击「刷新统计」按钮可更新标签页统计信息

## 技术实现

### 核心功能

- 使用 `chrome.tabs.discard()` API 实现标签页休眠
- 监听 `tabs.onActivated`、`tabs.onUpdated` 等事件跟踪标签页活动
- 使用 `chrome.storage.local` 存储用户设置
- 定时检查机制（每分钟检查一次）

### 智能过滤规则

插件会自动排除以下类型的标签页：
- 当前活动的标签页
- 已固定的标签页
- 已经处于休眠状态的标签页
- 正在播放音频的标签页
- **被锁定的标签页**（新增）
- 白名单中的域名
- 特殊页面（chrome://、about:// 等）

## 开发说明

### 技术栈

- **框架**: WXT (Web Extension Toolkit)
- **语言**: TypeScript/JavaScript
- **构建工具**: Vite
- **包管理**: npm

### 开发命令

```bash
# 安装依赖
npm install

# 开发模式（热重载）
npm run dev          # Chrome（默认）
npm run dev:chrome   # Chrome
npm run dev:firefox  # Firefox
npm run dev:edge     # Microsoft Edge

# 构建生产版本
npm run build        # Chrome（默认）
npm run build:chrome # Chrome
npm run build:firefox # Firefox
npm run build:edge   # Microsoft Edge

# 打包为ZIP文件（用于发布）
npm run zip          # Chrome（默认）
npm run zip:chrome   # Chrome
npm run zip:firefox  # Firefox
npm run zip:edge     # Microsoft Edge
npm run zip:all      # 所有浏览器
```

### 项目结构

```
browser-hibernation/
├── entrypoints/
│   ├── background.ts      # 后台脚本
│   └── popup.html         # 弹窗页面
├── public/
│   ├── icon-16.png        # 16x16 图标
│   ├── icon-48.svg        # 48x48 图标
│   └── icon-128.svg       # 128x128 图标
├── wxt.config.ts          # WXT 配置文件
├── package.json
└── README.md
```

## 注意事项

1. **数据保护**：休眠的标签页会保留在标签栏中，重新激活时会自动恢复
2. **ID 变化**：休眠后的标签页 ID 可能会发生变化，插件已处理此情况
3. **权限要求**：插件需要 `tabs`、`storage`、`activeTab` 权限
4. **兼容性**：支持 Chrome、Firefox、Microsoft Edge 等主流浏览器

## 🚀 开发与发布

### 本地开发

```bash
# 安装依赖
pnpm install

# 开发模式（Chrome）
pnpm run dev

# 开发模式（Firefox）
pnpm run dev:firefox

# 开发模式（Edge）
pnpm run dev:edge
```

### 构建打包

```bash
# 构建所有浏览器版本
pnpm run build:chrome
pnpm run build:firefox
pnpm run build:edge

# 打包为ZIP文件
pnpm run zip:chrome
pnpm run zip:firefox
pnpm run zip:edge

# 一键打包所有版本
pnpm run zip:all
```

### 🤖 自动发布

本项目配置了GitHub Actions自动发布工作流：

- **触发条件**：当`main`分支的`package.json`版本号发生变更时自动触发
- **发布平台**：同时发布到Chrome Web Store、Firefox Add-ons、Microsoft Edge Add-ons
- **发布流程**：自动构建 → 提交审核 → 创建GitHub Release

#### 发布步骤

1. 修改`package.json`中的版本号
2. 提交并推送到`main`分支
3. GitHub Actions自动处理后续发布流程

详细配置说明请参考：[RELEASE_SETUP.md](./RELEASE_SETUP.md)

## 许可证

本项目采用 [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可证。

### 许可证说明

- ✅ **允许**：分享、修改、基于本项目创建衍生作品
- ❌ **禁止**：商业使用
- 📝 **要求**：署名原作者，衍生作品需使用相同许可证

### 使用条款

- **署名（Attribution）**：使用时必须注明原作者
- **非商业性使用（NonCommercial）**：不得用于商业目的
- **相同方式共享（ShareAlike）**：基于本项目的衍生作品必须使用相同的许可证

如需商业使用，请联系作者获得授权。