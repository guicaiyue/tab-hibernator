import { i18n } from '#i18n';

// 全局变量
let currentWindowId = null;
let allWindows = [];
let currentLanguage = 'zh_CN'; // 默认语言

// 初始化i18n
const t = i18n.t;

// 翻译数据
const translations = {
  zh_CN: {
    "extName": "网页休眠大师",
    "extDescription": "智能管理浏览器标签页，自动休眠不活跃标签页以节省内存和提升性能",
    "popupTitle": "网页休眠大师",
    "settings": "设置",
    "help": "帮助",
    "totalTabs": "当前窗口中所有标签页的总数量",
    "activeTabs": "正在活跃使用的标签页",
    "hibernatedTabs": "已经休眠的标签页",
    "memoryUsage": "当前设备所有程序占用的物理内存",
    "memoryUsageTooltip": "当前设备所有程序占用的物理内存",
    "memoryUnavailable": "内存信息不可用",
    "loadStatsFailed": "加载统计信息失败",
    "hibernateTab": "休眠标签页",
    "closeTab": "关闭标签页",
    "cannotCloseSystemPage": "无法关闭系统页面",
    "active": "活跃",
    "hibernated": "已休眠",
    "audible": "播放中",
    "showAllWindowsTabs": "显示所有窗口的标签页",
    "allWindows": "所有窗口",
    "currentActiveWindow": "当前活动窗口",
    "windowNumber": "窗口",
    "currentWindow": "当前窗口",
    "getStatsError": "获取统计信息失败:",
    "languageSettings": "语言设置",
    "selectLanguage": "选择语言",
    "chinese": "中文",
    "english": "English",
    "languageChanged": "配置已更新",
    "pluginSettings": "插件设置",
    "loadWindowsListFailed": "加载窗口列表失败",
    "hibernationDelay": "休眠延迟 (分钟)",
    "hibernationDelayHelp": "标签页不活动多长时间后自动休眠（-1表示不开启自动休眠）",
    "whitelistDomains": "白名单域名",
    "whitelistPlaceholder": "每行一个域名，例如：\ngithub.com\nstackoverflow.com\nyoutube.com",
    "whitelistHelp": "这些域名的标签页不会被自动休眠",
    "saveSettings": "保存设置",
    "cancel": "取消",
    "helpTitle": "❓ 使用帮助",
    "helpContent": "🛌 浏览器休眠控制插件使用说明：\n\n• 自动休眠：标签页超过设定时间未活动将自动休眠\n• 手动休眠：点击💤图标可手动休眠单个标签页\n• 批量休眠：鼠标悬停在统计区域的💤图标上可休眠所有活动标签页\n• 白名单：在设置中添加域名可防止特定网站被休眠\n• 智能过滤：自动排除活动、固定、有声标签页\n\n💡 提示：休眠的标签页会释放内存，重新点击时会自动恢复",
    "close": "关闭",
    "saveSettingsFailed": "保存设置失败",
    "lastAccessedTime": "最后访问时间",
    "autoHibernatedTabs": "自动休眠{count}个网页",
    "quickSwitchHibernation": "快速切换休眠",
    "enableQuickSwitchHibernation": "启用快速切换休眠功能",
    "quickSwitchHibernationHelp": "启用后，当快速连续打开新标签页时（200ms内），会自动休眠前一个标签页"
  },
  en: {
    "extName": "Tab Hibernator",
    "extDescription": "Intelligently manage browser tabs, automatically hibernate inactive tabs to save memory and improve performance",
    "popupTitle": "Tab Hibernator",
    "settings": "Settings",
    "help": "Help",
    "totalTabs": "Total number of tabs in current window",
    "activeTabs": "Active tabs currently in use",
    "hibernatedTabs": "Tabs that have been hibernated",
    "memoryUsage": "Physical memory used by all programs on current device",
    "memoryUsageTooltip": "Physical memory used by all programs on current device",
    "memoryUnavailable": "Memory information unavailable",
    "loadStatsFailed": "Failed to load statistics",
    "hibernateTab": "Hibernate tab",
    "closeTab": "Close tab",
    "cannotCloseSystemPage": "Cannot close system page",
    "active": "Active",
    "hibernated": "Hibernated",
    "audible": "Playing",
    "showAllWindowsTabs": "Show tabs from all windows",
    "allWindows": "All Windows",
    "currentActiveWindow": "Current active window",
    "windowNumber": "Window",
    "currentWindow": "Current",
    "getStatsError": "Failed to get statistics:",
    "languageSettings": "Language Settings",
    "selectLanguage": "Select Language",
    "chinese": "中文",
     "english": "English",
     "languageChanged": "Settings updated",
     "pluginSettings": "Plugin Settings",
     "loadWindowsListFailed": "Failed to load windows list",
     "hibernationDelay": "Hibernation Delay (minutes)",
     "hibernationDelayHelp": "How long tabs remain inactive before auto-hibernation (-1 to disable auto-hibernation)",
     "whitelistDomains": "Whitelist Domains",
     "whitelistPlaceholder": "One domain per line, for example:\ngithub.com\nstackoverflow.com\nyoutube.com",
     "whitelistHelp": "Tabs from these domains will not be auto-hibernated",
     "saveSettings": "Save Settings",
    "cancel": "Cancel",
    "helpTitle": "❓ Help",
    "helpContent": "🛌 Browser Tab Hibernator Usage Guide:\n\n• Auto Hibernation: Tabs will automatically hibernate after being inactive for the set time\n• Manual Hibernation: Click the 💤 icon to manually hibernate individual tabs\n• Batch Hibernation: Hover over the 💤 icon in the stats area to hibernate all active tabs\n• Whitelist: Add domains in settings to prevent specific websites from being hibernated\n• Smart Filtering: Automatically excludes active, pinned, and audible tabs\n\n💡 Tip: Hibernated tabs will free up memory and automatically restore when clicked",
    "close": "Close",
    "saveSettingsFailed": "Failed to save settings",
    "lastAccessedTime": "Last Accessed Time",
    "autoHibernatedTabs": "Auto-hibernated {count} pages",
    "quickSwitchHibernation": "Quick Switch Hibernation",
    "enableQuickSwitchHibernation": "Enable quick switch hibernation feature",
    "quickSwitchHibernationHelp": "When enabled, automatically hibernates the previous tab when opening new tabs rapidly (within 200ms)"
  }
};

