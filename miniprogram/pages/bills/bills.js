
let app = getApp();

// miniprogram/pages/bills/bills.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topTypeData:[
      {
        title:"收入",
        type:"shouru",
        isActive:true
      },
      {
        title:"支出",
        type:"zhichu",
        isActive:false
      }
    ],
    iconsData:[],
    accountData:[
      {
        title:'现金',
        isActive: true
      },
      {
        title:'支付宝',
        isActive: false
      },
      {
        title:'微信',
        isActive: false
      },
      {
        title:'信用卡',
        isActive: false
      },
      {
        title:'储蓄卡',
        isActive: false
      },

    ],
    billsInfo:{
      date: '选择日期',
      money: '',
      comment: ''
    },

    dateRange: {
      start: '',
      end: ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getIcons();
  },

  onShow:function(){
    //控制日期范围，本月01-当前
    let date = new Date();

    let year = date.getFullYear();

    let month = date.getMonth()+1;
    month = month >= 10 ? month : '0' + month;

    let day = date.getDate();
    day = day >= 10 ? day : '0' + day;

    this.data.dateRange.end = year + '-' + month + '-' + day;

    this.setData({
      dateRange:this.data.dateRange,
    })
  },

  //切换收入支出
  changeTag: function(e){
    //如果已激活，则拦截
    if(e.currentTarget.dataset.active){
      return;
    }
    
    //去除之前激活的标签
    let data = this.data[e.currentTarget.dataset.key];
    for(let i=0 ; i<data.length ; i++){
      if(data[i].isActive){
        data[i].isActive = false;
        break
      }
    }

    //激活当前标签
    data[e.currentTarget.dataset.index].isActive = true;

    //设置页面响应数据
    this.setData({
      [e.currentTarget.dataset.key]: data
    })
  },
  
  //输出icon图标
  getIcons:function(){
    //调用云函数[geticons]
    wx.cloud.callFunction({
      name:'getIcons',

      //成功执行的回调函数
      success: res => {
        
        this.setData({
          iconsData: res.result.data
        })
      },
      fail : err => {
        
      }

    })
  },

  //选择日期，输入金额，输入备注
  userBillsInfo:function(e){
    let billsInfo = this.data.billsInfo;
    billsInfo[e.currentTarget.dataset.key] = e.detail.value;
    this.setData({
      billsInfo
    })
    
  },

  //保存
  save:function(){

    //判断用户是否授权认证
    if(!app.globalData.isAuth){
      wx.showModal({
        title:'提示',
        content:'请先授权认证',
        success(res){
          if(res.confirm){
            wx.navigateTo({
              url: '../auth/auth',
            })
          }
        }
      })
      return;
    }

    let billsData = {};

    //验证用户是否选择记账类型
    for(let i=0; i<this.data.iconsData.length; i++){
      if(this.data.iconsData[i].isActive){
        billsData.billsType = {
          title:this.data.iconsData[i].name,
          type:this.data.iconsData[i].type,
          url:this.data.iconsData[i].url
        };
        break
      }
    }

    if(!billsData.billsType){
      wx.showToast({
        title: '请选择记账类型',
        icon:'none',
        duration:2000
      })
      return;
    }

    //验证日期金额是否填写
    if(this.data.billsInfo.date == '选择日期'){
      wx.showToast({
        title: '请选择日期',
        icon:'none',
        duration:2000
      })
      return;
    }

    if(this.data.billsInfo.date == ''){
      wx.showToast({
        title: '请选择金额',
        icon:'none',
        duration:2000
      })
      return;
    }

    //获取记账数据

    
    
    //收入/支出
    for(let i = 0 ; i < this.data.topTypeData.length ; i++){
      if(this.data.topTypeData[i].isActive){
        billsData.costType = {
          title: this.data.topTypeData[i].title,
          type: this.data.topTypeData[i].type,
        }
        break
      }
    }

    //账户选择
    for(let i = 0; i<this.data.accountData.length; i++){
      if(this.data.accountData[i].isActive){
        billsData.accountType = this.data.accountData[i].title;
        break;
      }
    } 

    billsData.userBills = Object.assign({},this.data.billsInfo);

    this.addBills(billsData);

  },

  //写入记账数据
  addBills:function(data){
    //加载提示
    wx.showLoading({
      title:'加载中...',
      mask:true
    })

    wx.cloud.callFunction({
      name:'addBillsByuser',
      data,
      success:res => {
        wx.hideLoading()
        
      },
      fail:err => {
        wx.hideLoading()
        
      }
    })

  }

  

})