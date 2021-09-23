<template>
  <div>

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
            icon="plus"
            @click="addIp"
            >
              添加IP段
            </a-button>
          </template>
          <!-- /操作 单元格 插槽 -->
        </a-table>
        <!-- /表格 -->
      </a-spin>
      <!-- /策略内容 -->

      <!-- 添加IP段-步骤条 -->
      <a-modal v-model="visibleAddIp" title="向策略添加IP段" @ok="handleOk" footer="">
        <div>
          <a-steps :current="current">
            <a-step title="选择IP段" />
            <a-step title="冲突检测" />
            <a-step title="添加完成" />
          </a-steps>
          <div class="steps-content">
            <!-- {{ steps[current].content }} -->

            <!-- 步骤一 -->
            <a-tabs default-active-key="1" @change="callback" v-if="current == 0">
              <a-tab-pane key="1" tab="选择客户IP段">
                <!-- 按客户添加 -->
                <a-form @submit="handleSubmit">
                  <a-form-item>
                    <a-input
                      v-decorator="['note', { rules: [{ required: true, message: 'Please input your note!' }] }]"
                      placeholder="客户名"
                      style="width: 400px; margin-left: 22px;" 
                    />
                  </a-form-item>
                  <a-form-item>
                    <!-- 表格 -->
                      <a-table
                        :columns="col"
                        :data-source="db"
                        :row-selection="rowSelection"
                        :expanded-row-keys.sync="expandedRowKeys"
                        :pagination="pagination"
                      />
                  </a-form-item>
                </a-form>
              </a-tab-pane>

                <a-tab-pane key="2" tab="手动输入IP段">
                  <a-textarea placeholder="1.1.1.0/24" :rows="5" style="width: 400px; margin-left:20px;"/>
                  <a-table
                    :columns="col"
                    :data-source="db"
                    :row-selection="rowSelection"
                    :expanded-row-keys.sync="expandedRowKeys"
                    :pagination="pagination"
                  />
              </a-tab-pane>
            </a-tabs>
            <!-- /步骤一 -->

            <!-- 步骤二 -->
             <a-table
              :columns="col2"
              :data-source="db2"
              :pagination="pagination"
              v-if="current == 1"
              :rowClassName="addIpTableRowClass"
             >
              <span slot="tags" slot-scope="actionScope,record">
                <a-button
                  type="link"
                  size="small"
                  icon="unlock"
                  :disabled="record.addState ? true : false"
                  @click="showConfirm"
                >
                  删除
                </a-button>
              </span>
            </a-table> 
            <!-- /步骤二 -->

            <!-- 步骤三 -->
            <div v-if="current == 2">
             <a-table
              :columns="col3"
              :data-source="db3"
              :pagination="pagination"
              v-if="current == 2"
              :rowClassName="addIpTableRowClass"
             >
             </a-table> 
            </div>
            <!-- /步骤三 -->

          </div>
          <div class="steps-action">
            <a-button v-if="current == 1" type="primary" @click="prev">
              上一步
            </a-button>
            <a-button v-if="current == 0" style="margin-left: 8px" type="primary" @click="next">
              下一步
            </a-button>
            <a-button v-if="current == 1" style="margin-left: 8px" type="primary" @click="next">
              提交
            </a-button>
            <a-button v-if="current == 2" style="margin-left: 8px" type="primary" @click="handleOk">
              完成
            </a-button>
          </div>
        </div>
      </a-modal>
      <!-- /添加IP段-步骤条 -->

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
    title: '通知邮箱',
    dataIndex: 'mails',
    key: 'mails',
  },
  {
    title: 'IP段数量',
    dataIndex: 'ips',
    key: 'ips',
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
    num: 1,
    policyName: '华北-BGP-10M触发-告警（测试）',
    policyNum: '101',
    status: 0,
    threshold: '5Mbps,1400Kpps',
    triggerAct: '牵引+封堵',
    timeFrame: 10,
    mails: '华北网络邮箱组',
    ips: 3,
    area: 'BJ'
  },
  {
    key: '2',
    num: 2,
    policyName: '华北-BGP-6G触发-牵引（小米）',
    policyNum: '105',
    status: 1,
    threshold: '2000Mbps,2800Kpps',
    triggerAct: '牵引+清洗，9308',
    timeFrame: 120,
    mails: '华北网络邮箱组',
    ips: 23,
    area: 'BJ'
  },
  {
    key: '3',
    num: 3,
    policyName: '华北-BGP-700M触发-牵引+清洗(付费)(新网数码)',
    policyNum: '113',
    status: 1,
    threshold: '1000Mbps,1400Kpps',
    triggerAct: '牵引+清洗，9308',
    timeFrame: 120,
    mails: '华北网络邮箱组',
    ips: 16,
    area: 'BJ'
  },
  {
    key: '4',
    num: 4,
    policyName: '华北-BGP-2G触发-牵引+清洗（大客户）',
    policyNum: '153',
    status: 1,
    threshold: '2000Mbps,2800Kpps',
    triggerAct: '牵引+清洗，9308',
    timeFrame: 120,
    mails: '华北网络邮箱组',
    ips: 31,
    area: 'BJ'
  },
  {
    key: '5',
    num: 5,
    policyName: '华北-BGP-2G触发-牵引+清洗（大客户）',
    policyNum: '153',
    status: 1,
    threshold: '2000Mbps,2800Kpps',
    triggerAct: '牵引+清洗，9308',
    timeFrame: 120,
    mails: '华北网络邮箱组',
    ips: 31,
    area: 'JK'
  },
  {
    key: '6',
    num: 6,
    policyName: '华北-BGP-2G触发-牵引+清洗（大客户）',
    policyNum: '153',
    status: 0,
    threshold: '2000Mbps,2800Kpps',
    triggerAct: '牵引+清洗，9308',
    timeFrame: 120,
    mails: '华北网络邮箱组',
    ips: 31,
    area: 'JK'
  },
  {
    key: '7',
    num: 7,
    policyName: '华北-BGP-2G触发-牵引+清洗（大客户）',
    policyNum: '153',
    status: 1,
    threshold: '2000Mbps,2800Kpps',
    triggerAct: '牵引+清洗，9308',
    timeFrame: 120,
    mails: '华北网络邮箱组',
    ips: 31,
    area: 'JK'
  },
]
const col = [
  {
    title: '客户名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'IP段',
    dataIndex: 'ip',
    key: 'ip',
  },
  ]

