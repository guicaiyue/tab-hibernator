# 构建指南

本文档详细说明如何为不同浏览器构建和打包网页休眠大师扩展。

## 支持的浏览器

- **Google Chrome** - 使用 Manifest V3
- **Mozilla Firefox** - 使用 Manifest V2
- **Microsoft Edge** - 使用 Manifest V3（兼容 Chrome）

## 构建命令

### 开发模式

开发模式会自动打开浏览器并加载扩展，支持热重载：

```bash
# Chrome（默认）
npm run dev
# 或
npm run dev:chrome

# Firefox
npm run dev:firefox

# Microsoft Edge
npm run dev:edge
```

### 生产构建

生产构建会在 `.output` 目录生成优化后的扩展文件：

```bash
# Chrome（默认）
npm run build
# 或
npm run build:chrome

# Firefox
npm run build:firefox

# Microsoft Edge
npm run build:edge
```

### 打包为ZIP

打包命令会生成可直接上传到各浏览器商店的ZIP文件：

```bash
# Chrome
npm run zip:chrome
# 生成：.output/tab-hibernator-1.0.0-chrome.zip

# Firefox
npm run zip:firefox
# 生成：.output/tab-hibernator-1.0.0-firefox.zip
# 同时生成：.output/tab-hibernator-1.0.0-sources.zip（Firefox要求的源码包）

# Microsoft Edge
npm run zip:edge
# 生成：.output/tab-hibernator-1.0.0-edge.zip

# 所有浏览器
npm run zip:all
```

## 输出文件说明

### 构建目录结构

```
.output/
├── chrome-mv3/          # Chrome 扩展文件
├── firefox-mv2/         # Firefox 扩展文件
├── edge-mv3/            # Edge 扩展文件
├── tab-hibernator-1.0.0-chrome.zip    # Chrome 发布包
├── tab-hibernator-1.0.0-firefox.zip   # Firefox 发布包
├── tab-hibernator-1.0.0-edge.zip      # Edge 发布包
└── tab-hibernator-1.0.0-sources.zip   # Firefox 源码包
```

### 文件用途

- **chrome.zip** - 上传到 Chrome Web Store
- **firefox.zip** - 上传到 Firefox Add-ons Store
- **edge.zip** - 上传到 Microsoft Edge Add-ons Store
- **sources.zip** - Firefox 审核要求的源码包

## 浏览器差异

### Manifest 版本

- **Chrome/Edge**: 使用 Manifest V3
- **Firefox**: 使用 Manifest V2

WXT 会自动根据目标浏览器生成相应的 manifest.json 文件。

### API 兼容性

WXT 提供了跨浏览器的 API 包装器，确保代码在不同浏览器中都能正常工作：

- `chrome.tabs` → 自动适配为 `browser.tabs`（Firefox）
- `chrome.storage` → 自动适配为 `browser.storage`（Firefox）
- `chrome.runtime` → 自动适配为 `browser.runtime`（Firefox）

## 发布流程

### 1. 构建所有版本

```bash
npm run zip:all
```

### 2. 上传到各商店

- **Chrome Web Store**: 上传 `tab-hibernator-1.0.0-chrome.zip`
- **Firefox Add-ons**: 上传 `tab-hibernator-1.0.0-firefox.zip` 和 `tab-hibernator-1.0.0-sources.zip`
- **Edge Add-ons**: 上传 `tab-hibernator-1.0.0-edge.zip`

### 3. 商店审核

每个商店都有不同的审核要求：

- **Chrome**: 通常几小时到几天
- **Firefox**: 需要源码审核，可能需要几天到几周
- **Edge**: 通常几天

## 故障排除

### 常见问题

1. **Firefox 开发模式无法启动**
   - 确保已安装 Firefox
   - 检查 Firefox 路径是否正确

2. **Edge 开发模式打开了 Chrome**
   - 需要配置 Edge 浏览器路径
   - 创建 `web-ext.config.ts` 文件配置 Edge 路径

3. **构建失败**
   - 检查 Node.js 版本（推荐 18+）
   - 清除缓存：`rm -rf node_modules .output && npm install`

### 配置 Edge 浏览器路径

如果 Edge 开发模式无法正常启动，创建 `web-ext.config.ts` 文件：

```typescript
import { defineWebExtConfig } from 'wxt';

export default defineWebExtConfig({
  binaries: {
    edge: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  }
});
```

## 自动化构建

可以使用 GitHub Actions 等 CI/CD 工具自动化构建和发布流程。参考 WXT 官方文档的 GitHub Actions 示例。