/// processControl 流程控制

void main(List<String> args) {
  // 如果需要遍历的对象是可遍历的，可以使用forEach
  List num = [1, 2, 3];
  num.forEach((item) => print(item));

  // 可遍历类，如List、set 也支持 for in 形式遍历
  List collection = [1, 2, 3];
  for (var x in collection) {
    print(x);
  }

  // assert
  var text;
  assert(text != null); // 保证text的值不为null，不为null时正常往下执行，为null时抛出异常

  var number = 10;
  assert(number > 100); // 保证number值大于100

  // 运算符
  var obj; // 初始化时没赋值，obj为null
  print(obj.a); // 直接获取obj.a 会报运行时错误
  print(obj?.a); // null，但obj?.a就会先判断该值是否为null

  var a;
  // 如果a为null，则将值赋给a，否则保持不变
  a ??= "hello";

  // 级联运算符：允许对同一对象进行一系列操作，除了函数调用，还可以访问同一对象上的字段
  // 这样可以省去创建临时变量步骤，并且可以多段级联
  var sb = StringBuffer();
  sb..write('foo')..write('bar');
  sb.write('abc')..write('def'); // sb.write()返回的是 void，不能级联，报错
}
