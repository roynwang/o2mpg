//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    user: true,
    days: [],
    currentDate: null
  },
  tapBook: function () {
    if (app.globalData.userInfo.detail == null) {
      wx.navigateTo({
        url: '../register/register'
      })
    } else {
      wx.navigateTo({
        url: '../bookconfirm/bookconfirm'
      })
    }
  },

  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    var days = app.getOneWeek()
    days[0].selected = true
    that.setData({
      days: days,
      currentDate: 0
    })
    // app.getUserInfo(function (userInfo) {
    //   //更新数据
    //   that.setData({
    //     userInfo: userInfo
    //   })
    // })
  },
  tapDate: function(e) {
    var that = this
    var tar = e.currentTarget
    var i = parseInt(tar.dataset["i"])
    var days = that.data['days']
    days[that.data.currentDate].selected = false
    days[i].selected = true
    that.setData({
       currentDate: i,
       days: days
    })

  }
})