<!-- 加密货币价格走势Tab组件 -->
<template>
  <div class="crypto-price-tab">
    <!-- 币种选择和周期控制 -->
    <el-row :gutter="20" class="controls-section">
      <el-col :span="12">
        <el-card shadow="never" class="control-card">
          <div class="control-content">
            <div class="control-group">
              <span class="control-label">选择币种：</span>
              <el-select v-model="selectedCoin" placeholder="请选择币种" size="small" @change="handleCoinChange">
                <el-option label="比特币 (BTC)" value="BTC"></el-option>
                <el-option label="以太坊 (ETH)" value="ETH"></el-option>
                <el-option label="索拉纳 (SOL)" value="SOL"></el-option>
              </el-select>
            </div>
            <div class="control-group">
              <span class="control-label">选择周期：</span>
              <el-radio-group v-model="cryptoChartPeriod" size="small" @change="handlePeriodChange">
                <el-radio-button label="1d">1天</el-radio-button>
                <el-radio-button label="7d">7天</el-radio-button>
                <el-radio-button label="30d">30天</el-radio-button>
                <el-radio-button label="1y">1年</el-radio-button>
              </el-radio-group>
            </div>
            <el-button type="primary" size="small" @click="refreshCryptoData" icon="el-icon-refresh">
              刷新数据
            </el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="price-info-card">
          <div class="price-info-content">
            <div class="price-main">
              <span class="coin-symbol">{{ selectedCoin }}</span>
              <span class="current-price">${{ currentPrice }}</span>
              <span class="price-change" :class="priceChangeClass">
                {{ priceChange }} ({{ priceChangePercent }})
              </span>
            </div>
            <div class="price-metrics">
              <div class="metric-item">
                <span class="metric-label">24h交易量：</span>
                <span class="metric-value">${{ tradingVolume }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">市值：</span>
                <span class="metric-value">${{ marketCap }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">最高价：</span>
                <span class="metric-value">${{ highPrice }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">最低价：</span>
                <span class="metric-value">${{ lowPrice }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 蜡烛图展示区域 -->
    <!--    <el-row :gutter="20" class="chart-section">-->
    <!--      <el-col :span="24">-->
    <!--        <el-card shadow="never" class="chart-card">-->
    <!--          <div class="chart-header">-->
    <!--            <div class="chart-title">{{ selectedCoin }} 价格走势图</div>-->
    <!--            <div class="chart-info">-->
    <!--              数据来源：币安数据-->
    <!--            </div>-->
    <!--          </div>-->
    <!--          <div class="chart-content">-->
    <!--            <kline-chart :chart-data="klineData" />-->
    <!--          </div>-->
    <!--        </el-card>-->
    <!--      </el-col>-->
    <!--    </el-row>-->

    <!-- 技术指标区域 -->
    <el-row :gutter="20" class="indicators-section">
      <el-col :span="12">
        <el-card shadow="never" class="indicator-card">
          <div class="chart-header">
            <div class="chart-title">交易量图表</div>
          </div>
          <div class="chart-content indicator-chart">
            <vab-chart autoresize :option="volumeChart"/>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="indicator-card">
          <div class="chart-header">
            <div class="chart-title">价格统计概览</div>
          </div>
          <div class="stats-grid">
            <div class="stat-grid-item">
              <div class="stat-grid-label">开盘价</div>
              <div class="stat-grid-value">${{ openPrice }}</div>
            </div>
            <div class="stat-grid-item">
              <div class="stat-grid-label">收盘价</div>
              <div class="stat-grid-value">${{ closePrice }}</div>
            </div>
            <div class="stat-grid-item">
              <div class="stat-grid-label">平均价格</div>
              <div class="stat-grid-value">${{ avgPrice }}</div>
            </div>
            <div class="stat-grid-item">
              <div class="stat-grid-label">波动率</div>
              <div class="stat-grid-value">{{ volatility }}%</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import KlineChart from './components/KlineChart.vue'

export default {
  name: 'CryptoPriceTab',
  components: {
    KlineChart
  },
  data() {
    return {
      selectedCoin: 'BTC',
      cryptoChartPeriod: '1d',
      cryptoPriceData: {
        dates: [],
        ohlc: [],
        volumes: []
      },
      // 价格信息
      currentPrice: '--',
      priceChange: '--',
      priceChangePercent: '--',
      tradingVolume: '--',
      marketCap: '--',
      highPrice: '--',
      lowPrice: '--',
      openPrice: '--',
      closePrice: '--',
      avgPrice: '--',
      volatility: '--'
    }
  },
  created() {
    this.fetchCryptoPriceData()
  },
  computed: {
    // 价格变化样式类
    priceChangeClass() {
      if (this.priceChange.startsWith('+')) return 'price-up'
      if (this.priceChange.startsWith('-')) return 'price-down'
      return ''
    },

    // klinecharts格式的数据
    klineData() {
      const candlestickData = this.cryptoPriceData.ohlc.length > 0
        ? this.cryptoPriceData.ohlc
        : this.generateMockCandlestickData()

      const dates = this.cryptoPriceData.dates.length > 0
        ? this.cryptoPriceData.dates
        : this.generateMockDates()

      // 转换为klinecharts格式：[{time, open, high, low, close}]
      return candlestickData.map((item, index) => {
        return {
          time: dates[index],
          open: item[1],
          high: item[2],
          low: item[3],
          close: item[4]
        }
      })
    },

    // 交易量图表配置
    volumeChart() {
      const volumes = this.cryptoPriceData.volumes.length > 0
        ? this.cryptoPriceData.volumes
        : this.generateMockVolumes()

      const dates = this.cryptoPriceData.dates.length > 0
        ? this.cryptoPriceData.dates
        : this.generateMockDates()

      return {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderColor: '#1890ff',
          textStyle: {
            color: '#fff'
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
            formatter: '{value}',
            color: '#666'
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
            name: '交易量',
            type: 'bar',
            data: volumes,
            itemStyle: {
              color: '#1890ff'
            }
          }
        ]
      }
    }
  },
  watch: {
    selectedCoin: {
      handler(newCoin) {
        this.fetchCryptoPriceData()
      }
    },
    cryptoChartPeriod: {
      handler(newPeriod) {
        this.fetchCryptoPriceData()
      }
    }
  },
  methods: {
    // 获取加密货币价格数据
    async fetchCryptoPriceData() {
      try {
        // TODO 这里应该调用API获取数据，但为了演示使用模拟数据
        this.generateMockData()
      } catch (error) {
        this.$message.error('获取价格数据失败')
        console.error('Crypto price fetch error:', error)
        // 使用模拟数据作为备用
        this.generateMockData()
      }
    },

    // 处理币种切换
    handleCoinChange() {
      this.fetchCryptoPriceData()
    },

    // 处理周期切换
    handlePeriodChange() {
      this.fetchCryptoPriceData()
    },

    // 刷新加密货币数据
    refreshCryptoData() {
      this.fetchCryptoPriceData()
      this.$message.success('数据已刷新')
    },

    // 生成模拟日期
    generateMockDates() {
      const dates = []
      const now = new Date()
      let hours = 0

      if (this.cryptoChartPeriod === '1d') {
        // 1天数据，按小时
        for (let i = 23; i >= 0; i--) {
          const date = new Date(now)
          date.setHours(date.getHours() - i)
          dates.push(date.toISOString().slice(11, 16)) // HH:MM 格式
        }
      } else if (this.cryptoChartPeriod === '7d') {
        // 7天数据，按天
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now)
          date.setDate(date.getDate() - i)
          dates.push(date.toISOString().slice(5, 10)) // MM-DD 格式
        }
      } else if (this.cryptoChartPeriod === '30d') {
        // 30天数据，按天
        for (let i = 29; i >= 0; i -= 3) {
          const date = new Date(now)
          date.setDate(date.getDate() - i)
          dates.push(date.toISOString().slice(5, 10)) // MM-DD 格式
        }
      } else if (this.cryptoChartPeriod === '1y') {
        // 1年数据，按月
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now)
          date.setMonth(date.getMonth() - i)
          dates.push(date.toISOString().slice(0, 7)) // YYYY-MM 格式
        }
      }

      return dates
    },

    // 生成模拟蜡烛图数据
    generateMockCandlestickData() {
      const data = []
      const count = this.cryptoChartPeriod === '1d' ? 24 : this.cryptoChartPeriod === '7d' ? 7 :
        this.cryptoChartPeriod === '30d' ? 10 : 12

      // 基础价格根据不同币种设置
      let basePrice
      switch (this.selectedCoin) {
        case 'BTC':
          basePrice = 60000 + Math.random() * 5000
          break
        case 'ETH':
          basePrice = 3000 + Math.random() * 500
          break
        case 'SOL':
          basePrice = 100 + Math.random() * 20
          break
        default:
          basePrice = 60000
      }

      for (let i = 0; i < count; i++) {
        // 生成随机价格波动
        const volatility = this.selectedCoin === 'BTC' ? 0.02 :
          this.selectedCoin === 'ETH' ? 0.03 : 0.05

        const open = basePrice * (1 + (Math.random() - 0.5) * volatility)
        const close = open * (1 + (Math.random() - 0.5) * volatility)
        const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5)
        const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5)

        data.push([i, open, high, low, close])
        // 更新下一个周期的基础价格
        basePrice = close
      }

      return data
    },

    // 生成模拟交易量数据
    generateMockVolumes() {
      const volumes = []
      const count = this.cryptoChartPeriod === '1d' ? 24 : this.cryptoChartPeriod === '7d' ? 7 :
        this.cryptoChartPeriod === '30d' ? 10 : 12

      // 基础交易量根据不同币种设置
      let baseVolume
      switch (this.selectedCoin) {
        case 'BTC':
          baseVolume = 1000 + Math.random() * 500
          break
        case 'ETH':
          baseVolume = 5000 + Math.random() * 2000
          break
        case 'SOL':
          baseVolume = 50000 + Math.random() * 20000
          break
        default:
          baseVolume = 1000
      }

      for (let i = 0; i < count; i++) {
        const volume = baseVolume * (0.5 + Math.random())
        volumes.push(volume.toFixed(0))
      }

      return volumes
    },

    // 生成完整的模拟数据
    generateMockData() {
      const dates = this.generateMockDates()
      const ohlc = this.generateMockCandlestickData()
      const volumes = this.generateMockVolumes()

      this.cryptoPriceData = {
        dates,
        ohlc,
        volumes
      }

      // 设置价格信息
      const lastData = ohlc[ohlc.length - 1]
      const prevData = ohlc[ohlc.length - 2] || lastData
      const lastClose = lastData[4]
      const prevClose = prevData[4]
      const change = lastClose - prevClose
      const changePercent = (change / prevClose) * 100

      // 计算统计数据
      let sumPrice = 0
      let maxPrice = 0
      let minPrice = Infinity
      ohlc.forEach(item => {
        const avg = (item[1] + item[2] + item[3] + item[4]) / 4
        sumPrice += avg
        maxPrice = Math.max(maxPrice, item[2])
        minPrice = Math.min(minPrice, item[3])
      })
      const avgPrice = sumPrice / ohlc.length
      const volatility = ((maxPrice - minPrice) / avgPrice) * 100

      // 更新UI数据
      this.currentPrice = lastClose.toFixed(2)
      this.priceChange = (change > 0 ? '+' : '') + change.toFixed(2)
      this.priceChangePercent = (changePercent > 0 ? '+' : '') + changePercent.toFixed(2) + '%'
      this.tradingVolume = (parseFloat(volumes.reduce((a, b) => parseFloat(a) + parseFloat(b), 0))).toLocaleString()

      // 根据币种设置市值
      let marketCapValue
      switch (this.selectedCoin) {
        case 'BTC':
          marketCapValue = lastClose * 19000000
          break
        case 'ETH':
          marketCapValue = lastClose * 120000000
          break
        case 'SOL':
          marketCapValue = lastClose * 400000000
          break
        default:
          marketCapValue = lastClose * 19000000
      }
      this.marketCap = (marketCapValue / 1000000000).toFixed(2) + 'B'

      this.highPrice = maxPrice.toFixed(2)
      this.lowPrice = minPrice.toFixed(2)
      this.openPrice = lastData[1].toFixed(2)
      this.closePrice = lastData[4].toFixed(2)
      this.avgPrice = avgPrice.toFixed(2)
      this.volatility = volatility.toFixed(2)
    }
  }
}
</script>

