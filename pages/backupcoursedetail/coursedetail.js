
var app = getApp()
// coursedetail.js
Page({

  /**
   * 页面的初始数据
   */
  survey:{},
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
    edited: false
  },
  onShareAppMessage: function () {
    this.saveDetail()
    var that = this
    return {
      title: "训练总结×" + that.data.course.customerprofile.displayname,
      path: 'pages/coursedetail/coursedetail?id=' + that.data.courseid
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
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
      app.getUserInfo(function () {
        app.o2GetUser(app.globalData.openid,
          function () {
            that.setData({
              showEdit: app.globalData.userInfo.detail.iscoach
            })
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
          })
      })


      that.setData({
        course: data,
        actions: tmp,
        comments: comments,
        courseid: courseid,
        commentsItem: commentsItem
      })
    })


    //extract action

  },
  completeCourse: function(course){
    app.completePtCourseItem(course.id)

  },
  loadSurvey: function(){
    var that = this
    app.loadCourseSurvey(that.data.courseid, function(data){
        if(!data.desc){
          return
        }
        data.questions.forEach(function(item){
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
  optionChanged: function(e){
    var tar = e.currentTarget
    var i = tar.dataset['i']
    var survey = this.data.survey
    survey.questions[i].score = e.detail.value
    this.survey = survey
  },
  submitSurvey: function(){
    var that = this
    wx.showLoading({
      title: '提交中',
    })
    app.submitCourseSurvey(this.data.courseid, this.survey, function(){
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
  selectValue: function(e){
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