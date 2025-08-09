/**
 * 内存计算工具模块 - 浏览器兼容版本
 * 提供统一的内存计算和格式化功能
 */

// 内存计算常量
const MEMORY_CONSTANTS = {
  ACTIVE_TAB_MEMORY_MB: 15,  // 活跃标签页估算内存 (MB) - 更合理的估算值
  HIBERNATED_TAB_MEMORY_MB: 2,  // 休眠标签页估算内存 (MB) - 休眠标签页仍占用少量内存
  BYTES_PER_MB: 1024 * 1024,
  BYTES_PER_GB: 1024 * 1024 * 1024
};

/**
 * 格式化内存大小显示
 * @param {number} bytes 字节数
 * @returns {string} 格式化后的字符串
 */
function formatMemorySize(bytes) {
  if (bytes >= MEMORY_CONSTANTS.BYTES_PER_GB) {
    return `${(bytes / MEMORY_CONSTANTS.BYTES_PER_GB).toFixed(1)}GB`;
  } else {
    return `${Math.round(bytes / MEMORY_CONSTANTS.BYTES_PER_MB)}MB`;
  }
}

/**
 * 估算标签页组的内存使用量
 * @param {number} activeTabs 活跃标签页数量
 * @param {number} hibernatedTabs 休眠标签页数量
 * @returns {number} 估算的内存使用量（字节）
 */
function estimateTabGroupMemory(activeTabs, hibernatedTabs) {
  return (activeTabs * MEMORY_CONSTANTS.ACTIVE_TAB_MEMORY_MB + 
          hibernatedTabs * MEMORY_CONSTANTS.HIBERNATED_TAB_MEMORY_MB) * 
         MEMORY_CONSTANTS.BYTES_PER_MB;
}

/**
 * 估算所有标签页的总内存使用量
 * @param {number} totalTabs 总标签页数量
 * @returns {number} 估算的内存使用量（字节）
 */
function estimateTotalMemory(totalTabs) {
  return totalTabs * MEMORY_CONSTANTS.ACTIVE_TAB_MEMORY_MB * MEMORY_CONSTANTS.BYTES_PER_MB;
}

// ES模块导出
export {
  MEMORY_CONSTANTS,
  formatMemorySize,
  estimateTabGroupMemory,
  estimateTotalMemory
};

// 同时导出到全局对象以保持兼容性
window.memoryUtils = {
  MEMORY_CONSTANTS,
  formatMemorySize,
  estimateTabGroupMemory,
  estimateTotalMemory
};