---
title: 20230404知识点总结
date: 2024/03/20

---

[语雀面试整理]('https://www.yuque.com/cuggz/interview/pkg93q#t1zsk')
### package.json
- [x] 学习
- 主版本号.此版本号.修订版本号

```js
react: "4.0.3"; // 就安装4.0.3
react: "~4.0.3"; // 4.0.x不低于4.0.3版本 比如现在最高的版本更新到了4.1.1 那么我们会安装的版本就是4.0.9
react: "^4.0.3"; // 4.x.x 不低于4.0.3版本 比如现在最高的版本更新到了4.1.1 那么我们会安装的版本就是4.1.1
```

### 并发控制

- 考虑最大并发数量,
- 考虑正在进行的任务数量 不能大于最大并发数量
- 需要辅助函数， 添加任务不能立即执行，需要存起来放在后面执行
- run 函数
  - 跑任务， 正在进行的任务数量不能大于并发数量，并且 任务列表有值
  - shift 取出第一个任务 开始跑任务，跑的时候需要将 正在进行的任务数量+1
  - 然后成功调用 resolve 失败调用 reject
  - 任务执行完成不论成功还是失败 调用 finally 将 正在进行的任务数量-1 在启动 run 继续跑任务
  - 
```js
function timeout(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
class SuperTask {
  constructor(pCount = 2) {
    this.pCount = pCount; // 并发数量
    this.runCount = 0; //正在进行的任务数量
    this.questList = []; //任务列表
  }
  /**
   *
   * @param {*} task 任务
   *  添加一个任务，返回一个promise
   *  给他添加到任务列表中，需要调用的时候再调用，如果成功就resolve，如果失败就reject
   */
  add(task) {
    return new Promise((resolve, reject) => {
      this.questList.push({
        task,
        resolve,
        reject,
      });
      // 添加进去之后， 判断是否执行的逻辑交给run
      this._run();
    });
  }
  _run() {
    // 判断是否可以执行
    if(this.runCount >= this.pCount || this.questList.length <= 0){
      return 
    }
      const { task, resolve, reject } = this.questList.shift();
      this.runCount++;
      task()
        .then(resolve, reject)
        .finally(() => {
          this.runCount--;
          this._run();
        });
  }
}

const superTask = new SuperTask();

function addTask(time, name) {
  superTask
    .add(() => timeout(time))
    .then(() => {
      console.log(`任务${name}完成`);
    });
}
```

### 脚本加载失败重试

- 通过 监听 error 事件 需要改为捕获阶段， 因为报错冒泡获取不到
- 脚本引用错误类型是 Event 代码报错是 ErrorEvent
- 然后 documen.write 写入 正确的 script

```js
//  <script>
const a = ["./并发控制2.js", "./并发控制.js"];
let i = 0;
window.addEventListener(
  "error",
  (e) => {
    if (e.target.tagName === "SCRIPT" && !(e instanceof ErrorEvent)) {
      console.log("报错了", e);
      const url = new URL(e.target.src);
      document.write(`<script src=${a[i++]}>\<\/script>`);
    }
  },
  true
);
// </script>
```

# HTML

## em rem

- em：如果设置字体大小，则 1em=字体大小 否则 `1em = 16px`，会继承父元素字体大小
- rem: 相对于根元素 html，默认情况下字体大小是 `16px` 所以 没设置 `font-size` 时，`1rem = 16px`

## HTML5

- 新增标签：dialog、nav、header、footer、
  - audio 属性：loop 循环播放 autoplay 自动播放 controls 控制面板
  - video 属性：poster 指定封面显示的画面 controls 控制面板
    - 为了兼容不同的浏览器 可以使用 source 标签
    ```html
        <video>
            <source src="文件" type="video/mp4"></source>
        </video>
    ```
- 表单属性

  - email 提交时会校验 email 格式
  - url 会校验 url 格式 但是只校验是否以`http:` 开头
  - pattern 正则表达式

- script 标签中 async defer 区别

  - 无属性时，js 加载与执行 会阻塞 html 渲染
  - defer js 异步加载加载完成后等 html 渲染完成立即执行，不会阻塞 html 渲染
  - async js 异步加载 加载完成后立即执行，会阻塞 html 渲染

- meta 标签几种属性

  - charset 编码类型
  - name = viewport 适配移动端

### localStorage sessionStorage cookies 区别

- http 请求时，会带上 cookies 的信息。
- sessionStorage 只会在当前页面有效，不管他是不是同源
- cookies 可以设置过期时间，没有设置默认为浏览器关闭失效，存储大小 `4kb左右`
- sessionStorage 当前页面有效，关闭页面或浏览器时失效 存储大小 `5MB`
- localStorage 永久有效，除非手动删除 存储大小 `5MB`
- sessionStorage 不可以在多个标签页共享数据，但是如果是用过 `window.open` 打开的标签页且不是 `__blank` 的时候，他会复制一份 sessionStorage 到新的页面。

### 强缓存 协商缓存

