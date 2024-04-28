---
title: reactHook
date: 2024/03/20
author: xdd
---

# React 学习笔记

## 执行流程
- 类组件执行流程
  - constructor 初始化
  - render 渲染
  - componentDidmout 挂载
  - shouldComponentUpdate 返回true 表示更新 返回false 表示不更新
  - render
  - componentDidUpdate 更新
  - componentWillUnmount 卸载


## useState
> React是通过 Object.is 来进行比较是否需要重渲染的，如果两个状态一样就不会重新渲染
```js
// 他的初始化参数可以是一个函数，但必须是一个纯函数，并且他只会执行一次，无论是在子组件还是本身组件，重新渲染都不会再次执行
const handler = ()=>{
    return 1
}
const [state,setState] = useState(handler);
const [state,setState] = useState(0);
// react 将每一个setState放到了一个队列中进行更新的，所以他们拿到的state都是0 
setState(state+1)// 1
setState(state+1)//1
setState(state+1)//1

// 这是将获取state待定状态，然后用待定状态去计算了下一个状态
setState(state=>state+1)//1
setState(state=>state+1)//2

```

## setState
> 在react的事件中（合成事件），他就是异步的，在原生事件中，他是同步的。
```js
componentDidMount(){
    this.setState({}) // 异步的
    console.log() //打印值不会立即更新
} 

setTimeout() // 同步 会立即更新
// react的点击事件 异步
// dom的监听点击事件 同步

```

## useRef
> 他能帮助引用一个不需要渲染的值
> 改变他 ref.current 的值，React并不会重新渲染，因为 React 不知道他是什么时候改变的，他只是一个普通的 JavaScript 对象


## useImperativeHandle
> 在函数组件内部暴露一些方法供给父组件使用，这里向父组件传递了form
> 只能在 forwardRef 下使用
```js
useImperativeHandle(ref,()=>({form}),[form])
const Child = forwardRef((props,ref)=>{
    useImperativeHandle(ref,()=>({form}),[form])
    return (
        <input ref={ref}/>
    )
})

```

## useEffect
>- 有两个参数 
>- 第一个参数是一个函数，函数会返回一个清理函数，用来清除一些副作用，
>- 第二个参数是一个依赖项 每当依赖项发生改变的时候，会优先用旧值执行清理函数，然后在用新值执行函数，当组件从 DOM 中移除之后，react会最后一次执行清理函数
>- 如果你的`useEffect`不是由交互引起的，那么 react 在执行 `useEffect` 会先告知浏览器渲染出更新后的视图
>- 如果你的 `useEffect` 正在做一些视图相关的事情（`toolTip`），并且有一定的延迟、闪烁等、那么可以将 `useEffect` 替换为 `useLayoutEffect`
>- 如果你的 `useEffect` 是由交互引起的，浏览器也可能会在 `Effect` 处理内部状态更新之前，重新渲染屏幕，如果这不是你想要的，你可以替换为 `useLayoutEffect`
```js
// 当组件挂载后会先执行 setup 函数
// 当依赖项发生改变时，会先用旧值（旧的state和旧的props）执行清理函数，在用新值（新的state和新的props）执行setup
// 当组件从页面消失后，会执行一次 清理函数
useEffect(setup,deep)
useEffect(()=>{

},[]) // effect 中 使用了响应式值时，必须将其传入到依赖项数组中

setState(state+1) // 这种方式就是使用了响应式值，所以react 认为必须要将其放到依赖数组中
setState(state=>state+1) // 这是一个更新函数，所以他不认为是一个 响应式的值，所以这个state不需要放到effect的依赖项中。
```

## useCallback 用于缓存一个多次渲染的函数
> useCallback 初始化不调用就不会执行，只有依赖发生变化的时候才会重新生成函数，否则就一直返回缓存的函数
```js
import {useCallback} from 'React'
export default function demo(){
  const handleFn = useCallback(()=>{
    console.log('我缓存了')
  },[])
}


```


### 浏览器api IntersectionObserver
> 创建一个监听器，通过 ref 绑定 dom,然后观测这个 dom
```js

  const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
      } else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
      }
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }

```


## class 与 hooks 有什么区别
- hooks 能够更好的逻辑复用
:::: code-group
::: code-group-item 类组件
```js
class Counter1 extends React.Component {
  state = {
    count : 0
  }

  increment = () => {
    this.setState(preCount => preCount + 1);
  }


  render(){
    return (
      <div>
      {this.state.count};
      <button onClick={this.increment}>increment</button>
      </div>
    )
  }
}

class Counter2 extends React.Component {
  state = {
    count : 0
  }

  increment = () => {
    this.setState(preCount => preCount + 1);
  }


  render(){
    return (
      <div>
      {this.state.count};
      <button onClick={this.increment}>increment</button>
      </div>
    )
  }
}
```
:::

::: code-group-item 函数组件
```js
function useCounter(){
  const [count,setCount] = useState(0);

  const increment = () => {
    setCount(preCount => preCount + 1);
  }

  return {count, increment}
}
function Counter(){
  const {count,increment} = useCounter();
  
  return (
     <div>
      {count};
      <button onClick={increment}>increment</button>
      </div>
  )
}
```
:::
::::
- 生命周期优化，useEffect 可以代表 `componentDidMount` 、`componentDidUpdate` 、 `componentWillUnmount`
- 性能优化， 可以使用 `useMemo`、`useCallback`