/* 订单记录 */
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Create Schema
const orderSchema= new Schema({
    orderNo: {
        type: String,
        required: true
    },
    orderTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    payTime: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    goodsName: {
        type: String,
        required: true
    },
    money: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    payType: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
})

module.exports = Order = mongoose.model("order", orderSchema, "order")