- 基本原理：在浏览器加载资源的时候，会根据请求头`expires`和`cache-control`来判断是否命中强缓存策略，如果命中的话则去服务器取资源，否则，浏览器会向服务器发送一个请求，通过 `last-modified` 和 `etag` 来验证是否命中协商缓存，如果命中了协商缓存，则直接返回当前请求，使用浏览器缓存，如果没有命中协商缓存，正则服务器加载资源

- 强缓存

  - expires：`http1.0规范`, 这是一个绝对时间，是由服务端返回的。
    - 当浏览器第一次请求资源的时候，服务器会返回`Expires`这个相应头，下次请求的时候，会根据上次的 expires 来判断是否过期， 请求资源时间小于服务器返回的时间时，则使用缓存
  - cache-control:`http1.1规范`,优先级比 `expires` 高
    - `max-age` : 最大时间， 当前时间+最大时间 还在其中则不向服务器获取资源
    - `no-store`: 不缓存任何数据
    - `no-cache`: 储存在本地缓存区中，只是在与原始服务器进行新鲜度再验证之前，缓存不能将其提供给客户端使用

- 协商缓存
  - `ETag/if-None-Match`:是对该资源的唯一标识，资源发生变化,ETag 就重新生成
    - `ETag` 响应头中返回的，浏览器下次请求的时候会带上 `If-None-Match` 值为上一次的 ETag,然后由服务端判断资源是否修改
  - `Last-Modified/If-Modified-Since`：该资源文件的最后一次修改时间，以秒为单位
    - `Last-Modified` 响应头中返回，`If-Modified-Since` 请求头中带，过期就 200 没过期就 304 从缓存拿资源
  - ETag 优先于 Last-Modified

#### 操作流程

- 浏览器发起一个请求时，会判断本地是否有缓存资源，如果没有则会向服务器请求最新资源，并记录服务器返回的`last-modified`
- 如果有缓存记录，则先判断强缓存是否存在(`cache-control`||`expires`) 如果存在且时间没过期则返回本地资源（code 200）
- 如果强缓存失效了，则会发起协商缓存策略，首先服务器判断`ETag`标识符，如果客户端传来的标识符与服务器上的标识符一致则返回（code 304 not modified）不会返回资源内容
- 如果没有 Etag 标识 服务端会对比客户端传来的`if-modified-match` 如果两个值一致，响应头就不会带着`last-modified`（因为资源没变）返回 code 304 取本地资源
- 如果 Etag 和服务器端上的不一致，重新获取新的资源，并进行协商缓存返回数据。

### TCP UDP

- TCP：面向连接的协议，发送数据前会先建立连接，他是可靠的，不会出现数据丢失，没有重复，按顺序到达。（类似于打电话）
- UDP：无连接的协议，不需要连接，所以不安全。（类似于广播）

#### 运行在 TCP 上的协议

- HTTP：超文本传输协议
- HTTPS：安全超文本传输协议
- SSH 加密安全登录。

#### 运行在 UDP 上的协议

- DHCP：动态 IP 地址获取

#### 运行在 TCP 和 UDP 上的协议

- DNS:域名

### 从 url 到页面渲染完成 做了什么

- URL 解析，确定输入的协议（http or https）、域名、端口、资源等。
- DNS 解析，浏览器会向本地 DNS 服务器请求解析出该站点 IP 地址
- 建立链接，浏览器与服务器建立 TCP 连接， 如果请求是 HTTPS的话 还会进行 TLS 握手
  - TLS 加密协议是 ssl 协议的后继版本，在传输过程中通过加密数据，保证数据在两个系统之间传输时的隐私性和安全性，从而防止窃听和篡改。
    - 1、先握手建立安全连接
    - 2、记录协议
    - 3、数据传输
    - 4、连接结束
- 发送请求，浏览器向服务器发送请求
- 服务器处理请求，服务器收到请求后，根据请求的内容进行处理，确定要返回的资源。
- 返回响应，服务器将处理好的 http 报文返回给浏览器
- 处理 HTML，解析 html 构建 dom 树
- 处理 CSS： 解析 css 文件 和 style 标签，构建 cssom 树
- 执行 JavaScript：加载 script 标签的内容并执行
- 构建渲染树：结合 dom cssom 合并成渲染树
- 布局：浏览器计算每个节点中的渲染树大小与位置。
- 绘制：浏览器将渲染树中每个节点转换成真实像素
- 合成：如果页面有多层，浏览器将他们合成成最终屏幕图像
- 加载子资源：在解析html的时候，浏览器会加载其他 font 图标 等资源。
  

### get post

- get:重点是获取服务器资源，传输量小，受 URL 长度限制，不安全，他的传输是在 URL 上的，是可见的
- post:一般是向服务器发送数据，可以大量传输，post 是安全的，他是在请求体中。

## 重绘和回流

- 回流一定会触发重绘，重绘不一定会触发回流

### 重绘

- 当元素的样式发生变化，但不会影响其在文档流中的位置时，浏览器会对元素进行重绘
- 导致重绘的操作
  - background，color
  - border-redius，visibility，box-shadow

### 回流 || 重排

- 当元素的尺寸，结构，属性发生变化的时候，浏览器会重新渲染的过程就叫回流或重排
- 导致回流的操作
  - 页面首次渲染
  - 浏览器窗口大小发生变化
  - 元素的内容，字体，尺寸发生变化

