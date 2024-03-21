---
title: dayjs
date: 2024-03-20
---


# dayjs 
- 用法
- 
```js
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
// 一些功能需要加载 
dayjs.extends(weekday) //举例

// number 添加几天|几周|几年
// string d | day | year | week
// 增加多少天 在指定时间之后
dayjs().add(number,string).format('YYYYMMDD')
//  减去多少天，在指定时间之前。
dayjs().subtract(number,string).format('YYYYMMDD')
// 校验 需要引入插件
dayjs.extends(customParseFormat)
dayjs(date,format,true).isValid()
```