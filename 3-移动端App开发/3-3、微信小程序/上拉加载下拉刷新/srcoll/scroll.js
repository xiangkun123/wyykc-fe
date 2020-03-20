// pages/srcoll/scroll.js

var self;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [], // 存储所有数据
    showLists: [], // 当前显示的数据
    total: 0, // 当前条数长度
    pageSize: 20, // 每页显示的条数
    pageNo: 1, // 当前页码
    nodata: false,    // 没有更多
    loading: false,   // 上拉加载
    step: 5           //每次增加条数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this;
    this._initData();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let lists = this.data.lists;
    let total = this.data.total;
    let pageSize = this.data.pageSize;
    let step = this.data.step;
    let showLists;
    let result;
    let pageNo;
    

    setTimeout(function() {
      for(var i=0; i<step; i++) {
        total = total + 1;
        lists.unshift({
          id: total,
          name: "数据" + total,
          time: self.getTime()
        });
      }
      
      pageNo = 1;

      self.setData({
        total: total,
        lists: lists,
        pageNo: pageNo,
        nodata: false
      });

      result = self.getData(pageNo, pageSize);

      self.setData({
        showLists: result
      });

      wx.stopPullDownRefresh();
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function(e) {
    let loading = this.data.loading;
    let nodata = this.data.nodata;
    if (nodata) return;
    this.setData({
      loading: true
    });

    let lists = this.data.lists;
    let showLists = this.data.showLists;
    let pageNo = this.data.pageNo;
    let pageSize = this.data.pageSize;
    let total = this.data.total;
    let newPageNo;
    let result;
    let newLists;

    setTimeout(function() {
      
      newPageNo = pageNo + 1;
      newLists = self.getData(newPageNo, pageSize);
      result = showLists.concat(newLists);

      if (result.length == total) {
        nodata = true;
      }

      self.setData({
        pageNo: newPageNo,
        showLists: result,
        nodata: nodata,
        loading: false
      });
    }, 3000);

  },

  // 初始化数据
  _initData() {
    let lists = [];
    let showLists = [];
    let pageSize = this.data.pageSize;
    let pageNo = this.data.pageNo;
    var i = 0;
    for (; i < pageSize; i++) {
      lists.push({
        id: i + 1,
        name: "数据" + (i + 1),
        time: this.getTime()
      });
    }
    this.setData({
      lists: lists,
      total: pageSize
    });

    let result = this.getData(pageNo, pageSize);

    this.setData({
      showLists: result
    });
  },

  // 返回对应页面的数据
  getData(pageNo, pageSize) {
    let lists = this.data.lists;
    let result = lists.slice((pageNo - 1)*pageSize, pageSize*pageNo);
    return result;
  },

  // 获取时间
  getTime() {
    let date = new Date();
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).length == 2 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
    let day = String(date.getDate()).length == 2 ? date.getDate() : "0" + date.getDate();
    return year + "-" + month + "-" + day;
  },

})