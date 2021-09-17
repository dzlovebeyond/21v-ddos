<template>
  <div>
      <a-layout class="common-content">
        <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }">
          <!-- 标题 -->
          <div class="common-title">DDOS监控</div>
          <a-divider  />
          <!-- /标题 -->

          <!-- 搜索栏 -->
          <div class="common-search-content">
              <a-auto-complete
                v-model="value"
                :data-source="dataSource"
                style="width: 200px"
                placeholder="所属客户"
                @select="onSelect"
                @search="onSearch"
                @change="onChange"
                allowClear
                :dropdownMatchSelectWidth='false'
              />
              <a-input placeholder="IP地址 或 地址段" allowClear style="margin-left:20px; width:200px;" />
              <a-range-picker @change="onChange" style="margin-left: 20px;" />
              <a-button type="primary" style="margin-left: 20px;" icon="search">
                搜索
              </a-button>
              <a-button class="btnDownload" type="primary" style="margin-left: 20px;" icon="download">
                导出
              </a-button>
          </div>
          <!-- /搜索栏 -->

          <!-- 内容 -->
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
              <template slot="action" slot-scope="actionScope,record">
                <a-button
                type="link"
                size="small"
                icon="unlock"
                :disabled="record.status ? true : false"
                @click="unbind"
                >
                  解除
                </a-button>
                <!-- <a-divider type="vertical" /> -->
                <a-button
                type="link"
                size="small"
                icon="clock-circle"
                :disabled="record.status ? true : false"
                @click="postponed"
                >
                  延期
                </a-button>
                <!-- <a-divider type="vertical" /> -->
                <a-button
                type="link"
                size="small"
                icon="download"
                @click="download"
                >
                  详情
                </a-button>
              </template>
              <!-- /操作 单元格 插槽 -->
            </a-table>
            <!-- /表格 -->
          </a-spin>
          <!-- /内容 -->
        </a-layout-content>
      </a-layout>

      <!-- 弹出面板 -->
      <a-modal v-model="visiblePostponed" title="延期" @ok="handleOk">
        <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="请输入延长时间（小时）：">
            <a-input v-model="form.name" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- /弹出面板 -->
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
    title: '客户',
    dataIndex: 'customerName',
    key: 'customerName',
    width: 150
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    key: 'ip',
    width: 150
  },
  {
    title: '策略名',
    dataIndex: 'policyName',
    key: 'policyName',
    width: 150
  },
  {
    title: '触发信息',
    dataIndex: 'triggerInfo',
    key: 'triggerInfo',
    width: 150
  },
  {
    title: '触发动作',
    dataIndex: 'triggerAct',
    key: 'triggerAct',
    width: 150
  },
  {
    title: '触发时间',
    dataIndex: 'triggerTime',
    key: 'triggerTime',
    width: 150
  },
  {
    title: '剩余时间',
    dataIndex: 'remainingTime',
    key: 'remainingTime',
    width: 100
  },
  {
    title: '结束时间',
    dataIndex: 'terminalTime',
    key: 'terminalTime',
    width: 150
  },
  {
    title: '状态详情',
    dataIndex: 'stateDetails',
    key: 'stateDetails',
    width: 300
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 80,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  },
]
const data = [
  {
    key: '1',
    area: '北京',
    customerName: '小米科技有限公司',
    ip: '58.83.161.255',
    policyName: '华北-BGP-6G触发-牵引（小米）',
    triggerInfo: `流量: 7.74Gbps
                  包率: 1.63Mpps
                  [NTP Reply Flood]
                  [IP Fragment]
                  [UDP Flood]`,
    triggerAct: '牵引+清洗,9308',
    triggerTime: '2021-09-14 11:07:15',
    remainingTime: 110,
    terminalTime: '',
    stateDetails: `2021-09-14 11:07:17 牵引+清洗:启动(自动)
                  2021-09-14 11:07:16 9308:启动(自动)`,
    status: 0
  },
  {
    key: '2',
    area: '经开',
    customerName: '北京新网数码信息技术有限公司',
    ip: '120.133.2.42',
    policyName: '华北-BGP-700M触发-牵引+清洗(付费)(新网数码)',
    triggerInfo: `流量: 1.01Gbps
                  包率: 87.69Kpps`,
    triggerAct: '牵引+清洗,9308',
    triggerTime: '2021-09-02 17:39:25',
    remainingTime: 0,
    terminalTime: '2021-09-02 19:39:25',
    stateDetails: `2021-09-02 17:39:27 牵引+清洗:启动(自动)
                  2021-09-02 19:40:03 牵引+清洗:停止(自动)
                  2021-09-02 17:39:27 9308:启动(自动)
                  2021-09-02 19:40:04 9308:停止(自动)`,
    status: 1
  },
  {
    key: '3',
    area: '北京',
    customerName: '赛尔新技术（北京）有限公司',
    ip: '211.151.240.41',
    policyName: '华北-BGP-900M触发-牵引+清洗（赛尔）',
    triggerInfo: `流量: 1.33Gbps
                包率: 573.34Kpps
                [SYN Flood]
                [SSDP Reply Flood]
                [UDP Flood]`,
    triggerAct: '牵引+清洗,9308',
    triggerTime: '2021-09-02 09:38:20',
    remainingTime: 0,
    terminalTime: '2021-09-02 10:27:45',
    stateDetails: `2021-09-02 09:38:22 牵引+清洗:启动(自动)
                  2021-09-02 10:27:44 牵引+清洗:停止(手动)
                  2021-09-02 09:38:21 9308:启动(自动)
                  2021-09-02 10:27:45 9308:停止(手动)`,
    status: 1
  },
]



export default {
  data () {
    return {
      value: '',
      dataSource: [],
      dataList: ['小米科技有限公司', '京东尚科股份有限公司', '北京深演科技有限公司', '小米股份有限公司'],
      loadding: false,
      data,
      columns,
      tableRowClass(record) {
        // 如果没有攻击时间，表示攻击没有结束，文字标红
        if (!record.status) {
          return "rowClass"
        }
      },
      visiblePostponed: false,
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
      console.log('onSelect', value);
    },
    onChange(value) {
      console.log('onChange', value);
    },
    // 解除
    unbind() {
      this.$confirm({
        title: "确认解除？",
        onOk() {},
        onCancel() {}
      })
    },
    // 延期
    postponed() {
      this.visiblePostponed = true
    },
    handleOk(e) {
      console.log(e)
      this.visiblePostponed = false
    },
    // 详情-下载
    download() {
      // window.location.href = "../../assets/trigger.csv"
      window.open('../../assets/trigger.csv')
    }
  },


}
</script>

<style>

</style>