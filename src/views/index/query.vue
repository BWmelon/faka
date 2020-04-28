<template>
    <div>
        <el-form
            ref="form"
            :model="form"
            label-width="80px"
            :inline="true"
            @keyup.enter.native="skip"
            @submit.native.prevent
        >
            <el-form-item label="订单号">
                <el-input v-model="form.out_trade_no"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="skip">查询</el-button>
            </el-form-item>
        </el-form>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                out_trade_no: ""
            }
        };
    },
    created() {
        if (this.$route.query.out_trade_no) {
            this.$router.replace(
                `/index/query/${this.$route.query.out_trade_no}`
            );
        }
    },
    methods: {
        skip() {
            if (this.form.out_trade_no) {
                this.$router.replace(`/index/query/${this.form.out_trade_no}`);
            } else {
                this.$message({
                    type: "warning",
                    message: "请输入订单号"
                });
            }
        }
    },
    watch: {
        $route: function(to, from) {
            this.isShow = false;
            this.$router.replace(`/index/query/${this.form.out_trade_no}`);
        }
    }
};
</script>