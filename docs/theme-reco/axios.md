---
title: axios学习
date: 2024-03-20
---

# axios
- axios 配置 axios.create时会有一个配置项是`paramsSerializer` 
  - 一般用法是
  ```js
  params = {
    a:[1,2],
    c:!
  }
    paramsSerializer(params){
        return qs.stringify(params)
    }
    他会将参数变为   a=1&a=2&c=1
  ```
  - 但是这个时候的a是个数组 当他的参数有对象或数组项的时 是不会走axios的全局配置的 需要自己在请求的时候配置一下config
- validateStatus
  - 用来判断的是 HTTP状态码（浏览器返回）
  - 如果为返回 `true` (或者设置为 `null` 或 `undefined`)  则 `promise` 将会 `resolved`，否则是 `rejected`