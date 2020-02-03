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
  _.map = function(obj, iteratee, context) {
    // 生成不同功能的迭代器
    var iteratee = cb(iteratee, context);
    // 分辨 obj是数组对象，还是object对象
    var keys = !_.isArray(obj) && Object.keys(obj);
    var length = (keys || obj).length;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      result[index] = iteratee(obj[currentKey], currentKey, context);
    }

    return result;
  }

  // 生成迭代器函数
  var cb = function(iteratee, context, count) {
    if (iteratee == null) {     // 没传的话就取默认迭代器
      return _.identity;
    }

    if (_.isFunction(iteratee)) {
      return optimizeCb(iteratee, context, count);
    }
  }

  // optimizeCb优化迭代器
  // 根据count返回参数个数，默认是3个
  var optimizeCb = function(func, context, count) {
    if (context == void 0) {
      return func;
    }

    switch (count == null ? 3 : count) {
      case 1:
        return function (value) {
          return func.call(context, value);
        }
      case 3:
        return function(value, index, obj) {
          return func.call(context, value, index, obj);
        }
    }
  }

  // 默认迭代器
  _.identity = function(value) {
    return value;
  }

  // rest 参数
  _.restArguments = function(func) {
    // rest参数位置
    var startIndex = func.length - 1;
    return function() {
      var length = arguments.length - startIndex,
        rest = Array(length),
        index = 0;
      // rest数组中的成员 rest==[2,3,4]
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      // 非rest参数成员的值一一对应
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }

      args[startIndex] = rest;          // [1, [2,3,4]]
      return func.apply(this, args);
    }
  }

  // Object.create polyfill
  var Ctor = function() {};

  _.baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (Object.create) return Object.create(prototype);

    // 如果没有Object.create，通过一个构造函数Ctor曲线创建对象，让它的原型指向传入的prototype
    // 创建一个构造函数的实例对象，并返回；
    // 最后记得要清掉Ctor.prototype的引用，避免下次再调用时污染
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
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
  _.isFunction = function(func) {
    return toString.call(func) === "[object Function]";
  }
  _.isObject = function(obj) {
    return toString.call(obj) === "[object Object]";
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