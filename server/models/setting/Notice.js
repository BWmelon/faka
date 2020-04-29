/* 通知公告 */
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Create Schema
const NoticeSchema= new Schema({
    notice: {
        type: String,
        required: true
    }
})

module.exports = Notice = mongoose.model("notice", NoticeSchema, "notice")