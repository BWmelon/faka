// login
const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport')

const Login = require("../../models/Login")

// 检测是否初始化账号密码
router.get('/', (req, res) => {
    Login.find().then(data => {
        if (!data.length) {
            // 初始化账号密码admin 123456
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash('123456', salt, (err, hash) => {
                    const init = new Login();
                    init.username = 'admin';
                    init.password = hash;
                    init.save().then(() => {
                        res.json({
                            flag: true
                        })
                    })
                });
            });
        } else {
            res.json({
                flag: false
            })
        }
    })
})

// $route POST user/login
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
                    message: "管理员账号错误"
                })
            } else {
                bcrypt.compare(password, data.password)
                    .then(isMatch => {
                        if (!isMatch) {
                            res.json({
                                code: 404,
                                flag: false,
                                message: "管理员密码错误"
                            })
                        } else {
                            const rule = {
                                id: data.id,
                                name: data.name,
                                timestamp: new Date().getTime()
                            }
                            jwt.sign(rule, keys.serectOrKey, {
                                expiresIn: 3600
                            }, (err, token) => {
                                if (err) throw err;

                                res.json({
                                    "code": 2000,
                                    "flag": true,
                                    "message": "登录成功",
                                    "data": {
                                        "token": 'Bearer ' + token
                                    }
                                })
                            })
                        }
                    })
            }
        })
})

// $route PUT user/login
// @desc 返回token jwt passport
// @access private
router.put("/", (req, res) => {
    const username = req.body.username
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword

    Login.findOne()
        .then(data => {
            bcrypt.compare(oldPassword, data.password)
                .then(isMatch => {
                    if (!isMatch) {
                        res.json({
                            flag: false,
                            message: "原密码错误"
                        })
                    } else {
                        // 修改账号密码
                        data.username = username;
                        bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(newPassword, salt, (err, hash) => {
                                data.password = hash;
                                data.save(() => {
                                    res.json({
                                        flag: true,
                                        message: '账号密码修改成功'
                                    })
                                });
                            });
                        });
                        

                            
                    }
                })
        })
})

// $route GET user/login/info
// @desc return current user
// @access private
router.get("/info", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    res.json({
        flag: true,
        data: {
            username: req.user.username
        }
    })
})

module.exports = router