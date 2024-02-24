---
title: React 相关 Hook
date: 2023/12/21
author: senmu
---

### useCallback

用法：`const calledFn = useCallback(fn, [...deps]);`

注意：`useCallback` 缓存的是 `fn` 函数，并不会调用该 `fn` 回调函数。

**为什么会用 `useCallback`？**

> 案例：https://code.juejin.cn/pen/7314937599994134537

根据案例中的场景，我们有一个容器组件包括：切换主题、复杂的表单功能，在我们切换主题时并不会操作表单的功能，我们不希望表单组件进行重新渲染，但是如果我们不做任何处理它作为子组件的情况下还是会进行重新渲染；这是因为我们不使用 `useCallback` 包裹函数的情况下，每次重新渲染会使函数成为一个新的函数，那这就造成了表单组件的重新渲染。换句话说使用了 `useCallback` 包裹的函数在依赖项不改变的情况下使用的总是缓存的函数。

### useDeferredValue

用法：

```tsx
const [query, setQuery] = useState('');
const deferredQuery = useDefferedValue(query);
```
**为什么会用 `useDeferredValue`？**

想象一下我们有一个搜索框，用户在搜索框输入值会搜索相对应的值，如果使用 `state` 的话，那么每次输入都会触发重新渲染，项目小还没啥影响如果项目过大，那么卡顿感将会被放大。此时便可以使用 `useDeferredValue` 来实现类似防抖和节流的效果。

### useEffect

用法：

```tsx
useEffect(() => {
  // setup

  return () => {
    // cleanup
  }
}, [/*依赖项*/])
```

**关于依赖项：**

* 不填（指不写`useEffect`第二个参数），那么每次重新渲染都会执行 Effect
* 为空数组的，只有在 `mount` 阶段执行 `setup` 逻辑，`unmount` 阶段执行 `cleanup` 逻辑
* 填写响应式依赖，在 `mount` 阶段执行 `setup` 逻辑，每次响应式值改变先执行 `cleanup` 逻辑，后执行 `setup` 逻辑，`unmount` 阶段执行 `cleanup` 逻辑

**关于数据请求：**

```tsx
// 切换 person state 来请求最新数据
const [person, setPerson] = useState('senmu')
const [list, setList] = useState()

// 使用 .then 方式
useEffect(() => {
  let flag = false
  fetchData(person).then(res => {
    if (!flag) {
      setList(res)
    }
  })
  return () => {
    flag = true
  }
}, [person])

// 使用 async await 方式
useEffect(() => {
  async function getData() {
    const res = await fetchData(person)
    if (!flag) {
      setList(res)
    }
  }
  let flag = false
  getData()
  return () => {
    flag = true
  }
}, [person])
```

在数据请求中需要注意，`useEffect` 的第一个参数不允许是 `Promise`，如果要写 `async` 需要在内部单独定义函数；关于为什么要定义 `flag` 变量，是因为请求数据是异步的假如在请求还未完成时执行了意外的操作（例如组件卸载），那么数据就不该被设置到 `state` 中。

**Effect 生命周期：**

`mount` 阶段：

* 初始化变量
* 渲染 DOM
* 执行 `Effect setup` 逻辑

`update` 阶段：

* 渲染 DOM
* 执行 `Effect cleanup` 逻辑
* 执行 `Effect setup` 逻辑

`unmount` 阶段：

* 执行 `Effect cleanup` 逻辑

### useImperativeHandle

用于和 `forwardRef` 一起使用，暴露出元素部分重要的方法

案例：https://code.juejin.cn/pen/7317177764723818522

### useInsertionEffect

在组件渲染期间注入样式

```tsx
import { useState, useInsertionEffect } from 'react'
function MyComponent() {
  const [color, setColor] = useState('blue');
  
  useInsertionEffect(() => {
    // 假设 insertStyles 是一个将 CSS 注入到 DOM 的函数
    insertStyles(`.my-component { color: ${color}; }`);
  }, [color]); // 依赖项数组中包含 color，确保颜色变化时样式可以更新

  return <div className="my-component">Hello, World!</div>;
}
```

### useLayoutEffect

与 `useEffect` 类似，不同的是它比 `useEffect` 生命周期更早并且会阻塞浏览器重绘，这也意味着它的性能较差，所以一般建议使用 `useEffect`，除非特殊场景。

例如：https://code.juejin.cn/pen/7317478690915844133

### useMemo

用法：

```tsx
const cacheValue = useMemo(() => {
  return xx
}, [...deps])
```

注意：`useMemo` 会立即调用函数并缓存结果，但是不要每处都用该 Hook

### useState

用法：

```tsx
const [value, setValue] = useState(/**initValue*/)
```

注意：`initValue` 支持任何类型的值，但是函数类型有特殊的行为。只支持纯函数（函数有返回值）并且不允许有参数；React 会存储该初始化的函数结果。

**重置数据小技巧**：给组件设置 `key`，并且传递 `state` 值给 `key`，在需要重置数据时改变 `key` 值。

### useSyncExternalStore

> React18 中新增的 hook，方便订阅外部数据源的变化。

用法：`const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)`

### useTransition

用法：`const [isPending, startTransition] = useTransition()`

使用该 hook 不会阻断页面 UI，例如：https://code.juejin.cn/pen/7327947967090917385

另外，它的执行顺序需要了解下，请看下面的例子：

```tsx
  const [isPending, startTransition] = useTransition()

  console.log(1)

  startTransition(() => {
    console.log(2)
    // do something
  })

  console.log(3)
```

它会按照 1、2、3 的顺序打印～