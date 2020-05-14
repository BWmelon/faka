import request from "@/utils/request";
export default {
    // 获取收款平台方式
    getPayPlatform() {
        return request({
            url: "/user/config",
            method: "get"
        });
    },
    // 修改收款平台方式
    changePayPlatform(data) {
        return request({
            url: "/user/config",
            method: "post",
            data
        });
    }
};