// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//获取数据库引用
const db = cloud.database()

//获取查询指令引用
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
    try{

        let date = '';

        if(event.end){
            date = _.gte(event.start).and(_.lte(event.end))
        } else {
            date = event.start
        }

        //构造日期查询条件
        let condition = {
            userBills:{
                date
            },
            userInfo:event.userInfo
        };

        return await db.collection('bills').where(condition).get();

    } catch (err){
        
    }
}