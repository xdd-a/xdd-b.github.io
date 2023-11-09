---
title: 线性结构
date: 2023/10/17
author: senmu
---

线性结构包括有：数组、链表、栈、队列。接下来我们依次通过代码实现下。

## 数组

数组在内存中是以连续的空间存储的，并且该空间是固定的；说到这里前端的同学可能就会疑惑了，明明在 JS 中数组不是固定大小的，这是因为 JS 底层默认内置了「可扩展数组」。

对于数据结构的功能不外乎就是：访问数据、插入/增加数据、编辑/修改数据、删除数据。

### 访问数据

因为数组在内存的存储是连续的空间，所以访问数据可以很轻松的完成，也就是给定数组存储的内存地址（首位元素地址）与索引值便可以轻松访问所有数据。

### 插入/增加数据

因为数组存储的特性，在插入数据时需要“牵动”其他数据，比如我们想要在下标为“1”位置插入一个元素，那么对应该位置之后的每一位数据必须向后移动一位。

```ts
function insert(nums: number[], num: number, index: number) {
  for (let i = nums.length - 1; i > index; i--) {
    // 将下标 index 及之后的每一个元素向后移动一位
    nums[i] = nums[i - 1];
  }
  // 将新元素插入到下标 index 位置
  nums[index] = num;
}

// 给数组 [1, 3, 2, 4, 0] 下标 “1” 的位置插入数字 2
insert([1, 3, 2, 4, 0], 2, 1)
```

### 编辑/修改数据

该部分也比较简单，与访问数据类似，只不过多了一步赋值操作。

### 删除数据

因为数组的特效，在删除数据时需要“牵动”其他数据，比如我们想要删除下标“1”位置的元素，那么对应该位置之后的每一个数据必须向前移动一位。

```ts
function delete(nums: number[], index: number) {
  for (var i = index; i < nums.length - 1; i++) {
    nums[i] = nums[i + 1]
  }
}

// 删除数组 [1, 3, 2, 4] 下标 “1” 的位置的数据
delete([1, 3, 2, 4], 1)
```

### 小结

总的来看，数组的访问和编辑数据的效率是最高的，而对于插入和删除数据的效率不仅很低还会造成**数据丢失**和**内存浪费**的情况。

优点：

* 支持随机访问
* 空间效率高：由于在内存中是以连续空间存储，无需额外的结构开销
* 局部缓存性：当访问数组元素时，计算机不仅会加载它，还会缓存其周围的其他数据，从而借助高速缓存来提升后续操作的执行速度。

> 「局部缓存性」局部性原理认为，程序在任意时刻倾向于访问附近的内存位置，而不是随机地访问内存中的任意位置。这种倾向性，我们称之为局部性原理，是一个持久的概念，对于硬件和软件系统的设计和性能都有着极大的影响。
局部性原理有两种形式，时间局部性和空间局部性。在一个具有良好时间局部性的程序中，被引用过一次的存储器在不远的将来会被再次引用。在一个具有良好空间局部性的程序中，如果一个存储器位置被引用了一次，那么程序很可能在不远的将来引用附近的一个存储器的位置。

当然，数组也有自己的缺点：

* 插入与删除效率低
* 长度不可变
* 空间浪费与数据丢失

典型应用：

* 数据随机访问
* 数据排序与搜索
* 查找表
* 机器学习
* 其他数据结构的实现

## 链表

由于链表的设计，它在内存中的存储不必是连续的空间，而是通过“引用”连接彼此；这样就意味着它比数组更适合存储需要大空间的数据，因为内存中连续的空间很有限，而非连续空间的优势就体现出来了。

### 初始化链表

```ts
/**
 * 初始化一个链表：1->3->2->5->4
 */
class ListNode {
  constructor(val?: number, next?: ListNode) {
    this.val = val || 0
    this.next = next || null
  }
}
const n1 = new ListNode(1)
const n2 = new ListNode(3)
const n3 = new ListNode(2)
const n4 = new ListNode(5)
const n5 = new ListNode(4)
n1.next = n2
n2.next = n3
n3.next = n4
n4.next = n5
```

### 访问数据

```ts
// 延用上面的链表 1->3->2->5->4，我们想要访问 2 
function findNum(node: ListNode, target: number) {
  let index = 0
  while(node) {
    if (node.val === target) return node.val
      node = node.next
      index += 1
    }
  return -1
}

// 沿用上面初始化的链表
findNum(n1, 2)

```

### 插入/添加数据

直接插入数据即可

### 删除数据

直接删除数据即可

### 小结

基本上链表与数据的特性是相对的，即链表的数据插入与删除效率很高但是访问数据的效率很低。

分类：
* 单向链表
* 环形链表 — 头尾相连
* 双向链表 — 一个节点同时知道前继节点和后继节点

典型应用：
* 单向链表通常用于*栈*、*队列*、*哈希表*、*图*的实现
* 环形链表通常用于*时间片轮转调度算法*、*数据缓冲区*、*循环播放器*
* 双向链表通常用于*LRU*、*浏览器历史*

> **时间片轮转调度算法**是一个操作系统中常用的算法，它的基本思想是将可用的 CPU 时间分割成多个时间片，然后将时间片分配给就绪中的队列，这样便于每个时间片被公平的使用。

## 栈

