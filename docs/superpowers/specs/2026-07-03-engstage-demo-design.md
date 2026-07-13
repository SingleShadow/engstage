# EngStage — 英语跟练助手 Demo 初版设计文档

## 一、项目概述

| 项目 | 说明 |
|------|------|
| 产品名称 | EngStage — 英语跟练助手 |
| 产品形态 | Web 应用（响应式，支持移动端） |
| 核心定位 | 基于真实对话场景的沉浸式英语跟练工具 |
| 技术栈 | React + Less + Vite + React Router DOM |
| 核心功能 | 打字跟练 + 语音跟练双模式 |
| 场景数量 | 5个（咖啡店点单、餐厅点餐、问路导航、超市购物、英文面试） |
| 数据存储 | localStorage |

## 二、设计目标

根据 TRAE AI 创造力大赛初赛要求，Demo 初版需满足：
- 核心功能能跑通、能让人体验到价值
- 提供可体验地址或 HTML 文件
- 清晰展示 TRAE 开发过程

## 三、核心功能设计

### 3.1 打字跟练模式（Typing Mode）

**交互流程：**
1. 场景中角色A说出台词 → 字幕显示英文 + 中文翻译
2. 系统提供 2-3 个预设答案选项
3. 用户可以：
   - 点击预设选项直接选择
   - 或在输入框中打字输入
4. 提交后模糊匹配（忽略大小写、标点、空格）：
   - ✅ 命中预设答案 → 绿色提示 + 播放发音
   - ❌ 未命中 → 红色提示 + 显示预设答案 + 可重试
5. 通过后角色B播放发音动画 + 语音
6. 进入下一轮对话

**辅助功能：**
- 💡 提示：显示首字母提示
- ⏭️ 跳过：跳过当前句
- 🔊 语速调节：0.75x / 1.0x / 1.25x

### 3.2 语音跟练模式（Speaking Mode）

**交互流程：**
1. 场景中角色A说出台词 → 字幕显示
2. 显示需要跟读的句子（英文 + 中文翻译）
3. 用户点击麦克风开始录音（3秒倒计时）
4. Web Speech API 识别语音
5. 评分算法给出综合评分（基于识别置信度）：
   - ≥ 70分 → 通过 → 播放标准发音
   - < 70分 → 建议重试 + 显示识别结果
6. 进入下一轮对话

**辅助功能：**
- 🎙️ 重新录制：不满意可无限重录
- 🔊 播放原声：对比标准发音

**评分算法：**
- 综合评分 = 识别置信度得分 × 70% + 文本相似度得分 × 30%
- 识别置信度得分：取 Web Speech API 返回的置信度值（0-1）× 100
- 文本相似度得分：用户识别文本与标准答案的 Levenshtein 距离相似度（0-100）

**兼容性说明：**
- Web Speech Recognition API 在 Chrome、Edge、Safari 14.1+ 支持良好
- 在不支持的浏览器中，语音模式自动降级为打字模式，并给出提示

### 3.3 分支对话系统

每个场景有 1-2 个分支点：
- 用户选择不同选项 → 触发不同后续对话
- 分支逻辑简单，保证流程可完整走通

## 四、场景数据设计

### 4.1 场景列表

| 场景ID | 场景名 | 角色 | 对话数 | 难度 | 标签 |
|--------|--------|------|--------|------|------|
| cafe-ordering | ☕ 咖啡店点单 | 店员 / 顾客 | 8句 | 1 | 生活日常 |
| restaurant | 🍽️ 餐厅点餐 | 服务员 / 顾客 | 10句 | 2 | 生活日常 |
| directions | 🗺️ 问路导航 | 路人 / 游客 | 6句 | 1 | 出行交通 |
| supermarket | 🛒 超市购物 | 收银员 / 顾客 | 8句 | 2 | 生活日常 |
| interview | 💼 英文面试 | 面试官 / 求职者 | 10句 | 3 | 职场商务 |

### 4.2 数据结构

