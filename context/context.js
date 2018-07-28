import net from '../net/net.js';


class context {


  static LazyLogin(callback, data) {
    //校验当前session key 是否有效
    wx.checkSession({
      success: () => {
        var news_user_info = wx.getStorageSync('news_user_info');
        var user_id = wx.getStorageSync('user_id');
        var now_time = Math.round(new Date().getTime() / 1000);

        if (news_user_info == undefined ||
          news_user_info == "" ||
          news_user_info == null) {
          console.log("重新调用了登录");
          context.Login(() => {
            var news_user_info = wx.getStorageSync('news_user_info');
            getApp().globalData.news_user_info = news_user_info;
            callback();
          }, data);
        } else {
          getApp().globalData.news_user_info = news_user_info;
          callback();
        }

      },
      fail: () => {
        context.Login(() => {
          var news_user_info = wx.getStorageSync('news_user_info');
          getApp().globalData.news_user_info = news_user_info;
          callback();
        }, data);
      }
    });
  }

  static Login(callback, data) {
    wx.login({
      success: (res) => {
        var code = res.code;
        if (data != undefined) {
          console.log('login-', data.iv)
          context.thirdLogin(code, encodeURIComponent(data.encryptedData), data.iv, callback);//调用服务器api
        } else {
          getApp().globalData.context_getUserInfo_callback = (userinfo) => {
            console.log('wxgetUserInfo successd........');
            console.log(userinfo);
            var encryptedData = encodeURIComponent(userinfo.encryptedData);
            context.thirdLogin(code, encryptedData, userinfo.iv, callback);//调用服务器api
          }
        }

      }
    });
  }

  static thirdLogin(code, encryptedData, iv, callback) {
    wx.showToast({
      title: '登录中',
      icon: 'loading',
      duration: 10000
    });
    //var url = net.api().URL_LOGIN + '' + '&code=' + code + '&iv=' + encodeURIComponent(iv) + '&encryptedData=' + encryptedData;
    var url = net.api().URL_LOGIN

    //请求登录
    net.postRequst(url, {
      'type': "login",
      code: code,
      iv: encodeURIComponent(iv),
      encryptedData: encryptedData,
    }, res => {
      console.log(res)
      var result = res.data;
      wx.hideToast();
      if (result.status == 0) {
        // wx.showToast({ title: money, icon: 'none' });
        console.log(result)
        result.data.time = new Date().getTime() / 1000;
        result.data.token_refresh_ttl = result.data.token_refresh_ttl;
        wx.setStorageSync('news_user_info', result.data);
        wx.setStorageSync('user_id', result.data.user_id);
        getApp().globalData.openid = result.data.openid;
        getApp().globalData.news_user_info = result.data
      } else {
        // wx.showToast({ title: '登录失败2', image: '/image/fail.png' });
        wx.setStorageSync('news_user_info', null);
      }
      console.log(result);
      callback();
    }, res => {
      wx.hideToast();
      wx.showToast({ title: '登录失败', image: '/image/fail.png' });
      wx.setStorageSync('news_user_info', null);
      callback();
    });

  }


  static putFormIDServer(form_id, openid) {
    //请求服务器，传入form_id
    console.log("提交了formid：" + openid);
    var url = net.api().URL_PUT_FORM_ID
    wx.request({
      url: url,
      method: 'POST',
      data: {
        formId: form_id,
        appId: "wxe1f2628af4be5eba",
        openId: openid
      },
      header: {
        //'content-type': 'application/json;charset=utf-8',
        'content-type': 'application/json;charset=utf-8',
      },
      success: (res, statusCode, header) => {
        console.log('long-suc', res)
      },
      fail: (res, statusCode, header) => {
        console.log('long-fal', res)
      }
    });

  }
  // static allShare() {
  //   //请求服务器，全局开关是否打开分享
  //   console.log("context.putFormIDServer：");
  //   net.getRequst(net.api().ALL_SHARE, res => {
  //     console.log(res);
  //     if (res.data.status == 0) {
  //       // console.log(res.data.data.appid_playmore)
  //       // console.log(res.data.data.appid_playmore_path)
  //       // var MoreGame = res.data.data;
  //       // wx.setStorageSync('MoreGame', MoreGame);
  //     }
  //   })
  // }

  static putMoreGame() {
    //请求服务器，传入appid
    console.log("context.putFormIDServer：");
    net.getRequst(net.api().URL_MOREGAME, res => {
      console.log(res);
      if (res.data.status == 0) {
        console.log(res.data.data.appid_playmore)
        console.log(res.data.data.appid_playmore_path)
        var MoreGame = res.data.data;
        wx.setStorageSync('MoreGame', MoreGame);

      }
    })
  }

  static getSwitch() {
    //请求服务器，
    net.getRequst(net.api().URL_SWIICH, res => {
      var result = res.data;
      if (result.status == 0) {
        getApp().globalData._switch = result.data;
        console.log("getSwitch：", getApp().globalData._switch);
      }

    }, res => { console.log(res); });
  }


  static getCollparam(data) {
    var result = "";
    for (let i in data) {
      var key = i;
      var value = data[i];
      result = result + "&" + key + "=" + value;
    }
    return result;
  }


  static empty(variable) {
    if (typeof (variable) == 'undefined' ||
      variable == null ||
      variable == "") {
      return true;
    }
    return false;
  }

  static uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
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

      // Fill in random data. At i==19 set the high bits of clock sequence as
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


  static isPoneAvailable(str) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(str)) {
      return false;
    } else {
      return true;
    }
  }

  static getUserInfo() {
    return wx.getStorageSync('news_user_info');
  }

  static setUserInfo(news_user_info) {
    return wx.setStorageSync('news_user_info', news_user_info);
  }
  // 时间格式化处理
  static dateFtt(fmt, date) {
    var o = {
      "M+": date.getMonth() + 1,                 //月份   
      "d+": date.getDate(),                    //日   
      "h+": date.getHours(),                   //小时   
      "m+": date.getMinutes(),                 //分   
      "s+": date.getSeconds(),                 //秒   
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
      "S": date.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
}


module.exports = context