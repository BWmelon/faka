import request from '@/utils/request'
export default {
    getTradeOrderList() {
        return request({
            url: '/trade/order',
            method: 'get'
        })
    },
    getAllPagination(page, size) {
        return request({
            url: `/trade/order/${page}/${size}`,
            method: 'get'
        })
    }
}