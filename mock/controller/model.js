// 模型相关的模拟数据控制器

// 生成随机盈亏比
function generateRandomProfitRatio() {
  return (Math.random() * 20 - 10).toFixed(2)
}

// 生成随机耗时
function generateRandomTime() {
  return Math.floor(Math.random() * 500 + 100)
}

// 运行中的模型列表
let runningModels = [
  {
    id: '1',
    strategyName: 'BTC趋势跟踪策略',
    strategyId: 'BTC-2024-01-01',
    strategyState: '进行中',
    modelId: 'model-001',
    modelCategory: '对话模型',
    originalAmount: 10000,
    currentAmount: 11234.56,
    totalProfitAndLossRatio: 12.35,
    averageTime: 234,
    promptStrategyId: 'prompt-001',
    exchange: 'Binance',
    cryptocurrencies: ['BTC', 'ETH'],
    timeUnit: 'minute',
    alertId: 'alert-001'
  },
  {
    id: '2',
    strategyName: 'ETH智能网格策略',
    strategyId: 'ETH-2024-01-02',
    strategyState: '进行中',
    modelId: 'model-002',
    modelCategory: '对话模型',
    originalAmount: 5000,
    currentAmount: 4890.23,
    totalProfitAndLossRatio: -2.19,
    averageTime: 312,
    promptStrategyId: 'prompt-002',
    exchange: 'Coinbase',
    cryptocurrencies: ['ETH', 'SOL'],
    timeUnit: 'hour',
    alertId: 'alert-002'
  },
  {
    id: '3',
    strategyName: '多币种套利策略',
    strategyId: 'ARB-2024-01-03',
    strategyState: '暂停',
    modelId: 'model-003',
    modelCategory: '对话模型',
    originalAmount: 15000,
    currentAmount: 16789.90,
    totalProfitAndLossRatio: 11.93,
    averageTime: 456,
    promptStrategyId: 'prompt-003',
    exchange: 'Kraken',
    cryptocurrencies: ['BTC', 'ETH', 'SOL', 'BNB'],
    timeUnit: 'day',
    alertId: 'alert-003'
  }
];

// 运行中的实时策略数据
const runningRealTimeStrategies = [
  {
    strategyId: 'STR001',
    strategyName: 'BTC趋势跟踪策略',
    modelId: 'MODEL001'
  },
  {
    strategyId: 'STR002', 
    strategyName: 'ETH均值回归策略',
    modelId: 'MODEL002'
  },
  {
    strategyId: 'STR003',
    strategyName: '多币种网格交易策略',
    modelId: 'MODEL003'
  },
  {
    strategyId: 'STR004',
    strategyName: '日内短线交易策略',
    modelId: 'MODEL004'
  },
  {
    strategyId: 'STR005',
    strategyName: '波动率套利策略',
    modelId: 'MODEL005'
  }
];

