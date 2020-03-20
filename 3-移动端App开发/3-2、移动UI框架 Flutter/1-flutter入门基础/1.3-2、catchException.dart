/// 捕获异常

testException() {
  throw "抛出一个异常";
}

testException2() {
  throw Exception("抛出Exception异常");
}

void testException3() => throw Exception("抛出Exception异常");

void testException4() => throw FormatException("格式错误");

void main(List<String> args) {
  testException();
  testException2();
  testException3();

  // 异常捕获
  try {
    testException();
  } on FormatException catch (e) {
    print("捕获到Format Exception");
    print(e);
    rethrow;
  } on Exception {
    print("捕获到异常");
  } catch (e, r) {
    print(e);
    print(r);
  }
}
