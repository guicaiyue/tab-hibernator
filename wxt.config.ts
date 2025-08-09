import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: '标签休眠大师',
    description: '智能管理标签页休眠，自动节省内存和CPU资源，提升浏览器性能',
    version: '1.0.0',
    permissions: [
      'tabs',
      'storage',
      'activeTab',
      'tabGroups',
      'windows',
      'processes',
      'system.memory'
    ],
    action: {
      default_popup: 'popup.html',
      default_title: '标签休眠大师'
    },
    background: {
      service_worker: 'background.js'
    },
    icons: {
      16: 'icon-16.png',
      32: 'icon-32.svg',
      48: 'icon-48.svg',
      128: 'icon-128.svg'
    }
  },
  runner: {
    disabled: true // 禁用自动打开浏览器
  }
});