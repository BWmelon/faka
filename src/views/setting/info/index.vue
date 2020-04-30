<template>
  <div>
    <p>商户信息</p>
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      :rules="rules"
      :hide-required-asterisk="true"
    >
      <el-form-item label="店铺名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="店铺地址" prop="url">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="商家QQ" prop="qq">
        <el-input v-model="form.qq"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import infoApi from "@/api/info";
export default {
  data() {
    return {
      form: {
        name: "",
        url: "",
        qq: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入店铺名称",
            trigger: "blur"
          }
        ],
        url: [
          {
            required: true,
            message: "请输入店铺地址",
            trigger: "blur"
          }
        ],
        qq: [
          {
            required: true,
            message: "请输入商家qq",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    getInfo() {
      infoApi.getInfo().then(res => {
        const resp = res.data;
        if (resp.flag) {
          this.form = resp.data;
        }
      });
    },

    onSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          infoApi.updateInfo(this.form).then(data => {
            this.$message({
              type: "success",
              message: data.data.message
            });
            this.getInfo();
          });
        }
      });
    }
  },
  created() {
    this.getInfo();
  }
};
</script>

<style scoped></style>
