import Vue from "vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import router from "./router";
import store from './store'

Vue.use(ElementUI);

import './permission.js'

Vue.config.productionTip = process.env.NODE_ENV === 'production';
console.log(process.env.NODE_ENV); // 开发环境 development ， 生产环境 production
console.log(process.env.VUE_APP_SERVICE_URL); 

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
