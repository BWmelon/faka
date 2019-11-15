<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="商品分类" prop="goodsType">
        <el-select
          v-model="form.goodsType"
          placeholder="请选择商品分类"
          @change="getGoodsNameByGoodsTypeId"
        >
          <el-option
            v-for="option in goodsTypes"
            :key="option.id"
            :label="option.goodsType"
            :value="option.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称" prop="goodsName">
        <el-select v-model="form.goodsName" placeholder="请选择商品" @change="getStockByGoodsId">
          <el-option
            v-for="option in goodsNames"
            :key="option.id"
            :label="option.goodsName"
            :value="option.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="购买数量" prop="count">
        <el-input-number v-model="form.count" :min="1" :max="10"></el-input-number>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input placeholder="请选择商品" v-model="form.stock" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="付款方式" prop="paytype">
        <el-radio-group v-model="form.paytype">
          <el-radio label="微信" v-model="form.radio"></el-radio>
          <el-radio label="支付宝" v-model="form.radio"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交订单</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import goodsTypeApi from "@/api/goodsType";
import goodsCardApi from "@/api/goodsCard";
import goodsListApi from "@/api/goodsList";
export default {
  created() {
    this.getGoodsTypeList();
  },
  data() {
    return {
      goodsTypes: [],
      goodsNames: [],
      form: {
        stock: "",
        radio: "1",
        goodsName: null,
        count: 1
      },
      rules: {
           goodsType: [
            { required: true, message: '请选择商品分类', trigger: 'change' }
          ],
           goodsName: [
            { required: true, message: '请选择商品', trigger: 'change' }
          ],
          count: [
            { required: true, message: '请输入购买数量', trigger: 'blur' },
            { type: 'number', message: '购买数量必须为数字值'}
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' }
          ],
          paytype: [
            { required: true, message: '请选择支付方式', trigger: 'change' }
          ]
      }
    };
  },
  methods: {
    onSubmit() {
      this.$refs['form'].validate(valid => {
          if(valid) {
              console.log(1);
              
          } else {
              console.log(0);
              
          }
      })
    },
    getGoodsTypeList() {
      goodsTypeApi.getGoodsTypeList().then(res => {
        const resp = res.data;
        this.goodsTypes = [];
        if (resp.flag) {
          resp.data.forEach(item => {
            this.goodsTypes.push({
              goodsType: item.typeName,
              id: item.id
            });
          });
        }
      });
    },
    getGoodsNameByGoodsTypeId() {
      goodsCardApi.getGoodsNameByGoodsTypeId().then(res => {
        const resp = res.data;
        this.goodsNames = [];
        if (resp.flag) {
          resp.data.forEach(item => {
            this.goodsNames.push({
              goodsName: item.goodsName,
              id: item.id
            });
          });
        }
      });
    },
    getStockByGoodsId() {
      goodsListApi.getById(this.form.goodsName).then(res => {
        const resp = res.data;
        if (resp.flag) {
          this.form.stock = resp.data.stock;
        }
      });
    }
  }
};
</script>

<style scoped>
</style>