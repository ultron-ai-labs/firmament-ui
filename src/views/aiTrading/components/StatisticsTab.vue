<template>
  <div class="statistics-content">
    <!-- 顶部统计卡片 -->
          <el-row :gutter="20">
            <!-- 概览卡片 -->
            <el-col :span="6">
              <el-card class="overview-card" shadow="hover">
                <div class="overview-item">
                  <div class="overview-label"><b>剩余总金额(非滑点不去除佣金、不含浮动)</b></div>
                  <div class="overview-value">${{ dashboard.currentTotalAmount }}</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="overview-card" shadow="hover">
                <div class="overview-item">
                  <div class="overview-label"><b>总收益（非滑点不去除佣金、不含浮动）</b></div>
                  <div class="stat-value" :class="dashboard.totalProfit > 0 ? 'earnings-up' : 'earnings-down'">
                    ${{ dashboard.totalProfit > 0 ? '+' : '' }}{{ dashboard.totalProfit }}
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="overview-card" shadow="hover">
                <div class="overview-item">
                  <div class="overview-label"><b>总收益率（非滑点不去除佣金、不含浮动）</b></div>
                  <div class="stat-value" :class="dashboard.totalProfitRatio > 0 ? 'earnings-up' : 'earnings-down'">
                    {{ dashboard.totalProfitRatio > 0 ? '+' : '' }}{{ dashboard.totalProfitRatio }}%
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="overview-card" shadow="hover">
                <div class="overview-item">
                  <div class="overview-label"><b>滑点总收益（不去除佣金、不含浮动）</b></div>
                  <div class="stat-value" :class="dashboard.totalSlippageProfit > 0 ? 'earnings-up' : 'earnings-down'">
                    ${{ dashboard.totalSlippageProfit > 0 ? '+' : '' }}{{ dashboard.totalSlippageProfit }}
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <!-- 概览卡片 -->

            <el-col :span="6">
              <el-card class="overview-card" shadow="hover">
                <div class="overview-item">
                  <div class="overview-label"><b>滑点总收益率（不去除佣金、不含浮动）</b></div>
                  <div class="stat-value" :class="dashboard.totalSlippageProfitRatio > 0 ? 'earnings-up' : 'earnings-down'">
                    {{ dashboard.totalSlippageProfitRatio > 0 ? '+' : '' }}{{ dashboard.totalSlippageProfitRatio }}%
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="overview-card" shadow="hover">
                <div class="overview-item">
                  <div class="overview-label"><b>滑点收益差额（不去除佣金、不含浮动）</b></div>
                  <div class="stat-value" :class="dashboard.slippageProfitDifference > 0 ? 'earnings-up' : 'earnings-down'">
                    ${{ dashboard.slippageProfitDifference > 0 ? '+' : '' }}{{ dashboard.slippageProfitDifference }}
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="overview-card" shadow="hover">
                <div class="overview-item">
                  <div class="overview-label"><b>滑点差额收益率（不去除佣金、不含浮动）</b></div>
                  <div class="stat-value" :class="dashboard.slippageProfitDifferenceRatio > 0 ? 'earnings-up' : 'earnings-down'">
                    {{ dashboard.slippageProfitDifferenceRatio > 0 ? '+' : '' }}{{ dashboard.slippageProfitDifferenceRatio }}%
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="overview-card" shadow="hover">
                <div class="overview-item">
                  <div class="overview-label"><b>接近真实收益(率)</b></div>
                  <div class="stat-value" :class="dashboard.nearRealProfit > 0 ? 'earnings-up' : 'earnings-down'">
                    ${{ dashboard.nearRealProfit > 0 ? '+' : '' }}{{ dashboard.nearRealProfit }}( {{ dashboard.nearRealProfitRatio > 0 ? '+' : '' }}{{
                      dashboard.nearRealProfitRatio
                    }}%)
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>


    <!-- 运行模型列表 -->
    <el-card class="models-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>运行中的策略</span> ｜
        <el-button class="add-model-btn" type="primary" size="mini" @click="addRealTimeModel()">添加策略</el-button>
      </div>
      <el-table :data="runningModels" style="width: 100%" v-loading="loading">
        <el-table-column prop="strategyName" label="策略名称" width="180"/>
        <el-table-column prop="strategyState" label="策略状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="getStrategyStateType(scope.row.strategyState)">{{ getStrategyStateTypeState(scope.row.strategyState) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="modelId" label="模型ID" width="160">
          <template slot-scope="scope">
            <el-tag>{{ getModelName(scope.row.modelId) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="modelCategory" label="模型分类" width="120"/>
        <el-table-column prop="promptId" label="策略提示词" width="140">
          <template slot-scope="scope">
            <el-tag>{{ getPromptName(scope.row.promptStrategyId) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="exchange" label="交易所" width="120"/>
        <el-table-column prop="originalAmount" label="原始金额" width="120"/>
        <el-table-column prop="currentAmount" label="当前金额" width="120"/>
        <!--        <el-table-column prop="totalProfitAndLossRatio" label="总盈亏比" width="120">-->
        <!--          <template slot-scope="scope">-->
        <!--            <span :class="getProfitClass(scope.row.totalProfitAndLossRatio)">-->
        <!--              {{ (scope.row.totalProfitAndLossRatio || 0).toFixed(2) }}%-->
        <!--            </span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column prop="averageTime" label="平均耗时(ms)" width="140"/>-->
        <el-table-column prop="timeUnit" label="时间单位" width="100"/>
        <el-table-column prop="cryptocurrencies" label="加密货币" width="180">
          <template slot-scope="scope">
            <el-tag v-for="currency in (scope.row.cryptocurrencies || [])" :key="currency" size="mini" type="info" class="cryptocurrency-tag">
              {{ currency }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="$emit('view-details', scope.row)">详情</el-button>
            <el-button type="danger" v-if="scope.row.strategyState ==='running'" size="mini" @click="stopJob(scope.row)">停止</el-button>
            <el-button type="success" v-if="scope.row.strategyState ==='init' ||scope.row.strategyState ==='stop'" size="mini" @click="startJob(scope.row)">开始</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 收益趋势图 -->
    <!-- <el-card class="chart-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>总收益趋势</span>
      </div>
      <div class="chart-placeholder">
        <p>收益趋势图表将在此处显示</p>
      </div>
    </el-card> -->

    <el-dialog
      :visible.sync="dialogVisible"
      title="添加实时运行策略"
      width="700px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form ref="realTimeModelForm" :model="formData" :rules="formRules" label-width="150px">
        <!-- 基础信息 -->
        <el-form-item label="策略名称" prop="strategyName">
          <el-input v-model="formData.strategyName" placeholder="请输入策略名称"/>
        </el-form-item>

        <el-form-item label="策略状态" prop="strategyState">
          <el-select disabled v-model="formData.strategyState" placeholder="请选择策略状态">
            <el-option label="未开始" value="init"/>
            <!--            <el-option label="进行中" value="进行中" />-->
            <!--            <el-option label="暂停" value="暂停" />-->
            <!--            <el-option label="已完成" value="已完成" />-->
          </el-select>
        </el-form-item>

        <el-form-item label="策略关联模型ID" prop="modelId">
          <el-select v-model="formData.modelId" placeholder="请选择使用的模型">
            <el-option v-for="model in modelOptions" :key="model.modelId" :label="model.name" :value="model.modelId"/>
          </el-select>
        </el-form-item>

        <el-form-item label="模型分类" prop="modelCategory">
          <el-input v-model="formData.modelCategory" placeholder="请输入模型分类"/>
        </el-form-item>
        <el-form-item label="策略提示词" prop="promptStrategyId">
          <el-select v-model="formData.promptStrategyId" placeholder="请选择使用的提示词">
            <el-option v-for="model in promptOptions" :key="model.promptId" :label="model.name" :value="model.promptId"/>
          </el-select>
        </el-form-item>
        <!-- 金额信息 -->
        <el-form-item label="起始金额" prop="originalAmount">
          <el-input v-model.number="formData.originalAmount" type="number" placeholder="请输入原始金额" :min="0" step="0.0001"/>
        </el-form-item>

        <!-- 交易信息 -->
        <!--       TODO 此处后端暂时写死 -->
        <!--        <el-form-item label="提示词策略ID" prop="promptStrategyId">-->
        <!--          <el-input v-model="formData.promptStrategyId" placeholder="请输入提示词策略ID"/>-->
        <!--        </el-form-item>-->

        <el-form-item label="交易所" prop="exchange">
          <el-select v-model="formData.exchange" placeholder="请选择交易所">
            <el-option v-for="model in exchangeOptions" :key="model.value" :label="model.label" :value="model.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="加密货币" prop="cryptocurrencies">
          <el-select
            v-model="formData.cryptocurrencies"
            multiple
            placeholder="请选择加密货币"
            collapse-tags
          >
            <el-option v-for="currency in cryptocurrencyOptions" :key="currency.value" :label="currency.label" :value="currency.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="时间单位" prop="timeUnit">
          <el-select v-model="formData.timeUnit" placeholder="请选择时间单位">
            <el-option v-for="timeUnit in timeUnitOptions" :key="timeUnit.value" :label="timeUnit.label" :value="timeUnit.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="开单平仓报警ID" prop="alertId">
          <el-select v-model="formData.alertId" placeholder="请选择报警ID">
            <el-option v-for="alert in alertOptions" :key="alert.alertId" :label="alert.alertNameFull" :value="alert.alertId"/>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="submitForm" :loading="loading">提交</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import {currentAllModels} from "../../../api/model";
import {getAllPromptList} from "../../../api/prompt";
import {getAllAlertConfigList} from "../../../api/alert";
import {getCryptoList, getExchangeList, getTimeUnitList} from "../../../api/exchange";
import {addRealTimeModel, dashboard, getTaskStates, runningRealTimeStrategy, startRealTimeModel, stopRealTimeModel} from "../../../api/realTimeStrategy";

export default {
  name: 'StatisticsTab',
  props: {},
  data() {
    return {
      modelOptions: [],
      exchangeOptions: [],
      taskStates: [],
      timeUnitOptions: [],
      alertOptions: [],
      promptOptions: [],
      dialogVisible: false,
      // 加密货币选项
      cryptocurrencyOptions: [],
      runningModels: [],
      dashboard: {
        runningModel: 0,
        currentTotalAmount: 0,
        totalProfit: 0,
        totalProfitRatio: 0,
      },
      // 表单数据
      formData: {
        strategyName: '',
        strategyId: '',
        strategyState: 'init',
        modelId: '',
        modelCategory: '',
        originalAmount: 10000,
        currentAmount: 0,
        promptStrategyId: '',
        exchange: '',
        cryptocurrencies: [],
        timeUnit: '',
        alertId: '',
        promptId: '',
      },
      // 表单验证规则
      formRules: {
        strategyName: [{required: true, message: '请输入策略名称', trigger: 'blur'}],
        strategyState: [{required: true, message: '请选择策略状态', trigger: 'change'}],
        modelId: [{required: true, message: '请输入策略关联模型ID', trigger: 'blur'}],
        modelCategory: [{required: true, message: '请选择模型分类', trigger: 'blur'}],
        originalAmount: [
          {required: true, message: '请输入原始金额', trigger: 'blur'},
          {type: 'number', min: 0, message: '原始金额必须大于等于0', trigger: 'blur'}
        ],
        currentAmount: [
          {required: true, message: '请输入当前金额', trigger: 'blur'},
          {type: 'number', min: 0, message: '当前金额必须大于等于0', trigger: 'blur'}
        ],
        promptStrategyId: [{required: true, message: '请输入提示词策略ID', trigger: 'blur'}],
        exchange: [{required: true, message: '请输入交易所', trigger: 'blur'}],
        cryptocurrencies: [
          {required: true, message: '请选择至少一种加密货币', trigger: 'change'},
          {type: 'array', min: 1, message: '请选择至少一种加密货币', trigger: 'change'}
        ],
        timeUnit: [{required: true, message: '请选择时间单位', trigger: 'change'}],
        promptId: [{required: true, message: '请选择提示词', trigger: 'change'}],
      },
      // 加载状态
      loading: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      debugger
      this.modelOptions = await currentAllModels().then(response => response.data)
      this.exchangeOptions = await getExchangeList().data
      this.taskStates = await getTaskStates()
      this.cryptocurrencyOptions = await getCryptoList("binance").data
      this.timeUnitOptions = await getTimeUnitList().data
      this.alertOptions = await getAllAlertConfigList().then(response => response.data)
      this.promptOptions = await getAllPromptList().then(response => response.data)

      debugger
      for (let i = 0; i < this.alertOptions.length; i++) {
        this.alertOptions[i].alertNameFull = this.alertOptions[i].alertName + "(" + this.alertOptions[i].alertType + ")"
      }

      this.runningModels = await runningRealTimeStrategy().then(response => response.data)
      await this.fetchDashboard()
    },
    /**
     * 添加实时模型
     */
    addRealTimeModel() {
      this.dialogVisible = true
    },
    getModelName(modelId) {
      debugger
      return this.modelOptions.find(model => model.modelId === modelId).name;
    },
    getPromptName(promptId) {
      debugger
      if (!promptId) {
        return ''
      }
      return this.promptOptions.find(prompt => prompt.promptId === promptId).name;
    },
    /**
     * 获取仪表盘数据
     */
    async fetchDashboard() {
      debugger
      this.dashboard = await dashboard().then(response => response.data)
    },
    // 提交表单
    async submitForm() {
      this.$refs.realTimeModelForm.validate((valid) => {
        if (valid) {
          this.loading = true
          addRealTimeModel(this.formData)
            .then(response => {
              if (response.code === 200) {
                this.$message.success('模型添加成功')
                this.dialogVisible = false
                // 重新查询
                this.runningModels = []
                runningRealTimeStrategy().then(response => {
                  this.runningModels = response.data
                })
              } else {
                this.$message.error(response.msg || '模型添加失败')
              }
            })
            .catch(error => {
              this.$message.error('请求失败，请稍后重试')
              console.error('添加实时运行模型失败:', error)
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })

    },

    // 重置表单数据
    resetFormData() {
      if (this.$refs.realTimeModelForm) {
        this.$refs.realTimeModelForm.resetFields()
      }
      this.formData = {
        strategyName: '',
        strategyId: '',
        strategyState: 'init',
        modelId: '',
        modelCategory: '',
        originalAmount: 10000,
        currentAmount: 0,
        promptStrategyId: '',
        exchange: '',
        cryptocurrencies: [],
        timeUnit: '',
        alertId: '',
        promptId: ''
      }
    },

    // 处理对话框关闭
    handleClose() {
      this.resetFormData()
      this.dialogVisible = false
      this.$emit('close')
    },
    async startJob(row) {
      await startRealTimeModel(row)
      // 重新查询
      this.runningModels = []
      await runningRealTimeStrategy().then(response => {
        this.runningModels = response.data
        this.$message.success('任务启动成功')
        this.$forceUpdate()
      })
    },
    async stopJob(row) {
      await stopRealTimeModel(row)
      this.runningModels = []
      await runningRealTimeStrategy().then(response => {
        debugger
        this.runningModels = response.data
        this.$message.success('任务停止成功')
        this.$forceUpdate()
      })
    },
    // 根据策略状态获取标签类型
    getStrategyStateType(state) {
      const statusMap = {
        '未开始': 'init',
        '进行中': 'running',
        '已暂停': 'stop'
      }
      return statusMap[state] || 'default'
    },
    getStrategyStateTypeState(state) {
      return this.taskStates.find(taskState => taskState.value === state).label
    },
    // 根据盈亏比获取样式类
    getProfitClass(ratio) {
      if (!ratio) return ''
      return ratio > 0 ? 'earnings-down' : ratio < 0 ? 'earnings-up' : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.statistics-content {
  .overview-card {
    .overview-item {
      text-align: center;
      padding: 10px 0;

      .overview-label {
        font-size: 14px;
        color: #606266;
        margin-bottom: 10px;
      }

      .overview-value {
        font-size: 24px;
        font-weight: 600;
        color: #303133;
      }
    }
  }

  .models-card {
    margin-top: 20px;

    ::v-deep .el-table .el-button {
      padding: 4px 8px;
      font-size: 12px;
      margin-right: 5px;
    }

    .cryptocurrency-tag {
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }

  .chart-card {
    margin-top: 20px;

    .chart-placeholder {
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f7fa;
      color: #909399;
      border-radius: 4px;
    }
  }

  .earnings-up {
    color: #13ce66;
  }

  .earnings-down {
    color: #ff4949;
  }
}
</style>
