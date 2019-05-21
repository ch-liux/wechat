// pages/detail/detail.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {
    },
    oid: 'qwer1234',
    modalName: "",
    oper: 1,
    advice: {
      phone: "",
      content: "",
      oid: "qwer1234",
      types: 1,
      art: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var artId = options.art,
      oid = options.oid,
      oper = options.oper;
    this.setData({
      oper: oper,
      oid: oid
    })
    var info = this.data.info,
      advice = this.data.advice;
    wx.request({
      url: app.https.artUrl + artId + "?oid=" + oid,
      method: 'GET',
      dataType: 'json',
      success: function (resp) {
        info = resp.data;
        advice.art = info.pk;
        if (info.img != null) {
          info.imgs = info.img.split(",");
        }

        that.setData({
          info: info,
          advice: advice
        })
      }
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**图片预览 */
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.info.imgs,
      current: e.currentTarget.dataset.url
    });
  },
  /**返回lists TODO*/
  toBack: function (e) {
    console.log(this.data.oper);
    // wx.switchTab({
    //   url: 'pages/lists/lists',
    // })
  },
  /**举报窗口弹出 */
  showModal(e) {
    var n = e.currentTarget.dataset.target;
    this.setData({
      modalName: n
    })
  },
  /**举报窗口隐藏 */
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /**举报 开始 */
  phoneInput: function (e) {
    let that = this;
    var advice = this.data.advice;
    advice.phone = e.detail.value;
    that.setData({
      advice: advice
    })
  },
  contentInput: function (e) {
    let that = this;
    var advice = this.data.advice;
    advice.content = e.detail.value;
    that.setData({
      advice: advice
    })
  },
  /**发送举报 */
  sendAdvice: function (e) {
    let that = this;
    var advice = this.data.advice;
    wx.request({
      url: app.https.artUrl + '/api/advice/',
      method: 'POST',
      dataType: 'json',
      data: advice,
      success: function (resp) {
        advice.phone = "";
        advice.content = "";
        that.setData({
          modalName: null,
          advice: advice
        })
      }
    })
  },
  /**举报 结束 */
  sendDel: function (e) {
    let that = this;
    wx.request({
      url: app.https.artUrl + this.data.info.pk + "/?oid=" + this.data.oid,
      method: 'PUT',
      dataType: 'json',
      success: function (resp) {
        if (resp.data.result == 'ok') {
          that.setData({
            modalName: null
          })
          that.toBack();
        }
      }
    })
  }
})