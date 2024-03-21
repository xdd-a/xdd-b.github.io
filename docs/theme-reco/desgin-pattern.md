---
title: 设计模式
date: 2024-03-20
---

# 设计模式
## 单例模式
> 只进行一次实例化的类，并且可以全局访问。适用于管理应用程序中的全局状态
```js
let instance
class Counter {
    constructor(){
        if(instance){
            throw new Error('class a only')
        }
        instance = this
    }
}
const counter = Obejct.freeze(new Counter())
```
