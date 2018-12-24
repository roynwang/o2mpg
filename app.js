//app.js
// var host = 'http://localhost:8000/api'
var host = 'https://o2-fit.com/api'
// var host = 'http://localhost:8000/api'
var TimeMap = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"]
var Weekdays = ['周日','周一','周二','周三','周四','周五','周六'];

Date.prototype.addDays = function (days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
}
Date.prototype.getWeekDay = function (days) {
  var dat = new Date(this.valueOf());
  return Weekdays[dat.getDay()]
}
Date.prototype.monthNames = [
  "一月", "二月", "三月",
  "四月", "五月", "六月",
  "七月", "八月", "九月",
  "十月", "十一月", "十二月"
];

Date.prototype.getMonthName = function () {
  return this.monthNames[this.getMonth()];
};
Date.prototype.getShortMonthName = function () {
  return this.getMonthName().substr(0, 3).toUpperCase();
};
Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

App({
  o2PostWeibo: function(name, content, onsuccess, onfail){
    var that = this
    wx.request({
      url: host + '/' + name + '/weibo/',
      header: {
        'content-type': 'application/json',
      },
      data: {
        title: "user_comments",
        brief: content,
      },
      method: "post",
      success: function (res) {
        if (res.statusCode == 500) {
          typeof onfail == "function" && onfail()
          return
        }
        typeof onsuccess == "function" && onsuccess(res.data)
      },
      fail: function (res) {
        typeof onfail == "function" && onfail()
      }
    })
  },
  o2GetDiscount: function(phone, date,onsuccess, onfail){
    var that = this
     wx.request({
      url: host + '/'+ phone+'/discount/' + date,
      header: {
        'content-type': 'application/json',
      },
      method: "get",
      success: function (res) {
        typeof onsuccess == "function" && onsuccess(res.data)
      },
      fail: function (res) {
        typeof onfail == "function" && onfail()
      }
    })
  },
  o2TrainHistoryGet: function (name, year, month, onsuccess, onfail) {
    wx.request({
      url: host + '/' + name + '/traintimeline/' + year + "/" + month + "/",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        res.data.forEach(function (item) {
          let d = new Date(item.date)
          item.month = d.getMonthName()
          item.day = d.getDate()
        })
        typeof onsuccess == "function" && onsuccess(res.data)
      },
      fail: function (res) {
        typeof onfail == "function" && onfail()
      }
    })
  },
  o2CourseHistoryGet: function (name, onsuccess, onfail) {
    wx.request({
      url: host + '/' + name + '/review/',
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        res.data.forEach(function(item){
          let d = new Date(item.date)
          item.month = d.getMonthName()
          item.day = d.getDate()
        })
        typeof onsuccess == "function" && onsuccess(res.data)
      },
      fail: function (res) {
        typeof onfail == "function" && onfail()
      }
    })
  },
  o2CourseReviewUpdate: function (id, data, onsuccess, onfail) {
    wx.request({
      url: host + '/s/' + id + '/review/patch/',
      header: {
        'content-type': 'application/json',
      },
      data: data,
      method: "PUT",
      success: function (res) {
        typeof onsuccess == "function" && onsuccess(res.data)
      },
      fail: function (res) {
        typeof onfail == "function" && onfail()
      }
    })
  },
  o2CourseReview: function (id, onsuccess, onfail) {
    wx.request({
      url: host + '/s/' + id + '/review/',
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        typeof onsuccess == "function" && onsuccess(res.data)
      },
      fail: function (res) {
        typeof onfail == "function" && onfail()
      }
    })
  },
  o2GetCharge: function(phone, chargeid,gym,code,onsuccess, onfail){
     var that = this
     wx.request({
      url: host + '/'+ phone+'/chargeorder/',
      header: {
        'content-type': 'application/json',
      },
      method: "post",
      data:{
        id: chargeid,
        code: code,
        gym: gym
      },
      success: function (res) {
        typeof onsuccess == "function" && onsuccess(res.data)
      },
      fail: function (res) {
        typeof onfail == "function" && onfail()
      }
    })
  },
  o2GetPricing: function (gym, onsuccess, onfail) {
    var that = this
    wx.request({
      url: host + '/g/' + gym + "/chargepricing/",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        typeof onsuccess == "function" && onsuccess(res.data)
      },
      fail: function (res) {
        typeof onfail == "function" && onfail()
      }
    })
  },
  o2CancelBookedGroupCourse: function (id, onsuccess, onfail) {
    var that = this
    wx.request({
      url: host + '/groupcoursebook/' + id + "/",
      header: {
        'content-type': 'application/json',
      },
      method: "delete",
      success: function (res) {
        typeof onsuccess == "function" && onsuccess(res.data)
      },
      fail: function (res) {
        typeof onfail == "function" && onfail()
      }
    })
  },
  o2WeekCourse: function( phone, day, onsuccess, onfail) {
    wx.request({
      url: host + '/' + phone + '/w/' + day,
      header: {
        'content-type': 'application/json',
      },
      data: {
      },
      success: function (res) {
        var ret = []
        if (res.statusCode != 200) {
          onfail()
        } else {
          onsuccess(res.data.results)
        }
      },
      fail: function (res) {
        onfail()
      }
    })
  },
  o2BookedPtCourse: function (day,phone, onsuccess, onfail) {
    var that = this
    if(that.globalData.bookedPtCourse == null){
      that.globalData.bookedPtCourse = []
    }
    var date = new Date()
    if(day != ''){
      date = day
    }
    let delta = 30
    if(that.globalData.userInfo.detail.iscoach){
      delta = 7
    }
    var start = date.addDays(-delta)
    wx.request({
      url: host + '/'+ phone +'/w/',
      header: {
        'content-type': 'application/json',
      },
      data: {
        start: start.Format("yyyyMMdd"),
        end: date.Format("yyyyMMdd")
      },
      success: function (res) {
        var ret = []
        if (res.statusCode != 200) {
          onfail()
        } else {
         
          res.data.forEach(function (item) {
            var d = new Date(item.date)
            var tmp = {
              "id": item.id,
              "hour": item.hour,
              "hour_str": TimeMap[item.hour],
              "weekday" : d.getWeekDay(),
              "date": item.date,
              "month": d.getShortMonthName(),
              "day": d.getDate(),
              "confirming": false,
              "coach": item.coachprofile.displayname,
              "customer": item.customerprofile.displayname,
              "title": "1 V 1 普通训练",
              "hide_cancel": true,
              "completed": item.done,
              "price":item.price,
              "discount":item.discount,
              "iscoach" :that.globalData.userInfo.detail.iscoach
            }
            ret.push(tmp)
            that.globalData.bookedPtCourse.push(tmp)
          })
          onsuccess(start, ret)
        }
      },
      fail: function (res) {
        onfail()
      }
    })
  },
  o2BookedGroupCourse: function (phone, onsuccess, onfail) {
    var that = this
    wx.request({
      url: host + '/' + phone + '/groupcourse/',
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        if (res.statusCode != 200) {
          onfail()
        } else {


          var courses = []
          res.data.forEach(function (item) {
            var d = new Date(item.date)
            var tmp = {
              "id": item.id,
              "hour": item.course_detail.hour,
              "hour_str": TimeMap[item.course_detail.hour],
              "date": item.date,
              "weekday" : d.getWeekDay(),
              "month": d.getShortMonthName(),
              "day": d.getDate(),
              "confirming": false,
              "price": 150,
              "discount": 150-item.price,
              "title": item.course_detail.course_detail.serial + "／" + item.course_detail.course_detail.title,
              "coach": item.course_detail.coach_detail.displayname
            }
            var m = tmp.date + " " + tmp.hour_str + ":00"
            tmp.completed = new Date().Format("yyyy-MM-dd hh:mm") > m
            courses.push(tmp)
          })
          that.globalData.bookedGroupCourse = courses
          onsuccess()
        }
      },
      fail: function (res) {
        onfail()
      }
    })
  },
  o2BookGroupCourse: function (course, onsuccess, onfail) {
    var that = this
    wx.request({
      url: host + '/g/' + course.gym + '/groupcoursebook/' + course.date.replace(/-/g, "") + "/",
      data: {
        gym: course.gym,
        date: course.date,
        customer: that.globalData.userInfo.detail.name,
        course: course.id
      },
      method: "post",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        if (res.statusCode != 201) {
          onfail(res)
        } else {
          onsuccess()
        }
      },
      fail: function (res) {
        onfail()
      }
    })
  },
  o2UpdateUser: function (phone, data, onsuccess, onfail) {
    var that = this
    wx.request({
      url: host + '/' + phone + '/patch/',
      data: data,
      method: "PUT",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        if (res.statusCode != 200) {
          typeof onfail == "function" && onfail()
        } else {
          that.globalData.userInfo.detail = res.data
          typeof onsuccess == "function" && onsuccess()
        }
      },
      fail: function (res) {
        typeof onfail == "function" && onfail(res)
      }
    })
  },
  o2SendVcode: function (phone, onsuccess, onfail) {
    var that = this
    wx.request({
      url: host + '/sms/',
      data: {
        "number": phone
      },
      method: "post",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        if (res.statusCode != 200) {
          onfail()
        } else {
          onsuccess()
        }
      },
      fail: function (res) {
        onfail()
      }
    })
  },
