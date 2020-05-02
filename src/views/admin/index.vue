<template>
    <div class="login-container">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules" class="login-form">
            <h2 class="login-title">后台管理</h2>
            <el-form-item label="账号" prop="username">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input
                    v-model="form.password"
                    type="password"
                    @keyup.enter.native="submitForm('form')"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { isinitialized, login, getUserInfo } from "@/api/login";
export default {
    data() {
        return {
            form: {},
            rules: {
                username: [
                    { required: true, message: "账号不能为空", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "密码不能为空", trigger: "blur" }
                ]
            }
        };
    },
    created() {
        isinitialized().then(data => {
            const resp = data.data;
            if (resp.flag) {
                this.$notify({
                    title: "初始化成功",
                    message: "初始化成功，管理员账号为admin，管理员密码为123456，请登录后及时修改账号密码",
					type: "success",
					duration: 0
                });
            }
        });
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    // 提交表单给后台进行验证是否正确
                    login(this.form.username, this.form.password).then(res => {
                        const resp = res.data;

                        if (resp.flag) {
                            // 验证成功
                            getUserInfo(resp.data.token).then(res => {
                                const respUser = res.data;
                                if (respUser.flag) {
                                    this.$message({
                                        message: resp.message,
                                        type: "success"
                                    });
                                    // 获取到用户信息
                                    // 1. 保存token ,用户信息
                                    localStorage.setItem(
                                        "faka-user",
                                        JSON.stringify(respUser.data)
                                    );
                                    localStorage.setItem(
                                        "faka-token",
                                        resp.data.token
                                    );
                                    // 2. 前往首页
                                    this.$router.push("/home");
                                } else {
                                    this.$message({
                                        message: respUser.message,
                                        type: "warning"
                                    });
                                }
                            });
                        } else {
                            this.$message({
                                message: resp.message,
                                type: "warning"
                            });
                        }
                    });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        }
    }
};
</script>

<style scoped>
.login-title {
    color: #303133;
    text-align: center;
    margin-bottom: 20px;
}
.login-container {
    position: absolute;
    width: 100%;
    height: 100%;
    background: url("../../assets/login.png") center;
}
.login-form {
    width: 350px;
    margin: 160px auto;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 30px;
    border-radius: 20px;
}
</style
>-
