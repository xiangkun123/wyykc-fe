/// variableDeclare 变量声明代码演示
///   编译时错误：在写代码时，编辑器会检查语法错误进行预编译，当语法出错时会提示出错； 
///   运行时错误：在编译时是能通过的，但运行代码时会出错

// 所有的Dart程序都是以Main函数为入口
void main(List<String> args) {
  
  var name1 = "Bob";                  // 变量声明

  var num1 = 44;
  num1 = "hello1";                    // var 声明类型后不能更改，编译出错

  Object num2 = 44;
  num2 = "hello";                     // 允许动态变更类型

  dynamic num3 = 44;
  num3 = "hello";                     // 允许动态变更类型

  num2++;                             // 更改成String类型后，编译时错误

  num3++;                             // 更改成String类型后，运行时错误

  var a;                              // Dart中变量声明时的默认值是null
  print(a);                           // 打印 null

  // final 和 const
  // 声明时 必须初始化
  const name1;                        // 编译时错误
  final name2;                        // 编译时错误

  final name3 = "Bob";
  name3 = "Alice";                    // 编译时错误

  // final 和 const 不能和 var 同时使用，但允许和具体类型同时使用
  const var name4 = "Bill";           // 报错
  final var name5 = "Lili";           // 报错

  const String name6 = "Bill";
  final String name7 = "Lili";

  // 定义 const 变量，使用其它const变量的值来初始化
  const bar = 10000;
  const double atm = 1.01325 * bar;

  // const 不仅修饰变量名，还能修饰值
  const foo1 = [1,2,3];               // 等价于 const foo1[0] = 1、const foo1[1] = 2...
  foo1[0] = 1;                        // 运行时错误
  foo1 = [1,2,3];                     // 编译时错误

  // final 不能修饰变量值，只能修饰变量名
  final foo2 = [1,2,3];
  foo2[0] = 2;                        // 不会报错
  foo2 = [1,2,3];                     // 编译时错误
}