// 动态翻译函数
function dynamicT(key) {
  const langData = translations[currentLanguage] || translations['zh_CN'];
  return langData[key] || key;
}

// 语言管理函数
async function getCurrentLanguage() {
  try {
    const result = await browser.storage.local.get(['userLanguage']);
    return result.userLanguage || 'zh_CN';
  } catch (error) {
    console.error('获取语言设置失败:', error);
    return 'zh_CN';
  }
}

async function saveLanguagePreference(language) {
  try {
    await browser.storage.local.set({ userLanguage: language });
    currentLanguage = language;
  } catch (error) {
    console.error('保存语言设置失败:', error);
  }
}

async function updateUILanguage() {
  // 更新所有带有data-i18n属性的元素
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (key) {
      element.textContent = dynamicT(key);
    }
  });
  
  // 更新所有带有data-i18n-title属性的元素
  const titleElements = document.querySelectorAll('[data-i18n-title]');
  titleElements.forEach(element => {
    const key = element.getAttribute('data-i18n-title');
    if (key) {
      element.title = dynamicT(key);
    }
  });
  
  // 重新加载窗口列表、统计信息和标签页列表以应用新语言
  await loadWindowsList();
  await loadStats();
  await loadTabsList();
}

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 防抖版本的loadTabsList
const debouncedLoadTabsList = debounce(loadTabsList, 300);

// 显示消息
function showMessage(text, type = 'info') {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = text;
  statusDiv.className = `status ${type} show`;
  statusDiv.classList.remove('hidden');
  
  // 清除之前的定时器
  if (statusDiv.hideTimer) {
    clearTimeout(statusDiv.hideTimer);
  }
  
  // 设置新的定时器
  statusDiv.hideTimer = setTimeout(() => {
    statusDiv.classList.add('hide');
    statusDiv.classList.remove('show');
    
    // 动画结束后隐藏元素
    setTimeout(() => {
      statusDiv.classList.add('hidden');
      statusDiv.classList.remove('hide');
    }, 300); // 与CSS动画时间一致
  }, 3000);
}





// 加载统计信息
async function loadStats() {
  try {
    const result = await browser.runtime.sendMessage({ 
      action: 'getStats',
      windowId: currentWindowId // 传递当前选中的窗口ID
    });
    if (result.success) {
      document.getElementById('totalTabs').textContent = result.stats.total;
      document.getElementById('activeTabs').textContent = result.stats.active;
      document.getElementById('hibernatedTabs').textContent = result.stats.hibernated;
      document.getElementById('memoryUsage').textContent = result.stats.memoryUsage || '0 MB';
      
      // 设置系统内存提示信息
      const memoryItem = document.getElementById('memoryItem');
      if (result.stats.isMemoryAccurate) {
        memoryItem.title = dynamicT('memoryUsageTooltip');
      } else {
        memoryItem.title = dynamicT('memoryUnavailable');
      }
    }
  } catch (error) {
    showMessage(dynamicT('loadStatsFailed'), 'error');
  }
}



// 加载窗口列表
async function loadWindowsList() {
  try {
    const windows = await browser.windows.getAll({ populate: false });
    allWindows = windows;
    
    // 调试：打印所有窗口信息    
    // 过滤掉开发者工具窗口和无效窗口
    const filteredWindows = windows.filter(window => {
      // 过滤掉 devtools 类型的窗口
      const isDevTools = window.type === 'devtools';
      // 过滤掉 height 和 width 都为 0 的窗口
      const isInvalidSize = window.height === 0 && window.width === 0;
      // Window filtering logic
      return !isDevTools && !isInvalidSize;
    });
    
    // Filtered windows processed
    allWindows = filteredWindows;
    
    // 获取当前窗口
    const currentWindow = await browser.windows.getCurrent();
    currentWindowId = currentWindow.id;
    
    const windowTabs = document.getElementById('windowTabs');
    windowTabs.innerHTML = '';
    
    // 创建图标SVG
    function createWindowIcon(type) {
      const iconContainer = document.createElement('span');
      iconContainer.className = 'window-icon';
      
      switch(type) {
        case 'all':
          // 全部窗口图标
          iconContainer.textContent = '🖥️';
          break;
        case 'single':
          // 普通窗口图标
          iconContainer.textContent = '🪟';
          break;
        case 'current':
          // 当前窗口图标（🪟 + 绿色点）
          iconContainer.innerHTML = '🪟<span class="current-indicator"></span>';
          iconContainer.classList.add('current-window-icon');
          break;
        default:
          iconContainer.textContent = '🪟';
      }
      
      return iconContainer;
    }
    
    // 添加"所有窗口"标签页
    const allTab = document.createElement('div');
    allTab.className = 'window-tab';
    allTab.dataset.windowId = 'all';
    allTab.title = dynamicT('showAllWindowsTabs');
    allTab.appendChild(createWindowIcon('all'));
    const allText = document.createElement('span');
    allText.textContent = `${dynamicT('allWindows')} (${filteredWindows.length})`;
    allTab.appendChild(allText);
    windowTabs.appendChild(allTab);
    
    // 添加各个窗口标签页
    filteredWindows.forEach((window, index) => {
      const tab = document.createElement('div');
      tab.className = 'window-tab';
      tab.dataset.windowId = window.id;
      tab.title = window.id === currentWindowId ? dynamicT('currentActiveWindow') : `${dynamicT('windowNumber')} ${index + 1}`;
      
      const iconType = window.id === currentWindowId ? 'current' : 'single';
      tab.appendChild(createWindowIcon(iconType));
      
      const text = document.createElement('span');
      text.textContent = window.id === currentWindowId ? dynamicT('currentWindow') : `${index + 1}`;
      tab.appendChild(text);
      
      if (window.id === currentWindowId) {
        tab.classList.add('active');
      }
      windowTabs.appendChild(tab);
    });
    
    // 如果没有选中的标签页，默认选中当前窗口对应的标签页
    if (!windowTabs.querySelector('.active')) {
      allTab.classList.add('active');
      currentWindowId = null;
    }
    
    // 滚动到选中的标签页
    scrollToActiveTab();
    
    // 监听标签页点击事件
    windowTabs.addEventListener('click', function(e) {
      // 找到被点击的标签页元素（可能点击的是子元素）
      let clickedTab = e.target;
      while (clickedTab && !clickedTab.classList.contains('window-tab')) {
        clickedTab = clickedTab.parentElement;
      }
      
      if (clickedTab && clickedTab.classList.contains('window-tab')) {
        // 移除所有active类
        windowTabs.querySelectorAll('.window-tab').forEach(tab => {
          tab.classList.remove('active');
        });
        
        // 添加active类到点击的标签页
        clickedTab.classList.add('active');
        
        const selectedValue = clickedTab.dataset.windowId;
         if (selectedValue === 'all') {
           currentWindowId = null;
         } else {
           currentWindowId = parseInt(selectedValue);
         }
         
         // 滚动到选中的标签页
         scrollToActiveTab();
         
         // 更新统计信息，标签页列表会通过事件驱动自动更新
         loadStats();
       }
     });
    
  } catch (error) {
    console.error('加载窗口列表失败:', error);
    showMessage(dynamicT('loadWindowsListFailed'), 'error');
  }
}

