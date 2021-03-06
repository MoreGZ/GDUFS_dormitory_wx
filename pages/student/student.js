// pages/student/student.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    session_id: wx.getStorageSync("session_id"),
    searchContent:"",
    collegeindex:0,
    college: [],
    studentData:[],
    url:"https://gwsscx.com/dormitory/index.php/Home/Wx/",
    currentPage:0
  },
  searchBoxInput:function(e){
    this.setData({
      searchContent: e.detail.value
    })
  },
  fetchCollege:function(){
    var that = this;
    wx.showLoading({
      mask: true,
      title: '加载中',
    })
    wx.request({
      method: "post",
      url: that.data.url,
      dataType: "json",
      header: { 'content-type': "application/json" },
      data: {
        session_id: that.data.session_id,
        type: "A005",
        data: {
          page: 0,
        },
      },
      success: function (res) {
        wx.hideLoading()
        //未登录
        if (res.data.code == 5){
          wx.showModal({
            title: '未登录',
            content: '请先登陆',
            success: function (res) {
              wx.navigateTo({
                url: '/pages/login/login'
              })
            }
          })
          return;
        }

        // 请求出错
        if (res.data.code !== 1) {
          wx.showModal({
            title: '请求异常',
            content: res.data.msg
          })
          return;
        }

        var options = []
        
        res.data.msg.all.forEach(function(item){
          options.push(item.college);
        })
        options.reverse()
        // 请求成功
        that.setData({
          college: options
        })
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: '网络异常',
          content: "请稍后重试"
        })
        console.log(res.errMsg);
      }
    })
  },
  loadMore:function(){
    wx.showLoading({
      mask: true,
      title: '加载中',
    })
    var that = this;
    var college = that.data.college[that.data.collegeindex]
    wx.request({
      method: "post",
      url: that.data.url,
      dataType: "json",
      header: { 'content-type': "application/json" },
      data: {
        session_id: that.data.session_id,
        type: "A002",
        data: {
          page: that.data.currentPage,
          search_content: that.data.searchContent,
          search_college: college
        },
      },
      success: function (res) {
        wx.hideLoading()
        //未登录
        if (res.data.code == 5) {
          wx.showModal({
            title: '未登录',
            content: '请先登陆',
            success: function (res) {
              wx.navigateTo({
                url: '/pages/login/login'
              })
            }
          })
          return;
        }

        // 请求出错
        if (res.data.code !== 1) {
          wx.showModal({
            title: '请求异常',
            content: res.data.msg
          })
          return;
        }

        // 请求成功
        var students = that.data.studentData;
        var currentPage = that.data.currentPage+1;
        res.data.msg.forEach(function (item) {
          students.push(item);
        })
        that.setData({
          studentData: students,
          currentPage: currentPage
        })
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: '网络异常',
          content: "请稍后重试"
        })
        console.log(res.errMsg);
      }
    })
  },
  finishInput: function (e){
    this.setData({
      studentData: [],
      currentPage: 0
    })
    this.fetchData();
  },
  changeCollege: function (e){
    this.setData({
      studentData: [],
      currentPage: 0
    })
    this.setData({
      collegeindex: e.detail.value
    })
    this.fetchData();
  },
  fetchData:function(){
    wx.showLoading({
      mask: true,
      title: '加载中',
    })
    var that = this;
    var college = that.data.college[that.data.collegeindex]
    wx.request({
      method: "post",
      url: that.data.url,
      dataType: "json",
      header: { 'content-type': "application/json" },
      data: {
        session_id: that.data.session_id,
        type: "A002",
        data: {
          page: that.data.currentPage,
          search_content: that.data.searchContent,
          search_college: college
        },
      },
      success: function (res) {
        wx.hideLoading()
        //未登录
        if (res.data.code == 5) {
          wx.showModal({
            title: '未登录',
            content: '请先登陆',
            success: function (res) {
              wx.navigateTo({
                url: '/pages/login/login'
              })
            }
          })
          return;
        }

        // 请求出错
        if (res.data.code !== 1) {
          wx.showModal({
            title: '请求异常',
            content: res.data.msg
          })
          return;
        }

        // 请求成功
        var students = that.data.studentData;
        var currentPage = that.data.currentPage+1;
        res.data.msg.forEach(function(item){
          students.push(item);
        })
        that.setData({
          studentData:students,
          currentPage: currentPage
        })
        
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: '网络异常',
          content: "请稍后重试"
        })
        console.log(res.errMsg);
      }
    })
  },
  logout: function () {
    wx.showLoading({
      mask: true,
      title: '退出登录中',
    })
    var that = this;
    wx.request({
      method: "post",
      url: that.data.url,
      dataType: "json",
      header: { 'content-type': "application/json" },
      data: {
        type: "A014",
        session_id: that.data.session_id
      },
      success: function (res) {
        wx.hideLoading()
        try {
          wx.setStorageSync('session_id', "");
          wx.setStorageSync('id', "");
          wx.setStorageSync('name', "");
          wx.setStorageSync('identify', "");
          wx.setStorageSync('options', "");
        }catch(e){
          console.log(e);
        }
        // 页面跳转
        wx.redirectTo({
          url: '/pages/login/login'
        })
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: '网络异常',
          content: "请稍后重试"
        })
        console.log(res.errMsg);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.fetchCollege();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      session_id: wx.getStorageSync("session_id")
    })

    this.fetchCollege();
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
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})