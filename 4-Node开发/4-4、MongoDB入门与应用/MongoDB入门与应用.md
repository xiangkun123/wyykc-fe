# MongoDB入门与应用

---

## MongoDB简介

> MongoDB是一个基于分布式文件存储的数据库。由C++语言编写，旨在为WEB应用提供可扩展的高性能数据存储解决方案。
>
> MongoDB是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。它支持的数据结构非常松散，是类似json的bson格式，因此可以存储比较复杂的数据类型。Mongo最大的特点是它支持的查询语言非常强大，其语法有点类似于面向对象的查询语言，几乎可以实现类似关系数据库单表查询的绝大部分功能，而且还支持对数据建立索引。

- MongoDB特性
  - 高可扩展性
  - 没有复杂关系
  - 低成本
  - 架构灵活
  - 半结构化数据
  - ...

## MongoDB 安装与配置

### 安装

版本： MongoDB Community Edition

网址：https://www.mongodb.com

- rpm安装

  https://www.mongodb.com/download-center/community

- 源码安装

  https://fastdl.mongodb.org/src/mongodb-src-r4.2.3.tar.gz

- yum 安装

  - 查看文档Installation
  - Install on Linux
  - 配置yum源（可采用阿里云源，国内镜像）

### 配置文件详解

/etc/mongod.conf

```shell
systemLog: 											# 日志配置
  destination: file 						 # 文件形式
  logAppend: true								 # 日志追加
  path: /var/log/mongodb/mongod.log	# 日志文件路径
  
storage:													# 存储配置
  dbPath: /var/lib/mongo					 # 数据存储路径
  # 是否开启 journal 日志持久存储，journal 日志用来数据恢复，是 mongod 最基础的特性，通常用于故障恢复。64 位系统默认为 true，32 位默认为 false，建议开启，仅对 mongod 进程有效。
  journal：
    enabled: true
    
processManagement:							# 进程管理
  fork: true  # 运行在后台
  pidFilePath: /var/run/mongodb/mongod.pid  # PID 文件路径
  timeZoneInfo: /usr/share/zoneinfo

net:				# 网络配置
  port: 27017				# 默认端口
  bindIp: 127.0.0.1  # 绑定ip， 多个用逗号分隔
  
security: 
	# disabled 或者 enabled，仅对 mongod 有效；表示是否开启用户访问控制（Access Control），即客户端可以通过用户名和密码认证的方式访问系统的数据，默认为 “disabled”，即客户端不需要密码即可访问数据库数据。（限定客户端与 mongod、mongos 的认证）
  authorization: enabled 
  # 集群中 members 之间的认证模式，可选值为 “keyFile”、“sendKeyFile”、“sendX509”、“x509”，对 mongod/mongos 有效；默认值为 “keyFile”，mongodb 官方推荐使用 x509，不过我个人觉得还是 keyFile 比较易于学习和使用。不过 3.0 版本中，mongodb 增加了对 TLS/SSL 的支持，如果可以的话，建议使用 SSL 相关的配置来认证集群的 member，此文将不再介绍。（限定集群中 members 之间的认证）
  clusterAuthMode: keyFile 
  # 当 clusterAuthMode 为 “keyFile” 时，此参数指定 keyfile 的位置，mongodb 需要有访问此文件的权限。
  keyFile: /srv/mongodb/keyfile 
  # true 或者 false，默认为 true，仅对 mongod 有效；表示是否关闭 server 端的 javascript 功能，就是是否允许 mongod 上执行 javascript 脚本，如果为 false，那么 mapreduce、group 命令等将无法使用，因为它们需要在 mongod 上执行 javascript 脚本方法。如果你的应用中没有 mapreduce 等操作的需求，为了安全起见，可以关闭 javascript。
  javascriptEnabled: true 
```

## MongoDB 数据查询与应用

### 基础概念

- 文档：数据的基本单元，相当于关系型数据库中的行
  - 由键值对组成的有序集
  - 不仅区分大小写，还区分数据类型
- 集合：多个文档组成集合，文档可以是不同的结构，相当于关系型数据库中的表
  - 不能以system开头，且不能使用保留字符
  - 动态模式可以使一个集合中包含多样化文档对象
- 数据库：多个集合聚合组成数据库
  - 数据库名称区分大小写
  - 几个特殊意义的数据库：admin(用户数据)、local(本地数据)、config(配置数据)

### 客户端shell

> - 客户端shell可以使用命令行与MongoDB实例进行交互。
> - 它是一个功能完备的JavaScript解释器，所以又称为JavaScript shell，可以运行任意JavaScript代码。
> - 通过shell可以对数据进行基本操作：CURD

