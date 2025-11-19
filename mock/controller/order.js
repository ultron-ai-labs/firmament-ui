/**
 * 订单相关的Mock数据
 */

// 生成随机收益比
function generateRandomProfitRatio() {
  const min = -15;
  const max = 25;
  return (Math.random() * (max - min) + min).toFixed(2);
}

// 生成模拟订单数据
function generateMockOrders(strategyId, page = 1, pageSize = 10) {
  // 扩展加密货币列表以提供更多筛选选项
  const cryptos = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'DOT', 'DOGE', 'AVAX', 'LINK', 'UNI', 'LTC', 'AAVE', 'MKR', 'COMP'];
  const exchanges = ['Binance', 'OKX', 'Huobi', 'Coinbase'];
  const orders = [];
  
  // 生成更多的总数据以支持筛选
  const totalCount = 100;
  
  // 根据page和pageSize计算应该生成哪些订单
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  
  // 为这个页面生成订单
  for (let i = startIndex; i < endIndex; i++) {
    const longOrShort = Math.random() > 0.5 ? 'long' : 'short';
    const tradeCrypto = cryptos[Math.floor(Math.random() * cryptos.length)];
    const tradeExchange = exchanges[Math.floor(Math.random() * exchanges.length)];
    const bookTime = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const bookPrice = (Math.random() * 10000 + 1000).toFixed(2);
    const bookMultiple = Math.floor(Math.random() * 10) + 1;
    const bookCommission = (parseFloat(bookPrice) * 0.001).toFixed(2);
    const bookAmount = (parseFloat(bookPrice) * (Math.random() * 10 + 1)).toFixed(2);
    
    // 50%的概率已平仓，使状态分布更均匀以支持筛选
    const status = Math.random() > 0.5 ? 1 : 0;
    const closeTime = status === 1 ? new Date(bookTime.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null;
    
    // 基于方向生成更合理的价格，使盈利/亏损比例更可控
    let closePrice;
    if (status === 1) {
      if (longOrShort === 'long') {
        // 为了让盈利和亏损更平均分布，这里让50%概率盈利
        closePrice = Math.random() > 0.5 
          ? (parseFloat(bookPrice) * (1 + Math.random() * 0.15)).toFixed(2)  // 盈利
          : (parseFloat(bookPrice) * (1 - Math.random() * 0.1)).toFixed(2);   // 亏损
      } else {
        // 做空时，当前价格低于入场价则盈利
        closePrice = Math.random() > 0.5 
          ? (parseFloat(bookPrice) * (1 - Math.random() * 0.15)).toFixed(2)  // 盈利
          : (parseFloat(bookPrice) * (1 + Math.random() * 0.1)).toFixed(2);   // 亏损
      }
    } else {
      closePrice = null;
    }
    
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

    // 添加id字段，方便标识
    const orderId = `order_${Date.now()}_${i}`;

    orders.push({
      id: orderId,
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
      exchangeOrderNo: `EXC${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      // 添加更多用于筛选的字段
      entryPrice: bookPrice, // 用于兼容前端可能使用的字段名
      currentPrice: status === 0 ? (parseFloat(bookPrice) * (1 + (Math.random() * 0.1 - 0.05))).toFixed(2) : closePrice,
      profitStatus: parseFloat(realRevenue) > 0 ? 'profit' : parseFloat(realRevenue) < 0 ? 'loss' : 'flat',
      accountId: `acc_${Math.floor(Math.random() * 1000)}`,
      orderType: 'market',
      // 添加closeStatus字段便于筛选
      closeStatus: status.toString()
    });
  }

  // 按下单时间降序排序
  return {
    records: orders.sort((a, b) => new Date(b.bookTime) - new Date(a.bookTime)),
    total: totalCount
  };
}

module.exports = {
  // 获取策略的订单数据（支持分页和筛选）
  'POST /api/order/strategyOrders': (req, res) => {
    const { 
      strategyId, 
      page = 1, 
      pageSize = 10, 
      tradeCrypto = '', 
      longOrShort = '', 
      profitStatus = '', 
      closeStatus = '', 
      orderSerialNo = '' 
    } = req.body;
    
    // 验证参数
    if (!strategyId) {
      return res.json({
        code: 400,
        msg: '缺少策略ID参数',
        data: null
      });
    }
    
    // 首先生成所有数据，然后应用筛选和分页
    // 为了支持筛选，需要先获取所有数据
    // 这里通过将page设为1，pageSize设为总记录数来获取所有数据
    const allOrdersData = generateMockOrders(strategyId, 1, 100);
    let filteredOrders = [...allOrdersData.records];
    
    // 应用筛选条件
    if (tradeCrypto) {
      filteredOrders = filteredOrders.filter(order => order.tradeCrypto === tradeCrypto);
    }
    
    if (longOrShort) {
      filteredOrders = filteredOrders.filter(order => order.longOrShort === longOrShort);
    }
    
    if (profitStatus) {
      if (profitStatus === 'profit') {
        filteredOrders = filteredOrders.filter(order => parseFloat(order.realRevenue) > 0);
      } else if (profitStatus === 'loss') {
        filteredOrders = filteredOrders.filter(order => parseFloat(order.realRevenue) < 0);
      }
    }
    
    if (closeStatus) {
      // 使用新增的closeStatus字段进行筛选，提高兼容性
      filteredOrders = filteredOrders.filter(order => order.closeStatus === closeStatus);
    }
    
    if (orderSerialNo) {
      const searchTerm = orderSerialNo.toLowerCase();
      filteredOrders = filteredOrders.filter(order => order.orderSerialNo.toLowerCase().includes(searchTerm));
    }
    
    // 对筛选后的数据进行分页
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    
    // 返回分页数据
    res.json({
      code: 200,
      msg: 'success',
      data: {
        records: paginatedOrders,
        total: filteredOrders.length,
        page: Number(page),
        pageSize: Number(pageSize)
      }
    });
  }
};