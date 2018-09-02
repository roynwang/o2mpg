// pages/coursereview/coursereview.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    history:[],
    coursereview: null,
    showConfirm: false,
    showEdit: false,
    showList: false,
    editedReview: '',
    showConfirmButton: true,
    question: []
  },
  bindinput: function(e) {
    this.setData({
      editedReview: e.detail.value
    });
  },
  getQuestion: function(){
    return this.data.coursereview.question.split("|")
  },
  determineDisplay: function() {
    let displaySetting = {
      showConfirm: true,
      showEdit: false,
      showList: false
    }
    if (app.globalData.userInfo.detail && app.globalData.userInfo.detail.iscoach) {
      displaySetting.showEdit = !this.data.coursereview.user_confirmed
      displaySetting.showConfirm = false
      displaySetting.showList = true
     
    } else {
      displaySetting.showEdit = false
      displaySetting.showConfirm = true
      displaySetting.showList = this.data.coursereview.user_confirmed
    }
    this.setData(displaySetting)
  },
  confirm: function(anwser) {
    var that = this
    let newCourse = Object.assign({}, this.data.coursereview)
    newCourse.coach = newCourse.coach_detail.name
    newCourse.customer = newCourse.customer_detail.name
    newCourse.user_confirmed = true
    newCourse.coach_review = this.data.editedReview
    newCourse.anwser = anwser
    app.o2CourseReviewUpdate(newCourse.course, newCourse, () => {
      that.determineDisplay()
      that.setData({
        coursereview: newCourse,
        showConfirmButton: false,
        showList: true
      })
      app.o2CourseHistoryGet(newCourse.customer_detail.name, function (data) {
        that.setData({
          history: data
        })
      }, function () {

      })
      if (anwser != 0) {
        wx.showToast({
          title: '感谢您的反馈',
          icon: 'success',
          duration: 2000
        })
      }
    }, () => {

      that.setData({
        coursereview: newCourse,
        showConfirmButton: false,
        showList: true
      })
      that.determineDisplay()
    })
  },
  questionairY: function() {
    this.confirm(1)
  },
  questionairN: function() {
    this.confirm(2)
  },
  questionairSkip: function() {
    this.confirm(0)
  },
  confirmCourse: function() {
    var that = this
    if (!that.data.coursereview.customer_detail.openid) {
      app.o2ForceBindOpenId(that.data.coursereview.customer_detail.name, app.globalData.openid)
    } else {
      if (that.data.coursereview.customer_detail.openid != app.globalData.openid) {
        wx.showToast({
          title: '用户信息不符',
          icon: 'none',
          duration: 2000
        })
        return
      }
    } 
    that.setData({
      showConfirmButton: false
    })
    if(!that.data.coursereview.coach_review){
      that.confirm(-1)
    }
    return
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var courseid = options.id
    //load review
    app.o2CourseReview(courseid, (res) => {
        res.dateStr = res.date.replace(/-/g, '/').substring(5)

        that.setData({
          coursereview: res,
          editedReview: res.coach_review,
          question: res.question.split('|')
        })
        app.o2CourseHistoryGet(res.customer_detail.name, function(data){
            that.setData({
              history: data
            })
        }, function() {

        })

        app.getUserInfo(() => {
          app.o2GetUser(app.globalData.openid,
            () => {
              that.determineDisplay()
            },
            () => {
              that.determineDisplay()
              console.log("get user info failed")
            })
        })
      },
      (res) => {
        console.log("get course review failed")
      })

  },

  /**
   * 
   * 
   * 
   * 
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this
    this.setData({
      showConfirm: true,
      showEdit: false,
      user_confirmed: true,
      showList: false
    })

    let newCourse = Object.assign({}, this.data.coursereview)
    newCourse.coach = newCourse.coach_detail.name
    newCourse.customer = newCourse.customer_detail.name
    newCourse.user_confirmed = false
    newCourse.coach_review = this.data.editedReview
    app.o2CourseReviewUpdate(newCourse.course, newCourse, null, null)

    return {
      title: '课程确认',
      path: 'pages/coursereview/coursereview?id=' + this.data.coursereview.course,
      success: function() {
        console.log("success")
      },
      fail: function() {
        console.log("fail")
      },
      complete: function() {
        that.determineDisplay()
      }
    }

  }

})