let app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    //获取用户信息
    getUserAuthInfo:function(e){
        
        //用户已经允许授权
        if(e.detail.userInfo){
            app.globalData.isAuth = true;

            wx.navigateBack({
              delta: 1,
            })
        }

    }

    
})