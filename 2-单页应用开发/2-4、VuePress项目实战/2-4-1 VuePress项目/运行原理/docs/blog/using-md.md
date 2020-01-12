---
title: markdown写法
lang: en-US
tag: markdown
---

# markdown 写法

## 1、标题

示例代码：

```
# 标题一
## 标题二
### 标题三
#### 标题四
##### 标题五
```

效果：

# 标题一

## 标题二

### 标题三

#### 标题四

##### 标题五

## 2、列表

列表分为有序列表和无序列表

<!-- more -->

**无序列表**示例代码：

```
- 苹果
- 香蕉
- 梨子
```

效果：

- 苹果
- 香蕉
- 梨子

**有序列表**示例代码：

```
1. 苹果
2. 香蕉
3. 梨子
```

效果：

1. 苹果
2. 香蕉
3. 梨子

## 3、表格

示例代码：

```
| 名称 | 价格 | 重量
|--    |  -- |--
| 苹果 | 4    | 1
| 香蕉 | 5    | 3
| 梨子 |  9   | 6
```

效果：
| 名称 | 价格 | 重量 |
| ---- | ---- | ---- |
| 苹果 | 4 | 1 |
| 香蕉 | 5 | 3 |
| 梨子 | 9 | 6 |

## 4、链接

示例代码：

```
[百度首页](http://www.baidu.com)
```

效果：
[百度首页](http://www.baidu.com)

## 5、图片

示例代码：

```
![vue](~@alias/static/imgs/hero.png)
```

效果:

![vue](~@alias/static/imgs/hero.png)

## 6、Emoji 图标

示例代码：

```
:tada: :100:
```

效果:

:tada: :100:

## 7、目录

```
[[toc]]
```

效果：
[[toc]]

## 8、自定义容器

示例代码：

```
::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a dangerous warning
:::
```

效果：
::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a dangerous warning
:::

## 9、语法高亮

vuepress 使用了 Prism 来为 markdown 实现语法高亮。你只需在代码块的开始倒勾中附加一个有效的语言别名。

没有设置之前示例代码：

```
function hello() {
  console.log("hello vuepress");
}
hello();
```

设置

````
``` javascript
function hello() {
  console.log("hello vuepress");
}
hello();
```
````

效果：

```javascript
function hello() {
  console.log("hello vuepress");
}
hello();
```

如果要给特定的行高亮，在语言别名后加上一个行数

````
``` javascript{2}
function hello() {
  console.log("hello vuepress");
}
hello();
```
````

效果：

```javascript{2}
function hello() {
  console.log("hello vuepress");
}
hello();
```

## 10、使用组件

所有在 .vuepress/components 中找到的 \*.vue 文件将会自动地被注册为全局的异步组件，如：

```
.
└─ .vuepress
   └─ components
      ├─ demo-component.vue
      ├─ OtherComponent.vue
      └─ Foo
         └─ Bar.vue
```

你可以在任意的 Markdown 文件中使用这些组件（组件名是通过文件名取到的）：

```
<demo-component />
<OtherComponent />
<Foo-bar />
```

效果：
<demo-component />
<OtherComponent />
<Foo-Bar />
