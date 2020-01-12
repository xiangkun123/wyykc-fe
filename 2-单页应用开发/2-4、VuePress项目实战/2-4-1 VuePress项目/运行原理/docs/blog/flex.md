## flex布局

### 一、概念理解：

#### 主轴和交叉轴
默认情况下，容器定义`display:flex`（默认`flex-direction: row`横向）后，容器从 main start 到 main end 的方向是主轴，cross start 到 cross end 是交叉轴；若 `flex-direction: column` （纵向）后，容器从 cross start 到 cross end 为主轴，从 main start 到 main end 是交叉轴。 如下图：

![flex布局](https://raw.githubusercontent.com/xiangkun123/photograph/master/css/flex/flex.png)


#### 容器与元素：
如【1】中图所示，粉色区域为 flex container 部分，是容器；黄色区域为 flex element 部分，是元素部分。

### 二、容器属性：

#### `flex-direction` 决定元素的排列方向
| 属性 | 值 |
| -- | -- |
| row | 元素沿主轴方向排列 |
| row-reverse | 元素沿主轴反方向排列
| column | 元素沿交叉方向排列
| column-reverse | 元素沿着交叉轴反方向排列

#### `flex-wrap` 决定元素如何换行（元素过多情况下）

> 注意：`wrap-reverse`这里容易混乱，记忆方法是先根据  `flex-direction`判断出当前的主轴、交叉轴方向再判断交叉轴的反向换行。

| 值 | 描述 |
| -- | -- |
| nowrap | 元素被排列在一行，不换行
| wrap | 当元素溢出时换行
| wrap-reverse | 元素溢出时，沿交叉轴反向换行

#### `flex-flow` 是 `flex-direction` 和 `flex-wrap` 的简写属性

这里两个属性排列组合数比较多，不列出一一匹配的值。

```
flex-flow: flex-direction flex-wrap
```

#### `justify-content` 元素在主轴上的对齐方式

| 值 | 描述 | 
| -- | -- |
| flex-start | 沿主轴左对齐
| center | 沿主轴居中对齐
| flex-end | 沿主轴右对齐
| space-around | 沿主轴方向每个元素左右的间隔相等，不紧贴两端
| space-between | 沿主轴两端对齐，中间的间隔相等，紧贴两端

#### `align-items` 元素在交叉轴的对齐方式

| 值 | 描述 | 
| -- | -- |
| flex-start | 沿交叉轴左对齐
| center | 沿交叉轴居中对齐
| flex-end | 沿交叉轴右对齐
| stretch | 在元素没有设置宽度或者高度时，元素在交叉轴方向被拉伸到与容器相同的高度或宽度
| baseline | 元素以第一行文字进行对齐

### 三、元素属性：

+ flex-grow: 当容器有多余空间时，元素的放大比例

> 默认值是 0，不放大，根据元素的宽度显示；

当 flex-grow = 1 时，假设当前有4个元素，设置元素的 flex-grow:1，其中第三个元素的 flex-grow:2，那么第三个元素所占的份数是2份，其余所占的份数是1 份。

+ flex-shrink: 当容器空间不足时，元素的缩小比例

> 默认值是 1，不缩小，根据队列中的元素宽度成比例显示；

若当前有8 个元素，当设置第三个元素的  flex-shrink: 10 ，其他元素的 flex-shrink: 1 后，第三个元素就会缩小 10 倍，其他元素不缩小；

+ flex-basis: 元素在主轴上占据的空间，当前元素的宽度

flex-basis 的宽度会覆盖掉前面设置的宽度；
```
flex-basis: 200rpx
```

+ `flex` 是 `flex-grow`、`flex-shrink` 和 `flex-basis` 的简写
```
flex：flex-grow flex-shrink flex-basis
```

+ `order` 定义元素的排列顺序

跟随在没设置 order 的元素后面，设置了order 的元素从小到大排列。

+ `align-self` 定义元素自身的对齐方式

| 值 | 描述 | 
| -- | -- |
| flex-start | 元素自身沿交叉轴左对齐
| center | 元素自身沿交叉轴居中对齐
| flex-end | 元素自身沿交叉轴右对齐