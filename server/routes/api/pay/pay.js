const express = require("express");
const router = express.Router();
const passport = require('passport')

const Easypay = require("easypay-node-sdk");

const pay = require("../../../models/setting/Pay")

// 修改支付方式接口
router.put("/", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    let config = new Pay();
    pay.findOne({
        payType: req.body.payType
    }).then(data => {
        if (data.length) {
            data.payType = req.body.payType;
            data.url = req.body.url;
            data.id = req.body.id;
            data.key = req.body.key;
            data.save(() => {
                res.json({
                    status: 2000,
                    message: '修改成功'
                })
            });
        } else {
            config.payType = req.body.payType;
            config.url = req.body.url;
            config.id = req.body.id;
            config.key = req.body.key;
            config.save(() => {
                res.json({
                    status: 2000,
                    message: '添加成功'
                })
            });
        }

    })




})

// 获取支付信息
router.get("/", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    let config = new Pay();
    pay.findOne({
        payType: 'easypay'
    }).then(data => {
        res.json({
            flag: true,
            data
        })
    })
})

// 发起支付
router.post("/", (req, res) => {
    pay.findOne({
        payType: 'easypay'
    }).then(data => {
        console.log(data);
        const easypayConfig = {
            domain: data.url,
            pid: data.id,
            key: data.key
        };

        const easypay = new Easypay(easypayConfig);
        const payConfig = {
            type: req.body.paytype,
            out_trade_no: new Date().getTime().toString(),
            notify_url: 'http://域名/notify_url.php',
            return_url: 'http://域名/return_url.php',
            name: req.body.goodsName,
            money: req.body.price,
            sitename: '网站名称'
        };
        let payUrl = easypay.pay(payConfig);
        res.json({
            status: 2000,
            payUrl
        });
    })
})

module.exports = router