```javascript
{
  id: "cafe-ordering",
  name: "咖啡店点单",
  icon: "☕",
  category: "daily-life",
  difficulty: 1,
  characters: {
    left: { name: "店员", avatar: "👨‍🍳" },
    right: { name: "顾客", avatar: "🧑" }
  },
  dialogue: [
    {
      id: 1,
      speaker: "left",
      text: "Good morning! Welcome to Bean & Brew. What can I get for you?",
      translation: "早上好！欢迎来到 Bean & Brew。您需要点什么？",
      userOptions: [
        {
          id: "a",
          text: "I'd like a latte, please.",
          translation: "请给我一杯拿铁。",
          next: 2
        },
        {
          id: "b",
          text: "Can I see the menu first?",
          translation: "我能先看看菜单吗？",
          next: "menu_branch"
        }
      ]
    },
    {
      id: 2,
      speaker: "left",
      text: "Certainly! Would you like it with oat milk or regular milk?",
      translation: "好的！您想要燕麦奶还是普通牛奶？",
      userOptions: [
        { id: "a", text: "Regular milk, please.", translation: "普通牛奶，谢谢。", next: 3 },
        { id: "b", text: "Oat milk, please.", translation: "燕麦奶，谢谢。", next: 3 }
      ]
    },
    {
      id: 3,
      speaker: "left",
      text: "That'll be $4.50. Would you like anything else?",
      translation: "一共4.50美元。您还需要别的吗？",
      userOptions: [
        { id: "a", text: "No, thank you.", translation: "不用了，谢谢。", next: 4 },
        { id: "b", text: "Can I also have a croissant?", translation: "我还能来一个羊角面包吗？", next: 5 }
      ]
    },
    {
      id: 4,
      speaker: "left",
      text: "Here you go! Enjoy your latte!",
      translation: "给您！祝您用餐愉快！",
      isEnd: true
    },
    {
      id: 5,
      speaker: "left",
      text: "Absolutely! That's $3.00 more. Total is $7.50.",
      translation: "当然可以！再加3.00美元，总共7.50美元。",
      userOptions: [{ id: "a", text: "That's fine.", translation: "好的。", next: 4 }]
    }
  ],
  branches: {
    menu_branch: [
      {
        id: "menu_1",
        speaker: "left",
        text: "Of course! We have lattes, cappuccinos, americanos, and cold brew.",
        translation: "当然！我们有拿铁、卡布奇诺、美式咖啡和冷萃咖啡。",
        userOptions: [
          { id: "a", text: "I'd like a latte, please.", translation: "请给我一杯拿铁。", next: 2 },
          { id: "b", text: "What's your cold brew like?", translation: "你们的冷萃咖啡怎么样？", next: "cold_brew_branch" }
        ]
      }
    ]
  }
}
```

### 4.3 localStorage 数据结构

```javascript
{
  userProgress: {
    completedScenes: ["cafe-ordering"],
    inProgressScenes: {
      "restaurant": { currentDialogueId: 3, mode: "typing" }
    }
  },
  studyStats: {
    totalPracticeMinutes: 45,
    typingModeCount: 12,
    voiceModeCount: 8,
    perfectMatches: 15,
    retryCount: 5,
    lastPracticeDate: "2026-07-03"
  },
  settings: {
    speechRate: 1.0,
    showTranslation: true,
    autoPlay: true
  }
}
```

## 五、页面结构设计

### 5.1 页面清单

| 页面 | 路径 | 功能 |
|------|------|------|
| 首页 | `/` | 5个场景卡片选择、模式切换、学习概览 |
| 练习页 | `/practice/:sceneId/:mode` | 对话场景渲染、输入/录音区、结果反馈、进度条 |
| 数据面板 | `/dashboard` | 完成场景数、练习时长、统计数据 |

### 5.2 组件结构

```
src/
├── pages/
│   ├── Home/
│   │   ├── components/
│   │   │   ├── SceneCard.jsx       # 场景卡片
│   │   │   ├── ModeSelector.jsx    # 模式选择器
│   │   │   └── StudyOverview.jsx   # 学习概览
│   │   └── index.jsx
│   ├── Practice/
│   │   ├── components/
│   │   │   ├── DialogueScene.jsx   # 对话场景组件
│   │   │   ├── TypingInput.jsx     # 打字输入区
│   │   │   ├── VoiceRecorder.jsx   # 语音录制区
│   │   │   └── ResultFeedback.jsx  # 结果反馈
│   │   └── index.jsx
│   └── Dashboard/
│       ├── components/
│       │   └── StatsGrid.jsx       # 统计网格
│       └── index.jsx
├── components/
│   └── Header/
│       └── index.jsx               # 顶部导航
├── data/
│   └── scenes.js                   # 5个场景数据
├── hooks/
│   ├── useSpeechRecognition.js     # 语音识别 Hook
│   ├── useSpeechSynthesis.js       # 语音合成 Hook
│   └── useLocalStorage.js          # 本地存储 Hook
├── utils/
│   └── fuzzyMatch.js               # 模糊匹配算法
├── styles/
│   ├── theme.less                  # 主题变量
│   └── global.less                 # 全局样式
├── App.jsx
├── main.jsx
└── index.less
```

