const express = require("express");
const router = express.Router();
const passport = require('passport')

const Easypay = require("easypay-node-sdk");

const pay = require("../../../models/setting/Pay")
const order = require("../../../models/trade/Order")

// 获取支付信息
router.get("/", (req, res) => {
    
    pay.findOne({
        payType: 'easypay'
    }).then(data => {
        if (data) {
            const easypayConfig = {
                domain: data.url,
                pid: data.id,
                key: data.key
            };
            const easypay = new Easypay(easypayConfig);
            // const orderInfo = easypay.order(req.query.out_trade_no);
            console.log(easypay.order(req.query.out_trade_no));
            res.json()
            // console.log(typeof JSON.parse(orderInfo));
            
            // setTimeout(() => {
            //     console.log(orderInfo.out_trade_no);
            // }, 5000)
            
            // order.findOne({OrderNo: orderInfo.out_trade_no}).then(resp => {
            //      resp.payTime = orderInfo.endtime;
            //      resp.status = orderInfo.status;
            //      if(orderInfo.type=="3") {
            //         resp.payTypt= 'qqpay'
            //      }
            //      if(orderInfo.type=="2") {
            //         resp.payTypt= 'alipay'
            //      }
            //      if(orderInfo.type=="1") {
            //         resp.payTypt= 'wxpay'
            //      }
            //      resp.save();
            // })
        }
    })
})

module.exports = router