# OpenClaw 教程网站 - UI 设计规范文档

## 📋 文档概述

本文档记录了 OpenClaw 教程网站的 **钛金属深色拟物化** 设计风格，包括完整的配色方案、设计原则和代码实现示例。

**设计日期**: 2026-03-19
**设计风格**: 钛金属深色拟物化（Titanium Dark Skeuomorphism）
**目标受众**: AI 行业从业者、科技爱好者

---

## 🎨 设计主题

### 核心理念

- **深色背景**: 护眼、专业，符合开发者习惯
- **钛金属质感**: 精密、科技感，模拟真实金属材质
- **银色发光**: 柔和、优雅，不刺眼的科技感
- **拟物化细节**: 物理按钮、金属卡片、真实光影

### 设计目标

1. ✅ 打造专业 AI 工具的视觉形象
2. ✅ 保持深色主题的舒适度
3. ✅ 通过拟物化营造精致质感
4. ✅ 确保所有元素的可读性和可用性

---

## 🌈 完整配色方案

### 主色调

```css
/* 深色背景 - 深蓝黑色渐变 */
--bg-dark-start: #0a0e27;
--bg-dark-mid: #1a1f3a;
--bg-dark-end: #0a0e27;

/* 钛金属 - 银灰色 */
--titanium-dark: #71717a;
--titanium-mid: #a1a1aa;
--titanium-light: #d4d4d8;

/* 银色发光 */
--silver-glow: #e4e4e7;
--silver-mid: #d4d4d8;
--silver-dim: #a1a1aa;

/* 文字颜色 */
--text-primary: #e4e4e7;
--text-secondary: #a1a1aa;
--text-muted: #71717a;
```

### 语义化颜色

```css
/* 边框 */
--border-light: rgba(228, 228, 231, 0.3);
--border-medium: rgba(212, 212, 216, 0.5);
--border-dark: rgba(161, 161, 170, 0.5);

/* 发光/光晕 */
--glow-primary: rgba(228, 228, 231, 0.5);
--glow-secondary: rgba(212, 212, 216, 0.4);
--glow-dim: rgba(161, 161, 170, 0.3);

/* 阴影 */
--shadow-inset-light: inset 0 2px 4px rgba(228, 228, 231, 0.15);
--shadow-inset-dark: inset 0 -2px 4px rgba(0, 0, 0, 0.5);
--shadow-soft: 0 4px 12px rgba(0, 0, 0, 0.3);
--shadow-medium: 0 8px 24px rgba(0, 0, 0, 0.4);
```

---

## ✨ 拟物化效果实现

### 1. 金属拉丝纹理背景

```css
.metal-brush-background {
  background:
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(113, 113, 122, 0.03) 2px,
      rgba(113, 113, 122, 0.03) 4px
    ),
    linear-gradient(
      135deg,
      #0a0e27 0%,
      #1a1f3a 50%,
      #0a0e27 100%
    );
  background-attachment: fixed;
}
```

**说明**: 使用 `repeating-linear-gradient` 创建拉丝纹理，叠加在深色渐变上。

---

### 2. 钛金属发光文字

```css
.titanium-glow-text {
  color: #e4e4e7;
  text-shadow:
    0 0 8px rgba(228, 228, 231, 0.4),
    0 0 16px rgba(228, 228, 231, 0.3),
    0 0 24px rgba(228, 228, 231, 0.2);
  letter-spacing: 0.05em;
}
```

**说明**: 多层 text-shadow 创建柔和的银色光晕效果。

---

### 3. 物理按钮效果

#### 凸起按钮（默认状态）

```css
.button-raised {
  background: linear-gradient(180deg, #71717a 0%, #a1a1aa 50%, #71717a 100%);
  border: 2px solid #d4d4d8;
  border-radius: 8px;
  color: #e4e4e7;
  padding: 1rem 2.5rem;
  font-weight: 600;

  /* 凸起效果 */
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.3),
    inset 0 -1px 2px rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.3);

  transition: all 0.15s ease;
}

.button-raised:hover {
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.3),
    inset 0 -1px 2px rgba(0, 0, 0, 0.3),
    0 6px 12px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(228, 228, 231, 0.3);
}

.button-raised:active {
  transform: translateY(1px);
  /* 凹陷效果 */
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 -1px 2px rgba(255, 255, 255, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.2);
}
```

