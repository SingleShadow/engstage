# EngStage — 英语跟练助手 Demo 初版 PRD

## Overview
- **Summary**: EngStage 是一款基于真实对话场景的沉浸式英语跟练工具，提供打字跟练和语音跟练两种模式，帮助用户在模拟真实场景中练习英语口语和听力。
- **Purpose**: 解决英语学习者"不敢开口、缺少语境、反馈缺失"的痛点，让用户在安全的虚拟环境中练习日常对话。
- **Target Users**: 英语初/中级学习者、备考雅思/托福口语的考生、希望提升日常英语交流能力的成年人

## Goals
- 实现打字跟练模式：用户打字回复，系统模糊匹配并给出反馈
- 实现语音跟练模式：用户录音跟读，系统识别并评分
- 提供5个日常对话场景（咖啡店、餐厅、问路、超市、面试）
- 实现数据面板：展示学习统计和进度
- 支持 localStorage 数据持久化

## Non-Goals (Out of Scope)
- 游戏化系统（金币、成就、等级）— 留待后续版本
- AI 智能纠错 — 留待后续版本
- 沉浸式场景音效 — 留待后续版本
- 多语言支持 — 仅支持英语学习
- 用户认证系统 — 无需登录

## Background & Context
- 基于 TRAE AI 创造力大赛初赛要求开发
- 技术栈：React + Less + Vite + React Router DOM
- 使用 Web Speech API 实现语音功能

## Functional Requirements
- **FR-1**: 首页展示5个场景卡片，用户可选择场景和模式（打字/语音）
- **FR-2**: 打字跟练模式：展示对话场景、提供预设答案选项、支持打字输入、模糊匹配、播放发音
- **FR-3**: 语音跟练模式：展示对话场景、录音跟读、语音识别、评分算法、播放发音
- **FR-4**: 分支对话系统：用户选择不同选项触发不同后续对话
- **FR-5**: 数据面板：展示完成场景数、练习时长、统计数据
- **FR-6**: localStorage 数据持久化：保存用户进度和学习统计

## Non-Functional Requirements
- **NFR-1**: 响应式设计，支持桌面端和移动端
- **NFR-2**: 深色主题 + 蓝紫渐变设计风格
- **NFR-3**: 语音识别在不支持的浏览器中自动降级为打字模式
- **NFR-4**: 页面加载时间 < 2秒

## Constraints
- **Technical**: React + Less + Vite + React Router DOM，无后端依赖
- **Business**: 大赛初赛 Demo，核心功能可用即可
- **Dependencies**: Web Speech API（浏览器原生支持）

## Assumptions
- 用户使用现代浏览器（Chrome/Edge/Safari）
- 用户同意浏览器麦克风权限请求
- localStorage 可用且未被禁用

## Acceptance Criteria

### AC-1: 首页场景选择
- **Given**: 用户访问首页
- **When**: 用户看到5个场景卡片和模式切换器
- **Then**: 用户可点击场景卡片进入练习，可切换打字/语音模式
- **Verification**: `human-judgment`

### AC-2: 打字跟练模式 - 预设选项选择
- **Given**: 用户在打字跟练模式中
- **When**: 用户点击预设答案选项
- **Then**: 系统验证答案，正确则播放发音并进入下一轮，错误则显示提示
- **Verification**: `human-judgment`

### AC-3: 打字跟练模式 - 打字输入匹配
- **Given**: 用户在打字跟练模式中
- **When**: 用户输入文本并提交
- **Then**: 系统进行模糊匹配（忽略大小写、标点），命中则通过，未命中则显示标准答案
- **Verification**: `human-judgment`

### AC-4: 语音跟练模式 - 录音识别
- **Given**: 用户在语音跟练模式中
- **When**: 用户点击麦克风录音
- **Then**: 系统识别语音并显示识别文本和评分（≥70分通过）
- **Verification**: `human-judgment`

### AC-5: 分支对话系统
- **Given**: 用户在练习场景中遇到分支点
- **When**: 用户选择不同选项
- **Then**: 系统跳转至对应分支的后续对话
- **Verification**: `human-judgment`

### AC-6: 数据面板展示
- **Given**: 用户完成场景练习后
- **When**: 用户访问数据面板
- **Then**: 用户看到完成场景数、练习时长等统计数据
- **Verification**: `human-judgment`

### AC-7: 响应式布局
- **Given**: 用户在不同设备上访问应用
- **When**: 用户调整浏览器窗口大小
- **Then**: 页面布局自适应，移动端可正常使用
- **Verification**: `human-judgment`

## Open Questions
- [ ] 语音识别 API 在部分浏览器兼容性问题（已在设计中处理降级策略）
- [ ] 分支对话深度控制（每个场景1-2个分支点）
