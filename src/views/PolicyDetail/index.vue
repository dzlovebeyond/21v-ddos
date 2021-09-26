<template>
  <div>
      <a-layout class="common-content">
        <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }">
          <!-- 标题 -->
          <div class="common-title">策略详情</div>
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
              <a-button type="primary" style="margin-left: 20px;" icon="search">
                搜索
              </a-button>
              <a-button class="btnDownload" type="primary" style="margin-left: 20px;" icon="download">
                导出
              </a-button>
          </div>
          <!-- /搜索栏 -->

          <!-- 策略内容 -->
          <a-spin tip="数据正在加载中..." :spinning="loadding">
            <!-- 表格 -->
            <a-table
            :columns="columns"
            :data-source="data"
            size="middle" 
            :scroll="{ x: 1300}" 
            :rowClassName="tableRowClass"
            >
            <!-- 操作 单元格 插槽 -->
            <template slot="status" slot-scope="actionScope,record">
                <span>{{ record.status ? "启用" : "未启用" }}</span>
            </template>

            <template slot="action" slot-scope="actionScope,record">
                <!-- <a-divider type="vertical" /> -->
                <a-button
                type="link"
                size="small"
                icon="delete"
                @click="del"
                >
                删除
                </a-button>
            </template>
            <!-- /操作 单元格 插槽 -->
            </a-table>
            <!-- /表格 -->
          </a-spin>
          <!-- /策略内容 -->

        </a-layout-content>
      </a-layout>

  </div>
</template>

<script>
// 表格数据
const columns = [
  {
    title: '区域',
    dataIndex: 'area',
    key: 'area',
    width: 50
  },
  {
    title: '客户名',
    dataIndex: 'customerName',
    key: 'customerName',
    width: 200
  },
  {
    title: 'IP地址段',
    dataIndex: 'ip',
    key: 'ip',
    width: 150
  },
  {
    title: '策略名',
    dataIndex: 'policyName',
    key: 'policyName',
    width: 300
  },
  {
    title: '策略顺序号',
    dataIndex: 'policyNum',
    key: 'policyNum',
  },
  {
    title: '启用状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '阈值',
    dataIndex: 'threshold',
    key: 'threshold',
  },
  {
    title: '动作',
    dataIndex: 'triggerAct',
    key: 'triggerAct',
  },
  {
    title: '持续时间',
    dataIndex: 'timeFrame',
    key: 'timeFrame',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 100,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  },
]
const data = [
  {
    key: '1',
    customerName: '网络部管理地址',
    ip: '211.151.207.1/32',
    policyName: '华北-BGP-10M触发-告警（测试）',
    policyNum: '101',
    status: 0,
    threshold: '5Mbps,1400Kpps',
    triggerAct: '牵引+封堵',
    timeFrame: 10,
    area: 'BJ'
  },
  {
    key: '2',
    customerName: '北京新网数码信息技术有限公司',
    ip: '120.133.2.40/29',
    policyName: '华北-BGP-700M触发-牵引+清洗(付费)(新网数码)',
    policyNum: '123',
    status: 1,
    threshold: '1000Mbps,1400Kpps',
    triggerAct: '牵引+清洗，9308',
    timeFrame: 120,
    area: 'BJ'
  },
  {
    key: '3',
    customerName: '北京新网数码信息技术有限公司',
    ip: '120.133.2.56/29',
    policyName: '华北-BGP-700M触发-牵引+清洗(付费)(新网数码)',
    policyNum: '123',
    status: 1,
    threshold: '1000Mbps,1400Kpps',
    triggerAct: '牵引+清洗，9308',
    timeFrame: 120,
    area: 'BJ'
  },
  {
    key: '4',
    customerName: '中建材国际贸易有限公司',
    ip: '211.151.17.64/26',
    policyName: '华北-BGP-2G触发-牵引+清洗（DDOS-10G付费客户）',
    policyNum: '133',
    status: 1,
    threshold: '2000Mbps,2800Kpps',
    triggerAct: '牵引+清洗，9308',
    timeFrame: 120,
    area: 'BJ'
  },
  {
    key: '5',
    customerName: '',
    ip: '58.83.128.0/17',
    policyName: '华北-BGP-2G触发-牵引+封堵',
    policyNum: '151',
    status: 1,
    threshold: '2000Mbps,2800Kpps',
    triggerAct: '牵引+封堵',
    timeFrame: 1440,
    area: 'BJ'
  },
  {
    key: '6',
    customerName: '',
    ip: '59.151.0.0/17',
    policyName: '华北-BGP-2G触发-牵引+封堵',
    policyNum: '151',
    status: 1,
    threshold: '2000Mbps,2800Kpps',
    triggerAct: '牵引+封堵',
    timeFrame: 1440,
    area: 'BJ'
  },
  {
    key: '7',
    customerName: '',
    ip: '211.151.0.0/16',
    policyName: '华北-BGP-2G触发-牵引+封堵',
    policyNum: '151',
    status: 1,
    threshold: '2000Mbps,2800Kpps',
    triggerAct: '牵引+封堵',
    timeFrame: 1440,
    area: 'BJ'
  },
  {
    key: '8',
    customerName: '',
    ip: '1.1.1.0/24',
    policyName: '华北-JKCT-5M-JK68封堵（JK）---测试',
    policyNum: '35',
    status: 0,
    threshold: '5Mbps,1400Kpps',
    triggerAct: '超10G封堵',
    timeFrame: 10,
    area: 'JK'
  },
  {
    key: '9',
    customerName: '百融云创科技股份有限公司',
    ip: '59.151.71.0/24',
    policyName: '华北-BGP-10G触发-云堤清洗（JK）',
    policyNum: '56',
    status: 1,
    threshold: '10000Mbps,9000Kpps',
    triggerAct: '云堤清洗',
    timeFrame: 1380,
    area: 'JK'
  },
  {
    key: '10',
    customerName: '',
    ip: '58.83.128.0/17',
    policyName: '华北-BGP-10G触发-封堵（JK）',
    policyNum: '89',
    status: 1,
    threshold: '10000Mbps,9000Kpps',
    triggerAct: '超10G封堵',
    timeFrame: 10,
    area: 'JK'
  },
]

export default {
  data () {
    return {
      columns,
      data,
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
    // 删除
    del() {
      this.$confirm({
        title: "确认删除？",
        onOk() {},
        onCancel() {}
      })
    },
  },


}
</script>

<style>

</style>