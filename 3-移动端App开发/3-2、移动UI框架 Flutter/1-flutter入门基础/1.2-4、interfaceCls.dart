/// 接口类

// 每个类都是一个隐式接口，所以Person类也是接口，包括成员属性和方法
class Person {
  // 可在接口中实现，但仅对这个库可见
  final _name;

  // 构造函数不能被接口实现
  Person(this._name);

  // 可在接口中实现
  String greet(String who) => 'hello, $who. I am $_name';
}

// 实现Person类
class Impostor implements Person {
  get _name => '';
  String greet(String who) => 'Hi $who. Do you know who I am';
}

String greetBob(Person person) => person.greet('Bob');

void main(List<String> args) {
  print(greetBob(Person('kathy')));
  print(greetBob(Impostor()));
}
