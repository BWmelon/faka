<template>
    <div>
        <el-card class="box-card" style="width: 100%;">
            <div slot="header" class="clearfix">
                <span>
                    <i class="el-icon-shopping-cart-1"></i> 在线下单
                </span>
                <el-button
                    style="float: right; padding: 3px 0"
                    type="text"
                    @click="$router.replace('/index/query')"
                >查询订单</el-button>
            </div>
            <el-form
                ref="form"
                :model="form"
                label-width="80px"
                :rules="rules"
                :hide-required-asterisk="true"
                v-loading="loading"
                element-loading-text="提交订单中"
            >
                <el-form-item label="商品分类" prop="goodsType">
                    <el-select
                        v-model="form.goodsType"
                        placeholder="请选择商品分类"
                        @change="getGoodsListByGoodsTypeId"
                    >
                        <el-option
                            v-for="option in goodsTypes"
                            :key="option.id"
                            :label="option.goodsType"
                            :value="option.typeid"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名称" prop="goodsName">
                    <el-select
                        v-model="form.goodsName"
                        placeholder="请选择商品"
                        @change="getInfoByListid"
                    >
                        <el-option
                            v-for="option in goodsList"
                            :key="option.listid"
                            :label="option.goodsName"
                            :value="option.goodsName"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品库存" prop="stock">
                    <el-input placeholder="请选择商品" v-model="form.stock" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="商品单价" prop="price">
                    <el-input placeholder="0" v-model="form.price" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="购买数量" prop="amount">
                    <el-input-number
                        v-model="form.amount"
                        :min="1"
                        :max="form.stock <= 10 ? form.stock : 10"
                        @change="getPayMoney"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="联系方式" prop="phone">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="付款方式" prop="paytype">
                    <el-radio-group v-model="form.paytype">
                        <el-radio label="wxpay" v-model="form.radio" v-show="paySwitchWxpay">微信</el-radio>
                        <el-radio label="alipay" v-model="form.radio" v-show="paySwitchAlipay">支付宝</el-radio>
                        <el-radio label="qqpay" v-model="form.radio" v-show="paySwitchQQpay">QQ钱包</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交订单</el-button>
                </el-form-item>
            </el-form>

            <el-dialog
                title="支付"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose"
            >
                <div class="qrcode" ref="qrCodeUrl"></div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
