/// State 生命周期示例

import 'package:flutter/material.dart';

main(List<String> args) => runApp(MaterialApp(home: CountWidget()));

// 创建一个CountWidget，由于是一个计数器，需要保存它的数值状态，所以继承自StatefulWidget，
// 通过构造函数初始化成员initValue的值为0，
class CountWidget extends StatefulWidget {
  final int initValue;

  CountWidget({Key key, this.initValue: 0});

  @override
  _CounterWidgetState createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CountWidget> {
  int _counter;

  // 初始化状态时调用
  @override
  void initState() {
    super.initState();
    _counter = widget.initValue;
    print("initState");
  }

  // 构建Widget时调用
  @override
  Widget build(BuildContext context) {
    print("build");
    return Scaffold(
      body: Center(
        child: FlatButton(
          child: Text('$_counter'),
          onPressed: () => setState(
            () => ++_counter,
          ),
        ),
      ),
    );
  }

  // Widget是否需要更新，更新Widget时才调用
  @override
  void didUpdateWidget(CountWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    print("didUpdateWidget");
  }

  // 从Widget树中移除时调用
  @override
  void deactivate() {
    super.deactivate();
    print("deactivate");
  }

  // 从Widget树中永久移除时调用
  @override
  void dispose() {
    super.dispose();
    print("dispose");
  }

  // 开发调试时调用
  @override
  void reassemble() {
    super.reassemble();
    print("reassemble");
  }

  // State对象的依赖变化时调用
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    print("didChangeDependencies");
  }
}
