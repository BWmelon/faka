const express = require("express");
const router = express.Router();
const passport = require('passport')

const goodsCard = require("../../../models/goods/Card")

const goodsList = require("../../../models/goods/List")

const dbutils = require('../../../utils/db');
// $route GET goods/card
// @desc 获取所有未出售卡密
// @access private
router.get("/:currentPage/:pageSize", passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    dbutils.pageQuery(req.params.currentPage, req.params.pageSize, goodsCard, {}, {}, function (err, $data) {

        var data = $data.results,
            retData = [];
        data.forEach(element => {
            retData.push({
                id: element._id,
                card: element.card,
                status: element.status,
                goodsName: element.goodsName,
                importTime: element.importTime,
                useTime: element.useTime,
                out_trade_no: element.out_trade_no,
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

// $route POST goods/card
// @desc 新增卡密
// @access private
router.post("/", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    goodsCard.find().then(data => {
        let arr = [];
        // 获取typeid
        goodsList.findOne({listid: req.body.listid}).then(data => {
            
            if (req.body.cards) {
                let cardsArr = req.body.cards.trim().split('\n').filter(item => {
                    return item.trim() !== '';
                });
                cardsArr.forEach(item => {
                    arr.push({
                        goodsName: req.body.goodsName,
                        typeid: data.typeid,
                        listid: req.body.listid,
                        card: item
                    });
                });
            }
            goodsCard.insertMany(arr).then(data => {
                goodsCard.find({
                    listid: req.body.listid
                }).then(data => {
                    // 修改库存值
                    goodsList.findOne({
                        listid: req.body.listid
                    }).then(resp => {
                        resp.stock = data.length
                        resp.save(() => {
                            res.json({
                                status: 2000,
                                flag: true,
                                message: `新增卡密成功，数量为${arr.length}条`
                            })
                        });
                    })
                })
    
            })
        })
        
    });
})

// $route Delete goods/card
// @desc 删除单个卡密
// @access private
router.delete("/:id", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    goodsCard.findById(req.params.id).then(data => {
        let listid = data.listid;
        data.remove().then(() => {
            goodsCard.count({
                listid
            }).then(count => {
                goodsList.findOne({
                    listid
                }).then(data => {
                    data.stock = count;
                    data.save(() => {
                        res.json({
                            flag: true,
                            message: '删除卡密成功'
                        })
                    })
                })
            })
        })
    })
})

// $route Post goods/card/delete
// @desc 删除多个卡密
// @access private
router.post("/delete", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    goodsCard.findById(req.body[0]).then(data => {
        const listid = data.listid;
        goodsCard.deleteMany({_id: {$in: req.body}}).then(() => {
            goodsCard.count({
                listid
            }).then(count => {
                goodsList.findOne({
                    listid
                }).then(data => {
                    data.stock = count;
                    data.save(() => {
                        res.json({
                            flag: true,
                            message: '删除卡密成功'
                        })
                    })
                })
            })
        })
    })
    
    
})


module.exports = router