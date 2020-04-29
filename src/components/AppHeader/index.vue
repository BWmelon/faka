<template>
    <div class="header">
        <i class="el-icon-menu" @click="$store.state.isCollapse = !$store.state.isCollapse"></i>
        <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
                {{username}}
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a" icon="el-icon-edit">修改密码</el-dropdown-item>
                <el-dropdown-item command="b" icon="el-icon-s-fold">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
import { logout } from "@/api/login";
export default {
    data() {
        return {
            username: JSON.parse(window.localStorage.getItem("faka-user"))
                .username
        };
    },
    methods: {
        handleCommand(command) {
            switch (command) {
                case "a":
                    this.$message("修改密码");
                    break;

                case "b":
                    localStorage.removeItem("faka-token");
                    localStorage.removeItem("faka-user");
                    this.$router.push("admin");
                    this.$message({
                        message: "账号已退出",
                        type: "success"
                    });

                    break;

                default:
                    break;
            }
        },
        toggleSidebar() {}
    }
};
</script>

<style scoped>
.el-dropdown {
    float: right;
    margin-right: 20px;
}
.el-dropdown-link {
    cursor: pointer;
    color: #fff;
    float: right;
}
.el-icon-arrow-down {
    font-size: 12px;
}
.el-icon-menu {
    margin-left: 20px;
    color: #fff;
    cursor: pointer;
}
</style>