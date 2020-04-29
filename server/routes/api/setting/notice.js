const express = require("express");
const router = express.Router();
const passport = require('passport')
const notice = require('../../../models/setting/Notice')

// 修改支付方式接口
router.post("/", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const tempArr = req.body.map(item => {
        return {notice: item}
    })
    notice.find({}).remove(() => {
        notice.insertMany(tempArr).then(() => {
            res.json({
                flag: true,
                message: '修改通知公告成功'
            })
        })
    })
})

router.get('/', (req, res) => {
    notice.find().then(data =>{
        data = data.map(item => {
            return item.notice;
        })  
        res.json({
            flag: true,
            data
        })
    })
})

module.exports = router