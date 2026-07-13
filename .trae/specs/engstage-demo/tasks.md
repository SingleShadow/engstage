# EngStage — 英语跟练助手 Demo 初版实现计划

## [x] Task 1: 项目初始化
- **Priority**: high
- **Depends On**: None
- **Description**: 
  - 使用 Vite 初始化 React 项目
  - 安装依赖：react-router-dom, less, vite-plugin-less
  - 配置 Vite 和路径别名
  - 创建项目基础目录结构
- **Acceptance Criteria Addressed**: AC-1, AC-7
- **Test Requirements**:
  - `programmatic` TR-1.1: `npm run dev` 命令成功启动开发服务器
  - `human-judgment` TR-1.2: 项目目录结构符合设计文档要求
- **Notes**: 使用 npm create vite@6.5.0 . -- --template react

## [x] Task 2: 场景数据准备
- **Priority**: high
- **Depends On**: Task 1
- **Description**: 
  - 创建 `src/data/scenes.js`
  - 编写5个场景的完整对话数据（咖啡店点单、餐厅点餐、问路导航、超市购物、英文面试）
  - 每个场景包含6-10句对话，含中英双语翻译和分支逻辑
- **Acceptance Criteria Addressed**: AC-1, AC-5
- **Test Requirements**:
  - `programmatic` TR-2.1: 数据文件可被正确 import
  - `human-judgment` TR-2.2: 5个场景数据完整，包含所有字段
- **Notes**: 参考设计文档中的数据结构示例

## [x] Task 3: 核心 Hooks 和工具函数
- **Priority**: high
- **Depends On**: Task 1
- **Description**: 
  - 实现 `useSpeechSynthesis.js` Hook（语音合成）
  - 实现 `useSpeechRecognition.js` Hook（语音识别）
  - 实现 `useLocalStorage.js` Hook（本地存储）
  - 实现 `fuzzyMatch.js` 模糊匹配算法
- **Acceptance Criteria Addressed**: AC-2, AC-3, AC-4, AC-6
- **Test Requirements**:
  - `programmatic` TR-3.1: 所有 Hook 导出正确，无语法错误
  - `human-judgment` TR-3.2: 模糊匹配算法能正确处理大小写和标点差异
- **Notes**: 语音识别需处理浏览器兼容性

## [x] Task 4: 对话场景组件开发
- **Priority**: high
- **Depends On**: Task 2, Task 3
- **Description**: 
  - 实现 `DialogueScene` 组件（角色渲染、对话气泡、字幕、进度条）
  - 实现 `TypingInput` 组件（输入框、预设选项、提交、提示）
  - 实现 `VoiceRecorder` 组件（麦克风按钮、录音状态、倒计时）
  - 实现 `ResultFeedback` 组件（成功/失败提示、评分展示）
- **Acceptance Criteria Addressed**: AC-2, AC-3, AC-4, AC-5
- **Test Requirements**:
  - `human-judgment` TR-4.1: 对话场景组件正确渲染角色和对话内容
  - `human-judgment` TR-4.2: 打字输入组件支持预设选项和自由输入
  - `human-judgment` TR-4.3: 语音录制组件显示录音状态和倒计时
- **Notes**: 组件需支持深色主题样式

## [x] Task 5: 练习页面开发
- **Priority**: high
- **Depends On**: Task 4
- **Description**: 
  - 实现 `Practice/index.jsx` 练习页面
  - 整合打字跟练和语音跟练模式逻辑
  - 实现分支对话跳转逻辑
  - 实现完成场景后的统计更新
- **Acceptance Criteria Addressed**: AC-2, AC-3, AC-4, AC-5, AC-6
- **Test Requirements**:
  - `human-judgment` TR-5.1: 练习页面正确加载场景数据并展示对话
  - `human-judgment` TR-5.2: 打字模式能完成完整对话流程
  - `human-judgment` TR-5.3: 语音模式能完成完整对话流程
- **Notes**: 使用 react-router-dom 的 useParams 获取场景ID和模式

## [x] Task 6: 首页开发
- **Priority**: medium
- **Depends On**: Task 2, Task 3
- **Description**: 
  - 实现 `Home/index.jsx` 首页
  - 实现 `SceneCard` 组件（场景卡片网格）
  - 实现 `ModeSelector` 组件（打字/语音模式切换）
  - 实现 `StudyOverview` 组件（学习进度概览）
  - 配置路由导航
- **Acceptance Criteria Addressed**: AC-1, AC-6, AC-7
- **Test Requirements**:
  - `human-judgment` TR-6.1: 首页展示5个场景卡片，点击可进入练习
  - `human-judgment` TR-6.2: 模式切换器正确切换打字/语音模式
  - `human-judgment` TR-6.3: 学习概览显示正确的统计数据
- **Notes**: 使用 CSS Grid 布局场景卡片

## [x] Task 7: 数据面板开发
- **Priority**: medium
- **Depends On**: Task 3
- **Description**: 
  - 实现 `Dashboard/index.jsx` 数据面板
  - 实现 `StatsGrid` 组件（统计数据展示）
  - 展示完成场景数、练习时长、打字/语音练习次数等数据
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `human-judgment` TR-7.1: 数据面板显示所有统计数据
  - `human-judgment` TR-7.2: 数据来自 localStorage，刷新后保持
- **Notes**: 数据展示使用卡片布局

## [x] Task 8: 样式优化
- **Priority**: medium
- **Depends On**: Task 1-7
- **Description**: 
  - 创建 `theme.less`（主题变量）和 `global.less`（全局样式）
  - 实现深色主题 + 蓝紫渐变设计
  - 实现响应式布局（桌面端/平板端/手机端）
  - 添加动画效果（角色切换、输入反馈、页面过渡）
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `human-judgment` TR-8.1: 整体设计符合深色主题规范
  - `human-judgment` TR-8.2: 响应式布局在不同屏幕尺寸下正常显示
  - `human-judgment` TR-8.3: 动画效果流畅自然
- **Notes**: 使用 Less 变量管理主题色

## [x] Task 9: 构建验证
- **Priority**: high
- **Depends On**: Task 1-8
- **Description**: 
  - 运行 `npm run build` 验证构建成功
  - 测试开发服务器启动
  - 验证所有页面路由正常工作
- **Acceptance Criteria Addressed**: 所有 AC
- **Test Requirements**:
  - `programmatic` TR-9.1: `npm run build` 成功完成，无错误
  - `human-judgment` TR-9.2: 首页、练习页、数据面板路由正常
- **Notes**: 确保所有资源正确打包

## Task Dependencies
- Task 1 → Task 2, Task 3
- Task 2 → Task 4, Task 5, Task 6
- Task 3 → Task 4, Task 5, Task 6, Task 7
- Task 4 → Task 5
- Task 5 → Task 9
- Task 6 → Task 9
- Task 7 → Task 9
- Task 8 → Task 9
