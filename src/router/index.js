import Vue from 'vue'
// 引入路由 vue-router
import VueRouter from 'vue-router'

// 注册路由（全局组件）
Vue.use(VueRouter)

// 配置路由规则
const routes = [{
    // layout布局页面
    path: '/',
    name: 'layout',
    component: () =>
        import ('@/layout')
}]

// 生成路由对象
const router = new VueRouter({
    routes
})

// 对外暴露router
export default router