o2CreateFirstTime:function(phone, course,onsuccess){
    var that = this
    wx.request({
      url: host + '/g/' + course.gym + '/groupcoursebook/' + course.date.replace(/-/g, "") + "/",
      data: {
        firsttime: 1,
        phone: phone,
        openid: that.globalData.openid,
        gym: course.gym,
        date: course.date,
        customer:phone,
        course: course.id
      },
      method: "post",
      header: {
        'content-type': 'application/json',
      },
      success:function(res){
        onsuccess()
      }})

  },
  o2ForceBindOpenId: function(phone, openid){
    var that = this
    wx.request({
      url: host + '/' + phone + "/bindopenid/",
      data: {
        "openid": openid
      },
      method: "post",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
      },
      fail: function (res) {
      }
    })
  },
  o2BindOpenId: function (phone, vcode, openid, onsuccess, onfail) {
    var that = this
    wx.request({
      url: host + '/sms/' + phone + "/",
      data: {
        "vcode": vcode,
        "openid": openid,
        "password": vcode
      },
      method: "post",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        if (res.statusCode != 200) {
          onfail()
        } else {
          onsuccess()
        }
      },
      fail: function (res) {
        onfail()
      }
    })
  },
  o2GetUserTrainSummary: function (name, gym,onsuccess, onfail) {
    var that = this
    wx.request({
      url: host + '/' + name + '/summary/' + gym + '/',
      data: {
      },
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        if (res.statusCode == 404) {
          onfail()
        } else {
          that.globalData.userInfo.trainsummary = res.data
          onsuccess()
        }
      },
      fail: function (res) {
        onfail()
      }
    })
  },
  o2GetUser: function (openid, onsuccess, onfail) {
    var that = this
    wx.request({
      url: host + '/' + openid + '/',
      data: {
      },
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {

        if (res.statusCode == 404) {
          onfail()
        } else {
          that.globalData.userInfo.detail = res.data
          //try to update avatar
          if (that.globalData.userInfo.avatarUrl != res.data.avatar){
            that.o2UpdateUser(res.data.name,
              { avatar: encodeURI(that.globalData.userInfo.avatarUrl)},
              function () {
              },
              function (err) {
              }
            )
          }
          onsuccess()
        }
      },
      fail: function (res) {
        onfail()
      }
    })
  },
  o2GetOpenId: function (code, onsuccess) {
    var that = this
    if (that.globalData.openid != null) {
      typeof cb == "function" && cb()
      return
    }
    wx.request({
      url: host + '/wx/signature/',
      data: {
        code: code
      },
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        that.globalData.openid = res.data.openid
        typeof onsuccess == "function" && onsuccess()
      }
    })

  },
  getGym: function (gym, onsuccess) {
    var that = this
    wx.request({
      url: host + '/g/' + gym + '/',
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        that.globalData.gymInfo = res.data
        typeof onsuccess == "function" && onsuccess(res.data)
      }
    })
  },
  savePtCourseItem: function(course, onsuccess){
    var url = host + "/s/" + course.id + "/patch/"
    wx.request({
      url: url,
      method: "PUT",
      data: {
        id: course.id,
        detail: JSON.stringify(course.detail)
      },
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        res.data.detail = JSON.parse(res.data.detail)
        typeof onsuccess == "function" && onsuccess(res.data)
      }
    })
  },
  loadPtCourseItem: function(courseid, onsuccess){
    var url = host + "/s/" + courseid + "/"
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        res.data.detail = JSON.parse(res.data.detail)
        typeof onsuccess == "function" && onsuccess(res.data)
      }
    })
  },
  completePtCourseItem: function (courseid, onsuccess) {
    var url = host + "/s/" + courseid + "/complete/"
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        typeof onsuccess == "function" && onsuccess(res.data)
      }
    })
  },
  loadGroupCourseItem: function(courseid, onsuccess){
    var url = host + "/groupcourseinstance/" + courseid
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        console.log(res.data)
        typeof onsuccess == "function" && onsuccess(res.data)
      }
    })
  },
  loadGroupCourse: function (gym, date, onsuccess) {
    var that = this
    wx.request({
      url: host + '/g/' + gym + "/groupcourseinstance/" + date + '/',
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        console.log(res.data)
        
        res.data.forEach(function (item) {
          var d = new Date(item.date)
          item.hour_str = TimeMap[item.hour]
          item.weekday =  d.getWeekDay()
        })
        typeof onsuccess == "function" && onsuccess(res.data)
      }
    })
  },
  getHourStr: function(hour){
    return TimeMap[hour]
  },
  onLaunch: function () {
    var that = this
    that.getGym(that.globalData.gym)
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (lgres) {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              that.o2GetOpenId(lgres.code, function () {
                typeof cb == "function" && cb(that.globalData.userInfo)
              })
            }
          })
        }
      })
    }
  },
  getUserOrder: function(name,onsuccess, onfail){
    var url = host + '/' + name + "/o/"
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        typeof onsuccess == "function" && onsuccess(res.data.results)
      }
    })

  },
  getUserTarget: function (name, onsuccess, onfail) {
    var url = host + '/' + name + "/t/"
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        console.log(res.data)
        typeof onsuccess == "function" && onsuccess(res.data)
      }
    })
  },
  getCustomerTargets: function (name, onsuccess, onfail) {
    var url = host + '/' + name + "/targets/"
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        console.log(res.data)
        typeof onsuccess == "function" && onsuccess(res.data)
      }
    })
  },
  getEvalDate: function (name,onsuccess, onfail){
    var url = host + '/' + name + "/e/"
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        console.log(res.data)
        typeof onsuccess == "function" && onsuccess(res.data)
      }
    })
  },
  getEvalDateDetail: function (name, date, onsuccess, onfail) {
    var url = host + '/' + name + "/e/" + date.replace(/-/g, "") + "/"
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        console.log(res.data)
        typeof onsuccess == "function" && onsuccess(res.data)
      }
    })
  },
  getVideoItem: function(id, onsuccess, onfail){
    var url = host + '/video/' + id
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        console.log(res.data)
        typeof onsuccess == "function" && onsuccess(res.data)
      }
    })
  },
  getAlbum: function (url, name, onsuccess, onfail){
    var that = this
    if(url == ""){
      url = host + '/' + name + "/album/"
    }
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        console.log(res.data)
        typeof onsuccess == "function" && onsuccess(res.data)
      }
    })
  },
  getVideo: function (url, onsuccess, onfail) {
    var that = this
    if (url == "") {
      url = host + '/g/31/video/page/';
    }
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        typeof onsuccess == "function" && onsuccess(res.data)
      }
    })
  },
  o2ChargeDate: function (name,duration,onsuccess, onfail){
    var url = host + '/g/31/' + name + "/chargemonth/";
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
      },
      method: "post",
      data: {
        duration: duration  
      },
      success: function (res) {
        if (res.statusCode != 200) {
          typeof onfail == "function" && onfail()
        } else{
          typeof onsuccess == "function" && onsuccess (res.data)
        }
      },
      fail: function (res) {
        typeof onfail == "function" && onfail()
      }
    })
  },
  o2CancelSelfHour: function (sid, onsuccess, onfail) {
    var that = this
    var url =  host + '/st/' + sid;
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
      },
      method: "delete",
      success: function (res) {
          typeof onsuccess == "function" && onsuccess(res)
      },
      fail: function (res) {
        typeof onfail == "function" && onfail()
      }
    })
  },
  o2SubmitSelfHour: function (gym,hour, onsuccess, onfail) {
    var that = this
    var datestr = new Date().Format("yyyy-MM-dd")
    var url = host + '/g/' + gym + "/selftrain/";
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
      },
      method: "post",
      data: {
        hour:  hour,
        name:  that.globalData.userInfo.detail.name,
        date: datestr,
        gym: gym
      },
      success: function (res) {
        if (res.statusCode != 201) {
          typeof onfail == "function" && onfail()
        } else {
          typeof onsuccess == "function" && onsuccess(res.data)
        }
      },
      fail: function (res) {
        typeof onfail == "function" && onfail()
      }
    })
  },
  o2GymLoad: function (gym, onsuccess, onfail) {
    var that = this
    var datestr = new Date().Format("yyyyMMdd")
    var url = host + '/g/' + gym + "/" + datestr + "/load/";
    var data = {}
    if (that.globalData.userInfo.detail){
      data =  {
        name: that.globalData.userInfo.detail.name
      }
    }
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
      },
      data: data,
      success: function (res) {
        if (res.statusCode != 200) {
          typeof onfail == "function" && onfail()
        } else {
          typeof onsuccess == "function" && onsuccess(res.data)
        }
      },
      fail: function (res) {
        typeof onfail == "function" && onfail()
      }
    })
  },
  getOneWeek: function () {
    var today = new Date()
    var ret = []
    for (var i = 0; i < 7; i++) {
      var d = today.addDays(i)
      var tmp = {
        datestr: d.Format("yyyy-MM-dd"),
        datenum: d.Format("yyyyMMdd"),
        month: d.getMonth(),
        day: d.getDate(),
        month: d.getShortMonthName()
      }
      ret.push(tmp)
    }
    return ret
  },
  loadCustomerTips: function (customer, onsuccess) {
    var url = host + "/" + customer + "/tips/"
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        typeof onsuccess == "function" && onsuccess(res.data)
      }
    })
  },
  loadRanking: function (customer, onsuccess) {
    var that = this
    var url = host + "/" + customer + "/ranking/"
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        that.globalData.ranking = res.data
        typeof onsuccess == "function" && onsuccess(res.data)
      }
    })
  },
  loadHomework:function(homeworkid,onsuccess){
    var url = host + "/homework/" + homeworkid + "/"
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        res.data.detail = JSON.parse(res.data.detail)
        typeof onsuccess == "function" && onsuccess(res.data)
      }
    })
  },
  getVideoListUrl:function(keyword){
    var url = ""
    if (keyword == "所有") {
      url = host + '/g/31/video/page/';
    }
    else {
      url = host + '/g/31/video/keyword/' + keyword + "/";
    }
    return url
  },
  loadCourseSurvey: function (courseid, onsuccess) {
    var url = host + "/cs/" + courseid + "/survey/"
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        typeof onsuccess == "function" && onsuccess(res.data)
      }
    })
  },
  submitCourseSurvey: function (courseid,survey, onsuccess) {
    var data = []
    survey.questions.forEach(function(item){
      data.push(item)
    })
    var url = host + "/cs/" + courseid + "/survey/"
    wx.request({
      url: url,
      method: 'post',
      header: {
        'content-type': 'application/json',
      },
      data: data,
      success: function (res) {
        typeof onsuccess == "function" && onsuccess(res.data)
      }
    })
  },
  globalData: {
    userInfo: null,
    openid: null,
    userDetail: null,
    booking: null,
    gym: 31,
    gymInfo: null,
    playing: null,
    ranking: [],
  }
})