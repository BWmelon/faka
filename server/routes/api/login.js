// login
const express = require("express")
const router = express.Router()

const User = require("../../models/Login")

// $route GET user/login
// @desc 返回token jwt passport
// @access private
router.post("/", (req, res) => {
    const username = req.body.username
    const password = req.body.password
    User.findOne({username})
        .then(username => {
            if(!username) {
                return res.json({status: 404, msg: "管理员账号不正确"})
            } else {
            }

        })
})

module.exports = router