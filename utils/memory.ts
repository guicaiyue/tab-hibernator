/**
 * 内存计算工具模块
 * 提供统一的内存计算和格式化功能
 */

// 内存计算常量
export const MEMORY_CONSTANTS = {
  ACTIVE_TAB_MEMORY_MB: 15,  // 活跃标签页估算内存 (MB) - 更合理的估算值
  HIBERNATED_TAB_MEMORY_MB: 2,  // 休眠标签页估算内存 (MB) - 休眠标签页仍占用少量内存
  BYTES_PER_MB: 1024 * 1024,
  BYTES_PER_GB: 1024 * 1024 * 1024
};

/**
 * 格式化内存大小显示
 * @param bytes 字节数
 * @returns 格式化后的字符串
 */
export function formatMemorySize(bytes: number): string {
  if (bytes >= MEMORY_CONSTANTS.BYTES_PER_GB) {
    return `${(bytes / MEMORY_CONSTANTS.BYTES_PER_GB).toFixed(1)}GB`;
  } else {
    return `${Math.round(bytes / MEMORY_CONSTANTS.BYTES_PER_MB)}MB`;
  }
}

/**
 * 估算标签页组的内存使用量
 * @param activeTabs 活跃标签页数量
 * @param hibernatedTabs 休眠标签页数量
 * @returns 估算的内存使用量（字节）
 */
export function estimateTabGroupMemory(activeTabs: number, hibernatedTabs: number): number {
  return (activeTabs * MEMORY_CONSTANTS.ACTIVE_TAB_MEMORY_MB + 
          hibernatedTabs * MEMORY_CONSTANTS.HIBERNATED_TAB_MEMORY_MB) * 
         MEMORY_CONSTANTS.BYTES_PER_MB;
}

/**
 * 估算所有标签页的总内存使用量
 * @param totalTabs 总标签页数量
 * @returns 估算的内存使用量（字节）
 */
export function estimateTotalMemory(totalTabs: number): number {
  return totalTabs * MEMORY_CONSTANTS.ACTIVE_TAB_MEMORY_MB * MEMORY_CONSTANTS.BYTES_PER_MB;
}

/**
 * 获取系统物理内存使用量
 * @returns 包含内存使用量的对象
 */
export async function getSystemMemoryUsage(): Promise<{memory: number, isAccurate: boolean}> {
  try {
    if (typeof chrome !== 'undefined' && chrome.system && chrome.system.memory) {
      // 获取系统内存信息
      const memoryInfo = await new Promise<any>((resolve, reject) => {
        chrome.system.memory.getInfo((info) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(info);
          }
        });
      });
      
      // 计算已使用的内存（总内存 - 可用内存）
      const usedMemory = (memoryInfo.capacity - memoryInfo.availableCapacity);
      
      return { memory: usedMemory, isAccurate: true };
    }
  } catch (error) {
    console.error('获取系统内存信息失败:', error);
  }
  
  // 如果无法获取系统内存，返回默认值
  return { memory: 0, isAccurate: false };
}