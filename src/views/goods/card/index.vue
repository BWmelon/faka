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
                        <el-select
                            v-model="nowGoodsNameId"
                            placeholder="所有商品"
                            @change="handleChangGoodName"
                        >
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
            <el-col>
                <el-button
                    type="success"
                    icon="el-icon-plus"
                    @click="handleAddCards"
                    size="small"
                >添加卡密</el-button>
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
        <template slot-scope="scope">{{ scope.row.time }}</template>
            </el-table-column>-->
            <el-table-column prop="card" label="卡密" show-overflow-tooltip></el-table-column>
            <el-table-column
                prop="status"
                label="状态"
                width="100"
                :filters="[
          { text: '已使用', value: 1 },
          { text: '未使用', value: 0 }
        ]"
                :filter-method="filterTag"
                filter-placement="bottom-end"
            >
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.status === 0 ? 'primary' : 'success'"
                        disable-transitions
                    >{{ scope.row.status == 0 ? "未使用" : "已使用" }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称" width="120"></el-table-column>
            <el-table-column prop="importTime" label="导入时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="useTime" label="使用时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="out_trade_no" label="订单编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="phone" label="联系方式" show-overflow-tooltip></el-table-column>
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
        <!-- dialog开始 -->
        <el-dialog title="卡密编辑" :visible.sync="dialogFormVisible" width="80%">
            <el-form :model="addCardForm" ref="addCardsForm" :rules="rules">
                <el-row>
                    <el-form-item label="商品分类" :label-width="formLabelWidth" prop="goodsType">
                        <el-col :span="14">
                            <!-- <el-select v-model="goodsListForm.typeName" :value="nowTypeName" placeholder="请选择商品分类"> -->
                            <el-select
                                v-model="addCardForm.goodsType"
                                placeholder="请选择商品分类"
                                @change="getGoodsNameByGoodsTypeId(nowAddCardGoodsTypeId)"
                            >
                                <el-option
                                    v-for="item in goodsType"
                                    :label="item.goodsType"
                                    :value="item.value"
                                    :key="item.id"
                                ></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="10">
                            <el-alert title="请选择商品分类" type="warning" show-icon :closable="false"></el-alert>
                        </el-col>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="商品名称" :label-width="formLabelWidth" prop="goodsName">
                        <el-col :span="14">
                            <!-- <el-select v-model="goodsListForm.typeName" :value="nowTypeName" placeholder="请选择商品分类"> -->
                            <el-select
                                v-model="addCardForm.listid"
                                placeholder="请选择商品"
                                @change="getGoodsName"
                            >
                                <el-option
                                    v-for="item in goodsNameByTypeId"
                                    :label="item.goodsName"
                                    :value="item.value"
                                    :key="item.id"
                                ></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="10">
                            <el-alert title="请选择商品" type="warning" show-icon :closable="false"></el-alert>
                        </el-col>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="卡密信息" :label-width="formLabelWidth" prop="cards">
                        <el-col :span="24">
                            <!-- <el-select v-model="goodsListForm.typeName" :value="nowTypeName" placeholder="请选择商品分类"> -->
                            <el-input
                                type="textarea"
                                v-model="addCardForm.cards"
                                autocomplete="off"
                                placeholder="请输入卡密，一行一个"
                                rows="10"
                            ></el-input>
                        </el-col>
                    </el-form-item>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitAddCards">确 定</el-button>
            </div>
        </el-dialog>
        <!-- dialog结束 -->
    </div>
</template>

<script>
import goodsTypeApi from "@/api/goodsType";
import goodsCardApi from "@/api/goodsCard";
import goodsListApi from "@/api/goodsList";
export default {
    created() {
        this.fetchData();
        this.getGoodsType();
        this.getAllGoodsName();
    },
    data() {
        return {
            goodsCard: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            multipleSelection: [],
            cardIdToDelete: [],
            goodsType: [], //所以商品分类名称
            goodsName: [], //所以商品名称
            goodsNameByTypeId: [], //根据商品分类id获取到的商品
            nowGoodsNameId: "所有商品", //查询卡密时当前被选择的商品
            nowAddCardGoodsTypeId: null, //在添加卡密弹窗中被选择的商品分类id
            nowAddCardGoodsNameId: null, //在添加卡密弹窗中被选择的商品id
            dialogFormVisible: false,
            addCardForm: {
                goodsType: null,
                goodsName: null,
                listid: null,
                cards: ""
            },
            rules: {
                goodsType: [
                    {
                        required: true,
                        message: "请选择商品分类",
                        trigger: "change"
                    }
                ],
                listid: [
                    { required: true, message: "请选择商品", trigger: "change" }
                ],
                cards: [
                    {
                        required: true,
                        message: "请输入需要导入的卡密",
                        trigger: "blur"
                    }
                ]
            },
            formLabelWidth: "120px"
        };
    },
    methods: {
        fetchData() {
            if (this.nowGoodsNameId == "所有商品") {
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
        getAllGoodsName() {
            goodsListApi.getGoodsListAll().then(res => {
                const resp = res.data;

                if (resp.flag) {
                    resp.data.forEach(item => {
                        this.goodsName.push({
                            id: item.id,
                            value: item.listid,
                            goodsName: item.goodsName
                        });
                    });
                }
            });
        },
        getGoodsType() {
            this.goodsType = [];
            goodsTypeApi.getGoodsTypeList().then(res => {
                const resp = res.data;
                if (resp.flag) {
                    resp.data.forEach(item => {
                        this.goodsType.push({
                            id: item.id,
                            value: item.typeid,
                            goodsType: item.typeName
                        });
                    });
                }
            });
        },
        // 根据商品id获取商品值
        getGoodsName() {
            this.goodsNameByTypeId.forEach(value => {
                if (value.value == this.addCardForm.listid) {
                    this.addCardForm.goodsName = value.goodsName;
                }
            });
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
                        goodsCardApi
                            .deleteMoreById(this.cardIdToDelete)
                            .then(res => {
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
                    goodsCardApi.deleteOneById(id).then(res => {
						console.log(res);
						
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
        // 在添加卡密弹窗中根据已选择商品分类获取该分类下的商品
        getGoodsNameByGoodsTypeId(id) {
            this.nowAddCardGoodsTypeId = this.addCardForm.goodsType;

            this.goodsNameByTypeId = [];
            goodsListApi.getGoodsList(this.nowAddCardGoodsTypeId).then(res => {
                const resp = res.data;

                if (resp.flag) {
                    resp.data.forEach(item => {
                        this.goodsNameByTypeId.push({
                            id: item.id,
                            value: item.listid,
                            goodsName: item.goodsName
                        });
                    });
                }
                console.log(this.goodsNameByTypeId);
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
        },
        handleAddCards() {
            this.handleAdd();
        },
        // 弹出窗口重置
        handleAdd() {
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                setTimeout(() => {
                    this.$refs["addCardForm"].resetFields();
                    this.$refs["addCardForm"].clearValidate();
                }, 1500);
            });
        },
        submitAddCards() {
            this.$refs["addCardsForm"].validate(valid => {
                if (valid) {
                    goodsCardApi.addCards(this.addCardForm).then(res => {
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
                                type: "error"
                            });
                        }
                    });
                }
            });
        },
        filterTag(value, row) {
            return row.status === value;
        }
    }
};
</script>

<style scoped></style>
