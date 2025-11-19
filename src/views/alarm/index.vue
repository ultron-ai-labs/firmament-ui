<template>
  <div class="alarm-main-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>报警中心</span>
      </div>

      <!-- 功能导航卡片 -->
      <div class="nav-cards">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="nav-card" shadow="hover" @click="$router.push('/alarm/config')">
              <div class="nav-card-content">
                <div class="nav-icon primary">
                  <i class="el-icon-setting"></i>
                </div>
                <div class="nav-info">
                  <h3>报警配置</h3>
                  <p>管理企业微信、钉钉、飞书等报警渠道</p>
                </div>
                <div class="nav-arrow">
                  <i class="el-icon-arrow-right"></i>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="nav-card" shadow="hover" @click="$router.push('/alarm/report')">
              <div class="nav-card-content">
                <div class="nav-icon success">
                  <i class="el-icon-document"></i>
                </div>
                <div class="nav-info">
                  <h3>报警记录</h3>
                  <p>查看报警历史、统计分析和报表导出</p>
                </div>
                <div class="nav-arrow">
                  <i class="el-icon-arrow-right"></i>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 快速统计 -->
      <div class="quick-stats">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-number">{{ quickStats.configCount }}</div>
              <div class="stat-label">配置总数</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-number">{{ quickStats.activeConfigCount }}</div>
              <div class="stat-label">活跃配置</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-number">{{ quickStats.todayAlarmCount }}</div>
              <div class="stat-label">今日报警</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-number">{{ quickStats.totalAlarmCount }}</div>
              <div class="stat-label">总报警数</div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 最近报警 -->
      <div class="recent-alarms">
        <h3 class="section-title">最近报警 <span class="text-link" @click="$router.push('/alarm/report')">查看全部</span></h3>
        <el-table :data="recentAlarmList" stripe style="width: 100%">
          <el-table-column prop="title" label="标题" show-overflow-tooltip width="200"></el-table-column>
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
          <el-table-column prop="createTime" label="时间" width="180"></el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import {getAlarmConfigs, getAlarmRecords} from '@/api/alarm'

export default {
  name: 'AlarmMain',
  data() {
    return {
      loading: false,
      quickStats: {
        configCount: 0,
        activeConfigCount: 0,
        todayAlarmCount: 0,
        totalAlarmCount: 0
      },
      recentAlarmList: []
    }
  },
  created() {
    // 初始化数据
    this.fetchOverviewData()
  },
  methods: {
    // 获取概览数据
    fetchOverviewData() {
      this.loading = true
      // 使用模拟数据作为备用
      this.quickStats = this.getMockQuickStats()
      this.recentAlarmList = this.getMockRecentAlarms()
      this.loading = false
    },

    // 获取模拟配置数据
    getMockConfigs() {
      return [
        {
          id: '1',
          name: '系统异常报警-企业微信',
          channel: 'wework',
          level: 'ERROR',
          status: true
        },
        {
          id: '2',
          name: '交易信号提醒-钉钉',
          channel: 'dingtalk',
          level: 'WARNING',
          status: true
        },
        {
          id: '3',
          name: '每日报告-飞书',
          channel: 'feishu',
          level: 'INFO',
          status: false
        }
      ]
    },

    // 获取模拟记录数据
    getMockRecords() {
      const records = []
      const levels = ['INFO', 'WARNING', 'ERROR', 'CRITICAL']
      const channels = ['wework', 'dingtalk', 'feishu']

      for (let i = 10; i > 0; i--) {
        const date = new Date()
        date.setHours(date.getHours() - i)

        records.push({
          id: String(2000 + i),
          title: `系统通知 ${i}`,
          level: levels[Math.floor(Math.random() * levels.length)],
          channel: channels[Math.floor(Math.random() * channels.length)],
          createTime: date.toLocaleString('zh-CN')
        })
      }

      return records
    },

    // 获取模拟统计数据
    getMockQuickStats() {
      return {
        configCount: 3,
        activeConfigCount: 2,
        todayAlarmCount: 5,
        totalAlarmCount: 30
      }
    },

    // 获取模拟最近报警
    getMockRecentAlarms() {
      return [
        {
          id: '2010',
          title: '系统负载过高警告',
          level: 'WARNING',
          channel: 'wework',
          createTime: new Date().toLocaleString('zh-CN')
        },
        {
          id: '2009',
          title: '交易异常提醒',
          level: 'ERROR',
          channel: 'dingtalk',
          createTime: new Date(Date.now() - 60 * 60 * 1000).toLocaleString('zh-CN')
        },
        {
          id: '2008',
          title: '每日系统报告',
          level: 'INFO',
          channel: 'feishu',
          createTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString('zh-CN')
        },
        {
          id: '2007',
          title: '数据库连接异常',
          level: 'CRITICAL',
          channel: 'wework',
          createTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toLocaleString('zh-CN')
        },
        {
          id: '2006',
          title: 'API调用频率过高',
          level: 'WARNING',
          channel: 'dingtalk',
          createTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toLocaleString('zh-CN')
        }
      ]
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
    }
  }
}
</script>

<style lang="scss" scoped>
.alarm-main-container {
  padding: 20px;

  .nav-cards {
    margin-bottom: 30px;

    .nav-card {
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }

      .nav-card-content {
        display: flex;
        align-items: center;

        .nav-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: #fff;
          margin-right: 20px;

          &.primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          &.success {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          }
        }

        .nav-info {
          flex: 1;

          h3 {
            margin: 0 0 5px 0;
            font-size: 18px;
            color: #333;
          }

          p {
            margin: 0;
            font-size: 14px;
            color: #666;
          }
        }

        .nav-arrow {
          color: #999;
          font-size: 20px;
        }
      }
    }
  }

  .quick-stats {
    margin-bottom: 30px;

    .stat-item {
      background: #f5f7fa;
      padding: 20px;
      text-align: center;
      border-radius: 8px;

      .stat-number {
        font-size: 28px;
        font-weight: bold;
        color: #409EFF;
        margin-bottom: 5px;
      }

      .stat-label {
        font-size: 14px;
        color: #606266;
      }
    }
  }

  .recent-alarms {

    .section-title {
      margin: 0 0 15px 0;
      font-size: 16px;
      color: #303133;

      .text-link {
        float: right;
        font-size: 14px;
        color: #409EFF;
        cursor: pointer;

        &:hover {
          color: #66b1ff;
        }
      }
    }
  }
}
</style>
