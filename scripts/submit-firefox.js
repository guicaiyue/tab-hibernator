#!/usr/bin/env node

// 跨平台的 Firefox 扩展提交脚本
// 动态查找 Firefox zip 文件和源码 zip 文件并提交

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 获取 .output 目录中的 Firefox 相关 zip 文件
function findFirefoxZips() {
  const outputDir = path.join(__dirname, '..', '.output');
  
  if (!fs.existsSync(outputDir)) {
    throw new Error('.output 目录不存在，请先运行 npm run zip:firefox');
  }
  
  const files = fs.readdirSync(outputDir);
  const firefoxZip = files.find(file => file.endsWith('-firefox.zip'));
  const sourcesZip = files.find(file => file.endsWith('-sources.zip'));
  
  if (!firefoxZip) {
    throw new Error('未找到 Firefox zip 文件，请先运行 npm run zip:firefox');
  }
  
  if (!sourcesZip) {
    throw new Error('未找到源码 zip 文件，请先运行 npm run zip:firefox');
  }
  
  return {
    firefoxZip: path.join(outputDir, firefoxZip),
    sourcesZip: path.join(outputDir, sourcesZip)
  };
}

try {
  const { firefoxZip, sourcesZip } = findFirefoxZips();
  console.log(`找到 Firefox zip 文件: ${firefoxZip}`);
  console.log(`找到源码 zip 文件: ${sourcesZip}`);
  
  // 执行 wxt submit 命令
  const command = `wxt submit --firefox-zip "${firefoxZip}" --firefox-sources-zip "${sourcesZip}"`;
  console.log(`执行命令: ${command}`);
  
  execSync(command, { stdio: 'inherit' });
  
} catch (error) {
  console.error('错误:', error.message);
  process.exit(1);
}