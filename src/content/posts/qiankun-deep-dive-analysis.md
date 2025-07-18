---
title: "qiankun 深度解析：微前端框架的生产级实践"
description: "深入解析 qiankun 微前端框架的核心技术原理，包括 HTML Entry、沙箱隔离、样式隔离等关键技术实现，以及在大型项目中的实际应用"
publishedAt: "2024-01-10"
category: "微前端"
tags: ["qiankun", "微前端", "沙箱隔离", "HTML Entry"]
featured: true
---

# qiankun 深度解析：微前端框架的生产级实践

在之前的文章中，我们分析了 single-spa 的技术原理，也提到了它在隔离和工程化方面的不足。今天我想和大家深入探讨一下 qiankun 这个基于 single-spa 的微前端框架。在过去两年的项目实践中，qiankun 帮助我们解决了很多单用 single-spa 遇到的问题。

## qiankun 解决了什么问题

qiankun 是阿里巴巴开源的微前端解决方案，它基于 single-spa 进行了二次开发，解决了很多生产环境中的实际问题：

### 1. 更简洁的应用加载方式

相比 single-spa 的 JS Entry 方式，qiankun 采用了 HTML Entry 的方式，这让子应用的接入变得更加简单。

**single-spa 的方式：**
```javascript
// 子应用需要暴露特定的生命周期函数
window.singleSpaNavigate = navigateToUrl;
window.singleSpaReact = singleSpaReact;
// 主应用需要手动处理资源加载
System.import('//localhost:3001/js/main.js');
```

**qiankun 的方式：**
```javascript
// 主应用只需要配置入口 HTML
registerMicroApps([
  {
    name: 'react-app',
    entry: '//localhost:3001',
    container: '#container',
    activeRule: '/react-app',
  },
]);
```

### 2. 开箱即用的沙箱隔离

在我们之前的 single-spa 项目中，经常遇到全局变量污染的问题，比如：
- 子应用 A 修改了 `window.$ = jQuery3.x`
- 子应用 B 依赖 `window.$ = jQuery2.x`
- 切换应用时就会出现版本冲突

qiankun 通过 Proxy 沙箱完美解决了这个问题。

## 核心技术原理解析

### 1. HTML Entry 的实现机制

qiankun 通过 `import-html-entry` 库来实现 HTML Entry 的功能。让我们看看这个过程是如何工作的：

```javascript
// 简化版的 HTML Entry 解析过程
class HTMLEntryLoader {
  async loadApp(entry) {
    // 1. 获取 HTML 内容
    const html = await fetch(entry).then(res => res.text());
    
    // 2. 解析 HTML，提取资源
    const { template, scripts, styles } = this.parseHTML(html);
    
    // 3. 加载 CSS 资源
    const styleSheets = await this.loadStyles(styles);
    
    // 4. 加载 JS 资源
    const scriptTexts = await this.loadScripts(scripts);
    
    return {
      template,
      execScripts: (sandbox) => this.execScripts(scriptTexts, sandbox),
      assetPublicPath: this.getAssetPublicPath(entry)
    };
  }
  
  parseHTML(html) {
    // 通过正则表达式解析 HTML
    const scriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*><\/script>/g;
    const styleRegex = /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']stylesheet["'][^>]*>/g;
    
    const scripts = [];
    const styles = [];
    let match;
    
    while ((match = scriptRegex.exec(html)) !== null) {
      scripts.push(match[1]);
    }
    
    while ((match = styleRegex.exec(html)) !== null) {
      styles.push(match[1]);
    }
    
    // 移除原有的 script 和 link 标签，生成纯净的 HTML 模板
    const template = html
      .replace(scriptRegex, '')
      .replace(styleRegex, '');
    
    return { template, scripts, styles };
  }
  
  async execScripts(scriptTexts, sandbox = window) {
    // 在指定沙箱中执行脚本
    const execScript = (scriptText) => {
      const func = new Function('window', 'self', 'globalThis', scriptText);
      func(sandbox, sandbox, sandbox);
    };
    
    scriptTexts.forEach(execScript);
    
    // 返回子应用导出的生命周期函数
    return {
      bootstrap: sandbox.bootstrap,
      mount: sandbox.mount,
      unmount: sandbox.unmount,
      update: sandbox.update
    };
  }
}
```

### 2. 沙箱隔离的实现

qiankun 的沙箱隔离是其最核心的功能之一。它提供了两种沙箱模式：

#### ProxySandbox（推荐）

