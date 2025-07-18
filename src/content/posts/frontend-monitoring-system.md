---
title: "前端监控系统设计与实现：从0到1构建生产级监控平台"
description: "详细介绍如何设计和实现一个完整的前端监控系统，包括错误监控、性能监控、用户行为追踪等核心功能"
publishedAt: "2024-01-01"
category: "监控系统"
tags: ["监控", "性能", "错误追踪", "用户行为"]
featured: false
---

# 前端监控系统设计与实现：从0到1构建生产级监控平台

在大型前端项目中，生产环境的稳定性和性能监控至关重要。本文分享我在构建前端监控系统时的完整实践，包括架构设计、技术选型、实现细节等。

## 监控系统架构设计

### 整体架构

```
前端应用 → SDK采集 → 数据上报 → 后端处理 → 存储 → 可视化展示
```

### 核心模块

1. **数据采集层**：SDK 负责数据采集和预处理
2. **传输层**：数据上报和传输优化
3. **处理层**：数据清洗、聚合、分析
4. **存储层**：时序数据库存储
5. **展示层**：监控面板和告警系统

## 错误监控实现

### 1. JavaScript 错误捕获

```javascript
class ErrorMonitor {
  constructor(options) {
    this.options = options;
    this.init();
  }

  init() {
    // 全局错误监听
    window.addEventListener('error', this.handleError.bind(this));
    
    // Promise 错误监听
    window.addEventListener('unhandledrejection', this.handlePromiseError.bind(this));
    
    // 重写 console.error
    this.overrideConsoleError();
  }

  handleError(event) {
    const errorInfo = {
      type: 'javascript',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.reportError(errorInfo);
  }

  handlePromiseError(event) {
    const errorInfo = {
      type: 'promise',
      message: event.reason?.message || event.reason,
      stack: event.reason?.stack,
      timestamp: Date.now(),
      url: window.location.href,
    };

    this.reportError(errorInfo);
  }

  overrideConsoleError() {
    const originalError = console.error;
    console.error = (...args) => {
      this.reportError({
        type: 'console',
        message: args.join(' '),
        timestamp: Date.now(),
        url: window.location.href,
      });
      originalError.apply(console, args);
    };
  }

  reportError(errorInfo) {
    // 添加用户信息和环境信息
    const report = {
      ...errorInfo,
      userId: this.options.userId,
      sessionId: this.options.sessionId,
      version: this.options.version,
      environment: this.options.environment,
    };

    // 上报错误
    this.sendReport(report);
  }

  sendReport(data) {
    // 使用 sendBeacon 或 fetch 上报
    if (navigator.sendBeacon) {
      navigator.sendBeacon(this.options.reportUrl, JSON.stringify(data));
    } else {
      fetch(this.options.reportUrl, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {});
    }
  }
}
```

### 2. React 错误边界

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 上报组件错误
    window.errorMonitor?.reportError({
      type: 'react',
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: Date.now(),
    });
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}
```

### 3. 资源加载错误监控

```javascript
class ResourceMonitor {
  init() {
    // 监听资源加载错误
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleResourceError(event);
      }
    }, true);
  }

  handleResourceError(event) {
    const target = event.target;
    const errorInfo = {
      type: 'resource',
      tagName: target.tagName,
      src: target.src || target.href,
      message: `Failed to load ${target.tagName}`,
      timestamp: Date.now(),
    };

    this.reportError(errorInfo);
  }
}
```

## 性能监控实现

### 1. 页面性能指标

```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    // 等待页面加载完成
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.collectMetrics();
      }, 0);
    });
  }

  collectMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');

    this.metrics = {
      // 页面加载时间
      loadTime: navigation.loadEventEnd - navigation.fetchStart,
      // DNS 解析时间
      dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
      // TCP 连接时间
      tcpTime: navigation.connectEnd - navigation.connectStart,
      // 请求响应时间
      responseTime: navigation.responseEnd - navigation.requestStart,
      // DOM 解析时间
      domParseTime: navigation.domContentLoadedEventEnd - navigation.domLoading,
      // 首次绘制时间
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
      // 首次内容绘制时间
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
    };

    // 获取 LCP
    this.observeLCP();
    // 获取 FID
    this.observeFID();
    // 获取 CLS
    this.observeCLS();
  }

  observeLCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  observeFID() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.metrics.fid = entry.processingStart - entry.startTime;
      });
    });
    observer.observe({ entryTypes: ['first-input'] });
  }

  observeCLS() {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.metrics.cls = clsValue;
    });
    observer.observe({ entryTypes: ['layout-shift'] });
  }

  reportMetrics() {
    // 上报性能指标
    fetch('/api/performance', {
      method: 'POST',
      body: JSON.stringify({
        ...this.metrics,
        url: window.location.href,
        timestamp: Date.now(),
      }),
    });
  }
}
```

### 2. 接口性能监控

```javascript
class ApiMonitor {
  constructor() {
    this.init();
  }

