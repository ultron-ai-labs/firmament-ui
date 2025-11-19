// 告警模块API服务
import request from '@/utils/request'

/**
 * 获取告警配置列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getAlertConfigList = (params) => {
  return request({
    url: '/api/alert/configs',
    method: 'post',
    data: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      alertName: params.alertName || '',
      alertType: params.alertType || ''
    }
  })
}
/**
 * 获取告警配置列表
 * @returns {Promise}
 */
export const getAllAlertConfigList = () => {
  return request({
    url: '/api/alert/allConfigs',
    method: 'post'
  })
}

/**
 * 创建告警配置
 * @param {Object} data - 配置数据
 * @returns {Promise}
 */
export const addAlert = (data) => {
  return request({
    url: '/api/alert/addAlert',
    method: 'post',
    data:data
  })
}

/**
 * 更新告警配置
 * @param {Object} data - 配置数据
 * @returns {Promise}
 */
export const updateAlert = (data) => {
  return request({
    url: `/api/alert/updateAlert`,
    method: 'post',
    data:data
  })
}


/**
 * 更新告警配置
 * @param {Object} data - 配置数据
 * @returns {Promise}
 */
export const deleteAlertConfig = (data) => {
  return request({
    url: `/api/alert/deleteAlert`,
    method: 'post',
    data:data
  })
}


/**
 * 测试告警通道
 * @param {Object} data - 测试数据
 * @returns {Promise}
 */
export const testAlert = (data) => {
  return request({
    url: '/api/alert/testAlert',
    method: 'post',
    data: data
  })
}

/**
 * 获取告警类型列表（企业微信、钉钉、飞书）
 * @returns {Promise}
 */
export const getAlertTypeList = () => {
  // 返回模拟数据，与后端AlertTypeEnum对应
  return Promise.resolve({
    data: [
      {label: '企业微信', value: 'wechat'},
      {label: '钉钉群', value: 'dingding'},
      {label: '飞书', value: 'feishu'}
    ]
  })
}
