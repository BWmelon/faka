<template>
  <div>
    <el-table
      ref="goodsCardTable"
      :data="goodsCard"
      tooltip-effect="dark"
      style="width: 100%"
      height="700"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <!-- <el-table-column label="日期" width="120">
        <template slot-scope="scope">{{ scope.row.importTime }}</template>
      </el-table-column>-->
      <el-table-column prop="typeName" label="商品名称" width="120"></el-table-column>
      <el-table-column prop="card" label="卡密" show-overflow-tooltip></el-table-column>
      <el-table-column prop="importTime" label="导入时间" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页开始 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 分页结束 -->
  </div>
</template>

<script>
import goodsCardApi from "@/api/goodsCard";
export default {
  created() {
    this.fetchData();
  },
  data() {
    return {
      goodsCard: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
    fetchData() {
      // goodsCardApi.getGoodsCard().then(res => {
      goodsCardApi
        .getAllPagination(this.currentPage, this.pageSize)
        .then(res => {
          const resp = res.data;
          if (resp.flag) {
            this.goodsCard = resp.data.rows;
            this.total = resp.data.total;
          }
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelete(id) {
      this.$confirm(
        "确定要删除该卡密信息?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
          goodsCardApi.deleteById(id).then(res => {
            const resp = res.data;
            if (resp.flag) {
              this.$message({
                type: "success",
                message: resp.message
              });
              this.fetchData();
            } else {
              this.$message({
                type: "error",
                message: resp.message
              });
            }
          });      
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchDate();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchDate();
    }
  }
};
</script>

<style scoped>
</style>