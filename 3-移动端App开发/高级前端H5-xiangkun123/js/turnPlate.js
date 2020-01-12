(function(window) {
	var TurnPlate = function() {};
	var tranTime = null; // 用于转动
	var rateTime = null; // 用于控制速率
	var popTime = null; // 用于奖品弹窗
	var _id = 0;

	// 获取最大公倍数
	function getMinCommonMultiple(a, b) {
		var temp;
		if (b > a) {
			temp = a;
			a = b;
			b = temp;
		}
		while (b != 0) {
			temp = a % b;
			a = b;
			b = temp;
		}
		return a;
	}

	TurnPlate.prototype = {
		options: {
			el: null, // 抽奖容器
			btn: null, // 抽奖按钮
			activeNode: 0, // 当前激活的奖品
			currentRate: 1, // 当前速率
			tranRate: [1, 10], // 定义速率1到10, 慢到快
			duration: 10, //持续时间
			prizes: [], // 奖品内容
			winPrize: { name: "" }, // 设置获奖奖品
			rateArray: [], // 用来做随机数取值
		},
		error: [],
		select: function(prizeName) {
			this.handleStart("one", prizeName);
		},
		half: function(prizeName) {
			this.handleStart("half", prizeName);
		},
		all: function(prizes) {
			this.handleStart(prizes);
		},
		start: function() {
			this.handleStart();
		},
		handleStart(model, prizeName) {
			this.options.btn.attr("disabled", true);
			this._setRateArray(model, prizeName);
			if (this.error.length == 0) {
				this._setWinPrize();
				this._tran();
			} else {
				console.error(this.error[0].message);
				this.options.btn.attr("disabled", false);
			}
		},
		// model可选值：array\half\one\undefined
		_setRateArray: function(model, prizeName) {
			var opt = this.options;
			var name = "";
			var scaleNum = [],
				rateTotal = 0,
				rates = [];
			if (model === undefined) {
				for (var index = 0; index < opt.prizes.length; index++) {
					name = $(opt.prizes[index]).html();
					opt.rateArray.push(name);
				}
			}
			if (model === "one") {
				opt.rateArray.push(prizeName);
			}
			if (model === "half") {
				for (var index = 0; index < opt.prizes.length; index++) {
					name = $(opt.prizes[index]).html();
					if (name != prizeName) {
						opt.rateArray.push(name);
					}
				}
				opt.rateArray = opt.rateArray.concat(new Array(opt.prizes.length - 1).fill(prizeName));
			}
			if (toString.call(model) === "[object Array]") {
				rates = model.map(function(item) {
					rateTotal = rateTotal + item.rate[0] / item.rate[1];
					return item.rate[1];
				});

				if (rateTotal > 1) {
					this.error.push({
						message: "您输入的概率总和超过1",
						_id: _id++,
					});
					return;
				}

				// 求到最大公倍数，再获取相应的比例
				var commonMultiple = rates.reduce(function(prev, curr) {
					return (prev * curr) / getMinCommonMultiple(prev, curr);
				}, rates[0]);

				model.map(function(item) {
					scaleNum = scaleNum.concat(
						new Array(Math.floor((commonMultiple / item.rate[1]) * item.rate[0])).fill(item.prize)
					);
				});

				opt.rateArray = scaleNum;
			}
		},
		_setWinPrize: function() {
			var opt = this.options;
			var length = opt.rateArray.length - 1;
			var index = Math.ceil(Math.random() * length);
			opt.winPrize.name = opt.rateArray[index];
		},
		_getPrize: function() {
			return this.options.el.find(".prize");
		},
		// 弹窗奖品
		_popWinPrize: function() {
			this.options.btn.attr("disabled", false);
			clearTimeout(popTime);
			popTime = setTimeout(
				function() {
					alert("恭喜你抽到的是 " + this.options.winPrize.name);
					clearTimeout(popTime);
					this.clearData();
				}.bind(this),
				1000
			);
		},
		// 每次转完清掉数据
		clearData() {
			this.options.winPrize = { name: "" };
			this.options.rateArray = [];
		},
		// 速率变换
		_tran: function() {
			var isQuick = true;
			var opt = this.options;
			var halfTime = opt.duration / 2;
			var diffRate = opt.tranRate[1] - opt.tranRate[0];
			var speed = Math.round(diffRate / halfTime);
			clearInterval(rateTime);
			rateTime = setInterval(
				function() {
					if (opt.currentRate >= opt.tranRate[1]) {
						isQuick = false;
					}
					if (isQuick) {
						opt.currentRate += speed;
					} else {
						opt.currentRate -= speed;
					}

					// 变慢后清掉定时器
					if (opt.currentRate <= opt.tranRate[0]) {
						opt.currentRate = 1;
						this._tranRender();
						clearInterval(rateTime);
						return;
					}
					this._tranRender();
				}.bind(this),
				1000
			);
		},
		// 转动动画控制
		_tranRender: function() {
			var opt = this.options;
			var activePrizeName = "";
			clearInterval(tranTime);
			tranTime = setInterval(
				function() {
					if (opt.activeNode == 8) {
						opt.activeNode = 0;
					}
					$(opt.prizes[opt.activeNode])
						.addClass("active")
						.siblings()
						.removeClass("active");
					activePrizeName = $(opt.prizes[opt.activeNode]).html();

					// 听到相应位置后清掉定时器
					if (opt.currentRate == 1 && opt.winPrize.name == activePrizeName) {
						clearInterval(tranTime);
						this._popWinPrize();
						return;
					}
					opt.activeNode++;
				}.bind(this),
				500 / opt.currentRate
			);
		},
		// 参数的初始化
		_init: function(opts) {
			opts.el = $(opts.el);
			opts.btn = $(opts.btn);
			var defaultOpt = this.options;
			this.options = Object.assign(defaultOpt, opts);
			if (this.options.tranRate[0] < 1) {
				this.options.tranRate[0] = 1;
			}
			defaultOpt.prizes = this._getPrize();
			return this;
		},
	};

	window.TurnPlate = new TurnPlate();
})(window);
