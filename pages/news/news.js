//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    newsList:new Array(),
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
    wx.getStorage({
      key: 'key',
      fail:function (){
        wx.request({
          url: 'https://v.juhe.cn/toutiao/index', //仅为示例，并非真实的接口地址
          data: {
            key: 'bccb02cfda121331e2215421096638f2'
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res);
            wx.setStorage({
              key: "key",
              data: res
            })

               this.setData({
                 newsList: res.data.data.result.data
              })

          }
        })
      },
      success: res => {
        console.log(res);
        //app.globalData.newsList = res.data.data.result.data;
        console.log(res.data.data.result.data);
         this.setData({
          newsList: res.data.data.result.data
         })
        //console.log(app.globalData.newsList);
      }
    })
    

  },
  getNewsList: function (e) {
    
    console.log("ddd"+e)
    app.globalData.newsList = e.detail.newsList
    this.setData({
      userInfo: e.detail.newsList
    })
  },bindJumpDetail:function(){
    wx.navigateTo({
      url: 'detail/detail'
    })
  } 
})
