#!/usr/bin/env node

// 跨平台的 Chrome 扩展提交脚本
// 动态查找 Chrome zip 文件并提交

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 获取 .output 目录中的 Chrome zip 文件
function findChromeZip() {
  const outputDir = path.join(__dirname, '..', '.output');
  
  if (!fs.existsSync(outputDir)) {
    throw new Error('.output 目录不存在，请先运行 npm run zip:chrome');
  }
  
  const files = fs.readdirSync(outputDir);
  const chromeZip = files.find(file => file.endsWith('-chrome.zip'));
  
  if (!chromeZip) {
    throw new Error('未找到 Chrome zip 文件，请先运行 npm run zip:chrome');
  }
  
  return path.join(outputDir, chromeZip);
}

try {
  const chromeZipPath = findChromeZip();
  console.log(`找到 Chrome zip 文件: ${chromeZipPath}`);
  
  // 执行 wxt submit 命令
  const command = `wxt submit --chrome-zip "${chromeZipPath}"`;
  console.log(`执行命令: ${command}`);
  
  execSync(command, { stdio: 'inherit' });
  
} catch (error) {
  console.error('错误:', error.message);
  process.exit(1);
}