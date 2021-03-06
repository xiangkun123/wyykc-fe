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
  
  // _.unique原数组去重代码
  // _.unique = function(arr, callbacks) {
  //   var ret = [];
  //   var target,i=0;
  //   for (;i < arr.length; i++) {
  //     target = callbacks ? callbacks(arr[i]) : arr[i];
  //     if (ret.indexOf(target) === -1) {
  //       ret.push(target);
  //     }
  //   }
  //   return ret;
  // }

  // _.unique数组去重新代码
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    // 没有传入 isSorted 参数
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }

    // 如果有迭代函数
    if (iteratee != null)
      iteratee = cb(iteratee, context);
    
    var result = [];
    // 用来过滤重复值
    var seen;

    for (var i = 0; i < array.length; i++) {
      var computed = iteratee ? iteratee(value, i, array) : array[i];
      // 如果是有序数组，则当前元素只需跟上一个元素对比即可
      // 用seen变量保存上一个元素
      if (isSorted) {
        if (!i || seen !== computed) result.push(computed);
        // seen 保存当前元素，供下一次对比
        seen = computed;
      } else if (result.indexOf(computed) === -1 ) {
        result.push(computed);
      }
    }

    return result;
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

  // 去掉数组中所有的假值
  // _.identity=function(value) {return value;}
  _.compact = function(array) {
    return _.filter(array, _.identity);
  }

  // 返回某一个范围内的数组成的数组
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 1;
    }

    step = step || 1;

    // 返回数组的长度 返回大于等于参数x的最小整数 向上取整
    var length = Math.max(Math.ceil((stop - start) / step), 0);
    // 返回的数组
    var range = Array(length);
    for (var index = 0; index < length; index++, start += step) {
      range[index] = start;
    }
    return range;
  }

  // 偏函数
  _.partial = function(func) {
    // 提取参数，从下标为1的位置开始切割
    var args = [].slice.call(arguments, 1);

    var bound = function() {
      var index = 0;
      var length = args.length;
      var ret = Array(length);
      
      for (var i = 0; i < length; i++) {
        ret[i] = args[i];
      }
      
      while (index < arguments.length) {
        ret.push(arguments[index++]);
      }
      
      return func.apply(this, ret);
    }

    return bound;
  }

  // 判断对象是否有该属性
  _.has = function(obj, key) {
		return obj != null && hasOwnProperty.call(obj, key);
	};

  //存储中间运算结果,提高效率
	//参数hasher是个function通过返回值来记录key
	//_.memoize(function, [hashFunction])
	// 适用于需要大量重复求值的场景
	// 比如递归求解斐波那契数
  _.memoize = function (func, hasher) {
    var memoize = function(key) {
      // 储存变量，方便使用
      var cache = memoize.cache;

      // 求key
      // 如果传入了 hasher,则用hasher函数来记录key
      // 否则用参数key(即memoize方法传入的第一个参数)当key
      var address = "" + (hasher ? hasher.apply(this, arguments) : key);
      // 如果这个key还没被求过值 先记录在缓存中
      if (!_.has(cache, address)) {
        cache[address] = func.apply(this, arguments);
      }

      return cache[address];
    };

    // cache 对象被当做 key-value 键值对缓存中间运算结果
    memoize.cache = {};
    return memoize;
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

  // 延迟执行函数
  _.delay = function(func, wait) {

    var args = [].slice.call(arguments, 2);

    return setTimeout(function() {
      func.apply(null, args);
    }, wait);
  }

  // 函数组合
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1; // 倒序调用

    return function() {
      var i = start;
      var result = args[i].apply(null, arguments);
      while(i--) {
        result = args[i].call(null, result);
      }
      return result;
    }
  }

  // 实体编码
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  var createEscaper = function(map) {
    // replace
    var escaper = function(match) {
      return escapeMap[match];
    }
    // 将所有属性变成一个正则
    var source = '(?:' + Object.keys(map).join("|")+')';
    var testRegExp = new RegExp(source, "g");
    // console.log(testRegExp);

    return function(string) {
      return testRegExp.test(string) ? string.replace(testRegExp, escaper) : string;
    }
  }

  _.escape = createEscaper(escapeMap);

  // 获取时间戳，单位：毫秒
  _.now = Date.now;

  /**
   * 节流函数
   *  func 处理函数
   *  wait 指定毫秒
   *  options 配置
   *    { 
   *      leading:false，配置了false，那么处理函数不会立即执行，而是等待wait毫秒后执行
   *      trailing:false，配置了false，回调函数最后一次不会执行回调函数
   *    }
   *  leading 和 trailing 不能同时用
   */
  _.throttle = function(func, wait, options) {
    var context,args, result;
    var timeout = null;
    // 上次在执行回调的时间戳   初始值
    var lastTime = 0;

    if (!options) {
      options = {};
    }

    // 在调用回调时，重置lastTime
    var later = function() {
      lastTime = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
    };

    return function() {
      var now = _.now();
      
      // 是否配置leading
      if(!lastTime && options.leading === false) {
        // 将lastTime时间戳设置为now
        lastTime = now;
      }

      // 距离下一次调用func，还要等待多久
      // 如果没有配置leading，那么lastTime=0;remaining肯定是一个负数
      // 如果配置了leading，那么 now-lastTime=0; wait-0=1000
      var remaining = wait - (now-lastTime);
      // console.log(remaining);

      context = this;
      args = arguments;

      // remaining为负数，那么就立即执行处理函数
      if (remaining <= 0) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        lastTime = now;
        result = func.apply(context, args);

      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }

  /**
   * func 处理函数
   * wait 等待时间
   *  immediate === false 等待wait毫秒后去调用处理函数
   *  immediate === true 立即执行处理函数
   */
  _.debounce = function(func, wait, immediate) {
    
    // 上一次在执行回调的时间戳 初始执行时的初始值
    var lastTime;
    var timeout,context,args, result;

    var later = function() {
      // 定时器回调later方法调用的时间戳和debounce执行它返回的匿名函数最后一次的时间戳的间隔
      var last = _.now() - lastTime;
      console.log(last);

      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
        }
      }
    }

    return function() {
      context = this;
      args = arguments;

      lastTime = _.now();
      // 立即执行触发必须满足两个条件 immediate=true timeout=undefined
      var callNow = immediate && !timeout;

      // 如果 immediate=false 执行这里
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }

      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }
      
      return result;
    };
  }

  // 检测对象是否有某个属性
  var hasOwnProperty = Object.hasOwnProperty;
  _.has = function(obj, key) {
    return obj !== null && hasOwnProperty.call(obj, key);
  }


  // 正常浏览器下=>true，ie特定的版本会有问题
  var hasEnumbug = ({ toString: null }).propertyIsEnumerable("toString");
  // Object.prototype上不可枚举属性的集合
  var collectNotEnumProps = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
  
  // 获取object对象上所有属性的名称（自身可枚举属性）
  // 这里可以传入一个函数或者对象，函数本身也是对象，所以重写一下 _.isObject
  _.keys = function(obj) {
    var prop;

    if (!_.isObject(obj)) {return []};

    // 判断浏览器是否支持Object.keys()，优先使用
    if(Object.keys) {
      return Object.keys(obj);
    }

    var result = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        result.push(key);
      }
    }

    // 兼容IE<9下的某个版本不支持返回重载的可枚举属性，但实际上这个bug已经被修复了
    if(!hasEnumbug) {
      for(var i=0,length=collectNotEnumProps.length; i<length; i++) {
        prop = collectNotEnumProps[i];
        if (obj[prop] !== obj.__proto__[prop]) {   // 判断是否有Object上的重载的不可枚举属性
          result.push(prop);
        }
      }
    }

    return result;
  }

  // 获取object对象上所有属性的名称（自身+原型链可枚举的属性）
  _.allKeys = function(obj) {
    var prop;
    if (!_.isObject(obj)) {
      return []
    };

    var result = [];
    for (var key in obj) {
      result.push(key);
    }

    // 兼容IE<9下的某个版本不支持返回重载的可枚举属性，但实际上这个bug已经被修复了
    if(!hasEnumbug) {
      for(var i=0,length=collectNotEnumProps.length; i<length; i++) {
        prop = collectNotEnumProps[i];
          if (obj[prop] !== obj.__proto__[prop]) {   // 判断是否有Object上的重载的不可枚举属性
            result.push(prop);
        }
      }
    }

    return result;
  }

  // 获取对象上所有属性的值
  _.values = function(obj) {
    var result = [];
    var value;

    var keys = _.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      value = obj[keys[i]];
      result.push(value);
    }

    return result;
  }

  // 键值对对换
  _.invert = function (obj) {
    var result = {};
    var prop;
    
    var keys = _.keys(obj);

    for (var i = 0; i < keys.length; i++) {
      prop = obj[keys[i]];
      result[prop] = keys[i];
    }

    return result;
  }

  var createAssigner = function(func) {
    return function(obj) {
      var length = arguments.length;

      // 如果obj=null或者只传入一个参数，直接返回
      if (length < 2 || obj == null) { return obj; }

      // 遍历所有属性
      for (var i=1; i<length; i++) {
        var source = arguments[i]
        var keys = func(source);
        var len = keys.length;
        for (var j=0; j<len; j++) {
          var key = keys[j];
          obj[key] = source[key];
        }
      }

      return obj;
    }
  }

  _.extend = createAssigner(_.allKeys);			// 自身对象+原型链上的可枚举属性
  _.extendOwn = createAssigner(_.keys);			// 自身对象上可枚举的属性


  // _.clone 浅克隆
  _.clone = function(obj) {

    // 不是object类型直接返回本身
    if (!_.isObject(obj)) {
      return obj;
    }

    // 创建副本
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  }

  // _.deepClone 深克隆
  _.deepClone = function (obj) {

    // 待克隆的对象是数组还是object
    if (_.isArray(obj)) {

      return _.map(obj, function(elem) {
        return _.isArray(elem) || _.isObject(elem) ? _.deepClone(elem) : elem;
      });

    } else if(_.isObject(obj)) {
      
      //调用reduce实际回调调用 return func.call(context, memo, value, index, obj);
      return _.reduce(obj, function(memo, value, key) {
        memo[key] = _.isArray(value) || _.isObject(value) ? _.deepClone(value) : value;
        return memo;
      }, {});

    } else {
      return obj;
    }

  }

  /**
   * 第二个参数可以是字符串或者回调函数
   */
  _.pick = function(object, oiteratee, context) {
    var result = {};
    var iteratee, keys;
    if (object == null) {
      return result;
    }

    // 如果第二个参数是函数
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(object);
      // 生成迭代器 oiteratee 封装
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = [].slice.call(arguments, 1);
      iteratee = function(value, key, object) {       // 如果是传字符串，没有迭代器，自己定义一个
        return key in object;
      }
    }

    for (var i=0, length = keys.length; i<length; i++) {
      var key = keys[i];
      var value = object[key];
      if (iteratee(value, key, object)) {
        result[key] = value;
      }
    }

    return result;
  }


  // obj 可以是函数或者对象
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === "function" || type === "object";
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
  _.each(["Function", "String", "Number", "Boolean", "Arguments", "NaN"], function(name) {
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