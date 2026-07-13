# 生成创意产物 HTML 文件 Spec

## Why
TRAE AI 创造力大赛报名帖要求附带一份由 TRAE Work 生成的创意产物 HTML 文件。需要生成一个自包含的、视觉精美的单页 HTML 文件，用于展示 SpeakFlow 产品的创意方案。

## What Changes
- 新增 `creative-product.html` 文件，作为报名帖的附件上传到社区
- 该文件为纯静态 HTML，内联 CSS + JS，无外部依赖
- 采用现代设计风格，包含动画效果和交互展示

## Impact
- 新增文件：`e:\projects\trae\Creativity-Competition\creative-product.html`
- 不影响现有代码结构

## ADDED Requirements

### Requirement: 创意产物 HTML 文件
系统 SHALL 提供一个自包含的单页 HTML 文件，展示 SpeakFlow 产品的完整创意方案。

#### Scenario: 文件独立运行
- **WHEN** 用户在浏览器中打开 `creative-product.html`
- **THEN** 文件无需任何服务器或外部依赖即可完整展示所有内容

#### Scenario: 视觉展示
- **WHEN** 用户滚动浏览页面
- **THEN** 能看到以下内容板块：
  1. 产品标题与 Slogan（Hero 区域）
  2. 痛点与解决方案
  3. 核心功能展示（打字跟练 + 语音跟练）
  4. 19 个日常场景库展示
  5. 分支对话系统亮点
  6. 游戏化系统（金币/成就/等级）
  7. 产品界面 Mockup 展示
  8. 目标用户与价值

#### Scenario: 交互与动画
- **WHEN** 用户滚动到各板块
- **THEN** 内容以渐入动画呈现，关键元素有视觉强调效果

#### Scenario: 响应式适配
- **WHEN** 用户在不同屏幕尺寸下查看
- **THEN** 页面布局自适应，移动端可正常阅读

### Requirement: 设计风格
HTML 文件 SHALL 采用以下设计规范：
- 主色调：蓝色渐变（#4F46E5 → #7C3AED），体现科技感与学习氛围
- 字体：系统字体栈（-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif）
- 背景：深色主题（#0F172A），搭配亮色卡片
- 卡片圆角：12px，带微妙阴影
- 动画：CSS scroll-driven animations 或 Intersection Observer 实现滚动渐入

### Requirement: 内容完整性
HTML 文件 SHALL 包含产品设计文档中的所有核心信息：
- 产品名称：SpeakFlow — 英语跟练助手
- 产品定位：基于真实对话场景的沉浸式英语跟练工具
- 目标用户：英语初/中级学习者
- 5 大场景类别、19 个具体场景
- 打字跟练、语音跟练两种模式
- 分支对话、沉浸音效、游戏化、AI 纠错、数据面板等功能