// 滚动到选中的标签页
function scrollToActiveTab() {
  const windowTabs = document.getElementById('windowTabs');
  const activeTab = windowTabs.querySelector('.window-tab.active');
  
  if (activeTab && windowTabs) {
    const tabsContainer = windowTabs;
    const containerWidth = tabsContainer.clientWidth;
    const tabLeft = activeTab.offsetLeft;
    const tabWidth = activeTab.offsetWidth;
    const currentScroll = tabsContainer.scrollLeft;
    
    // 计算标签页在容器中的位置
    const tabCenter = tabLeft + tabWidth / 2;
    const containerCenter = containerWidth / 2;
    
    // 计算需要滚动到的位置（让选中的标签页居中）
    const targetScroll = tabCenter - containerCenter;
    
    // 平滑滚动到目标位置
    tabsContainer.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: 'smooth'
    });
  }
}

function scrollToActiveTabItem() {
  const tabsList = document.getElementById('tabsList');
  const activeTabItem = tabsList.querySelector('.tab-item.active-tab');
  
  if (activeTabItem && tabsList) {
    // 平滑滚动到活跃标签页项
    activeTabItem.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}

// 加载标签页列表
async function loadTabsList() {
  try {
    // 根据当前选中的窗口过滤标签页
    const queryOptions = currentWindowId ? { windowId: currentWindowId } : {};
    const allTabs = await browser.tabs.query(queryOptions);
    
    // 过滤掉无效的标签页
    const tabs = allTabs.filter(tab => {
      // 排除title和url都为空的异常标签页
      return tab.title || tab.url;
    });
    
    const tabsList = document.getElementById('tabsList');
    const fragment = document.createDocumentFragment();
    
    // 检查浏览器是否支持标签页分组API
    if (browser.tabGroups) {
      try {
        const groups = await browser.tabGroups.query({});
        
        // 创建分组映射
        const groupMap = new Map();
        groups.forEach(group => {
          groupMap.set(group.id, group);
        });
        
        // 按分组整理标签页
        const groupedTabs = new Map();
        const ungroupedTabs = [];
        
        tabs.forEach(tab => {
          if (tab.groupId && tab.groupId !== -1) {
            if (!groupedTabs.has(tab.groupId)) {
              groupedTabs.set(tab.groupId, []);
            }
            groupedTabs.get(tab.groupId).push(tab);
          } else {
            ungroupedTabs.push(tab);
          }
        });
        
        // 渲染分组标签页到fragment
        for (const [groupId, groupTabs] of groupedTabs) {
          const group = groupMap.get(groupId);
          const groupElement = createTabGroup(group, groupTabs);
          fragment.appendChild(groupElement);
        }
        
        // 渲染未分组标签页到fragment
        if (ungroupedTabs.length > 0) {
          const ungroupedElement = createTabGroup(null, ungroupedTabs);
          fragment.appendChild(ungroupedElement);
        }
      } catch (groupError) {
        // Tab group query failed, using simple mode
        // 分组查询失败时，直接渲染所有标签页
        renderTabsWithoutGroups(tabs, fragment);
      }
    } else {
      // Browser doesn't support tab groups API, using simple mode
      // 浏览器不支持分组时，直接渲染所有标签页
      renderTabsWithoutGroups(tabs, fragment);
    }
    
    // 一次性更新DOM
    tabsList.innerHTML = '';
    tabsList.appendChild(fragment);
    
    // 滚动到当前活跃标签页
    setTimeout(() => {
      scrollToActiveTabItem();
    }, 100);
  } catch (error) {
    console.error('加载标签页列表失败:', error);
    showMessage('加载标签页列表失败', 'error');
  }
}

// 渲染不分组的标签页
function renderTabsWithoutGroups(tabs, fragment) {
  for (const tab of tabs) {
    const tabItem = createTabItem(tab);
    fragment.appendChild(tabItem);
  }
}

// 创建标签页分组
function createTabGroup(group, tabs) {
  const groupElement = document.createElement('div');
  groupElement.className = 'tab-group';
  
  // 创建分组头部
  const groupHeader = document.createElement('div');
  groupHeader.className = 'tab-group-header';
  
  const toggle = document.createElement('span');
  toggle.className = 'tab-group-toggle';
  toggle.textContent = '▼';
  
  const title = document.createElement('span');
  title.className = 'tab-group-title';
  title.textContent = group ? group.title || '未命名分组' : '未分组标签页';
  
  // 计算活跃和休眠标签页数量
  const activeTabs = tabs.filter(tab => !tab.discarded).length;
  const hibernatedTabs = tabs.filter(tab => tab.discarded).length;
  
  // 删除分组内存显示，因为无法精准估算
  
  // 创建一键休眠按钮（小巧版本）- 只有当有活跃标签页时才显示
  let hibernateBtn = null;
  if (activeTabs > 0) {
    hibernateBtn = document.createElement('button');
    hibernateBtn.className = 'group-hibernate-btn-small';
    hibernateBtn.innerHTML = '💤';
    hibernateBtn.title = '休眠组内所有标签页';
    hibernateBtn.style.cssText = 'background: none; border: none; font-size: 16px; cursor: pointer; padding: 2px 4px; margin-left: auto; margin-right: 8px;';
    hibernateBtn.addEventListener('click', async (e) => {
      e.stopPropagation(); // 防止触发分组折叠
      const activeTabsInGroup = tabs.filter(tab => !tab.discarded && !tab.active);
      for (const tab of activeTabsInGroup) {
        try {
          await hibernateTab(tab.id);
        } catch (error) {
          console.error('休眠标签页失败:', error);
        }
      }
      // 刷新列表
      debouncedLoadTabsList();
      showMessage(`已休眠 ${activeTabsInGroup.length} 个标签页`);
    });
  }
  
  // 创建数字显示块 - 只有当有标签页时才显示
  let countBlock = null;
  if (activeTabs > 0 || hibernatedTabs > 0) {
    countBlock = document.createElement('div');
    countBlock.className = 'tab-group-count-block';
    
    // 左侧休眠区域 - 只有当有休眠标签页时才显示
    if (hibernatedTabs > 0) {
      const hibernatedSection = document.createElement('div');
      hibernatedSection.className = 'count-section hibernated-section';
      const hibernatedIcon = document.createElement('span');
      hibernatedIcon.className = 'sleep-icon';
      hibernatedIcon.textContent = '💤';
      hibernatedIcon.style.filter = 'grayscale(100%)';
      hibernatedSection.appendChild(hibernatedIcon);
      const hibernatedCount = document.createElement('span');
      hibernatedCount.className = 'count-number';
      hibernatedCount.textContent = hibernatedTabs;
      hibernatedSection.appendChild(hibernatedCount);
      countBlock.appendChild(hibernatedSection);
    }
    
    // 分割线 - 只有当两边都有数字时才显示
    if (activeTabs > 0 && hibernatedTabs > 0) {
      const divider = document.createElement('div');
      divider.className = 'count-divider';
      divider.textContent = '/';
      countBlock.appendChild(divider);
    }
    
    // 右侧活跃区域 - 只有当有活跃标签页时才显示
    if (activeTabs > 0) {
      const activeSection = document.createElement('div');
      activeSection.className = 'count-section active-section';
      const activeIcon = document.createElement('span');
      activeIcon.className = 'fire-icon';
      activeIcon.textContent = '🔥';
      activeSection.appendChild(activeIcon);
      const activeCount = document.createElement('span');
      activeCount.className = 'count-number';
      activeCount.textContent = activeTabs;
      activeSection.appendChild(activeCount);
      countBlock.appendChild(activeSection);
    }
  }
  
  groupHeader.appendChild(toggle);
  groupHeader.appendChild(title);
  if (hibernateBtn) {
    groupHeader.appendChild(hibernateBtn);
  }
  if (countBlock) {
    groupHeader.appendChild(countBlock);
  }
  
  // 创建分组内容
  const groupContent = document.createElement('div');
  groupContent.className = 'tab-group-content';
  
  tabs.forEach(tab => {
    const tabItem = createTabItem(tab);
    groupContent.appendChild(tabItem);
  });
  
  // 添加点击事件切换展开/折叠
  groupHeader.addEventListener('click', () => {
    const isCollapsed = groupContent.classList.contains('collapsed');
    if (isCollapsed) {
      groupContent.classList.remove('collapsed');
      toggle.classList.remove('collapsed');
    } else {
      groupContent.classList.add('collapsed');
      toggle.classList.add('collapsed');
    }
  });
  
  groupElement.appendChild(groupHeader);
  groupElement.appendChild(groupContent);
  
  return groupElement;
}

// 创建标签页项
function createTabItem(tab) {
  const tabItem = document.createElement('div');
  tabItem.className = 'tab-item';
  
  // 添加lastAccessed时间信息到title属性
  if (tab.lastAccessed) {
    const lastAccessedDate = new Date(tab.lastAccessed);
    tabItem.title = `${dynamicT('lastAccessedTime')}: ${lastAccessedDate.toLocaleString()}`;
  }
  
  // 获取标签页状态
  const isActive = tab.active;
  const isHibernated = tab.discarded;
  const isAudible = tab.audible;
  
  // 如果是当前活跃标签页，添加高亮样式
  if (isActive) {
    tabItem.classList.add('active-tab');
  }
  
  // 添加点击事件以跳转到标签页
  tabItem.style.cursor = 'pointer';
  tabItem.addEventListener('click', async (e) => {
    // 如果点击的是按钮，不触发跳转
    if (e.target.tagName === 'BUTTON') {
      return;
    }
    
    try {
      // 先切换到对应窗口
      await browser.windows.update(tab.windowId, { focused: true });
      // 再激活对应标签页
      await browser.tabs.update(tab.id, { active: true });
      // 关闭插件弹窗
      window.close();
    } catch (error) {
      console.error('跳转标签页失败:', error);
      showMessage('跳转失败', 'error');
    }
  });
  
  // 创建图标元素
  const favicon = document.createElement('img');
  favicon.className = 'tab-favicon';
  favicon.src = tab.favIconUrl || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23ddd"/></svg>';
  favicon.onerror = function() {
    this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23ddd"/></svg>';
  };
  
  // 创建标签页信息
  const tabInfo = document.createElement('div');
  tabInfo.className = 'tab-info';
  
  const tabTitle = document.createElement('div');
  tabTitle.className = 'tab-title';
  tabTitle.textContent = tab.title || '无标题';
  
  tabInfo.appendChild(tabTitle);
  
  // 创建操作按钮
  const tabActions = document.createElement('div');
  tabActions.className = 'tab-actions';
  
  // 休眠按钮 - 始终显示，但根据状态改变样式和功能
  const hibernateBtn = document.createElement('button');
  hibernateBtn.className = 'tab-action-btn hibernate-btn';
  
  if (isHibernated) {
    // 已休眠：灰色图标，不可点击
    hibernateBtn.textContent = '💤';
    hibernateBtn.style.opacity = '0.3';
    hibernateBtn.style.cursor = 'not-allowed';
    hibernateBtn.disabled = true;
    hibernateBtn.title = '已休眠';
  } else if (isActive) {
    // 活动标签页：灰色图标，不可点击
    hibernateBtn.textContent = '💤';
    hibernateBtn.style.opacity = '0.3';
    hibernateBtn.style.cursor = 'not-allowed';
    hibernateBtn.disabled = true;
    hibernateBtn.title = '活动标签页无法休眠';
  } else {
    // 可休眠：彩色图标，可点击
    hibernateBtn.textContent = '💤';
    hibernateBtn.style.opacity = '1';
    hibernateBtn.style.cursor = 'pointer';
    hibernateBtn.disabled = false;
    hibernateBtn.title = '休眠标签页';
    hibernateBtn.onclick = () => hibernateTab(tab.id);
  }
  
  tabActions.appendChild(hibernateBtn);
  
  // 检查是否可以关闭标签页
  const canClose = !isActive
    
  if (canClose) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'tab-action-btn close-btn';
    closeBtn.textContent = '✕';
    closeBtn.title = '关闭标签页';
    closeBtn.onclick = () => closeTab(tab.id);
    tabActions.appendChild(closeBtn);
  }
  
  // 组装元素
  tabItem.appendChild(favicon);
  tabItem.appendChild(tabInfo);
  tabItem.appendChild(tabActions);
  
  return tabItem;
}

