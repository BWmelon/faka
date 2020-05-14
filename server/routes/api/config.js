const express = require("express");
const router = express.Router();
const passport = require('passport')
const config = require('../../models/Config')

// 获取当前使用的收款平台
router.get("/", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    config.findOne({
        configName: 'payPlatform'
    }).then(data => {
        if(data) {
            res.json({
                flag: true,
                payPlatform: data.configValue
            })
        } else {
            res.json({
                flag: true,
                payPlatform: 'alif2f'
            })
        }
    })
})

// 修改当前使用的收款平台
router.post("/", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const payPlatform = req.body.payPlatform;
    config.findOne({
        configName: 'payPlatform'
    }).then(data => {
        if (data) {
            data.configValue = payPlatform;
            data.save(() => {
                res.json({
                    flag: true,
                    message: '修改收款方式成功'
                })
            })
        } else {
            const platform = new config({
                configName: 'payPlatform',
                configValue: payPlatform
            });

            platform.save(() => {
                res.json({
                    flag: true,
                    message: '修改收款方式成功'
                })
            })
        }
    })
})

module.exports = router