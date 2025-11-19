import request from '@/utils/request'

/**
 * 获取K线历史数据
 * @param {Object} params - 请求参数
 * @param {string} params.exchange - 交易所
 * @param {string} params.cryptoCode - 币种代码
 * @param {string} params.timeUnit - 时间单位
 * @param {number} params.startTime - 开始时间戳
 * @param {number} params.endTime - 结束时间戳
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页大小
 * @returns {Promise}
 */
export function getKlineHistoryData(params) {
  return request({
    url: '/api/exchange/klineHistory',
    method: 'post',
    data: params
  })
}

/**
 * 获取交易所列表
 * 目前历史数据只支持币安
 * 未来会支持欧易和Gate.io
 * @returns {Promise}
 */
export function getExchangeList() {
  return {
    code: 200,
    msg: 'success',
    data: [
      {label: '币安', value: 'binance'},
      {label: '欧易', value: 'okx'}
    ]
  }
}

/**
 * 获取币种列表
 * @param {string} exchange - 交易所
 * @returns {Promise}
 */
export function getCryptoList(exchange) {
  return {
    code: 200,
    msg: 'success',
    data: [
      {label: 'BTC', value: 'BTC'},
      {label: 'ETH', value: 'ETH'},
      {label: 'SOL', value: 'SOL'}
    ]
  }
}

/**
 * 获取币种列表
 * @param {string} exchange - 交易所
 * @returns {Promise}
 */
export function getCryptos() {
  return ['BTC', 'ETH', "SOL"]

}

/**
 * 获取时间周期列表
 * @returns {Promise}
 */
export function getTimeUnitList() {
  return {
    code: 200,
    msg: 'success',
    data: [
      {label: '1分钟', value: '_1M'},
      {label: '3分钟', value: '_3M'},
      {label: '5分钟', value: '_5M'},
      {label: '15分钟', value: '_15M'},
      {label: '30分钟', value: '_30M'},
      {label: '1小时', value: '_1H'},
      {label: '4小时', value: '_4H'},
      {label: '6小时', value: '_6H'},
      {label: '12小时', value: '_12H'},
      {label: '1天', value: '_1D'}
    ]
  }
}
