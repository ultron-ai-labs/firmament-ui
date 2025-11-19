<template>
  <div class="kline-chart">
    <div ref="klineContainer" class="kline-container"></div>
  </div>
</template>

<script>
// 导入klinecharts库 (v9版本)
import { init } from 'klinecharts'

export default {
  name: 'KlineChart',
  props: {
    chartData: {
      type: [Array, String],
      default: () => []
    },
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      chartInstance: null
    }
  },
  mounted() {
    this.initChart()
    
    // 监听窗口大小变化
    window.addEventListener('resize', this.resize)
  },
  watch: {
    chartData: {
      handler(newData) {
        // 处理JSON字符串或数组格式的数据
        const processedData = this.processChartData(newData)
        if (this.chartInstance && processedData.length > 0) {
          // 使用v9版本API更新数据
          this.chartInstance.applyNewData(processedData)
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    if (this.chartInstance) {
      // 使用实例方法销毁图表
      this.chartInstance.dispose()
      this.chartInstance = null
    }
    
    // 移除事件监听
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    // 处理图表数据
    processChartData(data) {
      // 如果数据是字符串，尝试解析为JSON
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data)
        } catch (error) {
          console.error('Failed to parse chartData JSON:', error)
          return []
        }
      }
      
      // 如果不是数组，返回空数组
      if (!Array.isArray(data)) {
        return []
      }
      
      // 处理每个数据点，确保time字段是有效的时间戳
      return data.map(item => {
        // 深拷贝以避免修改原始数据
        const processedItem = { ...item }
        
        // 确保time字段存在且是有效的时间戳
        if (processedItem.time) {
          // 如果time已经是数字，确保是有效时间戳
          if (typeof processedItem.time === 'number') {
            // 检查是否为有效时间戳（在合理范围内）
            if (!isNaN(processedItem.time) && processedItem.time > 0 && processedItem.time < 9e15) {
              // 如果时间戳是秒级的，转换为毫秒级
              if (processedItem.time.toString().length <= 10) {
                processedItem.time = processedItem.time * 1000
              }
            } else {
              console.warn('Invalid timestamp detected:', processedItem.time)
              // 使用当前时间作为备选
              processedItem.time = Date.now()
            }
          } 
          // 如果time是字符串，尝试转换为时间戳
          else if (typeof processedItem.time === 'string') {
            const parsedTime = Date.parse(processedItem.time)
            if (!isNaN(parsedTime)) {
              processedItem.time = parsedTime
            } else {
              console.warn('Failed to parse time string:', processedItem.time)
              // 使用当前时间作为备选
              processedItem.time = Date.now()
            }
          }
        } else {
          // 如果没有time字段，使用当前时间
          console.warn('Missing time field in data item')
          processedItem.time = Date.now()
        }
        
        return processedItem
      })
    },

    initChart() {
      // 确保容器存在且有尺寸
      if (!this.$refs.klineContainer) {
        console.error('Kline chart container not found')
        return
      }
      
      const defaultConfig = {
        width: this.$refs.klineContainer.offsetWidth || 800,
        height: this.$refs.klineContainer.offsetHeight || 400,
        grid: {
          left: 60,
          right: 80,
          top: 40,
          bottom: 40
        },
        timeScale: {
          visible: true,
          timeVisible: true,
          secondsVisible: false,
          borderVisible: false,
          tickVisible: true,
          tickMarkLineVisible: true,
          timeTextAlign: 'center',
          timeTextFont: {
            fontSize: 12
          }
        },
        crosshair: {
          style: {
            line: {
              color: '#A9A9A9',
              width: 1,
              style: [1, 1]
            },
            text: {
              backgroundColor: '#434343',
              color: '#fff',
              fontSize: 12,
              padding: [2, 4]
            }
          }
        },
        candlestick: {
          visible: true,
          upColor: '#ef232a',
          downColor: '#27727b',
          borderColor: '#ef232a',
          borderDownColor: '#27727b',
          borderWidth: 1
        },
        tooltip: {
          visible: true,
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderColor: '#1890ff',
            textColor: '#fff',
            fontSize: 12,
            padding: [8, 12],
            borderRadius: 4
          },
          formatter: (data) => {
            if (!data || !data.candlestick) return []
            const d = data.candlestick
            const change = (d.close - d.open).toFixed(2)
            const changePercent = ((d.close - d.open) / d.open * 100).toFixed(2)
            return [
              { key: '时间', value: d.time },
              { key: '开盘', value: `$${d.open.toFixed(2)}` },
              { key: '最高', value: `$${d.high.toFixed(2)}` },
              { key: '最低', value: `$${d.low.toFixed(2)}` },
              { key: '收盘', value: `$${d.close.toFixed(2)}` },
              { key: '涨跌', value: `${change > 0 ? '+' : ''}${change}` },
              { key: '幅度', value: `${changePercent > 0 ? '+' : ''}${changePercent}%` }
            ]
          }
        },
        yAxis: {
          position: 'left',
          style: {
            axis: {
              color: '#6E7079'
            },
            tick: {
              color: '#6E7079'
            },
            text: {
              color: '#6E7079',
              fontSize: 12
            }
          },
          formatter: (value) => `$${value.toFixed(2)}`
        },
        technicalIndicator: {
          visible: false
        }
      }

      const finalConfig = { ...defaultConfig, ...this.config }
      
      try {
        // 创建图表实例 (v9版本)
        this.chartInstance = init(this.$refs.klineContainer, finalConfig)
        
        // 如果有数据，设置数据 (v9版本API)
        const processedData = this.processChartData(this.chartData)
        if (processedData.length > 0) {
          this.chartInstance.applyNewData(processedData)
        }
      } catch (error) {
        console.error('Failed to initialize kline chart:', error)
      }
    },
    resize() {
      if (this.chartInstance) {
        try {
          // 使用v9版本API调整大小
          this.chartInstance.resize({
            width: this.$refs.klineContainer.offsetWidth || 800,
            height: this.$refs.klineContainer.offsetHeight || 400
          })
        } catch (error) {
          console.error('Failed to resize kline chart:', error)
        }
      }
    }
  },
  updated() {
    // 组件更新后重新调整大小
    this.$nextTick(() => {
      this.resize()
    })
  }
}
</script>

<style scoped>
.kline-chart {
  width: 100%;
  height: 100%;
}
.kline-container {
  width: 100%;
  height: 400px;
  min-height: 400px;
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>