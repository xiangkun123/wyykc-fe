/// 文字及样式 Text

import 'package:flutter/material.dart';

void main(List<String> args) => runApp(MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('文本及样式')),
        body: Center(
          child: DefaultTextStyle(
            // DefaultText用于设置文本的默认样式，只能设置Text文本(Text.rich()也可以)，对于RichText是不行的
            style: TextStyle(
              fontSize: 30.0,
              fontFamily: 'DongZhu', // 使用自定义字体DongZhu，需要在pubspec.yaml中声明
            ),
            child: Column(
              children: <Widget>[
                buildCustomText(),
                buildRichText(),
                buildRichText2(),
              ],
            ),
          ),
        ),
      ),
    ));

// 普通文本样式：通过Text设置文本内容，TextStyle设置文本样式
buildCustomText() {
  return Text(
    '琴棋书画不会，洗衣做饭嫌累',
    style: TextStyle(
      color: Colors.red,
      fontSize: 20.0,
      fontWeight: FontWeight.bold,
      fontStyle: FontStyle.normal,
      fontFamily: "DongZhu",
      letterSpacing: 2.0,
      wordSpacing: 4.0,
    ),
  );
}

// 富文本RichText：通过RichText()和Text.rich()都可以使用富文本
buildRichText() {
  return RichText(
    text: TextSpan(children: [
      TextSpan(text: '文本片段1', style: TextStyle(color: Colors.red)),
      TextSpan(text: '文本片段2', style: TextStyle(color: Colors.cyan)),
    ]),
  );
}

buildRichText2() {
  return Text.rich(TextSpan(children: [
    TextSpan(text: '文本片段1', style: TextStyle(color: Colors.red)),
    TextSpan(text: '文本片段2', style: TextStyle(color: Colors.cyan)),
  ]));
}
