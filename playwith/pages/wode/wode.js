// pages/wode/wode.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    modalName: "",
    advice: {
      phone: "",
      content: "",
      oid: "qwer1234",
      types: 0,
      art: 0
    },
    fabuList: [],
    browseList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var u = wx.getStorageSync('user');
    // 获取用户id
    let that = this;
    if(u){
      var advice = that.data.advice;
      advice.oid = u.openid;
      that.setData({
        advice: advice
      })
    }else{
      wx.login({
        success: res => {
          if (res.code) {
            var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + 'wxd60c73f15c5d2df6' + '&secret=' + 'fb92c0b164aebd6b9e51259a00d62509' + '&js_code=' + res.code + '&grant_type=authorization_code';
            wx.request({
              url: l,
              data: {},
              method: 'GET',
              success: function (resp) {
                var advice = that.data.advice;
                advice.oid = resp.data.openid;
                that.setData({
                  advice: advice
                })
                var obj = {};
                obj.openid = resp.data.openid;
                wx.setStorageSync('user', obj);
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
    }
    // 获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  /**
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

  },
  /**获取用户信息 */
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**反馈 开始 */
  phoneInput: function(e) {
    let that = this;
    var advice = this.data.advice;
    advice.phone = e.detail.value;
    that.setData({
      advice: advice
    })
  },
  contentInput: function(e) {
    let that = this;
    var advice = this.data.advice;
    advice.content = e.detail.value;
    that.setData({
      advice: advice
    })
  },
  /**发送反馈 */
  sendAdvice: function(e) {
    let that = this;
    var advice = this.data.advice;
    if (advice.phone != '' && advice.content != '') {
      wx.request({
        url: app.https.adviceUrl,
        method: 'POST',
        dataType: 'json',
        data: advice,
        success: function(resp) {
          advice.phone = "";
          advice.content = "";
          that.setData({
            modalName: '',
            advice: advice
          })
        }
      })
    }
  },
  /**举报 反馈 */

  /**公共弹窗 开始*/
  showModal(e) {
    var n = e.currentTarget.dataset.target;
    let that = this;
    var uid = that.data.advice.oid;
    if (n == 'fabu') {
      wx.request({
        url: app.https.artUrl +'?oid=' + uid + "&size=15",
        method: 'GET',
        dataType: 'json',
        success: function(resp) {
          that.setData({
            fabuList: resp.data
          })
        }
      })
    } else if (n == 'browse'){
      wx.request({
        url: app.https.browseUrl + '?oid=' + uid,
        method: 'GET',
        dataType: 'json',
        success: function (resp) {
          that.setData({
            fabuList: resp.data
          })
        }
      })
    }
    this.setData({
      modalName: n
    })
  },
  hideModal(e) {
    this.setData({
      modalName: ''
    })
  },
  /**公共弹窗 结束 */

  /**加载更多 */
  nextBtn: function(e) {
    let that = this;
    wx.request({
      url: this.data.fabuList.next,
      method: 'GET',
      dataType: 'json',
      success: function(resp) {
        var ds = that.data.fabuList.results,
          res = resp.data.results,
          fabuObj = that.data.fabuList;
        for (var i in res) {
          ds.push(res[i])
        }
        fabuObj.next = resp.data.next;
        fabuObj.results = ds;
        that.setData({
          fabuList: fabuObj
        })
      }
    })
  },
  /**跳转详情 TODO*/
  toDetail: function (e) {
    let that = this;
    var id = e.currentTarget.dataset.id,
      oid = that.data.advice.oid;
    wx.navigateTo({
      url: '/pages/detail/detail?art=' + id + "&oid=" + oid + "&oper=2"
    })
  }
})