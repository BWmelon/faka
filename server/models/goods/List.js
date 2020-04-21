/* 商品管理 */
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Create Schema
const GoodsListSchema = new Schema({
    typeid: {
        type: Number,
        required: true
    },
    listid: {
        type: Number,
        required: true
    },
    typeName: {
        type: String,
        required: true
    },
    goodsName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: Number,
        required: true,
        default: 0
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    sale: {
        type: Number,
        required: true,
        default: 0
    },
    sort: {
        type: Number,
        required: true,
        default: 1
    }
})

module.exports = GoodsList = mongoose.model("goodsList", GoodsListSchema, "goodsList")