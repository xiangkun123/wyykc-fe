/// 字体图标示例
/// 需要在pubspec.yaml中配置uses-material-design: true

import 'package:flutter/material.dart';

void main(List<String> args) => runApp(MaterialApp(
      home: Scaffold(
          backgroundColor: Colors.cyan,
          appBar: AppBar(title: Text('字体图标示例')),
          body: Center(
              child: Column(
            children: <Widget>[
              buildMaterialIcons(),
              buildMaterialIcons2(),
              buildIconFont(),
            ],
          ))),
    ));

// 使用Material Design 的字体图标
// 利用icons将字符连接起来，通过TextStyle设置样式
buildMaterialIcons() {
  String icons = '';
  icons += '\uE914';
  icons += '\uE000';
  icons += '\uE90D';
  return Text(icons,
      style: TextStyle(
          fontFamily: 'MaterialIcons', fontSize: 40.0, color: Colors.red));
}

// 使用Material Design 的字体图标 方式二
// flutter 封装了 IconData 和 Icon 来专门显示字体图标，其中Icons.包含所有的图标的静态定义
buildMaterialIcons2() {
  return Row(
    children: <Widget>[
      Icon(Icons.accessible, color: Colors.red),
      Icon(Icons.error, color: Colors.red),
      Icon(Icons.fingerprint, color: Colors.red),
    ],
  );
}

// 使用自定义图标
buildIconFont() {
  return Row(
    children: <Widget>[
      Icon(
        MyIcons.musiclist,
        color: Colors.purple,
        size: 60.0,
      ),
      Icon(
        MyIcons.favoriteslist,
        color: Colors.purple,
        size: 60.0,
      ),
      Icon(MyIcons.like, color: Colors.red, size: 60.0),
    ],
  );
}

// 使用iconfont字体图标，声明所有的字体图标
class MyIcons {
  static const IconData bluetoothon = IconData(0xe697, fontFamily: "MyIcon");
  static const IconData child = IconData(0xe699, fontFamily: "MyIcon");
  static const IconData dndMode = IconData(0xe69a, fontFamily: "MyIcon");
  static const IconData brightness = IconData(0xe698, fontFamily: "MyIcon");
  static const IconData musiclist = IconData(0xe69c, fontFamily: "MyIcon");
  static const IconData favoriteslist = IconData(0xe69b, fontFamily: "MyIcon");
  static const IconData home = IconData(0xe73d, fontFamily: "MyIcon");
  static const IconData pills = IconData(0xe73f, fontFamily: "MyIcon");
  static const IconData medication = IconData(0xe741, fontFamily: "MyIcon");
  static const IconData like = IconData(0xe742, fontFamily: "MyIcon");
}
