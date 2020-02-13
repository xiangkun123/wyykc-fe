// 可以看到在b中是没有依赖任何的模块的，那么只需传入回调函数即可
define(function() {
	var name = "max";

	// 返回接口对象
	return {
		name: name,
	};
});
