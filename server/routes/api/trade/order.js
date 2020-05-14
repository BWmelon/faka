const express = require("express");
const router = express.Router();
const passport = require('passport')
 
const Easypay = require("easypay-node-sdk");

const pay = require("../../../models/setting/Pay")
const order = require("../../../models/trade/Order")

const goodsList = require('../../../models/goods/List')
const goodsCard = require('../../../models/goods/Card')

const dbutils = require('../../../utils/db');

// 前台查询
router.get('/query/:out_trade_no', (req, res) => {
    console.log(req.params.out_trade_no);
    order.findOne({
        out_trade_no: req.params.out_trade_no
    }).then(data => {
        if (data) {
            goodsCard.find({out_trade_no:req.params.out_trade_no}).then(cards => {
                let cardsArr = []
                cards.forEach(item => {
                    cardsArr.push(item.card)
                })
                res.json({
                    status: 2000,
                    flag: true,
                    data: {
                        goodsName: data.goodsName,
                        money: data.money,
                        amount: data.amount,
                        payType: data.payType,
                        cards: cardsArr
                    }
                })
            })
            
        } else {
            res.json({
                status: 2000,
                flag: false,
                msg: '未查询到订单'
            })
        }
    })
})

// 异步通知支付信息
router.get("/notify", (req, res) => {
    console.log(1);
    
    pay.findOne({
        payType: 'easypay'
    }).then(async data => {
        if (data) {
            const easypayConfig = {
                domain: data.url,
                pid: data.id,
                key: data.key
            };
            const easypay = new Easypay(easypayConfig);

            easypay.order(req.query.out_trade_no).then(data => {
                const orderInfo = JSON.parse(data);

                // 异步通知修改订单信息
                order.findOne({
                    out_trade_no: orderInfo.out_trade_no
                }).then(resp => {
                    resp.trade_no = orderInfo.trade_no;
                    resp.payTime = orderInfo.endtime;

                    resp.status = orderInfo.status;
                    if (orderInfo.type == "3") {
                        resp.payType = 'qqpay'
                    }
                    if (orderInfo.type == "2") {
                        resp.payType = 'alipay'
                    }
                    if (orderInfo.type == "1") {
                        resp.payType = 'wxpay'
                    }
                    
                    resp.save(() => {
                        // 提取卡密
                        goodsCard.find({
                            listid: resp.listid,
                            status: 0
                        }).limit(orderInfo.amount).then(cardsList => {
                            console.log(orderInfo);
                            
                            console.log(orderInfo.phone);
                            
                            cardsList.forEach(item => {
                                item.status = 1;
                                item.out_trade_no = orderInfo.out_trade_no;
                                item.useTime = resp.payTime;
                                item.phone = resp.phone;
                                item.save();
                            })

                            // 修改库存
                            goodsList.findOne({listid: resp.listid}).then(data => {
                                goodsCard.count({listid: resp.listid, status: 0}).then(stock => {
                                    data.stock = stock;
                                    data.save()
                                })
                            })

                           res.json();
                        }).catch(err => {
                            console.log(err)
                        })

                    });
                })


            })
        }
    })
})

// $route GET trade/order
// @desc 获取订单列表
// @access private
router.get("/:currentPage/:pageSize", passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    dbutils.pageQuery(req.params.currentPage, req.params.pageSize, order, {}, {}, function (err, $data) {

        var data = $data.results,
            retData = [];
        data.forEach(element => {
            retData.push({
                id: element._id,
                out_trade_no: element.out_trade_no,
                trade_no: element.trade_no,
                orderTime: element.orderTime,
                payTime: element.payTime,
                status: element.status,
                goodsName: element.goodsName,
                amount: element.amount,
                money: element.money,
                payType: element.payType,
                phone: element.phone
            })
        });

        res.json({
            code: 2000,
            flag: true,
            message: '查询成功',
            data: {
                total: $data.total,
                rows: retData
            }
        })
    })
})

router.get("/:id", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    order.findById(req.params.id).then(data => {
        console.log(data)
        res.json({
            flag: true,
            data
        })
    })
})

module.exports = router