/* 卡密管理 */
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Create Schema
const GoodsCardSchema = new Schema({
    card: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true,
        default: 0
    },
    goodsName: {
        type: String,
        required: true
    },
    importTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    useTime: {
        type: String,
        required: true,
        default: ' '
    },
    out_trade_no: {
        type: String,
        required: true,
        default: ' '
    },
    phone: {
        type: String,
        required: true,
        default: ' '
    },
    listid: {
        type: Number,
        required: true
    }
})

module.exports = GoodsCard = mongoose.model("goodsCard", GoodsCardSchema, "goodsCard")