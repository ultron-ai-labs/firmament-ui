<template>
  <div class="ai-trading-container">
    <!-- 实时AI交易内部标签页 -->
    <div class="ai-trading-tabs">

      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="统计数据" name="statistics"></el-tab-pane>
        <!--        <el-tab-pane label="添加模型" name="addModel"></el-tab-pane>-->
        <el-tab-pane label="策略运行详情" name="details"></el-tab-pane>
        <el-tab-pane label="模型运行日志" name="logs"></el-tab-pane>
      </el-tabs>
    </div>

    <div class="tab-content">
      <!-- 统计数据内容 -->
      <div v-show="activeTab === 'statistics'">
        <statistics-tab
          :running-models="runningModels"
          :running-models-count="runningModelsCount"
          :total-trades="totalTrades"
          :today-earnings="todayEarnings"
          :total-earnings="totalEarnings"
          @view-details="viewModelDetails"
          @stop-model="stopModel"
        />
      </div>

      <!-- 添加模型内容 -->
      <div v-show="activeTab === 'addModel'">
        <add-model-tab
          :model-data="newModel"
          @submit="handleModelSubmit"
          @reset="handleModelReset"
        />
      </div>

      <!-- 策略运行详情内容 -->
      <div v-show="activeTab === 'details'">
        <model-details-tab
          :running-models="runningModels"
          :selected-model-id="selectedModelId"
        />
      </div>

      <!-- 模型运行日志内容 -->
      <div v-show="activeTab === 'logs'">
        <logs-tab
          :running-models="runningModels"
          :selected-model-id="selectedModelId"
          :model-logs="modelLogs"
          @clear-logs="clearLogs"
        />
      </div>


    </div>
  </div>
</template>

<script>
import StatisticsTab from './components/StatisticsTab.vue'
import AddModelTab from './components/AddModelTab.vue'
import LogsTab from './components/LogsTab.vue'
import ModelDetailsTab from './components/ModelDetailsTab.vue'

