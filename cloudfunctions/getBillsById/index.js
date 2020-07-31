// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
    try{

        return db.collection('bills').where({
            _id:_.in(event.ids.split('-'))
        }).get();

    } catch (err){
        
    }
}