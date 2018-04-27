var app = getApp()
Page({
  data: {
    trainsummary: {},
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
  chargedate: function () {
    wx.navigateTo({
      url: '../chargedate/chargedate'
    })
  },
  album: function(){
    wx.navigateTo({
      url: '../album/album'
    })
  },
  personaldata: function () {
    wx.navigateTo({
      url: '../personaldata/personaldata'
    })
  },
  orderlist: function() {
    wx.navigateTo({
      url: '../orderlist/orderlist'
    })
  },
  onShow: function () {
    var that = this
    //调用应用实例的方法获取全局数据

    app.o2GetUserTrainSummary(app.globalData.userInfo.detail.name, app.globalData.gym,function () {
      //更新数据
      that.setData({
        userInfo: app.globalData.userInfo
      })
    },function(){})
  }
})