```javascript
class ProxySandbox {
  constructor(name) {
    this.name = name;
    this.active = false;
    this.updatedValueSet = new Set();
    
    // 创建 Proxy 代理
    this.proxy = new Proxy(window, {
      get: (target, prop) => {
        // 优先从沙箱中获取
        if (this.updatedValueSet.has(prop)) {
          return this.sandboxStorage[prop];
        }
        
        // 从全局对象获取
        const value = target[prop];
        
        // 如果是函数，需要绑定正确的 this
        if (typeof value === 'function') {
          return value.bind(target);
        }
        
        return value;
      },
      
      set: (target, prop, value) => {
        if (this.active) {
          // 记录修改的属性
          this.updatedValueSet.add(prop);
          this.sandboxStorage[prop] = value;
          
          // 对于某些全局属性，需要同步到真实 window
          if (this.shouldSyncToGlobal(prop)) {
            target[prop] = value;
          }
          
          return true;
        }
        
        return false;
      },
      
      has: (target, prop) => {
        return prop in this.sandboxStorage || prop in target;
      },
      
      deleteProperty: (target, prop) => {
        if (this.active) {
          delete this.sandboxStorage[prop];
          this.updatedValueSet.delete(prop);
          return true;
        }
        return false;
      }
    });
  }
  
  activate() {
    this.active = true;
    this.sandboxStorage = {};
  }
  
  deactivate() {
    this.active = false;
    // 清理沙箱中的变量
    this.sandboxStorage = {};
  }
  
  shouldSyncToGlobal(prop) {
    // 某些属性需要同步到全局，比如 document.title
    return ['title', 'location'].includes(prop);
  }
}
```

#### 在实际项目中的应用

在我们的项目中，这种沙箱机制解决了很多实际问题：

```javascript
// 子应用 A
window.userInfo = { name: 'Alice', role: 'admin' };
window.API_BASE_URL = 'https://api-a.example.com';

// 子应用 B
window.userInfo = { name: 'Bob', role: 'user' };
window.API_BASE_URL = 'https://api-b.example.com';

// 在 qiankun 中，这些全局变量互不干扰
// 每个子应用都有自己的沙箱环境
```

### 3. 样式隔离的实现

qiankun 提供了多种样式隔离方案：

#### 1. 严格样式隔离（Shadow DOM）

```javascript
// 启用严格样式隔离
start({
  sandbox: {
    strictStyleIsolation: true,
  },
});

// 实现原理
class StrictStyleIsolation {
  mount(appElement) {
    // 将子应用包裹在 Shadow DOM 中
    const shadowRoot = appElement.attachShadow({ mode: 'open' });
    
    // 子应用的样式只在 Shadow DOM 内生效
    shadowRoot.innerHTML = `
      <style>
        /* 子应用的样式 */
      </style>
      <div id="app">
        <!-- 子应用内容 -->
      </div>
    `;
  }
}
```

#### 2. 实验性样式隔离（推荐）

