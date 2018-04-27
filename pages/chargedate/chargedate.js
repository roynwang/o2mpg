var app = getApp()
Page({
  data: {
    userInfo: {},
    priceTable: [],
    selected: 0
  },
  selectPrice: function (e) {
    var that = this
    var tar = e.currentTarget
    var i = parseInt(tar.dataset["i"])
    var tp = that.data.priceTable
    tp[that.data.selected].selected = false
    tp[i].selected = true
    that.setData({
      selected: i,
      priceTable: tp
    })
  },
  tapPay: function () {
    var that = this
    wx.showToast({
      title: '执行中',
      icon: 'loading',
      duration: 40000
    })
    app.o2ChargeDate(
      app.globalData.userInfo.detail.name,
      that.data.priceTable[that.data.selected].duration,
      function (res) {
        wx.hideToast()
        wx.showToast({
          icon: 'success',
          title: '续期成功',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack()
        }, 1000)
        console.log(res.data)
      },
      function (res) {
        wx.hideToast()
        wx.showToast({
          title: '失败',
          duration: 2000
        })
        console.log(res.data)
      }
    )
  },
  onLoad: function () {
    var that = this
    var t = [{
      duration: 1,
      price: 1800,
      selected: true
    },
    {
      duration: 3,
      price: 4500,
      selected: false
    }
    ]
    that.setData({
      userInfo: app.globalData.userInfo,
      selected: 0,
      priceTable: t
    })

  }
})