/// 类和对象

// =================> 1、类声明
// 没有声明构造函数，但默认会带一个无参构造函数
class Point {
  int x; // null
  int y; // null
  int z = 0; // 0
}
// void main(List<String> args) {
//   // Point point;															// 未初始化，默认值为null
//   var point = new Point();
//   point.x = 4; // 使用 . 来引用实例变量或方法
//   point?.y = 5; // 不确定point是否有值，可以使用?.的方法来访问y的值
//   print(point.x);
//   print(point.y);
// }

// =================> 2、类的构造函数
// 2-1、类名构造函数
class Point2 {
  int y;
  int x;

  //类名构造函数
  Point2(num x, num y) {
    this.x = x;
    this.y = y;
  }
  //....
}

// 在构造函数里初始化成员属性，Dart开发了新的语法糖来简化这种操作
class Point3 {
  num x, y;
  // 注意x,y的赋值会在构造函数执行之前完成
  Point3(this.x, this.y);
}

// 2-2、命名构造函数
class Point4 {
  num x, y;
  // 类名构造函数
  Point4(this.x, this.y);
  // 命名构造函数
  Point4.origin(this.x, this.y);
}

// 2-3、调用父类非默认的构造函数
// Person类中没有一个无参数，未命名的构造函数
class Person {
  String firstName;
  // 命名构造函数
  Person.fromJson(Map data) {
    print('in Person');
  }
}

class Employee extends Person {
  // 你必须调用父类的super.fromJson(data)
  Employee.fromJson(Map data) : super.fromJson(data) {
    print('in Employee');
  }
}

// void main(List<String> args) {
// var point = new Point4.origin(1, 2);
// print(point.x);
// print(point.y);

//   var emp = new Employee.fromJson({});
// }

// 2-4、重定向构造函数
class Point1 {
  num x, y;
  // 类名构造函数
  Point1(this.x, this.y);
  // 命名构造函数
  Point1.order(this.x, this.y);
  Point1.origin(num a, num b)
      : this.order(a, b); // 重定向构造函数origin，将外界传入的值，指向构造函数order
}

void main(List<String> args) {
  var point = new Point1.origin(1, 2);
  print(point.x);
  print(point.y);
}
