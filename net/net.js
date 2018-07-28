
class net {


  static api() {
    var GameMore = 'https://php.onefungame.cn/playmore';
    var FormId = 'https://java.onefungame.cn/mybatisplus-spring-mvc/saveTemplate';
    var Host = 'https://php.onefungame.cn/guess_song_man'
    var Hosthare = 'https://php.onefungame.cn/share_info'


    return {
      URL_LOGIN: Host + '/user.php?type=login',// 微信登录
      URL_RANK_NUM: Host + '/user.php?type=rank_num&',//排行榜1
      URL_RANK_SCORE: Host + '/user.php?type=rank_money&',//排行榜分
      URL_SUBMINT_SCORE: Host + '/user.php?type=update&',//提交分数
      URL_SUBMINT_SHARE: Host + '/user.php?type=share&',//提交分享
      URL_SUBMINT_PERSON: Host + '/user.php?type=share_person&', //分享个人
      URL_SUBMINT_RECORD: Host + '/user.php?type=record&', // 获取用户信息
      URL_MOREGAME: GameMore + '/index.php?appid=wxe1f2628af4be5eba', //更多游戏
      URL_PUT_FORM_ID: FormId,
      URL_COMPLAIN: Host + '/user.php?type=complain&',
      URL_NEWPROBLEM: Host + '/user.php?type=new_problem&',  //题目
      URLSHARE: Host + '/user.php?type=share&',
      SHARE_FRIENDHELP: Host + '/user.php?type=friend_help&',
      SHARE_FRIENDHELPS: Host + '/user.php?type=give_help&',
      SHARE_TITLE: Hosthare + '/index.php?appid=wxe1f2628af4be5eba',
      ALL_SHARE: Hosthare + '/button.php?appid=wxe1f2628af4be5eba',
      SHARES: Host + '/user.php?type=share&'
    };
  }

  static gateway(type_, url, data) {
    var networkType = '';
    wx.getNetworkType({ success: (res) => { networkType = res.networkType } })
    var SystemInfo = wx.getSystemInfoSync()
    var gatewayData = {
      'app': 'wechat_app',
      'networkType': networkType, //网络类型
      'brand': SystemInfo.brand, //手机品牌
      'model': SystemInfo.model, //手机型号
      'pixelRatio': SystemInfo.pixelRatio, //设备像素比
      'screenWidth': SystemInfo.screenWidth, //屏幕宽度	
      'screenHeight': SystemInfo.screenHeight, //屏幕高度	
      'windowWidth': SystemInfo.windowWidth, //可使用窗口宽度	
      'windowHeight': SystemInfo.windowHeight, //可使用窗口高度	
      'language': SystemInfo.language, //微信设置的语言	
      'wechat_version': SystemInfo.version, //微信版本号	
      'system': SystemInfo.system, //操作系统版本	
      'platform': SystemInfo.platform, //客户端平台	
      'fontSizeSetting': SystemInfo.fontSizeSetting, //用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px
      'SDKVersion': SystemInfo.SDKVersion, //客户端基础库版本	
    };

    if (type_ == 'get') {
      if (url.indexOf('?') == -1) {
        url = url + '?';
      }

      for (var i in gatewayData) {
        url = url + '&' + i + '=' + gatewayData[i];
      }

      return url;
    } else if (type_ == 'post') {

      return post;
    }
  }

  static getRequst(url, success, fail) {
    //url = net.gateway('get', url);
    console.log("------start---_get---- url: " + url);
    
    var user_id = getApp().globalData.news_user_info == null ? '' : getApp().globalData.news_user_info.user_id; //用户user_id
    console.log(getApp().globalData.user_id)

    url = url + '&user_id=' + user_id;
    wx.request({
      url: url,
      header: {
        'Authorization': 'Bearer ' + user_id,
        "app-id": "wxc9578ecfc57fd6ff",
        'content-type': 'application/json;charset=utf-8' 
      },
      success: (res, statusCode, header) => {
        res.url = url;

        net.Refresh_user_id(res.header);//刷新user_id
        success(res, statusCode, header);
      },
      fail: (res, statusCode, header) => {
        res.url = url;

        net.Refresh_user_id(res.header);//刷新user_id
        fail(res);
        console.log(res, statusCode, header);
      }
    });
    console.log("----end-----_get----");
  }

  static postRequst(url,data, success, fail) { //添加data参数
    //url = net.gateway('get', url);
    console.log("------start---_get---- url: " + url);

    var user_id = getApp().globalData.news_user_info == null ? '' : getApp().globalData.news_user_info.user_id; //用户user_id
    data.user_id = user_id;

    wx.request({
      url: url,
      method: 'POST',
     data: data,   //带参数情况
      header: {
        'Authorization': 'Bearer ' + user_id,
        //'content-type': 'application/json;charset=utf-8',
        'content-type': 'application/x-www-form-urlencoded',
        "app-id": "wx0498b5501c617a9b"
      },
      success: (res, statusCode, header) => {
        // console.log(res)
        res.url = url;
       res.postData = data;

        net.Refresh_user_id(res.header);//刷新user_id
        success(res, statusCode, header);
      },
      fail: (res, statusCode, header) => {
        console.log(res)
        res.url = url;

        net.Refresh_user_id(res.header);//刷新user_id
        fail(res);
        console.log(res, statusCode, header);
      }
    });
    console.log("----end-----_get----");
  }

  static Refresh_user_id(header) {
    var news_user_info = wx.getStorageSync('news_user_info');
    if (header != undefined &&
      header.authorization != undefined &&
      news_user_info != '' && news_user_info != null) {

      news_user_info.user_id = header.authorization.replace("Bearer ", "");
      wx.setStorageSync('news_user_info', news_user_info);
      getApp().globalData.news_user_info = news_user_info;
      console.log('刷新user_id');
    }
  }

}


module.exports = net;
