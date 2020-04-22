const express = require("express");
const router = express.Router();
const passport = require('passport')

const Easypay = require("easypay-node-sdk");

const order = require("../../../models/trade/Order")
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
        if (data) {
            // 生成订单
            let orderInfo = new Order();

            let orderNo = creatOrderNo();
            orderInfo.orderNo = orderNo;
            orderInfo.payTime = '0';
            orderInfo.status = 0; // 0未支付，1已支付
            orderInfo.goodsName = req.body.goodsName;
            orderInfo.money = req.body.money;
            orderInfo.amount = req.body.amount;
            orderInfo.payType = req.body.paytype;
            orderInfo.phone = req.body.phone;
            // 保存订单
            orderInfo.save((err) => {
                if (!err) {
                    const easypayConfig = {
                        domain: data.url,
                        pid: data.id,
                        key: data.key
                    };

                    // 发起支付
                    const easypay = new Easypay(easypayConfig);
                    const payConfig = {
                        type: req.body.paytype,
                        out_trade_no: orderNo,
                        notify_url: 'http://127.0.0.1:5000/setting/order',
                        return_url: 'http://localhost:8888/query',
                        name: req.body.goodsName,
                        money: req.body.money,
                        sitename: '网站名称'
                    };
                    let payUrl = easypay.pay(payConfig);
                    
                    res.json({
                        status: 2000,
                        payUrl
                    });
                }
            });

        } else {
            res.json({
                status: 2000,
                flag: false,
                message: '支付方式未配置，请联系网站管理员'
            })
        }



    })
})

// 生成订单号
function creatOrderNo() {
    let now = new Date();
    let year = now.getFullYear(); //年
    let month = now.getMonth() + 1; //月
    let day = now.getDate(); //日
    let hh = now.getHours(); //时
    let mm = now.getMinutes(); //分
    let ss = now.getMilliseconds(); //秒
    let ms = now.getSeconds(); //秒
    let clock = year + "";
    if (month < 10)
        clock += "0";

    clock += month + "";

    if (day < 10)
        clock += "0";

    clock += day + "";

    if (hh < 10)
        clock += "0";

    clock += hh + "";
    if (mm < 10) clock += '0';
    clock += mm + "";

    if (ss < 10) clock += '0';
    clock += ss;

    if (ms < 10) clock += '0';
    clock += ms;

    clock += Math.floor(Math.random() * (9999 - 0)).toString().padStart(4, '0')

    return (clock);
}

module.exports = router