## 六、样式设计规范

### 6.1 主题变量

```less
@bg-primary: #0F172A;
@bg-card: #1E293B;
@bg-card-hover: #2D3748;
@text-primary: #F8FAFC;
@text-secondary: #94A3B8;
@text-muted: #64748B;
@gradient-start: #4F46E5;
@gradient-end: #7C3AED;
@gradient-main: linear-gradient(135deg, @gradient-start, @gradient-end);
@border-color: #334155;
@radius-md: 12px;
@radius-lg: 16px;
```

### 6.2 布局规范

- 桌面端：多栏布局，最大宽度 1200px
- 平板端（≤768px）：单栏布局
- 手机端（≤480px）：字体缩小，间距调整

## 七、开发任务分解

### 任务1：项目初始化
- 使用 Vite 初始化 React 项目
- 安装依赖：react-router-dom, less, vite-plugin-less
- 配置 Vite 和路径别名

### 任务2：场景数据准备
- 创建 `src/data/scenes.js`
- 编写 5 个场景的完整对话数据
- 每个场景包含 6-10 句对话

### 任务3：打字跟练模式开发
- 实现 `DialogueScene` 组件（角色渲染、对话气泡、字幕）
- 实现 `TypingInput` 组件（输入框、预设选项、提交）
- 实现 `fuzzyMatch` 模糊匹配算法
- 实现语音播放功能（Web Speech Synthesis API）
- 实现结果反馈组件（成功/失败提示）

### 任务4：语音跟练模式开发
- 实现 `VoiceRecorder` 组件（麦克风按钮、录音状态、倒计时）
- 集成 Web Speech Recognition API
- 实现评分算法（基于识别置信度）
- 实现结果展示（评分、识别文本）

### 任务5：首页开发
- 实现 `SceneCard` 组件（场景卡片网格）
- 实现 `ModeSelector` 组件（打字/语音模式切换）
- 实现 `StudyOverview` 组件（学习进度概览）
- 配置路由导航

### 任务6：数据面板开发
- 实现 `useLocalStorage` Hook
- 实现数据存储逻辑（完成场景数、练习时长）
- 实现 `StatsGrid` 组件（统计数据展示）

### 任务7：样式优化
- 创建 `theme.less` 和 `global.less`
- 实现深色主题 + 蓝紫渐变设计
- 实现响应式布局
- 添加动画效果（角色切换、输入反馈）

## 八、验证方式

1. 启动开发服务器：`npm run dev`
2. 访问首页，选择场景和模式
3. 打字模式：输入答案，验证模糊匹配和反馈机制
4. 语音模式：录音测试，验证语音识别和评分
5. 完成场景后，验证数据面板统计正确
6. 测试响应式布局（移动端适配）

### 8.1 构建与导出

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

**导出为单文件 HTML（可选）：**
- 使用 `npm run build` 构建后，`dist` 目录包含所有静态资源
- 如需单文件 HTML，可使用 vite-plugin-singlefile 插件

### 8.2 浏览器兼容性

| 浏览器 | 版本要求 | 语音识别 | 语音合成 |
|--------|----------|----------|----------|
| Chrome | 49+ | ✅ | ✅ |
| Edge | 79+ | ✅ | ✅ |
| Safari | 14.1+ | ✅ | ✅ |
| Firefox | 44+ | ❌（无原生支持） | ✅ |

**降级策略：**
- Firefox 用户进入语音模式时，自动降级为打字模式
- 显示提示："您的浏览器不支持语音识别功能，已切换至打字模式"

## 九、参赛材料准备

根据大赛要求，需准备：
- Demo 体验地址（或 HTML 文件）
- 开发关键步骤截图（不少于 3 张）
- 关键任务对话的 Session ID（不少于 3 个）
- 社区报名帖链接
