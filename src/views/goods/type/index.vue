<template>
  <div>
    <el-table :data="goodsTypeList" height="700" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="typeName" label="分类名称" width="300"></el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="150"
        :filters="[{ text: '上架中', value: 1 }, { text: '已下架', value: 0 }]"
        :filter-method="filterStatus"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 0 ? 'primary' : 'success'"
            disable-transitions
          >{{scope.row.status | statusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total=total
    ></el-pagination>
  </div>
</template>

<script>
import goodsTypeApi from "@/api/goodsType";
import { log } from 'util';
// 商品分类上架状态
const statusOptions = [
  { type: 0, name: "已下架" },
  { type: 1, name: "上架中" }
];
export default {
  created() {
    this.fetchData();
  },
  data() {
    return {
      goodsTypeList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10
    };
  },
  methods: {
    handleSizeChange(size){
        this.pageSize = size
        this.fetchData()
    },
    handleCurrentChange(current) {
      this.currentPage = current
      this.fetchData()
    },
    fetchData() {
      // goodsTypeApi.getGoodsTypeList().then(res => {
      goodsTypeApi.getPagination(this.currentPage, this.pageSize).then(res => {
        const resp = res.data;
        if (resp.flag) {
          this.total = resp.data.total
          this.goodsTypeList = resp.data.rows
        }
      });
    },
    resetDateFilter() {
      this.$refs.filterTable.clearFilter("date");
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    formatter(row, column) {
      return row.address;
    },
    filterStatus(value, row) {
      return row.status === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    handleEdit(row) {
      console.log(row);
    },
    handleDelete(row) {
      console.log(row);
    }
  },
  filters: {
    statusFilter(type) {
      const statusObj = statusOptions.find(obj => {
        return obj.type === type;
      });
      return statusObj ? statusObj.name : null;
    }
  }
};
</script>

<style scoped>
</style>