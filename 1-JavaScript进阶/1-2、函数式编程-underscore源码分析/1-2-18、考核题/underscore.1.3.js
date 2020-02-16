
(function(root) {

    // 如果外边有定义_这个变量，先保存起来
    var previousUnderscore = root._;

    /**
     * score的构造函数
     * 初始化时参数obj是传入的数据
     */
    var _ = function(obj) {
        
        // 传入的数据是否是score的实例，是就返回数据本身
        if(obj instanceof _) {
            return obj
        }

        // this是否是score的实例，第一次进入的时候是window，return完再调用进入就是sroce实例
        if(!(this instanceof _)) {
            return new _(obj)
        }

        // 将数据挂载到实例的_wrapped属性上
        this._wrapped = obj;
    }


    // 开启链接式调用
    _.chain = function(obj) {
        // 创建一个score实例并扩展开启链式调用标识
        var instance = _(obj)
        instance._chain = true
        return instance
    }

    /**
     * 辅助函数
     * 如果有chain标识，就一直让数据带上chain返回
     * @param {*} instance 当前的实例
     * @param {*} obj 可以理解为在上一管道返回的数据，_(obj)获取新的score实例（新数据），再调用chain()开启链式标识
     */
    var result = function(instance, obj) {
        return instance._chain ? _(obj).chain() : obj;
    }


    // 数组去重
    _.unique = function(arr, callback) {
        var ret = [];
        var target,i=0;
        // 遍历每一项（如果有cb调用cb），判断是否已存在在缓存数组中
        for(;i<arr.length;i++) {
            target = callback ? callback(arr[i]): arr[i];
            if(ret.indexOf(target) === -1) {
                ret.push(target)
            }
        }
        return ret;
    }

    /**
     * @function map 生成一一对应的对象
     * @param obj 迭代对象
     * @param iteratee 迭代函数
     * @param context 上下文对象，迭代函数中的this指向
     */
    _.map = function (obj, iteratee, context) {
        
        // 生成不同功能迭代器，没传就返回默认迭代器
        var iteratee = cb(iteratee, context);

        // 分辨 obj 是数组对象还是 object 对象（keys: object对象，index: array对象）
        var keys = !_.isArray(obj) && Object.keys(obj);
        var length = (keys || obj).length;
        var result = Array(length);

        // 通过for调用迭代函数传入每一项
        for(var i=0; i<length; i++) {
            var currentKey = keys ? keys[i] : i;
            result[i] = iteratee(obj[currentKey], currentKey, obj);
        }

        // 返回最终结果
        return result;
    }

    /**
     * @function createReduce 创建一个reduce迭代器
     * @param obj 迭代对象
     * @param iteratee 迭代函数
     * @param memo 初始值
     * @param context 上下文对象，迭代函数中的this指向
     */
    var createReduce = function(dir) {
        var reduce = function (obj, iteratee, memo, init) {

            // 分辨 obj 是数组对象还是 object 对象（keys: object对象，index: array对象）
            var keys = !_.isArray(obj) && Object.keys(obj),
                length = (keys||obj).length,
                // 初始值下标
                index = dir > 0 ? 0 : length - 1;

            // 是否传入了初始值
            if(!init) {
                memo = obj[ keys ? keys[index]: index];
                index += dir;
            }
            
            // 遍历迭代对象，并将返回值储存下来
            for (; index>=0 && index< length; index += dir) {
                var currentKey = keys ? keys[index] : index;
                memo = iteratee(memo, obj[currentKey], currentKey, obj);
            }
    
            // 返回最终结果
            return memo;
        }

        // memo 代表初始值
        return function(obj, iteratee, memo, context) {

            // 如果大于等于代表初始值有传入
            var init = arguments.length >= 3;
            
            return reduce(obj, optimizeCb(iteratee, context, 4), memo, init);
        }
    }

    // 1 代表正序 || -1 代表倒序
    _.reduce = createReduce(1);


    /**
     * score 中的真值检测函数
     * @function filter 过滤函数
     * @param obj 迭代对象
     * @predicate 真值检测函数
     * @context 上下文对象，迭代函数中的this指向
     */
    _.filter = _.select = function (obj, predicate, context) {
        
        var results = [];

        // 拿到迭代函数
        predicate = cb(predicate, context);
        // 通过已写好的each方法，不需要自行再判断数组或者对象
        _.each(obj, function(value, index, list) {
            // 返回自定义函数的真值(return true的值)，存入数组
            if(predicate(value, index, list)) results.push(value);
        });

        return results;
    }


    /**
     * @function cb 生成不同功能迭代器
     * @param iteratee 迭代函数
     * @param context 上下文对象，迭代函数中的this指向
     * @param count 生成迭代器的参数数量要求，如果传入一个 1，那生成的就是1个
     */
    var cb = function (iteratee, context, count) {

        // 没有传入迭代函数，就生成一个默认迭代器
        if(iteratee == null) {
            return _.identity;
        }

        // 传入就通过 optimizeCb() 来生成最终的迭代器
        if(_.isFunction(iteratee)) {
            return optimizeCb(iteratee, context, count);
        }
    }

    // 默认迭代器
    _.identity = function(value) {
        return value;
    }

    // optimizeCb优化迭代器
    var optimizeCb = function(func, context, count) {

        // 如果没有传入上下文就直接返回迭代器函数
        if (context == void 0) {
            return func;
        }

        switch (count == null ? 3 : count) {
            case 1:
                return function(value) {
                    return func.call(context, value)
                }
            case 3:
                return function (value, index, obj) {
                    return func.call(context, value, index, obj)
                }
            case 4:
                return function(prev, value, index, obj) {
                    return func.call(context, prev, value, index, obj)
                }
        }

    }

    // 直接在score原型上扩展一个values方法，获取instance（score实例对象）的_wrapped属性中的数据
    _.prototype.values = function () {
        return this._wrapped;
    }

    // 实现 rest 自由参数
    _.restArguments = function(func) {
        // 获取到rest参数的开始位置(囊括剩余实参的开始位置)
        var restIndex = func.length-1;

        // 返回传入实参的函数
        return function() {
            // 获取剩余长度(rest数组长度)
            var length = arguments.length - restIndex,
                rest = Array(length),
                i=0,j=0;

            // rest元素数组
            for (; i<length; i++) {
                rest[i] =  arguments[restIndex + i];
            }

            // 非rest参数成员值一一对应（这里加1是把添加一个最后位置留给rest）
            var args = Array(restIndex + 1);
            for(; j<restIndex; j++) {
                args[j] = arguments[j];
            }

            args[restIndex] = rest;

            // 回调函数，this指向上下文的window，参数大概这个样子[...args, [...rest]]
            return func.apply(this, args);
        }
    }


    // Object.create() ployfill兼容
    var Ctor = function() {}
    
    var baseCreate = function(prototype) {

        // 是否是对象，不是直接返回一个空对象
        if(!_.isObject(prototype)) return {};

        // 当前环境是否直接 Object.create()，支持就直接用 Object.create()
        if(Object.create) return Object.create(prototype);

        /**
         * 如果不存在 Object.create() 的思路：
         * 将一个构造函数 Ctor 指向传入的对象 prototype，创建该构造函数的实例对象 result，并返回 result
         * 把构造函数 Ctor 的 prototype 属性引用设为null
         */
        Ctor.prototype = prototype;
        var result = new Ctor;
        Ctor.prototype = null;
        return result;
    }



    // 是否是对象（类型检测）
    _.isObject = function(obj) {
        return toString.call(obj) === '[object Object]';
    }

    // 是否是函数（类型检测）
    _.isFunction = function(obj) {
        return toString.call(obj) === '[object Function]';
    }

    // 是否是数组（类型检测）
    _.isArray = function(array) {
        return toString.call(array) === '[object Array]';
    }


    // 传入一个对象(score)，遍历该对象的可枚举属性，返回一个键名数组
    _.functions = function(obj) {
        var result = [];
        var key;
        for (key in obj) {
            result.push(key);
        }
        return result;
    }

    // 传入一个target（可为对象或数组），遍历该对象的可枚举属性，如果有callback，给每一项添加执行callback
    _.each = function(target, callback) {
        var key, i = 0;

        // 判断target是否是数组
        if(_.isArray(target)) {
            var length = target.length
            for (;i < length; i++) {
                callback.call(target, target[i], i, target);            // 回调并返回 cb(数组元素(对象的key), index, 原始数组)
            }
        } else {
            for (key in target) {
                callback.call(target, target[key], key, target);        // 回调并返回 cb(对象的值, 对象的key, 原始对象)
            }
        }
    }

    /**
     * mixin: 用于在score原型上扩展方法
     * 大致思路：
     * 传入score，通过functions获取score上的所有可枚举属性和方法得到一个数组[key1, key2, ....]
     * 通过each遍历得到的数组的每一项为func，然后在score的原型上添加该方法
     * 最终达到在score原型上扩展score的静态方法
     */
    _.mixin = function(obj) {
        _.each(_.functions(obj), function(name) {
            var func = obj[name]

            // 原型上扩展score静态方法
            _.prototype[name] = function() {
                // 将初始化储存的数据先放到一个数组args
                var args = [this._wrapped]

                // 接着往args数组中插入传入的参数或者方法
                Array.prototype.push.apply(args, arguments)     //args=[this._wrapped, callback]

                // 没有链接式调用时能实现当前需求
                // return func.apply(this, args)

                // result(this: 普通实例对象, instance: (如果调用chain()就有_chain标识,没有调用就没有)具有链式标识的实例对象)
                return result(this, func.apply(this, args));
            }
        });
    }

    _.mixin(_);

    /**
     * noConflict: 让underscore放弃对 _ 符号的控制，返回一个underscore对象的引用
     * 思路：
     *  1、在 underscore.js 的闭包中顶部先获取到外部的 ‘_’ 变量，保存为 previousUnderscore
     *  2、在调用 _.noConflict() 方法时，把 previousUnderscore 值赋值给外部的 ‘_’ 变量，并且返回让该方法返回Underscore 对象的引用
     */
    _.noConflict = function() {
        root._ = previousUnderscore;
        return this;
    }

    root._ = _;

})(this);
