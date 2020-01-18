(function(root) {
	var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
	var optionsCache = {};
	var core_version = "1.0.6";

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	// activeElement 属性返回文档中当前获得焦点的元素。
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch (err) {}
	}

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
		expando: "jQuery" + (core_version + Math.random()).replace(/\D/g, ""),
		guid: 1, // 计数器
		now: Date.now, //返回当前时间距离时间零点(1970年1月1日 00:00:00 UTC)的毫秒数

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

		//类数组转化成正真的数组  
		markArray: function(arr, results) {
			var ret = results || [];
			if (arr != null) {
				jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
			}
			return ret;
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

		/**
		 * object 目标源
		 * callback 回调函数
		 * args 自定义回调函数参数
		 */
		each: function(object, callback, args) {
			// object 数组对象 || object对象
			var length = object.length;
			var name,
				i = 0;

			// 自定义callback的参数
			if (args) {
				if (length === undefined) {
					for (name in object) {
						callback.apply(object, args);
					}
				} else {
					for (; i < length; ) {
						callback.apply(object[i++], args);
					}
				}
			} else {
				if (length === undefined) {
					for (name in object) {
						callback.call(object, name, object[name]);
					}
				} else {
					for (; i < length; ) {
						callback.call(object[i], i, object[i++]);
					}
				}
			}
		},
	});

	// 数据仓库，用来存储数据
	function Data() {
		// jQuery.expando是jQuery的静态属性，对于jQuery的每次加载运行期间时唯一的随机数
		this.expando = jQuery.expando + Math.random();
		this.cache = {};
	}

	Data.uid = 1;

	Data.prototype = {
		key: function(elem) {
			var descriptor = {},
				unlock = elem[this.expando];

			if (!unlock) {
				unlock = Data.uid++;
				descriptor[this.expando] = {
					value: unlock,
				};
				// 直接在DOM元素对象上扩展一个或多个新的属性或者修改现有属性（这里是value），并返回该对象
				// unlock是打开这个数据仓库的钥匙，并且把这把钥匙挂载在对应的DOM元素的一个属性上；
				// 当要查找时，都会通过查找DOM属性上的expando的值来找到这把钥匙
				//（作为存储在有数据存储在数据仓库的凭证），再用钥匙去找到存储在数据仓库对应DOM的数据
				// DOM => jQuery106099315041772643650.423762697253796 = 1
				Object.defineProperties(elem, descriptor);
				// 打印出的DOM会存在这个值
				// console.log(elem);
			}

			// 确保缓存对象记录信息
			// 创建DOM元素的钥匙unlock在数据仓库对应的数据对象，如果没有就创建
			if (!this.cache[unlock]) {
				this.cache[unlock] = {};
			}

			return unlock;
		},

		get: function(elem, key) {
			// 找到或者创建缓存
			var cache = this.cache[this.key(elem)];
			// key 有值直接在缓存中取读
			return key === undefined ? cache : cache[key];
		},
	};

	var data_priv = new Data();

	// jQuery 事件模块
	jQuery.event = {
		//1: 利用 data_priv 数据缓存，分离事件与数据 2: 元素与缓存中建立 guid 的映射关系用于查找
		// elem这里是DOM元素
		add: function(elem, type, handler) {
			var eventHandle, events, handlers;
			// 拿到的是DOM元素在数据仓库的数据对象
			var elemData = data_priv.get(elem);

			// 检测handler是否存在ID(guid)如果没有那么传给它一个id
			// 添加ID的目的是 用来寻找或者删除相应的事件
			if (!handler.guid) {
				handler.guid = jQuery.guid++;
			}

			/**
			 * 给缓存添加事件处理句柄
			 * elemData = {
			 * 	events: {}
			 * 	handle: fn()
			 * }
			 */
			// 同一个元素，不同事件，不重复绑定
			if (!(events = elemData.events)) {
				events = elemData.events = {};
			}
			if (!(eventHandle = elemData.handle)) {
				// Event 对象代表事件的状态 通过apply传递
				eventHandle = elemData.handle = function(e) {
					return jQuery.event.dispatch.apply(eventHandle.elem, arguments);
				};
			}

			eventHandle.elem = elem;

			// 通过events存储同一个元素上的多个事件
			if (!(handlers = events[type])) {
				handlers = events[type] = [];
				handlers.delegateCount = 0; // 有多少事件代理默认0
			}
			handlers.push({
				type: type,
				handler: handler,
				guid: handler.guid,
			});

			// 添加事件
			if (elem.addEventListener) {
				elem.addEventListener(type, eventHandle, false);
			}
		},

		// 修复事件对象event 从缓存体中events对象取得对应队列
		dispatch: function(event) {
			// IE兼容性处理如：event.target or event.srcElement
			// event = jQuery.event.fix(event);

			// 提取当前元素在cache中的events属性值
			var handlers = (data_priv.get(this, "events") || {})[event.type] || [];
			event.delegateTarget = this;

			var args = [].slice.call(arguments);

			// 执行事件处理函数
			jQuery.event.handlers.call(this, handlers, args);
		},

		// 执行事件处理函数  args [event, 自定义参数]
		handlers: function(handlers, args) {
			handlers[0].handler.apply(this, args);
		},

		fix: function(event) {
			if (event[jQuery.expando]) {
				return event;
			}
			// Create a writable copy of the event object and normalize some properties
			var i,
				prop,
				copy,
				type = event.type,
				originalEvent = event,
				fixHook = this.fixHooks[type];

			if (!fixHook) {
				this.fixHooks[type] = fixHook = rmouseEvent.test(type)
					? this.mouseHooks
					: rkeyEvent.test(type)
					? this.keyHooks
					: {};
			}
			copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;

			event = new jQuery.Event(originalEvent);

			i = copy.length;
			while (i--) {
				prop = copy[i];
				event[prop] = originalEvent[prop];
			}

			// Support: Cordova 2.5 (WebKit) (#13255)
			// All events should have a target; Cordova deviceready doesn't
			if (!event.target) {
				event.target = document;
			}

			// Support: Safari 6.0+, Chrome < 28
			// Target should not be a text node (#504, #13143)
			if (event.target.nodeType === 3) {
				event.target = event.target.parentNode;
			}

			return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
		},

		special: {
			load: {
				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {
				// 执行默认focus方法
				trigger: function() {
					if (this !== safeActiveElement() && this.focus) {
						//console.log( this.focus)
						this.focus();
						return false;
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function() {
					if (this === safeActiveElement() && this.blur) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {
				// For checkbox, fire native event so checked state will be right
				trigger: function() {
					if (this.type === "checkbox" && this.click && jQuery.nodeName(this, "input")) {
						this.click();
						return false;
					}
				},

				// For cross-browser consistency, don't fire native .click() on links
				_default: function(event) {
					return jQuery.nodeName(event.target, "a");
				}
			},

			beforeunload: {
				postDispatch: function(event) {

					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if (event.result !== undefined) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		},

		/**
		 * event: 规定指定元素上要触发的事件，可以是自定义事件，或者任何标准事件。
		 * data: 传递到事件处理程序的额外参数。
		 * elem: Element对象
		 */
		trigger: function(event, data, elem) {
			var cur, tmp, bubbleType, ontype, handle,
					i = 0,
					eventPath = [elem || document],	// 规划冒泡路线
					type = event.type || event,
					cur = tmp = elem = elem || document,
					ontype = /^\w+$/.test(type) && "on" + type;		// 证明是ontype绑定事件

				// 模拟事件对象event，判断event是否有jQuery.expando，
				// 有说明event已经是模拟的事件对象，没有就new一个jQuery.Event实例对象
				event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === "object" && event);
				// console.log(event);
				
				// 定义 event.target 属性，指向目标源elem
				if (!event.target) {
					event.target = elem;
				}

				// 判断是否有额外参数data，没有就直接传递event，有就通过markArray合并数组
				data = data == null ? [event] : jQuery.markArray(data, [event]);

				// console.log(data);

				// 事件类型是否需要进行特殊化处理
				special = jQuery.event.special[type] || {};
				
				// 如果事件类型已经有trigger方法，就调用它
				if (special.trigger && special.trigger.apply(elem, data) === false) {
					return;
				}

				// 自己已经在冒泡路线中 不重复添加
				cur = cur.parentNode;
				// 查找当前元素的父元素 添加到eventPath数组中（规划冒泡路线）
				for(; cur; cur = cur.parentNode) {
					eventPath.push(cur);
					tmp = cur;
				}

				// 当tmp是document时，还需要把 window 也规划到路线中
				if (tmp === (elem.ownerDocument || document)) {
					eventPath.push(tmp.defaultView || tmp.parentWindow || window); //模拟冒泡到window对象
				}

				// console.log(eventPath);
				// console.log(data_priv);

				//沿着上面规划好的冒泡路线，把经过的元素节点的指定类型事件的回调逐一触发执行
				while ((cur = eventPath[i++])) {
					//先判断在缓存系统中是否有此元素绑定的此事件类型的回调方法，如果有，就取出来
					handle = (data_priv.get(cur, "events") || {})[event.type] && data_priv.get(cur, "handle");
					if (handle) {
						handle.apply(cur, data);
					}
				}
		},
	};

	// 模拟Event对象
	jQuery.Event = function(src, props) {
		// 创建一个jQuery.Event实例对象
		if (!(this instanceof jQuery.Event)) {
			return new jQuery.Event(src, props);
		}

		// 事件类型
		this.type = src;
		// 如果传入事件没有时间戳，则创建时间戳
		this.timeStamp = src && src.timeStamp || jQuery.now();
		// jQuery.Event实例对象标记
		this[jQuery.expando] = true;
	}

	jQuery.Event.prototype = {
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
		
		// 取消事件的默认动作
		preventDefault: function() {
			var e = this.originalEvent;

			this.isDefaultPrevented = returnTrue;

			if(e && e.preventDefault) {
				e.preventDefault();
			}
		},

		// 阻止事件冒泡到父元素，阻止父元素的事件处理函数被执行
		stopPropagation: function() {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if(e && e.stopPropagation) {
				e.stopPropagation();
			}
		},

		stopImmediatePropagation: function() {
			this.isImmediatePropagationStopped = returnTrue;
			this.stopPropagation();
		}
	};

	// 给jQuery原型扩展方法
	jQuery.fn.extend({
		each: function(callback, args) {
			return jQuery.each(this, callback, args);
		},

		// 绑定的事件types，事件函数fn
		on: function(types, fn) {
			var type;
			if (typeof types === "object") {
				for (type in types) {
					this.on(types[type], fn);
				}
			}
			// this element对象
			return this.each(function(index, elem) {
				jQuery.event.add(this, types, fn);
			});
		},

		// 语法：data可选，传递到事件处理程序的额外参数。
		trigger: function(type, data) {
			return this.each(function() {
				jQuery.event.trigger(type, data, this);
			});
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
