// pages/coursereview/coursereview.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    customer: "",
    history:[],
    year: 0,
    month: 0,
    eval: {},
    targets:[],
    userCommentActionText: "说点啥",
    showUserComments: false,
    coursereview: null,
    showConfirm: false,
    showEdit: false,
    showList: false,
    editedReview: '',
    showConfirmButton: true,
    question: [],
    tips: { image: '', text: ''},
    rank: "?",
    saySomethingText:"",
    saySthPlaceholder: ""
  },
  onSaySomthingEdit: function(e){
    this.setData({
      saySomethingText: e.detail.value
    })
  },
  onSaySomthingSave: function() {
    var that = this
    if (that.data.saySomethingText.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '不能为空',
      })
      return
    }
    wx.showLoading({
      title: '正在提交'
    })
    app.o2PostWeibo(
      that.data.customer,
      that.data.saySomethingText,
      function(res){
          wx.hideLoading()
          wx.showToast({ icon: 'success', title: "成功" })
          that.setData({
            history: [],
            showUserComments: false,
            userCommentActionText: "说点啥"
          })
          that.onLoad(that.data.options)
      },
      function(){
        wx.hideLoading()
        wx.showToast({ icon: 'none', title:"失败：再试试~"})
      }
    )
  },
  userCommentActionTapped: function(){
    var that = this
    if (that.data.coursereview.customer_detail.openid != app.globalData.openid) {
      wx.showToast({
        title: '用户信息不符',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.showUserComments) {
      this.setData({
        showUserComments: true,
        userCommentActionText: "x"
      });
    } else {
      this.setData({
        showUserComments: false,
        userCommentActionText: "说点啥"
      });
    }

  },
  loadEvalTarget: function(name) {
    var that = this
    app.getUserTarget(name,
      function (data) {
        data['nextCheckDay'] = new Date().addDays(data.before_day).Format("MM / dd")
        data['percentage'] = 100 - data.before_day * 2.5
        if(data.percentage<0){
          data.percentage = 0
        }
        if(data.percentage>100) {
          data.percentage = 100
        }
        that.setData({ eval: data })
      },
      function (data) {
      })
  },
  loadCustomerTarget: function(name) {
    var that = this
    app.getCustomerTargets(name, 
    function(data){
      that.setData({targets: data})
    }, 
    function(data){
    })
  },
  showCourseDetail: function(e){
    var tar = e.currentTarget
    wx.navigateTo({
      url: tar.dataset['link']
    })
  },
  showRankingList: function(e) {
    wx.navigateTo({
      url: "/pages/rankinglist/rankinglist"
    })
  },
  showPersonalData: function(e) {
    wx.navigateTo({
      url: "/pages/personaldata/personaldata"
    })
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
          history: data,
          showList: true
        })
      }, function () {

      })
      let title = '感谢您的反馈'
      if (anwser <= 0 ) {
        title = "已确认完成"
      }
      wx.showToast({
        title: title,
        icon: 'success',
        duration: 2000
      })
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
    if (!that.data.coursereview.question){
      that.confirm(0)
    }
    return
  },
  showPic: function (e) {
    var that = this
    var tar = e.currentTarget
    var index = parseInt(tar.dataset["index"])
    var i = parseInt(tar.dataset["i"])
    wx.previewImage({
      current: that.data.history[index].body_images[i],
      urls: that.data.history[index].body_images
    })
  },
  loadHistory: function(year, month, customer, onsuccess) {
    var that = this
    app.o2TrainHistoryGet(customer, that.data.year, that.data.month, function (data) {
      history = that.data.history.concat(data)
      that.setData({
        history: history
      })
      onsuccess && onsuccess()
      
    }, function () {

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var that = this
    var placeholders = [
      "不要吝啬表扬你的教练 ♪(^∇^*)",
      "pick你的小哥哥小姐姐 ╰(*°▽°*)╯",
      "尽情怼，怼完小心 (～￣(OO)￣)ブ"
    ]
    let i = Date.parse(new Date()) % (placeholders.length) 
    let saySthPlaceholder = placeholders[i];
    that.setData({
      saySthPlaceholder: saySthPlaceholder,
      options: options,
      year: year,
      month: month
    })

    var courseid = options.id
    //load review
    app.o2CourseReview(courseid, (res) => {
        res.dateStr = res.date.replace(/-/g, '/').substring(5)
        that.setData({
          coursereview: res,
          editedReview: res.coach_review,
          question: res.question.split('|')
        })
      that.loadEvalTarget(res.customer);
      that.loadCustomerTarget(res.customer);
      that.setData({customer: res.customer})
      app.loadCustomerTips(res.customer, function(data){
          that.setData({tips: data})
      })
      app.loadRanking(res.customer, function(data){
        that.setData({rank: app.globalData.ranking.rank})
      })
      that.loadHistory(year, month, res.customer, function(){
        that.onReachBottom()
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
    var that = this
    var month = that.data.month - 1
    var year = that.data.year
    if( month <= 0 ){
      year -= 1
      month = 12 + month
    }
    that.setData({
      year: year,
      month: month
    })
    that.loadHistory(year, month, that.data.customer)
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
  
    if (app.globalData.userInfo.detail.iscoach) {
      app.o2CourseReviewUpdate(newCourse.course, newCourse, null, null)
    } 
    that.determineDisplay()
    return {
      title: '课程确认',
      path: 'pages/coursereview/coursereview?id=' + this.data.coursereview.course,
      imageUrl: "http://static.o2-fit.com/confirm.png",
      success: function() {
        console.log("success")
      },
      fail: function() {
        console.log("fail")
      },
      complete: function() {
       
      }
    }
  }
})