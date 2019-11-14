<template>
  <div>
    <!-- 表格开始 -->
    <el-table :data="cardList" height="700" border style="width: 100%">
      <el-table-column prop="orderid" label="订单编号" width="180"></el-table-column>
      <el-table-column prop="paytime" label="支付时间" width="180"></el-table-column>
      <el-table-column prop="goodstype" label="商品类型"></el-table-column>
      <el-table-column prop="goodsname" label="商品名称"></el-table-column>
      <el-table-column prop="paytype" label="支付方式" width="80"></el-table-column>
      <el-table-column prop="linktype" label="联系方式" width="80"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
      <el-table-column prop="cards" label="卡密" width="180"></el-table-column>
    </el-table>
    <!-- 表格结束 -->
    <!-- 分页开始 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 分页结束 -->
  </div>
</template>

<script>
import tradeCardApi from "@/api/tradeCard";
export default {
  created() {
    this.getPagination();
  },
  data() {
    return {
      cardList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
    getList() {
      tradeCardApi.getList().then(res => {
        const resp = res.data;
        if (resp.flag) {
          this.cardList = resp.data;
        }
      });
    },
    getPagination() {
      tradeCardApi.getPagination(this.currentPage, this.pageSize).then(res => {
        const resp = res.data;
        if (resp.flag) {
          this.cardList = resp.data.rows;
          this.total = resp.data.total;
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPagination();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPagination();
    }
  }
};
</script>

<style scoped>
</style>