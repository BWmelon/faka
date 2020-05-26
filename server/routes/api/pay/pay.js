const express = require("express");
const router = express.Router();
const passport = require('passport')

const Easypay = require("easypay-node-sdk");
const alipayf2f = require("alipay-ftof");
const payjs = require("../../../config/payjs");

const order = require("../../../models/trade/Order")
const pay = require("../../../models/setting/Pay")
const config = require("../../../models/Config")

// 修改支付方式接口
router.put("/", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    let config = new Pay();
    pay.findOne({
        payPlatform: req.body.payPlatform
    }).then(data => {
        if (data) {
            data.payPlatform = req.body.payPlatform;
            data.url = req.body.url;
            data.id = req.body.id;
            data.key = req.body.key;
            data.appid = req.body.appid;
            data.aliPublicKey = req.body.aliPublicKey;
            data.appPrivateKey = req.body.appPrivateKey;
            data.key = req.body.key;
            data.payjskey = req.body.payjskey;
            data.payjsmchid = req.body.payjsmchid;
            data.save((err) => {
                if (!err) {
                    res.json({
                        status: 2000,
                        message: '修改成功'
                    })
                }
            });
        } else {
            config.payPlatform = req.body.payPlatform;
            config.url = req.body.url;
            config.id = req.body.id;
            config.key = req.body.key;
            config.appid = req.body.appid;
            config.aliPublicKey = req.body.aliPublicKey;
            config.appPrivateKey = req.body.appPrivateKey;
            config.payjskey = req.body.payjskey;
            config.payjsmchid = req.body.payjsmchid;
            config.save((err) => {
                if (!err) {
                    res.json({
                        status: 2000,
                        message: '添加成功'
                    });
                }
            });
        }
    })
})

// 获取支付信息
router.get("/:payPlatform", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    pay.findOne({
        payPlatform: req.params.payPlatform
    }).then(data => {

        res.json({
            flag: true,
            data: data ? data : {}
        })
    })
})

// 前台发起支付
router.post("/", (req, res) => {
    console.log('发起支付');
    
    // 生成订单
    let orderInfo = new Order();

    orderInfo.out_trade_no = req.body.out_trade_no;
    orderInfo.trade_no = '0';
    orderInfo.payTime = '0';
    orderInfo.status = 0; // 0未支付，1已支付
    orderInfo.goodsName = req.body.goodsName;
    orderInfo.money = req.body.money;
    orderInfo.amount = req.body.amount;
    orderInfo.payType = req.body.paytype;
    orderInfo.phone = req.body.phone;
    orderInfo.listid = req.body.listid;
    // 保存订单
    orderInfo.save((err) => {
        if (!err) {
            const info = {
                paytype: req.body.paytype,
                out_trade_no: req.body.out_trade_no,
                goodsName: req.body.goodsName,
                money: req.body.money,
            };
            config.findOne({configName: 'payPlatform'}).then(data => {
                const payPlatform = data.configValue;
                switch (payPlatform) {
                    case 'alif2fAndPayjs':
                        // 判断是支付宝付款还是微信付款
                        if(req.body.paytype == 'alif2f') {
                            getAlif2fUrl(info).then(payUrl => {
                                res.json({
                                    flag: true,
                                    payUrl
                                });
                            });
                        } else if(req.body.paytype == 'payjs') {
                            getPayjsUrl(info).then(payUrl => {
                                res.json({
                                    flag: true,
                                    payUrl
                                });
                            });
                        } else {
                            res.json({
                                flag: false,
                                message: '支付方式未配置'
                            });
                        }
                        break;

                    case 'easypay':
                        getEasypayUrl(info);
                        break;

                    default:
                        break;
                }
            })
        }
    });


    //     } else {
    //         res.json({
    //             status: 2000,
    //             flag: false,
    //             message: '支付方式未配置，请联系网站管理员'
    //         })
    //     }
    // })
})

// 获取易支付url
function getEasypayUrl(info) {
    pay.findOne({
        payType: 'easypay'
    }).then(data => {
        if (data) {
            const easypayConfig = {
                domain: data.url,
                pid: data.id,
                key: data.key
            };

            // 发起支付
            const easypay = new Easypay(easypayConfig);
            const payConfig = {
                type: info.paytype,
                out_trade_no: info.out_trade_no,
                notify_url: 'http://127.0.0.1:5001/trade/order/notify',
                return_url: 'http://localhost:8888/index/query',
                name: info.goodsName,
                money: info.money,
                sitename: '网站名称'
            };
            let payUrl = easypay.pay(payConfig);

            res.json({
                flag: true,
                payUrl
            });
        }
    })
}

// 获取当面付支付url
function getAlif2fUrl(info) {
    return new Promise((resolve, reject) => {
        pay.findOne({
            payPlatform: 'alif2f'
        }).then(async data => {

            const alipayConfig = {
                /* 以下信息可以在https://openhome.alipay.com/platform/appManage.htm查到, 不过merchantPrivateKey需要您自己生成 */

                /* 应用AppID */
                appid: data.appid,

                /* 通知URL 接受支付宝异步通知需要用到  */
                notifyUrl: 'http://esyeqi.natappfree.cc/trade/order/notify',

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

            const alipay_f2f = new alipayf2f(alipayConfig);
            await alipay_f2f.createQRPay({
                tradeNo: info.out_trade_no, // 必填 商户订单主键, 就是你要生成的
                subject: info.goodsName, // 必填 商品概要
                totalAmount: info.money, // 必填 多少钱
                body: `购买${info.goodsName}，金额为${info.money}`, // 可选 订单描述, 可以对交易或商品进行一个详细地描述，比如填写"购买商品2件共15.00元"
                timeExpress: 5, // 可选 支付超时, 默认为5分钟
            }).then(result => {
                resolve(result.qr_code);
            });
        })
    })
}

// 获取Payjs url
function getPayjsUrl(info) {
    return new Promise((resolve, reject) => {
        const params = {
            'mchid': 'xxx', //商户号
            'total_fee': info.money * 100, //金额。单位：分
            'out_trade_no': info.out_trade_no, //用户端自主生成的订单号
            'body': info.goodsName, //订单标题
            'attach': '自定义数据', //用户自定义数据，在notify的时候会原样返回
            'notify_url': 'http://esyeqi.natappfree.cc/trade/order/notify' //接收微信支付异步通知的回调地址。必须为可直接访问的URL，不能带参数、session验证、csrf验证。留空则不通知
        };
        payjs.native(params, data => {
            if(data.return_code == 1) {
                resolve(data.code_url);
            }
        });
    })
}

module.exports = router