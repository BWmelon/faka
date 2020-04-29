<template>
    <el-form
        :model="dynamicValidateForm"
        ref="dynamicValidateForm"
        label-width="100px"
        class="demo-dynamic"
        :hide-required-asterisk="true"
    >
        <el-form-item
            v-for="(notice, index) in dynamicValidateForm.notices"
            :label="'通知公告' + (index + 1)"
            :key="notice.key"
            :prop="'notices.' + index + '.value'"
            :rules="{required: true, message: '通知公告内容不能为空', trigger: 'blur'}"
        >
            <el-input v-model="notice.value"></el-input>
            <el-button @click.prevent="removeNotice(notice)">删除</el-button>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
            <el-button @click="addNotice">新增公告</el-button>
            <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
        </el-form-item>
    </el-form>
</template> 
<script>
import noticeApi from '@/api/notice'
export default {
    data() {
        return {
            dynamicValidateForm: {
                notices: [
                    
                ]
            }
        };
    },
    created() {
        this.getNotices();
    },
    methods: {
        getNotices() {
            noticeApi.getNotices().then(data => {
                const resp = data.data;
                if(resp.flag) {
                    const tempArr = resp.data.map(item => {
                        return {value: item}
                    })

                    this.dynamicValidateForm.notices = tempArr;
                }
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const tempArr = this.dynamicValidateForm.notices.map(item => {
                        return item.value
                    })
                    noticeApi.addNotices(tempArr).then(data => {
                        const resp = data.data;
                        if(resp.flag) {
                            this.$message({
                                type: 'success',
                                message: resp.message
                            })
                            this.getNotices();
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        removeNotice(item) {
            var index = this.dynamicValidateForm.notices.indexOf(item);
            if (index !== -1) {
                this.dynamicValidateForm.notices.splice(index, 1);
            }
        },
        addNotice() {
            this.dynamicValidateForm.notices.push({
                value: "",
                key: Date.now()
            });
        }
    }
};
</script>

<style scoped>
.el-input {
    width: calc(100% - 80px);
    margin-right: 10px;
}
</style>