var app = getApp()
Page({
  data: {
    orders: []
  },
  onLoad: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    that.loadOrders()
  },
  loadOrders: function () {
    var that = this
    app.getUserOrder(app.globalData.userInfo.detail.name, function (data) {
      that.setData({
        orders: data
      })
    })
  }
})