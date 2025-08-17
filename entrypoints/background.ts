import { getSystemMemoryUsage, formatMemorySize } from '../utils/memory';
import { i18n } from '#i18n';

export default defineBackground(() => {
  // 初始化i18n
  const t = i18n.t;
  // 调试开关 - 生产环境可设为 false
  const DEBUG = true;
  const debugLog = DEBUG ? console.log : () => {};

  // 存储标签页的最后活动时间
  const tabLastActivity = new Map<number, number>();
  
  // 休眠延迟时间（毫秒）- 默认-1（不开启）
  let hibernationDelay = -1;
  
  // 白名单域名
  const whitelist = new Set<string>();
  
  // 自动休眠计数器
  let autoHibernationCount = 0;
  
  // 跟踪popup连接状态
  let isPopupConnected = false;
  
  // 快速切换休眠功能开关
  let quickSwitchHibernation = true;
  
  // 存储最近创建的标签页信息
  let lastCreatedTab: { id: number; timestamp: number } | null = null;
  
  // 锁定的标签页集合
  let lockedTabs = new Set<number>();
  
  // 检查标签页是否被锁定
  function isTabLocked(tabId: number): boolean {
    return lockedTabs.has(tabId);
  }
  
  // 从存储中加载锁定状态
  async function loadLockedTabsFromStorage() {
    try {
      const result = await browser.storage.local.get(['lockedTabs']);
      if (result.lockedTabs && Array.isArray(result.lockedTabs)) {
        lockedTabs = new Set(result.lockedTabs);
        debugLog('Loaded locked tabs:', Array.from(lockedTabs));
      }
    } catch (error) {
      console.error('Failed to load locked tabs:', error);
    }
  }
  
  // 初始化设置
  async function initializeSettings() {
    try {
      const result = await browser.storage.local.get(['hibernationDelay', 'whitelist', 'quickSwitchHibernation']);
      
      if (result.hibernationDelay !== undefined) {
        hibernationDelay = result.hibernationDelay;
        // Hibernation delay loaded from storage
        debugLog('Loaded hibernation delay:', hibernationDelay);
      } else {
        // Using default hibernation delay
        hibernationDelay = -1;
      }
      
      if (result.whitelist && Array.isArray(result.whitelist)) {
        whitelist.clear();
        result.whitelist.forEach((domain: string) => whitelist.add(domain));
        debugLog('Loaded whitelist:', Array.from(whitelist));
      }
      
      if (result.quickSwitchHibernation !== undefined) {
        quickSwitchHibernation = result.quickSwitchHibernation;
        debugLog('Loaded quick switch hibernation:', quickSwitchHibernation);
      } else {
        // 默认启用快速切换休眠功能
        quickSwitchHibernation = true;
        debugLog('Using default quick switch hibernation:', quickSwitchHibernation);
      }
      
      // 加载锁定状态
      await loadLockedTabsFromStorage();
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }
  
  // 保存设置到存储
  async function saveSettings() {
    try {
      await browser.storage.local.set({
        hibernationDelay: hibernationDelay,
        whitelist: Array.from(whitelist),
        quickSwitchHibernation: quickSwitchHibernation
      });
      debugLog('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }
  
  // 启动时初始化设置
  initializeSettings();
  
  // Extension background script loaded successfully

  // 通知popup标签页发生变化
  function notifyPopupTabsChanged(eventType: string, tabId?: number, group?: any, changeInfo?: any) {
    // 防抖处理，避免频繁更新
    clearTimeout(notifyTimeout);
    notifyTimeout = setTimeout(() => {
      // 向所有popup发送消息
      browser.runtime.sendMessage({
        action: 'tabsChanged',
        eventType,
        tabId,
        group,
        changeInfo
      }).catch(() => {
        // 忽略没有popup监听的错误
      });
    }, 100);
  }

  // 防抖定时器
  let notifyTimeout: NodeJS.Timeout;
  
  // 监听标签页激活事件
  browser.tabs.onActivated.addListener(async (activeInfo) => {
    const { tabId } = activeInfo;
    tabLastActivity.set(tabId, Date.now());

    // 通知popup标签页已激活
    notifyPopupTabsChanged('activated', tabId);
  });
  
  // 监听标签页更新事件
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' || changeInfo.url) {
      tabLastActivity.set(tabId, Date.now());
    }
    // 通知popup标签页已更新
    notifyPopupTabsChanged('updated', tabId, null, changeInfo);
  });
  
  // 监听标签页创建事件
  browser.tabs.onCreated.addListener(async (tab) => {
    if (tab.id) {
      const currentTime = Date.now();
      tabLastActivity.set(tab.id, currentTime);
      
      // 快速切换休眠功能
      if (quickSwitchHibernation && lastCreatedTab) {
        const timeDiff = currentTime - lastCreatedTab.timestamp;
        
        // 如果在200ms内创建了新标签页，休眠前一个标签页
        if (timeDiff <= 200) {
            // 延迟100ms执行标签页检查，确保标签页状态稳定
            let lastCreatedTabId = lastCreatedTab.id;

            setTimeout(async () => {
              try {
                // 检查前一个标签页是否仍然存在且未被休眠
                const previousTab = await browser.tabs.get(lastCreatedTabId);

                if (previousTab && !previousTab.discarded && !previousTab.active) {
                  // 检查标签页是否被锁定
                  if (isTabLocked(lastCreatedTabId)) {
                    debugLog(`Quick switch skipped: tab ${lastCreatedTabId} is locked`);
                  } else {
                    debugLog(`Quick switch detected: hibernating tab ${lastCreatedTabId} (time diff: ${timeDiff}ms) tab`, previousTab);

                    hibernateTab(lastCreatedTabId, false);
                  }
                }
              } catch (error) {
                // 前一个标签页可能已经被关闭，忽略错误
                debugLog('Previous tab no longer exists:', error);
              }
            }, 1000);
        }
      }
      
      // 更新最近创建的标签页信息
      lastCreatedTab = { id: tab.id, timestamp: currentTime };
      
      notifyPopupTabsChanged('created', tab.id);
    }
  });
  
  // 监听标签页移除事件
  browser.tabs.onRemoved.addListener((tabId) => {
    tabLastActivity.delete(tabId);
    notifyPopupTabsChanged('removed', tabId);
  });

  // 监听标签页移动事件
  browser.tabs.onMoved.addListener((tabId, moveInfo) => {
    tabLastActivity.set(tabId, Date.now());
    notifyPopupTabsChanged('moved', tabId);
  });

  // 监听标签页附加事件（移动到其他窗口）
  browser.tabs.onAttached.addListener((tabId, attachInfo) => {
    tabLastActivity.set(tabId, Date.now());
    notifyPopupTabsChanged('attached', tabId);
  });

  // 监听标签页分离事件（从窗口分离）
  browser.tabs.onDetached.addListener((tabId, detachInfo) => {
    notifyPopupTabsChanged('detached', tabId);
  });

  // 监听标签页分组事件（如果支持）
  if (browser.tabGroups) {
    // 监听标签页分组创建
    if (browser.tabGroups.onCreated) {
      browser.tabGroups.onCreated.addListener((group) => {
        notifyPopupTabsChanged('groupCreated', null, group);
      });
    }

    // 监听标签页分组更新
    if (browser.tabGroups.onUpdated) {
      browser.tabGroups.onUpdated.addListener((group) => {
        notifyPopupTabsChanged('groupUpdated', null, group);
      });
    }

    // 监听标签页分组移除
    if (browser.tabGroups.onRemoved) {
      browser.tabGroups.onRemoved.addListener((group) => {
        notifyPopupTabsChanged('groupRemoved', null, group);
      });
    }

    // 监听标签页分组移动
    if (browser.tabGroups.onMoved) {
      browser.tabGroups.onMoved.addListener((group) => {
        notifyPopupTabsChanged('groupMoved', null, group);
      });
    }
  }
  
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
    
    // 检查标签页是否被锁定
    if (tab.id && isTabLocked(tab.id)) {
      debugLog(`Tab ${tab.id} is locked, skipping hibernation`);
      return false;
    }
    
    // 如果休眠延迟为-1，表示不开启自动休眠
    if (hibernationDelay === -1) {
      debugLog('Auto hibernation disabled (hibernationDelay = -1)');
      return false;
    }
    
    // 使用浏览器原生的lastAccessed时间，如果不存在则使用当前时间
    const lastAccessed = tab.lastAccessed || Date.now();
    const timeSinceLastAccess = Date.now() - lastAccessed;
    const shouldHibernate = timeSinceLastAccess > hibernationDelay;
    
    debugLog(`Tab ${tab.id} (${tab.title?.substring(0, 30)}...): lastAccessed=${new Date(lastAccessed).toLocaleString()}, timeSince=${Math.round(timeSinceLastAccess/1000)}s, delay=${Math.round(hibernationDelay/1000)}s, shouldHibernate=${shouldHibernate}`);
    
    return shouldHibernate;
  }
  

  
  // 休眠标签页
  async function hibernateTab(tabId: number, isAutoHibernation: boolean = false) {
    try {
      await browser.tabs.discard(tabId);
      if (isAutoHibernation) {
        autoHibernationCount++;
      }
    } catch (error) {
      console.error(`Error hibernating tab ${tabId}:`, error);
    }
  }
  
  // 定期检查需要休眠的标签页
  async function checkForHibernation() {
    // 如果休眠延迟为-1，跳过检查
    if (hibernationDelay === -1) {
      debugLog('Skipping hibernation check - auto hibernation disabled');
      return;
    }
    
    debugLog(`Starting hibernation check with delay: ${hibernationDelay}ms (${Math.round(hibernationDelay/60000)} minutes)`);
    
    try {
      const tabs = await browser.tabs.query({});
      debugLog(`Checking ${tabs.length} tabs for hibernation`);
      
      let hibernatedCount = 0;
      const initialCount = autoHibernationCount;
      
      for (const tab of tabs) {
        if (shouldHibernateTab(tab) && tab.id) {
          await hibernateTab(tab.id, true); // 标记为自动休眠
          hibernatedCount++;
        }
      }
      
      debugLog(`Hibernation check completed. Hibernated ${hibernatedCount} tabs.`);
      
      // 如果有标签页被休眠且popup当前打开，发送批量通知
      if (hibernatedCount > 0 && isPopupConnected) {
        try {
        await browser.runtime.sendMessage({
          action: 'showRealtimeHibernationNotification',
          count: autoHibernationCount,
          batchCount: hibernatedCount
        });
      } catch (error) {
        // Popup not connected for batch notification
      }
      }
    } catch (error) {
      console.error('Error during hibernation check:', error);
    }
  }
  
  // 每分钟检查一次
  setInterval(() => {
    checkForHibernation();
  }, 60 * 1000);
  
  // 立即执行一次检查（用于测试）
  setTimeout(() => {
    checkForHibernation();
  }, 5000);
  
  // 监听来自popup的消息
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
      case 'getSettings':
        sendResponse({
          success: true,
          settings: {
            hibernationDelay: hibernationDelay,
            whitelist: Array.from(whitelist),
            quickSwitchHibernation: quickSwitchHibernation
          }
        });
        break;
        
      case 'updateSettings':
        if (message.settings) {
          if (message.settings.hibernationDelay !== undefined) {
            hibernationDelay = message.settings.hibernationDelay;
            debugLog('Updated hibernation delay:', hibernationDelay);
          }
          if (message.settings.whitelist) {
            whitelist.clear();
            message.settings.whitelist.forEach((domain: string) => whitelist.add(domain));
            debugLog('Updated whitelist:', Array.from(whitelist));
          }
          if (message.settings.quickSwitchHibernation !== undefined) {
            quickSwitchHibernation = message.settings.quickSwitchHibernation;
            debugLog('Updated quick switch hibernation:', quickSwitchHibernation);
          }
          // 保存设置到存储
          saveSettings();
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
        

      
      case 'getHibernationCount':
        sendResponse({ count: autoHibernationCount });
        break;
      
      case 'resetHibernationCount':
        autoHibernationCount = 0;
        sendResponse({ success: true });
        break;
        
      case 'updateLockedTabs':
        if (message.lockedTabs && Array.isArray(message.lockedTabs)) {
          lockedTabs = new Set(message.lockedTabs);
          debugLog('Updated locked tabs:', Array.from(lockedTabs));
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false });
        }
        break;
      
      case 'popupConnected':
        isPopupConnected = true;
        sendResponse({ success: true });
        break;
      
      case 'popupDisconnected':
        isPopupConnected = false;
        sendResponse({ success: true });
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