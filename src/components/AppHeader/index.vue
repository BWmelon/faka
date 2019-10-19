<template>
  <div class="header">
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        admin
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
import {logout} from "@/api/login";
export default {
  methods: {
    handleCommand(command) {
      switch (command) {
        case "a":
          this.$message("修改密码");
          break;

        case "b":
          const token = localStorage.getItem("faka-token")
          logout(token).then(res => {
            const resp = res.data;
            if (resp.flag) {
              this.$message({
                message: resp.message,
                type: "success"
              });
              localStorage.removeItem("faka-token")
              localStorage.removeItem("faka-user")
              this.$router.push('admin')
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
          break;

        default:
          break;
      }
    }
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
</style>