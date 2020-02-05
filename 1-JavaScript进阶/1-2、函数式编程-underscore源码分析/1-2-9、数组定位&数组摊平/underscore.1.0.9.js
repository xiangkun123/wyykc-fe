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
      result[index] = iteratee(obj[currentKey], currentKey, obj);
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
      case 4:
        return function(memo, value, index, obj) {
          return func.call(context, memo, value, index, obj);
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

  var createReducer = function(dir) {
    // iteratee是case=4的匿名函数
    var reduce = function(obj, iteratee, memo, init) {
      var keys = !_.isArray(obj) && Object.keys(obj),
        length = (keys || obj).length,
        index = dir > 0 ? 0 : length -1;

      // 如果没传初始值，需要将遍历的第一个值变成初始值
      if (!init) {
        memo = obj[keys ? keys[index] : index];
        index += dir;   //1
      }

      // 遍历每一次返回的结果更新memo
      for (; index >=0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }

      return memo;
    }
    
    // _.reduce指向这个匿名函数
    return function(obj, iteratee, memo, context) {
      var init = arguments.length >= 3;             // 判定是否有传入初始值 
      return reduce(obj, optimizeCb(iteratee, context, 4), memo, init);
    };
  }

  // 1: 正序, 2: 倒序
  _.reduce = createReducer(1);

  // predicate 真值检测（重点: 返回值）
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, obj) {
      if (predicate(value, index, obj)) results.push(value); 
    });
    return results;
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


  // dir: 1 => 正序遍历 -1 => 倒序遍历
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context); // _.isNaN
      var length = array.length;
      // 根据dir变量来确定数组遍历的起始位置
      var index = dir > 0 ? 0 : length - 1;

      // 遍历查找返回符合条件的下标值
      for(; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }

      return -1;
    };
  }

  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // 二分查找方法
  _.sortedIndex = function(array, obj, iteratee, context) {
    // 重点:cb函数 if (iteratee == null) {return function(value){return value;}}
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0,
      high = array.length;

    // 二分查找
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value)
        low = mid + 1;
      else
        high = mid;
    }

    return low;
  }

  function createIndexFineder(dir, predicateFind, sortedIndex) {
    // API 调用形式
    // _.indexOf(array, value, [isSorted])
    return function(array, item, idx) {
      var i = 0,
        length = array.length;
      
      // sortedIndex为true时，序列是已经排序过的，使用二分查找，优化性能
      if (sortedIndex && _.isBoolean(idx) && length) {
        // 使用 _.sortedIndex 来查找 item 的位置
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }

      // 特殊情况 如果查找的元素是NaN类型 NaN !== NaN
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >=0 ? idx + i : -1;
      }

      // 非上述情况正常遍历
      for (idx = dir > 0 ? i : length-1; idx>= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }

      return -1;
    };
  }

  // _.findIndex 特殊情况下的处理方案 NaN
  // _.sortedIndex 针对排序的数组做二分查找 优化性能
  _.indexOf = createIndexFineder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFineder(-1, _.findLastIndex);

  // 返回一个 [min, max] 范围内的任意整数
  // Math.random() 取值是[0,1)，为了让1也能取到，这里通过+1后再向下取整
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  // 创建对象的副本
  _.clone = function(obj) {
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  }

  // 抽样函数-洗牌算法
  _.sample = function(array, n) {
    if (n == null) {
      return array[_.random(array.length - 1)];
    }
    var sample = _.clone(array);
    var length = sample.length;
    var last = length-1;
    n = Math.max(Math.min(n, length), 0);   // 防止传入的n比数组长度还大

    // 洗牌算法需要两个参数：随机数、index
    for(var index = 0; index<n; index++) {
      var rand = _.random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];   // 交换
      sample[rand] = temp;            // 交换
    }
    return sample.slice(0, n);
  }

  // 返回乱序之后的数组副本，这里没有传入 array.length，而是传入Infinity，显得更优雅
  _.shuffle = function(array) {
    return _.sample(array, Infinity);
  }

  // 摊平数组方法
  var flatten = function(array, shallow) {
    var ret = [];
    var index = 0;
    for (var i = 0; i < array.length; i++) {
      var value = array[i];   // 展开一次
      if (_.isArray(value) || _.isArguments(value)) {
        // 递归全部展开
        if (!shallow) {
          value = flatten(value, shallow);
        }
        var j = 0,
          len = value.length;
        ret.length += len;
        while (j < len) {
          ret[index++] = value[j++];
        }
      } else {
        ret[index++] = value;
      }
    }
    return ret;
  }

  // 摊平数组
  _.flatten = function(array, shallow) {
    return flatten(array, shallow);
  }

  // 返回数组中除了最后n个元素外的其他元素，在arguments对象上有用
  _.initial = function(array, n) {
    return [].slice.call(array, 0, Math.max(0, array.length - (n == null ? 1 : n) ));
  }

  // 返回数组中除了第n个元素外的其他全部元素
  _.rest = function(array, n) {
    return [].slice.call(array, n == null ? 1: n);
  }

  // each遍历
  _.each = function(target, callback) {
    var key, i = 0;
    if (_.isArray(target)) {                  // 区分对象还是数组
      var length = target.length;
      for(; i<length; i++) {
        callback.call(target, target[i], i, target);
      }
    } else {
      for (key in target) {
        callback.call(target, key, target[key], target);
      }
    }
  }

  // 类型检测
	_.isArray = function(array) {
		return toString.call(array) === "[object Array]";
	}
  _.each(["Function", "String", "Object", "Number", "Boolean", "Arguments", "NaN"], function(name) {
		_["is" + name] = function(obj) {
			return toString.call(obj) === "[object " + name + "]";
		}
	});

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