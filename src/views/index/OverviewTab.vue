<!-- 总览Tab组件 -->
<template>
  <div class="overview-tab">
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

    <!-- 主要图表区域 -->
    <!-- 实时状态 -->
    <!-- <el-row :gutter="20" class="charts-section">

      <el-col :span="12">
        <el-card shadow="never" class="chart-card">
          <div class="chart-header">
            <div class="chart-title">实时状态</div>
            <div class="status-tag">
              {{ dashboard.status }}
            </div>
          </div>
          <div class="status-content">
            <div class="status-item">
              <span class="status-label">策略运行中</span>
              <span class="status-value">{{ dashboard.runningStrategies }}个</span>
            </div>
            <div class="status-item">
              <span class="status-label">今日交易次数</span>
              <span class="status-value">{{ dashboard.todayTrades }}</span>
            </div>
            <div class="status-item">
              <span class="status-label">API连接状态</span>
              <span class="status-value">{{ dashboard.apiStatus }}</span>
            </div>
            <div class="status-item">
              <span class="status-label">最新交易时间</span>
              <span class="status-value">{{ dashboard.lastTradeTime }}</span>
            </div>
          </div>
        </el-card>
      </el-col> -->
    <!-- 性能指标 -->
    <!-- <el-col :span="12">
      <el-card shadow="never" class="chart-card">
        <div class="chart-header">
          <div class="chart-title">性能指标</div>
        </div>
        <div class="metrics-content">
          <div class="metric-item" v-for="(metric, index) in dashboardData.metrics" :key="index">
            <div class="metric-header">
              <span class="metric-label">{{ metric.label }}</span>
              <span class="metric-value">{{ metric.value }}</span>
            </div>
            <div class="metric-progress">
              <el-progress :percentage="metric.progress" :color="metric.color" :stroke-width="6" />
            </div>
          </div>
        </div>
      </el-card>
    </el-col> -->
    <!-- </el-row> -->

    <!-- 第二行图表 -->
    <!-- <el-row :gutter="20" class="charts-section">
     <el-col :span="24">
       <el-card shadow="never" class="chart-card">
         <div class="chart-header">
           <div class="chart-title">交易信号热力图</div>
         </div>
         <div class="chart-content heatmap-container">
           <div class="heatmap-grid">
             <div v-for="(row, rowIndex) in heatmapData" :key="rowIndex" class="heatmap-row">
               <div v-for="(cell, cellIndex) in row" :key="cellIndex"
                    class="heatmap-cell" :style="{backgroundColor: getHeatmapColor(cell.value)}">
                 {{ cell.label }}
               </div>
             </div>
           </div>
         </div>
       </el-card>
       <div class="heatmap-legend">
             <span>低</span>
             <div class="legend-colors">
               <div class="legend-color low"></div>
               <div class="legend-color medium"></div>
               <div class="legend-color high"></div>
             </div>
             <span>高</span>
           </div>
     </el-col>
   </el-row> -->

    <!-- AI模型表现 -->
    <!-- <el-row :gutter="20" class="ai-models-section">
      <el-col :span="24">
        <el-card shadow="never" class="chart-card">
          <div class="chart-header">
            <div class="chart-title">AI模型表现</div>
            <div class="chart-actions">
              <el-button type="text" size="small">全部模型</el-button>
              <el-button type="text" size="small">表现详情</el-button>
            </div>
          </div>
          <div class="ai-models-grid">
            <el-card shadow="never" class="ai-model-card" v-for="(model, index) in dashboardData.aiModels" :key="index">
              <div class="ai-model-header">
                <h4 class="model-name">{{ model.name }}</h4>
                <span class="model-status" :class="model.statusClass">{{ model.status }}</span>
              </div>
              <div class="ai-model-metrics">
                <div class="model-metric">
                  <span class="metric-label">准确率</span>
                  <span class="metric-value">{{ model.accuracy }}</span>
                </div>
                <div class="model-metric">
                  <span class="metric-label">收益率</span>
                  <span class="metric-value">{{ model.profitRate }}</span>
                </div>
              </div>
              <div class="ai-model-actions">
                <el-button size="mini" type="primary">查看</el-button>
                <el-button size="mini">配置</el-button>
              </div>
            </el-card>
          </div>
        </el-card>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import {dashboard} from "../../api/realTimeStrategy";

export default {
  name: 'OverviewTab',
  data() {
    // 生成默认热力图数据
    const generateDefaultHeatmapData = () => {
      const coins = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'DOT', 'AVAX']
      const signals = ['买入', '卖出', '持有', '观望', '减仓', '加仓']

      const data = []
      coins.forEach(coin => {
        const row = []
        signals.forEach(signal => {
          row.push({
            label: signal,
            value: Math.floor(Math.random() * 100)
          })
        })
        data.push(row)
      })

      return data
    }

    return {
      heatmapData: generateDefaultHeatmapData(),
      dashboard: {
        runningModel: 0,
        currentTotalAmount: 0,
        totalProfit: 0,
        totalProfitRatio: 0,
      },

    }
  },
  created() {
    this.fetchDashboard()
  },
  computed: {},
  methods: {
    /**
     * 获取仪表盘数据
     */
    async fetchDashboard() {
      debugger
      this.dashboard = await dashboard().then(response => response.data)
    },
    // 获取所有仪表盘数据
    async fetchDashboardData() {
      try {

      } catch (error) {
        this.$message.error('获取仪表盘数据失败')
        console.error('Dashboard data fetch error:', error)
      }
    },

    // 获取资产趋势数据
    async fetchAssetTrend(period) {
      try {
        const {getAssetTrend} = await import('@/api/dashboard')
        const res = await getAssetTrend(period)
        if (res.code === 20000) {
          this.assetTrendData = {
            dates: res.data.dates,
            values: res.data.values
          }
        }
      } catch (error) {
        this.$message.error('获取资产趋势数据失败')
        console.error('Asset trend fetch error:', error)
      }
    },

    // 刷新数据
    refreshData() {
      this.fetchDashboardData()
    },
    // 获取热力图颜色
    getHeatmapColor(value) {
      if (value < 30) return '#e6f7ff'
      if (value < 60) return '#91d5ff'
      return '#1890ff'
    }
  }
}
</script>

<style lang="scss" scoped>
.overview-tab {
  .top-stats {
    margin-bottom: 20px;
  }

  .charts-section {
    margin-bottom: 20px;
  }

  .ai-models-section {
    margin-bottom: 20px;
  }

  // 热力图样式
  .heatmap-container {
    height: 300px;
    padding: 20px;
  }

  .heatmap-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 8px;
    margin-bottom: 20px;
    height: calc(100% - 50px);
  }

  .heatmap-row {
    display: contents;
  }

  .heatmap-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    color: #333;
    text-align: center;
    transition: all 0.3s ease;
    min-height: 60px;
  }

  .heatmap-cell:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .heatmap-legend {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #666;
  }

  .legend-colors {
    display: flex;
    margin: 0 10px;
  }

  .legend-color {
    width: 20px;
    height: 8px;
    margin: 0 2px;
    border-radius: 4px;
  }

  .legend-color.low {
    background-color: #e6f7ff;
  }

  .legend-color.medium {
    background-color: #91d5ff;
  }

  .legend-color.high {
    background-color: #1890ff;
  }

  .earnings-up {
    color: #13ce66;
  }

  .earnings-down {
    color: #ff4949;
  }
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
}
</style>
