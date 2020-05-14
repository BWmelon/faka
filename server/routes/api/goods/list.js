// goodslist
const express = require("express");
const router = express.Router();
const passport = require('passport')

const goodsType = require("../../../models/goods/Type")
const goodsList = require("../../../models/goods/List")
const goodsCard = require("../../../models/goods/Card")

const dbutils = require('../../../utils/db');

// $route GET goods/type/
// @desc 根据分类id获取商品列表 前台调用
// @access public
router.get("/type/:typeid", (req, res) => {
    goodsList.find({
        typeid: req.params.typeid,
        status: 1
    }).then(data => {
        var retData = [];

        data.forEach(element => {
            retData.push({
                id: element._id,
                status: element.status,
                typeid: element.typeid,
                listid: element.listid,
                price: element.price,
                goodsName: element.goodsName,
                sort: element.sort,
                stock: element.stock
            })
        });

        res.json({
            code: 2000,
            flag: true,
            message: '查询成功',
            data: retData
        })
    })
})

// $route GET goods/id
// @desc 根据商品分类id获取商品列表
// @access private
router.get("/:id", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    goodsList.findById(req.params.id).then(data => {
        res.json({
            code: 2000,
            flag: true,
            message: '查询成功',
            data
        })
    })
})

// $route GET goods/list
// @desc 获取所有商品列表数据接口 
// @access private
router.get("/", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    goodsList.find().then(data => {
        var retData = [];

        data.forEach(element => {
            retData.push({
                id: element._id,
                goodsName: element.goodsName,
                listid: element.listid
            })
        });

        res.json({
            code: 2000,
            flag: true,
            message: '查询成功',
            data: retData
        })
    })

})

// $route put goods/list
// @desc 修改数据接口
// @access private
router.put("/:id", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    goodsList.findById(req.params.id).then(data => {
        data.status = req.body.status;
        data.sort = req.body.sort;
        data.price = req.body.price;
        data.typeName = req.body.typeName;
        data.goodsName = req.body.goodsName;

        data.save(() => {

            goodsList.find({
                status: 1
            }).then(data => {
                // 有商品为上架状态时将商品分类设置为上架状态,没有上架状态将商品分类设置为下架状态
                goodsType.updateOne({
                    typeid: req.body.typeid
                }, {
                    $set: {
                        status: data.length ? 1 : 0
                    }
                }).then(() => {
                    res.json({
                        code: 2000,
                        flag: true,
                        message: '修改成功'
                    })
                })
            })
        });
    })

})

// $route GET goods/list
// @desc 获取商品列表数据接口 
// @access private
router.get("/:currentPage/:pageSize", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    goodsList.find().then(data => {
        var retData = [];

        data.forEach(element => {
            retData.push({
                id: element._id,
                goodsName: element.goodsName,
                status: element.status,
                typeName: element.typeName,
                sort: element.sort,
                stock: element.stock,
                sale: element.sale,
                price: element.price,
                listid: element.listid
            })
        });

        res.json({
            code: 2000,
            flag: true,
            message: '查询成功',
            data: {
                total: retData.length,
                rows: retData
            }
        })
    })
})

// $route POST goods/list
// @desc 新增商品列表接口
// @access private
router.post("/", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    goodsList.find().then(data => {
        const goodsListFields = {};
        if (req.body.typeid) goodsListFields.typeid = req.body.typeid;
        if (req.body.typeName) goodsListFields.typeName = req.body.typeName;
        if (req.body.goodsName) goodsListFields.goodsName = req.body.goodsName;
        if (req.body.price) goodsListFields.price = req.body.price;
        goodsListFields.listid = data.length + 1;
        new goodsList(goodsListFields).save().then(data => {
            res.json({
                status: 2000,
                flag: true,
                message: '新增商品成功'
            })
        })

    });

})

// $route DELETE goods/list
// @desc 删除商品列表
// @access private
router.delete("/:id", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    goodsList.findById(req.params.id).then(data => {
        const listid = data.listid;
        goodsCard.deleteMany({
            listid
        }).then(() => {
            data.remove(() => {
                res.json({
                    status: 2000,
                    flag: true,
                    message: '商品删除成功'
                })
            })
        })
    })
})

module.exports = router