### 如何避免回流和重绘

- 避免使用 css 表达式
- 不要使用 table，一个小的改动可能会造成整个 table 重新布局
- 不要频繁的修改样式，应该放到一个 class 下一起修改
- 可以先将元素`display：none` 修改完成在 显示，
- 使用 `transform` 属性实现动画，不会触发回流重绘
  - 因为 `transform` 的元素被浏览器提升为复合图层，元素的变化可以运行在 GPU 上，而不是 cpu，因为GPU 处理这些变化，不需要修改 dom树 和css 树，也不需要重新布局，所以他不会造成重绘和重排
  - 但是 如果元素有很复杂的内容，或者他们的变化会导致与其他元素的重叠，浏览器还是会进行重绘。

# JS

- 浏览器线程---用户交互
- JS 是一个单线程语言，是因为他是运行在浏览器的渲染主线程中的，而渲染主线程又只有一个。
- 渲染主线程有很多的工作，比如：解析 HTML,解析 CSS，执行 JS 等都在其中运行
- 如果使用同步的方式，会造成堵塞，会导致队列中的其他任务等待。
- 浏览器采用异步的方式避免造成阻塞，具体做法为：
  - 1、主线程将 定时器， 事件交互，网络等交给其他线程去处理，处理完成之后包装成任务放进队列末尾中，等待主线程调度。
- 队列执行优先级 微任务==》交互==》延时


## JS 的事件循环

- W3C 规定，每个任务都有自己的类型，同一个类型的任务应该放到同一个队列中。
- 不同的队列有不同的优先级
- 微任务队列优先级最高，必须优先调度。 交互任务队列次之，延时任务最后。

```js
/**
 *  @循环流程
 *  1、全局代码开始执行。
 *  2、碰到  @setTimeout @setInterval 先交给@计时线程 处理，处理ok之后包装成任务放到@延时队列 中
 *  3、碰到  @Promise的then 放到 @微任务队列 中
 *  4、@打印 开始执行  如果@主线程 执行完成，为空之后，优先执行@微任务队列 中的任务，
 *  5、@微任务队列任务 执行完成之后，先执行 @交互任务队列 再执行 @延时队列任务
 *  6、@总结 如果@其他任务队列中执行的任务里包含微任务队列 @那执行完成该任务之后会立即去执行微任务对象
 */
```

## Chorme 的进程

- 浏览器进程： 界面显示，用户交互 有很多的线程处理不同的任务
- 网络进程：网络资源，有很多的线程处理不同的任务
- 渲染进程：只有一个`渲染主线程`，负责解析 `HTML CSS JS` 代码， 一个标签页是一个渲染进程，保证不同的标签页渲染互不影响

## JS 中的计时器是否精确

- 不精确
- 因为 事件循环中，只有主线程空闲时，才会执行延时队列的任务。所以又带来了偏差。
- 在 W3C 中明确规定，如果`setTimeout` 嵌套超过 5 层 就会有 4 毫秒的偏差

```js
setTimeout(function () {
  setTimeout(function () {
    setTimeout(function () {
      setTimeout(function () {
        setTimeout(function () {
          setTimeout(function () {
            setTimeout(function () {
              setTimeout(function () {
                setTimeout(function () {
                  // 嵌套超过5层后 每层都会默认最低4毫秒 即使你写的是0ms
                }, 4);
              }, 4);
            }, 4);
          }, 4);
        }, 0);
      }, 0);
    }, 0);
  }, 0);
}, 0);
```

### 数组的方法 
- reduce 
```js
let a = [1,2,3,4,5]
a.reduce((cur,pre)=>cur-pre)
cur  pre
1    2
-1   3
-4   4
-8   5
最后reduce 返回 -13

```

- map 返回的是一个新数组， 对原数组不会有修改

- 字符串不可以`str[i] ` 这样修改  字符串需要重新赋值


## ES6

### var let const 区别

- var 有变量提升，即声明前调用为 undefined ，const let 不可以会报错
- var 变量默认会挂在 window 上
- var let 可以重复声明， const 不可以
- const 和 let 有暂存性死区
- let var 可以不设置初始值，const 必须设置

### 普通函数与箭头函数的区别

- 普通函数 this 指向调用者，如果没人调用则指向 window，箭头函数本身不绑定 this，会捕获全局的 this 作为自己的 this `{ }` 对象的大括号不算全局范围
- `call apply bind` 不能改变箭头函数的 this 指向
- 箭头函数无法 new, 因为 箭头函数无法改变自己的 this 指向
- 箭头函数 无 arguments

### class

- 实例的`__proto__（原型指针）` 等于 类的`prototype(原型)`
- 类内部定义的方法，都是不可枚举的
- static 静态资源 不会被实例继承，直接通过类调用