let running;
import goodsTypeApi from "@/api/goodsType";
import goodsListApi from "@/api/goodsList";
import payApi from "@/api/pay";
import QRCode from "qrcodejs2";
import configApi from "@/api/config";
export default {
    created() {
        this.getGoodsTypeList();
        this.getPaySwitch();
    },
    mounted() {},
    data() {
        return {
            paySwitchWxpay: false,
            paySwitchAlipay: false,
            paySwitchQQpay: false,
            dialogVisible: false,
            loading: false,
            goodsTypes: [],
            goodsList: [],
            form: {
                price: 0,
                stock: 0,
                radio: 1,
                goodsName: null,
                amount: 1,
                money: 0,
                out_trade_no: ""
            },
            rules: {
                goodsType: [
                    {
                        required: true,
                        message: "请选择商品分类",
                        trigger: "change"
                    }
                ],
                goodsName: [
                    { required: true, message: "请选择商品", trigger: "change" }
                ],
                count: [
                    {
                        required: true,
                        message: "请输入购买数量",
                        trigger: "blur"
                    },
                    { type: "number", message: "购买数量必须为数字值" }
                ],
                phone: [
                    { required: true, message: "请输入手机号", trigger: "blur" }
                ],
                paytype: [
                    {
                        required: true,
                        message: "请选择支付方式",
                        trigger: "change"
                    }
                ]
            }
        };
    },
    methods: {
        // 计算商品总价
        getPayMoney() {
            this.form.money = this.form.amount * this.form.price;
        },
        // 提交订单
        onSubmit() {
            const out_trade_no = this.createOrderNo();
            this.form.out_trade_no = out_trade_no;
            this.$refs["form"].validate(valid => {
                if (valid) {
                    configApi.getPayPlatform().then(data => {
                        const resp = data.data;
                        console.log(resp);

                        if (resp.flag) {
                            if (resp.payPlatform == "alif2fAndPayjs") {
                                console.log(this.form.paytype);

                                if (this.form.paytype == "alipay") {
                                    this.form.paytype = "alif2f";
                                } else if (this.form.paytype == "wxpay") {
                                    this.form.paytype = "payjs";
                                } else {
                                }
                                console.log(this.form.paytype);
                                this.goodsList.forEach(value => {
                                    if (
                                        value.goodsName == this.form.goodsName
                                    ) {
                                        this.form.listid = value.id;
                                    }
                                });
                                console.log(this.form.money);
                                this.loading = true;
                                payApi.launchPay(this.form).then(res => {
                                    const resp = res.data;
                                    this.loading = false;
                                    console.log(resp.payUrl);
                                    this.dialogVisible = true;
                                    this.$nextTick(() => {
                                        this.createQrCode(resp.payUrl);
                                        this.checkPayStatus(out_trade_no);
                                    });
                                    // window.open(resp.payUrl, "_blank");
                                });
                            }
                        }
                    });
                }
            });
        },
        // 查询支付状态
        checkPayStatus(out_trade_no) {
            running = setTimeout(() => {
                console.log("查询中");

                payApi.checkPayStatus(out_trade_no).then(res => {
                    const resp = res.data;
                    if (resp.flag) {
                        console.log("已支付");
                        clearInterval(running);
                        this.$router.push(
                            `/index/query/${this.form.out_trade_no}`
                        );
                    } else {
                        console.log("未支付");
                        this.checkPayStatus(out_trade_no);
                    }
                });
            }, 1000);
        },
        // 获取商品分类
        getGoodsTypeList() {
            goodsTypeApi.getGoodsTypeList().then(res => {
                const resp = res.data;

                this.goodsTypes = [];
                if (resp.flag) {
                    resp.data.forEach(item => {
                        this.goodsTypes.push({
                            id: item.id,
                            goodsType: item.typeName,
                            typeid: item.typeid
                        });
                    });
                }
            });
        },
        // 根据商品分类id获取商品列表
        getGoodsListByGoodsTypeId(typeid) {
            goodsListApi.getGoodsList(typeid).then(res => {
                const resp = res.data;
                this.goodsList = [];
                if (resp.flag) {
                    resp.data.forEach(item => {
                        this.goodsList.push({
                            id: item.listid,
                            goodsName: item.goodsName,
                            stock: item.stock,
                            price: item.price
                        });
                    });
                }
            });
        },
        getInfoByListid() {
            this.goodsList.forEach(item => {
                if (item.goodsName == this.form.goodsName) {
                    this.form.price = item.price;
                    this.form.stock = item.stock;
                }
            });
            this.form.money = this.form.amount * this.form.price;
        },
        createQrCode(url) {
            this.$refs.qrCodeUrl.innerHTML = "";
            let qrcode = new QRCode(this.$refs.qrCodeUrl, {
                width: 100,
                height: 100,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            qrcode.makeCode(url);
        },
        handleClose(done) {
            this.$confirm("确认关闭订单？")
                .then(_ => {
                    clearInterval(running);
                    done();
                })
                .catch(_ => {});
        },
        // 获取支付开关状态
        getPaySwitch() {
            configApi.getPaySwitch().then(data => {
                let resp = data.data;
                if (resp.flag) {
                    resp = resp.data;
                    this.paySwitchWxpay = resp.paySwitchWxpay;
                    this.paySwitchAlipay = resp.paySwitchAlipay;
                    this.paySwitchQQpay = resp.paySwitchQQpay;
                }
            });
        },
        // 生成订单号
        createOrderNo() {
            let now = new Date();
            let year = now.getFullYear(); //年
            let month = now.getMonth() + 1; //月
            let day = now.getDate(); //日
            let hh = now.getHours(); //时
            let mm = now.getMinutes(); //分
            let ss = now.getMilliseconds(); //秒
            let ms = now.getSeconds(); //秒
            let clock = year + "";
            if (month < 10) clock += "0";

            clock += month + "";

            if (day < 10) clock += "0";

            clock += day + "";

            if (hh < 10) clock += "0";

            clock += hh + "";
            if (mm < 10) clock += "0";
            clock += mm + "";

            if (ss < 10) clock += "0";
            clock += ss;

            if (ms < 10) clock += "0";
            clock += ms;

            clock += Math.floor(Math.random() * (9999 - 0))
                .toString()
                .padStart(4, "0");

            return clock;
        }
    }
};
</script>

<style scoped>
.el-select {
    display: block;
}

.el-input-number {
    display: block;
    width: 100%;
}

.qrcode {
    display: inline-block;
    vertical-align: top;
}
.qrcode img {
    width: 132px;
    height: 132px;
    background-color: #fff;
    padding: 6px;
    box-sizing: border-box;
}
</style>
