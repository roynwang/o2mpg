//app.js
var host = 'https://o2-fit.com/api'

Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}
Date.prototype.monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];

Date.prototype.getMonthName = function() {
    return this.monthNames[this.getMonth()];
};
Date.prototype.getShortMonthName = function () {
    return this.getMonthName().substr(0, 3).toUpperCase();
};
Date.prototype.Format = function(fmt) { //author: meizz
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
  
  o2UpdateUser: function(phone, data, onsuccess,onfail){
    var that = this
      wx.request({
      url: host + '/'+ phone +'/',
      data: data,
      method: "patch",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        if(res.statusCode != 200){
          onfail()
        } else {
          that.globalData.userInfo.detail = res.data
          onsuccess()
        }
      },
      fail: function(res){
        onfail()
      }
    })
  },
  o2SendVcode: function(phone,onsuccess, onfail){
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
        if(res.statusCode != 200){
          onfail()
        } else {
          onsuccess()
        }
      },
      fail: function(res){
        onfail()
      }
    })
  },
  o2BindOpenId: function(phone,vcode,openid,onsuccess, onfail){
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
        if(res.statusCode != 200){
          onfail()
        } else {
          onsuccess()
        }
      },
      fail: function(res){
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
        
        if(res.statusCode == 404){
          onfail()
        } else {
          that.globalData.userInfo.detail = res.data
          onsuccess()
        }
      },
      fail: function(res){
        onfail()
      }
    })
  },
  o2GetOpenId: function (code, onsuccess) {
    var that = this
    if(that.globalData.openid != null ) {
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
  loadGroupCourse: function (gym, date, cb) {
    var that = this
    wx.request({
      url: host + '/g/' + gym + "/groupcourseinstance/" + date + '/', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        console.log(res.data)
        
      }
    })
  },
  onLaunch: function () {
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
              that.o2GetOpenId(lgres.code, function(){
                typeof cb == "function" && cb(that.globalData.userInfo)
              })
            }
          })
        }
      })
    }
  },
  getOneWeek : function(){
    var today = new Date()
    var ret = []
    for(var i = 0; i<7; i++){
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
  globalData: {
    userInfo: null,
    openid: null,
    userDetail: null
  }
})