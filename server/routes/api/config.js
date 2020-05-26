const express = require("express");
const router = express.Router();
const passport = require('passport')
const config = require('../../models/Config')

// 获取当前使用的收款平台
router.get("/platform", (req, res) => {
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
router.post("/platform", passport.authenticate('jwt', {
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

// 修改当前使用的收款平台
router.post("/switch", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    config.findOne({
        configName: req.body.type
    }).then(data => {
        data.configValue = req.body.status == true ? '1' : '0';
        data.save(() => {
            res.json({
                flag: true,
                message: '收款开关切换成功'
            })
        }) 
    })
})

// 修改当前使用的收款平台
router.get("/switch", (req, res) => {
    config.find().and([
        {$or: [{configName: 'paySwitchWxpay'},{configName: 'paySwitchAlipay'},{configName: 'paySwitchQQpay'}]},
    ]).then(data => {
        const status = {};
        data.forEach(item => {
            status[item.configName] = item.configValue == '1' ? true : false;
        });
        res.json({
            flag: true,
            data: status
        });
    })
})

module.exports = router