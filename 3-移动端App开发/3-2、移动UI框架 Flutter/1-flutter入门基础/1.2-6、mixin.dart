/// mixin 类

mixin Musical {
  bool canPlayPiano = false;
  bool canCompose = false;
  bool canConduct = false;

  void entertainMe() {
    if (this.canPlayPiano) {
      print('play Piano!');
    } else if (this.canConduct) {
      print('Waving hands!');
    } else {
      print('humming to self！');
    }
  }
}

class Person {
  //...
}

// 使用 with 跟上 mixin 类名
class Musician extends Person with Musical {
  //...
}
