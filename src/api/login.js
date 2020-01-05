import request from "@/utils/request"

export function login(username, password) {
    return request({
        url: '/user/login',
        method: 'post',
        data: {
            username,
            password
        }
    })
}

export function getUserInfo(token) {
    return request({
        url: `/user/login/info`,
        method: "get",
        headers: {
            'Authorization': token
        }
    })
}