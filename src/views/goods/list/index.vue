<template>
  <div>
    <el-table :data="goodsList" height="700" border style="width: 100%">
      <el-table-column prop="goodsName" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="typeName" label="商品分类" width="180"></el-table-column>
      <el-table-column prop="sort" label="排序"></el-table-column>
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
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="stock" label="库存"></el-table-column>
      <el-table-column prop="sell" label="售出"></el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" :type="scope.row.status === 1 ? 'primary' : 'success'">{{ scope.row.status === 1 ? '下架' : '上架' }}</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" type="primary">编辑</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" type="info">加卡</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页开始 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 底部分页结束 -->
  </div>
</template>

<script>
const statusOptions = [
  { type: 0, name: "已下架" },
  { type: 1, name: "上架中" }
];
import goodsListApi from "@/api/goodsList";
export default {
  data() {
    return {
      goodsList: [],
      goodsListForm: {
        id: null,
        goodsName: null,
        typeName: null,
        sort: null,
        status: null,
        price: null,
        stock: null,
        sock: null
      },
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  filters: {
    statusFilter(type) {
      const statusObj = statusOptions.find(obj => {
        return obj.type === type;
      });
      return statusObj ? statusObj.name : null;
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      // goodsListApi.getGoodsList().then(res => {
      goodsListApi.getPagination(this.currentPage, this.pageSize).then(res => {
        const resp = res.data;
        if (resp.flag) {
          this.total = resp.data.total;
          this.goodsList = resp.data.rows;
        }
      });
    },
    filterStatus(value, row) {
      return row.status === value;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  }
};
</script>

<style scoped>
</style>