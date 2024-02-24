---
title: React 底层架构
date: 2023/12/21
author: senmu
---

## 前言

React 在版本 15 与 16 有比较大的更改，那么这么大费周章的重构一定有存在了以前架构无法解决的痛点了。

现代的前端开发框架之间竞争非常激烈，React 想要稳固他的地位，那么提升 React 的性能是躲不过的事情。

## 一、16、17、18 版本更新了什么？

* 16.0.0 更改底层架构，采用 Fiber，提出异步渲染
* 16.1.0 推出了实验性的 [react-reconciler](https://github.com/facebook/react/blob/main/packages/react-reconciler/README.md) 包提供用户自定义 renderers
* ... 迭代更新
* 16.6.0 推出了实验性的 **Scheduler**
* 16.7.0 更新 Scheduler，正常迭代...
* 16.8.0 正式推出 Hook
* ... 迭代更新
* 16.13.0 实验性的 **Concurrent Mode**，`ReactDOM.createRoot()`
* 17.0.0 垫脚石版本，鼓励用户渐进式升级
  - 改变了 React 事件委托对象，以前是 document 现改为 React 容器根节点
  - 移除了事件池
  - 异步执行 `useEffect` 的 cleanup
* 18.0.0 主要是正式上线了 **Concurrent Mode**（并发模式）
  - 自动批处理—以前只有 React 的事件才会批处理，而被 `setTimeout` 等原生 js 语法包裹的事件无法批处理。
  - 过渡更新—推出 `startTransition` 告诉 React 哪些需要进行*过渡更新*，而不是*紧急更新*
  - Suspense 更加方便
  - 新的 Hook：`useId`、`useTransition`、`useDeferredValue`、`useSyncExternalStore`、`useInsertionEffect`

⚠️注意：React 默认不会开启 **Concurrent Mode**

## 二、为什么 React 要更新底层架构？

要想搞清楚这个问题，那么必须知道 React 是如何将*元素*渲染到页面中的（包括如何更新）。

就从 15 版本看：

* Reconciler—构建VDOM，准确来说 15 版本用的是 `stack-reconciler`
  - [实现stack-reconciler](https://zh-hans.legacy.reactjs.org/docs/implementation-notes.html)
* Rerender—渲染

以上两个便是 React 内部工作的核心，它们一个负责处理逻辑，一个负责渲染，各司其职，很美妙对不对。

但是，这是因为这样简单的结构导致 React 面对庞大数据量以及复杂交互时显得手忙脚乱（掉帧）。我们从一个简单的例子看起：

```ts
  // 想象一个简单的列表渲染以及更新
  // [1, 2, 3]
  // 渲染：
  //   reconciler 发现 1 并且知道了它应该渲染成什么样子，一切处理好后告诉 rerender 该渲染了，rerender 乖乖执行渲染
  //   reconciler 处理 2，rerender 渲染
  //   reconciler 处理 3，rerender 渲染
  // 一切看起来不错～
  // 这时候，用户下发了乘法指令，所有数字乘以 2，此时变为了 [2, 4, 6]
  // 更新：
  //   reconciler 发现原本为 1 的元素变为了 2，和之前不同，他兢兢业业处理好一切后告诉 rerender 该渲染了，rerender 乖乖执行渲染
  //   reconciler 处理 4，rerender 渲染
  //   reconciler 处理 6，rerender 渲染
```

上面的例子我们看起来也没什么问题，逻辑简洁清晰，但是如果用户的操作变多、数据量变大那么会出现什么情况呢？

> tips：浏览器是一帧一帧的渲染，即每一帧会处理 JS 逻辑、样式布局、样式绘制。

我们知道一般浏览器的刷新频率为 60Hz，即每（1000ms / 60Hz）16.6ms 浏览器刷新一次。

也就是说我们在这 16.6ms 中完成上述的一系列操作（JS 逻辑处理、样式布局、样式绘制），用户并不会有任何不适（除非你的眼睛和普通人不同）。

但是，由于数据量增大，我们的处理逻辑（JS 逻辑）占用了大量时间导致超过了 16.6ms，这时也就让用户感受到了不适。

虽然这时候的架构会导致掉帧，那我们可以进行优化呀，emmm，的确如此，我们做开发首先想到的是*如何优化原有逻辑*。

那么我们来尝试优化下：

* reconciler 长时间执行会导致掉帧，那我们就把他改为可以中断的执行，每一帧留给 JS 执行一定时间去执行，如果执行不完就放到下一帧去完成
* rerender 逻辑不太好，我们优化为一次性更新，由 reconciler 全部处理完毕后统一渲染，这样也不会导致由于被中断的执行导致渲染不一致

嗯，上面的优化很合理，但是实际上我们的 reconciler 采用的是递归的方式执行，我们都知道递归一旦运行就无法暂停（即便可以退出递归，但是无法保证下次继续执行）。


直到此，我们无计可施，于是 React 决定重构底层架构。

## 三、Fiber 架构