```javascript
// 启用实验性样式隔离
start({
  sandbox: {
    experimentalStyleIsolation: true,
  },
});

// 实现原理
class ExperimentalStyleIsolation {
  processStyle(appElement, stylesheetElement, appInstanceId) {
    const css = stylesheetElement.textContent;
    
    // 为 CSS 选择器添加属性选择器前缀
    const scopedCSS = css.replace(/([^{}]+)\s*{/g, (match, selector) => {
      // 跳过 @media、@keyframes 等规则
      if (selector.trim().startsWith('@')) {
        return match;
      }
      
      // 添加应用特定的属性选择器
      const scopedSelector = selector
        .split(',')
        .map(s => `div[data-qiankun-${appInstanceId}] ${s.trim()}`)
        .join(', ');
      
      return `${scopedSelector} {`;
    });
    
    stylesheetElement.textContent = scopedCSS;
  }
}
```

#### 3. 手动样式隔离

对于一些特殊场景，我们也可以手动实现样式隔离：

```javascript
// 子应用的样式添加命名空间
.micro-app-user .header {
  background: #f0f0f0;
}

.micro-app-user .sidebar {
  width: 200px;
}

// 通过 CSS-in-JS 实现动态样式隔离
const createScopedStyle = (appName, styles) => {
  const scopedStyles = {};
  
  Object.keys(styles).forEach(key => {
    scopedStyles[key] = {
      ...styles[key],
      '&': {
        [`[data-app="${appName}"] &`]: styles[key]
      }
    };
  });
  
  return scopedStyles;
};
```

## 生产环境优化实践

### 1. 预加载策略

```javascript
// 智能预加载
class MicroAppPreloader {
  constructor() {
    this.preloadedApps = new Map();
    this.preloadQueue = [];
  }
  
  // 基于用户行为预加载
  setupIntelligentPreload() {
    // 鼠标悬停预加载
    document.addEventListener('mouseover', (event) => {
      const link = event.target.closest('a[data-preload]');
      if (link) {
        const appName = link.getAttribute('data-preload');
        this.preloadApp(appName);
      }
    });
    
    // 空闲时预加载
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        this.preloadQueue.forEach(appName => {
          this.preloadApp(appName);
        });
      });
    }
  }
  
  async preloadApp(appName) {
    if (this.preloadedApps.has(appName)) {
      return this.preloadedApps.get(appName);
    }
    
    const app = getApp(appName);
    if (app) {
      const preloadPromise = prefetchApps([app]);
      this.preloadedApps.set(appName, preloadPromise);
      return preloadPromise;
    }
  }
}
```

### 2. 错误处理和监控

```javascript
// 微前端错误监控
class MicroAppErrorHandler {
  constructor() {
    this.setupErrorHandling();
    this.setupLifecycleErrorHandling();
  }
  
  setupErrorHandling() {
    // 全局错误监听
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });
    
    // Promise 错误监听
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'promise',
        reason: event.reason
      });
    });
  }
  
  setupLifecycleErrorHandling() {
    // 子应用生命周期错误处理
    addGlobalUncaughtErrorHandler((error) => {
      this.handleError({
        type: 'lifecycle',
        error,
        appName: getCurrentApp()?.name
      });
    });
  }
  
  handleError(errorInfo) {
    // 上报错误信息
    if (window.errorReporter) {
      window.errorReporter.report({
        ...errorInfo,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    }
    
    // 错误降级处理
    this.handleErrorFallback(errorInfo);
  }
  
  handleErrorFallback(errorInfo) {
    if (errorInfo.type === 'lifecycle') {
      // 子应用生命周期错误，尝试重新加载
      console.warn(`应用 ${errorInfo.appName} 出现错误，尝试重新加载`);
      this.reloadApp(errorInfo.appName);
    }
  }
}
```

### 3. 性能优化

```javascript
// 性能优化策略
class MicroAppPerformanceOptimizer {
  constructor() {
    this.setupPerformanceMonitoring();
    this.setupResourceOptimization();
  }
  
  setupPerformanceMonitoring() {
    // 监控子应用加载时间
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('microapp')) {
          this.reportMetric({
            type: 'load_time',
            name: entry.name,
            duration: entry.duration
          });
        }
      });
    });
    
    observer.observe({ entryTypes: ['measure'] });
  }
  
  setupResourceOptimization() {
    // 公共资源提取
    const sharedDependencies = [
      'react', 'react-dom', 'vue', 'lodash', 'moment'
    ];
    
    sharedDependencies.forEach(dep => {
      if (window[dep]) {
        // 将公共依赖注入到子应用沙箱中
        this.injectSharedDependency(dep, window[dep]);
      }
    });
  }
  
  injectSharedDependency(name, module) {
    // 在子应用沙箱中注入公共依赖
    addGlobalUncaughtErrorHandler((sandbox) => {
      sandbox[name] = module;
    });
  }
}
```

## 实际项目中的应用

### 1. 大型电商平台的微前端改造

在我们的电商平台改造中，qiankun 解决了以下问题：

```javascript
// 主应用配置
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'user-center',
    entry: '//localhost:3001',
    container: '#container',
    activeRule: '/user',
    props: {
      routerBase: '/user',
      getGlobalState: () => store.getState(),
    },
  },
  {
    name: 'product-center',
    entry: '//localhost:3002',
    container: '#container',
    activeRule: '/product',
    props: {
      routerBase: '/product',
      getGlobalState: () => store.getState(),
    },
  },
]);

start({
  sandbox: {
    experimentalStyleIsolation: true,
  },
  prefetch: 'all',
});
```

### 2. 渐进式迁移策略

```javascript
// 渐进式迁移实现
class GradualMigration {
  constructor() {
    this.migratedModules = new Set();
    this.fallbackRoutes = new Map();
  }
  
  // 设置降级路由
  setupFallbackRoutes() {
    this.fallbackRoutes.set('/legacy/orders', '/orders');
    this.fallbackRoutes.set('/legacy/users', '/users');
  }
  
  // 检查模块是否已迁移
  isModuleMigrated(path) {
    return this.migratedModules.has(path);
  }
  
  // 路由决策
  routeDecision(path) {
    if (this.isModuleMigrated(path)) {
      // 使用微前端应用
      return this.loadMicroApp(path);
    } else {
      // 使用传统路由
      return this.loadLegacyModule(path);
    }
  }
}
```

## 总结与展望

qiankun 在 single-spa 的基础上提供了更完善的微前端解决方案。通过 HTML Entry、Proxy 沙箱、样式隔离等技术，它大大降低了微前端的接入成本，提高了开发效率。

### 优势总结

1. **开箱即用**：无需复杂配置，子应用接入成本低
2. **沙箱隔离**：完善的 JavaScript 和样式隔离机制
3. **技术栈无关**：支持 React、Vue、Angular 等任意框架
4. **渐进式迁移**：支持新老系统平滑过渡

### 注意事项

1. **性能开销**：沙箱机制会带来一定的性能开销
2. **调试复杂度**：跨应用调试比较困难
3. **兼容性**：部分功能依赖现代浏览器特性
4. **SEO 限制**：不适用于对 SEO 要求较高的场景

### 未来发展

随着微前端技术的发展，qiankun 也在不断演进：

- 更好的 TypeScript 支持
- 更完善的错误处理机制
- 更灵活的沙箱配置
- 更好的开发者体验

对于大型企业级应用，qiankun 是一个非常值得考虑的微前端解决方案。它不仅解决了技术问题，更重要的是为大型团队的协作提供了良好的基础。

你在项目中使用过 qiankun 吗？有什么实践经验和踩坑心得？欢迎在评论区分享交流。 