<template>
  <div class="alarm-report-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>报警记录</span>
        <div style="float: right">
          <el-select v-model="searchForm.period" placeholder="选择时间范围" size="small" @change="fetchData">
            <el-option label="7天" value="7d"></el-option>
            <el-option label="30天" value="30d"></el-option>
            <el-option label="90天" value="90d"></el-option>
            <el-option label="1年" value="1y"></el-option>
          </el-select>
          <el-button type="primary" size="small" style="margin-left: 10px" @click="handleExport">
            <i class="el-icon-download"></i> 导出报表
          </el-button>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-container">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="stat-card total">
              <div class="stat-content">
                <div class="stat-value">{{ stats.total || 0 }}</div>
                <div class="stat-label">总报警数</div>
              </div>
              <div class="stat-icon">
                <i class="el-icon-bell"></i>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card info">
              <div class="stat-content">
                <div class="stat-value">{{ stats.info || 0 }}</div>
                <div class="stat-label">信息类</div>
              </div>
              <div class="stat-icon">
                <i class="el-icon-info"></i>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card warning">
              <div class="stat-content">
                <div class="stat-value">{{ stats.warning || 0 }}</div>
                <div class="stat-label">警告类</div>
              </div>
              <div class="stat-icon">
                <i class="el-icon-warning"></i>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card error">
              <div class="stat-content">
                <div class="stat-value">{{ stats.error || 0 }}</div>
                <div class="stat-label">错误类</div>
              </div>
              <div class="stat-icon">
                <i class="el-icon-error"></i>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 图表区域 -->
      <div class="charts-container">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="chart-card">
              <div slot="header" class="clearfix">
                <span>报警趋势</span>
              </div>
              <vab-chart :option="trendChartOption" height="300px"></vab-chart>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="chart-card">
              <div slot="header" class="clearfix">
                <span>报警渠道分布</span>
              </div>
              <vab-chart :option="channelChartOption" height="300px"></vab-chart>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 搜索条件 -->
      <div class="search-container">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="报警级别">
            <el-select v-model="searchForm.level" placeholder="请选择" size="small">
              <el-option label="全部" value=""></el-option>
              <el-option label="INFO" value="INFO"></el-option>
              <el-option label="WARNING" value="WARNING"></el-option>
              <el-option label="ERROR" value="ERROR"></el-option>
              <el-option label="CRITICAL" value="CRITICAL"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报警渠道">
            <el-select v-model="searchForm.channel" placeholder="请选择" size="small">
              <el-option label="全部" value=""></el-option>
              <el-option label="企业微信" value="wework"></el-option>
              <el-option label="钉钉" value="dingtalk"></el-option>
              <el-option label="飞书" value="feishu"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键词">
            <el-input v-model="searchForm.keyword" placeholder="请输入" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
            <el-button size="small" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 报警记录表格 -->
      <el-table v-loading="loading" :data="filteredData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="title" label="标题" show-overflow-tooltip></el-table-column>
        <el-table-column label="级别" width="100">
          <template slot-scope="scope">
            <el-tag :type="getLevelType(scope.row.level)">{{ scope.row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="渠道" width="120">
          <template slot-scope="scope">
            <el-tag :type="getChannelType(scope.row.channel)">{{ getChannelName(scope.row.channel) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sender" label="发送者" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 'SUCCESS' ? 'success' : 'danger'">
              {{ scope.row.status === 'SUCCESS' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next, jumper, total"
          :total="total"
          :current-page="page"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import {getAlarmRecords, getAlarmStats} from '@/api/alarm'

export default {
  name: 'AlarmConfigReport',
  data() {
    return {
      loading: false,
      records: [],
      total: 0,
      page: 1,
      pageSize: 10,
      stats: {
        total: 0,
        info: 0,
        warning: 0,
        error: 0
      },
      trendData: null,
      searchForm: {
        timeRange: '30d',
        level: '',
        channel: '',
        keyword: ''
      }
    }
  },
  computed: {
    // 过滤后的数据
    filteredData() {
      let data = [...this.records]

      // 按级别过滤
      if (this.searchForm.level) {
        data = data.filter(item => item.level === this.searchForm.level)
      }

      // 按渠道过滤
      if (this.searchForm.channel) {
        data = data.filter(item => item.channel === this.searchForm.channel)
      }

      // 按关键词过滤
      if (this.searchForm.keyword) {
        const keyword = this.searchForm.keyword.toLowerCase()
        data = data.filter(item =>
          item.title.toLowerCase().includes(keyword) ||
          item.message.toLowerCase().includes(keyword)
        )
      }

      // 分页处理
      const start = (this.page - 1) * this.pageSize
      const end = start + this.pageSize
      return data.slice(start, end)
    },

    // 趋势图配置
    trendChartOption() {
      // 准备数据
      let dates = []
      let counts = []

      // 如果有后端返回的趋势数据就使用，否则生成默认数据
      if (this.trendData && this.trendData.dates && this.trendData.counts) {
        dates = this.trendData.dates
        counts = this.trendData.counts
      } else {
        // 生成过去N天的日期和模拟数据
        const days = this.searchForm.timeRange === '7d' ? 7 :
          this.searchForm.timeRange === '30d' ? 30 :
            this.searchForm.timeRange === '90d' ? 90 : 365

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          dates.push(`${date.getMonth() + 1}/${date.getDate()}`)
          counts.push(Math.floor(Math.random() * 20) + 1)
        }
      }

      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'category',
          data: dates,
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: counts,
          type: 'line',
          smooth: true,
          itemStyle: {
            color: '#409EFF'
          }
        }]
      }
    },

    // 渠道分布图配置
    channelChartOption() {
      const channelData = this.getChannelStats()

      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [{
          name: '报警渠道',
          type: 'pie',
          radius: '50%',
          data: channelData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取数据
    fetchData() {
      // 使用模拟数据
      this.loading = true

      // 直接使用模拟数据
      this.records = this.getMockRecords()
      this.total = this.records.length

      // 获取统计数据
      this.fetchStats()
      this.loading = false
    },
    fetchStats() {
      // 使用模拟统计数据
      this.stats = this.calculateStats()

      // 生成默认趋势数据
      this.generateDefaultTrendData()
    },
    generateDefaultTrendData() {
      const dates = []
      const counts = []

      // 生成过去N天的日期和模拟数据
      const days = this.searchForm.timeRange === '7d' ? 7 :
        this.searchForm.timeRange === '30d' ? 30 :
          this.searchForm.timeRange === '90d' ? 90 : 365

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        dates.push(`${date.getMonth() + 1}/${date.getDate()}`)
        counts.push(Math.floor(Math.random() * 20) + 1)
      }

      this.trendData = {dates, counts}
    },

    // 获取模拟记录数据
    getMockRecords() {
      const levels = ['INFO', 'WARNING', 'ERROR', 'CRITICAL']
      const channels = ['wework', 'dingtalk', 'feishu']
      const statuses = ['SUCCESS', 'SUCCESS', 'SUCCESS', 'FAILED'] // 让成功概率更高
      const records = []

      // 生成30条模拟数据
      for (let i = 30; i > 0; i--) {
        const level = levels[Math.floor(Math.random() * levels.length)]
        const channel = channels[Math.floor(Math.random() * channels.length)]
        const date = new Date()
        date.setDate(date.getDate() - Math.floor(Math.random() * 30))
        date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))

        records.push({
          id: String(1000 + i),
          title: `${level}级报警 - ${this.getChannelName(channel)}`,
          level: level,
          channel: channel,
          message: `这是一条${level}级别的报警消息，通过${this.getChannelName(channel)}发送。`,
          sender: 'system',
          status: statuses[Math.floor(Math.random() * statuses.length)],
          createTime: date.toLocaleString('zh-CN')
        })
      }

      return records.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    },

    // 计算统计数据
    calculateStats() {
      const stats = {
        total: this.records.length,
        info: 0,
        warning: 0,
        error: 0
      }

      this.records.forEach(record => {
        if (record.level === 'INFO') stats.info++
        else if (record.level === 'WARNING') stats.warning++
        else if (record.level === 'ERROR' || record.level === 'CRITICAL') stats.error++
      })

      return stats
    },

    // 获取渠道统计
    getChannelStats() {
      const channelCounts = {}
      this.records.forEach(record => {
        if (!channelCounts[record.channel]) {
          channelCounts[record.channel] = 0
        }
        channelCounts[record.channel]++
      })

      return Object.entries(channelCounts).map(([channel, count]) => ({
        name: this.getChannelName(channel),
        value: count
      }))
    },

    // 获取渠道标签类型
    getChannelType(channel) {
      const types = {
        wework: 'primary',
        dingtalk: 'success',
        feishu: 'warning'
      }
      return types[channel] || 'info'
    },

    // 获取渠道名称
    getChannelName(channel) {
      const names = {
        wework: '企业微信',
        dingtalk: '钉钉',
        feishu: '飞书'
      }
      return names[channel] || channel
    },

    // 获取级别标签类型
    getLevelType(level) {
      const types = {
        INFO: 'info',
        WARNING: 'warning',
        ERROR: 'danger',
        CRITICAL: 'danger'
      }
      return types[level] || 'info'
    },

    // 搜索
    handleSearch() {
      this.page = 1
      this.fetchData()
    },

    // 重置
    handleReset() {
      this.searchForm = {
        period: '30d',
        level: '',
        channel: '',
        keyword: ''
      }
      this.page = 1
      this.fetchData()
    },

    // 导出报表
    handleExport() {
      // 模拟导出成功
      this.$message.success('报表导出成功')
    },

    // 分页处理
    handleCurrentChange(val) {
      this.page = val
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.page = 1
    }
  }
}
</script>

<style lang="scss" scoped>
.alarm-report-container {
  padding: 20px;

  .stats-container {
    margin-bottom: 20px;

    .stat-card {
      display: flex;
      align-items: center;
      padding: 20px;
      border-radius: 8px;
      color: #fff;

      &.total {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.info {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.warning {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      &.error {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      .stat-content {
        flex: 1;

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 14px;
          opacity: 0.8;
        }
      }

      .stat-icon {
        font-size: 32px;
        margin-left: 20px;
        opacity: 0.8;
      }
    }
  }

  .charts-container {
    margin-bottom: 20px;

    .chart-card {
      margin-bottom: 20px;
    }
  }

  .search-container {
    margin-bottom: 20px;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
