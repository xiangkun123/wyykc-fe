(function(global) {
	var startUp = (global.startUp = {
		version: "1.0.1",
	});

	// 获取当前框架的一些内置信息
	var data = {};

	// 缓存对象
	var cache = {};

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

	// 更改初始化数据
	Module.prototype.save = function(uri, meta) {};

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
	Module.define = function(factory) {};

	// 检测缓存对象上是否有当前模块信息
	Module.get = function(uri, deps) {
		return cache[uri] || (cache[uri] = new Module(uri, deps));
	};

	Module.use = function(deps, callback, uri) {
		var module = Module.get(uri, isArray(deps) ? deps : [deps]);
		// console.log(module);

		// 所有模块都加载完毕
		module.callback = function() {};

		// 加载依赖项
		module.load();
	};

	var _cid = 0;

	function cid() {
		return _cid++;
	}

	data.preload = [];
	// 获取当前项目文档的URL
	data.cwd = document.URL.match(/[^?]*\//)[0];
	// console.log(data.cwd);

	Module.preload = function(callback) {
		var length = data.preload.length;
		if (!length) callback();
		// length !== 0 先加载预先设定模块
	};

	// 启动模块加载器
	startUp.use = function(list, callback) {
		// 检测有没有预先加载的模块
		Module.preload(function() {
			Module.use(list, callback, data.cwd + "_use_" + cid()); // 虚拟的根目录
		});
	};

	// 给外部this扩展一个define
	global.define = Module.define;
})(this);