// 生成模拟订单数据
function generateMockOrders(strategyId) {
  const cryptos = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP'];
  const exchanges = ['Binance', 'OKX', 'Huobi', 'Coinbase'];
  const orders = [];

  for (let i = 0; i < 50; i++) {
    const longOrShort = Math.random() > 0.5 ? 'long' : 'short';
    const tradeCrypto = cryptos[Math.floor(Math.random() * cryptos.length)];
    const tradeExchange = exchanges[Math.floor(Math.random() * exchanges.length)];
    const bookTime = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const bookPrice = (Math.random() * 10000 + 1000).toFixed(2);
    const bookMultiple = Math.floor(Math.random() * 10) + 1;
    const bookCommission = (parseFloat(bookPrice) * 0.001).toFixed(2);
    const bookAmount = (parseFloat(bookPrice) * (Math.random() * 10 + 1)).toFixed(2);
    
    // 80%的概率已平仓
    const status = Math.random() > 0.2 ? 1 : 0;
    const closeTime = status === 1 ? new Date(bookTime.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null;
    const closePrice = status === 1 ? (parseFloat(bookPrice) * (1 + (Math.random() * 0.2 - 0.05))).toFixed(2) : null;
    const closeAmount = closePrice ? (parseFloat(closePrice) * (parseFloat(bookAmount) / parseFloat(bookPrice))).toFixed(2) : null;
    const closeCommission = closePrice ? (parseFloat(closePrice) * 0.001).toFixed(2) : null;
    
    const totalRevenue = status === 1 
      ? (parseFloat(closeAmount) - parseFloat(bookAmount)).toFixed(2)
      : (parseFloat(bookAmount) * (Math.random() * 0.1 - 0.03)).toFixed(2);
    const totalRate = status === 1
      ? (((parseFloat(totalRevenue) / parseFloat(bookAmount)) * 100)).toFixed(2)
      : (((parseFloat(totalRevenue) / parseFloat(bookAmount)) * 100)).toFixed(2);
    
    const realRevenue = status === 1
      ? (parseFloat(totalRevenue) - parseFloat(bookCommission) - parseFloat(closeCommission)).toFixed(2)
      : (parseFloat(totalRevenue) - parseFloat(bookCommission)).toFixed(2);
    const realRate = status === 1
      ? (((parseFloat(realRevenue) / parseFloat(bookAmount)) * 100)).toFixed(2)
      : (((parseFloat(realRevenue) / parseFloat(bookAmount)) * 100)).toFixed(2);

    orders.push({
      strategyId,
      orderSerialNo: `ORD${Date.now()}${i.toString().padStart(4, '0')}`,
      tradeCrypto,
      tradeExchange,
      longOrShort,
      targetTakeProfit: (parseFloat(bookPrice) * 1.15).toFixed(2),
      targetStopLoss: (parseFloat(bookPrice) * 0.9).toFixed(2),
      bookTime,
      bookPrice,
      bookMultiple,
      bookCommission,
      bookAmount,
      closeTime,
      closePrice,
      closeAmount,
      closeCommission,
      totalRevenue,
      totalRate,
      realRevenue,
      realRate,
      status,
      exchangeOrderNo: `EXC${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    });
  }

  return orders.sort((a, b) => new Date(b.bookTime) - new Date(a.bookTime));
}

// 生成模型数据列表
function generateModelsList() {
  const models = [];
  const categories = ['对话模型', '预测模型', '分析模型'];
  const exchanges = ['Binance', 'Coinbase', 'Huobi', 'Kraken'];
  
  for (let i = 1; i <= 20; i++) {
    models.push({
      id: `model-${i.toString().padStart(3, '0')}`,
      name: `AI交易模型 ${i}`,
      modelType: i % 2 === 0 ? 'DeepSeek' : 'OpenAI',
      modelCategory: categories[Math.floor(Math.random() * categories.length)],
      testCategory: '回测',
      apiUrl: 'https://api.example.com/v1',
      apiKey: 'sk_test_' + Math.random().toString(36).substring(2, 15),
      profitRatio: generateRandomProfitRatio(),
      createTime: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
      strategyId: i % 5 === 0 ? `STR00${(i % 5) + 1}` : null
    });
  }
  
  return models;
}

const modelsList = generateModelsList();

module.exports = {
  // 获取模型列表（分页）
  'POST /api/model/currentModels': (req, res) => {
    const { page = 1, pageSize = 10, name = '', strategyId = '' } = req.body;
    
    // 过滤模型数据
    let filteredModels = modelsList;
    
    // 根据名称过滤
    if (name) {
      filteredModels = filteredModels.filter(model => 
        model.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    
    // 根据strategyId过滤
    if (strategyId) {
      filteredModels = filteredModels.filter(model => 
        model.strategyId === strategyId
      );
    }
    
    // 计算分页数据
    const total = filteredModels.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedModels = filteredModels.slice(start, end);
    
    res.json({
      code: 200,
      msg: 'success',
      data: {
        records: paginatedModels,
        total: total,
        pageSize: pageSize,
        page: page
      }
    });
  },
  
  // 添加实时运行模型
  'POST /api/model/addRealTimeModel': (req, res) => {
    const modelData = req.body
    // 生成新模型ID
    const newModelId = Date.now().toString()
    
    // 创建新模型对象
    const newModel = {
      id: newModelId,
      ...modelData,
      // 计算总盈亏比
      totalProfitAndLossRatio: modelData.originalAmount > 0 
        ? ((modelData.currentAmount - modelData.originalAmount) / modelData.originalAmount * 100).toFixed(2)
        : 0,
      // 生成平均耗时
      averageTime: generateRandomTime()
    }
    
    // 添加到运行中的模型列表
    runningModels.unshift(newModel)
    
    res.json({
      code: 200,
      msg: 'success',
      data: newModel
    })
  },
  
  // 获取运行中的模型列表
  'GET /api/model/runningModels': (req, res) => {
    res.json({
      code: 200,
      msg: 'success',
      data: runningModels
    })
  },
  
  // 模拟更新运行中的模型数据（用于演示）
  'POST /api/model/updateModelStatus': (req, res) => {
    const { id, status } = req.body
    const modelIndex = runningModels.findIndex(model => model.id === id)
    
    if (modelIndex !== -1) {
      runningModels[modelIndex].strategyState = status
      res.json({
        code: 200,
        msg: 'success'
      })
    } else {
      res.json({
        code: 404,
        msg: '模型不存在'
      })
    }
  },
  
  // 删除模型
  'DELETE /api/model/deleteModel': (req, res) => {
    const { id } = req.query
    const modelIndex = runningModels.findIndex(model => model.id === id)
    
    if (modelIndex !== -1) {
      runningModels.splice(modelIndex, 1)
      res.json({
        code: 200,
        msg: 'success'
      })
    } else {
      res.json({
        code: 404,
        msg: '模型不存在'
      })
    }
  },
  
  // 获取运行中的实时策略列表
  'GET /api/model/runningRealTimeStrategy': (req, res) => {
    res.json({
      code: 200,
      msg: 'success',
      data: runningRealTimeStrategies
    });
  },

  // 获取策略的订单数据
  'GET /api/model/strategyOrders': (req, res) => {
    const { strategyId } = req.query;
    const orders = generateMockOrders(strategyId);
    res.json({
      code: 200,
      msg: 'success',
      data: orders
    });
  }
}