```js
class B {
  constroctor() {}
  toString() {}
}
Object.keys(B.prototype); // []
/**
 * @getOwnPropertyNames 返回对象本身的枚举属性
 */
Object.getOwnPropertyNames(B.prototype); // [con]
const b = new B()`b是B的实例`;

class MyClass {
  constructor() {}
  get prop() {
    return "getter";
  }
  set prop(value) {
    console.log("setter   " + value);
  }
  static classMethod() {
    return "hello";
  }
  static bar() {
    this.classMethod();
  }
}
const inst = new MyClass();
inst.prop = "1"; // 会走 set prop()方法
inst.prop; // 会走 get prop()方法
MyClass.classMethod(); // hello
inst.classMetho(); // TypeError 报错
`静态方法中的 this 指向类 而不是实例`;
```

#### class 中的 this 指向

- this 默认指向类的实例，但是不能单独取出使用

```js
class Logger {
  printName(name = "there") {
    this.print(`Hello ${name}`);
  }

  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
printName(); // 报错，因为取出来单独使用的话， 他会当做普通函数的this指向来使用， 但是类中有严格的模式 所以this会指向undefined
```

### generator 函数

- function 关键字与函数名之间有一个星号，并且内部使用 yield 表达式定义不同状态
- 直接调用函数，并不会执行，返回的也不是函数的运行结果，而是一个指向内部状态的指针对象(iterator)
- 每次调用 next 方法才会使得指针移向下一个状态（每次 next 之后，会一直执行直到碰到 yield 或者 return）
- yield 如果在一个表达式中，必须放在括号内。
- 任何普通函数内使用 yield 都会报错
- 如果 `next` 没参数 `yield` 没返回值，如果 `next` 有参数， 则会当做上一次`yield`的返回值
- for of 可以循环 Generator 函数，需要注意的是，如果 done 为 true 就会终止循环
- return 就表示终止执行了，后续 yield 也不会执行，done 就为 true
```js
function* handle() {
  yield "hello";
  yield "word";
  return "ending";
};
const hl = handle();
console.log(hl.next());
{value: yield或者return的值,都没有的时候为undefined done：是否执行完 没有yield或者return时 为false       };
console.log(hl.next());
console.log(hl.next());
console.log(hl.next());
```
- yield结尾 done为false value为yield后的值，return结尾 true value为return后的值
```js
function* handle() {
  yield "hello";
  yield "word";
  return "ending";
};
const hl = handle();
console.log(hl.next()); // {value:hello,done:false}
console.log(hl.next()); // {value:word,done:false}
区别：console.log(hl.next());// {value:ending,done:true}

function* handle() {
  yield "hello";
  yield "word";
  yield "ending";
};
const hl = handle();
console.log(hl.next()); // {value:hello,done:false}
console.log(hl.next()); // {value:word,done:false}
区别：console.log(hl.next());// {value:ending,done:false}
```


### iterator

- 只有具有 iterator 属性的才可以供给 for of 消费
```js
const handle = function (arr) {
  let max = 0;
  return {
    next: function () {
      return max < arr.length
        ? { value: arr[max++], done: false }
        : { value: undefined, done: true };
    },
  };
};
```
- 对象没有 iterator属性 但是我还是想要用for of 消费如何操作？
```js
var obj = { name: 1, age: 2, len: 3 }
obj[Symbol.iterator] = function() {
    var keys = Object.keys(this)
    var index = 0
    return {
      next: function() {
        return index < keys.length ? { value: keys[index++], done: false } : { value: undefined, done: true }
      }
    }
}
for(var k of obj) {
  // name
  // age
  // len
}

```

### promise
- 状态只能修改一次，由pending改为fulfilled 或者由pending改为rejected
- Promise.all：所有都成功就返回所有的resolve， 有一个失败，就reject，reject的内容会在catch中捕获。
- Promise.any：只要有一个成功就返回成功的，不会被失败的影响，所有的都失败的话 在catch中捕获。
- Promise.race：谁先执行完成就返回谁，不论成功失败
- then：可以链式调用，下一个then的参数是上一个then的返回值
- finally：不论执行成功或者失败都会走的一个回调函数


### map set workmap weakkset

#### set
> set的参数只能是具有`iterator`属性的类型
- api
  - size：获取实例成员总数
  - add：添加某个值
  - delete：删除某个值
  - has：返回一个布尔值，表示 set 是否有该成员
  - clear：清除所有成员

```js
const set = new Set([1,2,3,4,4])
[...set] // 1 2 3 4 去重
`set.size   // 5
set 中加入NAN 他认为两个NAN是相等的 而在JS中是不相等的`
```

- 遍历方法
  - keys：set 的 key
  - values：set 的 values
  - entries：返回【值:值】

#### weakSet

- 只能放置对象，且是弱引用，weakSet 里的引用不会计入垃圾回收机制
- 有`add` `delete` `has` 没有遍历方法 没有 size

#### Map

- api
  - set:添加一个 key：value
    - key 相同，后面会覆盖前面
  - get:获得 key 对应的 value
    - 只有对同一个对象的引用才视为同一个键，意思就是引用空间一致
  - has:判断是否存在 key
  - delete：删除对应 key
  - size:实例成员数量
  - clear:清除所有成员
- 遍历方法
  - keys
  - values
  - entries
  - forEach

#### weakMap

- 只接受对象和 symbol 作为 key `null`除外
- 不计入垃圾回收机制
- 没有 `clear` `keys` ` values``entries ` `size`

