/// Context示例

// 引入 mterial UI 包
import 'package:flutter/material.dart';

main(List<String> args) => runApp(MaterialApp(home: ContextRoute()));

// 定义一个ContextRoute类，继承于StatelessWidget，该类中没有其他成员，而且构造函数也省略掉
class ContextRoute extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: Text('Context示例')),
        body: Center(
          child: Container(
            child: Builder(
              builder: (context) {
                Scaffold scaffold = context.findAncestorWidgetOfExactType();
                return (scaffold.appBar as AppBar).title;
              },
            ),
          ),
        ));
  }
}
