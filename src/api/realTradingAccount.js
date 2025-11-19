import request from '@/utils/request'

/**
 * 获取交易账户列表
 * @param {Object} params - 查询参数
 * @param {string} params.exchange - 交易所名称（可选）
 * @param {string} params.apiName - API名称（可选）
 * @param {number} params.simulation - 是否模拟盘（可选，0：否，1：是）
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @returns {Promise} - 返回Promise对象
 */
export function getTradingAccounts(params) {
  return request({
    url: '/api/trading/accounts',
    method: 'get',
    params
  })
}

/**
 * 创建交易账户
 * @param {Object} data - 账户数据
 * @param {string} data.exchange - 交易所
 * @param {string} data.apiKey - API Key
 * @param {string} data.secretKey - Secret Key
 * @param {string} data.apiName - API名称
 * @param {string} data.passphrase - Passphrase（可选）
 * @param {number} data.simulation - 是否模拟盘（0：否，1：是）
 * @returns {Promise} - 返回Promise对象
 */
export function createTradingAccount(data) {
  return request({
    url: '/api/trading/accounts',
    method: 'post',
    data
  })
}

/**
 * 更新交易账户
 * @param {Object} data - 账户数据
 * @param {string} data.id - 账户ID
 * @param {string} data.exchange - 交易所
 * @param {string} data.apiKey - API Key
 * @param {string} data.secretKey - Secret Key
 * @param {string} data.apiName - API名称
 * @param {string} data.passphrase - Passphrase（可选）
 * @param {number} data.simulation - 是否模拟盘（0：否，1：是）
 * @returns {Promise} - 返回Promise对象
 */
export function updateTradingAccount(data) {
  return request({
    url: `/api/trading/accounts/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 删除交易账户
 * @param {string} id - 账户ID
 * @returns {Promise} - 返回Promise对象
 */
export function deleteTradingAccount(id) {
  return request({
    url: `/api/trading/accounts/${id}`,
    method: 'delete'
  })
}

/**
 * 测试交易账户连接
 * @param {Object} data - 账户数据
 * @param {string} data.exchange - 交易所
 * @param {string} data.apiKey - API Key
 * @param {string} data.secretKey - Secret Key
 * @param {string} data.passphrase - Passphrase（可选）
 * @returns {Promise} - 返回Promise对象
 */
export function testAccountConnection(data) {
  return request({
    url: '/api/trading/accounts/test',
    method: 'post',
    data
  })
}
