// 大盘页面模拟数据控制器

// 生成模拟的资产趋势数据
function generateMockTrendData(count) {
  const baseValue = 1200000
  const values = []
  
  for (let i = 0; i < count; i++) {
    // 生成一个逐渐上升的数据，带一些随机波动
    const trend = baseValue + (i * 1500)
    const random = Math.random() * 8000 - 4000
    const value = trend + random
    values.push(value.toFixed(2))
  }
  
  return values
}

// 生成日期范围
function getDateRange(period) {
  const dates = []
  const now = new Date()
  let days
  
  switch (period) {
    case '7d':
      days = 7
      break
    case '30d':
      days = 30
      break
    case '90d':
      days = 90
      break
    case '1y':
      days = 365
      break
    default:
      days = 30
  }
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    dates.push(`${month}-${day}`)
  }
  
  return dates
}

// 生成热力图数据
function generateHeatmapData() {
  const coins = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'DOT', 'AVAX']
  const signals = ['买入', '卖出', '持有', '观望', '减仓', '加仓']
  
  const data = []
  coins.forEach(coin => {
    const row = []
    signals.forEach(signal => {
      const value = Math.floor(Math.random() * 100)
      row.push({
        label: signal,
        value: value
      })
    })
    data.push(row)
  })
  
  return data
}

module.exports = [
  // 获取大盘概览数据
  {
    url: '/api/dashboard/overview',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        message: 'success',
        data: {
          totalAssets: '¥1,245,678.90',
          totalAssetsChange: '+4.23%',
          totalProfit: '¥123,456.78',
          totalProfitChange: '+3.15%',
          profitRate: '+18.45%',
          profitRateChange: '+1.24%',
          floatingPnl: '¥1,234.56',
          floatingPnlChange: '+0.89%',
          status: '正常',
          statusClass: 'status-normal',
          runningStrategies: 12,
          todayTrades: 156,
          apiStatus: '正常',
          lastTradeTime: '2024-01-20 14:30:22',
          trendDescription: '近30天资产稳步增长，整体表现良好'
        }
      }
    }
  },
  
  // 获取资产趋势数据
  {
    url: '/api/dashboard/asset-trend',
    type: 'get',
    response: (config) => {
      const period = config.query.period || '30d'
      const dates = getDateRange(period)
      const values = generateMockTrendData(dates.length)
      
      return {
        code: 20000,
        message: 'success',
        data: {
          dates: dates,
          values: values,
          period: period
        }
      }
    }
  },
  
  // 获取资产分布数据
  {
    url: '/api/dashboard/asset-distribution',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        message: 'success',
        data: {
          distribution: [
            { value: 35, name: 'BTC', itemStyle: { color: '#f7931a' } },
            { value: 25, name: 'ETH', itemStyle: { color: '#627eea' } },
            { value: 15, name: 'USDT', itemStyle: { color: '#2ca07a' } },
            { value: 10, name: 'BNB', itemStyle: { color: '#f3ba2f' } },
            { value: 15, name: '其他', itemStyle: { color: '#6c757d' } }
          ]
        }
      }
    }
  },
  
  // 获取交易信号热力图数据
  {
    url: '/api/dashboard/trade-signals',
    type: 'get',
    response: () => {
      const heatmapData = generateHeatmapData()
      
      return {
        code: 20000,
        message: 'success',
        data: {
          heatmapData: heatmapData
        }
      }
    }
  },
  
  // 获取性能指标数据
  {
    url: '/api/dashboard/metrics',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        message: 'success',
        data: {
          metrics: [
            { label: '夏普比率', value: '2.34', progress: 78, color: '#409EFF' },
            { label: '最大回撤', value: '8.23%', progress: 35, color: '#67C23A' },
            { label: '胜率', value: '65.2%', progress: 65, color: '#E6A23C' },
            { label: '盈亏比', value: '1.8:1', progress: 70, color: '#F56C6C' }
          ]
        }
      }
    }
  },
  
  // 获取AI模型表现数据
  {
    url: '/api/dashboard/ai-models',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        message: 'success',
        data: {
          aiModels: [
            {
              id: '1',
              name: '智能保守型策略',
              status: '运行中',
              statusClass: 'status-running',
              accuracy: '89.5%',
              profitRate: '+12.3%',
              description: '低风险稳定收益策略，适合长期持有'
            },
            {
              id: '2',
              name: '智能进取型策略',
              status: '运行中',
              statusClass: 'status-running',
              accuracy: '82.1%',
              profitRate: '+15.7%',
              description: '中高风险高收益策略，适合积极投资者'
            },
            {
              id: '3',
              name: '对冲套利策略',
              status: '运行中',
              statusClass: 'status-running',
              accuracy: '76.8%',
              profitRate: '+8.9%',
              description: '跨市场套利策略，风险相对较低'
            },
            {
              id: '4',
              name: '动量追踪策略',
              status: '已暂停',
              statusClass: 'status-paused',
              accuracy: '79.2%',
              profitRate: '+14.5%',
              description: '追踪市场动量，捕捉短期趋势'
            },
            {
              id: '5',
              name: '均值回归策略',
              status: '运行中',
              statusClass: 'status-running',
              accuracy: '81.7%',
              profitRate: '+10.3%',
              description: '基于价格回归均值的交易策略'
            }
          ]
        }
      }
    }
  },
  
  // 获取实时交易数据
  {
    url: '/api/dashboard/recent-trades',
    type: 'get',
    response: () => {
      const trades = []
      const types = ['买入', '卖出']
      const coins = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA']
      
      for (let i = 0; i < 10; i++) {
        const type = types[Math.floor(Math.random() * types.length)]
        const coin = coins[Math.floor(Math.random() * coins.length)]
        const price = (Math.random() * 50000 + 1000).toFixed(2)
        const amount = (Math.random() * 10 + 0.1).toFixed(4)
        const total = (price * amount).toFixed(2)
        const time = new Date(Date.now() - i * 60000 * (Math.random() * 30 + 5)).toLocaleString('zh-CN')
        
        trades.push({
          id: `trade_${i}`,
          type: type,
          coin: coin,
          price: price,
          amount: amount,
          total: total,
          time: time,
          status: '已完成'
        })
      }
      
      return {
        code: 20000,
        message: 'success',
        data: {
          trades: trades
        }
      }
    }
  }
]