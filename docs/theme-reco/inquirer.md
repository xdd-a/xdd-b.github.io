---
title: inquirer 交互命令行
date: 2024-03-20
---

# inquirer 交互式命令
> 基于node环境 如果要在ts环境使用，需要一并安装@types/inquirer, 并且现阶段的9版本的会有问题，建议安装8.2.0 `npm i inquirer@8.2.0`
- 用法
```js
interface inquirerProps {
  type:number|string|list|input|confirm|password
  name:string// 问句的变量，最终会将value给到 name:value
  message:string // 问题内容
  default:string|number|boolean|array|function // 如果为function 他的value就是 配置的所有项的值
  validate: function // 校验 参数为当前的value
  when:function | boolean //可以根据前面的内容判断是否需要展示该问题
  choices:array | function // 列表的选择项 1 | 2
}



import inquirer from 'inquirer'

const config :inquirerProps[] = [
  {
    type:'list',
    name:'admin',
    message:'测试',
    default:'ad'
  }
]
const a = await inquirer.prompt(config)

console.log(a) // {admin: ad}
```