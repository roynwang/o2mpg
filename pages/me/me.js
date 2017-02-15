var app = getApp()
Page({
  data: {
    userInfo: {},
    user: true
  },
  //事件处理函数
  showRegister: function () {
    wx.navigateTo({
      url: '../register/register'
    })
  },
  charge: function(){
    wx.navigateTo({
      url: '../charge/charge'
    })
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  }
})