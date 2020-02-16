模块化?

作用域    全局    window    局部   function   es6...  块作用域  ...


1:  命名冲突     obj    obj  ...,

2:  文件依赖    jQuery.xxx插件.js  依赖 jQuery.js,


<script src = "jQuery.xxx插件.js"></script>
<script src = "jQuery.js"></script>

<script src = "jQuery.js"></script>
<script src = "jQuery.xxx插件.js"></script>



全新的机制?

每一个文件(资源 || 组件 ...  脚本文件)当做一个独立的作用域

//b.js
require("a.js")     // 加载 || 依赖 ||  对外暴露的接口对象   {name:"max"}



本质    对象的命名空间
a.js    创建一个object对象  {}    扩展   name  xxxx    =>  对外暴露的接口对象  =>  exprots.name = "max"  

b.js    创建一个object对象  {}    扩展    add  xxxx    =>  对外暴露的接口对象


模块化 => 规范  =>   加载器  requirejs  seajs   startUp  node

var exprots = {}
exprots.name
exprots.add 



特别注意
副本   requirejs  seajs   startUp  node  
引用   es6  ....


function fn(){
	var self = {};
	return self;
}
fn()   副本
fn()   副本

es6
a.js    
exprots.name = "max"       {} => 对外暴露的接口对象

b.js
var obj = require("a.js");
obj.name = "remi"   //引用

c.js
var obj = require("a.js");
obj.name    //   "remi"



//同步的方式书写代码  异步的方式加载



植入概念       
面向对象
设计类  Module

this.uri = uri;             地址
this.deps = deps || [];     依赖
this.exports = null;        接口对象
this.status = 0;            状态码
this._waitings = {};        谁依赖了我
this._remain = 0;            我有几个依赖项



每一个模块都作为 Module  实例对象


1: 第一个Module  实例对象 (当前的项目),  虚拟 
当前的项目绝对路径地址    =>     uri
启动模块加载器是要加载的模块  => deps  ["a.js","b.js"]
this.exports  = null
this.status = 0
this._waitings = {}
this._remain = 2;            2  看deps.length


加载(当前的项目)Module  实例对象  deps 成员

1:  分析 a.js  b.js   路径  (资源定位)     => 加载,

 a.js 模块  Module  实例对象   实体
当前的a.js绝对路径地址   uri     资源的定位
你的依赖               deps  ["b.js"]  (空)
接口对象       this.exports  = xxx ||  {}
状态码         this.status = 0
this._waitings = {当前项目对应的绝对路径地址}   谁会依赖我  
 this._remain = 0;     看deps.length
 
 
 2:  依赖的分析,
 
 正则解析
 a.js
 
 define(function( require, exports, module){
 	var age = "30";
 	var b = require("b.js");    //异步的方式先提前加载好了 b.js      => 执行
 	console.log(b.sex);
 	exports.age = age;
 });

提取出来
function( require, exports, module){
 	var age = "30";
 	var b = require("b.js");    //异步的方式先提前加载好了 b.js      => 执行
 	console.log(b.sex);
 	exports.age = age;
 }
 
 变成字符串
 var REQUIRE_RE = /\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g
 分析 捕获 =>  require("b.js");   调用时的参数 "b.js"
 
 
 
 数据更新
 
 
  b.js 模块  Module  实例对象   实体
 当前的b.js绝对路径地址   uri
 你的依赖               deps  []  (空)
 接口对象       this.exports  = xxx ||  {}
 状态码         this.status = 0
 this._waitings = {当前项目对应的绝对路径地址, "a.js"}   谁会依赖我  
  this._remain = 0;     看deps.length
  
  
  define(function( require, exports, module){
  	var sex = "男";
  	return {
  		sex:sex,
  	}
  });
  
  
  //捕获  null   c.js
  
  
  所有模块都加载完毕
  
 
 