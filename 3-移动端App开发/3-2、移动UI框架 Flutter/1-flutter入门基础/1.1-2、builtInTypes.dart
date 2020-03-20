/// builtInTypes 内置类型

void main(List<String> args) {
  // 数值类型
  num num1 = 1;
  num num2 = 1.0;

  // 整型
  int x = 1;
  int hex = 0xDEADBEEF;

  // 浮点型
  double y = 1.1;
  double exponents = 1.42e5;

  // 字符串转换成数值类型
  var one = int.parse('1');
  var onePointOne = double.parse('1.1');

  // 字符串
  String s1 = '单引号字符串';
  String s2 = "双引号字符串";

  // 使用 ${expression} 将表达式的值放入字符串
  String s = 'String Expression';
  String s3 = '将表达式中的值转换成大写${s.toUpperCase()}';
  // 如果表达式为变量，则可省略{}
  String s4 = '表达式为变量式，其值$s';

  // 字符串拼接
  // 字符串使用相邻字符串常量 或 + 运算符拼接
  String s5 = 'String'
      'concatenation'
      'expresion';
  String s6 = 'string' + 'concatenation' + 'expresion';

  // 多行字符串
  String s7 = '''
    今天天气真好！
  ''';

  // 对于布尔类型，dart类型安全意味着 不能使用 if(nonbooleanValue)
  var fullName = '';
  if (fullName) {} // 编译时报错
  if (fullName.isEmpty) {} // 不会报错

  // list 集合
  List list = [1, 2, 3];
  list[1] = 3;

  // Map
  Map gifts = {'first': "第一", 'second': '第二'};
  gifts['first'] = "hello";
}
