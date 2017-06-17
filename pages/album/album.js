var app = getApp()
Page({
  data: {
    pics: [],
    nexturl: "",
    days: []
  },
  loading: false,
  //事件处理函数
  showPic: function(e){
    var that = this
    var tar = e.currentTarget
    var i = parseInt(tar.dataset["i"])
    wx.previewImage({
      current: that.data.pics[i], 
      urls: that.data.pics
    })
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
    that.loadPic()
  },
  loadPic: function (e) {
    var that = this
    if(that.loading){
      return
    }
   
    if (that.data.nexturl != null) {
      that.loading = true
      app.getAlbum(that.data.nexturl, app.globalData.userInfo.detail.name, function (data) {
        var tmppics = that.data.pics
        var days = {}
        that.loading = false

        data.results.forEach(function (item) {
          tmppics.push(item.url)
        })
        data.results.forEach(function (item) {
          if(!days[item.date]){
            days[item.date] = []
          }
          days[item.date].push(item)
        })

        that.setData({
          nexturl: data.next,
          pics: tmppics,
          days: days
        })
      })
    }
  }
})