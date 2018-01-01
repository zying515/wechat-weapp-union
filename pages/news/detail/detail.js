//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    newsList: new Array(),
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
     console.log("aaaa");

  },
  getNewsList: function (e) {

    console.log("ddd" + e)
    app.globalData.newsList = e.detail.newsList
    this.setData({
      userInfo: e.detail.newsList
    })
  }, bindJumpDetail: function () {
    wx.navigateTo({
      url: '../index/index'
    })
  }
})
