/// 抽象类

// 抽象类不能被实例化
abstract class AbstractCls {
  // 定义构造函数、字段、方法...

  void update(); // 抽象方法
}

class cls1 extends AbstractCls {
  @override
  void update() {
    print("update");
  }
}

void main(List<String> args) {
  var ac = AbstractCls();
  var ac2 = cls1();
}
