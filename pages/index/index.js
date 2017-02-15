//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
      app.o2GetUser(app.globalData.openid,
        function () {
          setTimeout(function () {
            wx.navigateTo({
              url: '../groupcourse/groupcourse'
            })
          }, 1000)
          console.log("get user info success")
        },
        function () {
          setTimeout(function () {
            wx.navigateTo({
              url: '../courselist/courselist'
            })
          }, 1000)
          console.log("get user info failed")
        })
    })
    // wx.navigateTo({
    //   url: '../groupcourse/groupcourse'
    // })
  }
})
