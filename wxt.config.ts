import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: ({ browser }) => {
    const baseManifest = {
      name: '网页休眠大师',
      description: '智能管理标签页休眠，自动节省内存和CPU资源，提升浏览器性能',
      version: '0.0.1',
      permissions: [
        'tabs',
        'storage',
        'activeTab'
      ],
      action: {
        default_popup: 'popup.html',
        default_title: '网页休眠大师'
      },
      background: {
        service_worker: 'background.js'
      },
      icons: browser === 'edge' ? {
        16: 'icon-16.png',
        32: 'icon-32.png', // Edge使用PNG格式以确保兼容性
        48: 'icon-48.png', // Edge使用PNG格式以确保兼容性
        128: 'icon-128.png'
      } : {
        16: 'icon-16.png',
        32: 'icon-32.svg',
        48: 'icon-48.svg',
        128: 'icon-128.svg'
      }
    };

    // 根据浏览器添加特定权限
    if (browser === 'chrome' || browser === 'edge') {
      baseManifest.permissions.push(
        'tabGroups',
        'windows',
        'processes',
        'system.memory'
      );
    } else if (browser === 'firefox') {
      // Firefox 只添加支持的权限
      baseManifest.permissions.push(
        'tabGroups' // Firefox 支持 tabGroups
        // 不添加 windows, processes, system.memory（Firefox 不支持）
      );
    }

    return baseManifest;
  },
  runner: {
    disabled: true // 禁用自动打开浏览器
  }
});