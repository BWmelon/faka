import request from '@/utils/request'
export default {
    // 修改支付配置信息
    updatePayType(data) {
        return request({
            url: '/pay',
            method: 'put',
            data
        })
    },
    // 获取支付配置信息
    getPayInfo() {
        return request({
            url: '/pay',
            method: 'get'
        })
    },
    launchPay(data) {
        return request({
            url: '/pay',
            method: 'post',
            data
        })
    }
}