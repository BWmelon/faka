const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const passport = require('passport')
const app = express()
const path = require('path')

app.use("/", express.static(path.join(__dirname, 'public')));

const login = require("./routes/api/login")
const config = require("./routes/api/config")


const goodsType = require('./routes/api/goods/type')
const goodsList = require('./routes/api/goods/list')
const goodsCard = require('./routes/api/goods/card')

const order = require('./routes/api/trade/order')

const pay = require('./routes/api/pay/pay')


const notice = require('./routes/api/setting/notice')
const info = require('./routes/api/setting/info')
// const f2fpay = require('./routes/api/pay/f2fpay')

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
app.use("/user/config", config)

app.use("/goods/type", goodsType)
app.use("/goods/list", goodsList)
app.use("/goods/card", goodsCard)

app.use("/setting/notice", notice)
app.use("/setting/info", info)

app.use("/trade/order", order)



app.use("/pay", pay)
// app.use("/f2fpay", f2fpay)

const port = process.env.PORT || 5001
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})