//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    motto: 'Hello World',
    confirm: false,
    phone: "",
    focus: false,
    step: 0,
    vcode: ''
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  bindPhoneKeyInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindVcodeKeyInput: function (e) {
    this.setData({
      vcode: e.detail.value
    })
  },
  tapConfirm: function () {
    var that = this
    that.setData({
      step: 1,
      focus: true
    })
  },
  tapVcode: function () {
    var that = this
    app.o2SendVcode(that.data.phone, function () {
      wx.showToast({
        title: '验证码已发送',
        icon: 'success',
        duration: 2000
      })
    that.setData({
      step: 2,
      focus: true
    })
    },
      function () {
        wx.showToast({
          title: '验证码发送失败',
          icon: 'cancel',
          duration: 2000
        })
      })
  },
  tapSubmit: function () {
    var that = this
    app.o2BindOpenId(that.data.phone, that.data.vcode, app.globalData.openid, function () {
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000
      })
      app.o2GetUser(that.data.phone, function () {
        if (that.data.phone == app.globalData.userInfo.detail.displayname) {
          app.o2UpdateUser(that.data.phone, {
            displayname: app.globalData.userInfo.nickName
          }, null, null)
        }
      }, null)

      setTimeout(function () {
        wx.navigateBack()
      }, 1000)
    }, function () {
      wx.showToast({
        title: '绑定失败',
        icon: 'cancel',
        duration: 2000
      })
    })
  }
})
