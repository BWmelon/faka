import axios from 'axios'

// axios.get("/db.json").then(res => {
//     console.log(res.data);
    
// })

const request = axios.create({
    // baseURL: "/",
    // baseURL: "/dev-api",
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000,
    headers: {
        'Authorization': localStorage.getItem('faka-token')
    }
})

// 请求拦截器
request.interceptors.request.use(config => {
    return config;
    // 请求拦截
}, error => {
    // 异常
    return Promise.reject(error);
})

// 响应拦截器   
request.interceptors.response.use(response => {
    return response;
    // 响应拦截
}, error => {
    // 异常
    return Promise.reject(error);
})
// request.get("/db.json").then(res => {
//     console.log(res.data);
// })

export default request;