export default {
  components: {
    StatisticsTab,
    AddModelTab,
    LogsTab,
    ModelDetailsTab
  },
  name: 'AiTrading',
  data() {
    return {
      activeTab: 'statistics',
      // 运行中模型数据
      runningModels: [],
      // 统计数据
      runningModelsCount: 0,
      totalTrades: 0,
      todayEarnings: 0,
      totalEarnings: 0,
      // 新模型表单
      newModel: {
        name: '',
        type: '',
        pair: '',
        initialCapital: 0,
        riskLevel: 3,
        parameters: ''
      },

      // 日志相关
      selectedModelId: '',
      modelLogs: [],

      // 实时运行模型对话框
      realTimeModelDialogVisible: false
    }
  },
  created() {
    this.loadMockData()
  },
  methods: {
    // 处理tab切换
    handleTabClick(tab) {
      console.log('切换到标签页:', tab.name)
      // 可以在这里加载对应tab的数据
      if (tab.name === 'statistics') {
        this.loadMockData()
      }
    },

    // 加载模拟数据
    loadMockData() {
      // 模拟运行中模型数据
      this.runningModels = [
        {
          id: '1',
          name: 'BTC突破策略v1.2',
          type: 'MACD策略',
          status: '运行中',
          profitRate: 12.5,
          runningTime: '2024-07-01 08:30:00',
          trades: 45
        },
        {
          id: '2',
          name: 'ETH趋势跟踪',
          type: 'RSI策略',
          status: '运行中',
          profitRate: 8.3,
          runningTime: '2024-06-28 14:20:00',
          trades: 32
        },
        {
          id: '3',
          name: '波动率套利',
          type: '布林带策略',
          status: '运行中',
          profitRate: -2.1,
          runningTime: '2024-07-02 10:15:00',
          trades: 18
        }
      ]

      // 更新统计数据
      this.runningModelsCount = this.runningModels.length
      this.totalTrades = this.runningModels.reduce((sum, model) => sum + model.trades, 0)
      this.todayEarnings = 5.2
      this.totalEarnings = 18.7
    },

    // 查看模型详情
    viewModelDetails(model) {
      this.selectedModelId = model.id
      this.activeTab = 'details'
    },

    // 停止模型
    stopModel(model) {
      this.$confirm(`确定要停止模型${model.name}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟停止操作
        model.status = '已停止'
        this.$message({type: 'success', message: '模型已停止'})
      }).catch(() => {
        this.$message({type: 'info', message: '已取消停止操作'})
      })
    },

    // 处理模型提交
    handleModelSubmit() {
      this.$message({type: 'success', message: '模型添加成功'})
      this.handleModelReset()
    },

    // 处理模型表单重置
    handleModelReset() {
      this.newModel = {
        name: '',
        type: '',
        pair: '',
        initialCapital: 0,
        riskLevel: 3,
        parameters: ''
      }
    },

    // 显示添加实时运行模型对话框
    showAddRealTimeModelDialog() {
      this.realTimeModelDialogVisible = true
    },

    // 处理实时运行模型添加成功
    handleRealTimeModelAdded(modelData) {
      console.log('实时运行模型添加成功:', modelData)
      this.$message({type: 'success', message: '实时运行模型添加成功'})
      // 可以在这里触发刷新相关列表等操作
      this.loadMockData() // 刷新数据
    },

    // 处理对话框关闭
    handleDialogClose() {
      this.realTimeModelDialogVisible = false
    },

    // 清空日志
    clearLogs() {
      this.modelLogs = []
    }
  },
  watch: {
    // 监听模型选择变化，加载对应的日志
    selectedModelId(newVal) {
      if (newVal) {
        // 模拟加载日志数据
        this.modelLogs = [
          {
            timestamp: '2024-07-03 14:30:22',
            type: 'info',
            message: '模型启动成功'
          },
          {
            timestamp: '2024-07-03 14:31:15',
            type: 'info',
            message: '开始数据分析...'
          },
          {
            timestamp: '2024-07-03 14:32:01',
            type: 'warning',
            message: '检测到市场波动异常'
          },
          {
            timestamp: '2024-07-03 14:33:45',
            type: 'info',
            message: '执行买入操作：BTC/USDT 0.02 BTC'
          },
          {
            timestamp: '2024-07-03 14:35:20',
            type: 'info',
            message: '订单执行成功，当前持仓：0.02 BTC'
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ai-trading-container {
  padding: 20px;

  // 固定标签页样式，与个人中心保持一致
  .ai-trading-tabs {
    position: sticky;
    top: 0;
    z-index: 100;
    background: #ffffff;
    margin: -20px -20px 20px -20px;
    padding: 20px 20px 0 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .action-buttons {
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-start;
    }

    ::v-deep .el-tabs__header {
      margin-bottom: 0;
    }
  }

  .tab-content {
    // 统计数据页面样式
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

    // 添加模型页面样式
    .add-model-card {
      .el-form {
        margin-top: 20px;
      }

      .el-form-item {
        margin-bottom: 25px;
      }
    }

    // 日志页面样式
    .logs-card {
      .log-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #ebeef5;
      }

      .log-content {
        max-height: 400px;
        overflow-y: auto;
        padding: 10px;
        background-color: #f5f7fa;
        border-radius: 4px;
      }

      .log-item {
        padding: 8px 0;
        border-bottom: 1px solid #ebeef5;

        &:last-child {
          border-bottom: none;
        }

        .log-time {
          color: #909399;
          font-size: 12px;
          margin-right: 10px;
        }

        .log-message {
          color: #303133;
        }
      }

      .log-error {
        .log-message {
          color: #f56c6c;
        }
      }

      .log-warning {
        .log-message {
          color: #e6a23c;
        }
      }

      .no-selection {
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #909399;
      }
    }
  }


}
</style>
