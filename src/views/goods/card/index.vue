<template>
  <div>
    <!-- 顶部按钮开始 -->
    <el-row>
      <el-col>
        <el-button
          type="success"
          icon="el-icon-plus"
          @click="handleDeleteMoreCard"
          size="small"
        >删除选中</el-button>
      </el-col>
      <el-col>
        <el-form>
          <el-form-item>
            <el-select v-model="nowGoodsNameId" placeholder="所有商品" @change="handleChangGoodName">
              <el-option label="所有商品" value="所有商品"></el-option>
              <el-option
                v-for="item in goodsName"
                :label="item.goodsName"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- 顶部按钮结束 -->
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
import goodsListApi from "@/api/goodsList";
export default {
  created() {
    this.getGoodsName();
    this.fetchData();
  },
  data() {
    return {
      goodsCard: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [],
      cardIdToDelete: [],
      goodsName: [], //所以商品名称
      nowGoodsNameId: "所有商品" //当前被选择的商品
    };
  },
  methods: {
    fetchData() {
      if (this.nowGoodsNameId == "所有商品") {
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
      } else {
        this.goodsCard = [];
        goodsCardApi
          .getPaginationByGoodsId(
            this.nowGoodsNameId,
            this.currentPage,
            this.pageSize
          )
          .then(res => {
            const resp = res.data;
            if (resp.flag) {
              this.goodsCard = resp.data.rows;
              this.total = resp.data.total;
            }
          });
      }
    },
    handleSelectionChange(val) {
      this.cardIdToDelete = [];
      this.multipleSelection = val;
      this.multipleSelection.forEach(item => {
        this.cardIdToDelete.push(item.id);
      });
    },
    handleDeleteMoreCard() {
      if (this.cardIdToDelete.length > 0) {
        this.$confirm("确定要删除该卡密信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            goodsCardApi.deleteMoreById(this.cardIdToDelete).then(res => {
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
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message({
          message: "请先选择需要删除的卡密",
          type: "error"
        });
      }
    },
    handleDelete(id) {
      this.$confirm("确定要删除该卡密信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    // 获取所有商品名称
    getGoodsName() {
      this.goodsName = [];
      goodsListApi.getGoodsList().then(res => {
        const resp = res.data;
        if (resp.flag) {
          resp.data.forEach(item => {
            this.goodsName.push({
              id: item.id,
              value: item.goodsName,
              goodsName: item.goodsName
            });
          });
        }
      });
    },
    handleChangGoodName() {
      if (this.nowGoodsNameId == "所有商品") {
        this.fetchData();
      } else {
        this.goodsCard = [];
        goodsCardApi
          .getPaginationByGoodsId(
            this.nowGoodsNameId,
            this.currentPage,
            this.pageSize
          )
          .then(res => {
            const resp = res.data;
            if (resp.flag) {
              this.goodsCard = resp.data.rows;
              this.total = resp.data.total;
            }
          });
      }
    }
  }
};
</script>

<style scoped>
</style>