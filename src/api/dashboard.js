// 大盘页面API服务
import request from '@/utils/request'

/**
 * 获取大盘概览数据
 * @returns {Promise}
 */
export const getDashboardOverview = () => {
  return request({
    url: '/api/dashboard/overview',
    method: 'get'
  })
}

/**
 * 获取资产趋势数据
 * @param {string} period - 时间周期 (7d, 30d, 90d, 1y)
 * @returns {Promise}
 */
export const getAssetTrend = (period = '30d') => {
  return request({
    url: '/api/dashboard/asset-trend',
    method: 'get',
    params: {
      period
    }
  })
}

/**
 * 获取资产分布数据
 * @returns {Promise}
 */
export const getAssetDistribution = () => {
  return request({
    url: '/api/dashboard/asset-distribution',
    method: 'get'
  })
}

/**
 * 获取交易信号热力图数据
 * @returns {Promise}
 */
export const getTradeSignals = () => {
  return request({
    url: '/api/dashboard/trade-signals',
    method: 'get'
  })
}

/**
 * 获取性能指标数据
 * @returns {Promise}
 */
export const getPerformanceMetrics = () => {
  return request({
    url: '/api/dashboard/metrics',
    method: 'get'
  })
}

/**
 * 获取AI模型表现数据
 * @returns {Promise}
 */
export const getAiModelsPerformance = () => {
  return request({
    url: '/api/dashboard/ai-models',
    method: 'get'
  })
}

/**
 * 获取最近交易记录
 * @returns {Promise}
 */
export const getRecentTrades = () => {
  return request({
    url: '/api/dashboard/recent-trades',
    method: 'get'
  })
}