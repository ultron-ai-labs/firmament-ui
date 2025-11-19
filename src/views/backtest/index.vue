<template>
  <div class="backtest-container">
    <!-- Tab切换 -->
    <div class="personal-tabs">
      <el-tabs v-model="activeTab">
        <!-- 新回测Tab -->
        <el-tab-pane label="新回测" name="newBacktest">
          <!-- 回测配置区域 -->
          <div class="config-container">
            <el-card class="config-card">
              <el-form :inline="true" :model="backtestConfig" class="demo-form-inline">
                <el-form-item label="策略选择">
                  <el-select v-model="backtestConfig.strategyId" placeholder="请选择策略" style="width: 200px;">
                    <el-option v-for="strategy in strategies" :key="strategy.id" :label="strategy.name" :value="strategy.id"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="时间范围">
                  <el-date-picker
                    v-model="backtestConfig.dateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    style="width: 300px;"
                  ></el-date-picker>
                </el-form-item>

                <el-form-item label="初始资金">
                  <el-input v-model.number="backtestConfig.initialCapital" placeholder="请输入初始资金" style="width: 150px;"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="startBacktest" :loading="backtestLoading">开始回测</el-button>
                </el-form-item>
              </el-form>

              <!-- 策略参数配置 -->
              <div class="params-container" v-if="backtestConfig.strategyId">
                <h4 class="params-title">策略参数</h4>
                <el-form :model="strategyParams" label-width="120px">
                  <el-form-item v-for="param in currentStrategyParams" :key="param.key" :label="param.label">
                    <el-input
                      v-model.number="strategyParams[param.key]"
                      :placeholder="param.description"
                      :type="param.type === 'number' ? 'number' : 'text'"
                      :min="param.min"
                      :max="param.max"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
          </div>

          <!-- 最新回测结果展示（仅显示最新的几条） -->
          <div v-if="recentBacktestResults.length > 0" class="recent-results-container">
            <el-card class="recent-results-card">
              <div slot="header" class="card-header">
                <span>最近回测结果</span>
              </div>
              <el-table
                :data="recentBacktestResults"
                style="width: 100%"
                border
                stripe
              >
                <el-table-column prop="id" label="回测ID" width="120" align="center"></el-table-column>
                <el-table-column prop="strategyName" label="策略名称" width="200" align="center"></el-table-column>
                <el-table-column prop="totalReturn" label="总收益率" width="120" align="center">
                  <template slot-scope="scope">
                    <el-tag :type="getReturnTagType(scope.row.totalReturn)">
                      {{ formatPercent(scope.row.totalReturn) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100" align="center">
                  <template slot-scope="scope">
                    <el-tag
                      :type="scope.row.status === 'success' ? 'success' :
                          scope.row.status === 'failed' ? 'danger' : 'warning'"
                    >
                      {{
                        scope.row.status === 'success' ? '成功' :
                          scope.row.status === 'failed' ? '失败' : '进行中'
                      }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                  <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="viewBacktestDetail(scope.row)" :disabled="scope.row.status === 'running'">查看详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </el-tab-pane>

        <!-- 历史回测Tab -->
        <el-tab-pane label="历史回测" name="historyBacktest">
          <!-- 回测结果搜索和筛选 -->
          <div class="search-container">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
              <el-form-item label="策略名称">
                <el-input v-model="searchForm.strategyName" placeholder="请输入策略名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="回测时间">
                <el-date-picker
                  v-model="searchForm.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  style="width: 300px;"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
                  <el-option label="成功" value="success"></el-option>
                  <el-option label="失败" value="failed"></el-option>
                  <el-option label="进行中" value="running"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="queryHistoryBacktest">查询历史回测订单</el-button>
                <el-button @click="resetSearch">重置</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 回测结果列表 -->
          <div class="table-container">
            <el-table
              :data="paginatedResults"
              style="width: 100%"
              border
              stripe
            >
              <el-table-column prop="id" label="回测ID" width="120" align="center"></el-table-column>
              <el-table-column prop="strategyName" label="策略名称" width="200" align="center">
                <template slot-scope="scope">
                  <div class="strategy-name">{{ scope.row.strategyName }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="dateRange" label="回测周期" width="250" align="center"></el-table-column>
              <el-table-column prop="initialCapital" label="初始资金" width="120" align="center">
                <template slot-scope="scope">
                  {{ formatCurrency(scope.row.initialCapital) }}
                </template>
              </el-table-column>
              <el-table-column prop="finalCapital" label="最终资金" width="120" align="center">
                <template slot-scope="scope">
                  {{ formatCurrency(scope.row.finalCapital) }}
                </template>
              </el-table-column>
              <el-table-column prop="totalReturn" label="总收益率" width="120" align="center">
                <template slot-scope="scope">
                  <el-tag :type="getReturnTagType(scope.row.totalReturn)">
                    {{ formatPercent(scope.row.totalReturn) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="maxDrawdown" label="最大回撤" width="120" align="center">
                <template slot-scope="scope">
                  <el-tag type="danger">{{ formatPercent(scope.row.maxDrawdown) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="sharpeRatio" label="夏普比率" width="120" align="center"></el-table-column>
              <el-table-column prop="status" label="状态" width="100" align="center">
                <template slot-scope="scope">
                  <el-tag
                    :type="scope.row.status === 'success' ? 'success' :
                        scope.row.status === 'failed' ? 'danger' : 'warning'"
                  >
                    {{
                      scope.row.status === 'success' ? '成功' :
                        scope.row.status === 'failed' ? '失败' : '进行中'
                    }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="180" align="center">
                <template slot-scope="scope">
                  {{ formatDate(scope.row.createTime) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="viewBacktestDetail(scope.row)" :disabled="scope.row.status === 'running'">查看详情</el-button>
                  <el-button type="danger" size="small" @click="deleteBacktestResult(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination
              background
              layout="prev, pager, next, jumper, total"
              :total="filteredResults.length"
              :page-size="pageSize"
              :current-page="currentPage"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 回测详情对话框 -->
    <el-dialog
      :title="'回测详情 - ' + selectedResult.strategyName"
      :visible.sync="detailVisible"
      width="900px"
      center
      append-to-body
    >
      <div v-if="selectedResult" class="detail-content">
        <!-- 基本信息 -->
        <el-card class="info-card">
          <div slot="header" class="card-header">
            <span>基本信息</span>
          </div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="回测ID">{{ selectedResult.id }}</el-descriptions-item>
            <el-descriptions-item label="策略名称">{{ selectedResult.strategyName }}</el-descriptions-item>
            <el-descriptions-item label="回测周期">{{ selectedResult.dateRange }}</el-descriptions-item>
            <el-descriptions-item label="初始资金">{{ formatCurrency(selectedResult.initialCapital) }}</el-descriptions-item>
            <el-descriptions-item label="最终资金">{{ formatCurrency(selectedResult.finalCapital) }}</el-descriptions-item>
            <el-descriptions-item label="总收益率">{{ formatPercent(selectedResult.totalReturn) }}</el-descriptions-item>
            <el-descriptions-item label="最大回撤">{{ formatPercent(selectedResult.maxDrawdown) }}</el-descriptions-item>
            <el-descriptions-item label="夏普比率">{{ selectedResult.sharpeRatio }}</el-descriptions-item>
            <el-descriptions-item label="胜率">{{ formatPercent(selectedResult.winRate) }}</el-descriptions-item>
            <el-descriptions-item label="交易次数">{{ selectedResult.tradeCount }}</el-descriptions-item>
            <el-descriptions-item label="创建时间" :span="2">{{ formatDate(selectedResult.createTime) }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 策略参数 -->
        <el-card class="params-card" v-if="selectedResult.params">
          <div slot="header" class="card-header">
            <span>策略参数</span>
          </div>
          <el-descriptions :column="3" border>
            <el-descriptions-item v-for="(value, key) in selectedResult.params" :key="key" :label="formatParamName(key)">
              {{ value }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 资金曲线 -->
        <el-card class="funds-chart-card">
          <div slot="header" class="card-header">
            <span>资金曲线</span>
          </div>
          <div class="chart-content">
            <vab-chart autoresize :option="fundsChartOption"/>
          </div>
        </el-card>

        <!-- 交易记录 -->
        <el-card class="trades-card">
          <div slot="header" class="card-header">
            <span>交易记录</span>
          </div>
          <el-table :data="selectedResult.trades || []" border stripe style="width: 100%">
            <el-table-column prop="tradeTime" label="交易时间" width="180" align="center"></el-table-column>
            <el-table-column prop="tradeType" label="交易类型" width="100" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row.tradeType === 'buy' ? 'success' : 'danger'">
                  {{ scope.row.tradeType === 'buy' ? '买入' : '卖出' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="价格" width="120" align="center"></el-table-column>
            <el-table-column prop="quantity" label="数量" width="120" align="center"></el-table-column>
            <el-table-column prop="amount" label="金额" width="120" align="center"></el-table-column>
            <el-table-column prop="reason" label="交易原因" align="left"></el-table-column>
          </el-table>
        </el-card>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BacktestCenter',
  data() {
    return {
      // 当前激活的Tab
      activeTab: 'newBacktest',
      // 回测配置
      backtestConfig: {
        strategyId: '',
        dateRange: null,
        initialCapital: 100000
      },
      // 回测加载状态
      backtestLoading: false,
      // 策略列表
      strategies: [],
      // 当前策略参数
      currentStrategyParams: [],
      // 策略参数值
      strategyParams: {},
      // 搜索表单
      searchForm: {
        strategyName: '',
        dateRange: null,
        status: ''
      },
      // 回测结果数据
      backtestResults: [],
      // 当前页码
      currentPage: 1,
      // 每页大小
      pageSize: 10,
      // 详情对话框显示状态
      detailVisible: false,
      // 选中的回测结果
      selectedResult: {},
      // 资金曲线图表配置
      fundsChartOption: {}
    }
  },
  computed: {
    // 过滤后的回测结果
    filteredResults() {
      let result = this.backtestResults
      // 根据策略名称过滤
      if (this.searchForm.strategyName) {
        result = result.filter(item => item.strategyName.includes(this.searchForm.strategyName))
      }
      // 根据日期范围过滤
      if (this.searchForm.dateRange && this.searchForm.dateRange.length === 2) {
        const [startDate, endDate] = this.searchForm.dateRange
        result = result.filter(item => {
          const createDate = new Date(item.createTime).toISOString().split('T')[0]
          return createDate >= startDate && createDate <= endDate
        })
      }
      // 根据状态过滤
      if (this.searchForm.status) {
        result = result.filter(item => item.status === this.searchForm.status)
      }
      return result
    },
    // 分页后的回测结果
    paginatedResults() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredResults.slice(start, end)
    },

    // 最近回测结果（显示最新的5条）
    recentBacktestResults() {
      return [...this.backtestResults]
        .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
        .slice(0, 5)
    }
  },
  created() {
    this.loadStrategies()
    this.loadBacktestResults()
  },
  mounted() {
  },
  methods: {
    // 加载策略列表
    loadStrategies() {
      // 模拟数据
      this.strategies = [
        {id: 1, name: 'MA均线策略', description: '基于移动平均线的交叉信号交易'},
        {id: 2, name: 'MACD策略', description: '基于MACD指标的交易策略'},
        {id: 3, name: 'RSI超买超卖策略', description: '基于RSI指标的超买超卖交易'},
        {id: 4, name: '布林带策略', description: '基于布林带突破的交易策略'}
      ]
    },

    // 加载回测结果
    loadBacktestResults() {
      // 模拟数据
      this.backtestResults = [
        {
          id: 'BT20240120001',
          strategyName: 'MA均线策略',
          dateRange: '2023-01-01 至 2023-12-31',
          initialCapital: 100000,
          finalCapital: 128500,
          totalReturn: 0.285,
          maxDrawdown: 0.125,
          sharpeRatio: 1.85,
          winRate: 0.62,
          tradeCount: 85,
          status: 'success',
          createTime: new Date('2024-01-20 10:30:00'),
          params: {
            shortPeriod: 10,
            longPeriod: 30,
            stopLossRatio: 0.05,
            takeProfitRatio: 0.15
          },
          trades: [
            {tradeTime: '2023-02-15 10:30:00', tradeType: 'buy', price: 125.5, quantity: 100, amount: 12550, reason: 'MA金叉信号'},
            {tradeTime: '2023-03-10 14:20:00', tradeType: 'sell', price: 138.2, quantity: 100, amount: 13820, reason: 'MA死叉信号'}
          ]
        },
        {
          id: 'BT20240120002',
          strategyName: 'MACD策略',
          dateRange: '2023-01-01 至 2023-12-31',
          initialCapital: 100000,
          finalCapital: 115300,
          totalReturn: 0.153,
          maxDrawdown: 0.182,
          sharpeRatio: 1.23,
          winRate: 0.58,
          tradeCount: 62,
          status: 'success',
          createTime: new Date('2024-01-20 14:45:00'),
          params: {
            fastPeriod: 12,
            slowPeriod: 26,
            signalPeriod: 9,
            stopLossRatio: 0.06
          },
          trades: []
        },
        {
          id: 'BT20240121001',
          strategyName: 'RSI超买超卖策略',
          dateRange: '2023-06-01 至 2023-12-31',
          initialCapital: 200000,
          finalCapital: 235800,
          totalReturn: 0.179,
          maxDrawdown: 0.143,
          sharpeRatio: 1.56,
          winRate: 0.65,
          tradeCount: 48,
          status: 'success',
          createTime: new Date('2024-01-21 09:15:00'),
          params: {
            overBought: 70,
            overSold: 30,
            period: 14
          },
          trades: []
        },
        {
          id: 'BT20240121002',
          strategyName: '布林带策略',
          dateRange: '2023-01-01 至 2023-06-30',
          initialCapital: 150000,
          finalCapital: 142500,
          totalReturn: -0.05,
          maxDrawdown: 0.217,
          sharpeRatio: -0.42,
          winRate: 0.45,
          tradeCount: 36,
          status: 'failed',
          createTime: new Date('2024-01-21 16:30:00'),
          params: {
            period: 20,
            stdDev: 2,
            stopLossRatio: 0.08
          },
          trades: []
        }
      ]
    },

    // 格式化日期
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hours = String(d.getHours()).padStart(2, '0')
      const minutes = String(d.getMinutes()).padStart(2, '0')
      const seconds = String(d.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },

    // 格式化百分比
    formatPercent(value) {
      if (value === null || value === undefined) return '0%'
      return (value * 100).toFixed(2) + '%'
    },

    // 格式化货币
    formatCurrency(value) {
      if (value === null || value === undefined) return '0'
      return value.toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2})
    },

    // 获取收益率标签类型
    getReturnTagType(returnValue) {
      if (returnValue > 0.2) return 'success'
      if (returnValue > 0) return 'primary'
      if (returnValue > -0.1) return 'warning'
      return 'danger'
    },

    // 格式化参数名称
    formatParamName(paramName) {
      const nameMap = {
        shortPeriod: '短期周期',
        longPeriod: '长期周期',
        stopLossRatio: '止损比例',
        takeProfitRatio: '止盈比例',
        fastPeriod: '快线周期',
        slowPeriod: '慢线周期',
        signalPeriod: '信号线周期',
        overBought: '超买阈值',
        overSold: '超卖阈值',
        period: '周期',
        stdDev: '标准差倍数'
      }
      return nameMap[paramName] || paramName
    },

    // 开始回测
    startBacktest() {
      if (!this.backtestConfig.strategyId) {
        this.$message.warning('请选择策略')
        return
      }

      if (!this.backtestConfig.dateRange || this.backtestConfig.dateRange.length !== 2) {
        this.$message.warning('请选择回测时间范围')
        return
      }

      if (!this.backtestConfig.initialCapital || this.backtestConfig.initialCapital <= 0) {
        this.$message.warning('请输入有效的初始资金')
        return
      }

      this.backtestLoading = true

      // 模拟回测过程
      setTimeout(() => {
        const selectedStrategy = this.strategies.find(s => s.id === this.backtestConfig.strategyId)
        const newResult = {
          id: 'BT' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
          strategyName: selectedStrategy.name,
          dateRange: `${this.backtestConfig.dateRange[0]} 至 ${this.backtestConfig.dateRange[1]}`,
          initialCapital: this.backtestConfig.initialCapital,
          // 模拟随机结果
          finalCapital: this.backtestConfig.initialCapital * (1 + (Math.random() * 0.6 - 0.2)),
          totalReturn: Math.random() * 0.6 - 0.2,
          maxDrawdown: Math.random() * 0.2 + 0.05,
          sharpeRatio: Math.random() * 2 - 0.5,
          winRate: Math.random() * 0.4 + 0.4,
          tradeCount: Math.floor(Math.random() * 100) + 20,
          status: 'success',
          createTime: new Date(),
          params: {...this.strategyParams},
          trades: []
        }

        this.backtestResults.unshift(newResult)
        this.backtestLoading = false
        this.$message.success('回测完成')
      }, 2000)
    },

    // 查询历史回测订单
    queryHistoryBacktest() {
      this.currentPage = 1 // 重置到第一页
      // 这里可以添加实际的API调用逻辑
      // 例如: this.loadBacktestResults(this.searchForm)
    },

    // 搜索（保留以兼容现有代码）
    handleSearch() {
      this.queryHistoryBacktest()
    },

    // 重置搜索
    resetSearch() {
      this.searchForm = {
        strategyName: '',
        dateRange: null,
        status: ''
      }
      this.currentPage = 1
    },

    // 生成资金曲线数据
    generateFundsData(result) {
      const dates = []
      const values = []

      // 从回测周期中解析日期范围
      const dateRangeMatch = result.dateRange.match(/(\d{4}-\d{2}-\d{2})\s*至\s*(\d{4}-\d{2}-\d{2})/)
      if (!dateRangeMatch) return {dates, values}

      const startDate = new Date(dateRangeMatch[1])
      const endDate = new Date(dateRangeMatch[2])
      const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1

      // 根据回测的总收益率生成模拟的资金曲线数据
      const initialCapital = result.initialCapital
      const finalCapital = result.finalCapital
      const totalReturn = result.totalReturn

      // 生成时间点数据（最多生成60个点以保持图表清晰度）
      const step = Math.max(1, Math.ceil(days / 60))

      for (let i = 0; i <= days; i += step) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + i)
        const month = String(currentDate.getMonth() + 1).padStart(2, '0')
        const day = String(currentDate.getDate()).padStart(2, '0')
        dates.push(`${month}-${day}`)

        // 生成模拟的资金曲线数据
        const progress = i / days
        // 使用简单的非线性增长模型，加入一些随机波动
        const trend = initialCapital * (1 + totalReturn * progress)
        const randomFactor = 1 + (Math.random() - 0.5) * 0.1 // ±5%的随机波动
        values.push(parseFloat((trend * randomFactor).toFixed(2)))
      }

      return {dates, values}
    },

    // 更新资金曲线图表配置
    updateFundsChart() {
      if (!this.selectedResult) {
        this.fundsChartOption = {}
        return
      }

      const {dates, values} = this.generateFundsData(this.selectedResult)

      this.fundsChartOption = {
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            const date = params[0].axisValue
            const value = params[0].value
            return `${date}<br/>资金: ¥${value.toLocaleString('zh-CN', {minimumFractionDigits: 2})}`
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dates,
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: function (value) {
              return '¥' + value.toLocaleString('zh-CN', {minimumFractionDigits: 0})
            }
          }
        },
        series: [
          {
            name: '资金',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 4,
            lineStyle: {
              color: '#1890ff',
              width: 2
            },
            itemStyle: {
              color: '#1890ff'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {offset: 0, color: 'rgba(24, 144, 255, 0.3)'},
                  {offset: 1, color: 'rgba(24, 144, 255, 0.05)'}
                ]
              }
            },
            data: values
          }
        ]
      }
    },

    // 查看回测详情
    viewBacktestDetail(result) {
      this.selectedResult = {...result}
      this.detailVisible = true
      this.updateFundsChart()
    },

    // 删除回测结果
    deleteBacktestResult(result) {
      this.$confirm(`确定要删除回测结果"${result.id}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.backtestResults.findIndex(item => item.id === result.id)
        if (index !== -1) {
          this.backtestResults.splice(index, 1)
        }
        this.$message.success('删除成功')
      }).catch(() => {
        // 取消删除操作
      })
    },

    // 分页大小变化
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
    },

    // 当前页变化
    handleCurrentChange(current) {
      this.currentPage = current
    }
  },
  watch: {
    // 监听策略选择变化，更新参数配置
    'backtestConfig.strategyId'(newVal) {
      if (newVal) {
        // 根据选择的策略加载相应参数配置
        switch (newVal) {
          case 1: // MA均线策略
            this.currentStrategyParams = [
              {key: 'shortPeriod', label: '短期周期', type: 'number', min: 1, max: 100, description: '短期移动平均线周期'},
              {key: 'longPeriod', label: '长期周期', type: 'number', min: 2, max: 200, description: '长期移动平均线周期'},
              {key: 'stopLossRatio', label: '止损比例', type: 'number', min: 0.01, max: 0.5, description: '止损比例'},
              {key: 'takeProfitRatio', label: '止盈比例', type: 'number', min: 0.01, max: 1, description: '止盈比例'}
            ]
            this.strategyParams = {shortPeriod: 10, longPeriod: 30, stopLossRatio: 0.05, takeProfitRatio: 0.15}
            break
          case 2: // MACD策略
            this.currentStrategyParams = [
              {key: 'fastPeriod', label: '快线周期', type: 'number', min: 1, max: 50, description: 'MACD快线周期'},
              {key: 'slowPeriod', label: '慢线周期', type: 'number', min: 2, max: 100, description: 'MACD慢线周期'},
              {key: 'signalPeriod', label: '信号线周期', type: 'number', min: 1, max: 30, description: 'MACD信号线周期'},
              {key: 'stopLossRatio', label: '止损比例', type: 'number', min: 0.01, max: 0.5, description: '止损比例'}
            ]
            this.strategyParams = {fastPeriod: 12, slowPeriod: 26, signalPeriod: 9, stopLossRatio: 0.06}
            break
          case 3: // RSI策略
            this.currentStrategyParams = [
              {key: 'overBought', label: '超买阈值', type: 'number', min: 50, max: 90, description: 'RSI超买阈值'},
              {key: 'overSold', label: '超卖阈值', type: 'number', min: 10, max: 50, description: 'RSI超卖阈值'},
              {key: 'period', label: 'RSI周期', type: 'number', min: 1, max: 50, description: 'RSI计算周期'}
            ]
            this.strategyParams = {overBought: 70, overSold: 30, period: 14}
            break
          case 4: // 布林带策略
            this.currentStrategyParams = [
              {key: 'period', label: '中轨周期', type: 'number', min: 1, max: 100, description: '布林带中轨移动平均周期'},
              {key: 'stdDev', label: '标准差倍数', type: 'number', min: 0.5, max: 5, description: '上下轨标准差倍数'},
              {key: 'stopLossRatio', label: '止损比例', type: 'number', min: 0.01, max: 0.5, description: '止损比例'}
            ]
            this.strategyParams = {period: 20, stdDev: 2, stopLossRatio: 0.08}
            break
        }
      } else {
        this.currentStrategyParams = []
        this.strategyParams = {}
      }
    }
  }
}
</script>

<style scoped>
.backtest-container {
  padding: 20px;
}

.config-container {
  margin-bottom: 20px;
}

.config-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.params-container {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.params-title {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 500;
}

.search-container {
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.table-container {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.strategy-name {
  font-weight: 500;
}

.detail-content {
  max-height: 600px;
  overflow-y: auto;
}

.info-card,
.params-card,
.funds-chart-card {
  margin-top: 20px;
  height: 400px;
}

.chart-content {
  width: 100%;
  height: calc(100% - 50px);
}

.trades-card {
  margin-top: 20px;
  height: 400px;
  overflow-y: auto;
}

:deep(.el-descriptions-item__label) {
  font-weight: 500;
}
</style>
