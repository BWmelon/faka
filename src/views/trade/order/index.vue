<template>
  <div>
    <el-table :data="tableData" height="700" border style="width: 100%">
      <el-table-column prop="orderid" label="订单号" width="200"></el-table-column>
      <el-table-column prop="paytime" label="支付时间" width="180"></el-table-column>
      <el-table-column
        prop="status"
        label="订单状态"
        :filters="[{ text: '已支付', value: 1 }, { text: '未支付', value: 0 }]"
        :filter-method="filterStatus"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 0 ? 'primary' : 'success'"
            disable-transitions
          >{{scope.row.status | payFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="goodstype" label="商品分类"></el-table-column>
      <el-table-column prop="goodsname" label="商品名称"></el-table-column>
      <el-table-column prop="money" label="支付金额" width="100"></el-table-column>
      <el-table-column prop="amount" label="下单数量" width="100"></el-table-column>
      <el-table-column prop="paytype" label="支付方式">
        <template slot-scope="scope">
          <span>{{scope.row.paytype | payTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="linktype" label="联系方式">
          <template slot-scope="scope">
          <span>{{scope.row.linktype | linkTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="客户信息"></el-table-column>
      <el-table-column label="管理" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleDetail(scope.row.id)" type="primary">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
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
const payOptions = [{ type: 0, name: "未支付" }, { type: 1, name: "已支付" }];
const payTypeOptions = [
  { type: 1, name: "微信" },
  { type: 2, name: "支付宝" },
  { type: 3, name: "QQ" }
];
const linkTypeOptions = [
  { type: 1, name: "手机号" },
  { type: 2, name: "QQ号" }
];
import tradeOrderApi from "@/api/tradeOrder";
export default {
  created() {
    this.getAllPagination();
  },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
    getTradeOrder() {
      tradeOrderApi.getTradeOrderList().then(res => {
        const resp = res.data;
        if (resp.flag) {
          this.tableData = resp.data;
        }
      });
    },
    filterStatus(value, row) {
      return row.status === value;
    },
    handleDetail(id) {
      console.log(id);
    },
    getAllPagination() {
      tradeOrderApi
        .getAllPagination(this.currentPage, this.pageSize)
        .then(res => {
          const resp = res.data;
          if (resp.flag) {
            this.tableData = resp.data.rows;
            this.total = resp.data.total;
          }
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  },
  filters: {
    payFilter(type) {
      const statusObj = payOptions.find(obj => {
        return obj.type === type;
      });
      return statusObj ? statusObj.name : null;
    },
    payTypeFilter(type) {
      const statusObj = payTypeOptions.find(obj => {
        return obj.type === type;
      });
      return statusObj ? statusObj.name : null;
    },
    linkTypeFilter(type) {
      const statusObj = linkTypeOptions.find(obj => {
        return obj.type === type;
      });
      return statusObj ? statusObj.name : null;
    }
  }
};
</script>

<style scoped>
</style>