const db = [
  {
    name: '小米科技有限公司',
    ip: '58.83.161.0/24'
  }, 
  {
    name: '小米科技有限公司',
    ip: '58.83.162.0/24'
  },
]

const col2 = [
  {
    title: '客户名',
    dataIndex: 'uname',
    key: 'uname',
  },
  {
    title: 'IP段',
    dataIndex: 'ip',
    key: 'ip',
  },
  {
    title: '区域',
    dataIndex: 'area',
    key: 'area',
  },
  {
    title: '策略名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '策略顺序号',
    dataIndex: 'num',
    key: 'num',
  },
  {
    title: '启用状态',
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: '操作',
    dataIndex: 'tags',
    key: 'address 4',
    scopedSlots: { customRender: 'tags' },
  },
]

const db2 = [
  {
    uname: '小米科技有限公司',
    ip: '58.83.161.100/32',
    area: '北京',
    name: '华北-BGP-10M触发-告警（测试）',
    num: 5,
    state: '未启用',
    addState: 0
  }, 
  {
    uname: '小米科技有限公司',
    ip: '58.83.234.0/24',
    area: '北京',
    name: '华北-BGP-2G触发-牵引+封堵',
    num: 19,
    state: '启用',
    addState: 0
  }, 
  {
    uname: '小米科技有限公司',
    ip: '58.83.161.0/24',
    area: '北京',
    name: '华北-BGP-2G触发-牵引+封堵',
    num: 19,
    state: '启用',
    addState: 1
  }, 
  {
    uname: '',
    ip: '58.83.128.0/17',
    area: '北京',
    name: '华北-BGP-2G触发-牵引+封堵',
    num: 151,
    state: '启用',
    addState: 0
  }, 
]

const col3 = [
  {
    title: '客户名',
    dataIndex: 'uname',
    key: 'uname',
  },
  {
    title: 'IP段',
    dataIndex: 'ip',
    key: 'ip',
  },
  {
    title: '区域',
    dataIndex: 'area',
    key: 'area',
  },
  {
    title: '策略名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '策略顺序号',
    dataIndex: 'num',
    key: 'num',
  },
  {
    title: '启用状态',
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: '操作',
    dataIndex: 'tags',
    key: 'address 4',
    scopedSlots: { customRender: 'tags' },
  },
]

const db3 = [
  {
    uname: '小米科技有限公司',
    ip: '58.83.234.0/24',
    area: '北京',
    name: '华北-BGP-2G触发-牵引+封堵',
    num: 19,
    state: '启用',
    addState: 0
  }, 
  {
    uname: '小米科技有限公司',
    ip: '58.83.161.0/24',
    area: '北京',
    name: '华北-BGP-2G触发-牵引+封堵',
    num: 19,
    state: '启用',
    addState: 1
  }, 
  {
    uname: '',
    ip: '58.83.128.0/17',
    area: '北京',
    name: '华北-BGP-2G触发-牵引+封堵',
    num: 151,
    state: '启用',
    addState: 0
  }, 
]

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
}


export default {
  data () {
    return {
      data,
      columns,
      col,
      db,
      col2,
      db2,
      col3,
      db3,
      rowSelection,
      pagination: false, //隐藏分页项，隐藏页码
      dataSource: [],
      loadding: false,
      tableRowClass(record) {
        // 根据区域设置表格行底色，根据启用状态设置行文字颜色
        if (!record.status && record.area === 'JK') {
          return "rowClassRedBackGrey"
        } else if (!record.status && record.area === 'BJ'){
          return "rowClassRed"
        } else if (record.area === 'JK') {
          return "rowClassBackGrey"
        }
      },
      addIpTableRowClass(record) {
        if (!record.addState) {
          return "rowClassRed"
        }
      },
      labelCol: { span: 10 },
      wrapperCol: { span: 10 },
      form: {
        name: ''
      },
      visibleAddIp: false,
      current: 0,
      steps: [
        {
          title: '选择IP段',
          content: 'First-content',
        },
        {
          title: '冲突检测',
          content: 'Second-content',
        },
        {
          title: '完成',
          content: 'Last-content',
        },
      ],
    }
  },
  methods: {
    addIp() {
      this.visibleAddIp = true
    },
    handleOk(e) {
      console.log(e)
      this.visibleAddIp = false
      this.current = 0
    },
    next() {
      this.current++
    },
    prev() {
      this.current--
    },
  }
}
</script>

<style scoped>
/* 设置 添加IP段 宽度样式 */
/deep/ .ant-modal {
  width: 1200px!important;
}
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
}

.steps-action {
  margin-top: 24px;
  text-align: right;
}
/* 添加IP段-客户输入框样式 */
/deep/ .ant-row {
  margin-bottom: 0!important;
}
</style>