  init() {
    // 监听 fetch 请求
    this.overrideFetch();
    // 监听 XMLHttpRequest
    this.overrideXHR();
  }

  overrideFetch() {
    const originalFetch = window.fetch;
    window.fetch = async (url, options = {}) => {
      const startTime = Date.now();
      
      try {
        const response = await originalFetch(url, options);
        const endTime = Date.now();
        
        this.reportApiMetrics({
          url: url.toString(),
          method: options.method || 'GET',
          status: response.status,
          duration: endTime - startTime,
          success: response.ok,
          timestamp: startTime,
        });
        
        return response;
      } catch (error) {
        const endTime = Date.now();
        
        this.reportApiMetrics({
          url: url.toString(),
          method: options.method || 'GET',
          status: 0,
          duration: endTime - startTime,
          success: false,
          error: error.message,
          timestamp: startTime,
        });
        
        throw error;
      }
    };
  }

  overrideXHR() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
      this._method = method;
      this._url = url;
      this._startTime = Date.now();
      return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function() {
      const xhr = this;
      
      const handleLoad = () => {
        const endTime = Date.now();
        window.apiMonitor?.reportApiMetrics({
          url: xhr._url,
          method: xhr._method,
          status: xhr.status,
          duration: endTime - xhr._startTime,
          success: xhr.status >= 200 && xhr.status < 300,
          timestamp: xhr._startTime,
        });
      };

      xhr.addEventListener('load', handleLoad);
      xhr.addEventListener('error', handleLoad);
      xhr.addEventListener('abort', handleLoad);

      return originalSend.apply(this, arguments);
    };
  }

  reportApiMetrics(data) {
    // 上报接口性能数据
    navigator.sendBeacon('/api/metrics', JSON.stringify(data));
  }
}
```

## 用户行为追踪

### 1. 页面访问追踪

```javascript
class UserBehaviorTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.pageStartTime = Date.now();
    this.init();
  }

  init() {
    // 页面可见性变化
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // 页面卸载
    window.addEventListener('beforeunload', this.handlePageUnload.bind(this));
    
    // 路由变化（SPA）
    this.trackRouteChange();
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.trackEvent('page_hidden', {
        duration: Date.now() - this.pageStartTime,
      });
    } else {
      this.pageStartTime = Date.now();
      this.trackEvent('page_visible');
    }
  }

  handlePageUnload() {
    this.trackEvent('page_unload', {
      duration: Date.now() - this.pageStartTime,
    });
  }

  trackRouteChange() {
    // 监听 pushState 和 replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
      originalPushState.apply(history, arguments);
      window.userTracker?.trackPageView();
    };

    history.replaceState = function() {
      originalReplaceState.apply(history, arguments);
      window.userTracker?.trackPageView();
    };

    // 监听 popstate
    window.addEventListener('popstate', () => {
      this.trackPageView();
    });
  }

  trackPageView() {
    this.trackEvent('page_view', {
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
    });
  }

  trackEvent(eventName, data = {}) {
    const eventData = {
      event: eventName,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      ...data,
    };

    this.sendEvent(eventData);
  }

  sendEvent(data) {
    // 发送事件数据
    fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {});
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
```

### 2. 用户操作追踪

```javascript
class UserActionTracker {
  init() {
    // 点击事件
    document.addEventListener('click', this.handleClick.bind(this));
    
    // 滚动事件
    this.throttledScroll = this.throttle(this.handleScroll.bind(this), 1000);
    window.addEventListener('scroll', this.throttledScroll);
    
    // 表单提交
    document.addEventListener('submit', this.handleSubmit.bind(this));
  }

  handleClick(event) {
    const target = event.target;
    const data = {
      tagName: target.tagName,
      className: target.className,
      id: target.id,
      text: target.textContent?.substring(0, 100),
      xpath: this.getXPath(target),
    };

    this.trackEvent('click', data);
  }

