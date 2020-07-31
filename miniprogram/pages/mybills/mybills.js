

Page({

    /**
     * 页面的初始数据
     */
    data: {
        billsData:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getAllBillsDataByUser();
    },

    //获取用户的记账数据
    getAllBillsDataByUser:function(){

        wx.showLoading({
          title: '加载中...',
          mask:true
        })

        wx.cloud.callFunction({
            name:'getBillsByUser',
            success:res => {
                wx.hideLoading()

                //按照日期降序排序
                res.result.data.sort((a,b) => {
                    return new Date(b.userBills.date).getTime() - new Date(a.userBills.date).getTime()
                })

                this.setData({
                    billsData:res.result.data
                })

            },
            fail:err => {
                wx.hideLoading()
            }
        })

    },

    //删除记账数据
    deleteBillsData:function(e){
        wx.showLoading({
          title: '加载中...',
          mask:true
        })

        wx.cloud.callFunction({
            name:'deleteBillsById',
            data:{
                id:e.currentTarget.dataset.id
            },
            success: res => {
                wx.hideLoading()

                if(res.result.stats.removed == 1){
                    this.data.billsData.splice(e.currentTarget.dataset.index,1)
                }

                this.setData({
                    billsData:this.data.billsData
                })

            },
            fail:err => {
                wx.hideLoading()
            }
        })
    }
    
})