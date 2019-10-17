import Vue from "vue";
import Router from "vue-router";
import Index from '@/views/index'
import Admin from '@/views/admin'
import Layout from '@/components/Layout'
Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/admin',
      name: 'name',
      component: Admin
    },
    {
      path: '/home',
      name: 'home',
      component: Layout
    },
  ]
});
