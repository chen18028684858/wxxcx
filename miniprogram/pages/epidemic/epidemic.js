
Page({

    /**
     * 页面的初始数据
     */
    data: {
        epiData:[
            {
                title:'现存确诊人数',
                bgColor:'#ff6a57',
                type:'currentConfirmedCount',
                num:''
            },
            {title:'累计确诊人数',bgColor:'#e83132',type:'confirmedCount',num:''},
            {title:'现存疑似人数',bgColor:'#ec9217',type:'suspectedCount',num:''},
            {title:'累计治愈人数',bgColor:'#10aeb5',type:'curedCount',num:''},
            {title:'累计死亡人数',bgColor:'#4d5054',type:'deadCount',num:''},
            {title:'现存重症人数',bgColor:'#545499',type:'seriousCount',num:''},
            {title:'新增疑似人数',bgColor:'#476da9',type:'suspectedIncr',num:''}
        ],
        epiNum:{}
    },

    onLoad:function(options){
        this.getEpdemicData()

    },

    //获取疫情数据
    getEpdemicData:function(){

        wx.showLoading({
          title: '加载中...',
          mask:true
        })

        //发起请求
        wx.request({
            method:'GET',
            url: 'https://api.tianapi.com/txapi/ncov/index',
            data:{
                key:'3cc7716ef46ee9d08b9a859bbec0a5b8'
            },
            success:res => {
                wx.hideLoading()
                

                let epiData = this.data.epiData
                
                epiData.forEach(v => {
                    // for(let key in v){
                    //     if(res.data.newslist[0].desc.key){
                    //         v.num = res.data.newslist[0].desc.key
                    //     }
                    // }
                    let desc = res.data.newslist[0].desc

                    let type = v.type;

                    v.num = desc[type]
                    
                })
                
                // 
                

                this.setData({
                    epiNum:res.data.newslist[0].desc,
                    epiData:this.data.epiData
                })

                


            },
            fail:err => {
                wx.hideLoading()
            }
        })

    }
   
})