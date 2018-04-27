// firstgroupcourse.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    showNext: ""
  },
  bindPhoneKeyInput: function (e) {
    var showNext = false
    if(e.detail.value.length == 11){
      showNext = "active"
    }
    this.setData({
      phone: e.detail.value,
      showNext: showNext
    })
    
  },
  tapConfirm: function(){
    var that = this
    if(this.data.showNext == ""){
      return;
    }
    else {
      wx.showModal({
        title: '请确认号码',
        content: '您的输入是：' + that.data.phone ,
        confirmColor: "#4fd2c2",
        success: function (res) {
          if (res.confirm) {
            // wx.navigateTo({
            //   url: '../booksuccess/booksuccess',
            // })
            // console.log('用户点击确定')
            app.o2CreateFirstTime(
              that.data.phone,
              app.globalData.booking,
              function(res){
                wx.navigateTo({
                  url: '../booksuccess/booksuccess',
                })
              },
              function(res){
                wx.showToast({
                  title: '预约失败',
                  icon: 'cancel',
                  duration: 2000
                })
              })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})