// 休眠单个标签页
async function hibernateTab(tabId) {
  try {
    await browser.tabs.discard(tabId);
    loadStats();
    // 标签页变化会通过事件驱动自动更新列表
  } catch (error) {
    showMessage('休眠标签页失败', 'error');
  }
}

// 关闭单个标签页
async function closeTab(tabId) {
  try {
    // 获取标签页信息进行检查
    const tab = await browser.tabs.get(tabId);
    
    // 检查是否是扩展程序页面或特殊页面
    if (tab.url.startsWith('chrome-extension://') || 
        tab.url.startsWith('chrome://') || 
        tab.url.startsWith('edge://') || 
        tab.url.startsWith('about:') ||
        tab.url.startsWith('moz-extension://') ||
        tab.url.startsWith('extension://') ||
        tab.url === 'chrome://newtab/' ||
        tab.url === 'edge://newtab/' ||
        tab.url === 'about:newtab' ||
        tab.url === 'about:blank') {
      showMessage(dynamicT('cannotCloseSystemPage'), 'error');
      return;
    }
    
    await browser.tabs.remove(tabId);
    showMessage('标签页已关闭', 'success');
    loadStats();
    // 标签页变化会通过事件驱动自动更新列表
  } catch (error) {
    console.error('关闭标签页错误:', error);
    if (error.message && error.message.includes('Cannot close the only remaining tab')) {
      showMessage('无法关闭最后一个标签页', 'error');
    } else if (error.message && error.message.includes('No tab with id')) {
      showMessage('标签页不存在', 'error');
    } else {
      showMessage('关闭标签页失败: ' + (error.message || '未知错误'), 'error');
    }
  }
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', async function() {
  // 初始化语言设置
  currentLanguage = await getCurrentLanguage();
  await updateUILanguage();
  
  await loadWindowsList(); // 先加载窗口列表，设置currentWindowId
  loadStats(); // 然后加载统计信息
  loadTabsList(); // 最后加载标签页列表
  await checkHibernationNotification(); // 检查并显示休眠通知
  
  // 通知background popup已连接
  browser.runtime.sendMessage({ action: 'popupConnected' }).then(() => {
    // Popup connected message sent to background
  }).catch((error) => {
    console.error('Failed to send popup connected message:', error);
  });
  
  // 绑定头部按钮事件
  document.getElementById('settingsBtn').addEventListener('click', showSettingsDialog);
  document.getElementById('helpBtn').addEventListener('click', showHelpDialog);
  

  
  // 绑定休眠图标的鼠标悬停事件
  setupHibernateIconHover();
  
  // 监听来自background的标签页变化消息
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Popup received message
    if (message.action === 'tabsChanged') {
      // 使用防抖的方式更新标签页列表和统计信息
      debouncedLoadTabsList();
      loadStats();
    } else if (message.action === 'showRealtimeHibernationNotification') {
      // Showing realtime hibernation notification
      // 显示实时休眠通知，优先显示批量数量
      const displayCount = message.batchCount || message.count;
      showHibernationNotification(displayCount);
      // 重置计数器
      browser.runtime.sendMessage({ action: 'resetHibernationCount' }).catch(() => {});
    }
  });
});

