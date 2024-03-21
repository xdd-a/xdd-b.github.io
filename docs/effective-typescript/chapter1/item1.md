---
title: 条目 1 ：理解 TypeScript 和 JavaScript 的关系
date: 2023/03/13
author: xdd
---

如果你使用 TypeScript 很长时间的话，你一定听说过“TypeScript 是 JavaScript 的超集”或者说“TypeScript 是 JavaScript 的类型超集”。但是你真的知道这是什么意思吗？那么到底 TypeScript 和 JavaScript 的关系是什么？

由于这些语言密切相关，因此深入了解它们与每种语言的关系是很好使用 TypeScript 的基础。

在语法意义上，TypeScript 是 JavaScript 的超集；只要你的 JavaScript 程序没有任何语法错误，那么它也是一个 TypeScript 程序。TypeScript 的类型检查器很可能会标记代码的一些问题。但是这是一个独立的问题。TypeScript 仍然会解析你的代码并且产出 JavaScript。（关于 TypeScript 与 JavaScript 另一部分的关键点，我们将在[条目 3](https://www.yuque.com/xdda/ge8hhi/zlfgb79me4quzi6v) 中探索。）

TypeScript 文件使用 `.ts` 或者 `.tsx` 作为后缀，而 JavaScript 文件使用 `.js` 或者 `.jsx` 作为后缀。当然，这并不意味着 TypeScript 是一种完全不同的语言！由于 TypeScript 是 JavaScript 的超集，因此 `.js` 文件中的代码已经是 TypeScript。将 `main.js` 重命名为 `main.ts` 不会改变这一点。
如果你要将现有的 js 代码库迁移到 ts，这将会非常有用。这意味着你不必用另一种语言重写任何代码就可以开始使用 TypeScript 并获得它提供的好处。如果你选择用 Java 等语言重写 JavaScript，情况并非如此。这种平缓的迁移路径是 TypeScript 的最佳特性之一。更多内容在[第 8 章](https://www.yuque.com/xdda/ge8hhi/eymgsd800ogy0bgf)中寻找。
可以这样说，**所有的 JavaScript 程序都是 TypeScript 程序，所有的 TypeScript 程序并非是 JavaScript 程序。**这是因为 TypeScript 添加了额外的语法来指定类型。（它添加了一些其他语法，主要是出于历史原因。参见[条目 53](https://www.yuque.com/xdda/ge8hhi/ta7tgb0209ovwbe3)。）
例如，这是一个有效的 TypeScript 程序：
```typescript
function greet(who: string) {
  console.log('Hello', who);
}
```
但是当你通过像 node 这样需要 JavaScript 的程序运行它时，你会得到一个错误：
```typescript
function greet(who: string) {
                      ^
SyntaxError: Unexpected token :
```
> `:string` 是 TypeScript 的类型注释，一旦你使用了一个，你已经超越了普通 JavaScript。（参考图 1-1）

![image.png](https://cdn.nlark.com/yuque/0/2023/png/12390816/1676012227263-3bd447b8-d3af-434e-b94f-4602f2d84765.png#averageHue=%23e2eaef&clientId=u5da513ca-4d61-4&from=paste&height=319&id=u857d7790&name=image.png&originHeight=638&originWidth=1078&originalType=binary&ratio=1&rotation=0&showTitle=true&size=164001&status=done&style=none&taskId=u1232677e-2401-4e55-ac8d-eab1f816916&title=%E5%9B%BE%201-1%EF%BC%9A%E6%89%80%E6%9C%89%E7%9A%84%20JavaScript%20%E7%A8%8B%E5%BA%8F%E9%83%BD%E6%98%AF%20TypeScript%20%E7%A8%8B%E5%BA%8F%EF%BC%8C%E6%89%80%E6%9C%89%E7%9A%84%20TypeScript%20%E7%A8%8B%E5%BA%8F%E5%B9%B6%E9%9D%9E%E6%98%AF%20JavaScript%20%E7%A8%8B%E5%BA%8F%E3%80%82&width=539 "图 1-1：所有的 JavaScript 程序都是 TypeScript 程序，所有的 TypeScript 程序并非是 JavaScript 程序。")
并不是说 TypeScript 不为普通 JavaScript 提供价值。它可以！例如下面的 JavaScript 代码：
```javascript
let city = 'new york city';
console.log(city.toUppercase());

// 当你运行它时将会抛出以下错误

// TypeError: city.toUppercase is not a function
```
该程序中没有类型注释，但 TypeScript 的类型检查器仍然能够发现问题：
```typescript
let city = 'new york city';
console.log(city.toUppercase());
               // ~~~~~~~~~~~ Property 'toUppercase' does not exist on type
               //             'string'. Did you mean 'toUpperCase'?
```
你不必告诉 TypeScript city 的类型是 `string:` 它是从初始值推断出来的。类型推断是 TypeScript 的关键部分，[第 3 章](https://www.yuque.com/xdda/ge8hhi/rh25hgsx658bezyk)探讨了如何很好地使用它。
TypeScript 类型系统的目标之一是检测将在运行时抛出异常的代码，而无需运行代码。当你听到 TypeScript 被描述为“静态”类型系统时，它指的就是这个。类型检查器不能总是发现会抛出异常的代码，但它会尝试。
即使你的代码没有抛出异常，它仍然可能不会按照您的意图进行。TypeScript 也试图捕捉其中的一些问题。例如，这个 JavaScript 程序：
```javascript
const states = [
  {name: 'Alabama', capital: 'Montgomery'},
  {name: 'Alaska', capital: 'Juneau'},
	{name: 'Arizona', capital: 'Phoenix'},
  // ...
];
for (const state of states) {
  console.log(state.capitol);
}

// log
// undefined
// undefined
// undefined
```
哎呀！什么地方出了错？该程序是有效的 JavaScript（因此也是 TypeScript）。它运行时没有抛出任何错误。但它显然没有达到你的预期。即使不添加类型注释，TypeScript 的类型检查器也能够发现错误（并提供有用的建议）：
```typescript
for (const state of states) {
  console.log(state.capitol);
                   // ~~~~~~~ Property 'capitol' does not exist on type
                   //         '{ name: string; capital: string; }'.
                   //         Did you mean 'capital'?
}
```
虽然即使你不提供类型注释，TypeScript 也可以捕获错误，但如果你提供类型注释，它就能更彻底的完成工作。这是因为类型注解告诉 TypeScript 你的意图是什么，这让它能够发现代码行为与你的意图不匹配的地方。例如，如果你在前面的例子中反转了 capital/capitol 的拼写错误会怎样？
```typescript
const states = [
  {name: 'Alabama', capitol: 'Montgomery'},
  {name: 'Alaska', capitol: 'Juneau'},
	{name: 'Arizona', capitol: 'Phoenix'},
  // ...
];
for (const state of states) {
  console.log(state.capital);
                   // ~~~~~~~ Property 'capital' does not exist on type
                   //         '{ name: string; capitol: string; }'.
                   //         Did you mean 'capitol'?
}
```
之前非常有用的错误现在完全错了！问题是你用两种不同的方式拼写了同一个属性，而 TypeScript 不知道哪一个是正确的。它可以猜测，但不一定总是正确的。解决方案是通过明确声明 `State` 类型来阐明你的意图：
```typescript
interface State {
  name: string;
  capital: string;
}
const states: State[] = [
{name: 'Alabama', capitol: 'Montgomery'},
                // ~~~~~~~~~~~~~~~~~~~~~
{name: 'Alaska', capitol: 'Juneau'},
  							// ~~~~~~~~~~~~~~~~~
{name: 'Arizona', capitol: 'Phoenix'},
								// ~~~~~~~~~~~~~~~~~~ Object literal may only specify known
               	//         properties, but 'capitol' does not exist in type
               	//         'State'.  Did you mean to write 'capital'?
// ...
];
for (const state of states) {
  console.log(state.capital);
}
```
现在错误与问题匹配，建议的修复是正确的。通过阐明我们的意图，你还帮助 TypeScript 发现了其他潜在问题。例如，在数组中只拼写错一次 capitol ，那么在之前的代码中就不会报错。但是用了类型注解后：
```typescript
const states: State[] = [
{name: 'Alabama', capital: 'Montgomery'},
{name: 'Alaska', capitol: 'Juneau'},
               // ~~~~~~~~~~~~~~~~~ Did you mean to write 'capital'?
{name: 'Arizona', capital: 'Phoenix'},
// ...
];
```
根据上文，我们可以在维恩图中添加一组新的程序：通过类型检查器的 TypeScript 程序（见图 1-2）。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/12390816/1676027245434-3b90782d-f90d-4873-9221-9ebe46bc1114.png#averageHue=%23e0e9f0&clientId=u5da513ca-4d61-4&from=paste&height=329&id=u717b7254&name=image.png&originHeight=658&originWidth=1610&originalType=binary&ratio=1&rotation=0&showTitle=true&size=241334&status=done&style=none&taskId=uc6437cf0-f007-43ba-b356-caa377b8bc8&title=%E5%9B%BE%201-2%EF%BC%9A%E6%89%80%E6%9C%89%20JavaScript%20%E7%A8%8B%E5%BA%8F%E9%83%BD%E6%98%AF%20TypeScript%20%E7%A8%8B%E5%BA%8F%E3%80%82%E4%BD%86%E6%98%AF%E5%8F%AA%E6%9C%89%E4%B8%80%E4%BA%9B%20JavaScript%EF%BC%88%E5%92%8C%20TypeScript%EF%BC%89%E7%A8%8B%E5%BA%8F%E9%80%9A%E8%BF%87%E4%BA%86%E7%B1%BB%E5%9E%8B%E6%A3%80%E6%9F%A5%E5%99%A8%E3%80%82&width=805 "图 1-2：所有 JavaScript 程序都是 TypeScript 程序。但是只有一些 JavaScript（和 TypeScript）程序通过了类型检查器。")
如果“TypeScript 是 JavaScript 的超集”的说法对你来说是错误的，那可能是因为你正在考虑图表中的第三组程序。在实践中，这是与使用 TypeScript 的日常体验最相关的。通常在你使用 TypeScript 中，你尝试保持你的代码通过所有的类型校验。
TypeScript 的类型系统模拟 JavaScript 的运行时行为。如果你来自具有更严格运行时检查的语言，这可能会带来一些惊喜。例如：
```javascript
const x = 2 + '3'; // Ok, type is string
const y = '2' + 3; // Ok, type is string
```
这些语句都通过了类型检查器，尽管它们有问题，并且确实会在许多其他语言中产生运行时错误。但这模拟了 JavaScript 的运行时行为，其中两个表达式都会产生字符串“23”。
不过，TypeScript 在某个地方划清了界线。类型检查器在所有这些语句中标记问题，即使它们在运行时不会抛出异常：
```typescript
const a = null + 7; // Evaluates to 7 in JS
       // ~~~~ Operator '+' cannot be applied to types ...
const b = [] + 12; // Evaluates to '12' in JS
			 // ~~~~~~~ Operator '+' cannot be applied to types ... 
alert('Hello', 'TypeScript'); // alerts "Hello"
            // ~~~~~~~~~~~~ Expected 0-1 arguments, but got 2
```
TypeScript 类型系统的指导原则是它应该对 JavaScript 的运行时行为进行模拟。但是在所有的例子中，TypeScript 认为奇怪的用法比开发人员的意图更有可能是错误的结果，因此它超越了模拟运行时行为。我们在 capital/ capitol 示例中看到了另一个这方面的例子，其中程序没有抛出异常（它记录了 undefined），但类型检查器仍然标记错误。
TypeScript 如何决定何时对 JavaScript 的运行时行为进行模拟，以及何时超越它？归根结底，这是一个品味问题。通过采用 TypeScript，你相信构建它的团队的判断力。如果你喜欢添加 null 和 7 或 [] 和 12，或调用具有多余参数的函数，那么TypeScript 可能不适合你！
如果你的程序有类型检查，它仍然可以在运行时抛出错误吗？答案是“是”。这里有一个例子：
```javascript
const names = ['Alice', 'Bob'];
console.log(names[2].toUpperCase());
```
当你运行时，它会抛出：
    TypeError: Cannot read property 'toUpperCase' of undefined
TypeScript 假设数组访问会在边界内，但它不是。结果是意料之外的。
当你使用 any 类型时，也经常会出现未捕获的错误，我们将在[条目 5](https://www.yuque.com/xdda/ge8hhi/my56ulylxa8351ga) 和[第 5 章](https://www.yuque.com/xdda/ge8hhi/khe0gdfhz2y73v4g)中更详细地讨论这些错误。
这些异常的根本原因是 TypeScript 对值类型和现实的理解存在分歧。一个可以保证其静态类型准确性的类型系统被称为健全的。TypeScript 的类型系统非常不健全，也从未打算如此。如果稳固对你很重要，你可能想看看其他语言，比如 Reason 或 Elm。虽然这些确实为运行时安全提供了更多保证，但这是有代价的：不是 JavaScript 的超集，因此迁移将更加复杂。
## 值得注意的事情

- TypeScript 是 JavaScript 的超集。换句话说，所有 JavaScript 程序都是 TypeScript 程序。TypeScript 有自己的语法，因此 TypeScript 程序 通常不是有效的 JavaScript 程序。
- TypeScript 添加了一个类型系统，可以模拟 JavaScript 的运行时行为，并尝试发现将在运行时抛出异常的代码。但是你不能指望它标记每一个异常。代码可以通过类型检查器，但仍然可能在运行时抛出异常。
- 虽然 TypeScript 的类型系统在很大程度上模拟了 JavaScript 行为，存在 JavaScript 允许一些结构，但 TypeScript 选择禁止，例如参数数量错误的调用函数。这在很大程度上是品位问题。
