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
                goodsName: element.goodsName,
                status: element.status,
                card: element.card,
                time: element.time
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
        let arr = []
        if (req.body.cards) {
            let cardsArr = req.body.cards.trim().split('\n').filter(item => {
                return item.trim() !== '';
            });
            cardsArr.forEach(item => {
                arr.push({
                    goodsName: req.body.goodsName,
                    listid: req.body.goodsListid,
                    card: item
                });
            });

        }
        goodsCard.insertMany(arr).then(data => {
            goodsCard.find({
                listid: req.body.goodsListid
            }).then(data => {
                goodsList.findOne({listid: req.body.goodsListid}).then(resp => {
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

    });

})


module.exports = router