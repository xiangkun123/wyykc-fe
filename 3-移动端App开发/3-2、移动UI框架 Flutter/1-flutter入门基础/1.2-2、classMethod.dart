/// 类的方法

// =============> 1、Getters和Setters
class Rectangle {
  num top, height;
  // 类名构造函数
  Rectangle(this.top, this.height);
  // 获取底部的值
  num get bottom => top + height;
  set bottom(num value) => top = value - height;
}

void main(List<String> args) {
  var rect = Rectangle(10, 10);
  assert(rect.top == 10);
  rect.bottom = 15;
  assert(rect.top == 5);
}
