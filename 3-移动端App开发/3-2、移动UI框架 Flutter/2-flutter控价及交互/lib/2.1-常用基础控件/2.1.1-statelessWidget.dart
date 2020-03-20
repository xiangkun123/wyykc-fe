/// StatelessWidget 示例

// 引入 mterial UI 包
import "package:flutter/material.dart";

// 主函数main，返回runApp，MeterialApp、Scaffold等都是 meterial UI 包的组件
// 这里通过Echo构造函数，传入text参数，创建了一个实例对象，把它挂载到Scaffold这个Widget中，Scaffold又是放在了MaterialApp这个Widget中
main(List<String> args) => runApp(MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('StatelessWidget示例')),
        body: Echo(text: "StatelessWidget用于不需要维护状态的场景"),
      ),
    ));

// 定义一个Echo类，继承于StatelessWidget
class Echo extends StatelessWidget {
  // 定义两个成员，通过类名构造函数Echo初始化三个成员
  // key是当前Widget的标识
  final String text;
  final Color backgroundColor;
  final Color textColor;
  Echo(
      {Key key,
      this.text,
      this.backgroundColor: Colors.cyan,
      this.textColor: Colors.white});

  // 重写了build方法，context是当前Echo类的上下文对象，通过返回嵌套式的Widget来构建UI组件
  // 如下，Center中嵌套了Container再嵌套了Text，在构建时会递归构建一层层嵌套的widget
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
          child: Text(text, style: TextStyle(color: textColor)),
          color: this.backgroundColor),
    );
  }
}
