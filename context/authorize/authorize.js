// utils/context/authorize/authorize.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
       "type":"login",
  },

  onUserInfo:function(event){
    console.log(event);

    wx.navigateBack({});
    if (this.data.call_back != undefined){
        getApp().globalData[this.data.call_back](event.detail);
    }

  },

  onOpenSetting: function (event){
      console.log(event);
      wx.navigateBack({});
      if (this.data.call_back != undefined) {
          getApp().globalData[this.data.call_back](event.detail);
      }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _type = options.type;
    var call_back = options.call_back; 
    var authorize_list = options.authorize_list;

    this.setData({
        "type": _type,
        "call_back": call_back,
    });

    if(authorize_list != undefined){
        this.setData({
            "authorize_list": JSON.parse(authorize_list),
        });
    }


    if (_type == "login"){
        wx.setNavigationBarTitle({
            title: '登录',
        })
    } else if (_type == "authorize"){
        wx.setNavigationBarTitle({
            title: '授权',
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
  
  }
})