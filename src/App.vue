<template>
<a-config-provider :locale="locale">
  <div id="app" class="myapp">
    <!-- 路由入口 -->
    <router-view/>
  </div>
</a-config-provider>
</template>

<script>
// 引入国际化
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment"
import "moment/locale/zh-cn"
moment.locale('zh_CN')

export default {
  // 根组件名称（建议每一个组件都给一个name）
  name: 'App',
  data () {
    return {
      locale:zhCN
    }
  }
}
</script>
<style scoped>
.myapp {
  height: 100%;
}
.ant-layout {
  height: 100%!important;
}
</style>
