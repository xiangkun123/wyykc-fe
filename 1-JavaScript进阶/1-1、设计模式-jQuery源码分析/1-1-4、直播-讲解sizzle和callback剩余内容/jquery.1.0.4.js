(function(root) {
	var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;

	var jQuery = function(selector, context) {
		/**
		 * 直接 return new jQuery 不合理，因为会进入死循环，所以曲线实现，通过 return jQuery.prototype.init() 方法，
		 * 让 jQuery.prototype.init 和 jQuery 共享原型对象
		 */
		return new jQuery.prototype.init(selector, context);
	};

	// jQuery 原型对象
	jQuery.fn = jQuery.prototype = {
		// 设置原型对象上的属性
		length: 0,
		selector: "",

		// selector 选择器 context: 从哪开始查找
		init: function(selector, context) {
			context = context || document;
			var match,
				elem,
				index = 0;

			// 如果没传selector返回空对象
			if (!selector) {
				return this;
			}

			// 如果是字符串（'<a>' 或者 #a）
			if (typeof selector === "string") {
				// 如果是节点字符串（形如 '<a>'），那就创建节点
				if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
					match = [selector];
				}

				// 创建DOM节点
				if (match) {
					/**
					 * merge: 合并数组的方法
					 * this: jQuery实例对象 => init: {}
					 * jQuery.parseHTML() 方法返回创建元素的数组 => [DOM节点]
					 */
					jQuery.merge(this, jQuery.parseHTML(selector, context));

					// 查询DOM节点
				} else {
					elem = document.querySelectorAll(selector); // 通过 querySelectorAll() 查找所有的节点类数组NodeList
					var elems = Array.prototype.slice.call(elem); // 将类数组NodeList转为真的数组[]
					this.length = elems.length; // jQuery对象的长度设为数组的长度
					for (; index < elems.length; index++) {
						// 将数组的每一项设给jQuery对象
						this[index] = elems[index];
					}
					this.context = context; // 设置jQuery对象的context属性
					this.selector = selector; // 设置jQuery对象的selector属性
				}

				// 如果是DOM元素，设置jQuery对象的第一项为DOM元素且长度为1
			} else if (selector.nodeType) {
				this.context = context;
				this[0] = selector;
				this.length = 1;

				// 如果是函数
			} else if (jQuery.isFunction(selector)) {
				rootjQuery.ready(selector); // 实例对象方法
			}
		},
		css: function() {
			console.log("css");
		},
		ready: function(fn) {
			// 检测DOM是否加载完成，通过监听事件绑定到jQuery对象的ready事件函数，那么这里就需要扩展一个jQuery对象的ready方法
			document.addEventListener("DOMContentLoaded", jQuery.ready, false);
			// 判断当前页面是否已经加载了（加载了才会调用jQuery.ready方法，isready才会为true），如果加载完毕就调用该函数，否则就存储到readylist中
			if (jQuery.isready) {
				fn.call(document);
			} else {
				jQuery.readylist.push(fn);
			}
		},
	};

	// jQuery.fn.extend 和 jQuery.extend 都是调用的同一个扩展函数
	jQuery.fn.extend = jQuery.extend = function() {
		// 这里必须保证第一个参数必须是对象{}类型
		var target = arguments[0] || {};
		var length = arguments.length;
		var i = 1;
		var deep = false;
		var option, key, copy, src, copyIsArray, clone;

		// 判断第一个值是否是一个布尔值
		if (typeof target === "boolean") {
			deep = target;
			target = arguments[1];
			i = 2;
		}

		// 如果target不是对象, 那就让他变成对象
		if (target === null || typeof target !== "object") {
			target = {};
		}

		// 参数的个数，如果是一个就是扩展jQuery(获取下标为0的值)，两个就是扩展任意对象跳过此操作
		if (length === i) {
			target = this;
			i--;
		}

		// 遍历后面的参数（浅拷贝）  => 深拷贝
		for (; i < length; i++) {
			// 判断option是否有值
			if ((option = arguments[i]) != null) {
				for (key in option) {
					copy = option[key];
					src = target[key];
					// 是否深拷贝
					if (deep && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
						// 判断copy是否是数组
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];
						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}
						target[key] = jQuery.extend(deep, clone, copy);

						// 不是深拷贝同时copy有值的话，copy的值赋给target
					} else if (copy != undefined) {
						target[key] = copy;
					}
				}
			}
		}
		return target;
	};

	// 让 jQuery.prototype.init 和 jQuery 共享原型对象
	jQuery.fn.init.prototype = jQuery.fn;

	// 给jQuery扩展方法
	jQuery.extend({
		// 是否是对象
		isPlainObject: function(obj) {
			return toString.call(obj) === "[object Object]";
		},

		// 是否是数组
		isArray: function(obj) {
			return toString.call(obj) === "[object Array]";
		},

		// 是否是函数
		isFunction: function(obj) {
			return toString.call(obj) === "[object Function]";
		},

		// 合并数组
		merge: function(first, second) {
			var l = first.length, // 一般情况下这个就是0
				r = second.length,
				j = 0;

			// second长度存在且不是任意类型值
			if (typeof r === "number") {
				for (; j < r; j++) {
					first[l++] = second[j];
				}

				// 如果second的长度不是数字，不能通过for循环，那就用while
			} else {
				while (second[j] !== undefined) {
					first[l++] = second[j++];
				}
			}

			// 把最终的长度赋值给first.length
			first.length = l;

			return first;
		},

		// 解析创建DOM节点的方法
		parseHTML: function(data, context) {
			// 判断selector传的是否是字符串，不是一律返回 null
			if (!data || typeof data !== "string") {
				return null;
			}

			// 对传递的字符串通过正则提取标签名（'<a>' => 'a', 通过 createElement()创建）
			var parse = rejectExp.exec(data);
			var dom = context.createElement(parse[1]); // <a></a>
			return [dom];
		},

		// 当前的DOM默认是没有被加载
		isready: false,
		// 回调列表[...cb]
		readylist: [],
		// DOM加载解析完后执行的方法
		ready: function() {
			jQuery.isready = true;
			jQuery.readylist.forEach(function(callback) {
				callback.call(document);
			});
			jQuery.readylist = null;
		},
	});

	// jQuery内部要使用jQuery的实例对象的方法和属性，那么都让它指向这个 rootjQuery
	var rootjQuery = jQuery(document);

	root.jQuery = root.$ = jQuery;
})(window);
