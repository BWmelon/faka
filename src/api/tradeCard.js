import request from '@/utils/request'
export default {
    getList() {
        return request({
            url: `/trade/card`,
            method: 'get'
        })
    },
    getPagination(page, size) {
        return request({
            url: `/trade/card/${page}/${size}`,
            method: 'get'
        })
    }
}