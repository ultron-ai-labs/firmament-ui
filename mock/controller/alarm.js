// 报警模块模拟数据控制器

/**
 * 生成模拟报警配置数据
 */
function generateMockConfigs() {
  return [
    {
      id: '1',
      name: '系统异常报警-企业微信',
      channel: 'wework',
      level: 'ERROR',
      status: true,
      config: {
        corpId: 'ww1234567890123456',
        appSecret: 'abcdefghijklmnopqrstuvwxyz',
        agentId: '1000001',
        toUser: '@all',
        toParty: '',
        toTag: ''
      },
      createTime: '2023-07-15 10:30:00',
      updateTime: '2023-07-15 10:30:00'
    },
    {
      id: '2',
      name: '交易信号提醒-钉钉',
      channel: 'dingtalk',
      level: 'WARNING',
      status: true,
      config: {
        webhookUrl: 'https://oapi.dingtalk.com/robot/send?access_token=testtoken',
        secret: 'SEC1234567890abcdefghijklmnopqrstuvwxyz',
        isAtAll: false,
        atMobiles: ['13800138000', '13900139000']
      },
      createTime: '2023-07-16 14:20:00',
      updateTime: '2023-07-16 14:20:00'
    },
    {
      id: '3',
      name: '每日报告-飞书',
      channel: 'feishu',
      level: 'INFO',
      status: false,
      config: {
        webhookUrl: 'https://open.feishu.cn/open-apis/bot/v2/hook/test-hook',
        secret: 'SEC1234567890abcdefghijklmnopqrstuvwxyz',
        atUserIds: ['ou_1234567890', 'ou_0987654321']
      },
      createTime: '2023-07-17 09:15:00',
      updateTime: '2023-07-17 09:15:00'
    },
    {
      id: '4',
      name: '数据库性能监控-企业微信',
      channel: 'wework',
      level: 'WARNING',
      status: true,
      config: {
        corpId: 'ww1234567890123456',
        appSecret: 'abcdefghijklmnopqrstuvwxyz',
        agentId: '1000002',
        toUser: '',
        toParty: '1001',
        toTag: ''
      },
      createTime: '2023-07-18 16:45:00',
      updateTime: '2023-07-18 16:45:00'
    }
  ]
}

/**
 * 生成模拟报警记录数据
 */
function generateMockRecords() {
  const levels = ['INFO', 'WARNING', 'ERROR', 'CRITICAL']
  const channels = ['wework', 'dingtalk', 'feishu']
  const statuses = ['SUCCESS', 'SUCCESS', 'SUCCESS', 'FAILED'] // 让成功概率更高
  const titles = {
    INFO: ['系统启动完成', '定时任务执行', '配置更新', '服务状态正常', '数据同步完成'],
    WARNING: ['CPU使用率过高', '内存占用增长', '请求延迟增加', '磁盘空间不足', '网络连接异常'],
    ERROR: ['服务崩溃', '数据库连接失败', 'API调用异常', '权限验证失败', '数据处理错误'],
    CRITICAL: ['系统宕机', '数据丢失', '安全漏洞', '网络中断', '核心服务异常']
  }
  
  const records = []
  
  // 生成90天的模拟数据，大约每天2-5条记录
  for (let day = 0; day < 90; day++) {
    const recordCount = Math.floor(Math.random() * 4) + 2 // 每天2-5条记录
    
    for (let i = 0; i < recordCount; i++) {
      const level = levels[Math.floor(Math.random() * levels.length)]
      const channel = channels[Math.floor(Math.random() * channels.length)]
      const titleOptions = titles[level]
      const title = titleOptions[Math.floor(Math.random() * titleOptions.length)]
      
      const date = new Date()
      date.setDate(date.getDate() - day)
      date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))
      
      records.push({
        id: String(1000000 + day * 10 + i),
        title: `${level} - ${title}`,
        level: level,
        channel: channel,
        message: `这是一条${level}级别的报警消息，详细信息：${title}。系统检测到异常情况，请及时处理。`,
        sender: 'monitoring-system',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createTime: date.toLocaleString('zh-CN')
      })
    }
  }
  
  return records.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
}

/**
 * 根据时间范围计算统计数据
 */
function calculateStats(records, period) {
  let filteredRecords = records
  
  // 根据时间范围过滤
  const now = new Date()
  const days = period === '7d' ? 7 : 
              period === '30d' ? 30 : 
              period === '90d' ? 90 : 365
  
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  filteredRecords = records.filter(record => {
    return new Date(record.createTime) >= startDate
  })
  
  const stats = {
    total: filteredRecords.length,
    info: 0,
    warning: 0,
    error: 0
  }
  
  filteredRecords.forEach(record => {
    if (record.level === 'INFO') stats.info++
    else if (record.level === 'WARNING') stats.warning++
    else if (record.level === 'ERROR' || record.level === 'CRITICAL') stats.error++
  })
  
  return stats
}

/**
 * 生成趋势图数据
 */
