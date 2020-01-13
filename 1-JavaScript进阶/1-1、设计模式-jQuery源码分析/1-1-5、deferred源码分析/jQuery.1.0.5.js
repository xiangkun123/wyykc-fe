(function(root) {
	var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
	var optionsCache = {};

	// 通过 return jQuery.prototype.init() 方法，让 jQuery.prototype.init 和 jQuery 共享原型对象
	var jQuery = function(selector, context) {
		return new jQuery.prototype.init(selector, context);
	};

	// jQuery 原型对象
	jQuery.fn = jQuery.prototype = {
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

		// 创建、处理函数队列
		Callbacks: function(options) {
			var list = [];
			var index, length;
			// 用于记录fire是否执行过
			var setting = false;
			// 用于储存参数
			var memoryStore;
			// 调用的开始位置
			var start, starts;
			// 判断当前传入参数是否是字符串，判断是否已经存在该options
			var options = typeof options === "string" ? optionsCache[options] || createOptions(options) : {};

			// 执行时要判断是否存在 memory, 存在就存下来，下次add时传入
			var fire = function(data) {
				memoryStore = options.memory && data;
				index = starts || 0;
				setting = true;
				length = list.length;
				for (; index < length; index++) {
					if (list[index].apply(data[0], data[1]) === false && options.stopOnFalse) {
						break;
					}
				}
			};

			var self = {
				add: function() {
					start = list.length;
					var array = Array.prototype.slice.call(arguments);
					array.forEach(function(fn) {
						if (toString.call(fn) === "[object Function]") {
							if (!options.unique || !self.has(fn, list)) {
								list.push(fn);
							}
						}
					});

					if (memoryStore) {
						// 是否将start赋给starts，取决于是否执行过fire
						starts = start;
						start = 0;
						fire(memoryStore);
					}
					return this;
				},

				fireWith: function(context, arguments) {
					var data = [context, arguments];

					// 设置setting开关
					if (!(options.once && setting)) {
						fire(data);
					}
				},

				fire: function() {
					self.fireWith(this, arguments);
				},

				has: function(fn, array) {
					return Array.prototype.indexOf.call(array, fn) > -1;
				},
			};

			return self;
		},

		// 异步回调解决方案Deferred
		Deferred: function() {
			// 延迟对象的三种不同状态信息描述，每一个状态都有一个的队列
			var tuples = [
					["resolve", "done", jQuery.Callbacks("once memory"), "resolved"],
					["reject", "fail", jQuery.Callbacks("once memory"), "rejected"],
					["notify", "progress", jQuery.Callbacks("memory")],
				],
				state = "pending", // 初始状态
				promise = {
					state: function() {
						return state;
					},
					then: function() {
						//todo
					},
					promise: function(obj) {
						return obj != null ? jQuery.extend(obj, promise) : promise;
					},
				},
				// 最终返回的延迟对象deferred，是我们需要关注的重点：有哪些属性、方法
				deferred = {};

			tuples.forEach(function(tuple, i) {
				// 把tuples每一项的callbacks队列给到list，也就是把self对象的副本给到list，self有add\fireWith\fire方法
				var list = tuple[2],
					stateString = tuple[3]; // 最终状态的描述resolved/rejected

				// promise[ done | fail | progress ] = list.add 添加处理函数
				promise[tuple[1]] = list.add;

				// 如果stateString有值，才会添加第一个处理函数
				if (stateString) {
					list.add(function() {
						state = stateString;
					});
				}

				// deferred[ resolve | reject | notify ] 延迟对象的状态
				deferred[tuple[0]] = function() {
					deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
					return this;
				};

				// list.fireWith 调用队列中的处理函数并传参，绑定上下文对象
				deferred[tuple[0] + "With"] = list.fireWith;
			});

			promise.promise(deferred);

			return deferred;
		},

		//执行一个或多个对象的延迟对象的回调函数
		when: function(subordinate) {
			return subordinate.promise();
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

	// 创建一个option对象
	function createOptions(options) {
		var object = (optionsCache[options] = {});
		options.split(/\s+/).forEach(function(value) {
			object[value] = true;
		});
		return object;
	}

	// jQuery内部要使用jQuery的实例对象的方法和属性，那么都让它指向这个 rootjQuery
	var rootjQuery = jQuery(document);

	root.jQuery = root.$ = jQuery;
})(window);
