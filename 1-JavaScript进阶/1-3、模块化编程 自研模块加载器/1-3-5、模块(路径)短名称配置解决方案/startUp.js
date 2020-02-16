(function(global) {
	var startUp = (global.startUp = {
		version: "1.0.1",
	});

	// 获取当前框架的一些内置信息		配置信息
	var data = {};

	// 缓存对象
	var cache = {};

	// 异步加载模块时的一些信息
	var anonymousMeta = {};

	// 模块的生命周期
	var status = {
		FETCHED: 1, // 正在获取当前模块的uri
		SAVED: 2, // 正在缓存中存储模块数据信息
		LOADING: 3, // 正在加载当前模块的依赖项
		LOADED: 4, // 准备执行当前模块
		EXECUTING: 5, // 正在执行当前模块
		EXECUTED: 6, // 执行完毕，接口对象已经获取到
	};

	var isArray = function(obj) {
		return toString.call(obj) === "[object Array]";
	};

	var isFunction = function(obj) {
		return toString.call(obj) === "[object Function]";
	};

	var isString = function(obj) {
		return toString.call(obj) === "[object String]";
	};

	//是否使用别名
	function parseAlias(id) {
		var alias = data.alias; // 配置中是否配置了alias
		return alias && isString(alias[id]) ? alias[id] : id;
	}

	//不能以"/" ":"开头  结尾必须是一个"/" 后面跟随任意字符至少一个
	var PATHS_RE = /^([^\/:]+)(\/.+)$/; //([^\/:]+)   路径的短名称配置

	// 检测是否书写路径短名称
	function parsePaths(id) {
		var paths = data.paths; // 配置
		if (paths && (m = id.match(PATHS_RE)) && isString(paths[m[1]])) {
			id = paths[m[1]] + m[2];
		}
		return id;
	}

	// 检测是否添加后缀
	function normalize(path) {
		var last = path.length - 1;
		var lastC = path.charAt(last);
		return lastC === "/" || path.substring(last - 2) === ".js" ? path : path + ".js";
	}

	// 添加根目录
	function addBase(id, uri) {
		var result;
		if (id.charAt(0) === ".") {
			result = relapath((uri ? uri.match(/[^?]*\//)[0] : data.cwd) + id);
		} else {
			result = data.cwd + id;
		}
		return result;
	}

	var DOT_RE = /\/.\//g; // /a/b/./c/./d => /a/b/c/d
	var DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//; // /a/b/c/../../d ==> /a/b/../d => /a/d

	// 规范路径
	function relapath(path) {
		path = path.replace(DOT_RE, "/");

		while (path.match(DOUBLE_DOT_RE)) {
			path = path.replace(DOUBLE_DOT_RE, "/");
		}
		return path;
	}

	// 生成绝对路径 parent child
	startUp.resolve = function(child, parent) {
		if (!child) return "";
		child = parseAlias(child); // 检测是否有别名
		child = parsePaths(child); // 检测是否有路径别名 依赖模块中引包
		child = normalize(child); // 检测是否添加后缀
		return addBase(child, parent); // 添加根目录
	};

	startUp.request = function(url, callback) {
		var node = document.createElement("script");
		node.src = url;
		document.body.appendChild(node);
		node.onload = function() {
			node.onload = null;
			document.body.removeChild(node);
			callback();
		};
	};

	// 构造函数  模块初始化数据
	function Module(uri, deps) {
		this.uri = uri;
		this.deps = deps || []; //["a.js", "b.js"]
		this.exports = null;
		this.status = 0;
		this._waitings = {};
		this._remain = 0;
	}

	// 分析主干（左子树 | 右子树）上的依赖项
	Module.prototype.load = function() {
		var module = this;
		module.status = status.LOADING; //LOADING=3 正在加载模块依赖项
		var uris = module.resolve(); //获取主干上的依赖项，也就是deps中的选项
		var len = (module._remain = uris.length);

		// 加载主干上的依赖项(依赖模块)
		var seed;
		for (var i = 0; i < len; i++) {
			seed = Module.get(uris[i]); // 创建缓存信息

			// LOADED=4 准备加载执行当前模块
			if (seed.status < status.LOADED) {
				seed._waitings[module.uri] = seed._waitings[module.uri] || 1;
			} else {
				module._remain--;
			}
		}

		// 如果依赖列表模块全都加载完毕
		if (module._remain == 0) {
			module.onload();
		}

		// 准备执行根目录下的依赖列表中的模块
		var requestCache = {};
		for (var i = 0; i < len; i++) {
			seed = Module.get(uris[i]);
			// 判断当前的依赖项是否未加载，已加载过就不会再加载了
			if (seed.status < status.FETCHED) {
				seed.fetch(requestCache);
			}
		}

		for (uri in requestCache) {
			requestCache[uri]();
		}
	};

	// 加载依赖列表中的模块  a.js\b.js
	Module.prototype.fetch = function(requestCache) {
		var module = this;
		module.status = status.FETCHED; // 1
		var uri = module.uri; // a.js 绝对路径地址 || b.js 绝对路径地址
		requestCache[uri] = sendRequest;

		function sendRequest() {
			startUp.request(uri, onRequest);
		}

		function onRequest() {
			// 模块的数据更新
			if (anonymousMeta) {
				module.save(uri, anonymousMeta);
			}
			module.load(); // 递归 模块加载策略
		}
	};

	Module.prototype.onload = function() {
		// console.log(this);
		var mod = this;
		mod.status = status.LOADED; // 4，准备执行当前模块，以及获取当前模块的接口对象

		// 获取模块的接口对象
		if (mod.callback) {
			mod.callback();
		}

		var waitings = mod._waitings; // waiting是一个对象，保存谁会依赖于mod的关系
		var key, m;

		for (key in waitings) {
			var m = cache[key];
			m._remain -= waitings[key]; //每加载一个依赖就减1
			// 最终主干上的所有依赖都加载完就等于0，就调用主干的onload事件
			if (m._remain === 0) {
				m.onload();
			}
		}
	};

	// 更改初始化数据
	Module.prototype.save = function(uri, meta) {
		var module = Module.get(uri); // 是否已经缓存
		module.uri = uri;
		module.deps = meta.deps || [];
		module.factory = meta.factory;
		module.status = status.SAVED;
	};

	// 获取模块对外的接口对象
	Module.prototype.exec = function() {
		var module = this;
		// console.log(module);

		// 防止重复执行
		if (module.status >= status.EXECUTING) {
			return module.exports;
		}
		module.status = status.EXECUTING; //5
		var uri = module.uri;

		function require(id) {
			// console.log(require.resolve(id));	// 更新过后的数据
			return Module.get(require.resolve(id)).exec(); //获取模块的接口对象
		}

		require.resolve = function(id) {
			return startUp.resolve(id, uri); // 获取id模块的绝对路径地址
		};

		var factory = module.factory;
		var exports = isFunction(factory) ? factory(require, (module.exports = {}), module) : factory;

		if (exports === undefined) {
			exports = module.exports;
		}

		module.exports = exports;
		module.status = status.EXECUTED;
		return exports;
	};

	// 资源定位 解析依赖项生成绝对路径地址
	Module.prototype.resolve = function() {
		var mod = this;
		var ids = mod.deps; //["./a","./b"]
		var uris = [];
		for (var i = 0; i < ids.length; i++) {
			uris[i] = startUp.resolve(ids[i], mod.uri); // 依赖项   (主干| 子树)
		}
		// console.log(uris);
		return uris;
	};

	// 定义一个模块
	Module.define = function(factory) {
		var deps;
		if (isFunction(factory)) {
			deps = parseDependencies(factory.toString());
		}
		//存储当前模块的信息
		var meta = {
			id: "",
			uri: "",
			deps: deps,
			factory: factory,
		};
		anonymousMeta = meta;
	};

	// 提取模块中的依赖项
	var REQUIRE_RE = /\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g;
	function parseDependencies(code) {
		var ret = [];
		code.replace(REQUIRE_RE, function(m, m1, m2) {
			if (m2) ret.push(m2);
		});
		return ret;
	}

	// 检测缓存对象上是否有当前模块信息
	Module.get = function(uri, deps) {
		return cache[uri] || (cache[uri] = new Module(uri, deps));
	};

	Module.use = function(deps, callback, uri) {
		var module = Module.get(uri, isArray(deps) ? deps : [deps]);
		// console.log(module);

		// 给主干的Module实例对象扩展一个callback方法
		module.callback = function() {
			var exports = []; // 所有依赖项模块的接口对象
			var uris = module.resolve();
			for (var i = 0; i < uris.length; i++) {
				exports[i] = cache[uris[i]].exec(); // 获取模块对外定义的接口对象
			}
			if (callback) {
				callback.apply(global, exports);
			}
		};

		// 加载依赖项
		module.load();
	};

	var _cid = 0;

	function cid() {
		return _cid++;
	}

	// data.preload = [];

	// 获取当前项目文档的URL
	data.cwd = document.URL.match(/[^?]*\//)[0];
	// console.log(data.cwd);

	// 预加载方法
	Module.preload = function(callback) {
		var preloadMods = data.preload || [];			// ["xxx.js"]			// 再进来时[]
		var length = preloadMods.length;

		// length 有值，直接调用 Module.use 加载预先设定模块
		if (length) {
			Module.use(preloadMods, function() {
				preloadMods.splice(0, length);				// 移除掉预加载的模块
				Module.preload(callback);							// 再调用，此时data.preload已经是空的了，进行就直接走else的callback
			},data.cwd + "_preload_" + cid());			// 这里也要生成一个虚拟的根目录，xxx_preload_1
		} else {
			callback();
		}
	};

	// 启动模块加载器
	startUp.use = function(list, callback) {
		// 检测有没有预先加载的模块
		Module.preload(function() {
			Module.use(list, callback, data.cwd + "_use_" + cid()); // 虚拟的根目录
		});
	};

	// 配置项
	startUp.config = function(options) {
		var key;
		for (key in options) {
			data[key] = options[key];
		}
		// console.log(data);
	};

	// 给外部this扩展一个define
	global.define = Module.define;
})(this);