### Symbol

- 如果 Symbol 参数 是一个对象，就会调用对象的`toString`
- 参数一致的 Symbol 值是不同的
- Symbol 可以转字符串 转 boolean 无法转数字类型，也无法参与运算
- Symbol 实例方法：`description`
- Symbol 作为 key 需要加中括号
- `Object.getOwnPropertySymbols()` 可以获取对象所有的 Symbol 属性名，返回值是一个数组
- `for in ` `Object.getOwnPropertyNames` 无法获得 Symbol 属性名
- `Reflect.ownKeys()` 可以获取所有 key 值
- `Symbol.for` 会查找有没有相同参数名称的 Symbol 值，有就覆盖，没有就新建，他是在全局注册的
- `Symbol.keyFor` 会返回一个已经登记的 Symbol 的 key 只有 Symbol.for 才会登记

```js
let s1 = Symbol("foo");
s1.toString(); // Symbol('foo')
s1.description //foo
var a = {
    [s1]:...
}

Object.getOwnPropertySymbols(a) // [Symbol(foo)]
```

### 深拷贝和浅拷贝

#### 浅拷贝

- slice() 如果值是基本类型 则互不影响， 如果是引用类型，则他们会指向同一空间
- concat()
- 扩展运算符
- array.from
- Object.assign()

```js
const a = [1, 2, [3, 4]];
const b = a.slice();
a[0] = 2;
b[2][0] = 4;

a; // [2, 2,[4,4]]
b; // [1,2,[4,4]]
```

#### 深拷贝

- 修改原来的不会影响现在的，引用地址的修改
- JSON.parse(JSON.stringify(obj))
- lodash.cloneDeep
- 手写一个深拷贝
```js
1、循环嵌套时，拷贝会报错：
var obj = {a:1,b:2}
obj.c=obj
function deepClone(obj){
  const map  = new Map()
  function _deepClone (value){
    if(typeof value !=='object'||value === null) return  value 
    if(map.has(value)) return map.get(value)
    let result = Array.isArray(value)?[]:{}
    map.set(value,result)
    for(let k in value){
      result[k] = _deepClone(value[k])
    }
    return result
  }
  return _deepClone(obj)
}
2、使用MessageChannel可以解决循环嵌套的问题
    const { port1, port2 } = new MessageChannel()
    let pro = new Promise((resolve) => {
        port2.onmessage = (event) => resolve(event.data);
        port1.postMessage(obj)
    })
    pro.then(res=>{
        console.log(res)
    })
```

### CommonJS 与 module区别
- CommonJS: 是对模块的浅拷贝
- export：是对模块的引用，只存只读，不能改变其值，



## JS 知识点

- 纯函数：函数的返回结果只依赖于参数，并且函数内部没有任何影响外部的操作，

### fetch 与 xhr区别
- fetch是原生js 没有使用到 XMLHttpRequest
- 他是基于promise设计的
- fetch 缺点
  - 他只针对网络请求错误的导致请求无法完成的错误 才会reject
  - 默认不会带着cookie


### 继承
- 每个函数都有一个`prototype`属性，所有函数通过`new`出来的对象都有一个`__proto__`属性指向函数的`prototype`，如果你想要使用对象的某个功能时，如果本身没有，会通过`__proto__`去向上查找
- 一个函数的原型对象的构造函数就是这个函数的本身
- `Object.hasOwnProperty(key)`：用来检查某个属性是不是对象的自有属性
- 下面代码打印`f1.a = 10  f1.b = 200` 这是因为 访问属性的时候，会先从自身找，如果找到了就不会再通过`__proto__`去向上查找，所有a是10 b是200（因为自身没有，所以向上找）
```js
function Foo(){}
var f1 = new Foo()
f1.a = 10
Foo.prototype.a = 100
Foo.prototype.b = 200
console.log(f1.a,f1.b)
```


### 闭包

- 一个函数内部声明了一个变量，被函数内部返回的函数所调用
- 他会缓存所引用的值

```js
// demo1
function demo() {
  var num = 10;
  return function () {
    console.log(num++);
  };
}
let ins = demo();
ins(); // 10
ins(); // 11
ins(); // 12

// demo2
var num = 10;
function demo(x) {
  return function () {
    console.log(x++);
  };
}
let ins = demo(num);
ins(); // 10
ins(); // 11
ins(); // 12
```

### null 为啥是 object 类型

- null 的机器码为 NULL,null 的指针全部为 0。 而 object 在电脑中存储的类型标签为 000 所以 null 被认为是 object

### 0.1+0.2!==0.3

- 0.1+0.2 其实是二进制之和 0.1 与 0.2 的二进制是一个无限循环的数，在 JavaScript 中他遵循 IEEE754 标准采用 64 位固定长度表示，在二进度科学表示法中，双精度浮点数的小数部分最多保留 52 位剩下的遵循 0 舍 1 入的原则，所以相加得到的结果为 0.3000……4
- 解决办法： 可采用` s.toFixed(2)`// 四舍五入
- Number.EPSILON 他的值为 2 的-52 次方 可以判断 0.1+0.2-0.3 是否小于 如果小于则可以判断为等于

