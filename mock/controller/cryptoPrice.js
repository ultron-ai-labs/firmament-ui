const Mock = require('mockjs')

// 模拟币种基础价格数据
const basePrices = {
  btc: 60000,
  eth: 3000,
  sol: 100,
  usdt: 1,
  bnb: 500,
  xrp: 0.5,
  ada: 0.5,
  dot: 10
}

// 模拟币种市场数据
const mockMarketData = {
  btc: {
    marketCap: '1.2T',
    volume24h: '45B',
    circulatingSupply: '20.5M',
    maxSupply: '21M',
    priceChange24h: '+2.5%',
    priceChange7d: '+5.8%',
    priceChange30d: '-1.2%'
  },
  eth: {
    marketCap: '380B',
    volume24h: '25B',
    circulatingSupply: '120M',
    maxSupply: 'Infinity',
    priceChange24h: '+1.8%',
    priceChange7d: '+4.2%',
    priceChange30d: '-2.1%'
  },
  sol: {
    marketCap: '45B',
    volume24h: '8B',
    circulatingSupply: '450M',
    maxSupply: '1B',
    priceChange24h: '+3.2%',
    priceChange7d: '+8.5%',
    priceChange30d: '+12.3%'
  }
}

/**
 * 生成模拟K线数据
 * @param {string} coin - 币种
 * @param {string} interval - 时间间隔
 * @param {number} limit - 数据条数
 * @returns {Array} - K线数据数组
 */
function generateMockKlineData(coin, interval = '1h', limit = 100) {
  const basePrice = basePrices[coin] || 1000
  const data = []
  const now = Date.now()
  
  // 根据时间间隔计算毫秒数
  const intervalMap = {
    '1m': 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '30m': 30 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000
  }
  
  const timeInterval = intervalMap[interval] || intervalMap['1h']
  
  for (let i = limit - 1; i >= 0; i--) {
    const timestamp = now - i * timeInterval
    const open = parseFloat((basePrice * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2))
    const close = parseFloat((open * (1 + (Math.random() - 0.5) * 0.03)).toFixed(2))
    const high = parseFloat(Math.max(open, close) * (1 + Math.random() * 0.02).toFixed(2))
    const low = parseFloat(Math.min(open, close) * (1 - Math.random() * 0.02).toFixed(2))
    const volume = parseFloat((Math.random() * 1000000).toFixed(2))
    
    data.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume
    })
  }
  
  return data
}

/**
 * 生成模拟价格趋势数据
 * @param {string} coin - 币种
 * @param {string} period - 时间周期
 * @returns {Array} - 价格趋势数据
 */
function generateMockPriceData(coin, period = '7d') {
  const basePrice = basePrices[coin] || 1000
  const data = []
  const now = Date.now()
  
  // 根据周期确定数据点数量
  const periodMap = {
    '1d': 24,
    '7d': 7,
    '30d': 30,
    '1y': 365
  }
  
  const points = periodMap[period] || 7
  const timeInterval = (24 * 60 * 60 * 1000) / (period === '1d' ? 24 : 1)
  
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = now - i * timeInterval
    const price = parseFloat((basePrice * (1 + (Math.random() - 0.5) * 0.05)).toFixed(2))
    
    data.push({
      timestamp,
      price
    })
  }
  
  return data
}

/**
 * 获取加密货币价格数据
 */
function getCryptoPriceData(req, res) {
  const { coin = 'btc', period = '7d' } = req.query
  const priceData = generateMockPriceData(coin, period)
  
  res.json({
    code: 200,
    message: 'success',
    data: {
      coin,
      period,
      prices: priceData,
      currentPrice: priceData[priceData.length - 1].price,
      change: Mock.mock('@float(-10, 10, 2, 2)')
    }
  })
}

/**
 * 获取加密货币K线图数据
 */
function getCryptoKlineData(req, res) {
  const { coin = 'btc', interval = '1h', limit = 100 } = req.query
  const klineData = generateMockKlineData(coin, interval, parseInt(limit))
  
  res.json({
    code: 200,
    message: 'success',
    data: {
      coin,
      interval,
      klines: klineData,
      current: {
        price: klineData[klineData.length - 1].close,
        volume: klineData.reduce((sum, item) => sum + item.volume, 0)
      }
    }
  })
}

/**
 * 获取支持的币种列表
 */
function getSupportedCoins(req, res) {
  const coins = Object.keys(basePrices).map(coin => ({
    code: coin,
    name: coin.toUpperCase(),
    fullName: {
      btc: 'Bitcoin',
      eth: 'Ethereum',
      sol: 'Solana',
      usdt: 'Tether',
      bnb: 'Binance Coin',
      xrp: 'Ripple',
      ada: 'Cardano',
      dot: 'Polkadot'
    }[coin] || coin.toUpperCase(),
    icon: `https://example.com/icons/${coin}.png`
  }))
  
  res.json({
    code: 200,
    message: 'success',
    data: coins
  })
}

/**
 * 获取币种市场数据
 */
function getCryptoMarketData(req, res) {
  const { coin = 'btc' } = req.query
  const marketData = mockMarketData[coin] || {
    marketCap: '0',
    volume24h: '0',
    circulatingSupply: '0',
    maxSupply: '0',
    priceChange24h: '0%',
    priceChange7d: '0%',
    priceChange30d: '0%'
  }
  
  res.json({
    code: 200,
    message: 'success',
    data: {
      coin,
      ...marketData
    }
  })
}

module.exports = [
  {
    url: '/api/crypto/price',
    type: 'get',
    response: getCryptoPriceData
  },
  {
    url: '/api/crypto/kline',
    type: 'get',
    response: getCryptoKlineData
  },
  {
    url: '/api/crypto/coins',
    type: 'get',
    response: getSupportedCoins
  },
  {
    url: '/api/crypto/market',
    type: 'get',
    response: getCryptoMarketData
  }
]
