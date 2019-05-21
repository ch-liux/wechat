// pages/lists/lists.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardCur: 0,
    swiperList: null,
    dataList: null,
    searchKey: '',
    nextKey: '',
    oid: 'qwer1234'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;

    wx.request({
      url: app.https.artUrl,
      method: "GET",
      dataType: "json",
      success: function(resp) {
        that.setData({
          dataList: resp.data.results,
          nextKey: resp.data.next
        })
      }
    })

    wx.request({
      url: app.https.bannerUrl,
      method: 'GET',
      dataType: 'json',
      success: function(resp) {
        that.setData({
          swiperList: resp.data
        })

        // 初始化towerSwiper 传已有的数组名即可
        that.towerSwiper('swiperList');
      }
    })
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
    this.onLoad();
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
    wx.showNavigationBarLoading();
    let that = this;

    wx.request({
      url: app.https.artUrl + '?search=' + this.data.searchKey,
      method: 'GET',
      dataType: 'json',
      success: function(resp) {
        that.setData({
          dataList: resp.data.results,
          nextKey: resp.data.next
        })
      }
    })

    wx.request({
      url: app.https.bannerUrl,
      method: 'GET',
      dataType: 'json',
      success: function(resp) {
        that.setData({
          swiperList: resp.data
        })

        // 初始化towerSwiper 传已有的数组名即可
        that.towerSwiper('swiperList');
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
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

  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },

  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },

  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },

  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  /**跳转详情 TODO*/
  toDetail: function(e) {
    let that = this;
    var id = e.currentTarget.dataset.id,
      u = wx.getStorageSync('user');
    if(u){
      that.setData({
        oid: u.openid
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
                that.setData({
                  oid: resp.data.openid
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
    
    wx.navigateTo({
      url: '/pages/detail/detail?art=' + id + "&oid=" + that.data.oid + "&oper=1"
    })
  },
  /**搜索值 */
  searchInput: function(e) {
    this.setData({
      searchKey: e.detail.value
    })
  },
  /**搜索/清空 按钮 */
  searchBtn: function(e) {
    let that = this;
    var operKey = e.target.dataset.id;
    if(operKey=="c"){
      that.setData({
        searchKey: ''
      })
    }
    wx.request({
      url: app.https.artUrl + '?search=' + this.data.searchKey,
      method: 'GET',
      dataType: 'json',
      success: function(resp) {
        that.setData({
          dataList: resp.data.results,
          nextKey: resp.data.next
        })
      }
    })
  },
  /**加载更多 */
  nextBtn: function(e){
    let that = this;
    wx.request({
      url: this.data.nextKey,
      method: 'GET',
      dataType: 'json',
      success: function(resp){
        var ds = that.data.dataList,
            res = resp.data.results;
        for(var i in res){
          ds.push(res[i])
        }
        that.setData({
          dataList: ds,
          nextKey: resp.data.next
        })
      }
    })
  }
})