**要点**:
- 内阴影（inset）在左上创建高光，右下创建阴影
- 外阴影创建深度感
- `:active` 状态反转内阴影，模拟按下效果

---

### 4. 钛金属卡片

```css
.titanium-card {
  background: linear-gradient(135deg, rgba(113, 113, 122, 0.3) 0%, rgba(161, 161, 170, 0.2) 100%);
  border: 1px solid rgba(212, 212, 216, 0.4);
  border-radius: 12px;
  padding: 2rem;

  /* 金属边框和深度 */
  box-shadow:
    inset 0 1px 2px rgba(228, 228, 231, 0.2),
    inset 0 -1px 2px rgba(0, 0, 0, 0.3),
    0 8px 24px rgba(0, 0, 0, 0.3);

  transition: all 0.2s ease;
}

.titanium-card:hover {
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 2px rgba(228, 228, 231, 0.2),
    inset 0 -1px 2px rgba(0, 0, 0, 0.3),
    0 12px 32px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(228, 228, 231, 0.2);
}
```

**要点**:
- 半透明背景 + 边框营造金属板效果
- 内外阴影组合增加层次感
- 悬停时增强光晕

---

### 5. 发光图标

```css
.glow-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 0 8px rgba(212, 212, 216, 0.5));
}

/* 更强的发光效果 */
.glow-icon-strong {
  filter: drop-shadow(0 0 12px rgba(228, 228, 231, 0.6));
}
```

**说明**: 使用 `drop-shadow` 而非 `box-shadow`，可以为不规则形状添加发光。

---

### 6. Hero 区域（深色金属背景）

```css
.hero-section {
  position: relative;
  background:
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 1px,
      rgba(113, 113, 122, 0.05) 1px,
      rgba(113, 113, 122, 0.05) 2px
    ),
    linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: #e4e4e7;
  padding: 8rem 0 6rem;
  text-align: center;
  border-bottom: 3px solid #d4d4d8;

  /* 内发光 + 外发光 */
  box-shadow:
    inset 0 2px 4px rgba(228, 228, 231, 0.15),
    inset 0 -2px 4px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(228, 228, 231, 0.2);
}
```

---

## 🎯 组件样式规范

### 导航栏

```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, rgba(10, 14, 39, 0.95) 0%, rgba(26, 31, 58, 0.95) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid rgba(212, 212, 216, 0.3);
  box-shadow:
    inset 0 1px 2px rgba(228, 228, 231, 0.2),
    0 4px 12px rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.nav-logo {
  color: #e4e4e7;
  text-shadow: 0 0 8px rgba(228, 228, 231, 0.4);
}

.nav-link {
  color: #a1a1aa;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #e4e4e7;
  text-shadow: 0 0 8px rgba(228, 228, 231, 0.5);
}
```

---

### 徽章/标签

```css
.titanium-badge {
  position: relative;
  background: linear-gradient(135deg, #71717a 0%, #a1a1aa 50%, #71717a 100%);
  color: #e4e4e7;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  border: 2px solid #d4d4d8;
  font-weight: 600;

  /* 金属边框 + 发光 */
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.3),
    inset 0 -1px 2px rgba(0, 0, 0, 0.3),
    0 0 12px rgba(228, 228, 231, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.3);
}
```

---

### 链接样式

```css
.link-glow {
  color: #a1a1aa;
  text-decoration: none;
  transition: all 0.2s;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.1);
}

.link-glow:hover {
  color: #e4e4e7;
  text-shadow:
    0 0 8px rgba(228, 228, 231, 0.6),
    0 0 16px rgba(228, 228, 231, 0.4);
}
```

---

### 输入框（如需）

```css
.titanium-input {
  background: linear-gradient(180deg, rgba(10, 14, 39, 0.8) 0%, rgba(26, 31, 58, 0.8) 100%);
  border: 2px solid rgba(161, 161, 170, 0.5);
  border-radius: 8px;
  color: #e4e4e7;
  padding: 0.85rem 1.25rem;

  /* 凹陷效果 */
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.5),
    inset 0 1px 2px rgba(228, 228, 231, 0.1);

  transition: all 0.2s;
}

.titanium-input:focus {
  outline: none;
  border-color: rgba(228, 228, 231, 0.6);
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.5),
    inset 0 1px 2px rgba(228, 228, 231, 0.1),
    0 0 20px rgba(228, 228, 231, 0.3);
}
```

