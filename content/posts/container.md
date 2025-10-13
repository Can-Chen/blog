---
title: "css属性container有什么作用"
date: "2025-10-13"
excerpt: "元素级别的媒体查询"
readTime: "5分钟阅读"
---

`container` 属性用于将一个元素声明为**查询容器**，使其后代元素可以根据容器的尺寸来调整样式，而不是依赖整个视口的大小。

## 解决的核心问题

假设你创建了一个"产品卡片"组件：

- 在**宽松的主内容区域**：希望卡片水平排列，图片在左，文字在右
- 在**狭窄的侧边栏**：希望卡片垂直排列，图片在上,文字在下

### 传统方案

**方案一：视口媒体查询**
```css
@media (max-width: 768px) {
  .product-card { flex-direction: column; }
}
```
❌ 问题：卡片样式耦合在视口宽度上，在宽屏设备的窄侧边栏中无法正确显示。

**方案二：JavaScript 动态检测**
```js
// 需要监听 resize、计算宽度、添加类名...
```
❌ 问题：复杂度高，性能开销大。

### container 查询解决方式

```css
.sidebar {
  container-type: inline-size;
}

.product-card {
  display: flex;
  flex-direction: column; /* 默认垂直布局 */
}

@container (min-width: 600px) {
  .product-card {
    flex-direction: row; /* 容器足够宽时水平布局 */
  }
}
```

✅ **组件根据自己的容器自适应，真正做到可复用。**

---

## 用法

### 1. 定义查询容器

使用 `container-type` 指定容器类型：

```css
.card-container {
  container-type: inline-size; /* 查询内联方向尺寸(通常是宽度) */
}
```

**可选值：**
- `inline-size`：查询内联方向尺寸（水平书写模式下为宽度）
- `size`：同时查询内联和块级方向尺寸（宽度和高度）
- `normal`：不是查询容器（默认值）

#### 简写方式

使用 `container` 属性可以同时设置类型和名称：

```css
.sidebar {
  container: sidebar-container / inline-size;
  /* 等价于：
     container-name: sidebar-container;
     container-type: inline-size;
  */
}
```

### 2. 命名容器（可选）

当页面有多个嵌套容器时，使用 `container-name` 精确指定查询目标：

```css
.sidebar {
  container-name: sidebar;
  container-type: inline-size;
}

.main-content {
  container-name: main;
  container-type: inline-size;
}
```

### 3. 编写查询规则

`@container` 规则的语法与媒体查询类似：

```css
/* 查询最近的父级容器 */
@container (min-width: 600px) {
  .product-card {
    flex-direction: row;
  }
}

/* 查询指定名称的容器 */
@container sidebar (max-width: 400px) {
  .widget {
    font-size: 0.875rem;
  }
}
```

**支持的查询特性：**
- 尺寸：`width`, `height`, `inline-size`, `block-size`
- 方向：`orientation: portrait | landscape`
- 宽高比：`aspect-ratio`

### 4. 容器查询单位

类似视口单位（`vw`, `vh`），容器查询提供了基于容器尺寸的单位：

```css
@container (min-width: 400px) {
  .title {
    font-size: 5cqw;  /* 容器宽度的 5% */
    padding: 2cqh;    /* 容器高度的 2% */
  }
}
```

**可用单位：**
- `cqw`：容器宽度的 1%
- `cqh`：容器高度的 1%
- `cqi`：容器内联方向尺寸的 1%
- `cqb`：容器块级方向尺寸的 1%
- `cqmin`：`cqi` 和 `cqb` 中的较小值
- `cqmax`：`cqi` 和 `cqb` 中的较大值

---

## 完整示例

```css
/* 定义容器 */
.sidebar {
  container: sidebar / inline-size;
  width: 300px;
  padding: 1rem;
}

/* 卡片基础样式 */
.product-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
}

.product-card img {
  width: 100%;
  height: auto;
}

/* 容器查询：宽度 ≥ 500px 时水平布局 */
@container sidebar (min-width: 500px) {
  .product-card {
    flex-direction: row;
  }
  
  .product-card img {
    width: 40%;
  }
  
  .product-card .content {
    flex: 1;
  }
}

/* 容器查询：使用容器单位实现流式字体 */
@container sidebar (min-width: 300px) {
  .product-card h3 {
    font-size: clamp(1rem, 4cqw, 1.5rem);
  }
}
```

---

## 重要注意事项

### ⚠️ 容器不能查询自身

`@container` 规则只影响容器的**后代元素**，不能修改容器本身的样式。

```css
.container {
  container-type: inline-size;
}

/* ❌ 错误：试图修改容器自身 */
@container (min-width: 500px) {
  .container {
    background: red; /* 不会生效 */
  }
}

/* ✅ 正确：修改后代元素 */
@container (min-width: 500px) {
  .container .child {
    background: red; /* 会生效 */
  }
}
```

这是为了防止**循环依赖**：如果容器可以根据自身大小改变自己的大小，会导致浏览器无限循环重新计算。

### ⚠️ 容器需要明确的尺寸约束

查询容器的尺寸不应该完全由其内容决定，应该由外部布局确定：

```css
/* ✅ 推荐：容器尺寸由父级布局决定 */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.grid-item {
  container-type: inline-size; /* 尺寸由 grid 布局决定 */
}

/* ⚠️ 避免：容器尺寸由内容撑开 */
.auto-container {
  container-type: inline-size;
  width: max-content; /* 可能导致不稳定的查询结果 */
}
```

### ⚠️ 性能考量

虽然现代浏览器对容器查询优化良好,但不要滥用：

- ✅ 在需要组件级响应式的地方使用（卡片、小部件、表单等）
- ❌ 避免为每个元素都设置容器查询
- ✅ 合理使用容器命名，避免不必要的嵌套查询

---

## container 查询 vs 媒体查询

| 对比维度 | container 查询 | Media 查询 |
|---------|---------------|-----------|
| **查询目标** | 父容器的尺寸 | 视口或设备特性 |
| **设计理念** | 组件驱动 | 页面驱动 |
| **典型场景** | 可复用组件（卡片、侧边栏小部件、表单） | 页面布局（网格断点、导航栏、全局字体） |
| **主要优势** | 组件与布局解耦，可移植性强 | 全局布局控制，设备适配 |
| **局限性** | 不适合定义页面骨架 | 难以处理组件在不同位置的样式 |

### 实践建议

**配合使用，各司其职：**

```css
/* 媒体查询：定义页面级布局 */
@media (min-width: 768px) {
  .layout {
    display: grid;
    grid-template-columns: 300px 1fr;
  }
}

/* 容器查询：定义组件内部响应 */
.sidebar {
  container-type: inline-size;
}

@container (min-width: 350px) {
  .card {
    flex-direction: row;
  }
}
```

---

## 浏览器兼容性

![container 兼容性](/imgs/container-support.png)
