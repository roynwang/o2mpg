//logs.js
// var util = require('../../utils/util.js')
// Page({
//   data: {
//     logs: []
//   },
//   onLoad: function () {
//     this.setData({
//       logs: (wx.getStorageSync('logs') || []).map(function (log) {
//         return util.formatTime(new Date(log))
//       })
//     })
//   }
// })
var app = getApp()
Page({
  data: {
    booking: {},
    day: null,
    month: null,
    gymInfo: null,
    summary: null

  },
  //事件处理函数
  showRegister: function () {
    wx.navigateTo({
      url: '../register/register'
    })
  },
  charge: function () {
    wx.navigateTo({
      url: '../charge/charge'
    })
  },
  onShow: function () {
    var that = this
    var date = new Date(app.globalData.booking.date)
    that.setData({
      booking: app.globalData.booking,
      day: date.getDate(),
      month: date.getShortMonthName(),
      gymInfo: app.globalData.gymInfo,
      summary: app.globalData.userInfo.trainsummary,
    })
    app.o2GetDiscount(app.globalData.userInfo.detail.name,
    date.Format("yyyyMMdd"),
    function(res){
      that.setData({
        discount: res,
        discountprice: Math.ceil(app.globalData.booking.price * res.discount / 100),
        finalprice: app.globalData.booking.price - Math.ceil(app.globalData.booking.price * res.discount / 100),
      })
    },
    function(){})
  },
  tapConfirm: function () {
    var that = this
    app.o2BookGroupCourse(that.data.booking, function () {
      wx.showToast({
        title: '预约已提交',
        icon: 'success',
        duration: 2000
      })
      setTimeout(function () {
        wx.navigateBack()
      }, 1000)
    },
      function (res) {
        if (res.statusCode == 406) {
          wx.showToast({
            title: '余额不足',
            icon: 'cancel',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '预约失败',
            icon: 'cancel',
            duration: 2000
          })
        }
      })
  }
})