<template>
    <div v-show="isShow">
        <el-input v-model="$route.params.out_trade_no" :disabled="true">
            <template slot="prepend">订单编号</template>
        </el-input>
        <el-input v-model="goodsName" :disabled="true">
            <template slot="prepend">商品名称</template>
        </el-input>
        <el-input v-model="amount" :disabled="true">
            <template slot="prepend">商品数量</template>
        </el-input>
        <el-input v-model="money" :disabled="true">
            <template slot="prepend">支付金额</template>
        </el-input>
        <el-input v-model="payType" :disabled="true">
            <template slot="prepend">支付方式</template>
        </el-input>
        <el-input v-model="cards" :disabled="true">
            <template slot="prepend">卡密信息</template>
        </el-input>
    </div>
</template>

<script>
const payTypeFilter = {
    qqpay: "QQ钱包",
    alipay: "支付宝",
    wxpay: "微信支付",
    alif2f: "支付宝"
};
import queryApi from "@/api/query";
export default {
    data() {
        return {
            isShow: false,
            goodsName: "",
            amount: "",
            money: "",
            payType: "",
            cards: ""
        };
    },
    created() {
        this.query(this.$route.params.out_trade_no);
    },
    methods: {
        query(out_trade_no) {
            queryApi.query(out_trade_no).then(data => {
                const resp = data.data;
                if (resp.flag) {
                    this.goodsName = resp.data.goodsName;
                    this.amount = resp.data.amount;
                    this.money = resp.data.money;
                    this.payType = payTypeFilter[resp.data.payType];
                    this.cards = resp.data.cards.join(" ");
                    this.isShow = true;
                } else {
                    this.isShow = false;
                    this.$message({
                        type: "warning",
                        message: resp.msg
                    });
                }
            });
        }
    },
    watch: {
        $route: function(to, from) {
            this.isShow = false;
            this.$router.replace(`/index/query/${this.$route.params.out_trade_no}`);
        }
    }
};
</script>
