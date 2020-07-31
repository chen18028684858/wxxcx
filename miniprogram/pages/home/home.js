
//导入utils
import {utils} from '../../js/utils'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate: '',

    dateRange: {
      start: '',
      end: ''
    },

    billsData: [],
    
     //当天收入-支出统计
     currentDayBillsData: {
      shouru: 0,
      zhichu: 0
    },

    //当月收入-支出的统计
    currentMonthBillsData: {
      shouru: 0,
      zhichu: 0
    }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow: function(){
    //控制日期范围，本月01-当前
    let date = new Date();

    let year = date.getFullYear();

    let month = date.getMonth()+1;
    month = month >= 10 ? month : '0' + month;

    let day = date.getDate();
    day = day >= 10 ? day : '0' + day;

    this.data.dateRange.start = year + '-' + month + '-01';
    this.data.dateRange.end = year + '-' + month + '-' + day;

    this.setData({
      dateRange:this.data.dateRange,
      currentDate:month + '月' + day + '日'
    })

    this.getCurrentBillsData(this.data.dateRange.end);
    this.getMonthBillsData()
  },

  //选择日期
  selectDate:function(e){
    let date = e.detail.value.split('-');
    this.setData({
      currentDate:date[1] + '月' + date[2] + '日'
    })
    this.getCurrentBillsData(e.detail.value)
  },

  //查询当天记账数据
  getCurrentBillsData:function(date){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.cloud.callFunction({
      name:'getUserBills',
      data:{
        date
      },
      success:res => {
        wx.hideLoading()

        this.data.currentDayBillsData = {
          shouru:0,
          zhichu:0
        }
        res.result.data.forEach(v => {
          this.data.currentDayBillsData[v.costType.type] += Number(v.userBills.money);
        })

        for(let key in this.data.currentDayBillsData){
          this.data.currentDayBillsData[key] = utils.thousandthPlace(this.data.currentDayBillsData[key].toFixed(2));
        }

        // 
        res.result.data.forEach(v => {
          v.userBills.money = utils.thousandthPlace(Number(v.userBills.money).toFixed(2));
        })

        

        this.setData({
          billsData:res.result.data,
          currentDayBillsData:this.data.currentDayBillsData
        })
      },
      fail:err => {
        wx.hideLoading()
      }
    })

  },

  //获取本月的记账数据
  getMonthBillsData:function(){
    //查询条件
    //xxxx-xx-01 <= month <= xxxx-xx-今天
    

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.cloud.callFunction({
      name:'getMonthBills',
      data:this.data.dateRange,
      success:res => {
        wx.hideLoading()
        
        this.data.currentMonthBillsData = {
          shouru:0,
          zhichu:0,
          jieyu:[]
        }
        
        //统计当月收入/支出
        res.result.data.forEach(v => {
          this.data.currentMonthBillsData[v.costType.type] += Number(v.userBills.money);
        })

        

        this.data.currentMonthBillsData.jieyu = (this.data.currentMonthBillsData.shouru - this.data.currentMonthBillsData.zhichu).toFixed(2).split('.');

        this.data.currentMonthBillsData.jieyu[0] = utils.thousandthPlace(this.data.currentMonthBillsData.jieyu[0]);

        this.data.currentMonthBillsData.shouru = utils.thousandthPlace(this.data.currentMonthBillsData.shouru.toFixed(2));

        this.data.currentMonthBillsData.zhichu = utils.thousandthPlace(this.data.currentMonthBillsData.zhichu.toFixed(2));

        this.setData({
          currentMonthBillsData: this.data.currentMonthBillsData
        })



      },
      fail:err => {
        wx.hideLoading()
        
      }
    })


  },



})