- mongo 运行js

  ```javascript
  // 创建 run.js 文件
  var userName = '张三';
  var timeStamp = Date.parse(new Date());
  var insertData = {
      loginUser: userName,
      loginTime: timeStamp 
  };
  
  var db = connect('log');   // 链接数据库
  var msg = db.login.insert(insertData); // 创建 login 集合插入数据
  
  print(msg);
  ```

- 批量插入

  ```javascript
  // 更改 run.js 文件
  var userName = '张三';
  var timeStamp = Date.parse(new Date());
  var loginData = {
      loginUser: userName,
      loginTime: timeStamp
  };
  var insertData = [loginData];
  
  for (let i = 0; i < 1000; i++) {
      insertData.push({count: i});
  }
  
  var db = connect('log'); // 链接数据库
  var msg = db.login.insert(insertData); // insert() 中可以传入数组用于批量插入数据
  
  print(msg);
  ```

### MongoDB连接

```shell
// 标准URI连接语法
mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
```

- mongodb://   						uri协议，固定格式
- username:password@		可选，连接数据库用户验证
- host			必须指定至少一个host，如果连接复制集，可指定多个主机地址
- port				可选，默认为27017
- /database				连接数据库名称，若不指定默认打开test数据库
- ?options					连接选项

### 用户管理

MongoDB数据库默认是没有用户名及密码的，即无权限访问限制。为了方便数据库的管理和安全，需创建数据库用户。

| 权限                 | 说明                                                         |
| -------------------- | ------------------------------------------------------------ |
| read                 | 允许用户读取指定数据库                                       |
| readWrite            | 允许用户读写指定数据库                                       |
| dbAdmin              | 允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问system.profile |
| userAdmin            | 允许用户向system.users集合写入，可以找指定数据库里创建、删除和管理用户 |
| clusterAdmin         | 只在admin数据库中可用，赋予用户所有分片和复制集相关函数的管理权限 |
| readAnyDatabase      | 只在admin数据库中可用，赋予用户所有数据库的读权限            |
| readWriteAnyDatabase | 只在admin数据库中可用，赋予用户所有数据库的读写权限          |
| userAdminAnyDatabase | 只在admin数据库中可用，赋予用户所有数据库的userAdmin权限     |
| dbAdminAnyDatabase   | 只在admin数据库中可用，赋予用户所有数据库的dbAdmin权限       |
| root                 | 只在admin数据库中可用。超级账号，超级权限                    |

```javascript
db.createUser({
	user:	'<name>',
	pwd: 	'<cleartext password>',
	roles: [
		{role: '<role>', db: '<database>'} | '<role>',
		...
	]
});
```

### 数据库、集合操作

- use database		切换数据库，如果不存在则创建
- show dbs				查看所有数据库
- db					查看当前数据库
- db.dropDatabase()		删除当前数据库
- db.createCollection('collection')		创建集合
- db.collection.renameCollection ('x')		重命名集合

```javascript
show dbs;
use test;
db.dropDatabase();

db.createCollection('haha');
db.haha.renameCollection('heihei');
db.heihei .drop();
```



### 文档操作

- db.collection.insert(document)		插入文档
- db.collection.update(query,update) 	更新文档
- db.collection.deleteOne(query)		删除单个文档
- db.collection.deleteMany(query)		删除多个文档
- db.collection.find(query,projection)	查找文档
- ...

### $特殊符号

- $lt / $lte		小于(<) / 小于等于(<=)
- $gt / $gte		大于(>) / 大于等于(>=)
- $ne		不等于(!=)
- $or		条件查询 or
- $set		update操作时set
- $unset	删除字段
- ...

```javascript
// 插入
db.heihei.insert({title: '网易云课堂', 
    description: '网易云课堂微专业',
    by: '网易Evan',
    url: 'http://study.163.com',
    tags: ['mongodb', 'database', 'NoSQL'],
    likes: 100
});

db.heihei.find();


db.heihei.update({'title':'网易云课堂'},{$set:{'title':'MongoDB'}})
db.heihei.find().pretty();

// 删除
db.heihei.deleteOne( { status: "D" } );
db.heihei.deleteMany({ status : "A" });

// 查询
db.heihei.find().pretty();
db.heihei.findOne().pretty();

// and 查询
db.heihei.find({"by":"网易云课堂", "title":"MongoDB"}).pretty();
// or 查询
db.heihei.find({$or:[{"by":"网易云课堂"},{"title": "MongoDB"}]}).pretty()
db.heihei.find({"likes": {$gt:50}, $or: [{"by": "网易云课堂"},{"title": "MongoDB"}]}).pretty()


// limit skip
db.heihei.find({},{"title":1,_id:0}).limit(2);
db.heihei.find({},{"title":1,_id:0}).limit(1).skip(1)
```

### Node.js 小实例

