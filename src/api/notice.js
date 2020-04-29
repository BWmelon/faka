import request from '@/utils/request'
export default {
    // 添加通知公告
    addNotices(data) {
        return request({
            url: '/setting/notice',
            method: 'post',
            data
        })
    },
    getNotices() {
        return request({
            url: '/setting/notice',
            method: 'get'
        })
    }
}