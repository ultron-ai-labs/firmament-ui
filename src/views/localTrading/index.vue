<template>
  <div class="local-trading-container">
    <!-- 概览卡片 -->
    <el-row :gutter="20" class="overview-section">
      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card shadow="hover" class="overview-card">
          <div class="overview-item">
            <div class="overview-label">运行中策略</div>
            <div class="overview-value">{{ runningStrategiesCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card shadow="hover" class="overview-card">
          <div class="overview-item">
            <div class="overview-label">今日交易次数</div>
            <div class="overview-value">{{ todayTradesCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card shadow="hover" class="overview-card">
          <div class="overview-item">
            <div class="overview-label">今日收益</div>
            <div class="overview-value" :class="{ positive: todayEarnings >= 0, negative: todayEarnings < 0 }">
              {{ todayEarnings > 0 ? '+' : '' }}{{ todayEarnings }}%
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card shadow="hover" class="overview-card">
          <div class="overview-item">
            <div class="overview-label">总收益率</div>
            <div class="overview-value" :class="{ positive: totalProfitRate >= 0, negative: totalProfitRate < 0 }">
              {{ totalProfitRate > 0 ? '+' : '' }}{{ totalProfitRate }}%
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 本地策略列表 -->
    <el-card shadow="hover" class="strategies-card">
      <div class="section-header">
        <h3>本地策略列表</h3>
        <el-button type="primary" @click="showAddStrategyDialog">添加策略</el-button>
      </div>

      <el-table :data="strategiesList" style="width: 100%">
        <el-table-column prop="name" label="策略名称" width="180"></el-table-column>
        <el-table-column prop="type" label="策略类型" width="120"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === '运行中' ? 'success' : 'info'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tradingPair" label="交易对" width="120"></el-table-column>
        <el-table-column prop="lastTradeTime" label="最近交易时间" width="180"></el-table-column>
        <el-table-column prop="profitRate" label="收益率" width="100">
          <template slot-scope="scope">
            <span :class="{ positive: scope.row.profitRate >= 0, negative: scope.row.profitRate < 0 }">
              {{ scope.row.profitRate > 0 ? '+' : '' }}{{ scope.row.profitRate }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="toggleStrategyStatus(scope.row)" :disabled="scope.row.status === '运行中'">
              {{ scope.row.status === '运行中' ? '运行中' : '启动' }}
            </el-button>
            <el-button size="small" type="danger" @click="stopStrategy(scope.row)" :disabled="scope.row.status === '已停止'">
              停止
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 最新交易历史 -->
    <el-card shadow="hover" class="trades-card">
      <div class="section-header">
        <h3>最新交易历史</h3>
      </div>

      <el-table :data="tradeHistory" style="width: 100%">
        <el-table-column prop="timestamp" label="交易时间" width="180"></el-table-column>
        <el-table-column prop="strategyName" label="策略名称" width="150"></el-table-column>
        <el-table-column prop="tradingPair" label="交易对" width="100"></el-table-column>
        <el-table-column prop="type" label="类型" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.type === '买入' ? 'success' : 'danger'">
              {{ scope.row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100"></el-table-column>
        <el-table-column prop="quantity" label="数量" width="100"></el-table-column>
        <el-table-column prop="fee" label="手续费" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === '成功' ? 'success' : 'warning'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加策略对话框 -->
    <el-dialog
      title="添加本地策略"
      :visible.sync="addStrategyDialogVisible"
      width="50%
    ">
      <el-form :model="newStrategyForm" :rules="rules" ref="newStrategyForm">
        <el-form-item label="策略名称" prop="name">
          <el-input v-model="newStrategyForm.name" placeholder="请输入策略名称"></el-input>
        </el-form-item>
        <el-form-item label="策略类型" prop="type">
          <el-select v-model="newStrategyForm.type" placeholder="请选择策略类型">
            <el-option label="MACD策略" value="MACD策略"></el-option>
            <el-option label="RSI策略" value="RSI策略"></el-option>
            <el-option label="布林带策略" value="布林带策略"></el-option>
            <el-option label="自定义策略" value="自定义策略"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易对" prop="tradingPair">
          <el-select v-model="newStrategyForm.tradingPair" placeholder="请选择交易对">
            <el-option label="BTC/USDT" value="BTC/USDT"></el-option>
            <el-option label="ETH/USDT" value="ETH/USDT"></el-option>
            <el-option label="SOL/USDT" value="SOL/USDT"></el-option>
            <el-option label="BNB/USDT" value="BNB/USDT"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Java类路径" prop="javaClassPath">
          <el-input v-model="newStrategyForm.javaClassPath" placeholder="请输入Java类完整路径"></el-input>
        </el-form-item>
        <el-form-item label="初始资金" prop="initialCapital">
          <el-input-number v-model="newStrategyForm.initialCapital" :min="100" :max="1000000" :step="100"></el-input-number>
        </el-form-item>
        <el-form-item label="策略参数">
          <el-input type="textarea" v-model="newStrategyForm.parameters" placeholder="请输入策略参数JSON格式" rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStrategyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitNewStrategy">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'LocalTrading',
  data() {
    return {
      // 概览数据
      runningStrategiesCount: 3,
      todayTradesCount: 45,
      todayEarnings: 5.2,
      totalProfitRate: 12.8,

      // 策略列表数据
      strategiesList: [
        {
          id: '1',
          name: '自定义BTC策略v1.0',
          type: '自定义策略',
          status: '运行中',
          tradingPair: 'BTC/USDT',
          lastTradeTime: '2024-07-03 14:30:22',
          profitRate: 15.3
        },
        {
          id: '2',
          name: 'ETH趋势跟踪',
          type: 'RSI策略',
          status: '运行中',
          tradingPair: 'ETH/USDT',
          lastTradeTime: '2024-07-03 13:15:45',
          profitRate: 8.7
        },
        {
          id: '3',
          name: '波动率套利',
          type: '布林带策略',
          status: '已停止',
          tradingPair: 'SOL/USDT',
          lastTradeTime: '2024-07-02 23:40:10',
          profitRate: -2.1
        }
      ],

      // 交易历史数据
      tradeHistory: [
        {
          id: '1',
          timestamp: '2024-07-03 14:30:22',
          strategyName: '自定义BTC策略v1.0',
          tradingPair: 'BTC/USDT',
          type: '买入',
          price: 42500.50,
          quantity: 0.025,
          fee: 10.63,
          status: '成功'
        },
        {
          id: '2',
          timestamp: '2024-07-03 13:15:45',
          strategyName: 'ETH趋势跟踪',
          tradingPair: 'ETH/USDT',
          type: '买入',
          price: 2350.75,
          quantity: 0.5,
          fee: 5.88,
          status: '成功'
        },
        {
          id: '3',
          timestamp: '2024-07-03 12:45:18',
          strategyName: '自定义BTC策略v1.0',
          tradingPair: 'BTC/USDT',
          type: '卖出',
          price: 42300.20,
          quantity: 0.015,
          fee: 6.35,
          status: '成功'
        },
        {
          id: '4',
          timestamp: '2024-07-03 11:20:33',
          strategyName: 'ETH趋势跟踪',
          tradingPair: 'ETH/USDT',
          type: '卖出',
          price: 2320.40,
          quantity: 0.3,
          fee: 3.48,
          status: '成功'
        }
      ],

      // 添加策略对话框
      addStrategyDialogVisible: false,
      newStrategyForm: {
        name: '',
        type: '',
        tradingPair: '',
        javaClassPath: '',
        initialCapital: 10000,
        parameters: '{}'
      },

      // 表单验证规则
      rules: {
        name: [
          {required: true, message: '请输入策略名称', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择策略类型', trigger: 'change'}
        ],
        tradingPair: [
          {required: true, message: '请选择交易对', trigger: 'change'}
        ],
        javaClassPath: [
          {required: true, message: '请输入Java类完整路径', trigger: 'blur'}
        ],
        initialCapital: [
          {required: true, message: '请输入初始资金', trigger: 'blur'}
        ]
      }
    }
  },

  created() {
    // 模拟加载数据
    this.loadData()
  },

  methods: {
    // 加载数据
    loadData() {
      // 这里可以添加实际的数据加载逻辑
      console.log('加载本地交易数据')
    },

    // 显示添加策略对话框
    showAddStrategyDialog() {
      this.addStrategyDialogVisible = true
    },

    // 提交新策略
    submitNewStrategy() {
      this.$refs.newStrategyForm.validate((valid) => {
        if (valid) {
          // 模拟提交数据
          console.log('提交新策略:', this.newStrategyForm)

          // 添加到策略列表
          const newStrategy = {
            id: Date.now().toString(),
            ...this.newStrategyForm,
            status: '已停止',
            lastTradeTime: '',
            profitRate: 0
          }
          this.strategiesList.push(newStrategy)

          // 关闭对话框并重置表单
          this.addStrategyDialogVisible = false
          this.$refs.newStrategyForm.resetFields()
          this.$message({type: 'success', message: '策略添加成功'})
        } else {
          return false
        }
      })
    },

    // 切换策略状态
    toggleStrategyStatus(strategy) {
      if (strategy.status === '已停止') {
        this.$confirm(`确定要启动策略${strategy.name}吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          strategy.status = '运行中'
          this.runningStrategiesCount++
          this.$message({type: 'success', message: '策略启动成功'})
        }).catch(() => {
          this.$message({type: 'info', message: '已取消启动操作'})
        })
      }
    },

    // 停止策略
    stopStrategy(strategy) {
      this.$confirm(`确定要停止策略${strategy.name}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        strategy.status = '已停止'
        this.runningStrategiesCount--
        this.$message({type: 'success', message: '策略已停止'})
      }).catch(() => {
        this.$message({type: 'info', message: '已取消停止操作'})
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.local-trading-container {
  padding: 20px;

  .overview-section {
    margin-bottom: 20px;
  }

  .overview-card {
    margin-bottom: 0;
    height: 100%;

    .overview-item {
      text-align: center;
      padding: 20px 0;

      .overview-label {
        font-size: 14px;
        color: #606266;
        margin-bottom: 10px;
      }

      .overview-value {
        font-size: 28px;
        font-weight: 600;
        color: #303133;

        &.positive {
          color: #67c23a;
        }

        &.negative {
          color: #f56c6c;
        }
      }
    }
  }

  .strategies-card,
  .trades-card {
    margin-bottom: 20px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ebeef5;

      h3 {
        margin: 0;
        font-size: 16px;
        color: #303133;
      }
    }
  }

  .el-button {
    margin-bottom: 0;
  }

  .positive {
    color: #67c23a;
  }

  .negative {
    color: #f56c6c;
  }
}
</style>
