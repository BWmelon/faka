import request from '@/utils/request'
export default {
    // 商品分类列表
    getGoodsTypeList() {
        return request({
            url: '/goods/type',
            method: 'get'
        })
    },
    // 商品分类分页
    getPagination(page, size) {
        return request({
            url: `/goods/type/${page}/${size}`,
            method: 'get'
        })
    }

}