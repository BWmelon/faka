<template>
    <div>
        <p class="platform">
            <span>微信开关：</span>
            <el-switch v-model="paySwitchWxpay" @change="changePaySwitch({type: 'paySwitchWxpay', status: paySwitchWxpay})"></el-switch>
        </p>
        <p class="platform">
            <span>支付宝开关：</span>
            <el-switch v-model="paySwitchAlipay" @change="changePaySwitch({type: 'paySwitchAlipay', status: paySwitchAlipay})"></el-switch>
        </p>
        <p class="platform">
            <span>QQ钱包开关：</span>
            <el-switch v-model="paySwitchQQpay" @change="changePaySwitch({type: 'paySwitchQQpay', status: paySwitchQQpay})"></el-switch>
        </p>
        <p class="platform">
            <span>当前收款方式：</span>
            <el-radio-group v-model="radio" @change="handleChangePayPlatform">
                <el-radio label="alif2f">支付宝当面付</el-radio>
                <el-radio label="easypay">易支付</el-radio>
            </el-radio-group>
        </p>
        <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane label="支付宝当面付" name="alif2f">
                <el-form
                    ref="alif2fForm"
                    :model="alif2fForm"
                    label-width="100px"
                    :rules="rules"
                    :hide-required-asterisk="true"
                >
                    <el-form-item label="Appid" prop="appid">
                        <el-input v-model="alif2fForm.appid"></el-input>
                    </el-form-item>
                    <el-form-item label="支付宝公钥" prop="aliPublicKey">
                        <el-input type="textarea" v-model="alif2fForm.aliPublicKey" rows="5"></el-input>
                    </el-form-item>
                    <el-form-item label="应用私钥" prop="appPrivateKey">
                        <el-input type="textarea" v-model="alif2fForm.appPrivateKey" rows="5"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateAlif2">修改</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="易支付" name="easypay">
                <el-alert
                    title="为了减小您被跑路的可能，请尽量不要使用易支付"
                    type="warning"
                    effect="dark"
                    class="tip-margin"
                ></el-alert>
                <el-form
                    ref="easypayForm"
                    :model="easypayForm"
                    label-width="100px"
                    :rules="rules"
                    :hide-required-asterisk="true"
                >
                    <el-form-item label="接口地址" prop="url">
                        <el-input v-model="easypayForm.url"></el-input>
                    </el-form-item>
                    <el-form-item label="对接id" prop="id">
                        <el-input v-model="easypayForm.id"></el-input>
                    </el-form-item>
                    <el-form-item label="对接密钥" prop="key">
                        <el-input v-model="easypayForm.key"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateEasypay">修改</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import pay from "@/api/pay";
import configApi from "@/api/config";
export default {
    data() {
        return {
            radio: "",
            paySwitchWxpay: false,
            paySwitchAlipay: false,
            paySwitchQQpay: false,
            value: true,
            activeName: "alif2f",
            alif2fForm: {
                payPlatform: "alif2f",
                appid: "",
                aliPublicKey: "",
                appPrivateKey: ""
            },
            easypayForm: {
                payPlatform: "easypay",
                url: "",
                id: "",
                key: ""
            },
            rules: {
                url: [
                    {
                        required: true,
                        message: "请输入api地址",
                        trigger: "blur"
                    }
                ],
                id: [
                    {
                        required: true,
                        message: "请输入对接id",
                        trigger: "blur"
                    }
                ],
                key: [
                    {
                        required: true,
                        message: "请输入对接密钥",
                        trigger: "blur"
                    }
                ],
                appid: [
                    {
                        required: true,
                        message: "请输入APPID",
                        trigger: "blur"
                    }
                ],
                aliPublicKey: [
                    {
                        required: true,
                        message: "请输入支付宝公钥",
                        trigger: "blur"
                    }
                ],
                appPrivateKey: [
                    {
                        required: true,
                        message: "请输入应用私钥",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    created() {
        this.getPaySwitch();
        configApi.getPayPlatform().then(data => {
            const resp = data.data;
            if (resp.flag) {
                this.radio = resp.payPlatform;
            }
        });
        this.getPayInfo("alif2f");
        this.getPayInfo("easypay");
    },
    methods: {
        getPayInfo(payPlatForm) {
            pay.getPayInfo(payPlatForm).then(res => {
                const resp = res.data;

                if (resp.flag) {
                    switch (payPlatForm) {
                        case "alif2f":
                            this.alif2fForm = resp.data;
                            break;

                        case "easypay":
                            this.easypayForm = resp.data;
                            break;

                        default:
                            break;
                    }
                }
            });
        },
        // 修改当前收款平台
        handleChangePayPlatform(platform) {
            configApi
                .changePayPlatform({ payPlatform: platform })
                .then(data => {
                    const resp = data.data;
                    if (resp.flag) {
                        this.$message({
                            type: "success",
                            message: resp.message
                        });
                    }
                });
        },
        updateAlif2() {
            this.$refs["alif2fForm"].validate(valid => {
                if (valid) {
                    this.alif2fForm.payPlatform = "alif2f";
                    pay.updatePayType(this.alif2fForm).then(data => {
                        this.$message({
                            type: "success",
                            message: data.data.message
                        });
                    });
                }
            });
        },
        updateEasypay() {
            this.$refs["easypayForm"].validate(valid => {
                if (valid) {
                    this.easypayForm.payPlatform = "easypay";
                    pay.updatePayType(this.easypayForm).then(data => {
                        this.$message({
                            type: "success",
                            message: data.data.message
                        });
                    });
                }
            });
        },
        // 获取支付开关状态
        getPaySwitch() {
            configApi.getPaySwitch().then(data => {
                let resp = data.data;
                if(resp.flag) {
                    resp = resp.data;
                    this.paySwitchWxpay = resp.paySwitchWxpay;
                    this.paySwitchAlipay = resp.paySwitchAlipay;
                    this.paySwitchQQpay = resp.paySwitchQQpay;
                }
            })
        },
        // 修改支付开关状态
        changePaySwitch(data) {
            configApi.changePaySwitch(data).then(data => {
                const resp = data.data;
                if(resp.flag) {
                    this.$message({
                        type: 'success',
                        message: resp.message
                    });
                }
            })
        }
    }
};
</script>

<style scoped>
.platform {
    font-size: 14px;
    color: #606266;
    margin-bottom: 20px;
    display: flex;
}

.platform span {
    margin-right: 20px;
    width: 100px;
    
}

.tip-margin {
    margin-bottom: 20px;
}
</style>