### 字符串/数组/等 api

#### 字符串

- toLocaleUpperCase() 转大写
- toLocaleLowerCase() 转小写
- subString s.subString(num) 从 num 为起点开始包括 num 截取后续所有字段


# css
- css 变量 
  - `dom.style.setPropertyValue('--color','prink')` 设置变量
  - `dom.style.getPropertyValue('--color')`  获取变量
  - `dom.style.removeProperty('--color')` 删除变量
  - 在css页面中可以通过`:root{}` 设置 这里设置的是全局变量，或者直接在当前样式内设置
  ```js
  .top{
    --color:'red'
    color:var(--color)
  }
  ```
- flex
  - flex 属性是设置给子元素的
    - flex-grow: 默认值为0 表示有剩余空间也不放大
    - flex-shrink: 默认值为1，表示剩余空间不足时缩小
    - flex-basic 默认值为auto 表示在主轴方向的大小
# 手写代码

## flat

```js
function flat(arr, deep) {
  if (!Array.isArray(arr)) throw "传入的不是数组";
  if (deep === 0) return arr;
  return arr.reduce((cur, pre) => {
    return cur.concat(Array.isArray(pre) ? flat(pre, deep - 1) : pre);
  }, []);
}

function flat(arr, deep) {
  if (!Array.isArray(arr)) throw "传入的不是数组";
  if (deep === 0) return arr;
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];
    if (Array.isArray(el)) {
      newArr = newArr.concat(flat(el, deep - 1));
    } else {
      newArr = newArr.concat(el);
    }
  }
  return newArr;
}
```

## 根据给定的列和行，生成旋涡数组

```js
function flatDemo(x, y) {
  const arr = new Array(x)
    .fill()
    .map((v) => new Array(y).fill(0))
    .filter(Boolean);
  let X = 0,
    Y = 0,
    stepX = 1,
    stepY = 0,
    count = 1;
  function handleBack() {
    return !arr[Y] || arr[Y][X] != 0;
  }
  while (1) {
    arr[Y][X] = count++;
    if (count > x * y) {
      return arr;
    }
    X += stepX;
    Y += stepY;
    if (handleBack()) {
      X -= stepX;
      Y -= stepY;
      if (stepY == 0) {
        stepY = stepX;
        stepX = 0;
      } else {
        stepX = -stepY;
        stepY = 0;
      }
      X += stepX;
      Y += stepY;
    }
  }
}
```

## 判断类型

```js
// 为啥用call 是因为 Object.prototype.toString 是对象的方法他会一直返回[object Object]
// 加上call 会根据传入的第一个参数为this的指向
Object.prototype.toString.call(value);
```

## 简单的防抖节流

```js
// 防抖
function debounce(fn, wait) {
  let timer = null;

  return function () {
    let arg = arguments;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.apply(undefined, arg);
    }, wait);
  };
}
// 节流
function throttle(fn, delay) {
  let timer = Date.now();
  return function () {
    let nowTimer = Date.now(),
      arg = arguments;
    if (nowTimer - timer >= delay) {
      timer = Date.now();
      fn.apply(undefined, arg);
    }
  };
}
```

## new 操作符做了什么

- 创建了一个空对象
- 将空对象的原型指针指向构造函数
- 调用该函数，将 this 指向新生成的对象。
- 判断该函数的返回值是否是对象 function 如果是则 return 他 如果不是则 return 新对象

```js
function newObj(fn, ...arg) {
  if (typeof fn !== "function") throw new TypeError("请传入函数");
  let obj = new Object();
  obj.__proto__ = fn.prototype;
  let result = fn.apply(obj, arg);
  return Object.prototype.toString.call(result) === "[object Object]" ||
    typeof result === "function"
    ? result
    : obj;
}
```

### call bind apply

- 改变 this 指向，无法改变箭头函数的 this 指向，在非严格模式下参数为`null undefined`会默认指向 window
- apply: 第一个参数是 this 指向，第二个参数是一个数组
- call: 第一个参数是 this 指向，后面可以传多个参数
- bind: 第一个参数是 this 指向，后面可以传多个参数，返回一个函数，可被 new 被 new 之后 this 指向函数

```js
// call
Function.prototype.newCall = function (context) {
  if (typeof this !== "function")
    throw new TypeError(this + " is not function");
  let args = [...arguments].slice(1);
  context = context || window;
  context.fn = this;
  let results = context.fn(...args);
  delete context.fn;
  return results;
};
// apply
Function.prototype.newApply = function (context, args) {
  if (typeof this !== "function")
    throw new TypeError(this + " is not function");
  context = context || window;
  context.fn = this;
  let results = args ? context.fn(...args) : context.fn();
  delete context.fn;
  return results;
};
// bind
<!--1、改变this指向，返回一个函数-->
<!--2、返回的这个函数可以被new 可以调用原型上的方法-->
//Function.prototype.newBind = function (context) {
  //if (typeof this !== "function")
  //  throw new TypeError(this + " is not function");
 // let args = [...arguments].slice(1);
//  context = context || window;
//  let that = this;
//  let fc = function Fn() {
//    let arg = arguments;
//    return that.apply(this instanceof Fn ? this : context, [...args, ...arg]);
 // };
//  fc.prototype = Object.create(that.prototype)
  //fc.prototype.constructore = that
 // return fc
//};
 Function.prototype.newBind = function (context) {
        if (typeof this !== "function")
            throw new TypeError(this + " is not function");
        let args = [...arguments].slice(1);
        context = context || window;
        let that = this;
        function bound() {
            let boundArgs = [...arguments]
            let finalArgs = args.concat(boundArgs)
            that.apply(this instanceof bound ? this : context, [...finalArgs])
        }
        bound.prototype = this.prototype
        return bound
    };
```

