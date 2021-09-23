<template>
  <div>
      <a-layout class="common-content">
        <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }">
          <!-- 标题 -->
          <div class="common-title">策略管理</div>
          <a-divider  />
          <!-- /标题 -->

          <!-- 搜索栏 -->
          <div class="common-search-content">
                  <a-select v-model="form.region" placeholder="所属区域" style="width: 150px" allowClear>
                    <a-select-option value="BeiJing">
                      北京
                    </a-select-option>
                    <a-select-option value="JingKai">
                      经开
                    </a-select-option>
                  </a-select>
              <a-auto-complete
                v-model="value"
                :data-source="dataSource"
                style="margin-left:20px; width: 200px"
                placeholder="所属客户"
                @select="onSelect"
                @search="onSearch"
                @change="onChange"
                allowClear
                :dropdownMatchSelectWidth='false'
              />
              <a-input placeholder="IP地址 或 地址段" allowClear style="margin-left:20px; width:200px;" />
              <a-input placeholder="策略名" allowClear style="margin-left:20px; width:200px;" />
              <a-button type="primary" style="margin-left: 20px;" icon="search" @click="searchBtn">
                搜索
              </a-button>
              <a-button class="btnDownload" type="primary" style="margin-left: 20px;" icon="download">
                导出
              </a-button>
          </div>
          <!-- /搜索栏 -->

          <!-- 三级路由 -->
          <router-view></router-view>
          <!-- /三级路由 -->
        </a-layout-content>
      </a-layout>

  </div>
</template>

<script>




export default {
  data () {
    return {
      value: '',
      dataSource: [],
      dataList: ['小米科技有限公司', '京东尚科股份有限公司', '北京深演科技有限公司', '小米股份有限公司'],
      loadding: false,
      tableRowClass(record) {
        // 如果没有攻击时间，表示攻击没有结束，文字标红
        if (!record.status && record.area === 'JK') {
          return "rowClassRedBackGrey"
        } else if (!record.status && record.area === 'BJ'){
          return "rowClassRed"
        } else if (record.area === 'JK') {
          return "rowClassBackGrey"
        }
      },
      visiblePostponed: false,
      visiblePolicyTable: true,
      labelCol: { span: 10 },
      wrapperCol: { span: 10 },
      form: {
        name: ''
      },
    }
  },
  watch: {
    value(val) {
      console.log('value', val);
    },
  },
  methods: {
    onSearch(searchText) {
      this.dataSource = [] //每次加载时清除历史数据
      // 根据输入的字符匹配客户名称，提供下拉列表
      if(searchText != '') {
        for (const x in this.dataList){ //循环客户列表与输入内容进行匹配
          const text = this.dataList[x] //临时存储当前客户名
          if (text.indexOf(searchText) != -1){ //如果当前客户名包含输入内容，则追加到 dataSource 列表中
            this.dataSource.unshift(this.dataList[x])
          }
        }
      }
    },
    onSelect(value) {
      console.log('onSelect', value)
    },
    onChange(value) {
      console.log('onChange', value)
    },
    searchBtn() {
      this.$router.push('/policy_mgt/policy_detail')
    }
  },


}
</script>

<style>

</style>