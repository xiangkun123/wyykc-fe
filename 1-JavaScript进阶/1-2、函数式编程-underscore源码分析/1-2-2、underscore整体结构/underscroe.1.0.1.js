(function(root) {
  var push = Array.prototype.push;

  var _ = function(obj) {
    if (obj instanceof _) {
      return obj;
    }

    if (!(this instanceof _)) {
      return new _(obj);
    }

    this._wrapped = obj;
  }
  
  // 数组去重
  _.unique = function(arr, callbacks) {
    var ret = [];
    var target,i=0;
    for (;i < arr.length; i++) {
      target = callbacks ? callbacks(arr[i]) : arr[i];
      if (ret.indexOf(target) === -1) {
        ret.push(target);
      }
    }
    return ret;
  }

  // map
  _.map = function(args) {
    return args;
  }

  // 链式调用
  _.chain = function(obj) {
    var instance = _(obj);        // 获取underscore实例对象
    instance._chain = true;       // 给实例对象增加一个_chain属性
    return instance;
  }

  // 辅助函数
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  }

  _.prototype.value = function() {
    return this._wrapped;
  }

  // 返回underscore上所有的可枚举属性
  _.functions = function(obj) {
    var result = [];
    var key;
    for (key in obj) {
      result.push(key);
    }
    return result;
  }

  // 类型检测
  _.isArray = function(array) {
    return toString.call(array) === "[object Array]";
  }

  // each遍历
  _.each = function(target, callback) {
    var key, i = 0;
    if (_.isArray(target)) {                  // 区分对象还是数组
      var length = target.length;
      for(; i<length; i++) {
        callback.call(target, target[i], i);
      }
    } else {
      for (key in target) {
        callback.call(target, key, target[key]);
      }
    }
  }

  // mixin
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) { // 遍历underscore所有的属性
      var func = obj[name];                   // 拿到方法的引用

      _.prototype[name] = function() {        // 给underscore原型上扩展同样的方法
        var args = [this._wrapped];           // 在构造方法中已经把数据存储在_wrapped，这里可以获取到
        push.apply(args, arguments);          // 把数据和处理函数的参数都存在数组中，[wrapped, function arguments]
        return result(this, func.apply(this, args));
      }
    });
  }

  _.mixin(_);

  root._ = _;

})(this);