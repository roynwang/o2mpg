//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    user: true,
    days: [],
    courselist: [],
    currentDate: null,
    hide_selection: true,
    selectedgym: 31,
    datestr: new Date().Format("MM/dd"),
    hours: ["09:00", "09:30",
      "10:00", "10:30",
      "11:00", "11:30",
      "12:00", "12:30",
      "13:00", "13:30",
      "14:00", "14:30",
      "15:00", "15:30",
      "16:00", "16:30",
      "17:00", "17:30",
      "18:00", "18:30",
      "19:00", "19:30",
      "20:00", "20:30",
      "21:00", "21:30",
      "22:00"],
    w: 0,
    keywords: ["所有", "竖脊肌", "髂腰肌", "胸大肌", "腹直肌", "背阔肌", "股四头肌", "臀大肌", "腘绳肌", "腓肠肌", "外展肌群", "三角肌", "肱三头肌", "腹外斜肌", "内收肌群", "臀部肌群", "斜方肌", "肱二头肌", "颈部", "腹肌", "中背部", "胸肌", "肩部", "下背部", "前臂", "小腿肌群", "胫骨前肌", "比目鱼肌", "前臂肌群"],
    selected_keyword: "所有",
    showBook: false,
    bookedGroupCourse: [],
    day: new Date(),
    playing: -1,
    tabs: {
      mainpage: "active",
      video: "",
      groupcourse: "",
      selfservice: "",
    },
    videonexturl: "",
    videos: []
  },
  loading: false,
  toggleMuscle: function () {
    var that = this
    that.setData({
      hide_selection: !that.data.hide_selection
    })
  },
  showtraindetail: function(e){
    var that = this
    var tar = e.currentTarget
    var i = tar.dataset['i']
    wx.navigateTo({
      url: '../coursedetail/coursedetail?id=' + i
    })
  },
  showVideo: function (e) {
    var that = this
    var tar = e.currentTarget
    var i = tar.dataset['i']
    app.globalData.playing = that.data.videos[i]
    wx.navigateTo({
      url: '../videodetail/videodetail?id=' + that.data.videos[i].id
    })

  },
  tapKeyword: function (e) {
    var that = this
    var tar = e.currentTarget
    that.setData({
      videos: [],
      selected_keyword: tar.dataset['i'],
      videonexturl: app.getVideoListUrl(tar.dataset['i'])
    })
    that.toggleMuscle()
    that.loadMoreVideo()
  },
  playvideo: function (e) {
    var that = this
    var tar = e.currentTarget
    var i = tar.dataset['i']
    that.setData({
      playing: parseInt(i)
    })
  },


  tapBook: function (e) {
    var that = this
    // if (app.globalData.userInfo.detail == null) {
    //   wx.navigateTo({
    //     url: '../register/register'
    //   })
    // } else {
    var tar = e.currentTarget
    var i = parseInt(tar.dataset["i"])
    app.globalData.booking = that.data.courselist[i]
    wx.navigateTo({
      url: '../bookconfirm/bookconfirm?id=' + app.globalData.booking.id
    })
    // }
  },
  selectDate: function (i) {
    var that = this
    var days = that.data['days']
    days[that.data.currentDate].selected = false
    days[i].selected = true
    that.setData({
      currentDate: i,
      days: days
    })
    app.loadGroupCourse(app.globalData.gym, days[i].datenum, function (courselist) {
      that.setData({
        courselist: courselist
      })
    })
  },
  tapDate: function (e) {
    var that = this
    var tar = e.currentTarget
    var i = parseInt(tar.dataset["i"])
    that.selectDate(i)
  },



  showMe: function () {
    if (app.globalData.userInfo.detail != null) {
      wx.navigateTo({
        url: '../me/me'
      })
    } else {
      wx.navigateTo({
        url: '../register/register'
      })
    }
  },
  toggleTab: function (e) {
    var that = this
    var tar = e.currentTarget
    var tabs = {
      mainpage: "",
      video: "",
      groupcourse: "",
      selfservice: ""
    };
    if ("mainpage" == tar.dataset['i']) {
      tabs.mainpage = 'active'
      wx.setNavigationBarTitle({
        title: "我的日程"
      })

      if (app.globalData.userInfo.detail == null) {
        wx.navigateTo({
          url: '../register/register'
        })
      } 
    }
    if ("video" == tar.dataset['i']) {
      tabs.video = 'active'
      wx.setNavigationBarTitle({
        title: "动作查询" 
      })
    }
    if ("groupcourse" == tar.dataset['i']) {
      tabs.groupcourse = 'active'
      wx.setNavigationBarTitle({
        title: "团课预约"
      })
    }
    if ("selfservice" == tar.dataset['i']) {
      tabs.selfservice = 'active'
      wx.setNavigationBarTitle({
        title: "自助锻炼预约"
      })
    }
    that.setData({
      tabs: tabs
    })
  },
  loadMoreVideo: function () {
    var that = this
    if (that.videoloading == true) {
      return
    }
    if (that.data.videonexturl === null) {
      return
    }
    that.videoloading = true
    app.getVideo(that.data.videonexturl, function (data) {
      that.videoloading = false
      that.setData({
        videos: that.data.videos.concat(data.results),
        videonexturl: data.next
      })
    })
  },
  loadMoreCourse: function () {

    var that = this
    if (that.loading == true) {
      return
    }
    that.loading = true
    app.o2BookedPtCourse(that.data.day, app.globalData.userInfo.detail.name, function (nextdate, courses) {

      that.loading = false

      that.data.day = nextdate
      courses = courses.reverse()
      var m = that.data.bookedGroupCourse.concat(courses)
      that.setData({
        bookedGroupCourse: m
      })
    })
  },
  bookNow: function () {
    if (app.globalData.userInfo.detail != null) {
      wx.navigateTo({
        url: '../courselist/courselist'
      })
    } else {
      wx.navigateTo({
        url: '../register/register'
      })
    }
  },
  confirmCancel: function (id) {

  },
  tapCancel: function (e) {
    var that = this
    var tar = e.currentTarget
    var i = parseInt(tar.dataset["i"])
    var bgc = that.data.bookedGroupCourse
    if (bgc[i].confirming) {
      app.o2CancelBookedGroupCourse(bgc[i].id, function (res) {
        wx.showToast({
          title: '预约已取消',
          icon: 'success',
          duration: 2000
        })
        that.onShow()
      }, function () {
        wx.showToast({
          title: '取消失败',
          icon: 'cancel',
          duration: 2000
        })
      })
    } else {
      bgc[i].confirming = true
      that.setData({
        bookedGroupCourse: bgc
      })
      setTimeout(function () {
        var bgc = that.data.bookedGroupCourse
        bgc[i].confirming = false
        that.setData({
          bookedGroupCourse: bgc
        })
      }, 5000)
    }
  },
  onShow: function () {
    var that = this
    var courses = []
    if (that.loading == true) {
      return
    }

    if (app.globalData.userInfo.detail) {
      that.loading = true
    } else {
      return
    }

    app.globalData.bookedPtCourse = []
    app.globalData.bookedGroupCourse = []
    app.o2BookedPtCourse('', app.globalData.userInfo.detail.name, function (start) {
      that.data.day = start
      courses = courses.concat(app.globalData.bookedPtCourse)
      app.o2BookedGroupCourse(app.globalData.userInfo.detail.name, function () {
        that.loading = false
        courses = courses.concat(app.globalData.bookedGroupCourse)
        
        courses.sort(function(a,b){
          var ad = new Date(a.date + " " + a.hour_str + ":00").getTime()
          var bd = new Date(b.date + " " + b.hour_str + ":00").getTime()
          return ad - bd 
        })
        courses = courses.reverse().slice(0,50);
        var hideBook = false
        courses.forEach(function (item) {
          hideBook = hideBook || !item.completed
        })
        that.setData({
          //!TODO 展现预约按钮
          // showBook: !hideBook,
          bookedGroupCourse: courses
        })
      }, function () { })
    }, function () { })

  },
  onLoad: function () {
    var that = this
    var days = app.getOneWeek()
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
          w: res.windowWidth * .95
        });

      }
    });
    that.setData({
      userInfo: app.globalData.userInfo,
      days: days,
      currentDate: 0
    })
    that.selectDate(0)
    if (app.globalData.userInfo.detail) {
      app.o2GetUserTrainSummary(app.globalData.userInfo.detail.name,
        app.globalData.gym, function () { })
    }
    that.loadMoreVideo()
    that.loadGymLoad()
  },
  toggleGymLoad:function(e){
    var that = this
    var tar = e.currentTarget
    var i = tar.dataset['i']
    that.setData({
      selectedgym: i,
     
    })
    that.loadGymLoad(1)
  },
  loadGymLoad: function (showtoast) {
    var that = this
    var selected = that.data.selectedgym
    if(showtoast){
      wx.showLoading({
       title: '正在读取',
      })
    }
    app.o2GymLoad(selected,
      function (res) {
        res.forEach(function(item){
          item.seats = Array(item.course_count).fill(1);
          if(item.selftrain){
            item.seats[0] = 0
          }
        })
        that.setData({  
          load: res
        })
        if (showtoast) {
          wx.hideLoading()
        }  
      },
      function (res) {

      })
  },
  cancelSelfTrain:function(e){
    var that = this
    var tar = e.currentTarget
    var i = tar.dataset['i']
    app.o2CancelSelfHour(i,function(res){
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      })
      setTimeout(function () {
        that.loadGymLoad()
      }, 2000);
    },
    function(){
      wx.showToast({
        title: '失败',
        duration: 2000
      })
    })
  },
  confirmSelfTrain: function(e){
    var that = this
    var tar = e.currentTarget
    var i = tar.dataset['i']

    app.o2SubmitSelfHour(
      that.data.selectedgym,
      i,
      function(res){
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      },
      function(){
        wx.showToast({
          title: '失败',
          duration: 2000
        })
      }
    )
  },

  selectHour: function(e){

    if (app.globalData.userInfo.detail == null) {
      wx.navigateTo({
        url: '../register/register'
      })
    } 

    var that = this
    if(that.pending){
      return
    }
    that.pending = true

    var tar = e.currentTarget
    var i = tar.dataset['i']
    var t = that.data.load
    t[i].confirming = 1
    that.setData({
      load: t
    })
    var cb = function () {
      that.pending = false
      that.loadGymLoad()
    }
    setTimeout(cb,4000)
  }
})
