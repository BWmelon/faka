import Vue from "vue";
import Router from "vue-router";

// 首页
import Index from '@/views/index'
import Purchase from '@/views/index/purchase'
import Query from '@/views/index/query'
import Trade from '@/views/index/trade'

import Admin from '@/views/admin'
import Layout from '@/components/Layout'
// 仪表盘
import Home from '@/views/home'
// 系统设置路由
import Pay from '@/views/setting/pay'
// 商品管理路由
import GoodsType from '@/views/goods/type'
import GoodsList from '@/views/goods/list'
import GoodsCard from '@/views/goods/card'
// 交易管理路由
import Order from '@/views/trade/order'
import SaleCard from '@/views/trade/salecard'
import SaleEarning from '@/views/trade/saleearning'
import PayRate from '@/views/trade/payrate'
// 日志路由
import RecordLog from '@/views/log/recordlog'
import AccountLog from '@/views/log/accountlog'
import PlayLog from '@/views/log/playlog'
import LoginLog from '@/views/log/loginlog'
Vue.use(Router);

// 解决多次点击报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err);
};

export default new Router({
	mode: "history",
	base: process.env.BASE_URL,
	routes: [{
			path: '/',
			redirect: '/index',
		},
		{
			path: '/index',
			name: 'index',
			component: Index,
			redirect: '/index/purchase',
			children: [{
				path: 'purchase',
				component: Purchase
			}, {
				path: 'query',
				component: Query,
				children: [{
					path: '/index/query/:out_trade_no',
					component: Trade
				}]
			}]
		},
		{
			path: '/admin',
			name: 'name',
			component: Admin
		},
		{
			path: '/home',
			component: Layout,
			children: [{
				path: '/',
				component: Home,
				meta: {
					title: "仪表盘"
				}
			}]
		},
		{
			path: '/pay',
			component: Layout,
			children: [{
				path: '/',
				component: Pay,
				meta: {
					title: "支付设置"
				}
			}]
		},
		{
			path: '/goodsType',
			component: Layout,
			children: [{
				path: '/',
				component: GoodsType,
				meta: {
					title: "商品分类"
				}
			}]
		},
		{
			path: '/goodsList',
			component: Layout,
			children: [{
				path: '/',
				component: GoodsList,
				meta: {
					title: "商品列表"
				}
			}]
		},
		{
			path: '/goodsCard',
			component: Layout,
			children: [{
				path: '/',
				component: GoodsCard,
				meta: {
					title: "卡密管理"
				}
			}]
		},
		{
			path: '/order',
			component: Layout,
			children: [{
				path: '/',
				component: Order,
				meta: {
					title: "订单记录"
				}
			}]
		},
		{
			path: '/saleCard',
			component: Layout,
			children: [{
				path: '/',
				component: SaleCard,
				meta: {
					title: "售出卡密"
				}
			}]
		},
		{
			path: '/saleEarning',
			component: Layout,
			children: [{
				path: '/',
				component: SaleEarning,
				meta: {
					title: "收益统计"
				}
			}]
		},
		{
			path: '/payRate',
			component: Layout,
			children: [{
				path: '/',
				component: PayRate,
				meta: {
					title: "支付费率"
				}
			}]
		},
		{
			path: '/recordLog',
			component: Layout,
			children: [{
				path: '/',
				component: RecordLog,
				meta: {
					title: "结算记录"
				}
			}]
		},
		{
			path: '/accountLog',
			component: Layout,
			children: [{
				path: '/',
				component: AccountLog,
				meta: {
					title: "资金明细"
				}
			}]
		},
		{
			path: '/playLog',
			component: Layout,
			children: [{
				path: '/',
				component: PlayLog,
				meta: {
					title: "操作记录"
				}
			}]
		},
		{
			path: '/loginLog',
			component: Layout,
			children: [{
				path: '/',
				component: LoginLog,
				meta: {
					title: "登录日志"
				}
			}]
		}
	]
});