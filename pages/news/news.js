//index.js
//获取应用实例
const app = getApp()
var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
Page({
  data: {
    newsList:new Array(),
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 3000
  }, loadMore:function(){
     console.log("loadMore");
     wx.showLoading({
       title: '上拉刷新中。。',
     })
     //console.log('下拉刷新', new Date());
     this.fetchData();
     //console.log('下拉刷新', new Date());
  }, refresh:function(){
    console.log("refresh");
    wx.showLoading({
      title: '下拉加载中。。',
    })
    //console.log('下拉刷新', new Date());
    this.fetchData();
    //console.log('下拉刷新', new Date());
  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '下拉刷新pull中。。',
    })
    console.log('下拉刷新pull中', new Date());
    this.fetchData();
    console.log('下拉刷新pull中', new Date());
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onTapTag:function(e){
    // console.dir(e)
    console.log(e);
    var self = this;
    var tab = e.currentTarget.id;
    self.setData({
      tab: tab
    });
    if (tab !== 'top') {
      this.fetchData({ tab: tab });
    } else {
      this.fetchData();
    }
  },
  fetchData:function(data){
    var self = this;  
    if (!data) data = {};
    if (!data.tab) data.tab = "top";
    self.setData({
      newsList: new Array()
    })
    wx.request({
      url: Api.getNewsList(data),
      // header: {
      //   'content-type': 'application/json' // 默认值
      // },
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        self.setData({
          newsList: res.data.result.data
        })
      } ,complete: function () {
        // complete
        //wx.hideNavigationBarLoading() //完成停止加载
       // wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
    // wx.getStorage({
    //   key: 'key',
    //   fail: function () {
        
    //   },
    //   success: res => {
    //     console.log(res);
    //     //app.globalData.newsList = res.data.data.result.data;
    //     console.log(res.data.data.result.data);
    //     this.setData({
    //       newsList: res.data.data.result.data
    //     })
    //     //console.log(app.globalData.newsList);
    //   }
    // })

  },
  onLoad: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff0000',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    console.log(1)
    //this.fetchData();
    wx.showLoading({
      title: '下拉刷新中。。',
    })
    wx.getStorage({
      key: 'key',
      fail: function () {
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
            wx.hideLoading();
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
        wx.hideLoading();
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
  },bindJumpDetail:function(obj){
    var url = obj.currentTarget.dataset.url
    console.log(url);
    wx.navigateTo({
      url: 'detail/detail?id=' + url
    })
    
  },onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '今日头条',
      path: 'pages/news/news',
      success: function (res) {
        console.log(res);
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }, onReachBottom:function(){
    console.log("onReachBottom");
    wx.showLoading({
      title: '下拉加载中。。',
    })
    //console.log('下拉刷新', new Date());
    this.fetchData();
    //console.log('下拉刷新', new Date());
  }
})
