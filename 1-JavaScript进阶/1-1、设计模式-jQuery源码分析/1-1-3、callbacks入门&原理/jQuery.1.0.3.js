(function(root) {
	var optionsCache = {};

	var $ = {
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
	};

	// 创建一个option对象
	function createOptions(options) {
		var object = (optionsCache[options] = {});
		options.split(/\s+/).forEach(function(value) {
			object[value] = true;
		});
		return object;
	}

	root.$ = $;
})(this);
