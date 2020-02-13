// a.js

// 定义模块传入三个参数
// 当在a模块中需要引用b模块，那么直接调用require这个方法加载b模块，拿到的就是b的接口对象
// 在a中对外导出的接口对象，直接通过exports这个对象来对外导出，
// 给这个对象上扩展一个Hello方法，在别的模块中加载a，拿到的就是这个exports的引用
define(function(require, exports, module) {
	var b = require("b");
	console.log(b);

	exports.Hello = function() {
		console.log("hello work");
	};
});
