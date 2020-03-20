/// 图片 Image

import 'package:flutter/material.dart';

void main(List<String> args) => runApp(MaterialApp(
      home: Scaffold(
          backgroundColor: Colors.cyan,
          appBar: AppBar(title: Text('图片示例')),
          body: Center(
              child: Column(
            children: <Widget>[
              loadAssetImage(),
              loadAssetImage2(),
              loadNetworkImage(),
              loadNetworkImage2(),
            ],
          ))),
    ));

// asset加载图片
loadAssetImage() {
  return Image(
    image: AssetImage('assets/images/cls.png'),
    width: 100.0,
  );
}

// asset加载图片方式二
loadAssetImage2() {
  return Image.asset("assets/images/cls.png", width: 100.0);
}

// 加载网络图片
loadNetworkImage() {
  return Image(
      image: NetworkImage(
        "https://img.zcool.cn/community/015f505e746ee8a8012165182d6ae4.jpg@520w_390h_1c_1e_1o_100sh.jpg",
      ),
      width: 200.0);
}

// 加载网络图片方式二
loadNetworkImage2() {
  return Image.network(
      "https://img.zcool.cn/community/015f505e746ee8a8012165182d6ae4.jpg@520w_390h_1c_1e_1o_100sh.jpg",
      width: 200.0);
}
