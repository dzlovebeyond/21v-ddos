import Vue from 'vue'
// 引入路由 vue-router
import VueRouter from 'vue-router'

// 注册路由（全局组件）
Vue.use(VueRouter)

// 配置一级路由规则
const routes = [{
    // layout布局页面
    path: '/',
    name: 'layout',
    redirect: '/monitor', //默认跳转到监控页面
    component: () =>
        import ('@/layout'),

    // 配置二级路由规则
    children: [{
        // 监控页面
        path: '/monitor',
        name: 'monitor',
        component: () =>
            import ('@/views/Monitor')
    }, {
        // 策略详情页面
        path: '/policy_total',
        name: 'policy_total',
        component: () =>
            import ('@/views/PolicyTotal')
    }, {
        // 策略详情页面
        path: '/policy_detail',
        name: 'policy_detail',
        component: () =>
            import ('@/views/PolicyDetail')
    }]
}]

// 生成路由对象
const router = new VueRouter({
    routes
})

// 对外暴露router
export default router