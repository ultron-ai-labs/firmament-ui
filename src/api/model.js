import request from '@/utils/request'

/**
 * 获取可用模型类型列表
 * @returns {Object}
 */
export function getModelTypeList() {
  return {
    code: 200,
    msg: 'success',
    data: [
      {label: 'DeepSeek', value: 'DeepSeek'},
      {label: '阿里百炼', value: 'AliBailian'}
    ]
  }
}

/**
 * 获取模型列表（分页）
 * @param {Object} params - 请求参数
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {string} params.name - 模型名称搜索关键字
 * @returns {Promise}
 */
export function currentModels(params) {
  return request({
    url: '/api/model/currentModels',
    method: 'post',
    data: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      name: params.name || ''
    }
  })
}

/**
 * 获取模型列表所有数据
 * @returns {Promise}
 */
export function currentAllModels() {
  return request({
    url: '/api/model/currentAllModels',
    method: 'post',
  })
}

/**
 * 添加新模型
 * @param {Object} modelData - 模型数据
 * @param {string} modelData.name - 模型名称
 * @param {string} modelData.modelType - 模型类型
 * @param {string} modelData.testCategory - 测试分类
 * @param {string} modelData.apiUrl - API地址
 * @param {string} modelData.apiKey - API Key
 * @returns {Promise}
 */
export function addModel(modelData) {
  return request({
    url: '/api/model/addModel',
    method: 'post',
    data: modelData
  })
}

/**
 * 更新模型
 * @param {Object} modelData - 模型数据
 * @returns {Promise}
 */
export function updateModel(modelData) {
  return request({
    url: '/api/model/updateModel',
    method: 'post',
    data: modelData
  })
}

/**
 * 删除模型
 * @param {string} modelName - 模型名称
 * @returns {Promise}
 */
export function deleteModel(modelName) {
  return request({
    url: '/api/model/delete',
    method: 'delete',
    params: {name: modelName}
  })
}

/**
 * 测试模型连接
 * @param {Object} modelData - 模型测试数据
 * @returns {Promise}
 */
export function testModelConnection(modelData) {
  return request({
    url: '/api/model/testConnection',
    method: 'post',
    data: modelData
  })
}