<style lang="scss" scoped>
.crypto-price-tab {
  .controls-section {
    margin-bottom: 20px;
  }

  .chart-section {
    margin-bottom: 20px;
  }

  .indicators-section {
    margin-bottom: 20px;
  }

  .control-card {
    .control-content {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .control-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .control-label {
      font-weight: 500;
      color: #606266;
    }
  }

  .price-info-card {
    .price-info-content {
      .price-main {
        display: flex;
        align-items: baseline;
        gap: 15px;
        margin-bottom: 15px;

        .coin-symbol {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
        }

        .current-price {
          font-size: 32px;
          font-weight: bold;
          color: #303133;
        }

        .price-change {
          font-size: 16px;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .price-up {
          color: #f56c6c;
          background-color: #fef0f0;
        }

        .price-down {
          color: #67c23a;
          background-color: #f0f9eb;
        }
      }

      .price-metrics {
        display: flex;
        gap: 30px;
        flex-wrap: wrap;

        .metric-item {
          display: flex;
          align-items: center;
          gap: 8px;

          .metric-label {
            color: #606266;
            font-size: 14px;
          }

          .metric-value {
            color: #303133;
            font-weight: 500;
            font-size: 14px;
          }
        }
      }
    }
  }

  .indicator-card {
    .indicator-chart {
      height: 200px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      padding: 20px;

      .stat-grid-item {
        text-align: center;

        .stat-grid-label {
          color: #606266;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .stat-grid-value {
          color: #303133;
          font-weight: bold;
          font-size: 18px;
        }
      }
    }
  }
}
</style>
