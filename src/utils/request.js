import axios from 'axios'
import router from '@/router'
import Vue from 'Vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import {Message} from 'element-ui';


const request = axios.create({
    // baseURL: "/",
    // baseURL: "/dev-api",
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000
})

let loading;

// 请求拦截器
request.interceptors.request.use(config => {
        NProgress.start();
    var token = localStorage.getItem('faka-token');
    if(token) {
        config.headers.common['Authorization'] = token;
    }
    return config;
    // 请求拦截
}, error => {
    // 异常
    return Promise.reject(error);
})

// 响应拦截器   
request.interceptors.response.use(response => {
    NProgress.done();
    return response;
    // 响应拦截
}, error => {
    // 异常

    // token失效前往登录界面
    if (error.toString().search('401') != -1) {
            Message.error({
                message: '1小时未进行操作，登录状态已过期，请重新登录',
                time: 5000
            })
            router.push('/admin')
    }
    return Promise.reject(error);
})
export default request;