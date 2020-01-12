# 你不知道的Javascript

#### 一、作用域和闭包

**JS程序执行经历的三个步骤**

分词/词法分析：将字符串分解成词法单元

解析/语法分析：将词法单元转换成程序语法树

代码生成：将语法树转换成可执行代码

<br>

**LHS 查询和 RHS 查询**

例子：
```js
function add(a) {
    var b = a;
    return a + b;
}
var c = add(2);
```
其中，LHS 查询是 `c=`、`a=2` 和 `b = ..`，RHS查询为 `add()`、`= a`、`a..` 和 `..b`。

<br>

**ReferenceError 和 TypeError**

ReferenceType 是RHS无法查询到作用域的变量时报错，TypeError 是类型操作异常时报错（例如给一个数字类型执行调用函数操作）。

<br>

**闭包**

先看下面的一段代码：

```js
function foo() {
    var a = 2;
    function bar() {
        console.log(a);
    }
    return bar;
}
var baz = foo();
baz();      // 2
```

::: tip 提示
在 foo() 执行后，由于引擎的垃圾回收器释放不再使用的内粗空间，通常会期待 foo() 的整个内部作用域被销毁。但因为 bar() 在 foo() 内部声明，使得 foo() 在调用完后其内部作用域依然存在，以供 bar() 在之后任何时间进行引用。
:::

bar() 依然持有对该作用域的引用，这个引用就叫 **闭包** 。

个人理解就是，通过函数调用，外部作用域持有对函数内部的局部作用域的引用，使局部作用域的内存空间不能消失，而这块局部作用域对于外部作用域是封闭的，所以叫做闭包。

<br>

**通过闭包实现的模块机制**

```js
var myModule = (function() {
    var modules = {};

    function define(name, deps, impl) {
        for (let i = 0; i < deps.length; i++) {
            deps[i] = modules[deps[i]];
        }
        modules[name] = impl.apply(impl, deps);
    }

    function get(name) {
        return modules[name];
    }

    return {
        define: define,
        get: get
    }
})();

myModule.define("bar", [], function() {
    function hello(who) {
        return "Let me introduce：" + who;
    }
    return {
        hello: hello
    }
});

// 把foo依赖模块通过数组转换成参数传入
myModule.define("foo", ["bar"], function(bar) {
    function awesome(who) {
        console.log(bar.hello("hippo").toUpperCase() );
    }
    return {
        awesome: awesome
    }
});

var bar = myModule.get("bar");
console.log(bar.hello("xk"));       // Let me introduce：xk
var foo = myModule.get("foo");
foo.awesome();                      // LET ME INTRODUCE：HIPPO
```

<br>

#### 二、this和对象原型

**this绑定规则**

(1) 默认绑定

函数直接使用不带任何修饰的函数引用进行调用，只能是 **默认绑定**。

```js
// 1、非严格模式下
function fn() {
    console.log(this.a);    // 2，默认绑定
}
var a = 2;
fn();


// 2、运行在严格模式下
function fn() {
    "use strict";
    console.log(this.a);    // undefined
}
var a = 2;
fn();


// 3、调用在严格模式下
function fn() {
    console.log(this.a);    // 2，不影响默认绑定
}
var a = 2;
(function() {
    "use strict";
    fn();
})();
```

这里要注意一个细节，只要 `fn()` 运行在非严格模式下，默认绑定就会绑定到全局对象，严格模式下调用则不影响。


（2.1）隐式绑定

当函数引用有上下文对象时，隐式绑定规则就会把函数绑定中的 `this` 绑定到上下文对象。

```js
function fn() {
    console.log(this.a);
}
var obj = {
    a: 2,
    fn: fn
}
obj.fn();       // 2
```

（2.2） 隐式丢失

```js
function fn() {
    console.log(this.a);
}
var obj = {
    a: 2,
    fn: fn
}
var otherFn = obj.fn;
otherFn();          // 变成默认绑定
```

这里，otherFn 是 obj.fn 的一个引用，但实际上它引用的是 fn 函数本身，此时的 fn() 其实是一个不带任何修饰符的函数调用，因此应用的是默认绑定，`this` 绑定视乎是否严格模式。

另一情况发生在传入回调函数时（参数传值就是一种隐式赋值）：

```js
function foo() {
    console.log(this.a);
}

function callback(fn) {
    fn();       // 其实引用的是 foo
}

var obj = {
    a: 2,
    foo: foo
}
var a = "global a";
callback(obj.foo);      // global a
```

由于在 `callback(obj.foo)` 中的 `obj.foo` 还是对 `foo` 的一个引用，所以 调用 `fn()`，其实就是直接调用 `foo` 函数，所以 `this` 还是指向全局变量。

（3.1）显示绑定

javascript 中提供了两个方法（`apply` 和 `call`）给我们显式绑定到一个对象上。

```js
function fn() {
    console.log(this.a);
}
var obj = {
    a: 2
}
fn.call(obj);       // 2
```

这两个方法的第一个参数是一个对象，是给 this 准备的，用于在调用函数时将其绑定到 this（你想要绑定到的对象上）。如果你传入了一个原始值（字符串、数字或者布尔类型），那么这个原始值会被转换为对象形式（new String()、new Number()、new Boolean()）。

::: tip 提示
`apply` 和 `call` 在绑定 `this` 上都是一样的，它们的区别体现在其他参数上，以后再详细介绍。
:::

（3.2）硬绑定

显示绑定的一个变种。

```js
function fn() {
    console.log(this.a);
}

var obj = {
    a: 2,
    fn: fn
}

var foo = function () {
    fn.call(obj);
}
foo();                      // 2
setTimeOut(foo, 100);       // 2
foo.call(window);           // 2
```

这里我们通过一个函数 `foo` 强制把 `fn` 的调用绑定到 `obj`，之后无论怎么调用 `foo`，都会执行这个强制绑定操作，我们称之为 **硬绑定**。

::: tip 提示
由于`硬绑定`是一种非常常用的模式，所以在 ES5 中提供了内置方法。`Function.prototype.bind`，用法如下：
:::

```js
function foo(something) {
    console.log(this.a, something);
    return this.a + something;
}
var obj = {
    a: 2
}
var bar = foo.bind(obj);
var b = bar(3);         // 2 3
console.log(b);         // 5
```

这里说一下上面例子中的 `bind` 的实现原理是：（实际上ES5中的bind方法更复杂）

```js
Funtion.prototype.bind = function(obj) {
    var self = this;
    return function() {
        return self.apply(obj, arguments);
    }
}
```

（4）new 绑定

使用 new 来调用 fn() 时，会构造一个新对象并把它绑定到 fn()调用中的this。

```js
function fn(a) {
    this.a = a;
}
var f1 = new fn(2);
console.log(f1.a);      // 2;
```

（5）判断 `this`

通过对比绑定的优先级，在判断当前 `this` 时，可按照以下步骤：

1. 函数是否在 new 中调用，如果是，`this` 绑定到 `new` 的对象；

2. 函数是否通过 `call、apply`（显示调用）或者硬绑定调用，如果是， `this` 绑定到指定的对象（第一个参数）；

3. 函数是否在某个上下文对象中调用（隐式绑定），如果是，`this` 绑定到上下文对象；

4. 如果以上都不是，那么就是默认绑定。如果在严格模式下运行，则绑定到 `undefined`，否则绑定到全局对象。

