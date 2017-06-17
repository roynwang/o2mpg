var app = getApp()
Page({
    data: {
        userInfo: {},
        priceTable: [],
        selected: 0
    },
    selectPrice: function (e) {
        var that = this
        var tar = e.currentTarget
        var i = parseInt(tar.dataset["i"])
        var tp = that.data.priceTable
        tp[that.data.selected].selected = false
        tp[i].selected = true
        that.setData({
            selected: i,
            priceTable: tp
        })
    },
    tapPay: function () {
        var that = this
        var priceid = that.data.priceTable[that.data.selected].id
        var code = false
        wx.showToast({
            title: '创建订单中',
            icon: 'loading',
            duration: 40000
        })
        wx.login({
            success: function (lgres) {
                code = lgres.code
                app.o2GetCharge(
                    that.data.userInfo.detail.name,
                    priceid,
                    app.globalData.gym,
                    code,
                    function (res) {
                        var charge = res
                        console.log(res)
                        charge.success = function (res) {
                            wx.showToast({
                                icon: 'success',
                                title: '支付成功',
                                duration: 2000
                            })
                             setTimeout(function () {
                                wx.navigateBack()
                              }, 1000)
                            console.log(res)
                        }
                        charge.fail = function (res) {
                            console.log(res)
                        }
                        wx.requestPayment(charge)
                        setTimeout(function () { wx.hideToast() }, 1000)
                    },
                    function (res) {
                        wx.hideToast()
                        wx.showToast({
                            title: '订单创建失败',
                            duration: 2000
                        })
                        console.log(res.data)
                    }
                )
            },
            fail: function () {
                wx.hideToast()
                wx.showToast({
                    title: '获取用户信息失败',
                    duration: 2000
                })
            }
        })
    },
    onLoad: function () {
        var that = this

        app.o2GetPricing(19, function (data) {
            if (data.length == 0) {
                wx.showToast({
                    title: '获取价格失败',
                    icon: 'cancel',
                    duration: 2000
                })
                setTimeout(function () {
                    wx.navigateBack()
                }, 1000)
                return
            }
            data[0].selected = true
            that.setData({
                userInfo: app.globalData.userInfo,
                priceTable: data
            })
        }, function () {
            wx.showToast({
                title: '获取价格失败',
                icon: 'cancel',
                duration: 2000
            })
            setTimeout(function () {
                wx.navigateBack()
            }, 1000)
        })
    }
})