---
title: 开发npm包
date: 2024-03-20
---

### 步骤
- 1、npm init 创建 `package.json` 描述文件
- 2、在 `package.json` 文件中，设置bin命令
    ```js
    bin:{
        "命令":'./bin/index.js'
    }
    <!-- 可以通过 npm link 为命令创建软链接，他会链接到 `/usr/local/bin/<package>` -->
    <!-- 至此在命令行输入 命令即可执行'./bin/index.js'的内容 -->
    <!-- ps: 如果不设置的话 默认会以<name> 为命令 -->
    <!-- 注意：'./bin/index.js'文件头部 需要设置 `#! /usr/bin/env node`-->
    ```
### 发布npm包
- npm login 登录 npm 网站 
  - 不能使用淘宝源，需要使用官方 npm
- npm whoami 可以查看是当前用户
- npm publish 即可发布