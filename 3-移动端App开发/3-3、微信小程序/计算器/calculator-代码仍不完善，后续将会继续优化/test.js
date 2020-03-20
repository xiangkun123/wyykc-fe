// pages/test/test.js

let self;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: "",
    editorHeight: "",
    currentNum: 0,
    saveNum: 0,
    isHasOpera: false,
    saveOpera: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this;
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight
    });

    let query = wx.createSelectorQuery();
    query.select(".editor-wrapper").boundingClientRect();
    query.exec(function(ele) {
      self.setData({
        editorHeight: ele[0].height
      });
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 处理每个点击按钮
  _handleTap(e) {
    const flag = e.target.dataset.opera;

    // 点到其他地方return掉
    if (flag === undefined) return;

    const numArr = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const operaArr = ["+", "-", "x", "÷"];

    // 操作符号
    if (operaArr.indexOf(flag) > -1) {
      this._operaHandle(flag);
      return;
    }

    // 负数/非负数
    if (flag == "negative") {
      this._negativeHandle();
      return;
    }

    // 百分号
    if (flag == "%") {
      this._decimalHandle();
      return;
    }

    // 小数点
    if (flag == ".") {
      this._numberDotHandle();
      return;
    }

    // 数字的情况
    if (numArr.indexOf(flag) > -1) {
      this._numberHandle(flag);
      return;
    }

    // 零的情况
    if (flag === "0") {
      this._zeroHandle(flag);
      return;
    }

    // 清空数据
    if (flag == "ac") {
      this._clear();
      return;
    }

    // 等号=
    if (flag == "=") {
      this._equalHandle();
      return;
    }
  },

  // 小数点
  _numberDotHandle() {
    let isHasOpera = this.data.isHasOpera;
    let currNum = String(this.data.currentNum);
    
    if (isHasOpera) {
      isHasOpera = false;
      currNum = "0";
    }

    // 如果当前数字的最后一位已经是.，就return
    if (currNum.indexOf(".")>-1) return;

    currNum = currNum + ".";

    this.setData({
      isHasOpera: false,
      currentNum: currNum
    });

  },

  // 数字类型
  _numberHandle(str) {
    let isHasOpera = this.data.isHasOpera;
    let currNum = String(this.data.currentNum);
    let length = String(currNum).length;

    // 如果数值超过9位
    if (!isHasOpera && length >= 9) return;

    // 判断前面按钮是否是运算符
    if (isHasOpera) {
      isHasOpera = false;
      currNum = str;
    } else {
      currNum = currNum == 0 && currNum.substring(currNum.length-1) != "." ? str : currNum + str;
    }
    
    this.setData({
      isHasOpera: isHasOpera,
      currentNum: currNum
    });
  },

  // 零类型
  _zeroHandle(str) {
    let currNum = String(this.data.currentNum);
    let isHasOpera = this.data.isHasOpera;
    let length = String(currNum).length;

    // 如果数值超过9位
    if (!isHasOpera && length >= 9) return;

    if (currNum == "0") return;
    currNum = currNum + "0";

    if (isHasOpera) {
      isHasOpera = false;
      currNum = str;
    }

    this.setData({
      isHasOpera: isHasOpera,
      currentNum: currNum
    });
  },

  // 重置数据
  _clear() {
    this.setData({
      currentNum: 0,
      saveNum: 0,
      isHasOpera: false,
      saveOpera: ""
    })
  },

  // 负数/非负数处理
  _negativeHandle() {
    let currNum = String(this.data.currentNum);
    if (currNum > 0) {
      currNum = "-" + currNum;
    } else if (currNum < 0) {
      currNum = String(currNum).substring(1);
    } else if (curNum == 0) {
      currNum = currNum.charAt(0) == "-" ? currNum.substring(1) : "-" + currNum;
    }
    this.setData({
      currentNum: currNum
    });
  },

  // 百分比小数
  _decimalHandle() {
    let currNum = Number(this.data.currentNum);
    this.setData({
      currentNum: this._keepDecimal(currNum / 100)
    });
  },

  // 操作符
  _operaHandle(flag) {
    let currNum = Number(this.data.currentNum);
    let saveNum = Number(this.data.saveNum);
    let saveOpera = this.data.saveOpera;
    let isHasOpera = this.data.isHasOpera;
    let result;

    console.log(saveNum, currNum, saveOpera, isHasOpera)

    // 前面还是操作，直接return
    if (isHasOpera) {
      this.setData({
        isHasOpera: true,
        saveOpera: flag
      });
      return;
    }

    result = this._computedTotal(saveNum, currNum, saveOpera);

    this.setData({
      saveNum: result,
      currentNum: result,
      isHasOpera: true,
      saveOpera: flag
    });
  },

  // 计算过程
  _computedTotal(saveNum, currNum, opera) {
    let result;
    if (opera == "") {
      result = currNum;  
    }else if (opera == "+") {
      result = saveNum + currNum;
    } else if (opera == "-") {
      result = saveNum - currNum;
    } else if (opera == "x") {
      result = saveNum * currNum;
    } else if (opera == "÷") {
      result = saveNum / currNum;
    }
    return result;
  },

  // 等于
  _equalHandle() {
    let saveNum = Number(this.data.saveNum);
    let currNum = Number(this.data.currentNum);
    let isHasOpera = this.data.isHasOpera;
    let saveOpera = this.data.saveOpera;
    let result;

    result = this._computedTotal(saveNum, currNum, saveOpera);

    this.setData({
      saveNum: this._keepDecimal(result),
      currentNum: this._keepDecimal(result),
      isHasOpera: true
    });
  },

  // 最多保留8位，清除多余的零，如果数值超过9位用科学计数法
  _keepDecimal(value) {
    value = Number(value).toFixed(8);
    let i = value.indexOf(".") > -1 && value.substring(value.length - 1);

    while (i === "0" || i === ".") {
      value = value.substring(0, value.length - 1);
      i = value.indexOf(".") > -1 && value.substring(value.length - 1);
    }

    // 如果超过9位用科学计数法
    if (String(value).length>=9) {
      value = Number(value).toExponential();
    }
    // console.log("result", value);
    return value || 0;
  }

})