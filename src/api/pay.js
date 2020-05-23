import request from "@/utils/request";
export default {
	// 修改支付配置信息
	updatePayType(data) {
		return request({
			url: "/pay",
			method: "put",
			data
		});
	},
	// 获取支付配置信息
	getPayInfo(payPlatform) {
		return request({
			url: `/pay/${payPlatform}`,
			method: "get"
		});
	},
	launchPay(data) {
		return request({
			url: "/pay",
			method: "post",
			data
		});
	},
	// 检测支付状态
	checkPayStatus(out_trade_no) {
		return request({
			url: `/trade/order/checkStatus/${out_trade_no}`,
			method: 'get'
		})
	}
};