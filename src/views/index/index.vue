<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span><i class="el-icon-bell"></i> 公告信息</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <ul>
                <li v-for="notice in notices" :key="notice" class="notice">{{notice}}</li>
            </ul>
        </el-card>
        <router-view></router-view>
    </div>
</template>

<script>
import noticeApi from '@/api/notice'
export default {
    data() {
        return {
            notices: []
        }
    },
    created() {
        this.getNotice();
    },
    methods: {
        getNotice() {
            noticeApi.getNotices().then(data => {
                const resp = data.data;
                if(resp.flag) {
                    this.notices = resp.data
                }
            })
        }
    }
}
</script>

<style scoped>
ul {
    list-style: none;
}
.notice {
    line-height: 24px;
    font-weight: bold;
}

.notice:nth-child(4n+1) {
    color: #090;
}
.notice:nth-child(4n+2) {
    color: #396;
}
.notice:nth-child(4n+3) {
    color: #337FE5;
}
.notice:nth-child(4n+4) {
    color: #f00;
}
.notice:nth-child(n+2) {
    margin-top: 6px;
}
</style>