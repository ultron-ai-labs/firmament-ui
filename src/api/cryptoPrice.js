import request from '../utils/request'

/**
 * 获取加密货币价格数据
 * @param {Object} params - 请求参数
 * @param {string} params.coin - 币种代码，如btc、eth、sol
 * @param {string} params.period - 时间周期，如1d、7d、30d、1y
 * @returns {Promise} - 返回价格数据
 */
export const getCryptoPriceData = (params) => {
  return request({
    url: '/api/crypto/price',
    method: 'get',
    params
  })
}

/**
 * 获取加密货币K线图数据
 * @param {Object} params - 请求参数
 * @param {string} params.coin - 币种代码，如btc、eth、sol
 * @param {string} params.interval - 时间间隔，如1m、5m、15m、30m、1h、4h、1d
 * @param {number} params.limit - 返回数据条数
 * @returns {Promise} - 返回K线图数据
 */
export const getCryptoKlineData = (params) => {
  return request({
    url: '/api/crypto/kline',
    method: 'get',
    params
  })
}

/**
 * 获取支持的币种列表
 * @returns {Promise} - 返回币种列表
 */
export const getSupportedCoins = () => {
  return request({
    url: '/api/crypto/coins',
    method: 'get'
  })
}

/**
 * 获取币种市场数据
 * @param {Object} params - 请求参数
 * @param {string} params.coin - 币种代码
 * @returns {Promise} - 返回市场数据
 */
export const getCryptoMarketData = (params) => {
  return request({
    url: '/api/crypto/market',
    method: 'get',
    params
  })
}
