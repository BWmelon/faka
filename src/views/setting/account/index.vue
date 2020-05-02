<template>
    <div>
        <p>修改密码</p>
        <el-form
            ref="form"
            :model="form"
            label-width="100px"
            :rules="rules"
            :hide-required-asterisk="true"
        >
            <el-form-item label="原密码" prop="oldPassword">
                <el-input v-model="form.oldPassword"></el-input>
            </el-form-item>
            <el-form-item label="新账号" prop="username">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="form.newPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="checkPassword">
                <el-input type="password" v-model="form.checkPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { changeAccount } from "@/api/login";
export default {
    data() {
        var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.form.newPassword) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            form: {
                username: "",
                oldPassword: "",
                newPassword: "",
                checkPassword: ""
            },
            rules: {
                username: [
                    {
                        required: true,
                        message: "请输入管理员账号",
                        trigger: "blur"
                    }
                ],
                oldPassword: [
                    {
                        required: true,
                        message: "请输入原密码",
                        trigger: "blur"
                    }
                ],
                newPassword: [
                    {
                        required: true,
                        message: "请输入新密码",
                        trigger: "blur"
                    }
                ],
                checkPassword: [{ validator: validatePass2, trigger: "blur" }]
            }
        };
    },
    methods: {
        onSubmit() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    changeAccount(this.form).then(data => {
                        const resp = data.data;
                        this.$message({
                            type: resp.flag ? "success" : "error",
                            message: resp.message
                        });
                    });
                }
            });
        }
    }
};
</script>

<style scoped></style>
