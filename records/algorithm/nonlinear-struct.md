---
title: 非线性结构
date: 2023/10/31
author: senmu
---

非线性结构包括哈希表、树、堆、图。

## 哈希表

> 哈希表涉及到的基础性东西是哈希表的存储和哈希函数，其中核心点就是哈希函数。

可以想像一下图书管理员在图书馆中添加新书籍、查找新书籍的情景；在新书籍添加时会添加特定的编号然后按照编号存放在对应的位置，在需要查找某个书籍时找到书籍对应的编号然后根据编号找到对应位置。这其中正是运用哈希表的思想，哈希函数就是书籍与编号的对应关系，存储就是书籍存放的位置；通过编号与书籍的映射关系便于管理与查找书籍的效率。

所以，哈希表其实就是 `data` 通过数组存储在某个空间，找到 `key` 与 `data` 间的映射关系（哈希函数），然后根据映射关系对于数据进行操作。

举个例子：有 A 班级，每个同学都有学号与姓名，那么我们就可以设计一个哈希表来让学号与姓名对应存储。

```ts
/***
 * 数据如下：
 * 学号|12836|15937|16750|13276|10583|
 * 姓名| 小明 | 小红 | 小白 | 小吕 | 张三 |
*/

/**
 * 简单设计：
 * 存储：采用数组来存储学号与姓名的完整数据，存储的位置由哈希函数对应的关系来存储
 * 哈希函数：hash(key) % capacity
 *  1. 通过某种哈希算法得到哈希值
 *  2. 将哈希值对应数组容量取模，从而得到该 key 对应 的 index
*/

// 根据数据设计数组容量为 100，哈希函数为 key % 100 得到的数值当作数组下标进行存储管理

// 键值对
class Pair {
  public key: number
  public value: string

  constructor(key: number, value: string) {
    this.key = key
    this.value = value
  }
}

// 利用数组简单的实现哈希表
class ArrayHashMap {
  // 存储总数据的数组
  private hashArr: Array<Pair | null>

  constructor() {
    this.hashArr = new Array(100).fill(null)
  }

  // 哈希函数
  private hashFunc(key: number) {
    return key % 100
  }

  // 获取数据
  public get(key: number) {
    const index = this.hashFunc(key)
    const pair = this.hashArr[index]
    return pair ? pair.value : null
  }

  // 添加数据
  public set(key: number, value: string) {
    const index = this.hashFunc(key)
    this.hashArr[index] = new Pair(key, value)
  }

  // 删除数据
  public delete(key: number) {
    const index = this.hashFunc(key)
    this.hashArr[index] = null
  }

  // 获取所有的键值对
  public entries() {
    const arr = []
    for (let i = 0; i < this.hashArr.length; i++) {
      if (this.hashArr[i]) {
        arr.push(this.hashArr[i])
      }
    }
    return arr
  }

  // 获取所有键
  public keys() {
    const arr = []
    for (let i = 0; i < this.hashArr.length; i++) {
      const bucket = this.hashArr[i]
      if (bucket && bucket.key) {
        arr.push(bucket.key)
      }
    }
    return arr
  }

  // 获取所有值
  public keys() {
    const arr = []
    for (let i = 0; i < this.hashArr.length; i++) {
      const bucket = this.hashArr[i]
      if (bucket && bucket.value) {
        arr.push(bucket.value)
      }
    }
    return arr
  }
}

```

### 哈希冲突

上面的简单实现可能存在**哈希冲突**的时候，比如学号 15136、24336。

当然，如果遇到了冲突的情况我们可以选择**哈希扩容**的方式，不过这种方式过于简单粗暴，而且性能也不好，所以一般情况下我们遇到冲突会先使用策略来保证冲突存在也不影响我们正常操作，当冲突达到一定阈值才会进行扩容。

下面一起来看看可以解决**哈希冲突**的策略。

#### 链式地址

在原始的哈希表存储时是一个“桶”存储一条数据，这样很容易遇到哈希冲突的问题，将存储改为链式地址的方式就可以解决该问题。但是要注意哈希冲突如果过多那么性能将会变得极差，所以需要设置一个合理的阈值超过该值的话就需要进行扩容。
