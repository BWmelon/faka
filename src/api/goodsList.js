import request from "@/utils/request";
export default {
	// 根据typeid获取商品列表
	getGoodsList(goodsTypeid) {
		return request({
			url: `/goods/list/type/${goodsTypeid}`,
			method: "get"
		});
	},
	getGoodsListAll() {
		return request({
			url: `/goods/list`,
			method: "get"
		});
	},
	// 商品列表分页
	getPagination(page, size) {
		return request({
			url: `/goods/list/${page}/${size}`,
			method: "get"
		});
	},
	// 新增商品
	addGoodsList(data) {
		return request({
			url: "/goods/list",
			method: "post",
			data
		});
	},
	getById(id) {
		return request({
			url: `/goods/list/${id}`,
			method: "get"
		});
	},
	updateById(data) {
		return request({
			url: `goods/list/${data.id}`,
			method: "put",
			data
		});
	},
	delete(id) {
		return request({
			url: `/goods/list/${id}`,
			method: "delete"
		});
	}
};