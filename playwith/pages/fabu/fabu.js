// pages/fabu/fabu.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: null,
    picker: ["游戏", "旅游", "唱歌", "其它"],
    title: null,
    desc: null,
    addr: null,
    sdate: null,
    edate: null,
    imgs: [],
    img: [],
    modalName: null,
    oid: 'qwer1234',
    tagMsg: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var u = wx.getStorageSync('user');
    let that = this;
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

  /**类别 */
  PickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
  /**标题 */
  titleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },
  /**描述 */
  textareaInput(e) {
    this.setData({
      desc: e.detail.value
    })
  },
  /**地点 */
  getLocalMsg: function (e) {
    let that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          addr: res.address
        })
      },
      fail: () => {
        wx.getSetting({
          success: function (res) {
            var statu = res.authSetting;
            if (!statu['scope.userLocation']) {
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                success: function (tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      success: function (data) {
                        if (data.authSetting["scope.userLocation"] === true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                          })
                          //授权成功之后，再调用chooseLocation选择地方
                          wx.chooseLocation({
                            success: function (res) {
                              that.setData({
                                addr: res.address
                              })
                            },
                          })
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'success',
                            duration: 1000
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          },
          fail: function (res) {
            wx.showToast({
              title: '调用授权窗口失败',
              icon: 'success',
              duration: 1000
            })
          }
        })
      }
    })
  },
  /**地点 */
  setLocalMsg: function (e) {
    this.setData({
      addr: e.detail.value
    })
  },
  /**开始时间 */
  changeStart: function (e) {
    var d = e.detail.value,
      t = "";
    if (d.length > 0) {
      t = d[0] + '-' + d[1] + '-' + d[2] + ' ' + d[3] + ':' + d[4]
    }
    this.setData({
      sdate: t
    })
  },
  /**结束时间 */
  changeEnd: function (e) {
    var d = e.detail.value,
      t = "";
    if (d.length > 0) {
      t = d[0] + '-' + d[1] + '-' + d[2] + ' ' + d[3] + ':' + d[4]
    }
    this.setData({
      edate: t
    })
  },
  /**图片上传 */
  ChooseImage() {
    wx.chooseImage({
      count: 2, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgs.length != 0) {
          this.setData({
            imgs: this.data.imgs.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgs: res.tempFilePaths
          })
        }
      }
    });
  },
  /**图片预览 */
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgs,
      current: e.currentTarget.dataset.url
    });
  },
  /**删除图片 */
  DelImg(e) {
    this.data.imgs.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgs: this.data.imgs
    })
  },
  /**发表 */
  addArt: function (e) {
    let that = this;
    var u = wx.getStorageSync('user');
    if (u) {
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
    if (!that.data.index && !that.data.title && !that.data.sdate && !that.data.edate && !that.data.desc && !that.data.addr) {
      this.setData({
        modalName: "Modal",
        tagMsg: "信息不完整！"
      })
    }
    var imgs = that.data.imgs;
    for (var i = 0; i < imgs.length; i++) {
      var uid = this.Muuid(32, 16),
        imgarr = imgs[i].split('.');
      var attr = imgarr[imgarr.length - 1];
      const imgname = app.https.oss.path + uid + "." + attr;
      wx.uploadFile({
        url: app.https.oss.url,
        filePath: imgs[i],
        name: 'file',
        formData: {
          'key': imgname,
          'OSSAccessKeyId': app.https.oss.key,
          'policy': app.https.oss.policy,
          'signature': app.https.oss.signature,
          'success_action_status': '200'
        },
        success: function (resp) {
          var temp = that.data.img;
          temp.push(app.https.oss.url + "/" + imgname);
          if (resp.statusCode == '200') {
            that.setData({
              img: temp
            })
          }
        }
      })
    }

    setTimeout(function () {
      wx.request({
        url: app.https.artUrl,
        method: 'POST',
        dataType: 'json',
        data: that.data,
        success: function (resp) {
          if (resp.data != 'ok') {
            that.setData({
              modalName: "Modal",
              tagMsg: "信息不完整！"
            })
          } else {
            that.setData({
              modalName: "Modal",
              tagMsg: "发表成功！"
            })
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/lists/lists',
                success: function (e) {
                  
                  that.setData({
                    index: null,
                    picker: ["游戏", "旅游", "唱歌", "其它"],
                    title: null,
                    desc: null,
                    addr: null,
                    sdate: null,
                    edate: null,
                    imgs: [],
                    img: [],
                    modalName: null,
                    oid: that.data.oid,
                    tagMsg: ""
                  })
                }
              })
            }, 500)
          }
        }
      })
    }, 1500)

  },
  /**隐藏提示窗 */
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /**uuid */
  Muuid: function (len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
      i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  }
})