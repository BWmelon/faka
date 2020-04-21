<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
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
                <el-select v-model="form.goodsName" placeholder="请选择商品" @change="getInfoByListid">
                    <el-option
                        v-for="option in goodsList"
                        :key="option.listid"
                        :label="option.goodsName"
                        :value="option.goodsName"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="购买数量" prop="count">
                <el-input-number v-model="form.count" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="库存" prop="stock">
                <el-input placeholder="请选择商品" v-model="form.stock" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
                <el-input placeholder="0" v-model="form.price" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="付款方式" prop="paytype">
                <el-radio-group v-model="form.paytype">
                    <el-radio label="wxpay" v-model="form.radio">微信</el-radio>
                    <el-radio label="alipay" v-model="form.radio">支付宝</el-radio>
                    <el-radio label="qqpay" v-model="form.radio">QQ钱包</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">提交订单</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import goodsTypeApi from "@/api/goodsType";
// import goodsCardApi from "@/api/goodsCard";
import goodsListApi from "@/api/goodsList";
import payApi from "@/api/pay";
export default {
    created() {
        this.getGoodsTypeList();
    },
    data() {
        return {
            goodsTypes: [],
            goodsList: [],
            form: {
                price: 0,
                stock: 0,
                radio: 1,
                goodsName: null,
                count: 1
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
            },
        };
    },
    methods: {
        onSubmit() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.goodsList.forEach(value => {
                        if (value.goodsName == this.form.goodsName) {
                            this.form.listid = value.id;
                        }
                        this.launchPay();
                    });
                } else {
                    console.log(0);
                }
            });
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
            // goodsCardApi.getGoodsNameByGoodsTypeId().then(res => {
            //     const resp = res.data;
            //     this.goodsNames = [];
            //     if (resp.flag) {
            //         resp.data.forEach(item => {
            //             this.goodsNames.push({
            //                 goodsName: item.goodsName,
            //                 id: item.id
            //             });
            //         });
            //     }
            // });
        },
        getInfoByListid() {
            console.log(this.form.goodsName);
            console.log(this.goodsList);
            this.goodsList.forEach(item => {
                if (item.goodsName == this.form.goodsName) {
                    this.form.price = item.price;
                    this.form.stock = item.stock;
                }
            });
        },
        launchPay() {
            payApi.launchPay(this.form).then(res => {
                const resp = res.data;
                window.open(resp.payUrl, "_blank");
            });
        }
    }
};
</script>

<style scoped>
</style>