/// 泛型示例代码

/// 泛型通常是为了类型安全而必需的
/// 适当指定泛型会生成更好的代码
/// 可以使用泛型来减少代码

void main(List<String> args) {
  var names = List<String>();
  names.addAll(['张三', '李四', '王五']);
  names.add(32); // 编译时错误
}

// 下面对于一类的接口，可以使用泛型合并成一个接口
abstract class ObjectCache {
  Object getByKey(String key);
  void setByKey(String key, Object value);
}

abstract class StringCache {
  String getByKey(String key);
  void setByKey(String key, String value);
}

// ...

abstract class Cache<T> {
  T getByKey(String key);
  void setByKey(String key, T value);
}
