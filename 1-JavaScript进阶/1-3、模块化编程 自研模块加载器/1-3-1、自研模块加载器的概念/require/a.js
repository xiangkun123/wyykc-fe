// 通过define声明依赖模块b，在回调中就可以输出b导出的接口对象
define(["b"], function(b) {
	console.log(b);
	var Hello = function() {
		console.log("hello work");
	};

	// 暴露的接口对象
	return {
		Hello: Hello,
	};
});
