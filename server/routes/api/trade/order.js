const express = require("express");
const router = express.Router();
const passport = require('passport')

const Easypay = require("easypay-node-sdk");

const alipayf2f = require("alipay-ftof");
const payjs = require("../../../config/payjs");

const pay = require("../../../models/setting/Pay")
const order = require("../../../models/trade/Order")

const goodsList = require('../../../models/goods/List')
const goodsCard = require('../../../models/goods/Card')
const config = require("../../../models/Config")

const dbutils = require('../../../utils/db');

// 前台查询
router.get('/query/:out_trade_no', (req, res) => {
    console.log(req.params.out_trade_no);
    order.findOne({
        out_trade_no: req.params.out_trade_no
    }).then(data => {
        if (data) {
            goodsCard.find({
                out_trade_no: req.params.out_trade_no
            }).then(cards => {
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

// 异步通知支付信息-易支付
router.get("/notify", (req, res) => {
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
                    if (resp.status == 1) {
                        res.json();
                    } else {
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
                                cardsList.forEach(item => {
                                    item.status = 1;
                                    item.out_trade_no = orderInfo.out_trade_no;
                                    item.useTime = resp.payTime;
                                    item.phone = resp.phone;
                                    item.save();
                                })

                                // 修改库存
                                goodsList.findOne({
                                    listid: resp.listid
                                }).then(data => {
                                    goodsCard.count({
                                        listid: resp.listid,
                                        status: 0
                                    }).then(stock => {
                                        data.stock = stock;
                                        data.save()
                                    })
                                })

                                res.json();
                            }).catch(err => {
                                console.log(err)
                            })
                        });
                    }
                })
            })
        }
    })
})

// 前台检测订单是否已支付，支付后提取卡密
router.get("/checkStatus/:out_trade_no", (req, res) => {
    const out_trade_no = req.params.out_trade_no;

    order.findOne({
        out_trade_no
    }).then(resp => {
        if (!resp) {
            res.json({
                flag: true,
                message: '订单号不存在'
            });
        } else {
            
        }
    })
});

// 异步通知支付信息-支付宝当面付或payjs
router.post('/notify', (req, res) => {
    order.findOne({out_trade_no: req.body.out_trade_no}).then(data => {
        switch (data.payType) {
            case 'alif2f':
                alif2fCallback(req.body).then(status => {
                    if(status) {
                        // 先进行订单是否支付判断，如未支付，提取卡密，防止多次提取
                        if (data.status == 0) {
                            // 提取卡密
                            goodsCard.find({listid: data.listid,status: 0}).limit(data.amount).then(cardsList => {
                                cardsList.forEach(item => {
                                    item.status = 1;
                                    item.out_trade_no = data.out_trade_no;
                                    item.useTime = data.payTime;
                                    item.phone = data.phone;
                                    item.save();
                                })

                                // 修改库存
                                goodsList.findOne({
                                    listid: data.listid
                                }).then(goodlistData => {
                                    goodsCard.count({
                                        listid: data.listid,
                                        status: 0
                                    }).then(stock => {
                                        goodlistData.stock = stock;
                                        goodlistData.save(() => {
                                            data.trade_no = req.body.trade_no;
                                            data.payTime = req.body.gmt_payment;
                                            data.status = 1;
                                            data.save(() => {
                                                res.status(200).send('success');
                                            });
                                        });
                                    })
                                })
                            }).catch(err => {
                                console.log(err);
                                res.status(400);
                            })
                        } else {
                            res.status(400);
                        }
                    } else {
                        res.status(400);
                    }
                });
                break;

            case 'payjs':
                payjsCallback(req.body).then(status => {
                    if(status) {
                        // 先进行订单是否支付判断，如未支付，提取卡密，防止多次提取
                        if (data.status == 0) {
                            // 提取卡密
                            goodsCard.find({listid: data.listid,status: 0}).limit(data.amount).then(cardsList => {
                                cardsList.forEach(item => {
                                    item.status = 1;
                                    item.out_trade_no = data.out_trade_no;
                                    item.useTime = data.payTime;
                                    item.phone = data.phone;
                                    item.save();
                                })

                                // 修改库存
                                goodsList.findOne({
                                    listid: data.listid
                                }).then(goodlistData => {
                                    goodsCard.count({
                                        listid: data.listid,
                                        status: 0
                                    }).then(stock => {
                                        goodlistData.stock = stock;
                                        goodlistData.save(() => {
                                            data.trade_no = req.body.trade_no;
                                            data.payTime = req.body.send_pay_date;
                                            data.status = 1;
                                            data.save(() => {
                                                res.status(200).send('success');
                                            });
                                        });
                                    })
                                })
                            }).catch(err => {
                                console.log(err);
                                res.status(400);
                            })
                        } else {
                            res.status(400);
                        }
                    } else {
                        res.status(400);
                    }
                });
                break;
        
            default:
                break;
        }
    });
});

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

