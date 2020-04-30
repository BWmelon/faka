const express = require("express");
const router = express.Router();
const passport = require('passport')
const info = require('../../../models/setting/Info')

// 修改支付方式接口
router.post("/", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    info.findOne().then(data => {
        data.name = req.body.name;
        data.url = req.body.url;
        data.qq = req.body.qq;
        data.save(() =>{
            res.json({
                flag: true,
                message: '商户信息修改成功'
            })
        })
    })
})

router.get('/', (req, res) => {
    info.find().then(data =>{
        if(!data.length) {
            // 初始化数据
            data = new info();
                data.name = '大西瓜发卡网'
                data.url = 'http://www.baidu.com/';
                data.qq = '88888888';
                data.save(() => {
                    info.findOne().then(resp => {
                        res.json({
                            flag: true,
                            data:resp
                        })
                    })
                    
                })
        } else {
            info.findOne().then(resp => {
                res.json({
                    flag: true,
                    data:resp
                })
            })
        }
    })
})

module.exports = router