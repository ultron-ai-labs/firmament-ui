<template>
  <div class="strategy-market-container">
    <div class="page-header">
      <el-divider content-position="left">策略市场</el-divider>
      <div class="header-desc">浏览、搜索和管理量化交易策略</div>
    </div>
    
    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <el-card>
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="策略名称">
            <el-input v-model="searchForm.strategyName" placeholder="请输入策略名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="策略类型">
            <el-select v-model="searchForm.strategyType" placeholder="请选择策略类型" clearable>
              <el-option label="趋势跟踪" value="trend"></el-option>
              <el-option label="均值回归" value="mean_reversion"></el-option>
              <el-option label="机器学习" value="ml"></el-option>
              <el-option label="网格交易" value="grid"></el-option>
              <el-option label="套利策略" value="arbitrage"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收益率">
            <el-select v-model="searchForm.profitFilter" placeholder="请选择收益率范围" clearable>
              <el-option label="正收益" value="positive"></el-option>
              <el-option label=">10%" value="gt10"></el-option>
              <el-option label=">20%" value="gt20"></el-option>
              <el-option label=">50%" value="gt50"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" icon="el-icon-search">搜索</el-button>
            <el-button @click="resetSearch" icon="el-icon-refresh">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    
    <!-- 策略列表 -->
    <div class="strategy-list-section">
      <el-card>
        <div class="card-header">
          <span class="section-title">策略列表</span>
          <div class="header-actions">
            <el-button type="success" @click="importStrategy" icon="el-icon-upload2">导入策略</el-button>
            <el-button type="primary" @click="createStrategy" icon="el-icon-plus">创建策略</el-button>
          </div>
        </div>
        
        <el-table 
          :data="strategies" 
          style="width: 100%"
          border
          stripe
          @row-click="viewStrategyDetail"
        >
          <el-table-column prop="id" label="策略ID" width="120" align="center"></el-table-column>
          <el-table-column prop="name" label="策略名称" width="200" align="center">
            <template slot-scope="scope">
              <div class="strategy-name-container">
                <span class="strategy-name">{{ scope.row.name }}</span>
                <el-tag v-if="scope.row.isRecommended" type="success" size="mini" class="recommend-tag">推荐</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="策略类型" width="120" align="center">
            <template slot-scope="scope">
              <el-tag :type="getTypeTagType(scope.row.type)">{{ getTypeName(scope.row.type) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="avgProfitRate" label="平均收益率" width="120" align="center">
            <template slot-scope="scope">
              <el-tag :type="getProfitTagType(scope.row.avgProfitRate)">
                {{ formatPercent(scope.row.avgProfitRate) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="maxDrawdown" label="最大回撤" width="120" align="center">
            <template slot-scope="scope">
              <span>{{ formatPercent(scope.row.maxDrawdown) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sharpeRatio" label="夏普比率" width="120" align="center"></el-table-column>
          <el-table-column prop="author" label="作者" width="100" align="center"></el-table-column>
          <el-table-column prop="publishTime" label="发布时间" width="150" align="center"></el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button @click.stop="viewStrategyDetail(scope.row)" type="primary" size="small">查看详情</el-button>
              <el-button @click.stop="useStrategy(scope.row)" type="success" size="small">使用</el-button>
              <el-button @click.stop="downloadStrategy(scope.row)" size="small">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            background
            layout="prev, pager, next, jumper, total"
            :total="total"
            :current-page.sync="currentPage"
            :page-size.sync="pageSize"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-card>
    </div>
    
    <!-- 策略详情对话框 -->
    <el-dialog
      title="策略详情"
      :visible.sync="detailVisible"
      width="80%"
      :close-on-click-modal="false"
    >
      <div class="strategy-detail-content">
        <!-- 基本信息 -->
        <el-card class="info-card">
          <div slot="header" class="card-header">
            <span>基本信息</span>
          </div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="策略ID">{{ selectedStrategy.id }}</el-descriptions-item>
            <el-descriptions-item label="策略名称">{{ selectedStrategy.name }}</el-descriptions-item>
            <el-descriptions-item label="策略类型">{{ getTypeName(selectedStrategy.type) }}</el-descriptions-item>
            <el-descriptions-item label="作者">{{ selectedStrategy.author }}</el-descriptions-item>
            <el-descriptions-item label="发布时间">{{ selectedStrategy.publishTime }}</el-descriptions-item>
            <el-descriptions-item label="平均收益率">{{ formatPercent(selectedStrategy.avgProfitRate) }}</el-descriptions-item>
            <el-descriptions-item label="最大回撤">{{ formatPercent(selectedStrategy.maxDrawdown) }}</el-descriptions-item>
            <el-descriptions-item label="夏普比率">{{ selectedStrategy.sharpeRatio }}</el-descriptions-item>
            <el-descriptions-item label="胜率">{{ formatPercent(selectedStrategy.winRate) }}</el-descriptions-item>
            <el-descriptions-item label="使用次数">{{ selectedStrategy.useCount }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
        
        <!-- 策略描述 -->
        <el-card class="description-card">
          <div slot="header" class="card-header">
            <span>策略描述</span>
          </div>
          <div class="strategy-description">{{ selectedStrategy.description }}</div>
        </el-card>
        
        <!-- 策略参数 -->
        <el-card class="params-card">
          <div slot="header" class="card-header">
            <span>策略参数</span>
          </div>
          <el-table :data="selectedStrategy.parameters" border style="width: 100%">
            <el-table-column prop="name" label="参数名称" width="150"></el-table-column>
            <el-table-column prop="type" label="参数类型" width="100"></el-table-column>
            <el-table-column prop="defaultValue" label="默认值" width="100"></el-table-column>
            <el-table-column prop="description" label="参数说明"></el-table-column>
          </el-table>
        </el-card>
        
        <!-- 回测结果 -->
        <el-card class="backtest-card">
          <div slot="header" class="card-header">
            <span>回测结果</span>
          </div>
          <div class="backtest-result">
            <div class="result-item">
              <span class="result-label">测试周期：</span>
              <span class="result-value">{{ selectedStrategy.backtestPeriod }}</span>
            </div>
            <div class="result-item">
              <span class="result-label">初始资金：</span>
              <span class="result-value">{{ formatCurrency(selectedStrategy.initialCapital) }}</span>
            </div>
            <div class="result-item">
              <span class="result-label">最终资金：</span>
              <span class="result-value">{{ formatCurrency(selectedStrategy.finalCapital) }}</span>
            </div>
            <div class="result-item">
              <span class="result-label">总收益率：</span>
              <span class="result-value" :class="getProfitClass(selectedStrategy.totalReturn)">
                {{ formatPercent(selectedStrategy.totalReturn) }}
              </span>
            </div>
            <div class="result-item">
              <span class="result-label">交易次数：</span>
              <span class="result-value">{{ selectedStrategy.tradeCount }}</span>
            </div>
          </div>
        </el-card>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="primary" @click="useStrategy(selectedStrategy)">使用策略</el-button>
      </div>
    </el-dialog>
    
    <!-- 创建策略对话框 -->
    <el-dialog
      :title="isEditMode ? '编辑策略' : '创建策略'"
      :visible.sync="createDialogVisible"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-form :model="strategyForm" :rules="strategyRules" ref="strategyForm" label-width="100px">
        <el-form-item label="策略名称" prop="name">
          <el-input v-model="strategyForm.name" placeholder="请输入策略名称"></el-input>
        </el-form-item>
        <el-form-item label="策略类型" prop="type">
          <el-select v-model="strategyForm.type" placeholder="请选择策略类型">
            <el-option label="趋势跟踪" value="trend"></el-option>
            <el-option label="均值回归" value="mean_reversion"></el-option>
            <el-option label="机器学习" value="ml"></el-option>
            <el-option label="网格交易" value="grid"></el-option>
            <el-option label="套利策略" value="arbitrage"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="策略描述" prop="description">
          <el-input v-model="strategyForm.description" type="textarea" :rows="4" placeholder="请输入策略描述"></el-input>
        </el-form-item>
        <el-form-item label="是否推荐">
          <el-switch v-model="strategyForm.isRecommended"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitStrategyForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'StrategyMarket',
  data() {
    return {
      // 搜索表单
      searchForm: {
        strategyName: '',
        strategyType: '',
        profitFilter: '',
        dateRange: null
      },
      // 策略列表数据
      strategies: [],
      // 总数
      total: 0,
      // 当前页码
      currentPage: 1,
      // 每页大小
      pageSize: 10,
      // 详情对话框显示状态
      detailVisible: false,
      // 创建/编辑对话框显示状态
      createDialogVisible: false,
      // 是否编辑模式
      isEditMode: false,
      // 选中的策略
      selectedStrategy: {},
      // 创建/编辑策略表单
      strategyForm: {
        name: '',
        type: '',
        description: '',
        isRecommended: false
      },
      // 表单验证规则
      strategyRules: {
        name: [
          { required: true, message: '请输入策略名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择策略类型', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入策略描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadStrategies()
  },
  methods: {
    // 加载策略列表
    async loadStrategies() {
      try {
        // 这里应该调用API获取数据，暂时使用模拟数据
        this.strategies = this.getMockStrategies()
        this.total = this.strategies.length
      } catch (error) {
        this.$message.error('获取策略列表失败')
        console.error('Load strategies error:', error)
      }
    },
    
    // 搜索策略
    handleSearch() {
      this.currentPage = 1
      this.loadStrategies()
    },
    
    // 重置搜索
    resetSearch() {
      this.searchForm = {
        strategyName: '',
        strategyType: '',
        profitFilter: '',
        dateRange: null
      }
      this.loadStrategies()
    },
    
    // 页码变化
    handleCurrentChange(page) {
      this.currentPage = page
      this.loadStrategies()
    },
    
    // 查看策略详情
    viewStrategyDetail(strategy) {
      this.selectedStrategy = { ...strategy }
      this.detailVisible = true
    },
    
    // 使用策略
    useStrategy(strategy) {
      this.$message.success(`已选择使用策略：${strategy.name}`)
      // 这里可以跳转到回测页面并传递策略ID
      this.$router.push({
        path: '/backtest',
        query: { strategyId: strategy.id }
      })
    },
    
    // 下载策略
    downloadStrategy(strategy) {
      this.$message.info(`正在下载策略：${strategy.name}`)
      // 这里应该调用下载API
    },
    
    // 创建策略
    createStrategy() {
      this.isEditMode = false
      this.strategyForm = {
        name: '',
        type: '',
        description: '',
        isRecommended: false
      }
      this.createDialogVisible = true
    },
    
    // 提交策略表单
    submitStrategyForm() {
      this.$refs.strategyForm.validate((valid) => {
        if (valid) {
          // 这里应该调用API保存策略
          this.$message.success(this.isEditMode ? '策略更新成功' : '策略创建成功')
          this.createDialogVisible = false
          this.loadStrategies()
        }
      })
    },
    
    // 导入策略
    importStrategy() {
      this.$message.info('导入策略功能开发中')
      // 这里可以实现文件上传功能
    },
    
    // 获取策略类型标签类型
    getTypeTagType(type) {
      const typeMap = {
        'trend': 'primary',
        'mean_reversion': 'success',
        'ml': 'warning',
        'grid': 'info',
        'arbitrage': 'danger'
      }
      return typeMap[type] || 'default'
    },
    
    // 获取策略类型名称
    getTypeName(type) {
      const typeMap = {
        'trend': '趋势跟踪',
        'mean_reversion': '均值回归',
        'ml': '机器学习',
        'grid': '网格交易',
        'arbitrage': '套利策略'
      }
      return typeMap[type] || type
    },
    
    // 获取收益标签类型
    getProfitTagType(profit) {
      return profit >= 0 ? 'success' : 'danger'
    },
    
    // 获取收益样式类
    getProfitClass(profit) {
      return profit >= 0 ? 'profit-positive' : 'profit-negative'
    },
    
    // 格式化百分比
    formatPercent(value) {
      if (value === undefined || value === null) return '--'
      return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
    },
    
    // 格式化货币
    formatCurrency(value) {
      if (value === undefined || value === null) return '--'
      return `¥${value.toLocaleString()}`
    },
    
    // 模拟数据
    getMockStrategies() {
      const baseTime = new Date().getTime()
      return [
        {
          id: 'STR001',
          name: '智能趋势跟踪',
          type: 'trend',
          avgProfitRate: 18.5,
          maxDrawdown: 12.3,
          sharpeRatio: 1.8,
          winRate: 68.5,
          author: '系统管理员',
          publishTime: '2024-01-15',
          isRecommended: true,
          useCount: 156,
          description: '基于移动平均线和MACD指标的智能趋势跟踪策略，通过机器学习算法自适应调整参数，在不同市场环境下保持稳定收益。',
          parameters: [
            { name: 'shortPeriod', type: 'number', defaultValue: 5, description: '短期均线周期' },
            { name: 'longPeriod', type: 'number', defaultValue: 20, description: '长期均线周期' },
            { name: 'stopLoss', type: 'number', defaultValue: 5, description: '止损百分比' }
          ],
          backtestPeriod: '2023-01-01至2023-12-31',
          initialCapital: 100000,
          finalCapital: 118500,
          totalReturn: 18.5,
          tradeCount: 89
        },
        {
          id: 'STR002',
          name: '自适应均值回归',
          type: 'mean_reversion',
          avgProfitRate: 22.3,
          maxDrawdown: 15.8,
          sharpeRatio: 2.1,
          winRate: 72.8,
          author: '量化研究员',
          publishTime: '2024-02-20',
          isRecommended: true,
          useCount: 123,
          description: '利用价格回归均值的特性，结合波动率自适应调整仓位，在震荡市场中表现优异。',
          parameters: [
            { name: 'lookbackPeriod', type: 'number', defaultValue: 30, description: '回看周期' },
            { name: 'zScoreThreshold', type: 'number', defaultValue: 2, description: 'Z分数阈值' },
            { name: 'positionSize', type: 'number', defaultValue: 0.1, description: '仓位大小' }
          ],
          backtestPeriod: '2023-01-01至2023-12-31',
          initialCapital: 100000,
          finalCapital: 122300,
          totalReturn: 22.3,
          tradeCount: 145
        },
        {
          id: 'STR003',
          name: 'LSTM价格预测',
          type: 'ml',
          avgProfitRate: 28.7,
          maxDrawdown: 18.5,
          sharpeRatio: 1.6,
          winRate: 65.3,
          author: 'AI团队',
          publishTime: '2024-03-10',
          isRecommended: false,
          useCount: 98,
          description: '基于LSTM神经网络的价格预测模型，融合多种技术指标，在趋势明显的市场中具有较高预测准确率。',
          parameters: [
            { name: 'hiddenLayers', type: 'number', defaultValue: 2, description: '隐藏层数量' },
            { name: 'units', type: 'number', defaultValue: 64, description: '神经元数量' },
            { name: 'dropout', type: 'number', defaultValue: 0.3, description: ' dropout率' }
          ],
          backtestPeriod: '2023-01-01至2023-12-31',
          initialCapital: 100000,
          finalCapital: 128700,
          totalReturn: 28.7,
          tradeCount: 76
        },
        {
          id: 'STR004',
          name: '动态网格交易',
          type: 'grid',
          avgProfitRate: 15.6,
          maxDrawdown: 8.9,
          sharpeRatio: 2.3,
          winRate: 82.1,
          author: '交易员A',
          publishTime: '2024-04-05',
          isRecommended: false,
          useCount: 76,
          description: '根据市场波动率动态调整网格密度，在区间震荡市场中稳定获利，风险可控。',
          parameters: [
            { name: 'gridLevels', type: 'number', defaultValue: 10, description: '网格层数' },
            { name: 'gridWidth', type: 'number', defaultValue: 1.5, description: '网格宽度百分比' },
            { name: 'maxPosition', type: 'number', defaultValue: 0.5, description: '最大仓位' }
          ],
          backtestPeriod: '2023-01-01至2023-12-31',
          initialCapital: 100000,
          finalCapital: 115600,
          totalReturn: 15.6,
          tradeCount: 324
        },
        {
          id: 'STR005',
          name: '跨市场套利',
          type: 'arbitrage',
          avgProfitRate: 12.4,
          maxDrawdown: 5.2,
          sharpeRatio: 2.8,
          winRate: 91.5,
          author: '套利专家',
          publishTime: '2024-05-18',
          isRecommended: true,
          useCount: 45,
          description: '利用不同交易所间的价格差异进行套利，低风险稳定收益，需要快速的交易通道支持。',
          parameters: [
            { name: 'spreadThreshold', type: 'number', defaultValue: 0.5, description: '价差阈值' },
            { name: 'maxHoldTime', type: 'number', defaultValue: 60, description: '最大持仓时间(秒)' },
            { name: 'transactionFee', type: 'number', defaultValue: 0.1, description: '交易费率' }
          ],
          backtestPeriod: '2023-01-01至2023-12-31',
          initialCapital: 100000,
          finalCapital: 112400,
          totalReturn: 12.4,
          tradeCount: 213
        }
      ]
    }
  }
}
</script>

<style scoped>
.strategy-market-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.header-desc {
  color: #606266;
  font-size: 14px;
  margin-top: 5px;
}

.search-filter-section {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
}

.search-form .el-form-item {
  margin-right: 20px;
  margin-bottom: 15px;
}

.strategy-list-section .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.strategy-name-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.recommend-tag {
  margin-left: 5px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.strategy-detail-content .el-card {
  margin-bottom: 20px;
}

.strategy-detail-content .card-header {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 1px solid #ebeef5;
  background-color: #f5f7fa;
}

.strategy-description {
  line-height: 1.8;
  color: #606266;
}

.backtest-result {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.result-item {
  display: flex;
  align-items: center;
  min-width: 200px;
}

.result-label {
  color: #606266;
  margin-right: 5px;
}

.result-value {
  font-weight: 500;
  color: #303133;
}

.profit-positive {
  color: #67c23a;
}

.profit-negative {
  color: #f56c6c;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
