//app.js
// var host = 'http://localhost:8000/api'
var host = 'https://o2-fit.com/api'
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
  o2BookedPtCourse: function (day,phone, onsuccess, onfail) {
    var that = this
    if(that.globalData.bookedPtCourse == null){
      that.globalData.bookedPtCourse = []
    }
    var date = new Date()
    if(day != ''){
      date = day
    }
    var start = date.addDays(-30)
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
              "title": "1 V 1 普通训练",
              "hide_cancel": true,
              "completed": item.done,
              "price":item.price,
              "discount":item.discount
  
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
              "title": item.course_detail.course_detail.serial + " " + item.course_detail.course_detail.title + "／" + item.course_detail.course_detail.step,
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
      url: host + '/' + phone + '/',
      data: data,
      method: "patch",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        if (res.statusCode != 200) {
          onfail()
        } else {
          that.globalData.userInfo.detail = res.data
          onsuccess()
        }
      },
      fail: function (res) {
        onfail()
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
  globalData: {
    userInfo: null,
    openid: null,
    userDetail: null,
    booking: null,
    gym: 31,
    gymInfo: null,
    playing: null
  }
})