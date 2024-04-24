---
title: javascript
date: 2024-03-20
---

## 数组 API
- splice 会修改原数组
- map 不会修改原数组 返回一个新数组
- reduce 累加
- some 一个命中规则 则返回true
- every 每个都命中 返回true 
- filter 过滤出符合条件的项 不会修改原数组
- slice 不会修改原数组 返回截取的项
- foreach 不会修改原数组
- push 后增 返回数组长度
- unshift 前增 返回数组长度
- pop 后删 返回删除的项
- shift 前删 返回删除的项


## Symbol.toPrimitive
- 当进行强制类型转换的时候，会执行这个方法，只有对象转原始的时候会执行
```js
const c = {
    [Symbol.toPrimitive](hint: number | string | default){
        console.log(hint)
        return 33
    }
}

+c // 33
c + 1 // 34
// 他都会执行 Symbol.toPrimitive 这个方法 并将返回值当成计算值。
// hint 是类型，
// 强制数字类型转换时，hint 就是 number
// 强制字符串类型转换时，hint 就是 string
// 强制原始类型转换时，hint 就是 default
```
- 当没有[@@toPrimitive] 属性时会以不同顺序调用 `valueOf` 和 `toString`

## 变量提升 & 函数提升
- 变量提升会将变量的声明提升到当前作用域的最顶端。
:::: code-group
::: code-group-item 变量提升
```js
- 变量提升
  - var、const、let 都有变量提升，只是他们提升的方式不同
    - var 会将声明提升到当前作用域的最顶端

- 例子1
var name = "JavaScript"
function showName(){
  console.log(name);
  if(0){
   var name = "CSS"
  }
}
showName()
这里的name打印的是undefined，是因为他优先会找的是当前执行上下文里的变量，var name = 'css' 会将var name 优先提升到`showName`内部的最顶端，所以打印的是undefined

- 例子2
function test(){
    let name = 1;
    if(true){
        let name = 2
        console.log(name) //2
    }
    console.log(name) //1
}
- 因为 let 有块级作用域，所以 name2 是在if块内部声明的，不会提升到test顶部，所以第二个name读的是test内部的name1

```
:::
::: code-group-item 函数提升
```js
函数的声明方式有两种
1、
   fn();
   var fn = function(){
    console.log(1)
   }
    等同于
    var fn;
    fn(); // 会报错 undefined不是一个函数 fn is not function
    fn = function(){}
    变量形式的声明方式 与变量提升行为一致。

2、
   fn() // 2
   function fn(){
    console.log(2)
   }
```
:::
::::

## 数组 or 对象 当做参数传递时，直接修改值
- 在 js 中，函数的参数是值传递，但如果是对象的话，那就是引用传递，
- 数组当做参数时，重新赋值，相当于将函数内部的变量重新指向了新的地址，而不会影响到原始数据。
- 对象当做参数时，直接修改对象的其中一个 key 的 value 时，因为是引用传递，他是同一个地址，所以会更改原始数据。
:::: code-group
::: code-group-item 数组
```js
function test(arr){
arr = [1,2,3]
}
const a = [1,2,3]
test(a)
// 当传递的是一个数组的时候，函数内部去重新赋值，并不会影响外部的a，除非直接修改下标对应的值 arr[0] = "a"

```
:::

::: code-group-item 对象
```js
function test(a){
    a.arr = [4,5,6]
}
const a = {
    arr : [1,2,3]
}
test(a) // a.arr [4,5,6]
// 当传递的是一个对象的时候，他指向的是同一个地址，所以修改会影响原始数据。
```
:::

::::


 

## Map 数据结构
- 任何具有 Iterator 接口，且成员是一个双元素数组的数据结构，都可以当做 Map 构造函数的参数。
```js
const map = new Map([["name","张三"]])
map.get("name") // 张三


const set = new Set([
  ['foo', 1],
  ['bar', 2]
])

const map1 = new Map(set)
map1.get("foo") // 1

```
- map的key 如果是引用类型的话，他们的引用地址应该是同一个，否则的话会获取不到
```js
const map = new Map()
map.set(['a'],1);
map.get(['a']) // undefined 尽管['a'] 都是一样的 但是他们在内存中的地址是不同的 所以获取不到。

```
- 同一个key 的 map 后者会覆盖前者
```js
const map = new Map()
map.set(1,true);
map.set(1,false)

map.get(1) // false


```
- map 去访问一个不存在的键时，会得到undefined
```js
const map  = new Map()
map.get('asdasd') // undefined

```
- 如果 Map 的键是基本类型时，只要保证键严格相等，那么就会被视为同一个键，NaN尽管不相等，但是 Map 也将视为同一个键
```js
const map = new Map()
map.set(-0,1)
map.get(+0) // 1

map.set(true,1)
map.set('true',2)
map.get(true) //1
map.get('true') //2

map.set(NaN,1)
map.get(NaN) // 1

map.set(undefined,1)
map.set(null,2)

map.get(null) // 2
map.get(undefined) //1



```


## Set 数据结构
- set 构造函数可以接受一个数组或者具有 iterable 接口的 其他类型
- set 通过 add方法添加值，并且不会重复
```js
const set  = new Set()

[1,2,3,4,1].forEach(v=>set.add(v))
set // [1,2,3,4]

```
- set 添加值的时候 是通过 === 来比较的，他不会进行类型转换。NaN 除外， set认为他是相等的。