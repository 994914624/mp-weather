// 引入 qq sdk 核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var local = require('./city.js');
var qqmapsdk;
var _this;
var today_src_source;
var tomorrow_src_source;
var next_src_source;
var next_next_src_source;
//var audio ; 
var myAudio;
var cuid = '123321654';
// pages/mypage/mypage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
    // createInnerAudioContext 真机不能播放 
    //audio = wx.createInnerAudioContext()
    // 使用旧的 createAudioContext
    myAudio = wx.createAudioContext('myAudio',this);
    // 实例化 qq sdk 
    qqmapsdk = new QQMapWX({
      key: 'ZAVBZ-O6IKG-JB6Q7-I3OFN-HVWQV-XLBLN'
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(local.cityList.length)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        // 获取 city
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            //console.log(JSON.stringify(res));
            var city = res.result.ad_info.city;
            console.log("---------" +city);
            wx.setNavigationBarTitle({
              title: '['+city+'] 天气'
            });
            // 找到 city code
            for (var i=0;i<local.cityList.length;i++){
              if (city.search(local.cityList[i].city_name) != -1 ){
                var cityCode = local.cityList[i].city_code
                console.log("---------"+cityCode)
                // requset weather
                getWeather(cityCode);
                return;
              }
            }
          }
        });
      }
    });
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
});

/**
 * getWeather
 */
function getWeather(cityCode) {
  wx.request({
    url: 'https://free-api.heweather.com/s6/weather?key=0efbf8d05c334e8aa00803a88845596d&location=CN' + cityCode,
    success(res) {
      var weather = res.data.HeWeather6[0].daily_forecast
      console.log(weather)
      var today = "今天，" + weather[0].date + " ，" + weather[0].cond_txt_n + "，最低温度 " + weather[0].tmp_min + "°C，最高温度 " + weather[0].tmp_max + "°C，" + weather[0].wind_dir + weather[0].wind_sc + "级。  "

      var tomorrow = "明天，" + weather[1].date + " ，" + weather[1].cond_txt_n + "，最低温度 " + weather[1].tmp_min + "°C，最高温度 " + weather[1].tmp_max + "°C，" + weather[1].wind_dir + weather[1].wind_sc + "级。  "

      var next_day = "后天，" + weather[2].date + " ，" + weather[2].cond_txt_n + "，最低温度 " + weather[2].tmp_min + "°C，最高温度 " + weather[2].tmp_max + "°C，" + weather[2].wind_dir + weather[2].wind_sc + "级。"

      // check img
      today_src_source = setImg(weather[0].cond_txt_n)
      tomorrow_src_source = setImg(weather[1].cond_txt_n)
      next_src_source = setImg(weather[2].cond_txt_n)

      // setData
      _this.setData({
        today_src: today_src_source,
        tomorrow_src: tomorrow_src_source,
        next_src: next_src_source,
        today_forecast: today,
        tomorrow_forecast: tomorrow,
        next_forecast: next_day
      })
      // tts
      getTTS(today + tomorrow + next_day)
    }
  })
};

/**
 * 设置图片
 */
function setImg(day){
  if (day.search("雷阵雨") != -1) {
    return '../src/thunder_rain.png'
  }
  if (day.search("多云转雷阵雨") != -1) {
    return '../src/cloud_then_rain.png'
  }
  if (day.search("雨") != -1) {
    return '../src/rain.png'
  }
  if (day.search("小雪") != -1) {
    return '../src/snow_little.png'
  }
  if (day.search("大雪") != -1) {
    return  '../src/snow_big.png'
  }
  if (day.search("雨加雪") != -1) {
    return '../src/snow_and_rain.png'
  }
  if (day.search("多云") != -1) {
    return '../src/cloud.png'
  }
  if (day.search("晴") != -1) {
    return  '../src/sun.png'
  }
  if (day.search("阴") != -1 || day.search("霾") != -1 || day.search("雾") != -1) {
    return  '../src/overcast.png'
  }
};

/**
 * tts 语音播放
 */
function getTTS(txt) {
  console.log("tts--->: "+txt)
  _this.setData({
    src: 'https://tsn.baidu.com/text2audio?tok=24.a9403d359e62af13674a8cb962e0f9a9.2592000.1570712728.282335-17222176&cuid=123321654456&ctp=1&spd=5&vol=13&lan=zh&tex=' + txt
  });
  myAudio.play();
};