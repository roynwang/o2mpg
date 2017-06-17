var app = getApp()
Page({
  data: {
    dates: []
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
    that.loadEvalDates()
  },
  datedetail: function(e){
    var that = this
    var tar = e.currentTarget
    var i = parseInt(tar.dataset["i"])
    var day = that.data['dates'][i].date
    app.globalData.evaldate = day
    wx.navigateTo({
      url: '../evaldetail/evaldetail'
    })
  },
  loadEvalDates: function(){
    var that = this
    app.getEvalDate(app.globalData.userInfo.detail.name, function (data) {
        that.setData({
          dates: data
        })
    })
  }
})