简单来讲就是叠盘子，想放下的盘子在下面想要拿到最下面的盘子必须先把上面的盘子拿下去。也就是我们常说的**先入后出**。

### 数组实现栈：

```ts
// 比如，我们将 1、2、3、4 依次压入栈中
const stack = []
// 入栈
stack.push(1) // 压入 1
stack.push(2) // 压入 2
stack.push(3) // 压入 3
stack.push(4) // 压入 4

// 出栈
stack.pop() // 取出 4
stack.pop() // 取出 3
stack.pop() // 取出 2
stack.pop() // 取出 1

// 栈长度
stack.length
// 栈顶
stack[stack.length - 1]
// 栈底
stack[0]

// 换种形式：
class ArrayStack {
  // 栈数组
  private stackArr: Array<number>

  constructor() {
    this.stackArr = []
  }

  get size() {
    return this.stackArr.length
  }

  isEmpty() {
    return this.size === 0
  }

  push(val: number) {
    this.stackArr.push(val)
  }

  pop() {
    if (this.isEmpty()) throw Error('栈为空')
    return this.stackArr.pop()
  }

  top() {
    if (this.isEmpty()) throw Error('栈为空')
    return this.stackArr[this.size - 1]
  }

  toArray() {
    return this.stackArr
  }

}
```

### 链表实现栈：

```ts
// 栈是先入后出，所以链表的头节点应该是栈顶，意味着数据压入栈时需要改变原先链表的指向
class LinkedStack {
  // 记录栈长度
  private stackSize: number
  // 链表节点
  private stackNode: ListNode | null

  constructor() {
    this.stackNode = null
    this.stackSize = 0
  }

  // 获取栈长度
  get size() {
    return this.stackSize
  }

  // 入栈
  push(num: number) {
    const node = new ListNode(num)
    node.next = this.stackNode
    this.stackNode = node
    this.stackSize += 1
  }
  // 出栈
  pop() {
    const num = this.peek()
    this.stackNode = this.stackNode.next
    this.stackSize--
    return num
  }
  // 访问栈顶元素
  peek() {
    if (!this.stackNode) throw Error("stack not found")
    return this.stackNode.val
  }
  // 将链表转化为数组
  toArray() {
    const node = this.stackNode
    const arr = new Array(this.stackSize)
    for (let i = arr.length - 1; i >= 0; i--) {
      arr[i] = node.val
      node = node.next
    }
    return arr
  }
}
```

## 队列

队列在实际生活中也可以当作是排队买奶茶，先排的人先买后排的人后买。**先入先出**。

从代码实现角度来看，队列和栈思路刚好相反，同样，我们分别用链表和数组实现下队列。

### 数组实现队列

```ts
class ArrayQueue {
  // 队列数组
  private queueArr: Array<number>
  // 队首指针
  private front: number = 0
  // 数组长度/队尾指针
  private queueSize: number = 0

  constructor(capacity: number) {
    // 初始化固定长度的数组
    this.queueArr = new Array(capacity)
  }

  // 获取数组容量
  get capacity() {
    return this.queueArr.length
  }

  // 获取数组队列长度
  get size() {
    return this.queueSize
  }

  // 队列是否为空
  isEmpty() {
    return this.size === 0
  }

  // 往队尾添加数据
  push(val: number) {
    if (this.size === this.capacity) {
      throw Error('队列已满，稍等再添加～')
    }
    const rear = (this.front + this.size) % this.capacity
    this.queueArr[rear] = val
    this.queueSize++
  }

  pop() {
    const num = this.peek()
    this.front = (this.front + 1) % this.capacity
    this.queueSize--
    return num
  }

  peek() {
    if (this.isEmpty()) throw Error('队列为空')
    return this.queueArr[this.front]
  }

  toArray() {
    const arr = new Array(this.size)
    for (let i = 0, j = this.front; i < this.size; i++, j++) {
      arr[i] = this.queueArr[j % this.capacity]
    }
    
    return arr
  }

}
```

### 链表实现队列

链表的空间要求不高反而只需要关心队列的逻辑就好（先进先出）。

```ts
class LinkQueue {
  // 首节点
  private front: ListNode | null
  // 尾节点
  private rear: ListNode | null
  // 队列长度
  private queueSize: number = 0

  constructor() {
    this.front = null
    this.rear = null
  }

  get size() {
    return this.queueSize
  }

  isEmpty() {
    return this.size === 0
  }

  push(val: number) {
    const node = new ListNode(val)
    if (this.rear) {
      // 如果存在尾节点，就将当前的尾节点的下个节点指向新的尾节点
      this.rear.next = node
    } else {
      // 如果不存在尾节点，说明为空队列，则设置首节点
      this.front = node
    }
    // 不管如何都更新尾节点
    this.rear = node
    this.queueSize++
  }

  pop() {
    const head = this.peek()
    this.front = head.next
    this.queueSize--
    return head.val
  }

  // 访问首元素
  peek() {
    if (this.isEmpty()) {
      throw Error('队列为空，先添加数据进来吧～')
    }
    return this.front
  }

  toArray() {
    let node = this.peek()
    const arr = new Array(this.queueSize)
    for (let i = 0; i < this.queueSize; i++) {
      arr[i] = node.val
      node = node.next
    }
    return arr
  }
}
```