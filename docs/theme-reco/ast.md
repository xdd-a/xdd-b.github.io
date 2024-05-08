---
title: 抽象语法树
date: 2024-05-06
---

::: info
- ast 中 type对照表
  - Program：代表整个 JavaScript 程序的根节点
  - FunctionDeclaration / FunctionExpression: 代表函数声明和函数表达式。
  - Identifier: 代表标识符，如变量名、函数名等。
  - VariableDeclaration / VariableDeclarator: 代表变量声明，其中 VariableDeclaration 是包含一个或多个 VariableDeclarator 的父节点。
  - Literal: 代表字面量，如数字、字符串、布尔值等。
  - CallExpression: 代表函数调用。
  - MemberExpression: 代表成员访问，如 object.property 或 object[method]。
  - BinaryExpression: 代表二元表达式，如 a + b 或 a > b。
  - UnaryExpression: 代表一元表达式，如 !a 或 ++b。
  - AssignmentExpression: 代表赋值表达式，如 a = b 或 a += b。
  - BlockStatement: 代表代码块，通常由大括号 {} 包围。
  - IfStatement: 代表 if 条件语句。
  - ForStatement / WhileStatement: 代表 for 循环和 while 循环。
  - DoWhileStatement: 代表 do...while 循环。
  - SwitchStatement: 代表 switch 语句。
  - CaseClause / DefaultClause: 代表 switch 语句中的 case 和 default 分支。
  - ReturnStatement: 代表 return 语句。
  - BreakStatement / ContinueStatement: 代表 break 和 continue 语句，用于控制循环的执行。
  - TryStatement / CatchClause / FinallyBlock: 代表 try...catch...finally 异常处理结构。
  - ThrowStatement: 代表 throw 语句，用于抛出异常。
  - DebuggerStatement: 代表调试器语句，用于断点调试。
  - ThisExpression: 代表 this 关键字。
  - ArrayExpression: 代表数组字面量。
  - ObjectExpression: 代表对象字面量。
  - Property: 代表对象字面量中的属性。
  - SpreadElement: 代表在数组或对象字面量中的扩展操作符 ...。
  - TemplateLiteral: 代表模板字符串。
  - TaggedTemplateExpression: 代表标签模板字符串。
  - ArrowFunctionExpression: 代表箭头函数。
  - ClassDeclaration / ClassExpression: 代表类声明和类表达式。
  - Super: 代表 super 关键字，用于调用父类方法。
  - ImportDeclaration / ExportNamedDeclaration / ExportDefaultDeclaration: 代表 ES6 模块的导入和导出语句。
:::

## 结构
```js
let text123456789;
text = "变量名长一点方便辨识"
{
  "type": "Program", // 表示这是一个程序的抽象语法树（AST）的根节点
  "body": [
    {
      "type": "VariableDeclaration", // 表示一个变量声明
      "declarations": [
        {
          "type": "VariableDeclarator", // 表示一个变量声明的具体内容
          "id": {
            "type": "Identifier", // 表示一个变量的名称
            "name": "text123456789" // 变量名
          },
          "init": null // 表示该变量没有初始值
        }
      ],
      "kind": "let" // 表示使用了 'let' 关键字进行变量声明
    },
    {
      "type": "ExpressionStatement", // 表示一个表达式语句
      "expression": {
        "type": "AssignmentExpression", // 表示一个赋值表达式
        "operator": "=", // 赋值操作符
        "left": {
          "type": "Identifier", // 表示左侧是一个变量
          "name": "text" // 变量名 'text'
        },
        "right": {
          "type": "Literal", // 表示右侧是一个字面量
          "value": "变量名长一点方便辨识", // 字面量值
          "raw": "'变量名长一点方便辨识'" // 字面量的原始表示形式
        }
      }
    }
  ],
  "sourceType": "module" // 表示这是一个模块类型的源代码
}
```

```js
var parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const ast = parser(code);

const check = {
    visitIdentifier(path){
        if(path.node.kind === "let"){
            path.node.kind = "const"
        }
    }
}

// 使用traverse遍历AST并应用访问器，也就是遍历并应用刚才那个 check 规则
traverse(ast, check);

// 使用generate根据修改后的AST生成新的代码
const output = generate(ast, {});

console.log(output.code);
```