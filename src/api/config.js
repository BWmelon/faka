import request from "@/utils/request";
export default {
    // 获取收款平台方式
    getPayPlatform() {
        return request({
            url: "/user/config/platform",
            method: "get"
        });
    },
    // 修改收款平台方式
    changePayPlatform(data) {
        return request({
            url: "/user/config/platform",
            method: "post",
            data
        });
    },
    // 获取支付开关状态
    getPaySwitch() {
        return request({
            url: "/user/config/switch",
            method: "get"
        });
    },
    // 修改支付开光状态
    changePaySwitch(data) {
        return request({
            url: "/user/config/switch",
            method: "post",
            data
        });
    }
};