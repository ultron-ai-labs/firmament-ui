import request from '@/utils/request'

/**
 * 获取策略订单列表
 * @param {string} strategyId - 策略ID
 * @param {number} page - 页码，默认1
 * @param {number} pageSize - 每页大小，默认10
 * @param {string} tradeCrypto - 交易币种筛选
 * @param {string} longOrShort - 交易方向筛选（long/short）
 * @param {string} profitStatus - 盈亏状态筛选（profit/loss）
 * @param {string} closeStatus - 平仓状态筛选（0:未平仓, 1:已平仓）
 * @returns {Promise}
 */
export async function getStrategyOrders(
  strategyId,
  page = 1,
  pageSize = 10,
  tradeCrypto = '',
  longOrShort = '',
  profitStatus = '',
  closeStatus = '',
) {
  return request({
    url: '/api/order/strategyOrders',
    method: 'post',
    data: {
      strategyId,
      page,
      pageSize,
      tradeCrypto,
      longOrShort,
      profitStatus,
      closeStatus,
    }
  })
}

// 手动平仓
// api/order/closeOrder
export async function closeOrder(data) {
  return request({
    url: '/api/order/closeOrder',
    method: 'post',
    data: data
  })
}
