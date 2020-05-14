const alipayf2f = require("./lib/alipay_f2f");




// 获取支付信息
router.get("/", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    let config = new Pay();
    pay.findOne({
        payType: 'easypay'
    }).then(data => {
        res.json({
            flag: true,
            data
        })
    })
})