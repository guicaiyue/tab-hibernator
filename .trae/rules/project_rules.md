# Tab Hibernator 项目开发规则

## 技术架构

### 核心技术栈
- **框架**: WXT (现代浏览器扩展开发框架)
- **语言**: TypeScript (严格模式)
- **标准**: Manifest V3
- **目标浏览器**: Chrome, Firefox, Edge

### 架构模式
- **Event-Driven Architecture**: 基于浏览器事件驱动的响应式架构
- **Observer Pattern**: 标签页状态变化监听
- **Strategy Pattern**: 不同浏览器的兼容性策略
- **Singleton Pattern**: 全局状态管理

## 模块设计规范

### 核心模块划分

#### 1. Background Service Worker (`entrypoints/background.ts`)
- **职责**: 核心业务逻辑、事件监听、状态管理
- **设计模式**: 
  - Observer Pattern (标签页事件监听)
  - State Pattern (扩展状态管理)
  - Command Pattern (消息处理)
- **关键组件**:
  - `TabActivityTracker`: 标签页活动追踪器
  - `HibernationEngine`: 休眠逻辑引擎
  - `SettingsManager`: 设置管理器
  - `MessageRouter`: 消息路由器

#### 2. Popup Interface (`entrypoints/popup.html`)
- **职责**: 用户界面、用户交互、数据展示
- **设计模式**:
  - MVC Pattern (Model-View-Controller)
  - Observer Pattern (UI状态同步)
  - Command Pattern (用户操作处理)
- **关键组件**:
  - `PopupController`: 弹窗控制器
  - `TabListRenderer`: 标签页列表渲染器
  - `StatisticsDisplay`: 统计信息显示器

#### 3. Utility Modules (`utils/`)
- **职责**: 通用工具函数、辅助功能
- **设计模式**:
  - Factory Pattern (对象创建)
  - Strategy Pattern (算法选择)
- **关键模块**:
  - `memory.ts`: 内存计算工具
  - `debounce.ts`: 防抖工具
  - `storage.ts`: 存储抽象层

### 模块间通信规范

#### 消息传递架构
```typescript
// 消息类型定义
interface MessageSchema {
  'GET_SETTINGS': { request: void; response: ExtensionSettings };
  'UPDATE_SETTINGS': { request: Partial<ExtensionSettings>; response: void };
  'HIBERNATE_TAB': { request: { tabId: number }; response: boolean };
  'GET_STATS': { request: void; response: TabStatistics };
}

// 类型安全的消息处理
class MessageHandler {
  handle<T extends keyof MessageSchema>(
    type: T, 
    data: MessageSchema[T]['request']
  ): Promise<MessageSchema[T]['response']> {
    // 实现消息处理逻辑
  }
}
```

## 设计模式应用

### 1. Observer Pattern - 事件监听系统
```typescript
class TabEventObserver {
  private observers: Map<string, Function[]> = new Map();
  
  subscribe(event: string, callback: Function): void {
    if (!this.observers.has(event)) {
      this.observers.set(event, []);
    }
    this.observers.get(event)!.push(callback);
  }
  
  notify(event: string, data: any): void {
    this.observers.get(event)?.forEach(callback => callback(data));
  }
}
```

### 2. Strategy Pattern - 休眠策略
```typescript
interface HibernationStrategy {
  canHibernate(tab: chrome.tabs.Tab): boolean;
  shouldHibernate(tab: chrome.tabs.Tab, lastActivity: number): boolean;
}

class TimeBasedStrategy implements HibernationStrategy {
  constructor(private delay: number) {}
  
  canHibernate(tab: chrome.tabs.Tab): boolean {
    return !tab.active && !tab.pinned && !tab.audible;
  }
  
  shouldHibernate(tab: chrome.tabs.Tab, lastActivity: number): boolean {
    return Date.now() - lastActivity > this.delay * 1000;
  }
}
```

### 3. Factory Pattern - 组件创建
```typescript
class ComponentFactory {
  static createTabRenderer(type: 'list' | 'grid'): TabRenderer {
    switch (type) {
      case 'list': return new ListTabRenderer();
      case 'grid': return new GridTabRenderer();
      default: throw new Error(`Unknown renderer type: ${type}`);
    }
  }
}
```

