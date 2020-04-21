<template>
    <div>
        <p>易支付</p>
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
            <el-form-item label="接口地址" prop="url">
                <el-input v-model="form.url"></el-input>
            </el-form-item>
            <el-form-item label="对接id" prop="id">
                <el-input v-model="form.id"></el-input>
            </el-form-item>
            <el-form-item label="对接密钥" prop="key">
                <el-input v-model="form.key"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import pay from "@/api/pay";
export default {
    data() {
        return {
            form: {
                payType: "easypay",
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
                ]
            }
        };
    },
    methods: {
        getPayInfo() {
            pay.getPayInfo().then(res => {
                const resp = res.data;
                if (resp.flag) {
                    this.form = resp.data; 
                }
            });
        },
        
        onSubmit() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    pay.updatePayType(this.form).then(data => {
                        this.$message({
                            type: 'success',
                            message: data.data.message
                        })
                    });
                }
            });
        }
    },
    created() {
        this.getPayInfo();
    }
};
</script>

<style scoped>
</style>