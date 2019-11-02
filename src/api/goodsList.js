import request from '@/utils/request'
export default {
    getGoodsList() {
        return request({
            url: '/goods/list',
            method: 'get'
        })
    },
    // 商品列表分页
    getPagination(page, size) {
        return request({
            url: `/goods/list/${page}/${size}`,
            method: 'get'
        })
    },
    // 新增商品
    addGoodsList(data) {
        return request({
            url: '/goods/list',
            method: 'post',
            data
        })
    },
}