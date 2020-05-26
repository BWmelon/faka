/* 支付设置 */
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Create Schema
const PaySchema = new Schema({
    payPlatform: {
        type: String,
    },
    url: { // 易支付-接口地址
        type: String
    },
    id: { // 易支付-id
        type: String
    },
    key: { // 易支付-密码
        type: String
    },
    appid: { // 当面付-appid
        type: String
    },
    aliPublicKey: { // 当面付-支付宝公钥 
        type: String
    },
    appPrivateKey: { // 当面付-应用私钥
        type: String
    },
    payjskey: { // payjs-通信密钥
        type: String
    },
    payjsmchid: { // payjs-商户号
        type: String
    }
})

module.exports = Pay = mongoose.model("pay", PaySchema, "pay")