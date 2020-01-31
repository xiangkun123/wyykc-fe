/*
 * @Author: Administrator
 * @Date:   2018-10-30 20:40:51
 * @Last Modified by:   Administrator
 * @Last Modified time: 2018-11-01 22:10:22
 */
(function(root) {
	var testExp = /^\s*(<[\w\W]+>)[^>]*$/;
	var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
	var core_version = "1.0.1";
	var optionsCache = {};
	var class2type = {};
	var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
	//关闭这些标签以支持XHTML
	var wrapMap = {
		option: [1, "<select multiple='multiple'>", "</select>"],
		thead: [1, "<table>", "</table>"],
		col: [2, "<table><colgroup>", "</colgroup></table>"],
		tr: [2, "<table><tbody>", "</tbody></table>"],
		td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
		_default: [0, "", ""]
	};

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	//activeElement 属性返回文档中当前获得焦点的元素。
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch (err) {}
	}

	//getAll(fragment.appendChild(elem), "script");
	function getAll(context, tag) {

		var ret = context.getElementsByTagName ? context.getElementsByTagName(tag || "*") :
			context.querySelectorAll ? context.querySelectorAll(tag || "*") : [];
		// console.log(ret);   //查找script元素
		return tag === undefined || tag && jQuery.nodeName(context, tag) ?
			jQuery.merge([context], ret) :
			ret;
	}

	var jQuery = function(selector, context) {
		return new jQuery.prototype.init(selector, context);
	}

	jQuery.fn = jQuery.prototype = { //原型对象
		length: 0,
		jquery: core_version,
		selector: "",
		init: function(selector, context) {
			context = context || document;
			var match, elem, index = 0;
			//$()  $(undefined)  $(null) $(false)  
			if (!selector) {
				return this;
			}

			if (typeof selector === "string") {
				if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
					match = [selector]
				}
				//创建DOM
				if (match) {
					//this  
					jQuery.merge(this, jQuery.parseHTML(selector, context, true));
					//查询DOM节点
				} else {
					elem = document.querySelectorAll(selector);
					var elems = Array.prototype.slice.call(elem);
					this.length = elems.length;
					for (; index < elems.length; index++) {
						this[index] = elems[index];
					}
					this.context = context;
					this.selector = selector;
				}
			} else if (selector.nodeType) {
				this.context = this[0] = selector;
				this.length = 1;
				return this;
			}

		}
	}

	jQuery.fn.init.prototype = jQuery.fn;


	jQuery.extend = jQuery.prototype.extend = function() {
		var target = arguments[0] || {};
		var length = arguments.length;
		var i = 1;
		var deep = false; //默认为浅拷贝 
		var option;
		var name;
		var copy;
		var src;
		var copyIsArray;
		var clone;

		if (typeof target === "boolean") {
			deep = target;
			target = arguments[1];
			i = 2;
		}

		if (typeof target !== "object") {
			target = {};
		}

		if (length == i) {
			target = this;
			i--; //0   
		}

		for (; i < length; i++) {
			if ((option = arguments[i]) !== null) {
				for (name in option) {
					src = target[name];
					copy = option[name];
					if (deep && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];
						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}
						target[name] = jQuery.extend(deep, clone, copy);
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}
		return target;
	}


	jQuery.extend({
		expando: "jQuery" + (core_version + Math.random()).replace(/\D/g, ""),
		guid: 1, //计数器
		now: Date.now, //返回当前时间距离时间零点(1970年1月1日 00:00:00 UTC)的毫秒数
		//类型检测     
		isPlainObject: function(obj) {
			return toString.call(obj) === "[object Object]";
		},

		isArray: function(obj) {
			return toString.call(obj) === "[object Array]";
		},

		isFunction: function(fn) {
			return toString.call(fn) === "[object Function]";
		},
		type: function(obj) {
			if (obj == null) {
				return String(obj); //"null"
			}
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[toString.call(obj)] || "object" : typeof obj;
		},

		isEmptyObject: function(obj) {
			var name;
			for (name in obj) {
				return false;
			}
			return true;
		},

		//[array like]转化成正真的数组  
		makeArray: function(arr, results) {
			var ret = results || [];
			if (arr != null) {
				if (isArraylike(arr)) {
					jQuery.merge(ret,
						typeof arr === "string" ? [arr] : arr
					);
				} else {
					[].push.call(ret, arr);
				}
			}

			return ret;
		},

		//合并数组
		merge: function(first, second) {
			var l = second.length,
				i = first.length,
				j = 0;

			if (typeof l === "number") {
				for (; j < l; j++) {
					first[i++] = second[j];
				}
			} else {
				while (second[j] !== undefined) {
					first[i++] = second[j++];
				}
			}

			first.length = i;

			return first;
		},

		//init 传值 true
		parseHTML: function(data, context, keepScripts) {
			if (!data || typeof data !== "string") {
				return null;
			}
			//参数兼容处理
			if (typeof context === "boolean") {
				keepScripts = context;
				context = false;
			}
			context = context || document;
			//过滤掉<a>   <a>   => a   问题：
			var parse = rejectExp.exec(data);
			var scripts = !keepScripts && []; //默认空数组
			if (parse) {
				return [context.createElement(parse[1])];
			}

			parsed = jQuery.buildFragment([data], context, scripts);

			return jQuery.merge([], parsed.childNodes);
		},

		buildFragment: function(elems, context, scripts, selection) {
			var elem, tmp, tag, wrap, contains, j,
				i = 0,
				l = elems.length,
				fragment = context.createDocumentFragment(),
				nodes = [];

			for (; i < l; i++) {
				elem = elems[i]; //字符串

				if (elem || elem === 0) {

					// 是对象直接添加节点
					if (jQuery.isPlainObject(elem) === "object" && elem !== null) {
						// Support: QtWebKit
						// jQuery.merge because core_push.apply(_, arraylike) throws
						jQuery.merge(nodes, elem.nodeType ? [elem] : elem);

						// // 如果不存在html实体编号或标签,则创建文本节点
					} else if (!/<|&#?\w+;/.test(elem)) {
						nodes.push(context.createTextNode(elem));

						//将HTML转换为DOM节点
					} else { //代码将会执行到这
						tmp = tmp || fragment.appendChild(context.createElement("div"));
						// 获取传递过来字符串中的标签名
						tag = (/<([\w:]+)/.exec(elem) || ["", ""])[1].toLowerCase();
						//_default: [0, "", ""]
						wrap = wrapMap[tag] || wrapMap._default;
						//console.log(elem.replace(rxhtmlTag, "<$1></$2>"));
						//<div><p>max</p></div>
						tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];

						//创建的文档碎片div 存储在nodes中
						jQuery.merge(nodes, tmp.childNodes);
						//console.log(nodes)    [div]
						// Remember the top-level container
						tmp = fragment.firstChild;

						// Fixes #12346
						// Support: Webkit, IE
						tmp.textContent = "";
					}
				}
			}

			// Remove wrapper from fragment
			fragment.textContent = "";

			i = 0;
			while ((elem = nodes[i++])) {

				// #4087 - If origin and destination elements are the same, and this is
				// that element, do not do anything   补丁
				if (selection && jQuery.inArray(elem, selection) !== -1) {
					continue;
				}

				//console.log(fragment.appendChild(elem))  <div>max</div>
				// Append to fragment  script 附加到片段  
				//用来获取 context 上的 tag 标签，或者是将 context 和 context 里的 tag 标签的元素合并
				tmp = getAll(fragment.appendChild(elem), "script");
				//console.log(tmp)

				//console.log(scripts)  false
				// 捕获可执行文件
				if (scripts) {
					j = 0;
					while ((elem = tmp[j++])) {
						if (rscriptType.test(elem.type || "")) {
							scripts.push(elem);
						}
					}
				}
			}

			return fragment;
		},

		nodeName: function(elem, name) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},


		//$.Callbacks用于管理函数队列
		callbacks: function(options) {
			options = typeof options === "string" ? (optionsCache[options] || createOptions(options)) : {};
			var list = [];
			var index, length, testting, memory, start, starts;
			var fire = function(data) {
				memory = options.memory && data;
				index = starts || 0;
				start = 0;
				testting = true;
				length = list.length;
				for (; index < length; index++) {
					if (list[index].apply(data[0], data[1]) === false && options.stopOnfalse) {
						break;
					}
				}
			}
			var self = {
				add: function() {
					var args = Array.prototype.slice.call(arguments);
					start = list.length;
					args.forEach(function(fn) {
						if (toString.call(fn) === "[object Function]") {
							list.push(fn);
						}
					});
					if (memory) {
						starts = start;
						fire(memory);
					}
					return this;
				},
				//指定上下文对象
				fireWith: function(context, arguments) {
					var args = [context, arguments];
					if (!options.once || !testting) {
						fire(args);
					}

				},
				//参数传递
				fire: function() {
					self.fireWith(this, arguments);
				}
			}
			return self;
		},

		// 异步回调解决方案
		Deferred: function(func) {
			var tuples = [
					["resolve", "done", jQuery.callbacks("once memory"), "resolved"],
					["reject", "fail", jQuery.callbacks("once memory"), "rejected"],
					["notify", "progress", jQuery.callbacks("memory")]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					then: function( /* fnDone, fnFail, fnProgress */ ) {},
					promise: function(obj) {
						return obj != null ? jQuery.extend(obj, promise) : promise;
					}
				},
				deferred = {};

			tuples.forEach(function(tuple, i) {
				var list = tuple[2],
					stateString = tuple[3];

				// promise[ done | fail | progress ] = list.add
				promise[tuple[1]] = list.add;

				// Handle state
				if (stateString) {
					list.add(function() {
						// state = [ resolved | rejected ]
						state = stateString;
					});
				}

				// deferred[ resolve | reject | notify ]
				deferred[tuple[0]] = function() {
					deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
					return this;
				};
				deferred[tuple[0] + "With"] = list.fireWith;
			});

			// Make the deferred a promise
			promise.promise(deferred);

			return deferred;
		},
		//执行一个或多个对象的延迟对象的回调函数
		when: function(subordinate) {
			return subordinate.promise();
		},

		/*
		 object   目标源
		 callback  回调函数
		 args     自定义回调函数参数
		 */
		each: function(object, callback, args) {
			//object  数组对象 || object对象 
			var length = object.length;
			var name, i = 0;

			// 自定义callback 参数
			if (args) {
				if (length === undefined) {
					for (name in object) {
						callback.apply(object, args);
					}
				} else {
					for (; i < length;) {
						callback.apply(object[i++], args);
					}
				}
			} else {
				if (length === undefined) {
					for (name in object) {
						callback.call(object, name, object[name]);
					}
				} else {
					for (; i < length;) {
						callback.call(object[i], i, object[i++]);
					}
				}
			}
		},

		access: function(elems, fn, key, value) {
			var length = elems.length;
			var testing = key === null;
			var cache, chainable, name;
			//key  
			if (jQuery.isPlainObject(key) && key !== null) {
				for (name in key) {
					console.log(name)
					jQuery.access(elems, fn, name, key[name]);
				}
			}

			if (value !== undefined) {
				chainable = true;
				if (testing) {
					cache = fn; //回调缓存
					fn = function(key, value) { //重置回调函数
						cache.call(this, value);
					}
				}
				for (var i = 0; i < length; i++) {
					fn.call(elems[i], key, value);
				}
			}
			//  (testing ? fn.call(elems[0]) : fn.call(elems[0],key , value))
			return chainable ? elems : (testing ? fn.call(elems[0]) : fn.call(elems[0], key, value)); // 最终决定返回值是什么？   jQuery的实例对象
		},

		empty: function(elem, value) {
			var nodeType = elem.nodeType; // 1
			//1 元素      9 文档   11 文档碎片
			if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
				elem.textContent = value; //"max"
			}
		},

		text: function(elem) {
			var nodeType = elem.nodeType;
			if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
				return elem.textContent;
			}
		},
		//规范化float css属性
		cssProps: {
			"float": "cssFloat"
		},
		style: function(elem, name, value) {
			var origName = jQuery.camelCase(name);
			var curcss = jQuery.cssProps[name];
			if (value !== undefined) {
				elem.style[curcss || origName] = value;
			}
		},
		css: function(elem, name, styles) {
			styles = styles || getStyles(elem);
			return styles.getPropertyValue(name);
		},
		camelCase: function(string) {
			return string.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function(context, first) {
				return first.toUpperCase();
			});
		}

	});

	function Data() {
		//jQuery.expando是jQuery的静态属性,对于jQuery的每次加载运行期间时唯一的随机数
		this.expando = jQuery.expando + Math.random();
		this.cache = {};
	}

	Data.uid = 1;

	Data.prototype = {
		key: function(elem) {
			var descriptor = {},
				unlock = elem[this.expando];   //检测expando  钥匙

			if (!unlock) {   //
				unlock = Data.uid++;   //1
				descriptor[this.expando] = { //钥匙
					value: unlock
				};
				//方法直接在一个对象上定义一个或多个新的属性或修改现有属性,并返回该对象。
				//DOM   =>  jQuery101089554822917892030.7449198463843298 = 1;
				Object.defineProperties(elem, descriptor);
			}
			//确保缓存对象记录信息
			if (!this.cache[unlock]) { //1
				this.cache[unlock] = {}; 
			}

			return unlock;
		},

		get: function(elem, key) {   //maxqueue
			//找到或者创建缓存
			var cache = this.cache[this.key(elem)];   //  cache  {}   缓存对象  maxqueue.
			//key 有值直接在缓存中取读
			return key === undefined ? cache : cache[key];     //maxqueue [function(){}]
		},

		//使用set来更新缓存对象   maxqueue
		set: function(owner, data, value) {
			console.log(data)
			var prop,
				unlock = this.key(owner),      //1
				cache = this.cache[unlock]; //创建当前owner元素 找到缓存对象

			if (typeof data === "string") {
				cache[data] = value; //{maxqueue:[function(){}]}     maxqueue队列上的信息
			} else {
				//如果data不是字符串 并且cache是个空对象
				if (jQuery.isEmptyObject(cache)) {
					jQuery.extend(this.cache[unlock], data);
					// Otherwise, copy the properties one-by-one to the cache object
				} else {
					for (prop in data) {
						cache[prop] = data[prop];
					}
				}
			}

			return cache;
		},

		//多功能值操作  owner  DOM元素  key 队列名称    value  数组  处理函数
		access: function(owner, key, value) {
			var stored;

			//返回整个缓存对象   返回当前元素指定的数据对象
			if (key === undefined || ((key && typeof key === "string") && value === undefined)) {
				stored = this.get(owner, key);
				return stored !== undefined ? stored : this.get(owner, jQuery.camelCase(key));
			}
			//更新数据
			this.set(owner, key, value);
			return value !== undefined ? value : key;
		},

	}

	var data_priv = new Data();




	//jQuery 事件模块
	jQuery.event = {
		//1:利用 data_priv 数据缓存,分离事件与数据 2:元素与缓存中建立 guid 的映射关系用于查找 
		add: function(elem, type, handler) {
			var eventHandle, events, handlers;
			//事件缓存 数据对象
			var elemData = data_priv.get(elem);


			//检测handler是否存在ID(guid)如果没有那么传给他一个ID
			//添加ID的目的是 用来寻找或者删除相应的事件
			if (!handler.guid) {
				handler.guid = jQuery.guid++; //guid == 1
			}
			/*
			给缓存增加事件处理句柄
			elemData = {
			  events:
			  handle:	
			}
			*/
			//同一个元素,不同事件,不重复绑定    {events:{}}
			if (!(events = elemData.events)) {
				events = elemData.events = {};
			}
			if (!(eventHandle = elemData.handle)) {
				//Event 对象代表事件的状态 通过apply传递
				eventHandle = elemData.handle = function(e) {
					return jQuery.event.dispatch.apply(eventHandle.elem, arguments);
				}
			}
			eventHandle.elem = elem;
			//通过events存储同一个元素上的多个事件   {events:{click:[]}}   
			if (!(handlers = events[type])) {
				handlers = events[type] = [];
				handlers.delegateCount = 0; //有多少事件代理默认0
			}
			handlers.push({
				type: type,
				handler: handler,
				guid: handler.guid,
			});
			//添加事件
			if (elem.addEventListener) {
				elem.addEventListener(type, eventHandle, false);
			}
		},

		//修复事件对象event 从缓存体中的events对象取得对应队列。
		dispatch: function(event) {
			//IE兼容性处理如：event.target or event.srcElement
			//event = jQuery.event.fix(event);

			//提取当前元素在cache中的events属性值。 click
			var handlers = (data_priv.get(this, "events") || {})[event.type] || [];
			event.delegateTarget = this;
			var args = [].slice.call(arguments);

			//执行事件处理函数
			jQuery.event.handlers.call(this, handlers, args);
		},

		//执行事件处理函数
		handlers: function(handlers, args) { //[event , 自定义参数]
			handlers[0].handler.apply(this, args);
		},

		fix: function(event) {
			if (event[jQuery.expando]) {
				return event;
			}
			// Create a writable copy of the event object and normalize some properties
			var i, prop, copy,
				type = event.type,
				originalEvent = event,
				fixHook = this.fixHooks[type];

			if (!fixHook) {
				this.fixHooks[type] = fixHook =
					rmouseEvent.test(type) ? this.mouseHooks :
					rkeyEvent.test(type) ? this.keyHooks : {};
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

		//event:  规定指定元素上要触发的事件,可以是自定义事件,或者任何标准事件。
		//data:  传递到事件处理程序的额外参数。
		//elem:  Element对象
		trigger: function(event, data, elem) {
			var i, cur, tmp, bubbleType, ontype, handle,
				i = 0,
				eventPath = [elem || document], //规划冒泡路线
				type = event.type || event,
				cur = tmp = elem = elem || document,
				//证明是ontype绑定事件
				ontype = /^\w+$/.test(type) && "on" + type;

			//模拟事件对象	如果有jQuery.expando说明event已经是模拟的事件对象
			event = event[jQuery.expando] ?
				event :
				new jQuery.Event(type, typeof event === "object" && event);
			//console.log(event);

			//定义event.target 属性
			if (!event.target) {
				event.target = elem;
			}
			//如果没有传入了参数,就把event存储在数组中 有传递合并数组
			//如之前所看到：data可选,传递到事件处理程序的额外参数。注意:事件处理程序第一个参数默认是event(此为出处)
			data = data == null ? [event] :
				jQuery.markArray(data, [event]);

			//事件类型是否需要进行特殊化处理   focus
			special = jQuery.event.special[type] || {};
			//如果事件类型已经有trigger方法，就调用它
			if (special.trigger && special.trigger.apply(elem, data) === false) {
				return;
			}
			//自己已经在冒泡路线中 不重复添加
			cur = cur.parentNode;
			//查找当前元素的父元素 添加到eventPath (规划冒泡路线)数组中
			for (; cur; cur = cur.parentNode) {
				eventPath.push(cur);
				tmp = cur;
			}

			if (tmp === (elem.ownerDocument || document)) { //当tmp为document时,cur为空,就退出循环
				eventPath.push(tmp.defaultView || tmp.parentWindow || window); //模拟冒泡到window对象
			}
			//console.log(eventPath);

			//沿着上面规划好的冒泡路线，把经过的元素节点的指定类型事件的回调逐一触发执行
			while ((cur = eventPath[i++])) {
				//先判断在缓存系统中是否有此元素绑定的此事件类型的回调方法，如果有，就取出来	
				handle = (data_priv.get(cur, "events") || {})[event.type] && data_priv.get(cur, "handle");
				if (handle) {
					console.log(handle)
					handle.apply(cur, data);
				}
			}
		},
	}

	//模拟Event对象
	jQuery.Event = function(src, props) {
		//创建一个jQuery.Event实例对象
		if (!(this instanceof jQuery.Event)) {
			return new jQuery.Event(src, props);
		}
		//事件类型
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
		//取消事件的默认动作
		preventDefault: function() {
			var e = this.originalEvent; //指向原始的事件对象

			this.isDefaultPrevented = returnTrue;

			if (e && e.preventDefault) {
				e.preventDefault();
			}
		},
		// 方法阻止事件冒泡到父元素,阻止任何父事件处理程序被执行。
		stopPropagation: function() {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if (e && e.stopPropagation) {
				e.stopPropagation();
			}
		},
		//阻止当前事件向祖辈元素的冒泡传递
		stopImmediatePropagation: function() {
			this.isImmediatePropagationStopped = returnTrue;
			this.stopPropagation();
		}
	};

	jQuery.fn.extend({
		each: function(callback, args) {
			return jQuery.each(this, callback, args);
		},

		on: function(types, fn) {
			var type;
			if (typeof types === "object") {
				for (type in types) {
					this.on(types[type], fn);
				}
			}
			return this.each(function() {
				//this  element对象
				jQuery.event.add(this, types, fn);
			});
		},
		//语法: data可选,传递到事件处理程序的额外参数。  注意:事件处理程序第一个参数默认是event
		trigger: function(type, data) {
			return this.each(function() {
				jQuery.event.trigger(type, data, this);
			});
		},
		text: function(value) {
			return jQuery.access(this, function(value) {
				//console.log(this)
				//get  set   value === "max"
				return value === undefined ? jQuery.text(this) : jQuery.empty(this, value);
			}, null, value);
		},
		css: function(key, value) {
			return jQuery.access(this, function(key, value) {
				var styles, len, i = 0;
				var map = {};

				//console.log(key)
				if (jQuery.isArray(key)) {
					styles = getStyles(this);
					len = key.length;
					for (; i < len; i++) {
						map[key[i]] = jQuery.css(this, key[i], styles);
					}
					return map;
				}

				return value !== undefined ?
					jQuery.style(this, key, value) :
					jQuery.css(this, key);
			}, key, value); //null
		},

		addClass: function(value) {
			var len = this.length;
			var clazz, cur, i = 0;
			proceed = arguments.length === 0 || typeof value === "string" && value;
			if (proceed) {
				//\S 非空白字符
				classes = (value || "").match(/\S+/g) || [];
				for (; i < len; i++) {
					elem = this[i];
					//console.log(elem.className)
					cur = elem.nodeType === 1 && (elem.className ?
						(" " + elem.className + " ").replace(/[\t\r\n\f]/g, " ") : " ");
					if (cur) {
						j = 0;
						while ((clazz = classes[j++])) {
							if (cur.indexOf(" " + clazz + " ") < 0) {
								cur += clazz + " ";
							}
						}
						elem.className = cur.trim(cur);
					}
				}


			}
			return this;
		},

		append: function() {
			//arguments参数   callback回调
			return this.domManip(arguments, function(elem) {
				if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
					var target = manipulationTarget(this, elem);
					target.appendChild(elem);
				}
			});
		},

	})

	function getStyles(elem) {
		return window.getComputedStyle(elem, null);
	}

	function createOptions(options) {
		var object = optionsCache[options] = {};
		options.split(/\s+/).forEach(function(value) {
			object[value] = true;
		});
		return object;
	}
    
	//检测对象是否有length属性  true 
	function isArraylike(obj) {
		var length = obj.length,
			type = jQuery.type(obj);    //数据类型
		if (obj.nodeType === 1 && length) {
			return true;
		}
		return type === "array" || type !== "function" && (length === 0 || typeof length === "number" && length > 0 && (
			length - 1) in obj);
	}

	jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});



	//动画队列
	jQuery.extend({
		/*
		 ** elem DOM元素 
		 ** type 队列名称
		 ** data可以是function或数组。
		 */
		queue: function(elem, type, data) {
			var queue;
			if (elem) {
				type = (type || "fx") + "queue";    //   maxqueue || fxqueue
				//   1：基于Data创建缓存对象  2：  尝试检测缓存对象中是否有maxqueue
				queue = data_priv.get(elem, type); //检测在当前elem 数据缓存对象中有没有type(maxqueue)属性。
				console.log(queue);  //第一次状态undefined
				if (data) {
					if (!queue || jQuery.isArray(data)) {
						//makeArray   [function(){} ]  
						queue = data_priv.access(elem, type, jQuery.makeArray(data));
					} else {
						queue.push(data);
					}
				}
				return queue || [];
			}
		},

		//出列
		dequeue: function(elem, type) {
			type = type || "fx";
			var queue = jQuery.queue(elem, type);
			var startLength = queue.length,
				fn = queue.shift(), 						// shift 方法用于把数组的第一个元素从其中删除,并返回第一个元素的值。 
				next = function() { 						//指向下一个callbacks
					jQuery.dequeue(elem, type);
				};

			// 如果是dequeue操作, 去掉锁, 执行队列里的函数
			if (fn === "inprogress") {
				fn = queue.shift();
				startLength--;
			}

			if (fn) {
				// 给队列加上锁.
				if (type === "fx") {
					queue.unshift("inprogress");
				}
				fn.call(elem, next);
			}
		},
	})

	root.$ = root.jQuery = jQuery;
})(this);
