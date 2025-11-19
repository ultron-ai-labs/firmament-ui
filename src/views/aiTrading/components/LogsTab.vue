<template>
  <div class="logs-content">
    <el-card class="logs-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>策略选择 </span>
        <el-select v-model="selectedModelId" placeholder="选择策略查看日志">
          <el-option v-for="model in runningStrategies" :key="model.id" :label="model.name" :value="model.id"/>
        </el-select>
      </div>
      <div v-if="selectedModelId" class="log-container">
        <div class="log-header">
          <span>策略：{{ getSelectedModelName() }}</span>
          <el-button size="mini" @click="$emit('clear-logs')">清空日志</el-button>
        </div>
        <div class="log-content">
          <div v-for="(log, index) in strategyLogs" :key="index" class="log-item" :class="getLogClass(log.type)">
            <span class="log-time">{{ log.timestamp }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
      </div>
      <div v-else class="no-selection">
        <p>请选择一个策略查看运行日志</p>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'LogsTab',
  data() {
    return {
      runningStrategies: [],
      selectedModelId: '',
      strategyLogs: []
    }
  },
  methods: {
    // 获取选中模型名称
    getSelectedModelName() {
      const model = this.runningModels.find(m => m.id === this.selectedModelId)
      return model ? model.name : ''
    },

    // 获取日志样式类
    getLogClass(type) {
      switch (type) {
        case 'error':
          return 'log-error'
        case 'warning':
          return 'log-warning'
        case 'info':
        default:
          return 'log-info'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.logs-content {
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
</style>
