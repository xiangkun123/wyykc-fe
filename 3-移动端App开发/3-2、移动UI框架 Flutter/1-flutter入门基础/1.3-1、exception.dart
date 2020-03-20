/// 异常处理

testException() {
  throw "this is exception";
}

testException2() {
  throw Exception("this is exception");
}

// throw语句在Dart2中也是一个表达式，因此可以是=>
void testException3() => throw Exception("test exception");
