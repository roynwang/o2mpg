// pages/newcoursedetail/newcoursedetail.js

var app = getApp()
// coursedetail.js
Page({

  /**
   * 页面的初始数据
   */
  survey: {},
  data: {
    course: null,
    comments: "",
    actions: [],
    survey: [],
    showsurvey: false,
    commentsItem: null,
    courseid: 0,
    showEdit: false,
    editingComments: false,
    currentUser: null,
    editingItem: null,
    editingItemField: null,
    editingMax: 10,
    editinItemIndex: -1,
    edited: false,
    monthName: "",
    showTarget: false,
    target: {}
  },
  onShareAppMessage: function () {
    this.saveDetail()
    var that = this
    return {
      title: "训练总结×" + that.data.course.customerprofile.displayname,
      path: 'pages/coursedetail/coursedetail?id=' + that.data.courseid,
      imageUrl: "https://dn-o2fit.qbox.me/share_cover.png"
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  loadCourse: function(e){
    let courseid = e.target.dataset.v
    if(courseid === false) {
      return 
    }
    var that = this
    app.loadPtCourseItem(courseid, function (data) {
      var tmp = []
      var comments = ""
      var commentsItem = null
      data.detail.forEach(function (item) {
        if (item.contenttype == "action") {
          tmp.push(item)
        }
        if (item.contenttype == "comments") {
          comments = item.comments
          commentsItem = item
        }
      })
      data.hourstr = app.getHourStr(data.hour)
      data.datestr = data.date.replace(/-/g, "/").substr(5)

      that.setData({
        course: data,
        actions: tmp,
        comments: comments,
        courseid: courseid,
        commentsItem: commentsItem
      })
    })

  },
  onLoad: function (options) {
    var that = this
    var courseid = options.id
    //load course
    app.loadPtCourseItem(courseid, function (data) {
      var tmp = []
      var comments = ""
      var commentsItem = null
      data.detail.forEach(function (item) {
        if (item.contenttype == "action") {
          tmp.push(item)
        }
        if (item.contenttype == "comments") {
          comments = item.comments
          commentsItem = item
        }
      })
      data.hourstr = app.getHourStr(data.hour)
      data.datestr = data.date.replace(/-/g, "/").substr(5)
      let monthName = new Date(data.date).getMonthName()
      app.getUserInfo(function () {
        app.o2GetUser(app.globalData.openid,
          function () {
            that.setData({
              showEdit: app.globalData.userInfo.detail.iscoach
            })
            if (!app.globalData.userInfo.detail.iscoach) {
              that.refreshTarget();
            }
            // console.log("get user info success")
            if (app.globalData.userInfo.detail.name == data.customerprofile.name) {


              that.completeCourse(data)
              that.loadSurvey()
            }
          },
          function () {
            //register
            app.o2ForceBindOpenId(data.customerprofile.name, app.globalData.openid)
            console.log("get user info failed")
            that.completeCourse(data)
            that.refreshTarget();
          })
      })


      that.getWeekDate(data)
      that.setData({
        monthName: monthName,
        course: data,
        actions: tmp,
        comments: comments,
        courseid: courseid,
        commentsItem: commentsItem
      })
    })


    //extract action

  },
  completeCourse: function (course) {
    app.completePtCourseItem(course.id)
  },
  tapHide: function(){
    this.setData({
      showTarget: false
    })
  },
  refreshTarget: function(){
    var that = this
    if (that.data.course.user_confirmed) {
      that.setData({showTarget: false });
      return;
    }
    app.getUserTarget(that.data.course.customerprofile.name, function(data){
        that.setData({target: data, showTarget: true});
    }, function(){
        that.tapHide()
    })
  },
  loadSurvey: function () {
    var that = this
    app.loadCourseSurvey(that.data.courseid, function (data) {
      if (!data.desc) {
        return
      }
      data.questions.forEach(function (item) {
        item.options = [{
          desc: "非常符合",
          value: 2
        },
        {
          desc: "比较符合",
          value: 1
        },
        {
          desc: "部分符合",
          value: -1
        },
        {
          desc: "不符合",
          value: -2
        }]
      })
      that.survey = data
      that.setData({
        survey: data
      })
    })
  },
  optionChanged: function (e) {
    var tar = e.currentTarget
    var i = tar.dataset['i']
    var survey = this.data.survey
    survey.questions[i].score = e.detail.value
    this.survey = survey
  },
  getWeekDate: function(course){
    let startdays = new Date(course.date)
    this.getSelectedDate(course)
    this.setData({
      dates: [0, -1, -2, -3, -4, -5, -6].map(item => startdays.addDays(item).Format("dd")).reverse()
    })

  },
  getSelectedDate: function (course){
    var that = this
    let startdays = new Date(course.date).addDays(-6);
    let selected = []
    let selectedCourses = {}
    app.o2WeekCourse(course.customerprofile.name,
      startdays.Format("yyyyMMdd"),
       (courses)=>{
         courses.forEach(item=>{
            let d = new Date(item.date).Format("dd");
            selected.push(d)
            selectedCourses[d] = item
         })
         that.setData({
           selectedDates: that.data.dates.map((item) => selected.indexOf(item) >= 0 ? selectedCourses[item].id : false )
         })
      }, ()=>{} )
  },
 submitSurvey: function () {
    var that = this
    wx.showLoading({
      title: '提交中',
    })
    app.submitCourseSurvey(this.data.courseid, this.survey, function () {
      that.setData({
        survey: {}
      })
      wx.showToast({
        title: '感谢您的反馈',
        icon: 'success',
        duration: 2000
      })
    })
  },
  editItem: function (e) {
    if (!this.data.showEdit) {
      return
    }
    var that = this
    var tar = e.currentTarget
    var i = tar.dataset['i']
    var k = tar.dataset['k']
    var editingItem = that.data.actions[i]
    var editingMax = 10
    if (k == "weight") {
      editingMax = 60
    }
    that.setData({
      editingItem: that.data.actions[i],
      editingItemField: k,
      editingMax: editingMax,
      editinItemIndex: i
    })

  },
  editingClose: function (e) {
    var that = this
    that.setData({
      editingItem: null
    })
  },
  pickerValueChanged: function (e) {
    var that = this
    that.data.actions[that.data.editinItemIndex][that.data.editingItemField] = e.detail.value
    that.setData({
      edited: true,
      actions: that.data.actions
    })

  },
  showEditAction: function () {
    this.setData({
      editingComments: true
    })
  },
  cancelEdit: function () {
    this.setData({
      editingComments: false
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      comments: e.detail.value,
      edited: true
    })
  },
  saveComments: function () {
    var that = this
    this.setData({
      editingComments: false
    })
    this.data.course.detail.forEach(function (item) {
      if (item.contenttype == "comments") {
        item.comments = that.data.comments
        that.setData({
          commentsItem: item
        })
      }
    })

    app.savePtCourseItem(that.data.course, function () {
      console.log("testaaaa")
    })

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
    console.log("xxxx")

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.saveDetail()
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
  selectValue: function (e) {
    var that = this
    var tar = e.currentTarget
    var v = tar.dataset['v']
    that.data.actions[that.data.editinItemIndex][that.data.editingItemField] = parseInt(v)
    var edi = that.data.editingItem
    edi[that.data.editingItemField] = parseInt(v)
    that.setData({
      edited: true,
      editingItem: edi,
      actions: that.data.actions
    })
  },

  saveDetail: function () {
    var that = this
    if (that.data.edited) {
      that.data.course.detail = that.data.actions
      that.data.course.detail.push(that.data.commentsItem)
      app.savePtCourseItem(that.data.course, function () {
        console.log("testaaaa")
      })
    }
  }
})