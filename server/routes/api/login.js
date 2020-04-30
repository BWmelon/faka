// login
const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport =require('passport')

const Login = require("../../models/Login")

// $route GET user/login
// @desc 返回token jwt passport
// @access private
router.post("/", (req, res) => {
    const username = req.body.username
    const password = req.body.password

    Login.findOne({
            username
        })
        .then(data => {
            if (!data) {
                res.json({
                    status: 404,
                    flag: false,
                    message: "管理员账号不正确"
                })
            } else {
                bcrypt.compare(password, data.password)
                    .then(isMatch => {
                        if (!isMatch) {
                            res.json({
                                code: 404,
                                flag: false,
                                message: "管理员密码不正确"
                            })
                        } else {
                            const rule = {id: data.id, name: data.name, timestamp:new Date().getTime()}
                            jwt.sign(rule, keys.serectOrKey,{expiresIn: 3600},(err, token)=> {
                                if(err) throw err;
                                
                                 res.json({
                                    "code": 2000,
                                    "flag": true,
                                    "message": "登录成功",
                                    "data": {
                                        "token": 'Bearer '+token
                                    }
                                })
                            })
                        }
                    })
            }

        })
})

// $route GET user/login/info
// @desc return current user
// @access private
router.get("/info", passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        flag: true,
        data: {
            username: req.user.username
        }
    })
})

module.exports = router