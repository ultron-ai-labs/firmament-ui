import request from '@/utils/request'

/**
 * 获取广告Tab数据【滚动栏目数据】
 *
 * @returns {*} 返回广告栏数据
 */
export function getList() {
  return request({
    url: '/api/ad/list',
    method: 'get',
  })
}
