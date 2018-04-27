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
    summary: null,
    registered: true

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
  onShareAppMessage: function () {
    return {
      title: "快来加入氧气小团课",
      path: 'pages/bookconfirm/bookconfirm?id=' + app.globalData.booking.id
    };
  },
  refreshUser(date){
    var that = this
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
      console.log(app.globalData.userInfo)
      app.o2GetUser(app.globalData.openid,
        function () {
          app.o2GetUserTrainSummary(app.globalData.userInfo.detail.name,
            app.globalData.gym, function () {
              that.setData({
                summary: app.globalData.userInfo.trainsummary,
              })
            })
          app.o2GetDiscount(app.globalData.userInfo.detail.name,
            date.Format("yyyyMMdd"),
            function (res) {
              if (res.enddate && new Date(res.enddate) > new Date(date)){
                that.setData({
                  registered: true,
                  discount: { discount: 0 },
                  discountprice: 0,
                  finalprice: 0
                })
              } else {
              that.setData({
                discount: res,
                discountprice: Math.ceil(app.globalData.booking.price * res.discount / 100),
                finalprice: app.globalData.booking.price - Math.ceil(app.globalData.booking.price * res.discount / 100),
              })
              }
            },
            function () {
              that.setData({      
                discount: 0,
                discountprice: 0,
                finalprice: app.globalData.booking.price
              })
            })
        },
        function () {
          that.setData({
            registered: false,
            discount: {discount:0},
            discountprice: 0,
            finalprice: 0
          })
        })
    })

  },

  onLoad: function (options) {
    var that = this
    var courseid = options.id
    if (courseid) {
      //get course detail
      app.loadGroupCourseItem(courseid, function (data) {
        app.globalData.booking = data
        var date = new Date(app.globalData.booking.date)
        that.setData({
          booking: app.globalData.booking,
          day: date.getDate(),
          month: date.getShortMonthName()
        })
        app.getGym(app.globalData.booking.gym,function(){
          that.setData({
            gymInfo: app.globalData.gymInfo
          })
        })

        that.refreshUser(date)

     
      })

    }
  },
  onShow: function () {
    var that = this
  },
  tapConfirm: function () {
    var that = this
    if(!that.data.registered){
      wx.navigateTo({
        url: '../firstgroupcourse/firstgroupcourse'
      })
      return 
    }

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