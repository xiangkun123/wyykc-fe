// functions 函数

void main(List<String> args) {
  // 函数声明：可指明其返回值类型，可以省略
  // 如果没有显式声明默认返回 dynamic 类型
  bool foo(int str) {
    return str != null;
  }

  // 对于一个表达式的函数，可以简写
  bool foo1(int str) => str != null;

  // 函数作为变量使用
  var say = (str) {
    print(str);
  };
  say("hi world");

  // 函数作为参数使用
  void execute(var callback) {
    callback();
  }

  execute(() => print("xxxx"));

  // 函数有两种参数类型：规定参数、可选参数

  // 可选位置参数
  String sayMethod(String from, String msg, [String device]) {
    var result = '$from says $msg';
    if (device != null) {
      result = '$result with a $device';
    }
    return result;
  }

  sayMethod('Bob', 'Howdy'); // 结果是 Bob says Howdy
  sayMethod(
      'Bob', 'Howdy', 'smoke signal'); // 结果是 Bob says Howdy with a somke signal

  // 可选名称参数
  // 设置[bold]和[hidden]标志
  void enableFlags({bool bold, bool hidden}) {
    // ...
  }
  enableFlags(bold: true, hidden: false);
}
