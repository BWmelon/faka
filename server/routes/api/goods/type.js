// goodstype
const express = require("express");
const router = express.Router();
const passport = require('passport')

const goodsType = require("../../../models/goods/Type")
const goodsList = require("../../../models/goods/List")
const goodsCard = require("../../../models/goods/Card")

const dbutils = require('../../../utils/db');


// $route GET goods/type
// @desc 获取商品分类数据接口 前台调用
// @access public
router.get("/", (req, res) => {
    goodsType.find().then(data => {
        var retData = [];
        data.forEach(element => {
            retData.push({
                id: element._id,
                status: element.status,
                typeid: element.typeid,
                typeName: element.typeName,
                sort: element.sort
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

// $route POST goods/type
// @desc 新增商品分类接口
// @access private
router.post("/", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    goodsType.find().then(data => {
        const goodsTypeFields = {};
        if (req.body.typeName) goodsTypeFields.typeName = req.body.typeName;
        if (req.body.status) goodsTypeFields.status = req.body.status;
        if (req.body.sort) goodsTypeFields.sort = req.body.sort;
        goodsTypeFields.typeid = data.length + 1;
        new goodsType(goodsTypeFields).save().then(data => {
            res.json({
                status: 2000,
                flag: true,
                message: '新增分类成功'
            })
        })

    });

})

// $route GET goods/type
// @desc 获取商品分类数据接口
// @access private
router.get("/:currentPage/:pageSize", passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    dbutils.pageQuery(req.params.currentPage, req.params.pageSize, goodsType, {}, {}, function (err, $data) {

        var data = $data.results,
            retData = [];
        data.forEach(element => {
            retData.push({
                id: element._id,
                status: element.status,
                typeName: element.typeName,
                sort: element.sort
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

// $route GET goods/type/:id
// @desc 获取单条商品分类数据接口
// @access private
router.get("/:id", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    goodsType.findById(req.params.id).then(data => {
        res.json({
            code: 2000,
            flag: true,
            message: '查询成功',
            data: {
                id: data._id,
                typeName: data.typeName,
                status: data.status,
                sort: data.sort
            }
        })
    })
})

// $route PUT goods/type/:id
// @desc 修改单条商品分类数据接口
// @access private
router.put("/:id", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    goodsType.findById(req.params.id).then(data => {
        data.status = req.body.status;
        data.sort = req.body.sort;
        data.typeName = req.body.typeName
        data.save(() => {
            goodsList.find({typeid: data.typeid}).then(lists => {
                lists.forEach(item =>{
                    item.status = req.body.status;
                    item.save();
                });
                res.json({
                    code: 2000,
                    flag: true,
                    message: '修改成功'
                })
            })
            
        })
    })
})

// $route DELETE goods/type/:id
// @desc 删除单条商品分类接口
// @access private
router.delete("/:id", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    goodsType.findById(req.params.id).then(data => {
        data.remove(() => {
            goodsList.deleteMany({typeid: data.typeid}).then(() => {
                goodsCard.deleteMany({typeid: data.typeid}).then(() => {
                    res.json({
                        code: 2000,
                        flag: true,
                        message: '商品分类删除成功'
                    })
                })
            })
        })
    })
})

module.exports = router