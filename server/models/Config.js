const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Create Schema
const ConfigSchema = new Schema({
    configName: {
        type: String,
        required: true
    },
    configValue: {
        type: String,
        required: true
    }
})

module.exports = Config = mongoose.model("config", ConfigSchema, "config")