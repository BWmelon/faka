import request from "@/utils/request";
export default {
  // 更新商户信息
  updateInfo(data) {
    return request({
      url: "/setting/info",
      method: "post",
      data
    });
  },
  // 获取商户信息
  getInfo() {
    return request({
      url: "/setting/info",
      method: "get"
    });
  }
};
