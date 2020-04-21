/* 卡密管理 */
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Create Schema
const GoodsCardSchema = new Schema({
    goodsName: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true,
        default: 0
    },
    listid: {
        type: Number,
        required: true
    },
    card: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now,
        required: true
    }
})

module.exports = GoodsCard = mongoose.model("goodsCard", GoodsCardSchema, "goodsCard")