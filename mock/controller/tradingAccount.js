const Mock = require('mockjs')

// 模拟交易账户数据
const tradingAccounts = Mock.mock({
  'data|15': [
    {
      id: '@guid',
      exchange: function() {
        const exchanges = ['Binance', 'OKX', 'Huobi', 'Coinbase', 'Kraken']
        return exchanges[Math.floor(Math.random() * exchanges.length)]
      },
      apiKey: function() {
        return 'api_' + Mock.Random.string(20, 30)
      },
      secretKey: function() {
        return 'secret_' + Mock.Random.string(30, 40)
      },
      apiName: function() {
        const names = ['主账户', '测试账户', '交易账户1', '交易账户2', '风险账户']
        return names[Math.floor(Math.random() * names.length)]
      },
      passphrase: function() {
        return Math.random() > 0.5 ? 'pass_' + Mock.Random.string(8, 16) : ''
      },
      simulation: function() {
        return Math.random() > 0.7 ? 1 : 0
      },
      createdAt: '@datetime',
      updatedAt: '@datetime'
    }
  ]
}).data

// 模拟分页查询
const getTradingAccounts = (config) => {
  let { page = 1, pageSize = 10, exchange = '', apiName = '', simulation = '' } = config.params
  page = parseInt(page)
  pageSize = parseInt(pageSize)
  simulation = simulation ? parseInt(simulation) : ''
  
  // 过滤数据
  let filteredData = tradingAccounts.filter(item => {
    let match = true
    if (exchange && !item.exchange.toLowerCase().includes(exchange.toLowerCase())) {
      match = false
    }
    if (apiName && !item.apiName.toLowerCase().includes(apiName.toLowerCase())) {
      match = false
    }
    if (simulation !== '' && item.simulation !== simulation) {
      match = false
    }
    return match
  })
  
  // 计算分页
  const total = filteredData.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filteredData.slice(start, end)
  
  return {
    code: 200,
    msg: 'success',
    data: {
      list,
      total,
      page,
      pageSize
    }
  }
}

// 模拟创建账户
const createTradingAccount = (config) => {
  const account = JSON.parse(config.body)
  const newAccount = {
    id: Mock.Random.guid(),
    ...account,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  tradingAccounts.unshift(newAccount)
  
  return {
    code: 200,
    msg: 'success',
    data: newAccount
  }
}

// 模拟更新账户
const updateTradingAccount = (config) => {
  const url = config.url
  const id = url.split('/').pop()
  const account = JSON.parse(config.body)
  
  const index = tradingAccounts.findIndex(item => item.id === id)
  if (index !== -1) {
    tradingAccounts[index] = {
      ...tradingAccounts[index],
      ...account,
      updatedAt: new Date().toISOString()
    }
    
    return {
      code: 200,
      msg: 'success',
      data: tradingAccounts[index]
    }
  } else {
    return {
      code: 404,
      msg: '账户不存在'
    }
  }
}

// 模拟删除账户
const deleteTradingAccount = (config) => {
  const url = config.url
  const id = url.split('/').pop()
  
  const index = tradingAccounts.findIndex(item => item.id === id)
  if (index !== -1) {
    tradingAccounts.splice(index, 1)
    
    return {
      code: 200,
      msg: 'success'
    }
  } else {
    return {
      code: 404,
      msg: '账户不存在'
    }
  }
}

// 模拟测试连接
const testAccountConnection = () => {
  return {
    code: 200,
    msg: 'success',
    data: {
      connected: true,
      message: '连接成功'
    }
  }
}

// 导出mock配置
module.exports = {
  'GET /api/trading/accounts': getTradingAccounts,
  'POST /api/trading/accounts': createTradingAccount,
  'PUT /api/trading/accounts/(.*)': updateTradingAccount,
  'DELETE /api/trading/accounts/(.*)': deleteTradingAccount,
  'POST /api/trading/accounts/test': testAccountConnection
}