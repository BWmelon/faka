import request from "@/utils/request";
export default {
  // 商品分类列表
  getGoodsTypeList() {
    return request({
      url: "/goods/type",
      method: "get"
    });
  },
  // 商品分类分页
  getPagination(page, size) {
    return request({
      url: `/goods/type/${page}/${size}`,
      method: "get"
    });
  },
  // 新增商品分类
  addGoodsType(data) {
    return request({
      url: "/goods/type",
      method: "post",
      data
    });
  },
  // 获取商品分类信息
  getById(id) {
    return request({
      url: `/goods/type/${id}`,
      method: "get"
    });
  },
  // 修改商品分类信息
  update(data) {
    return request({
      url: `/goods/type/${data.id}`,
      method: "put",
      data
    });
  },
  delete(id) {
    return request({
      url: `/goods/type/${id}`,
      method: "delete"
    });
  }
};
