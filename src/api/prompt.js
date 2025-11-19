import request from '@/utils/request'

/**
 * 获取提示词列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 当前页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.name - 提示词名称搜索
 * @param {boolean} params.status - 状态筛选
 * @returns {Promise}
 */
export function getPromptList(params) {
  return request({
    url: '/api/prompt/getPromptList',
    method: 'post',
    data: params
  })
}
/**
 * 获取提示词列表
 */
export function getAllPromptList() {
  return request({
    url: '/api/prompt/getAllPromptList',
    method: 'post',
  })
}

/**
 * 创建新的提示词
 * @param {Object} data - 提示词数据
 * @returns {Promise}
 */
export function createPrompt(data) {
  return request({
    url: '/api/prompt/addPrompt',
    method: 'post',
    data:data
  })
}

/**
 * 更新提示词
 * @param {Object} data - 提示词数据
 * @returns {Promise}
 */
export function updatePrompt(data) {
  return request({
    url: '/api/prompt/updatePrompt',
    method: 'post',
    data:data
  })
}
