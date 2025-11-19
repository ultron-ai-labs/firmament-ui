const Mock = require('mockjs')
const dayjs = require('dayjs')

// 时间单位映射（毫秒）
const TIME_UNIT_MAP = {
  '1m': 60 * 1000,
  '3m': 3 * 60 * 1000,
  '5m': 5 * 60 * 1000,
  '15m': 15 * 60 * 1000,
  '30m': 30 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '4h': 4 * 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000
}

// 模拟K线历史数据
const getKlineHistoryData = (req, res) => {
  const { page = 1, pageSize = 20, exchange, cryptoCode, timeUnit = '1h', startTime, endTime } = req.query
  
  // 模拟总数据量
  const total = 1000
  
  // 生成模拟数据
  const records = []
  const now = Date.now()
  const interval = TIME_UNIT_MAP[timeUnit] || TIME_UNIT_MAP['1h']
  
  // 计算起始索引
  const startIndex = (page - 1) * pageSize
  
  // 基础价格根据币种模拟
  let basePrice = 40000
  if (cryptoCode && cryptoCode.includes('ETH')) {
    basePrice = 2000
  } else if (cryptoCode && cryptoCode.includes('SOL')) {
    basePrice = 100
  }
  
  // 生成每页数据
  for (let i = 0; i < pageSize; i++) {
    const index = startIndex + i
    const openTime = now - (total - index) * interval
    
    // 模拟价格波动
    const open = basePrice + (Math.random() - 0.5) * 1000 + index * 0.1
    const close = open + (Math.random() - 0.5) * 500
    const high = Math.max(open, close) + Math.random() * 300
    const low = Math.min(open, close) - Math.random() * 300
    const volume = 100 + Math.random() * 900
    
    records.push({
      cryptoCode: cryptoCode || Mock.Random.pick(['binance-BTC-USDT-SWAP', 'okx-ETH-USDT-SWAP', 'gate-SOL-USDT']),
      exchange: exchange || Mock.Random.pick(['binance', 'okx', 'gate']),
      timeUnit: timeUnit,
      openTime: openTime,
      open: open.toFixed(2),
      high: high.toFixed(2),
      low: low.toFixed(2),
      close: close.toFixed(2),
      volume: volume.toFixed(4)
    })
  }
  
  // 模拟延迟
  setTimeout(() => {
    res.json({
      code: 200,
      msg: 'success',
      data: {
        records,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    })
  }, 300)
}

// 获取交易所列表
const getExchangeList = (req, res) => {
  const exchanges = [
    { label: '币安', value: 'binance' },
    { label: '欧易', value: 'okx' },
    { label: 'Gate.io', value: 'gate' }
  ]
  
  res.json({
    code: 200,
    msg: 'success',
    data: exchanges
  })
}

// 获取币种列表
const getCryptoList = (req, res) => {
  const { exchange } = req.query
  
  let cryptoList = []
  
  if (exchange === 'binance') {
    cryptoList = [
      { label: 'BTC-USDT-SWAP', value: 'binance-BTC-USDT-SWAP' },
      { label: 'ETH-USDT-SWAP', value: 'binance-ETH-USDT-SWAP' },
      { label: 'SOL-USDT-SWAP', value: 'binance-SOL-USDT-SWAP' }
    ]
  } else if (exchange === 'okx') {
    cryptoList = [
      { label: 'BTC-USDT-SWAP', value: 'okx-BTC-USDT-SWAP' },
      { label: 'ETH-USDT-SWAP', value: 'okx-ETH-USDT-SWAP' },
      { label: 'SOL-USDT-SWAP', value: 'okx-SOL-USDT-SWAP' }
    ]
  } else if (exchange === 'gate') {
    cryptoList = [
      { label: 'BTC_USDT', value: 'gate-BTC-USDT' },
      { label: 'ETH_USDT', value: 'gate-ETH-USDT' },
      { label: 'SOL_USDT', value: 'gate-SOL-USDT' }
    ]
  } else {
    // 默认返回所有币种
    cryptoList = [
      { label: 'binance-BTC-USDT-SWAP', value: 'binance-BTC-USDT-SWAP' },
      { label: 'okx-ETH-USDT-SWAP', value: 'okx-ETH-USDT-SWAP' },
      { label: 'gate-SOL-USDT', value: 'gate-SOL-USDT' }
    ]
  }
  
  res.json({
    code: 200,
    msg: 'success',
    data: cryptoList
  })
}

// 获取时间周期列表
const getTimeUnitList = (req, res) => {
  const timeUnits = [
    { label: '1分钟', value: '1m' },
    { label: '3分钟', value: '3m' },
    { label: '5分钟', value: '5m' },
    { label: '15分钟', value: '15m' },
    { label: '30分钟', value: '30m' },
    { label: '1小时', value: '1h' },
    { label: '4小时', value: '4h' },
    { label: '1天', value: '1d' }
  ]
  
  res.json({
    code: 200,
    msg: 'success',
    data: timeUnits
  })
}

module.exports = {
  'GET /api/exchange/klineHistory': getKlineHistoryData,
  'GET /api/exchange/list': getExchangeList,
  'GET /api/exchange/cryptoList': getCryptoList,
  'GET /api/exchange/timeUnitList': getTimeUnitList
}