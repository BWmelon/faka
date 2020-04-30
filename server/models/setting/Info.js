/* 商家信息 */
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Create Schema
const InfoSchema= new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    qq: {
        type: String,
        required: true
    }
})

module.exports = Info = mongoose.model("info", InfoSchema, "info")