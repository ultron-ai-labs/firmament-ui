import request from '@/utils/request'

/**
 * 添加实时运行模型
 * @param {Object} modelData - 模型数据
 * @param {string} modelData.strategyName - 策略名称
 * @param {string} modelData.strategyId - 任务策略id
 * @param {string} modelData.strategyState - 策略状态
 * @param {string} modelData.modelId - 策略关联模型ID
 * @param {string} modelData.modelCategory - 模型分类
 * @param {number} modelData.originalAmount - 原始金额
 * @param {number} modelData.currentAmount - 当前金额
 * @param {string} modelData.promptStrategyId - 提示词策略id
 * @param {string} modelData.exchange - 交易所
 * @param {Array} modelData.cryptocurrencies - 加密货币
 * @param {string} modelData.timeUnit - 时间单位
 * @param {string} modelData.alertId - 开单平仓报警ID
 * @returns {Promise}
 */
export function addRealTimeModel(modelData) {
  return request({
    url: '/api/realTimeStrategy/addRealTimeModel',
    method: 'post',
    data: modelData
  })
}

/**
 * 添加实时运行模型
 * @returns {Promise}
 */
export function dashboard(strategyId) {
  if (!strategyId === undefined){
    strategyId = ''
  }
  return request({
    url: '/api/realTimeStrategy/dashboard',
    method: 'post',
    data: {
      "strategyId":strategyId
    }
  })
}

/**
 * 添加实时运行模型
 * @returns {Promise}
 */
export function runningRealTimeStrategy(strategyId) {
  if (!strategyId === undefined){
    strategyId = ''
  }
  return request({
    url: '/api/realTimeStrategy/runningRealTimeStrategy',
    method: 'post',
    data: {
      "strategyId":strategyId
    }
  })
}

/**
 * 启动任务
 * @returns {Promise}
 */
export function startRealTimeModel(data) {
  return request({
    url: '/api/realTimeStrategy/startRealTimeModel',
    method: 'post',
    data:data
  })
}

/**
 * 结束任务
 * @returns {Promise}
 */
export function stopRealTimeModel(data) {
  return request({
    url: '/api/realTimeStrategy/stopRealTimeModel',
    method: 'post',
    data:data
  })
}


/**
 * 结束任务
 * @returns {Promise}
 */
export function realTimeStrategyLineChart(strategyId,type) {
  return request({
    url: '/api/realTimeStrategy/realTimeStrategyLineChart',
    method: 'post',
    data:{
      "strategyId":strategyId,
      "type":type
    }
  })
}


/**
 * 添加状态
 */
export function getTaskStates(modelData) {
  return [
    {label: '未开始', value: 'init'},
    {label: '运行中', value: 'running'},
    {label: '已暂停', value: 'stop'}
  ]
}
