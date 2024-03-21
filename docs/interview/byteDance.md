---
title: 面经
date: 2023/11/14
author: xdd
---

### `useEffect` 执行顺序，看下面例子

> `useEffect` 接受两个参数，第一个为回调函数（不支持 async），包括执行函数（`setup`）返回值为清理函数（`cleanup`）；第二个为依赖项（数组）。

* 在依赖项为空数组时，会在首次渲染执行 `setup` 函数，在组件卸载时执行 `cleanup` 函数（如果存在的话）
* 在依赖项不存在时，会在首次渲染/重新渲染**后**执行 `setup` 函数，在重新渲染**前**/组件卸载时执行 `cleanup` 函数
* 在依赖项存在时，会在首次渲染执行 `setup` 函数，在依赖项改变后会先执行 `cleanup` 函数再执行 `setup` 函数；在组件卸载时执行 `cleanup` 函数
* `useEffect` 为异步的，这样不会阻塞渲染

```tsx
import { useState, useEffect } from "react";

function Test1() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('effect1');
    
    return () => {
      console.log('effect2');
    }
  }, [])

  useEffect(() => {
    console.log('effect3');
  })

  useEffect(() => {
    console.log('effect4');

    return () => {
      console.log('effect5');
    }
  }, [count])

  console.log('effect')

  return <div onClick={() => setCount(count + 1)}>{count}</div>;
}
```

### esm 中的 export 与 require、module.exports 的区别

* 语法上：ESM 使用 `import` 和 `export` 语法；CommonJS 使用 `require` 和 `module.exports` 语法
* 输出值：ESM 导出的是值（包括基础类型和引用类型的值）的引用。CommonJS 面对基础类型导出的是值的拷贝，面对引用类型导出的是值的引用。
* 编译时与运行时：ESM 支持静态导入与动态导入，而 CommonJS 是动态导入。
  * 静态导入是指代码在编译时确定好各模块之间的依赖关系，意味着可以在编译时优化代码体积，也就是常说的 `tree shaking`
  * 动态导入是指代码在运行时才会确定模块之间的依赖关系
* ESM 支持异步加载，适合浏览器环境；CommonJS 是同步加载

### cookie、localStorage、sessionStorage

### event loop 执行顺序，看下面例子

> 需要注意哪些为同步任务、哪些为微任务、哪些为宏任务、哪些会阻塞流程

```ts
async function async1() {
  console.log('async1')
  await async2()
  console.log('async2')
}

async function async2() {
  console.log('async3')
}

console.log('start')

setTimeout(() => {
  console.log('async4')
})

async1()

new Promise((resolve) => {
  console.log('async5')
  for (let i = 0; i < 1000; i++) {
    i === 99 && resolve()
  }
  console.log('async6')
}).then(() => {
  console.log('async7')
}).then(() => {
  console.log('async8')
})

console.log('end')

```

再来一个经典的 MDN 例子：

```js
function resolveAfter2Seconds() {
  console.log("starting slow promise");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("slow");
      console.log("slow promise is done");
    }, 2000);
  });
}

function resolveAfter1Second() {
  console.log("starting fast promise");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("fast");
      console.log("fast promise is done");
    }, 1000);
  });
}

async function sequentialStart() {
  console.log("== sequentialStart starts ==");

  // 1. Start a timer, log after it's done
  const slow = resolveAfter2Seconds();
  console.log(await slow);

  // 2. Start the next timer after waiting for the previous one
  const fast = resolveAfter1Second();
  console.log(await fast);

  console.log("== sequentialStart done ==");
}

async function sequentialWait() {
  console.log("== sequentialWait starts ==");

  // 1. Start two timers without waiting for each other
  const slow = resolveAfter2Seconds();
  const fast = resolveAfter1Second();

  // 2. Wait for the slow timer to complete, and then log the result
  console.log(await slow);
  // 3. Wait for the fast timer to complete, and then log the result
  console.log(await fast);

  console.log("== sequentialWait done ==");
}

async function concurrent1() {
  console.log("== concurrent1 starts ==");

  // 1. Start two timers concurrently and wait for both to complete
  const results = await Promise.all([
    resolveAfter2Seconds(),
    resolveAfter1Second(),
  ]);
  // 2. Log the results together
  console.log(results[0]);
  console.log(results[1]);

  console.log("== concurrent1 done ==");
}

async function concurrent2() {
  console.log("== concurrent2 starts ==");

  // 1. Start two timers concurrently, log immediately after each one is done
  await Promise.all([
    (async () => console.log(await resolveAfter2Seconds()))(),
    (async () => console.log(await resolveAfter1Second()))(),
  ]);
  console.log("== concurrent2 done ==");
}

sequentialStart(); // after 2 seconds, logs "slow", then after 1 more second, "fast"

// wait above to finish
setTimeout(sequentialWait, 4000); // after 2 seconds, logs "slow" and then "fast"

// wait again
setTimeout(concurrent1, 7000); // same as sequentialWait

// wait again
setTimeout(concurrent2, 10000); // after 1 second, logs "fast", then after 1 more second, "slow"
```

### 实现 isEqual
