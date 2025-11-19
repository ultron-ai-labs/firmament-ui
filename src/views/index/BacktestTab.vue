<!-- 回测模型Tab组件 -->
<template>
  <div class="backtest-tab">
    <!-- 回测概览数据卡片 -->
    <el-row :gutter="20" class="top-stats">
      <el-col :span="6">
        <el-card shadow="never" class="stat-card">
          <div class="stat-content">
            <div class="stat-label">总回测次数</div>
            <div class="stat-value">{{ backtestData.totalRuns }}</div>
            <div class="stat-change positive">{{ backtestData.totalRunsChange }}<span class="change-label">24h</span></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="stat-card">
          <div class="stat-content">
            <div class="stat-label">平均收益率</div>
            <div class="stat-value">{{ backtestData.avgProfitRate }}</div>
            <div class="stat-change positive">{{ backtestData.avgProfitRateChange }}<span class="change-label">24h</span></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="stat-card">
          <div class="stat-content">
            <div class="stat-label">最大回撤</div>
            <div class="stat-value">{{ backtestData.maxDrawdown }}</div>
            <div class="stat-change negative">{{ backtestData.maxDrawdownChange }}<span class="change-label">24h</span></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="stat-card">
          <div class="stat-content">
            <div class="stat-label">胜率</div>
            <div class="stat-value">{{ backtestData.winRate }}</div>
            <div class="stat-change positive">{{ backtestData.winRateChange }}<span class="change-label">24h</span></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 回测收益趋势图 -->
    <el-row :gutter="20" class="charts-section">
      <el-col :span="16">
        <el-card shadow="never" class="chart-card">
          <div class="chart-header">
            <div class="chart-title">回测收益趋势图</div>
            <div class="chart-periods">
              <el-radio-group v-model="backtestChartPeriod" size="small">
                <el-radio-button label="7d">7天</el-radio-button>
                <el-radio-button label="30d">30天</el-radio-button>
                <el-radio-button label="90d">90天</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="chart-content">
            <vab-chart autoresize :option="backtestTrendChart"/>
          </div>
        </el-card>
      </el-col>

      <!-- 回测模型分布图表 -->
      <el-col :span="8">
        <el-card shadow="never" class="chart-card">
          <div class="chart-header">
            <div class="chart-title">回测模型分布</div>
          </div>
          <div class="chart-content">
            <vab-chart autoresize :option="backtestModelChart"/>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近回测记录表格 -->
    <el-row :gutter="20" class="table-section">
      <el-col :span="24">
        <el-card shadow="never" class="table-card">
          <div class="chart-header">
            <div class="chart-title">最近回测记录</div>
            <div class="chart-actions">
              <el-button type="primary" size="small">运行新回测</el-button>
              <el-button type="text" size="small">查看全部</el-button>
            </div>
          </div>
          <div class="table-content">
            <el-table :data="backtestRecords" style="width: 100%">
              <el-table-column prop="id" label="回测ID" width="180"/>
              <el-table-column prop="modelName" label="模型名称" width="180"/>
              <el-table-column prop="startDate" label="开始日期" width="150"/>
              <el-table-column prop="endDate" label="结束日期" width="150"/>
              <el-table-column prop="profitRate" label="收益率" width="120">
                <template slot-scope="scope">
                  <span :class="scope.row.profitRate > 0 ? 'text-success' : 'text-danger'">
                    {{ scope.row.profitRate }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="maxDrawdown" label="最大回撤" width="120"/>
              <el-table-column prop="winRate" label="胜率" width="100"/>
              <el-table-column prop="status" label="状态" width="100">
                <template slot-scope="scope">
                  <el-tag :type="getTagType(scope.row.status)">{{ scope.row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="viewBacktestDetail(scope.row.id)">详情</el-button>
                  <el-button size="mini" @click="exportBacktest(scope.row.id)">导出</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'BacktestTab',
  data() {
    return {
      backtestChartPeriod: '30d',
      backtestData: {
        totalRuns: '--',
        totalRunsChange: '--',
        avgProfitRate: '--',
        avgProfitRateChange: '--',
        maxDrawdown: '--',
        maxDrawdownChange: '--',
        winRate: '--',
        winRateChange: '--'
      },
      backtestRecords: [],
      backtestTrendData: {
        dates: [],
        values: []
      },
      backtestModelDistribution: []
    }
  },
  created() {
    this.loadBacktestData()
  },
  computed: {
    // 回测趋势图配置
    backtestTrendChart() {
      return {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderColor: '#52c41a',
          textStyle: {
            color: '#fff'
          },
          formatter: (params) => {
            let result = `${params[0].name}<br/>`
            params.forEach(param => {
              result += `${param.marker} ${param.seriesName}: ${param.value}<br/>`
            })
            return result
          }
        },
        legend: {
          data: ['回测收益'],
          textStyle: {
            color: '#666'
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
          data: this.backtestTrendData.dates || this.generateMockDates(),
          axisLabel: {
            rotate: 45,
            color: '#666'
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}%',
            color: '#666'
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0',
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: '回测收益',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
              color: '#52c41a',
              width: 2
            },
            itemStyle: {
              color: '#52c41a'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {offset: 0, color: 'rgba(82, 196, 26, 0.3)'},
                  {offset: 1, color: 'rgba(82, 196, 26, 0.05)'}
                ]
              }
            },
            data: this.backtestTrendData.values || this.generateMockValues()
          }
        ]
      }
    },

    // 回测模型分布图配置
    backtestModelChart() {
      const modelData = this.backtestModelDistribution.length > 0 ? this.backtestModelDistribution : [
        {value: 40, name: '机器学习模型', itemStyle: {color: '#1890ff'}},
        {value: 30, name: '技术指标模型', itemStyle: {color: '#52c41a'}},
        {value: 15, name: '基本面模型', itemStyle: {color: '#faad14'}},
        {value: 15, name: '混合策略模型', itemStyle: {color: '#f5222d'}}
      ]

      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            fontSize: 12
          }
        },
        series: [
          {
            name: '模型分布',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '16',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: modelData
          }
        ]
      }
    }
  },
  watch: {
    backtestChartPeriod: {
      handler(newPeriod) {
        this.fetchBacktestTrend(newPeriod)
      }
    }
  },
  methods: {
    // 加载回测数据
    async loadBacktestData() {
      try {
        // 导入API函数
        const {
          getBacktestOverview,
          getBacktestTrend,
          getBacktestModelDistribution,
          getRecentBacktestRecords
        } = await import('@/api/dashboard')

        // 并行请求所有数据
        const [overviewRes, trendRes, distributionRes, recordsRes] = await Promise.all([
          getBacktestOverview(),
          getBacktestTrend(this.backtestChartPeriod),
          getBacktestModelDistribution(),
          getRecentBacktestRecords(10) // 获取最近10条记录
        ])

        // 更新回测概览数据
        if (overviewRes.code === 20000) {
          this.backtestData = {...this.backtestData, ...overviewRes.data}
        }

        // 更新回测趋势数据
        if (trendRes.code === 20000) {
          this.backtestTrendData = {
            dates: trendRes.data.dates,
            values: trendRes.data.values
          }
        }

        // 更新模型分布数据
        if (distributionRes.code === 20000) {
          this.backtestModelDistribution = distributionRes.data.distribution
        }

        // 更新回测记录数据
        if (recordsRes.code === 20000) {
          this.backtestRecords = recordsRes.data.records
        } else {
          // 如果没有数据，使用模拟数据
          this.backtestRecords = this.generateMockRecords()
        }
      } catch (error) {
        this.$message.error('获取回测数据失败')
        console.error('Backtest data fetch error:', error)
        // 使用模拟数据
        this.backtestRecords = this.generateMockRecords()
      }
    },

    // 获取回测趋势数据
    async fetchBacktestTrend(period) {
      try {
        const {getBacktestTrend} = await import('@/api/dashboard')
        const res = await getBacktestTrend(period)
        if (res.code === 20000) {
          this.backtestTrendData = {
            dates: res.data.dates,
            values: res.data.values
          }
        }
      } catch (error) {
        this.$message.error('获取回测趋势数据失败')
        console.error('Backtest trend fetch error:', error)
      }
    },

    // 生成模拟日期
    generateMockDates() {
      const dates = []
      const now = new Date()
      const days = this.backtestChartPeriod === '7d' ? 7 : this.backtestChartPeriod === '30d' ? 30 : 90

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        dates.push(date.toISOString().split('T')[0])
      }

      return dates
    },

    // 生成模拟数据
    generateMockValues() {
      const values = []
      const days = this.backtestChartPeriod === '7d' ? 7 : this.backtestChartPeriod === '30d' ? 30 : 90
      let baseValue = 100

      for (let i = 0; i < days; i++) {
        // 模拟收益率变化，范围在-3%到5%之间
        const change = (Math.random() * 8 - 3)
        baseValue += change
        values.push(baseValue.toFixed(2))
      }

      return values
    },

    // 生成模拟回测记录
    generateMockRecords() {
      return [
        {
          id: 'BT20240601001',
          modelName: 'ML策略A',
          startDate: '2024-05-01',
          endDate: '2024-06-01',
          profitRate: '+15.68%',
          maxDrawdown: '8.25%',
          winRate: '62.3%',
          status: '成功'
        },
        {
          id: 'BT20240530002',
          modelName: '技术指标组合',
          startDate: '2024-04-30',
          endDate: '2024-05-30',
          profitRate: '+8.34%',
          maxDrawdown: '12.10%',
          winRate: '54.7%',
          status: '成功'
        },
        {
          id: 'BT20240528003',
          modelName: '基本面分析',
          startDate: '2024-04-28',
          endDate: '2024-05-28',
          profitRate: '-2.15%',
          maxDrawdown: '15.30%',
          winRate: '46.2%',
          status: '失败'
        },
        {
          id: 'BT20240525004',
          modelName: '混合策略B',
          startDate: '2024-04-25',
          endDate: '2024-05-25',
          profitRate: '+12.76%',
          maxDrawdown: '9.45%',
          winRate: '58.9%',
          status: '成功'
        },
        {
          id: 'BT20240520005',
          modelName: '机器学习增强',
          startDate: '2024-04-20',
          endDate: '2024-05-20',
          profitRate: '+20.12%',
          maxDrawdown: '7.65%',
          winRate: '65.8%',
          status: '成功'
        }
      ]
    },

    // 获取状态标签类型
    getTagType(status) {
      const typeMap = {
        '成功': 'success',
        '失败': 'danger',
        '进行中': 'primary'
      }
      return typeMap[status] || 'info'
    },

    // 查看回测详情
    viewBacktestDetail(id) {
      this.$router.push(`/backtest/detail/${id}`)
    },

    // 导出回测结果
    exportBacktest(id) {
      // 这里实现导出回测结果的逻辑
      this.$message.success('回测结果导出中...')
    }
  }
}
</script>

<style lang="scss" scoped>
.backtest-tab {
  .top-stats {
    margin-bottom: 20px;
  }

  .charts-section {
    margin-bottom: 20px;
  }

  .table-section {
    margin-bottom: 20px;
  }

  .text-success {
    color: #52c41a;
  }

  .text-danger {
    color: #f5222d;
  }
}
</style>