  handleScroll() {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    this.trackEvent('scroll', { scrollPercent });
  }

  handleSubmit(event) {
    const form = event.target;
    const data = {
      formId: form.id,
      formAction: form.action,
      formMethod: form.method,
    };

    this.trackEvent('form_submit', data);
  }

  getXPath(element) {
    if (element.id) {
      return `//*[@id="${element.id}"]`;
    }
    
    if (element === document.body) {
      return '/html/body';
    }
    
    const ix = Array.from(element.parentNode.children).indexOf(element);
    return this.getXPath(element.parentNode) + `/${element.tagName.toLowerCase()}[${ix + 1}]`;
  }

  throttle(func, wait) {
    let timeout;
    return function(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}
```

## 数据上报优化

### 1. 批量上报

```javascript
class ReportManager {
  constructor(options) {
    this.options = options;
    this.buffer = [];
    this.timer = null;
    this.maxBufferSize = 10;
    this.flushInterval = 5000;
  }

  report(data) {
    this.buffer.push(data);
    
    if (this.buffer.length >= this.maxBufferSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => {
        this.flush();
      }, this.flushInterval);
    }
  }

  flush() {
    if (this.buffer.length === 0) return;
    
    const data = [...this.buffer];
    this.buffer = [];
    
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    
    this.send(data);
  }

  send(data) {
    fetch(this.options.reportUrl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {
      // 失败重试
      this.buffer.unshift(...data);
    });
  }
}
```

### 2. 数据压缩

```javascript
// 使用 lz-string 压缩数据
import LZString from 'lz-string';

class CompressedReporter {
  send(data) {
    const compressed = LZString.compress(JSON.stringify(data));
    
    fetch('/api/report', {
      method: 'POST',
      body: compressed,
      headers: { 
        'Content-Type': 'application/json',
        'Content-Encoding': 'lz-string',
      },
    });
  }
}
```

## 监控面板设计

### 1. 实时监控大屏

```javascript
// 使用 WebSocket 实时更新数据
class MonitorDashboard {
  constructor() {
    this.ws = null;
    this.charts = {};
    this.init();
  }

  init() {
    this.connectWebSocket();
    this.initCharts();
  }

  connectWebSocket() {
    this.ws = new WebSocket('wss://monitor.example.com/ws');
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.updateCharts(data);
    };
  }

  initCharts() {
    // 错误数量趋势图
    this.charts.errorTrend = new Chart('errorTrend', {
      type: 'line',
      data: { labels: [], datasets: [] },
      options: { responsive: true },
    });

    // 性能指标图
    this.charts.performance = new Chart('performance', {
      type: 'bar',
      data: { labels: [], datasets: [] },
      options: { responsive: true },
    });
  }

  updateCharts(data) {
    // 更新图表数据
    Object.keys(this.charts).forEach(key => {
      if (data[key]) {
        this.charts[key].data = data[key];
        this.charts[key].update();
      }
    });
  }
}
```

### 2. 告警系统

```javascript
class AlertSystem {
  constructor() {
    this.rules = [];
    this.init();
  }

  init() {
    // 加载告警规则
    this.loadRules();
    
    // 定期检查告警
    setInterval(() => {
      this.checkAlerts();
    }, 60000);
  }

  addRule(rule) {
    this.rules.push(rule);
  }

  checkAlerts() {
    this.rules.forEach(rule => {
      if (rule.condition()) {
        this.sendAlert(rule);
      }
    });
  }

  sendAlert(rule) {
    // 发送告警通知
    fetch('/api/alerts', {
      method: 'POST',
      body: JSON.stringify({
        ruleName: rule.name,
        message: rule.message,
        level: rule.level,
        timestamp: Date.now(),
      }),
    });
  }
}
```

## 总结

构建一个完整的前端监控系统需要考虑多个方面：

1. **数据采集**：全面覆盖错误、性能、用户行为等维度
2. **数据上报**：优化网络传输，避免影响用户体验
3. **数据处理**：实时处理和分析监控数据
4. **数据展示**：直观的监控面板和告警系统
5. **系统稳定性**：监控系统本身的稳定性和性能

通过完善的监控系统，我们可以：
- 快速发现和定位问题
- 持续优化产品性能
- 了解用户行为，改善用户体验
- 建立数据驱动的决策体系

你的项目是如何做监控的？欢迎分享你的实践经验。 