### 4. Command Pattern - 操作封装
```typescript
interface Command {
  execute(): Promise<void>;
  undo(): Promise<void>;
}

class HibernateTabCommand implements Command {
  constructor(private tabId: number) {}
  
  async execute(): Promise<void> {
    await chrome.tabs.discard(this.tabId);
  }
  
  async undo(): Promise<void> {
    await chrome.tabs.reload(this.tabId);
  }
}
```

## 代码风格规范

### TypeScript 编码规范
- **严格模式**: 启用所有 TypeScript 严格检查
- **类型优先**: 优先使用 interface 而非 type
- **命名约定**: 
  - 类名: PascalCase
  - 方法/变量: camelCase
  - 常量: UPPER_SNAKE_CASE
  - 私有成员: 前缀下划线

### 函数式编程原则
- **纯函数优先**: 工具函数应为纯函数
- **不可变性**: 避免直接修改对象，使用扩展运算符
- **函数组合**: 使用高阶函数和函数组合

```typescript
// 推荐的函数式风格
const filterActiveTabs = (tabs: chrome.tabs.Tab[]) => 
  tabs.filter(tab => tab.active);

const mapToTabInfo = (tabs: chrome.tabs.Tab[]) => 
  tabs.map(tab => ({ id: tab.id, title: tab.title, url: tab.url }));

const getActiveTabInfo = (tabs: chrome.tabs.Tab[]) => 
  mapToTabInfo(filterActiveTabs(tabs));
```

## 性能设计原则

### 1. 内存管理策略
- **WeakMap/WeakSet**: 用于缓存，避免内存泄漏
- **对象池**: 复用频繁创建的对象
- **及时清理**: 组件销毁时清理事件监听器

### 2. 异步操作优化
- **防抖/节流**: 频繁触发的事件使用防抖
- **批量处理**: 合并多个异步操作
- **错误隔离**: 单个操作失败不影响整体

### 3. DOM 操作优化
- **虚拟滚动**: 大量数据列表使用虚拟滚动
- **DocumentFragment**: 批量 DOM 操作
- **事件委托**: 减少事件监听器数量

## 错误处理规范

### 错误分类和处理策略
```typescript
// 错误类型定义
class ExtensionError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean = true
  ) {
    super(message);
    this.name = 'ExtensionError';
  }
}

// 错误处理装饰器
function handleErrors(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      console.error(`Error in ${propertyKey}:`, error);
      if (error instanceof ExtensionError && error.recoverable) {
        // 尝试恢复操作
      }
      throw error;
    }
  };
}
```

## 测试架构

### 测试金字塔
- **单元测试**: 70% - 测试纯函数和独立组件
- **集成测试**: 20% - 测试模块间交互
- **端到端测试**: 10% - 测试完整用户流程

### Mock 策略
```typescript
// Chrome API Mock
const mockChromeAPI = {
  tabs: {
    query: jest.fn(),
    discard: jest.fn(),
    onActivated: { addListener: jest.fn() },
    onUpdated: { addListener: jest.fn() }
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn()
    }
  }
};

// 全局 Chrome 对象模拟
(global as any).chrome = mockChromeAPI;
```

## 安全规范

### 权限管理
- **最小权限原则**: 只申请必要的浏览器权限
- **数据验证**: 所有外部输入必须验证和清理
- **CSP 策略**: 严格的内容安全策略配置
- **敏感信息**: 避免在日志中记录敏感数据

### 错误处理策略
```typescript
class ExtensionError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean = true
  ) {
    super(message);
    this.name = 'ExtensionError';
  }
}
```

## 开发工作流

### Git 工作流
- **分支策略**: GitFlow (main/develop/feature/hotfix)
- **提交规范**: 语义化提交信息
- **代码审查**: 所有 PR 必须经过审查
- **自动化测试**: CI/CD 管道自动运行测试

### 质量保证
- **测试覆盖率**: 最低 80%
- **代码复杂度**: 单函数复杂度不超过 10
- **性能基准**: 内存使用增长不超过 50MB
- **安全扫描**: 自动化安全漏洞检测