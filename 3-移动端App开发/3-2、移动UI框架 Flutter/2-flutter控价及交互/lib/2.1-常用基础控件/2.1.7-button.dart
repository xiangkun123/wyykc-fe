/// 按钮示例

import 'package:flutter/material.dart';
import 'package:flutterapp/2.1-%E5%B8%B8%E7%94%A8%E5%9F%BA%E7%A1%80%E6%8E%A7%E4%BB%B6/2.1.6-iconfont.dart';

void main(List<String> args) => runApp(MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('按钮示例')),
        body: Center(
            child: Column(
          children: <Widget>[
            RaisedButton(
              child: Text("RaisedButton"),
              onPressed: () {},
            ),
            FlatButton(
              child: Text("FlatButton"),
              onPressed: () {},
            ),
            OutlineButton(
              child: Text("OutlineButton"),
              onPressed: () {},
            ),
            IconButton(
              icon: Icon(MyIcons.like),
              onPressed: () {},
            ),
            FlatButton.icon(
                icon: Icon(MyIcons.like), label: Text('喜欢'), onPressed: () {}),
            FlatButton(
              child: Text('Submit'),
              color: Colors.orange,
              highlightColor: Colors.orange[800],
              colorBrightness: Brightness.dark,
              splashColor: Colors.grey,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20.0)),
              onPressed: () {},
            )
          ],
        )),
      ),
    ));
