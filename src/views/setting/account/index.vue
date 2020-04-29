<template>
    <div>
        <p>修改密码</p>
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
            <el-form-item label="管理员账号" prop="username">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="原密码" prop="oldPassword">
                <el-input v-model="form.oldPassword"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="form.newPassword"></el-input>
            </el-form-item>
            <el-form-item label="重复新密码" prop="newPassword2">
                <el-input v-model="form.newPassword2"></el-input>
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