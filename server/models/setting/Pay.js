/* 卡密管理 */
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Create Schema
const PaySchema= new Schema({
    payType: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    }
})

module.exports = Pay= mongoose.model("pay", PaySchema, "pay")