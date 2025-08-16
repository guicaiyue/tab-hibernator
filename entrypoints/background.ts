import { getSystemMemoryUsage, formatMemorySize } from '../utils/memory';
import { i18n } from '#i18n';

export default defineBackground(() => {
  // 初始化i18n
  const t = i18n.t;
  // 调试开关 - 生产环境可设为 false
  const DEBUG = true;
  const debugLog = DEBUG ? console.log : () => {};
  
  console.log('Browser Hibernation Extension loaded!');

  // 存储标签页的最后活动时间
  const tabLastActivity = new Map<number, number>();
  
  // 休眠延迟时间（毫秒）- 默认-1（不开启）
  let hibernationDelay = -1;
  
  // 白名单域名
  const whitelist = new Set<string>();
  
  // 监听标签页激活事件
  browser.tabs.onActivated.addListener(async (activeInfo) => {
    const { tabId } = activeInfo;
    tabLastActivity.set(tabId, Date.now());
    
    // 如果标签页被丢弃，重新加载
    try {
      const tab = await browser.tabs.get(tabId);
      if (tab.discarded) {
        await browser.tabs.reload(tabId);
      }
    } catch (error) {
      console.error('Error handling tab activation:', error);
    }
  });
  
  // 监听标签页更新事件
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' || changeInfo.url) {
      tabLastActivity.set(tabId, Date.now());
    }
  });
  
  // 监听标签页创建事件
  browser.tabs.onCreated.addListener((tab) => {
    if (tab.id) {
      tabLastActivity.set(tab.id, Date.now());
    }
  });
  
  // 监听标签页移除事件
  browser.tabs.onRemoved.addListener((tabId) => {
    tabLastActivity.delete(tabId);
  });
  
  // 提取公共的基础检查逻辑
  function canHibernateTab(tab: browser.tabs.Tab): boolean {
    if (!tab.id || !tab.url) return false;
    
    // 不休眠活动标签页、固定标签页、已丢弃标签页、播放音频的标签页
    if (tab.active || tab.pinned || tab.discarded || tab.audible) return false;
    
    // 检查白名单
    try {
      const url = new URL(tab.url);
      if (whitelist.has(url.hostname)) return false;
    } catch (error) {
      console.error('Error parsing URL:', error);
      return false;
    }
    
    // 不休眠特殊页面
    if (tab.url.startsWith('chrome://') || 
        tab.url.startsWith('chrome-extension://') ||
        tab.url.startsWith('moz-extension://') ||
        tab.url.startsWith('about:')) {
      return false;
    }
    
    return true;
  }
  
  // 检查是否应该休眠标签页（带时间限制）
  function shouldHibernateTab(tab: browser.tabs.Tab): boolean {
    if (!canHibernateTab(tab)) return false;
    
    // 如果休眠延迟为-1，表示不开启自动休眠
    if (hibernationDelay === -1) return false;
    
    // 检查最后活动时间
    const lastActivity = tabLastActivity.get(tab.id) || Date.now();
    return Date.now() - lastActivity > hibernationDelay;
  }
  

  
  // 休眠标签页
  async function hibernateTab(tabId: number) {
    try {
      await browser.tabs.discard(tabId);
      console.log(`Tab ${tabId} hibernated`);
    } catch (error) {
      console.error(`Error hibernating tab ${tabId}:`, error);
    }
  }
  
  // 定期检查需要休眠的标签页
  async function checkForHibernation() {
    // 如果休眠延迟为-1，跳过检查
    if (hibernationDelay === -1) return;
    
    try {
      const tabs = await browser.tabs.query({});
      
      for (const tab of tabs) {
        if (shouldHibernateTab(tab) && tab.id) {
          await hibernateTab(tab.id);
        }
      }
    } catch (error) {
      console.error('Error during hibernation check:', error);
    }
  }
  
  // 每分钟检查一次
  setInterval(checkForHibernation, 60 * 1000);
  
  // 监听来自popup的消息
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
      case 'getSettings':
        sendResponse({
          success: true,
          settings: {
            hibernationDelay: hibernationDelay,
            whitelist: Array.from(whitelist)
          }
        });
        break;
        
      case 'updateSettings':
        if (message.settings) {
          if (message.settings.hibernationDelay) {
            hibernationDelay = message.settings.hibernationDelay;
          }
          if (message.settings.whitelist) {
            whitelist.clear();
            message.settings.whitelist.forEach((domain: string) => whitelist.add(domain));
          }
        }
        sendResponse({ success: true });
        break;
        
      case 'hibernateTab':
        if (message.tabId) {
          hibernateTab(message.tabId);
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false });
        }
        break;
        

        
      case 'getStats':
        const statsQueryOptions = message.windowId ? { windowId: message.windowId } : {};
        browser.tabs.query(statsQueryOptions).then(async (tabs) => {
          try {
            // 获取系统内存使用情况
            const memoryResult = await getSystemMemoryUsage();
            const memoryDisplay = formatMemorySize(memoryResult.memory);
            
            // 修复统计逻辑：确保活动标签页 + 休眠标签页 = 总标签页
            const activeTabs = tabs.filter(tab => tab.active && !tab.discarded);
            const hibernatedTabs = tabs.filter(tab => tab.discarded);
            const normalTabs = tabs.filter(tab => !tab.active && !tab.discarded);
            
            const activeTabsCount = activeTabs.length + normalTabs.length;
            const hibernatedTabsCount = hibernatedTabs.length;
            
            const stats = {
              total: tabs.length,
              active: activeTabsCount, // 活动标签页包括当前活动的和未休眠的
              hibernated: hibernatedTabsCount,
              memoryUsage: memoryDisplay,
              isMemoryAccurate: memoryResult.isAccurate
            };
            
            sendResponse({ success: true, stats });
          } catch (error) {
            console.error(t('getStatsError'), error);
            const stats = {
              total: tabs.length,
              active: tabs.filter(tab => !tab.discarded).length,
              hibernated: tabs.filter(tab => tab.discarded).length,
              memoryUsage: '0 MB'
            };
            sendResponse({ success: true, stats });
          }
        });
        return true; // 保持消息通道开放
        
      default:
        sendResponse({ error: 'Unknown action' });
    }
  });
});