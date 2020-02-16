(function(root, factory, plug) {
	factory(jQuery, plug);
})(this, function(jQuery, plug) {
	//默认的配置项
	var DEFAULTS = {
		plugName: "dv",
		initEvent: "input",
		initError: "您填写的信息有误 请仔细检查"
	}

	//基本的功能  校验引擎
	var RULES = {
		"email": function() {
			//console.log(this.value)
			return /^\w+@\w+\.\w+$/.test(this.val());
		},
		"mobile": function() {
			return /^1\d{10}$/.test(this.val());
		},
		"password": function() {
			return /^\w{8,12}$/.test(this.val());
		},
		"landline": function() {
			return /^\d{3,4}-\d{6,8}$/.test(this.val());
		}
	}

	//校验 form 表单
	$.fn[plug] = function(options) {
		if (!this.is("form")) {
			return this;
		}
		var _this_ = this; //  _this_  jQuery实例对象  => $("form").validate()
		$.extend(this, DEFAULTS, options);
		this.$finds = this.find("input");
		this.$finds.on(this.initEvent, function() {
			var _this = $(this); //_this  触发当前事件的元素  包装成jQuery对象
			_this.siblings("p").remove();
			$.each(RULES, function(key, fn) {
				var $findName = _this.data(_this_.plugName + "-" + key); //this  RULES 的值
				var $error = _this.data(_this_.plugName + "-" + key + "-error"); //this  RULES 的值
				if ($findName) {
					var result = fn.call(_this);
					$error = $error || _this_.initError;
					console.log(result)
					if (!result) { //!false
						_this.after("<p style='color:red; margin-top:5px'>" + $error + "</p>");
					}
				}
			});
		});
	}
	
	//扩展能力
	$.fn[plug].extendRules = function(options){
       $.extend(RULES, options);
	   console.log(RULES)
	}

}, "validate");
