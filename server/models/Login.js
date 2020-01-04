const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Create Schema
const LoginSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = Login = mongoose.model("admin", LoginSchema, "admin")