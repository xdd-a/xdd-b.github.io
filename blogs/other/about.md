---
title: 关于我
date: 2023/04/03
categories:
 - xdd
---

::: tip 介绍
- 🔭 最近在写一些关于 React、Vue、TypeScript 和 Node 的总结。
- 🤔 我这阶段的任务是夯实基础。
- 💼 我是一名前端工程师。
- 🌱 对探索低代码方向抱有兴趣。
:::

## 项目经历

### PAPI

服务于线下用户进行前后端联调的工具，提供 API 管理和数据 Mock 的能力。

* 后端技术
  - **语言/框架**：Node、PM2、TypeScript
  - **数据库**：MySQL、TypeORM
* 前端技术
  - **语言/框架**：React、Ant、TypeScript
  - **配套工具**：Redux、React Router
  - **打包构建工具**：Webpack
* 前后端通信
  - WebSocket+nisper

项目中的亮/难点：
1. 前后端采用 WebSocket 通信极大提高用户访问 API 页面的速度
2. 多分支管理项目 API 功能方便用户以项目为维度进行多人多次开发交互
3. 根据定义的返回数据格式/类型进行 Mock，方便用户更好的调试，减少因为后端接口未完成前端被卡的痛点

### 可能会问的问题

1. 整个项目的构建+部署流程怎么做的？
2. 用户管理怎样做的？
3. 为什么用 WebSocket？它和 http 有啥区别？
4. 讲讲多分支管理项目？和 Git 分支有啥不同？
5. Mock 功能怎么搞的？市面上有哪些 Mock 功能？为什么不用