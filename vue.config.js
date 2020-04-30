module.exports = {
  devServer: {
    port: 8888,
    host: "localhost",
    https: false,
    open: true,
    proxy: {
      //开发环境代理配置
      // '/dev-api': {
      [process.env.VUE_APP_BASE_API]: {
        // 目标服务器地址，代理访问'http://localhost:8001'
        target: process.env.VUE_APP_SERVICE_URL,
        changeOrigin: true, // 开启代理服务器
        pathRewrite: {
          // /dev-api/debugger.json 最终会发送 http://localhost:8001/db.json
          // 将请求地址前缀/dev-api 替换为 空的
          // '^/dev-api': ''
          ["^" + process.env.VUE_APP_BASE_API]: ""
        }
      }
    }
  },
  lintOnSave: false,
  productionSourceMap: false
};
