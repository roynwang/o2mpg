// pages/newbook/newbook.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "2019-02-09",
    timeMap: app.TimeMap,
    coaches: [
      {
        selected: true,
        displayname: "test",
        avatar: "/res/share_cover.png"
      },
      {
        displayname: "test2",
        avatar: "/res/note.png"
      }
    ],
    displaySubmitHour: -2,
    selectedCoach: 0,
    availableHours: [0, 2, 4],
    avaMap: {},
    orderId: -1,
    customer: null
  },
  selectCoach: function (e) {
    this.setData({
      selectedCoach: e.currentTarget.dataset["i"]
    })
    this.loadAvailableTime()
  },
  submitBook: function () {
    let that = this
    let hour = that.data.displaySubmitHour
    let date = that.data.date
    let coach = that.data.coaches[that.data.selectedCoach]
    let customer = that.data.customer
    let orderId = that.data.orderId
    if(that.data.mode == "create") {
    app.o2CustomerCreateBook(coach, customer, orderId, date, hour, 
      function (data) {
        that.loadAvailableTime()
        wx.showToast({
          title: '预约成功',
          icon: 'success',
          duration: 2000
        })
      },
      function () { }
    );
    }
    if(that.data.mode == "reschedule") {
      app.saveNewPtCourseTime(that.data.courseId, coach.id, date, hour, function(data){
        that.loadAvailableTime()
        wx.showToast({
          title: '预约成功',
          icon: 'success',
          duration: 2000
        })
      })
    }
  },
  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
    })
    this.loadAvailableTime()
  },
  loadAvailableTime() {
    var that = this
    app.o2GetCoachAvailableHour(this.data.coaches[this.data.selectedCoach].name, this.data.date, function (data) {
      let hours = data.availiable
      let hash = {}
      that.data.timeMap.forEach(function (h, k) {
        hash[k] = hours.indexOf(k) >= 0
      })

      that.setData({
        availableHours: data.availiable,
        avaMap: hash,
        displaySubmitHour: -2,
      })
    },
      function () { }
    )

  },
  selectHour(e) {
    let i = e.currentTarget.dataset["i"];
    if (i >= 25 || !this.data.avaMap[i + 1]) {
      return
    }
    this.setData({
      displaySubmitHour: i
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.o2GetUserAvailableCoaches(app.globalData.userInfo.detail.name,
    function(data){
      let availableCoaches = data.filter(function (item) { return item.can_book})
      if (options.mode == "create") {
        that.setData({
          mode: options.mode,
          orderId: options.orderId,
          courseId: options.courseId || false,
          date: new Date().addDays(1).Format("yyyy-MM-dd"),
          coaches: availableCoaches,
          customer: app.globalData.userInfo.detail,
        })
        that.loadAvailableTime()
      }
      if (options.mode == "reschedule") {
        //load schedule
        app.loadPtCourseItem(options.courseId, function (data) {
          // get target coach
          let selected = 0;
          for (let i = 0; i < availableCoaches.length; i++) {
            if (availableCoaches[i].name == data.coachprofile.name) {
              selected = i
              break
            }
          }
          // assign value
          that.setData({
            mode: options.mode,
            orderId: data.order,
            courseId: options.courseId,
            date: data.date,
            selectedCoach: selected,
            coaches: availableCoaches,
            customer: data.customerprofile
          })
          that.loadAvailableTime()
        })
      }


    })
  
    
   
    // this.setData({
    //   timeMap: app.TimeMap
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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