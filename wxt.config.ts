import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/i18n/module'],
  manifest: ({ browser }) => {
    const baseManifest = {
      name: '__MSG_extName__',
      description: '__MSG_extDescription__',
      // version 会自动从 package.json 读取，无需手动指定
      default_locale: 'en',
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
        'system.memory'
      );
    } else if (browser === 'firefox') {
      // Firefox 只添加支持的权限
      baseManifest.permissions.push(
        'tabGroups' // Firefox 支持 tabGroups
        // 不添加 windows, system.memory（Firefox 不支持）
      );
      
      // 添加 Firefox 扩展 ID
      baseManifest.browser_specific_settings = {
        gecko: {
          id: '{539b7cdf-9763-46b2-8503-57b77ecf9d3e}'
        }
      };
    }

    return baseManifest;
  },
  runner: {
    disabled: true // 禁用自动打开浏览器
  }
});