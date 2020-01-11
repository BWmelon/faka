const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const passport = require('passport')
const app = express()

const login = require("./routes/api/login")
const goodsType = require('./routes/api/goods/type')

// DB config
const db = require("./config/keys").mongoURI

// use body-oarser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


// Connect to mongodb
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {console.log("MongoDB Connected")})
        .catch(err => {console.log(err)})

// passport初始化
app.use(passport.initialize())

require('./config/passport')(passport)

// use routes
app.use("/user/login", login)
app.use("/goods/type", goodsType)

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})