<template>
    <div>
        <!-- 搜索查询开始 -->
        <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px;">
            <!-- <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员名称"></el-input>
            </el-form-item>-->
            <el-form-item prop="payType">
                <el-select
                    v-model="searchMap.goodsType"
                    placeholder="商品分类"
                    @change="handleChangeGoodsType"
                >
                    <el-option key="0" label="所有分类" value="0"></el-option>
                    <el-option
                        v-for="option in goodsTypes"
                        :key="option.id"
                        :label="option.goodsType"
                        :value="option.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="payType">
                <el-select v-model="searchMap.goodsName" placeholder="商品名称">
                    <el-option key="0" label="所有商品" value="0"></el-option>
                    <el-option
                        v-for="option in goodsNames"
                        :key="option.id"
                        :label="option.goodsName"
                        :value="option.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="订单编号查询" v-model="orderId">
                    <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                </el-input>
            </el-form-item>
            <!-- <el-form-item prop="birthday">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="searchMap.birthday"
          type="date"
          placeholder="出生日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
        <el-button icon="el-icon-edit" size="primary" @click="handleAdd">新增</el-button>
        <el-button icon="el-icon-refresh-right" @click="resetForm('searchForm')">重置</el-button>
            </el-form-item>-->
        </el-form>
        <!-- 查看详情对话框开始 -->
        <el-dialog title="订单详情" :visible.sync="dialogTableVisible">
            <p>
                <span>商家订单号:</span>
                <span>{{detail.out_trade_no}}</span>
            </p>
            <p>
                <span>支付订单号:</span>
                <span>{{detail.trade_no}}</span>
            </p>
            <p>
                <span>支付时间:</span>
                <span>{{detail.payTime}}</span>
            </p>
            <p>
                <span>订单状态:</span>
                <span>{{detail.status | payFilter}}</span>
            </p>
            <p>
                <span>商品名称:</span>
                <span>{{detail.goodsName}}</span>
            </p>
            <p>
                <span>支付金额:</span>
                <span>{{detail.money}}</span>
            </p>
            <p>
                <span>购买数量:</span>
                <span>{{detail.amount}}</span>
            </p>
            <p>
                <span>支付方式:</span>
                <span>{{detail.payType | payTypeFilter}}</span>
            </p>
            <p>
                <span>手机号:</span>
                <span>{{detail.phone}}</span>
            </p>
            <p>
                <span>卡密:</span>
                <span>{{detail.cards}}</span>
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 查看详情对话框结束 -->
        <!-- 搜索查询结束 -->
        <el-table :data="tableData" height="700" border style="width: 100%">
            <el-table-column prop="out_trade_no" label="商家订单号" width="200"></el-table-column>
            <el-table-column prop="orderTime" label="下单时间" width="180"></el-table-column>
            <el-table-column prop="payTime" label="支付时间" width="180"></el-table-column>
            <el-table-column
                prop="status"
                label="订单状态"
                :filters="[{ text: '已支付', value: 1 }, { text: '未支付', value: 0 }]"
                :filter-method="filterStatus"
                filter-placement="bottom-end"
                width="90"
            >
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.status === 0 ? 'primary' : 'success'"
                        disable-transitions
                    >{{scope.row.status | payFilter}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称"></el-table-column>
            <el-table-column prop="amount" label="下单数量" width="100"></el-table-column>
            <el-table-column prop="money" label="支付金额" width="100"></el-table-column>
            <el-table-column prop="payType" label="支付方式" width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.payType | payTypeFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号" width="140"></el-table-column>
            <el-table-column label="管理" width="110">
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
const payOptions = [
    { type: 0, name: "未支付" },
    { type: 1, name: "已支付" }
];
const payTypeOptions = [
    { type: 'wxpay', name: "微信支付" },
    { type: 'alipay', name: "支付宝" },
    { type: 'qqpay', name: "QQ钱包" }
];
import goodsTypeApi from "@/api/goodsType";
import goodsListApi from "@/api/goodsList";
import tradeOrderApi from "@/api/tradeOrder";
export default {
    created() {
        this.getAllPagination();
        // this.getAllGoodsTypeList();
        // this.getAllGoodsList();
    },
    data() {
        return {
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            searchMap: {
                goodsType: null
            },
            goodsTypes: [],
            goodsNames: [],
            orderId: null,
            detail: {
                out_trade_no: null,
                trade_no: null,
                paytime: null,
                status: null,
                goodsName: null,
                money: null,
                amount: null,
                payType: null,
                cards: null
            },
            dialogTableVisible: false
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
            tradeOrderApi.getById(id).then(res => {
                const resp = res.data;
                if (resp.flag) {
                    this.detail = resp.data;
                    this.dialogTableVisible = true;
                }
            });
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
        getAllGoodsTypeList() {
            goodsTypeApi.getGoodsTypeList().then(res => {
                this.goodsTypes = [];
                const resp = res.data;
                if (resp.flag) {
                    resp.data.forEach(item => {
                        this.goodsTypes.push({
                            id: item.id,
                            value: item.id,
                            goodsType: item.typeName
                        });
                    });
                }
            });
        },
        getAllGoodsList() {
            goodsListApi.getGoodsList().then(res => {
                this.goodsNames = [];
                const resp = res.data;
                if (resp.flag) {
                    resp.data.forEach(item => {
                        this.goodsNames.push({
                            id: item.id,
                            value: item.id,
                            goodsName: item.goodsName
                        });
                    });
                }
            });
        },
        handleChangeGoodsType() {},
        handleSizeChange(val) {
            this.pageSize = val;
            this.getAllPagination();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getAllPagination();
        },
        handleSearch() {
            if (this.orderId) {
                tradeOrderApi.getByOrderId(this.orderId).then(res => {
                    const resp = res.data;
                    if (resp.flag) {
                        this.tableData = [];
                        this.tableData[0] = resp.data;
                        this.$message({
                            message: resp.message,
                            type: "success"
                        });
                    } else {
                        this.$message({
                            message: resp.message,
                            type: "warning"
                        });
                    }
                });
            } else {
                this.getTradeOrder();
            }
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
        }
    }
};
</script>

<style scoped>
.el-dialog p {
    border-bottom: 1px dotted #ccc;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
}
.el-dialog p span:nth-child(1) {
    margin-right: 30px;
}
</style>