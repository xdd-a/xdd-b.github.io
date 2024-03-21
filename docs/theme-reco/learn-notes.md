---
title: 杂项学习
date: 2024-03-20
---

# nvm包管理工具
- nvm use xx.xx.xx 将node版本切换到指定版本
- nvm install xx.xx.xx 安装指定版本
- nvm ls 查看所有的node版本
- nvm current 查看当前的node版本


### tsconfig.json配置
```js
  // 这两个是成对出现的必须要写
  baseUrl:'.'
  paths:{
    "@/*":["src/*"]
  }

```