// 连接redis
// 引入
const redis = require("redis");
const client = redis.createClient(6379, "192.168.33.128");
// console.log(client);           // 如果能打印出东西，证明已经建立连接

// 把回调函数抽出来，后面直接使用
const cb = (err, data) => {
	console.log("err:", err, "data:", data);
};

// 1、String类型
// var res = client.set("name", "张三", cb); // err: null data: OK，res的值是true
// client.get("name", cb);

// client.set("age", 20, cb);
// client.get("age", cb);
// client.incr("age", cb); // 将键的整数值增加1

// 2、List类型
// 右侧推入
// client.rpush("friends", "王五", "赵六", cb);
// client.lrange("friends", 0, -1, cb);
// 左侧推入
// client.lpush("friends", "田七", "王八", cb);
// client.lrange("friends", 0, -1, cb);

// 右侧弹出
// client.rpop("friends", cb);
// 左侧弹出
// client.lpop("friends", cb);

// 查找特定指定位置的值
// client.lindex("friends", 1, cb);
// client.lrange("friends", 0, -1, cb);
// // 裁剪
// client.ltrim("friends", 1, 2, cb);
// client.lrange("friends", 0, -1, cb);

// 3、Set类型
// // 往集合ids中加几个元素
// client.sadd("ids", 1, 2, cb); 		// err: null data: 2
// //查看集合元素
// client.smembers("ids", cb); 			// err: null data: [ '1', '2' ]
// //从集合中删除元素
// client.srem("ids", 2, cb); 				// err: null data: 1
// //查看集合元素
// client.smembers("ids", cb); 			// err: null data: [ '1' ]
// //看看集合的元素个数
// client.scard("ids", cb); 					// err: null data: 1
// //继续添加新元素
// client.sadd("ids", 3, 5, 8, 9);
// //判断元素是否在集合内
// client.sismember("ids", 8, cb); 	// err: null data: 1
// client.sismember("ids", 80, cb); 	// err: null data: 0

// 4、Hash类型
// 往散列上添加多组键值对
client.hmset("phone", "price", 5888, "name", "iphonex", cb); // err: null data: OK
// 查看多个键的值
client.hmget("phone", "price", "name", cb); // err: null data: ['5888', 'iphonex']
// 查看键值对的数量
client.hlen("phone", cb); // err: null data: 2
// 删掉其中一个键值对
client.hdel("phone", "price", cb); // err: null data: 1
// 看看price是否还在
client.hmget("phone", "price", cb); // err: null data: [null]
// 再加几个属性
client.hmset("phone", "vendor", "apple", "madein", "china", cb);
// 取出所有的键值对
client.hgetall("phone", cb); // err: null data: { name: 'iphonex', vendor: 'apple', madein: 'china' }
// 取出所有的键
client.hkeys("phone", cb); // err: null data: ['name', 'vendor', 'madein']
// 取出所有的值
client.hvals("phone", cb); // err: null data: ['iphonex', 'apple', 'china']
// 判断键是否存在
client.hexists("phone", "name", cb); // err:  null data: 1
client.hexists("phone", "price", cb); // err: null data: 0
