# 🚀 自动发布配置指南

本项目已配置GitHub Actions自动发布工作流，当`main`分支的`package.json`版本号发生变更时，会自动构建并发布到Chrome Web Store、Firefox Add-ons和Microsoft Edge Add-ons三个平台。

## 📋 前置要求

### 1. 浏览器商店账号
- **Chrome Web Store**: 需要开发者账号（一次性$5费用）
- **Firefox Add-ons**: 免费Mozilla开发者账号
- **Microsoft Edge Add-ons**: 免费Microsoft Partner Center账号

### 2. WXT Submit配置
首先需要初始化WXT的提交配置：
```bash
pnpm wxt submit init
```

## 🔑 GitHub Secrets配置

在GitHub仓库的Settings > Secrets and variables > Actions中添加以下secrets：

### Chrome Web Store
```
CHROME_EXTENSION_ID=你的Chrome扩展ID
CHROME_CLIENT_ID=你的Google OAuth客户端ID
CHROME_CLIENT_SECRET=你的Google OAuth客户端密钥
CHROME_REFRESH_TOKEN=你的Google OAuth刷新令牌
```

### Firefox Add-ons
```
FIREFOX_EXTENSION_ID=你的Firefox扩展ID
FIREFOX_JWT_ISSUER=你的Firefox API密钥
FIREFOX_JWT_SECRET=你的Firefox API密钥
```

### Microsoft Edge Add-ons
```
EDGE_PRODUCT_ID=你的Edge扩展产品ID
EDGE_CLIENT_ID=你的Microsoft应用客户端ID
EDGE_CLIENT_SECRET=你的Microsoft应用客户端密钥
EDGE_ACCESS_TOKEN_URL=https://login.microsoftonline.com/你的租户ID/oauth2/v2.0/token
```

## 📝 获取密钥步骤

### Chrome Web Store
1. 访问[Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用Chrome Web Store API
4. 创建OAuth 2.0客户端ID
5. 使用WXT工具获取refresh token：
   ```bash
   pnpm wxt submit init chrome
   ```

### Firefox Add-ons
1. 访问[Firefox开发者中心](https://addons.mozilla.org/developers/)
2. 创建API密钥
3. 使用WXT工具配置：
   ```bash
   pnpm wxt submit init firefox
   ```

### Microsoft Edge Add-ons
1. 访问[Microsoft Partner Center](https://partner.microsoft.com/)
2. 注册开发者账号
3. 在Azure AD中创建应用注册
4. 获取客户端ID和密钥
5. 使用WXT工具配置：
   ```bash
   pnpm wxt submit init edge
   ```

## 🔄 发布流程

### 自动发布
1. 修改`package.json`中的版本号
2. 提交并推送到`main`分支
3. GitHub Actions会自动：
   - 检测版本变更
   - 构建所有浏览器版本
   - 提交到三个应用商店
   - 创建GitHub Release

### 手动触发
也可以在GitHub Actions页面手动触发发布工作流。

## 📦 构建命令

项目支持以下构建命令：
```bash
# 构建所有浏览器版本
pnpm run build:all

# 打包所有浏览器版本为ZIP
pnpm run zip:all

# 单独构建
pnpm run build:chrome
pnpm run build:firefox
pnpm run build:edge

# 单独打包
pnpm run zip:chrome
pnpm run zip:firefox
pnpm run zip:edge
```

## ⚠️ 注意事项

1. **首次发布**: 需要先手动上传一次扩展到各个商店，获取扩展ID
2. **审核时间**: 
   - Chrome: 通常1-3个工作日
   - Firefox: 通常几小时到1天
   - Edge: 通常1-7个工作日
3. **版本号**: 必须遵循语义化版本规范（如1.0.0）
4. **权限变更**: 如果扩展权限发生变更，可能需要更长的审核时间

## 🛠️ 故障排除

### 常见问题
1. **构建失败**: 检查依赖是否正确安装
2. **提交失败**: 验证所有secrets是否正确配置
3. **审核被拒**: 查看各商店的审核反馈，修复问题后重新发布

### 调试命令
```bash
# 测试构建
pnpm run build

# 验证配置
pnpm wxt submit --dry-run

# 查看详细日志
pnpm wxt submit --verbose
```

## 📚 相关文档

- [WXT Submit文档](https://wxt.dev/guide/submit.html)
- [Chrome Web Store发布指南](https://developer.chrome.com/docs/webstore/publish/)
- [Firefox Add-ons发布指南](https://extensionworkshop.com/documentation/publish/)
- [Microsoft Edge Add-ons发布指南](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/)