---

## 📐 设计原则

### 光影规则

1. **光源方向**: 左上角（高光在左上，阴影在右下）
2. **内阴影**: 使用 `inset` 创建凹陷或高光效果
3. **外阴影**: 使用普通 `box-shadow` 创建深度和投影
4. **多层阴影**: 组合多个阴影层增加真实感

### 阴影层次

```css
/* 基础三层阴影 */
box-shadow:
  inset 0 2px 4px rgba(228, 228, 231, 0.2),  /* 内层高光 */
  inset 0 -2px 4px rgba(0, 0, 0, 0.3),       /* 内层阴影 */
  0 8px 24px rgba(0, 0, 0, 0.3);            /* 外层投影 */
```

### 发光强度

- **柔和发光**: `rgba(228, 228, 231, 0.3)` - 用于文字、图标
- **中等发光**: `rgba(228, 228, 231, 0.5)` - 用于卡片、按钮
- **强发光**: `rgba(228, 228, 231, 0.6)` - 用于焦点状态、强调元素

### 过渡动画

```css
/* 标准过渡 */
transition: all 0.15s ease;  /* 按钮 */
transition: all 0.2s ease;   /* 卡片、链接 */
```

---

## 🔧 实施指南

### 为新页面应用样式

1. **复制基础样式**
   - 从 `src/pages/index.astro` 复制 `<style>` 块
   - 确保包含所有颜色变量和基础样式

2. **使用语义化类名**
   - `.titanium-card` - 卡片容器
   - `.button-raised` - 凸起按钮
   - `.titanium-glow-text` - 发光文字
   - `.link-glow` - 链接

3. **调整细节**
   - 根据具体需求调整 padding、margin
   - 保持阴影和发光效果一致

### 检查清单

- [ ] 背景使用深色渐变 + 金属拉丝纹理
- [ ] 文字颜色为 `#e4e4e7` 或 `#a1a1aa`
- [ ] 所有交互元素有 hover 和 active 状态
- [ ] 发光效果使用银色系（`#e4e4e7`, `#d4d4d8`）
- [ ] 阴影组合正确（内阴影 + 外阴影）
- [ ] 过渡动画流畅（0.15s - 0.2s）
- [ ] 响应式设计保持完整

---

## 📁 参考文件

### 已完成的页面

1. **中文首页**: `src/pages/zh-cn/index.astro`
2. **英文首页**: `src/pages/index.astro`
3. **导航栏**: `src/components/Navigation.astro`

### 关键代码位置

- **Hero 区域样式**: 搜索 `/* Hero 区域`
- **卡片样式**: 搜索 `/* 钛金属卡片`
- **按钮样式**: 搜索 `/* 物理按钮`
- **发光文字**: 搜索 `/* 钛金属发光文字`

---

## 🎓 最佳实践

### DO ✅

- 使用 CSS 变量管理颜色，便于统一调整
- 保持发光效果柔和，避免过于刺眼
- 内外阴影组合使用，营造真实质感
- 为所有交互元素添加过渡动画
- 确保文字对比度足够（WCAG AA 标准）

### DON'T ❌

- 不要使用纯白色（`#ffffff`），改用 `#e4e4e7`
- 不要使用纯黑色（`#000000`），改用 `#0a0e27`
- 不要过度使用发光效果（1-2 处突出即可）
- 不要忽略移动端适配
- 不要改变光源方向（保持左上角）

---

## 📞 交接说明

### 如何继续这个设计风格

1. **阅读本文档** - 理解配色和效果原理
2. **参考现有页面** - 查看已完成的首页和导航栏
3. **复制粘贴** - 直接复制 CSS 代码到新页面
4. **微调细节** - 根据具体需求调整尺寸和间距
5. **测试效果** - 确保深色主题下可读性良好

### 遇到问题

如果某些效果不对，检查：
1. 颜色值是否正确（银色系，不是蓝色）
2. 阴影是否完整（inset + 普通）
3. 背景渐变是否正确（深色 + 拉丝纹理）
4. 文字对比度是否足够

---

## 📝 更新日志

| 日期 | 版本 | 更改内容 |
|------|------|----------|
| 2026-03-19 | v1.0 | 初始版本 - 钛金属深色拟物化设计 |

---

**文档维护者**: Claude + OpenClaw 团队
**最后更新**: 2026-03-19