// 页面卸载时通知background
window.addEventListener('beforeunload', () => {
  browser.runtime.sendMessage({ action: 'popupDisconnected' }).catch(() => {
    // 忽略连接错误
  });
});

// 页面隐藏时也通知background（处理popup关闭的情况）
window.addEventListener('pagehide', () => {
  browser.runtime.sendMessage({ action: 'popupDisconnected' }).catch(() => {
    // 忽略连接错误
  });
});

// 检查并显示休眠通知
async function checkHibernationNotification() {
  try {
    const response = await browser.runtime.sendMessage({ action: 'getHibernationCount' });
    const count = response.count;
    
    if (count > 0) {
      // 显示休眠通知
      showHibernationNotification(count);
      
      // 重置计数器
      await browser.runtime.sendMessage({ action: 'resetHibernationCount' });
    }
  } catch (error) {
    console.error('Error checking hibernation notification:', error);
  }
}

// 显示休眠通知
function showHibernationNotification(count) {
  const message = dynamicT('autoHibernatedTabs').replace('{count}', count);
  
  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = 'hibernation-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">💤</span>
      <span class="notification-text">${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  // 添加样式
  notification.style.cssText = `
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: #4CAF50;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    font-size: 14px;
    animation: slideDown 0.3s ease-out;
  `;
  
  // 添加动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideDown {
      from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
      to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    .notification-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .notification-close {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      margin-left: 8px;
    }
    .notification-close:hover {
      opacity: 0.8;
    }
  `;
  document.head.appendChild(style);
  
  // 添加到页面
  document.body.appendChild(notification);
  
  // 3秒后自动消失
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 3000);
}

// 设置休眠图标的悬停效果
function setupHibernateIconHover() {
  const hibernateItem = document.getElementById('hibernateItem');
  const hibernateIcon = document.getElementById('hibernateIcon');
  
  if (hibernateItem && hibernateIcon) {
    hibernateItem.addEventListener('mouseenter', function() {
      // 获取当前活动标签页数量
      const activeTabsElement = document.getElementById('activeTabs');
      const activeTabsCount = parseInt(activeTabsElement.textContent) || 0;
      
      if (activeTabsCount > 0) {
        // 变为彩色
        hibernateIcon.style.filter = 'none';
        // 更改提示文字
        hibernateItem.title = '休眠当前窗口所有活动标签页';
        // 添加点击事件
        hibernateItem.style.cursor = 'pointer';
        hibernateItem.onclick = hibernateAllActiveTabs;
      }
    });
    
    hibernateItem.addEventListener('mouseleave', function() {
      // 恢复灰色
      hibernateIcon.style.filter = 'grayscale(100%)';
      // 恢复原始提示文字
      hibernateItem.title = '已经休眠的标签页';
      // 移除点击事件
      hibernateItem.style.cursor = 'default';
      hibernateItem.onclick = null;
    });
  }
}

// 休眠当前窗口所有活动标签页
async function hibernateAllActiveTabs() {
  try {
    const queryOptions = currentWindowId ? { windowId: currentWindowId } : {};
    const tabs = await browser.tabs.query(queryOptions);
    const activeTabsToHibernate = tabs.filter(tab => !tab.discarded && !tab.active);
    
    let hibernatedCount = 0;
    for (const tab of activeTabsToHibernate) {
      try {
        await browser.tabs.discard(tab.id);
        hibernatedCount++;
      } catch (error) {
        console.error('休眠标签页失败:', error);
      }
    }
    
    if (hibernatedCount > 0) {
      showMessage(`已休眠 ${hibernatedCount} 个活动标签页`, 'success');
    } else {
      showMessage('没有可休眠的活动标签页', 'info');
    }
    
    // 统计信息和列表会通过事件驱动自动更新
  } catch (error) {
    console.error('休眠活动标签页失败:', error);
    showMessage('休眠失败', 'error');
  }
}

// 显示设置对话框
function showSettingsDialog() {
  // 创建设置弹窗
  const settingsDialog = document.createElement('div');
  settingsDialog.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(4px);
  `;
  
  const settingsContent = document.createElement('div');
  settingsContent.style.cssText = `
    background: white;
    border-radius: 12px;
    max-width: 380px;
    width: 85%;
    margin: 0 20px;
    max-height: 90vh;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    position: relative;
    display: flex;
    flex-direction: column;
  `;
  
  // 创建内容滚动区域
  const scrollableContent = document.createElement('div');
  scrollableContent.style.cssText = `
    padding: 24px;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
  `;
  
  // 创建固定按钮区域
  const fixedButtonArea = document.createElement('div');
  fixedButtonArea.style.cssText = `
    padding: 16px 24px;
    border-top: 1px solid #e5e7eb;
    background: white;
    border-radius: 0 0 12px 12px;
    flex-shrink: 0;
  `;
  
  const settingsTitle = document.createElement('h3');
  settingsTitle.textContent = `⚙️ ${dynamicT('pluginSettings')}`;
  settingsTitle.style.cssText = 'margin: 0 0 20px 0; color: #333; font-size: 18px;';
  
  // 语言设置
  const languageGroup = document.createElement('div');
  languageGroup.style.cssText = 'margin-bottom: 20px;';
  
  const languageLabel = document.createElement('label');
  languageLabel.textContent = `${dynamicT('languageSettings')}:`;
  languageLabel.style.cssText = 'display: block; margin-bottom: 8px; font-weight: 500; color: #333;';
  
  const languageSelect = document.createElement('select');
  languageSelect.id = 'languageSelect';
  languageSelect.style.cssText = `
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
    background: white;
  `;
  
  // 添加语言选项
  const zhOption = document.createElement('option');
  zhOption.value = 'zh_CN';
  zhOption.textContent = dynamicT('chinese');
  languageSelect.appendChild(zhOption);
  
  const enOption = document.createElement('option');
  enOption.value = 'en';
  enOption.textContent = dynamicT('english');
  languageSelect.appendChild(enOption);
  
  const languageHelp = document.createElement('div');
  languageHelp.textContent = dynamicT('selectLanguage');
  languageHelp.style.cssText = 'font-size: 12px; color: #666; margin-top: 4px;';
  
  languageGroup.appendChild(languageLabel);
  languageGroup.appendChild(languageSelect);
  languageGroup.appendChild(languageHelp);
  
  // 休眠延迟设置
  const delayGroup = document.createElement('div');
  delayGroup.style.cssText = 'margin-bottom: 20px;';
  
  const delayLabel = document.createElement('label');
  delayLabel.textContent = `${dynamicT('hibernationDelay')}:`;
  delayLabel.style.cssText = 'display: block; margin-bottom: 8px; font-weight: 500; color: #333;';
  
  const delayInput = document.createElement('input');
  delayInput.type = 'number';
  delayInput.id = 'hibernationDelayDialog';
  delayInput.min = '-1';
  delayInput.max = '120';
  delayInput.value = '-1';
  delayInput.style.cssText = `
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
  `;
  
  const delayHelp = document.createElement('div');
  delayHelp.textContent = dynamicT('hibernationDelayHelp');
  delayHelp.style.cssText = 'font-size: 12px; color: #666; margin-top: 4px;';
  
  delayGroup.appendChild(delayLabel);
  delayGroup.appendChild(delayInput);
  delayGroup.appendChild(delayHelp);
  
  // 白名单设置
  const whitelistGroup = document.createElement('div');
  whitelistGroup.style.cssText = 'margin-bottom: 24px;';
  
  const whitelistLabel = document.createElement('label');
  whitelistLabel.textContent = `${dynamicT('whitelistDomains')}:`;
  whitelistLabel.style.cssText = 'display: block; margin-bottom: 8px; font-weight: 500; color: #333;';
  
  const whitelistTextarea = document.createElement('textarea');
  whitelistTextarea.id = 'whitelistDialog';
  whitelistTextarea.placeholder = dynamicT('whitelistPlaceholder');
  whitelistTextarea.style.cssText = `
    width: 100%;
    height: 120px;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    resize: vertical;
    box-sizing: border-box;
    font-family: monospace;
  `;
  
  const whitelistHelp = document.createElement('div');
  whitelistHelp.textContent = dynamicT('whitelistHelp');
  whitelistHelp.style.cssText = 'font-size: 12px; color: #666; margin-top: 4px;';
  
  whitelistGroup.appendChild(whitelistLabel);
  whitelistGroup.appendChild(whitelistTextarea);
  whitelistGroup.appendChild(whitelistHelp);
  
  // 快速切换休眠设置
  const quickSwitchGroup = document.createElement('div');
  quickSwitchGroup.style.cssText = 'margin-bottom: 24px;';
  
  const quickSwitchLabel = document.createElement('label');
  quickSwitchLabel.textContent = `${dynamicT('quickSwitchHibernation')}:`;
  quickSwitchLabel.style.cssText = 'display: block; margin-bottom: 8px; font-weight: 500; color: #333;';
  
  const quickSwitchContainer = document.createElement('div');
  quickSwitchContainer.style.cssText = 'display: flex; align-items: center; gap: 8px;';
  
  const quickSwitchCheckbox = document.createElement('input');
  quickSwitchCheckbox.type = 'checkbox';
  quickSwitchCheckbox.id = 'quickSwitchHibernationDialog';
  quickSwitchCheckbox.style.cssText = `
    width: 16px;
    height: 16px;
    cursor: pointer;
  `;
  
  const quickSwitchText = document.createElement('span');
  quickSwitchText.textContent = dynamicT('enableQuickSwitchHibernation');
  quickSwitchText.style.cssText = 'font-size: 14px; color: #333; cursor: pointer;';
  quickSwitchText.onclick = () => quickSwitchCheckbox.click();
  
  const quickSwitchHelp = document.createElement('div');
  quickSwitchHelp.textContent = dynamicT('quickSwitchHibernationHelp');
  quickSwitchHelp.style.cssText = 'font-size: 12px; color: #666; margin-top: 4px;';
  
  quickSwitchContainer.appendChild(quickSwitchCheckbox);
  quickSwitchContainer.appendChild(quickSwitchText);
  quickSwitchGroup.appendChild(quickSwitchLabel);
  quickSwitchGroup.appendChild(quickSwitchContainer);
  quickSwitchGroup.appendChild(quickSwitchHelp);
  
  // 按钮组
  const buttonGroup = document.createElement('div');
  buttonGroup.style.cssText = 'display: flex; gap: 12px; justify-content: flex-end;';
  
  const saveBtn = document.createElement('button');
  saveBtn.textContent = dynamicT('saveSettings');
  saveBtn.style.cssText = `
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.2s;
  `;
  
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = dynamicT('cancel');
  cancelBtn.style.cssText = `
    background: #6b7280;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.2s;
  `;
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  // 加载当前设置
  loadSettingsToDialog(delayInput, whitelistTextarea, languageSelect);
  
  // 事件处理
  saveBtn.onclick = () => saveSettingsFromDialog(delayInput, whitelistTextarea, languageSelect, settingsDialog);
  cancelBtn.onclick = () => document.body.removeChild(settingsDialog);
  closeBtn.onclick = () => document.body.removeChild(settingsDialog);
  settingsDialog.onclick = (e) => {
    if (e.target === settingsDialog) {
      document.body.removeChild(settingsDialog);
    }
  };
  
  // 悬停效果
  saveBtn.onmouseenter = () => saveBtn.style.background = '#2563eb';
  saveBtn.onmouseleave = () => saveBtn.style.background = '#3b82f6';
  cancelBtn.onmouseenter = () => cancelBtn.style.background = '#4b5563';
  cancelBtn.onmouseleave = () => cancelBtn.style.background = '#6b7280';
  
  buttonGroup.appendChild(cancelBtn);
  buttonGroup.appendChild(saveBtn);
  
  // 将内容添加到滚动区域
  scrollableContent.appendChild(settingsTitle);
  scrollableContent.appendChild(languageGroup);
  scrollableContent.appendChild(delayGroup);
  scrollableContent.appendChild(whitelistGroup);
  scrollableContent.appendChild(quickSwitchGroup);
  
  // 将按钮添加到固定区域
  fixedButtonArea.appendChild(buttonGroup);
  
  // 组装弹窗
  settingsContent.appendChild(scrollableContent);
  settingsContent.appendChild(fixedButtonArea);
  settingsContent.appendChild(closeBtn);
  settingsDialog.appendChild(settingsContent);
  document.body.appendChild(settingsDialog);
}

// 加载设置到对话框
async function loadSettingsToDialog(delayInput, whitelistTextarea, languageSelect) {
  try {
    const result = await browser.runtime.sendMessage({ action: 'getSettings' });
    if (result.success) {
      // 如果hibernationDelay为-1，直接显示-1，否则转换为分钟
      if (result.settings.hibernationDelay === -1) {
        delayInput.value = -1;
      } else {
        delayInput.value = result.settings.hibernationDelay / (60 * 1000);
      }
      whitelistTextarea.value = result.settings.whitelist.join('\n');
      
      // 加载快速切换休眠设置
       const quickSwitchCheckbox = document.getElementById('quickSwitchHibernationDialog');
       if (quickSwitchCheckbox) {
         quickSwitchCheckbox.checked = result.settings.quickSwitchHibernation !== undefined ? result.settings.quickSwitchHibernation : true;
       }
    }
    
    // 加载当前语言设置
    const currentLanguage = await getCurrentLanguage();
    languageSelect.value = currentLanguage;
  } catch (error) {
    console.error('加载设置失败:', error);
  }
}

// 从对话框保存设置
async function saveSettingsFromDialog(delayInput, whitelistTextarea, languageSelect, dialog) {
  try {
    const inputValue = parseInt(delayInput.value);
    // 如果输入值为-1，直接保存-1，否则转换为毫秒
    const hibernationDelay = inputValue === -1 ? -1 : inputValue * 60 * 1000;
    const whitelist = whitelistTextarea.value.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    // 获取快速切换休眠设置
    const quickSwitchCheckbox = document.getElementById('quickSwitchHibernationDialog');
    const quickSwitchHibernation = quickSwitchCheckbox ? quickSwitchCheckbox.checked : false;
    
    const result = await browser.runtime.sendMessage({
      action: 'updateSettings',
      settings: {
        hibernationDelay: hibernationDelay,
        whitelist: whitelist,
        quickSwitchHibernation: quickSwitchHibernation
      }
    });
    
    // 保存语言设置
    const selectedLanguage = languageSelect.value;
    await saveLanguagePreference(selectedLanguage);
    
    if (result.success) {
      showMessage(dynamicT('languageChanged'));
      document.body.removeChild(dialog);
      
      // 重新加载界面以应用新语言
      await updateUILanguage();
      loadStats(); // 刷新统计信息
    } else {
      showMessage(dynamicT('saveSettingsFailed'), 'error');
    }
  } catch (error) {
    showMessage(dynamicT('saveSettingsFailed'), 'error');
  }
}

// 显示帮助对话框
function showHelpDialog() {
  const helpText = dynamicT('helpContent');
  
  // 创建帮助弹窗
  const helpDialog = document.createElement('div');
  helpDialog.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(4px);
  `;
  
  const helpContent = document.createElement('div');
  helpContent.style.cssText = `
    background: white;
    border-radius: 12px;
    max-width: 350px;
    width: 85%;
    margin: 0 20px;
    max-height: 80vh;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    position: relative;
    display: flex;
    flex-direction: column;
  `;
  
  // 创建帮助内容滚动区域
  const helpScrollableContent = document.createElement('div');
  helpScrollableContent.style.cssText = `
    padding: 24px;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
  `;
  
  const helpTitle = document.createElement('h3');
  helpTitle.textContent = dynamicT('helpTitle');
  helpTitle.style.cssText = 'margin: 0 0 16px 0; color: #333; font-size: 16px;';
  
  const helpBody = document.createElement('pre');
  helpBody.textContent = helpText;
  helpBody.style.cssText = `
    white-space: pre-wrap;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 12px;
    line-height: 1.5;
    color: #555;
    margin: 0;
  `;
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = dynamicT('close');
  closeBtn.style.cssText = `
    position: absolute;
    top: 12px;
    right: 12px;
    background: #f0f0f0;
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 12px;
    z-index: 1;
  `;
  
  closeBtn.onclick = () => document.body.removeChild(helpDialog);
  helpDialog.onclick = (e) => {
    if (e.target === helpDialog) {
      document.body.removeChild(helpDialog);
    }
  };
  
  // 将内容添加到滚动区域
  helpScrollableContent.appendChild(helpTitle);
  helpScrollableContent.appendChild(helpBody);
  
  // 组装帮助弹窗
  helpContent.appendChild(helpScrollableContent);
  helpContent.appendChild(closeBtn);
  helpDialog.appendChild(helpContent);
  document.body.appendChild(helpDialog);
}