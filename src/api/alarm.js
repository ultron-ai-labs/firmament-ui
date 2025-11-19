// 报警模块API服务
import request from '@/utils/request'

/**
 * 获取报警配置列表
 * @returns {Promise}
 */
export const getAlarmConfigs = () => {
  return request({
    url: '/api/alarm/configs',
    method: 'get'
  })
}

/**
 * 获取单个报警配置
 * @param {string} id - 配置ID
 * @returns {Promise}
 */
export const getAlarmConfig = (id) => {
  return request({
    url: `/api/alarm/configs/${id}`,
    method: 'get'
  })
}

/**
 * 创建报警配置
 * @param {Object} data - 配置数据
 * @returns {Promise}
 */
export const createAlarmConfig = (data) => {
  return request({
    url: '/api/alarm/configs',
    method: 'post',
    data
  })
}

/**
 * 更新报警配置
 * @param {string} id - 配置ID
 * @param {Object} data - 配置数据
 * @returns {Promise}
 */
export const updateAlarmConfig = (id, data) => {
  return request({
    url: `/api/alarm/configs/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除报警配置
 * @param {string} id - 配置ID
 * @returns {Promise}
 */
export const deleteAlarmConfig = (id) => {
  return request({
    url: `/api/alarm/configs/${id}`,
    method: 'delete'
  })
}

/**
 * 获取报警记录列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getAlarmRecords = (params = {}) => {
  return request({
    url: '/api/alarm/records',
    method: 'get',
    params
  })
}

/**
 * 获取报警统计数据
 * @param {string} period - 时间周期
 * @returns {Promise}
 */
export const getAlarmStats = (period = '30d') => {
  return request({
    url: '/api/alarm/stats',
    method: 'get',
    params: {
      period
    }
  })
}

/**
 * 测试报警通道
 * @param {Object} data - 测试数据
 * @returns {Promise}
 */
export const testAlarmChannel = (data) => {
  return request({
    url: '/api/alarm/test',
    method: 'post',
    data
  })
}