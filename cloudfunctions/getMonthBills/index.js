// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

//获取查询指令引用
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    try{
        
        return await db.collection('bills').where({
            userInfo:event.userInfo,
            userBills:{
                date: _.gte(event.start).and(_.lte(event.end))
            }
        }).get()
    } catch(err){
        
    }
}