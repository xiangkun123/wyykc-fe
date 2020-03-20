/// 类的继承

//  ===================> 1、继承

class Television {
  void turnOn() {
    //....
  }
}

// 使用extends关键字创建子类，继承父类
class SmartTelevision extends Television {
  // 使用@override 重写实例方法
  @override
  void turnOn() {
    super.turnOn();
  }
  //...
}

// ===================> 2、重写操作符示例
class Vector {
  final int x, y;

  Vector(this.x, this.y);

  Vector operator +(Vector v) => Vector(x + v.x, y + v.y);
  Vector operator -(Vector v) => Vector(x - v.x, y - v.y);
}

void main(List<String> args) {
  final v = Vector(2, 3);
  final w = Vector(2, 2);
  assert(v + w == Vector(4, 5)); // true
  assert(v - w == Vector(0, 1)); // true

  A().missing();
}

//  ===================> 3、重写 noSuchMethod
class A {
  missing(); // 声明了没实现
  void noSuchMethod(Invocation invocation) {
    print(
        'You tried to use a non-existent member:' + '${invocation.memberName}');
  }
}
