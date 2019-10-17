<template>
  <div class="header">
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        admin
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">修改密码</el-dropdown-item>
        <el-dropdown-item command="b">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  methods: {
    handleCommand(command) {
      this.$message("click on item " + command);
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