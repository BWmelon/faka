import request from "@/utils/request";
export default {
	getGoodsCard() {
		return request({
			url: "/goods/card",
			method: "get"
		});
	},
	// 获取所有未出售卡密分页
	getAllPagination(page, size) {
		return request({
			url: `/goods/card/${page}/${size}`,
			method: "get"
		});
	},
	// 根据商品名称获取未出售卡密分页
	getPaginationByGoodsId(id, page, size) {
		return request({
			url: `/goods/card/${id}/${page}/${size}`,
			method: "get"
		});
	},
	// 删除单一卡密
	deleteOneById(id) {
		return request({
			url: `goods/card/${id}`,
			method: "delete"
		});
	},
	deleteMoreById(data) {
		return request({
			url: `goods/card/delete`,
			method: "post",
			data
		});
	},
	getGoodsNameByGoodsTypeId(id) {
		return request({
			url: `/goods/list/type/${id}`,
			method: "get"
		});
	},
	addCards(data) {
		return request({
			url: "/goods/card",
			method: "post",
			data
		});
	}
};