# 字节面试题

### 笛卡尔积

```js
const list = [
  ["白色", "黑色", "黄色"],
  ["a", "b", "c"],
  [1, 2, 3],
];
function demo(arr) {
  if (!Array.isArray(arr)) throw new TypeError("错误");
  return arr.reduce((cur, pre) => {
    let result = [];
    cur.forEach((v) => {
      pre.forEach((e) => {
        if (Array.isArray(v)) {
          result.push([...v, e]);
        } else {
          result.push([v, e]);
        }
      });
    });
    return result;
  });
}
const r = demo(list);
```

## 什么是跨域，跨域请求资源的几种方式

### 跨域

- 因为浏览器的同源策略，即协议 域名 端口 三者有任意一个与当前页面地址不同，则会跨域

### jsonp 请求

- 通过 `script` 标签的 src 进行网络请求，缺点只支持 get 请求。
- 通过 `proxy` 代理 通过将请求发送到后台服务器，然后由服务器来发送请求，再将请求的结果发送给前端
- 通过 `Cors` 通过服务器端配置响应头 `Access-Control-Allow-Origin:*`

# this 指向

```js
class Preson {  
  constructor() {
    this.name = "花";
    this.age = 10;
  }
  setAge() {
    console.log(this);
  }
}
const P = new Preson();
console.log(P.setAge()); // Preson{name:''花,age:10}
const x = P.setAge; // 这个时候的意思就是说 将setAge这个函数内容 给了x
x(); // undefined  本该是指向window的 但是因为class类局部自动开启严格性，导致undefined

window.name = "ByteDance";
function A() {
  this.name = 123;
}
A.prototype.getA = function () {
  console.log(this);
  return this.name + 1;
};
let a = new A();
let funcA = a.getA;
funcA(); // this指向window
`如果想要 funcA() 打印undefined 解释说可以用 apply与call来解决
 但是有一个细节点 
 apply 与call
    如果是非严格模式下，如果不传参数,或者第一个参数传null和undefined时， this也会指向window
    如果是严格模式下，第一个参数是谁，this就指向谁，包括null和undefined 如果不传则指向undefined`;
```

# React

- React 是从上到下的单项数据流，开发很自由，他使用虚拟 DOM 来有效操作 DOM，从而提高效率和速度。

## 虚拟 DOM 是如何工作的

- React 将整个 DOM 元素保存一份为虚拟 DOM
- 每当有更新的时候，他会生成两份虚拟 DOM 一份是更新后的虚拟 DOM，一份是当前的虚拟 DOM，然后比较两份 DOM 之间的差距，之后再将差异更新到真实 DOM 上

## 什么是 JSX

- 将 JavaScript 和 HTML 结合起来使用。

## 组件

### 函数/无状态/展示组件

- 接收一个参数，返回 react 元素，没有任何的副作用，这里没有 State 没有生命周期。

```js
function Index(props) {
  return <div>{props.children}</div>;
}
export default Index;
```

### 类/有状态组件

- 有自己的 state 有自己的生命周期，可以做一些逻辑运算。

```js
import React from "react";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1,
    };
  }
  // state = {

  // }
  componentDidMount() {}
  componentDidUpdate(preProps, preState) {}
  shouldComponentUpdate(nextProps, nextState) {
    return Boolean;
  }
  componentWillUnmount() {}
  render() {
    return <div>{this.state.count}</div>;
  }
}

export default Index;
```

### 受控组件

- 通过`onChange` `setState`修改状态

```js
const handleChange = () => {
  this.setState({
    state: 1,
  });
};
<Input value={this.state.state} onChange={handleChange} />;
```

### 非受控组件

- 通过 `ref`来处理表单数据

```js
import React from "react";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef(null);
  }
  render() {
    console.log(this.formRef.current.value);
    return (
      <Form>
        <Input ref={this.formRef} />
      </Form>
    );
  }
}
```

### 生命周期

- componentWillMount`弃用`: 组件渲染前调用，且只调用一次。
- componentDidMount: 组件第一次渲染后调用，且只调用一次。
- componentWillReceiveProps`弃用`:初始化的时候不会调用，在后续更新的时候 接收到一个新的 props 时调用
- shouldComponentUpdate: 返回一个布尔值 为 true 更新，为 false 不更新。在组件接收到新的`props`和`state`时调用，初始化和强制更新`forceUpdate()`时不触发
- componentWillUpdate`弃用`: 在接收到新的`props`和`state`时，但还没有 render 时调用，在初始化时不调用
- componentUpdate: 组件更新后立即调用，初始化不会调用
- componentWillUnmount: 组件卸载时立即调用，

