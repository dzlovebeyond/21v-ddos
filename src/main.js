import Vue from 'vue'
import App from './App.vue'

// 引入Ant Design
import Antd from 'ant-design-vue'
// 引入Ant Design CSS样式
import 'ant-design-vue/dist/antd.css'

// 引入路由
import router from '@/router'

Vue.config.productionTip = false

// 全局注册所有Ant Design组件
Vue.use(Antd)

new Vue({
    router, //把路由对象注册到Vue实例中
    render: h => h(App),
}).$mount('#app')