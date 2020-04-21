<template>
  <div class="navbar">
    <el-menu
      default-active="/home"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="$store.state.isCollapse"
      background-color="#222D32"
      text-color="#B8C7CE"
      style="border: 0"
      active-text-color="#fff"
      :router="true"
    >
      <el-menu-item index="/home">
        <i class="el-icon-odometer"></i>
        <span slot="title">控制面板</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>系统设置</span>
        </template>
          <el-menu-item index="/pay">支付设置</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-shopping-bag-1"></i>
          <span>商品管理</span>
        </template>
          <el-menu-item index="/goodsType">商品分类</el-menu-item>
          <el-menu-item index="/goodsList">商品管理</el-menu-item>
          <el-menu-item index="/goodsCard">卡密管理</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-shopping-cart-2"></i>
          <span>交易管理</span>
        </template>
          <el-menu-item index="/order">订单记录</el-menu-item>
          <el-menu-item index="/saleCard">售出卡密</el-menu-item>
          <el-menu-item index="/saleEarning">收益统计</el-menu-item>
          <el-menu-item index="/payRate">支付费率</el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-thumb"></i>
          <span>商家助手</span>
        </template>
          <el-menu-item index="/recordLog">结算记录</el-menu-item>
          <el-menu-item index="/accountLog">资金明细</el-menu-item>
          <el-menu-item index="/playLog">操作记录</el-menu-item>
          <el-menu-item index="/loginLog">登录日志</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  data() {
    return {
    };
  }
};
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>