/* 商品分类 */
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Create Schema
const GoodsTypeSchema = new Schema({
    typeName: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true,
        default: 0
    },
    sort: {
        type: Number,
        required:true,
        default: 1
    },
    typeid: {
        type: Number,
        required: true
    }
})

module.exports = GoodsType = mongoose.model("goodsType", GoodsTypeSchema, "goodsType")