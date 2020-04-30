<template>
  <div>
    <!-- 新增开始 -->
    <el-button
      type="success"
      icon="el-icon-plus"
      @click="handleAddGoodsList"
      size="small"
      >新增</el-button
    >
    <!-- 新增结束 -->
    <!-- talel开始 -->
    <el-table :data="goodsList" height="700" border style="width: 100%">
      <el-table-column
        prop="goodsName"
        label="商品名称"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="typeName"
        label="商品分类"
        width="180"
      ></el-table-column>
      <el-table-column prop="sort" label="排序"></el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="150"
        :filters="[
          { text: '上架中', value: 1 },
          { text: '已下架', value: 0 }
        ]"
        :filter-method="filterStatus"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 0 ? 'primary' : 'success'"
            disable-transitions
            >{{ scope.row.status | statusFilter }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="stock" label="库存"></el-table-column>
      <el-table-column prop="sale" label="售出"></el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleChangeStatus(scope.row.id)"
            :type="scope.row.status === 1 ? 'primary' : 'success'"
            >{{ scope.row.status === 1 ? "下架" : "上架" }}</el-button
          >
          <el-button
            size="mini"
            @click="handleEdit(scope.row.id)"
            type="primary"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- talel结束 -->
    <!-- dialog开始 -->
    <el-dialog title="商品编辑" :visible.sync="dialogFormVisible">
      <el-form :model="goodsListForm" ref="addGoodsListForm" :rules="rules">
        <el-row>
          <el-form-item
            label="商品分类"
            :label-width="formLabelWidth"
            prop="typeName"
          >
            <el-col :span="14">
              <el-select
                v-model="goodsListForm.typeName"
                placeholder="请选择商品分类"
                @change="getTypeid"
              >
                <el-option
                  v-for="item in goodsTypes"
                  :label="item.typeName"
                  :value="item"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="10">
              <el-alert
                title="请选择商品分类"
                type="warning"
                show-icon
                :closable="false"
              ></el-alert>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="商品名称"
            :label-width="formLabelWidth"
            prop="goodsName"
          >
            <el-col :span="14">
              <el-input
                v-model="goodsListForm.goodsName"
                autocomplete="off"
              ></el-input>
            </el-col>
            <el-col :span="10">
              <el-alert
                title="请输入商品名称，最多20个字"
                type="warning"
                show-icon
                :closable="false"
              ></el-alert>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="商品排序"
            :label-width="formLabelWidth"
            prop="sort"
          >
            <el-col :span="14">
              <el-input
                v-model="goodsListForm.sort"
                autocomplete="off"
              ></el-input>
            </el-col>
            <el-col :span="10">
              <el-alert
                title="请输入数字，越大排序越靠前"
                type="warning"
                show-icon
                :closable="false"
              ></el-alert>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="出售价格"
            :label-width="formLabelWidth"
            prop="price"
          >
            <el-col :span="14">
              <el-input
                v-model="goodsListForm.price"
                autocomplete="off"
              ></el-input>
            </el-col>
            <el-col :span="10">
              <el-alert
                title="请输入对外出售的价格"
                type="warning"
                show-icon
                :closable="false"
              ></el-alert>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="test">确 定</el-button> -->
        <el-button
          type="primary"
          @click="goodsListForm.id === null ? addGoodsList() : updateById()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- dialog结束 -->
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
import goodsTypeApi from "@/api/goodsType";
export default {
  data() {
    return {
      goodsList: [],
      goodsListForm: {
        id: null,
        typeid: null,
        goodsName: null,
        typeName: null,
        sort: 1,
        price: null
      },
      goodsTypes: [], //商品分类，用于添加或者修改商品信息时选择商品分类
      nowTypeName: null, //根据id
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      rules: {
        typeName: [
          {
            required: true,
            message: "请选择商品分类",
            trigger: "change"
          }
        ],
        goodsName: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur"
          }
        ],
        sort: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          }
        ],
        price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur"
          }
        ]
      }
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
    handleAddGoodsList() {
      this.getGoodsType();
      this.handleAdd();
    },
    // 获取商品分类，添加商品时调用
    getGoodsType() {
      goodsTypeApi.getGoodsTypeList().then(res => {
        const resp = res.data;

        this.goodsTypes = [];
        if (resp.flag) {
          for (let typeName = 0; typeName < resp.data.length; typeName++) {
            const element = resp.data[typeName];
            const typeNameOptions = {
              value: element.typeName,
              typeid: element.typeid,
              typeName: element.typeName,
              id: element.id
            };
            this.goodsTypes.push(typeNameOptions);
          }
        }
      });
    },
    getTypeid(item) {
      this.goodsListForm.typeid = item.typeid;
      this.goodsListForm.typeName = item.typeName;
    },
    // 弹出新增窗口
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["addGoodsListForm"].resetFields();
        this.$refs["addGoodsListForm"].clearValidate();
      });
    },
    addGoodsList() {
      this.$refs["addGoodsListForm"].validate(valid => {
        if (valid) {
          goodsListApi.addGoodsList(this.goodsListForm).then(res => {
            const resp = res.data;
            if (resp.flag) {
              this.$message({
                message: resp.message,
                type: "success"
              });
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "error"
              }),
                (this.dialogFormVisible = false);
            }
          });
        } else {
          return false;
        }
      });
    },
    handleEdit(id) {
      goodsListApi.getById(id).then(res => {
        const resp = res.data;

        if (resp.flag) {
          this.nowTypeName = resp.data.typeName;
          this.goodsListForm = resp.data;
        }
        this.getGoodsType();
        this.handleAdd();
      });
    },
    handleDelete(id) {
      this.$confirm(
        "删除商品后，该商品对应的所有卡密将被删除，确定要删除该商品?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          goodsListApi.delete(id).then(res => {
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
    updateById() {
      this.$refs["addGoodsListForm"].validate(valid => {
        if (valid) {
          this.goodsListForm.id = this.goodsListForm._id;
          this.goodsListForm.price = parseFloat(this.goodsListForm.price);
          goodsListApi.updateById(this.goodsListForm).then(res => {
            const resp = res.data;
            if (resp.flag) {
              this.$message({
                message: resp.message,
                type: "success"
              });
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "error"
              });
              this.dialogFormVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    handleChangeStatus(id) {
      this.goodsListForm.id = id;
      this.goodsListForm.status = this.goodsListForm.status == 1 ? 0 : 1;
      goodsListApi.updateById(this.goodsListForm).then(res => {
        const resp = res.data;
        if (resp.flag) {
          this.$message({
            message: resp.message,
            type: "success"
          });
          this.fetchData();
        } else {
          this.$message({
            message: resp.message,
            type: "error"
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.el-alert {
  padding-top: 0;
  padding-bottom: 0;
  background-color: transparent;
}
</style>
