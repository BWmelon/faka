import request from '@/utils/request'
export default {
    query(out_trade_no) {
        return request({
            url:`/trade/order/query/${out_trade_no}`,
            method: 'get'
        })
    },
    
}