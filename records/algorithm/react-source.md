---
title: react源码
date: 2024/03/20
author: xdd
---
[参考文献](https://react.iamkasong.com/)

## 第一章 React 理念
### React 理念
- JS 脚本执行 与 浏览器渲染是互斥的，会阻塞渲染，
- 浏览器渲染 主流的是 60HZ 也就是 1000ms /60 = 16.6ms 刷新一次，如果js脚本执行时间过长，就会导致这一帧无法执行 样式布局 & 样式绘制
- React 通过 unstable_createRoot 来启动 时间切片
```**js**

    ReactDom.unstable_createRoot(roolEl).render(<App />)

```
- 他会将任务切片 分割到多个 task 中，控制了 js 执行时间在 5ms 超出就终止执行，等待下一次继续执行。
  
### 老的React 理念
#### React 15 架构
- Reconciler（协调器） 负责找出变化的组件
- Renderer（渲染器）负责将变化的组件渲染到页面上

#### React 16 架构
- Scheduler（调度器）：调度任务的优先级，高优先级的先进入协调器 
- Rconciler（协调器）：负责找出变化的组件，然后打上update的标记
- Render（渲染器）：将变化的组件渲染到页面上 

#### Fiber 工作原理
- 双缓存树
  - Current fiber tree  当前渲染的树
  - workinprogress fiber tree 工作进程中的树
  - 当在内存中构建的树构建完成时，current的指针就会执行workinprogress fiber tree 来完成两个树之间的切换
- mount时构建替换流程
  - 第一次执行 `ReactDOM.render` 会创建一个整个应用根节点 `fiberRoot`  和 组件的根节点 `rootFiber`
  - `fiberRoot` 的 current 会指向 `rootFiber` 因为是第一次还没走到render 所以没有任何的子节点
  - 执行render 会创建一个 `workinprogress fiber tree` 构建中的树，当构建完成之后 会将 应用的根节点的 current 指向 `workinprogress fiber tree`  从而完成更新替换。
  - 每当有状态更新时，都会先创建一个 `workinprogress fiber tree` 等待构建完成，在替换current的指向，从而完成更新渲染。
### 总结
- `Reconciler` 协调器，相当于 `render` 阶段 他会调用组件的render方法
- `Renderer` 渲染器 相当于 `commit` 阶段 他会将需要渲染的东西提交渲染到页面上

## Fiber 节点 如何创建 Fiber 树

- 在 `render` 阶段，会调用 `performSyncWorkOnRoot` 或者 `performConcurrentWorkOnRoot` 这两个方法，来判断本次更新是同步更新还是异步更新。
- 其内部会调用以下两个方法

:::: code-group
::: code-group-item performSyncWorkOnRoot
```js
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}
```
:::

::: code-group-item performConcurrentWorkOnRoot
```js
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```
:::
::::
- 可以看到他们唯一的区别就是 `shouldYield` 方法，用来判断浏览器是否有空余时间，用于 `react` 的更新，如果没有就跳出循环，等待下次调度
- `performUnitOfWork` 方法会创建下一个 `Fiber` 节点 并赋值给  `workInProgress` 并将现在的和之前创建好的节点连接起来构建成 `Fiber` 树
- `performUnitOfWork` 工作其实就是 递 与 归，那么他们又是怎么执行的呢？ 
### “递”
- 会从根节点开始，深度优先遍历，一直到最后一个子集，遍历的时候会调用每个子集的 `beginwork` , 主要