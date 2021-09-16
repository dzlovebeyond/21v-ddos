<template>
  <a-layout class="nav-bar">
    <!-- nav-bar 头部区域 -->
    <a-layout-header class="header">
      <div class="logo" />
      <div class="right-menu">
        <!-- 系统菜单 -->
        <a-dropdown>
          <a class="ant-dropdown-link sys-menu" @click="e => e.preventDefault()">
            DDOS策略管理系统(DDOS)<a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">资产管理(AM)</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">IP地址管理(IPM)</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">网络产品自服务(NPS)</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <!-- /系统菜单 -->
        <!-- 用户菜单 -->
        <a-dropdown>
          <a class="ant-dropdown-link sys-menu" @click="e => e.preventDefault()">
            测试账号<a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;"><a-icon type="edit" />&nbsp;&nbsp;个人中心</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;"><a-icon type="logout" />&nbsp;&nbsp;退出登录</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <!-- /用户菜单 -->
      </div>


    </a-layout-header>
    <!-- /nav-bar 头部区域 -->

    <!-- 主体区域 -->
    <a-layout>
      <!-- 左侧边栏 -->
      <a-layout-sider class="left-sider" width="200" style="background: #fff">
        <a-menu
          theme="dark"
          mode="inline"
          :default-selected-keys="['2']"
          :default-open-keys="['sub1','sub2','sub3','sub4','sub5']"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <a-sub-menu key="sub1">
            <span slot="title"><a-icon type="radar-chart" />看板分析</span>
            <a-menu-item key="1">
              <a-icon type="dashboard" />仪表盘
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title"><a-icon type="area-chart" />聚云管理</span>
            <a-menu-item key="2">
              <router-link to="/monitor">
                <a-icon type="security-scan" />DDOS监控
              </router-link>
            </a-menu-item>
            <a-menu-item key="3">
              <router-link to="/policy_mgt">
                <a-icon type="ordered-list" />策略管理
              </router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub3">
            <span slot="title"><a-icon type="cloud-server" />云堤管理</span>
            <a-menu-item key="4">
              <a-icon type="user" />账户管理
            </a-menu-item>
            <a-menu-item key="5">
              <a-icon type="lock" />手动封堵管理
            </a-menu-item>
            <a-menu-item key="6">
              <a-icon type="heat-map" />自动封堵管理
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub4">
            <span slot="title"><a-icon type="dot-chart" />Genie管理</span>
            <a-menu-item key="7">
              <a-icon type="security-scan" />DDOS监控
            </a-menu-item>
            <a-menu-item key="8">
              <a-icon type="ordered-list" />策略管理
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub5">
            <span slot="title"><a-icon type="file-search" />日志管理</span>
            <a-menu-item key="9">
              <a-icon type="file-protect" />操作记录
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <!-- /左侧边栏 -->

      <!-- 内容区域 -->
      <a-layout class="content1" style="padding: 0 24px 24px">
        <AppMain />
      </a-layout>
      <!-- /内容区域 -->

    </a-layout>
    <!-- /主体区域 -->

  </a-layout>
</template>

<script>
// 引入组件
import AppMain from './components/AppMain.vue'

export default {
  data () {
    return {
      collapsed: false,
    }
  },
  components: {
    // 注册组件
    AppMain
  }
}
</script>

<style>
/* nav-bar 顶部布局 */
.ant-layout-header{
  padding: 0 25px;
  background-image: linear-gradient(90deg,#09203f 0,#537895);
}
.logo {
  width: 120px;
  height: 45px;
  background: url('~@/assets/nav-logo.png') no-repeat;
  background-size: contain;
  margin: 8px 68px 0 0;
  float: left;
}

/* nav-右侧菜单布局 */
.right-menu {
  display: flex;
  justify-content: space-between;
}
.sys-menu, .sys-menu:hover {
  color: #fff;
}

/* 侧边栏样式 */
.left-sider {
  height: 100vh;
}
.ant-layout-sider, .ant-menu-dark {
  background: #09203f!important;
}
.ant-menu-dark .ant-menu-sub, .ant-menu-inline .ant-menu-sub {
  background: rgba(8,36,74,.6196078431372549)!important;
}

/* 内容区域 */
.content1 {
  margin-top: 20px;
}

</style>