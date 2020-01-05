// goodstype
const express = require("express");
const router = express.Router();
const passport =require('passport')

const goodsType = require("../../../models/goods/Type")

// $route POST goods/type
// @desc 新增商品分类接口
// @access private
router.post("/", passport.authenticate('jwt', {session: false}),(req, res) => {
    const goodsTypeFields = {};
    if(req.body.typeName) goodsTypeFields.typeName = req.body.typeName;
    if(req.body.status) goodsTypeFields.status = req.body.status;
    if(req.body.sort) goodsTypeFields.sort = req.body.sort;
    new goodsType(goodsTypeFields).save().then(data => {
        res.json({
            status: 2000,
            flag: true,
            message: '新增分类成功'
        })
    })
})

// $route GET goods/type
// @desc 获取商品分类数据接口
// @access private
router.get("/:currentPage/:pageSize", passport.authenticate('jwt', {session: false}),(req, res) => {
    goodsType.find().then(data => {
        var retData = [];
        data.forEach(element => {
            retData.push({
                id: element._id,
                status:element.status,
                typeName: element.typeName,
                sort: element.sort
            })
        });
        res.json({
            code: 2000,
            flag: true,
            message: '查询成功',
            data: {
                total: data.length,
                rows: retData
            }
        })
    })
})

// $route GET goods/type/:id
// @desc 获取单条商品分类数据接口
// @access private
router.get("/:id", passport.authenticate('jwt', {session: false}),(req, res) => {
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
// @desc 获取单条商品分类数据接口
// @access private
router.put("/:id", passport.authenticate('jwt', {session: false}),(req, res) => {
    goodsType.findById(req.params.id).then(data => {
        data.sort = req.body.sort;
        data.typeName = req.body.typeName
        data.save(() => {
            res.json({
                code: 2000,
                flag: true,
                message: '修改成功'
            })
        })
    })
})

// $route DELETE goods/type/:id
// @desc 删除单条商品分类接口
// @access private
router.delete("/:id", passport.authenticate('jwt', {session: false}),(req, res) => {
    goodsType.findById(req.params.id).then(data => {
        data.remove(() => {
            res.json({
                code: 2000,
                flag: true,
                message: '删除成功'
            })
        })
    })
})

// $route GET user/login/current
// @desc return current user
// @access private
// router.get("/info", passport.authenticate('jwt', {session: false}), (req, res) => {
//     res.json({
//         id: req.user.id,
//         username: req.user.username
//     })
// })

module.exports = router