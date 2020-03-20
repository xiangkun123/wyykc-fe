/// 导入库

import 'dart:io'; // 导入内置dart库
import 'package:lib1/libfile.dart'; // 导入其他库
import 'package:lib1/lib1.dart' show foo, bar; // 只是用 foo, bar
import 'package:mylib/mylib.dart' hide foo; // 导入除去foo外所有内容
import 'package:mylib/mylib.dart' as prefix; // 指定库前缀
