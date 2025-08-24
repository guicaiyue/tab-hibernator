#!/usr/bin/env node

// 跨平台的 Edge 扩展提交脚本
// 动态查找 Edge zip 文件并提交

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 获取 .output 目录中的 Edge zip 文件
function findEdgeZip() {
  const outputDir = path.join(__dirname, '..', '.output');
  
  if (!fs.existsSync(outputDir)) {
    throw new Error('.output 目录不存在，请先运行 npm run zip:edge');
  }
  
  const files = fs.readdirSync(outputDir);
  const edgeZip = files.find(file => file.endsWith('-edge.zip'));
  
  if (!edgeZip) {
    throw new Error('未找到 Edge zip 文件，请先运行 npm run zip:edge');
  }
  
  return path.join(outputDir, edgeZip);
}

try {
  const edgeZipPath = findEdgeZip();
  console.log(`找到 Edge zip 文件: ${edgeZipPath}`);
  
  // 执行 wxt submit 命令
  const command = `wxt submit --edge-zip "${edgeZipPath}"`;
  console.log(`执行命令: ${command}`);
  
  execSync(command, { stdio: 'inherit' });
  
} catch (error) {
  console.error('错误:', error.message);
  process.exit(1);
}