### redux

- connect()

### react-router-dom

- BrowserRouter：基于 url 的 pathname
- HashRoauter：基于 hash 段 hash 会带#

```js
<Link to="/gotoA">Home</Link>

<NavLink to="/gotoB" activeClassName="active">
  React
</NavLink>
// 重定向
<Redirect to="/gotoC" />

// 根据路由渲染对应的组件
            <Switch>
                <Route exact path={`${match.path}/gotoA`} component={ComponentA} />
                <Route path={`${match.path}/gotoB`} component={ComponentB} />
                <Route pa th={`${match.path}/gotoC`} component={ComponentC} />
                <Route path={`${match.path}/gotoD`} component={ComponentD} />
                <Route path={`${match.path}/gotoE`} component={ComponentE} />
            </Switch>
```

### 性能优化

- 利用 `shouldComponentUpdate` 减少子组件不必要的渲染，
- 始终使用 keys，减少组件不必要的创建和销毁
- `useMemo`,`PrueComponent`

```js
// 父组件的更新，不会重新渲染Comp组件
const comp = useMemo(() => {
  return <Comp name="1" />;
}, []);
```

### hooks

- useState
- useEffect: 组件挂载完毕，dom 渲染完成后执行
  - 第一个参数是个 function 里面可以 return 一个 function 用作销毁时执行的一些操作，比如清除定时器等
  - 第二个参数不写：表示每次更新`state`或者 `props` 更新都会触发，每次更新都会触发销毁
  - 第二个参数为空数组：表示初始化的时候执行一次
    - ps:React 18.x.x 版本 空数组会执行先执行一次然后销毁执行一次，然后再执行一次 effect
  - 第二个参数为数组里加了依赖， 表示依赖更新就会触发，也会触发销毁
    - ps:先执行一次 effect，然后依赖更新时，先销毁，后触发 effect
- useLayoutEffect：组件挂载完成后执行
  - 可能会阻塞浏览器渲染
- useRef

  - 高阶用法：缓存数据，不触发函数的更新机制；

  ```js
  const useRef = useRef(0);
  useRef.current = 1;
  ```

- useContext:获取上下文

```js
import { useContext, createContext } from "react";
const Context = createContext(null);
function Father() {
  return (
    <Context.Provider value={{ name: 1, age: 2 }}>
      <Child />
    </Context.Provider>
  );
}

function Child() {
  const ct = useContext(Context);
  return (
    <div>
      <span>{ct.name}</span>
      <span>{ct.age}</span>
    </div>
  );
}
```

- useReducer：相当于 redux
  - dispatch:触发更新，重新渲染页面

```js
import { useReducer } from "react";
const reudcer = (state, action) => {
  const { payload, type } = action;
  switch (type) {
    case "add":
      return state + paylaod;
    case "delete":
      return state - payload;
    default:
        return state
  }
};
const initValue = 0;
function App() {
  const [state, dispatch] = useReducer(reducer, initValue);

  return (
    <div>{state}</div>
    <button onClick={()=>dispatch({type:'add',payload:1})}>+</button>
    <button onClick={()=>dispatch({type:'delete',payload:1})}>-</button>
  )
}
```

- useMemo：性能优化，减少没必要的重渲染。
  - 需要注意的是，被 useMemo 包裹的上下文，会形成一个独立的闭包，会缓存之前的 state，不加依赖是获取不到最新的值

```js
const DemoUseMemo = () => {
  const [number, setNumber] = useState(0);
  const newLog = useMemo(() => {
    const log = () => {
      /* 点击span之后 打印出来的number 不是实时更新的number值 */
      console.log(number);
    };
    return log;
    /* [] 没有 number */
  }, []);
  return (
    <div>
      <div onClick={() => newLog()}>打印</div>
      {/* 点击后number会增加，但是log里打印一直为0 */}
      <span onClick={() => setNumber(number + 1)}>增加</span>
    </div>
  );
};
```

- useCallback :必须配合 react.memo pureComponent ，否则不但不会提升性能，还有可能降低性能

```js
/* 用react.memo */
const DemoChildren = React.memo((props: any) => {
  /* 只有初始化的时候打印了 子组件更新 */
  console.log("子组件更新");
  useEffect(() => {
    props.getInfo("子组件");
  }, []);
  return <div>子组件</div>;
});

const App = ({ id }: any) => {
  const [number, setNumber] = useState(1);
  /* 此时usecallback的第一参数 (sonName)=>{ console.log(sonName) }
    经过处理赋值给 getInfo */
  const getInfo: any = useCallback(
    (sonName: any) => {
      console.log(sonName);
    },
    [id]
  );
  return (
    <div>
      {/* 点击按钮触发父组件更新 ，但是子组件没有更新 */}
      {number}
      <button onClick={() => setNumber(number + 1)}>增加</button>
      <DemoChildren getInfo={getInfo} />
    </div>
  );
};
```







# 浏览器渲染原理
- 他是由网络进程 将 html文档 推送给渲染线程，
- 渲染时会分为 dom tree 与 css tree