// 获取支付宝当面付信息，返回当面付对象
function getAlif2fInfo() {
    return new Promise((resolve, reject) => {
        pay.findOne({
            payPlatform: 'alif2f'
        }).then(data => {
            const alipayConfig = {
                /* 以下信息可以在https://openhome.alipay.com/platform/appManage.htm查到, 不过merchantPrivateKey需要您自己生成 */

                /* 应用AppID */
                appid: data.appid,

                /* 通知URL 接受支付宝异步通知需要用到  */
                notifyUrl: 'http://127.0.0.1:5001/trade/order/notify',

                /* 公钥 和 私钥 的填写方式 */
                testPrivateKey: "-----BEGIN RSA PRIVATE KEY-----\n" +
                    "公钥或私钥内容..." +
                    "\n-----END RSA PRIVATE KEY-----",

                /* 应用RSA私钥 请勿忘记 -----BEGIN RSA PRIVATE KEY----- 与 -----END RSA PRIVATE KEY-----  */
                merchantPrivateKey: "-----BEGIN RSA PRIVATE KEY-----\n" +
                    data.appPrivateKey +
                    "\n-----END RSA PRIVATE KEY-----",
                /* 支付宝公钥 如果为注释掉会使用沙盒公钥 请勿忘记 -----BEGIN PUBLIC KEY----- 与 -----END PUBLIC KEY----- */
                alipayPublicKey: "-----BEGIN PUBLIC KEY-----\n" +
                    data.aliPublicKey +
                    "\n-----END PUBLIC KEY-----",

                /* 支付宝支付网关 如果为注释掉会使用沙盒网关 */
                gatewayUrl: "https://openapi.alipay.com/gateway.do",
            };
            resolve(alipayConfig);
        })
    });
}

// 支付宝当面付异步通知回调
function alif2fCallback(postInfo) {
    return new Promise((resolve, reject) => {
        getAlif2fInfo().then(data => {
            const alipay_f2f = new alipayf2f(data);
            /* 请勿改动支付宝回调过来的post参数, 否则会导致验签失败 */
            const signStatus = alipay_f2f.verifyCallback(postInfo);
            if (signStatus === false) {
                reject(false);
            }
    
            /* 商户订单号 */
            const noInvoice = postInfo.out_trade_no;
            /* 订单状态 */
            const invoiceStatus = postInfo.trade_status;
    
            // 支付宝回调通知有多种状态您可以点击已下链接查看支付宝全部通知状态
            // https://doc.open.alipay.com/docs/doc.htm?spm=a219a.7386797.0.0.aZMdK2&treeId=193&articleId=103296&docType=1#s1
            if (invoiceStatus === "TRADE_SUCCESS") {
                resolve(true);
            } else {
                resolve(false);
            }
    
            /* 一切都验证好后就能更新数据库里数据说用户已经付钱啦 */
            // req.database.update(noInvoice, {
            //     pay: true
            // }).then(result => res.send("success")).catch(err => res.catch(err));
        })
    });
}

// payjs异步通知回调
function payjsCallback(postInfo) {
    return new Promise((resolve, reject) => {
        if (payjs.notifyCheck(postInfo) == true) {
            //校验成功
            resolve(true);
        } else {
            //校验失败
            resolve(false);
        }
    });
    
}

module.exports = router