function generateTrendData(records, period) {
  const days = period === '7d' ? 7 : 
              period === '30d' ? 30 : 
              period === '90d' ? 90 : 365
  
  const dateMap = new Map()
  
  // 初始化每一天的数据
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`
    dateMap.set(dateStr, 0)
  }
  
  // 统计每一天的报警数量
  records.forEach(record => {
    const recordDate = new Date(record.createTime)
    const dateStr = `${recordDate.getMonth() + 1}/${recordDate.getDate()}`
    if (dateMap.has(dateStr)) {
      dateMap.set(dateStr, dateMap.get(dateStr) + 1)
    }
  })
  
  return { dates: Array.from(dateMap.keys()), counts: Array.from(dateMap.values()) }
}

// 存储模拟数据
let mockConfigs = generateMockConfigs()
let mockRecords = generateMockRecords()

module.exports = [
  // 获取报警配置列表
  {
    url: '/api/alarm/configs',
    type: 'get',
    response: () => {
      return {
        code: 200,
        msg: 'success',
        data: mockConfigs
      }
    }
  },
  
  // 获取报警配置详情
  {
    url: '/api/alarm/configs/:id',
    type: 'get',
    response: (req) => {
      const id = req.params.id
      const config = mockConfigs.find(item => item.id === id)
      return {
        code: 200,
        msg: 'success',
        data: config || null
      }
    }
  },
  
  // 创建报警配置
  {
    url: '/api/alarm/configs',
    type: 'post',
    response: (req) => {
      const newConfig = {
        ...req.body,
        id: String(Date.now()),
        createTime: new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN')
      }
      mockConfigs.push(newConfig)
      return {
        code: 200,
        msg: '创建成功',
        data: newConfig
      }
    }
  },
  
  // 更新报警配置
  {
    url: '/api/alarm/configs/:id',
    type: 'put',
    response: (req) => {
      const id = req.params.id
      const index = mockConfigs.findIndex(item => item.id === id)
      if (index !== -1) {
        mockConfigs[index] = {
          ...mockConfigs[index],
          ...req.body,
          updateTime: new Date().toLocaleString('zh-CN')
        }
        return {
          code: 200,
          msg: '更新成功',
          data: mockConfigs[index]
        }
      } else {
        return {
          code: 404,
          msg: '配置不存在'
        }
      }
    }
  },
  
  // 删除报警配置
  {
    url: '/api/alarm/configs/:id',
    type: 'delete',
    response: (req) => {
      const id = req.params.id
      mockConfigs = mockConfigs.filter(item => item.id !== id)
      return {
        code: 200,
        msg: '删除成功'
      }
    }
  },
  
  // 获取报警记录列表
  {
    url: '/api/alarm/records',
    type: 'get',
    response: (req) => {
      // 支持分页和搜索参数
      const { page = 1, pageSize = 10, level, channel, keyword } = req.query
      
      let filteredRecords = [...mockRecords]
      
      // 过滤条件
      if (level) {
        filteredRecords = filteredRecords.filter(record => record.level === level)
      }
      
      if (channel) {
        filteredRecords = filteredRecords.filter(record => record.channel === channel)
      }
      
      if (keyword) {
        const lowerKeyword = keyword.toLowerCase()
        filteredRecords = filteredRecords.filter(record => 
          record.title.toLowerCase().includes(lowerKeyword) ||
          record.message.toLowerCase().includes(lowerKeyword)
        )
      }
      
      // 分页
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const paginatedRecords = filteredRecords.slice(start, end)
      
      return {
        code: 200,
        msg: 'success',
        data: paginatedRecords,
        total: filteredRecords.length
      }
    }
  },
  
  // 获取报警统计数据
  {
    url: '/api/alarm/stats',
    type: 'get',
    response: (req) => {
      const { period = '30d' } = req.query
      const stats = calculateStats(mockRecords, period)
      
      return {
        code: 200,
        msg: 'success',
        data: stats
      }
    }
  },
  
  // 测试报警通道
  {
    url: '/api/alarm/test',
    type: 'post',
    response: (req) => {
      const { channel, config } = req.body
      
      return {
        code: 200,
        msg: `测试成功，通过${channel}渠道发送了测试消息`,
        data: {
          success: true,
          channel: channel,
          timestamp: new Date().toLocaleString('zh-CN')
        }
      }
    }
  },
  
  // 获取概览数据
  {
    url: '/api/alarm/overview',
    type: 'get',
    response: () => {
      const configCount = mockConfigs.length
      const activeConfigCount = mockConfigs.filter(c => c.status).length
      const totalAlarmCount = mockRecords.length
      
      // 计算今日报警数
      const today = new Date().toLocaleDateString('zh-CN')
      const todayAlarmCount = mockRecords.filter(r => {
        return new Date(r.createTime).toLocaleDateString('zh-CN') === today
      }).length
      
      // 获取最近5条报警
      const recentAlarms = mockRecords.slice(0, 5)
      
      return {
        code: 200,
        msg: 'success',
        data: {
          quickStats: {
            configCount,
            activeConfigCount,
            todayAlarmCount,
            totalAlarmCount
          },
          recentAlarms
        }
      }
    }
  }
]
