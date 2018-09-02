//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    loading: true
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  tapGo: function () {
    var that = this
    if (that.data.loading) {
      return
    }
    if (app.globalData.userInfo.detail == null) {
      wx.navigateTo({
        url: '../courselist/courselist'
      })
    } else {
      wx.navigateTo({
        url: '../groupcourse/groupcourse'
      })
    }
  },

  showMain: function(userInfo){
    var that = this
    that.setData({
      userInfo: userInfo
    })
    app.o2GetUser(app.globalData.openid,
      function () {
        setTimeout(function () {
          that.setData({
            loading: false
          })
          wx.navigateTo({
            url: '../groupcourse/groupcourse'
            // url: '../album/album'
          })
        }, 500)
        console.log("get user info success")
      },
      function () {
        setTimeout(function () {
          that.setData({
            loading: false
          })
          wx.navigateTo({
            url: '../groupcourse/groupcourse'
            // url: '../courselist/courselist'
          })
        }, 500)
        console.log("get user info failed")
      })
  },

  onGotUserInfo: function(e){
    var that = this
    that.showMain(e.detail.userInfo)
  },
  onShow: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.showMain(userInfo)
    })
  }
})
