(function(root) {
	// 返回的是一个jQuery原型对象的init构造函数的实例化对象
	var jQuery = function() {
		return new jQuery.prototype.init();
	};

	// jQuery.fn就是jQuery原型对象的简写
	jQuery.fn = jQuery.prototype = {
		init: function() {},
		css: function() {},
	};

	// 给jQuery的原型对象和jQuery都扩展一个extend方法
	jQuery.fn.extend = jQuery.extend = function() {
		// 判断第一个参数是否传入，没有就创建一个对象
		var target = arguments[0] || {};
		// 获取参数长度
		var length = arguments.length;
		var i = 1;
		var option, name;
		// 用于判断当前是否是深拷贝
		var deep = false;
		var copy, src, copyIsArray, temp;

		// 如果第一个参数等于布尔值，为了不影响下面的逻辑，需要修改一下
		if (typeof target === "boolean") {
			deep = arguments[0];
			target = arguments[1];
			i = 2;
		}

		// 如果target不等于object类型，就创建一个对象赋给target
		if (typeof target !== "object") {
			target = {};
		}

		// 如果参数的个数是一个，那么就需要把this赋值target
		if (length === i) {
			target = this;
			i--;
		}

		for (; i < length; i++) {
			if ((option = arguments[i]) != null) {
				for (name in option) {
					copy = option[name]; // 要拷贝的对象的引用
					src = target[name]; // 目标对象的引用

					// 判断要拷贝的对象是否是数组或者对象
					if (deep && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
						if (copyIsArray) {
							// 如果是数组，给target初始化成数组
							copyIsArray = false;
							temp = src && jQuery.isArray(src) ? src : [];
						} else {
							// 如果是对象，给target初始化成对象
							temp = src && jQuery.isPlainObject(src) ? src : {};
						}

						// 最终再执行一次拷贝
						target[name] = jQuery.extend(deep, temp, copy);
					} else if (copy != undefined) {
						// 都不是直接替换
						target[name] = copy;
					}
				}
			}
		}

		return target;
	};

	// 给jQuery扩展一下类型检测方法
	jQuery.extend({
		isPlainObject: function(value) {
			return toString.call(value) === "[object Object]";
		},
		isArray: function(value) {
			return toString.call(value) === "[object Array]";
		},
	});

	// 共享原型对象
	jQuery.fn.init.prototype = jQuery.fn;

	root.$ = root.jQuery = jQuery;
})(this);
