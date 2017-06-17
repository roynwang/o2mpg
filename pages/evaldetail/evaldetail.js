var app = getApp()
Page({
  data: {
    evaldetails: []
  },
  onLoad: function () {
    var that = this
    this.datedetail()
    wx.setNavigationBarTitle({
      title: app.globalData.evaldate
    })
  },
  datedetail: function (e) {
    var that = this
    app.getEvalDateDetail(app.globalData.userInfo.detail.name,
      app.globalData.evaldate,
      function (data) {
        that.setData({
          evaldetails:data
        })
      })
  }
})