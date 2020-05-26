<template>
    <div>
        <el-button type="success" icon="el-icon-plus" @click="handleAdd" size="small" class="add">新增</el-button>
        <el-table :data="goodsTypeList" height="700" border style="width: 100%">
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="typeName" label="分类名称"></el-table-column>
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
                    >{{ scope.row.status | statusFilter }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" width="150"></el-table-column>
            <el-table-column label="操作" width="210">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        @click="handleChangeStatus(scope.row.id)"
                        :type="scope.row.status === 0 ? 'success' : 'primary'"
                    >{{ scope.row.status == 0 ? '上架': '下架' }}</el-button>
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
            :total="total"
        ></el-pagination>
        <!-- 弹出新增商品分类窗口 -->
        <el-dialog title="商品分类编辑" :visible.sync="dialogFormVisible">
            <el-form :model="goodsTypeForm" :rules="rules" ref="addGoodsTypeForm">
                <el-form-item label="分类名称" :label-width="formLabelWidth" prop="typeName">
                    <el-input v-model="goodsTypeForm.typeName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="分类排序" :label-width="formLabelWidth" prop="sort">
                    <el-input v-model="goodsTypeForm.sort" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="
            goodsTypeForm.id
              ? updateGoodsType('addGoodsTypeForm')
              : addGoodsType('addGoodsTypeForm')
          "
                >确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import goodsTypeApi from "@/api/goodsType";
import { log } from "util";
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
            pageSize: 10,
            dialogFormVisible: false,
            goodsTypeForm: {
                id: null,
                typeName: "",
                status: null,
                sort: 1
            },
            formLabelWidth: "120px",
            rules: {
                typeName: [
                    {
                        required: true,
                        message: "请输入商品分类名称",
                        trigger: "blur"
                    }
                ],
                sort: [
                    {
                        required: true,
                        message: "请输入商品分类排序，排序应大于1",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    methods: {
        // 修改上下架状态
        handleChangeStatus(id) {
            goodsTypeApi.getById(id).then(res => {
                const resp = res.data;
                if (resp.flag) {
                    this.goodsTypeForm = resp.data;
                    this.goodsTypeForm.status = this.goodsTypeForm.status == 1 ? 0 : 1;
                    goodsTypeApi.update(this.goodsTypeForm).then(res => {
                        this.fetchData();
                    });
                }
            });
        },
        handleSizeChange(size) {
            this.pageSize = size;
            this.fetchData();
        },
        handleCurrentChange(current) {
            this.currentPage = current;
            this.fetchData();
        },
        fetchData() {
            goodsTypeApi
                .getPagination(this.currentPage, this.pageSize)
                .then(res => {
                    const resp = res.data;
                    if (resp.flag) {
                        this.total = resp.data.total;
                        this.goodsTypeList = resp.data.rows;
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
        handleEdit(id) {
            goodsTypeApi.getById(id).then(res => {
                const resp = res.data;
                this.handleAdd();
                if (resp.flag) {
                    this.$nextTick(() => {
                        this.goodsTypeForm = resp.data;
                    });
                }
            });
        },
        handleDelete(id) {
            this.$confirm(
                "删除分类后，该分类下的商品和卡密均会被删除，确定要删除该分类?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(() => {
                    goodsTypeApi.deleteOneById(id).then(res => {
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
                .catch((err) => {
                    console.log(err);
                    
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        addGoodsType(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    goodsTypeApi.addGoodsType(this.goodsTypeForm).then(res => {
                        const resp = res.data;
                        if (resp.flag) {
                            this.$message({
                                message: resp.message,
                                type: "success"
                            });
                            this.dialogFormVisible = false;
                            this.fetchData();
                        } else {
                            this.$message({
                                message: resp.message,
                                type: "warning"
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        updateGoodsType(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    goodsTypeApi.update(this.goodsTypeForm).then(res => {
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
                }
            });
        },
        // 弹出新增窗口
        handleAdd() {
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.$refs["addGoodsTypeForm"].resetFields();
                this.$refs["addGoodsTypeForm"].clearValidate();
            });
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
.add {
    margin-bottom: 10px;
}
</style>
