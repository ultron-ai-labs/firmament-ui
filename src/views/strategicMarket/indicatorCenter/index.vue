<template>
  <div class="indicator-center-container">
    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <el-card>
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="指标名称">
            <el-input v-model="searchForm.indicatorName" placeholder="请输入指标名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="指标类型">
            <el-select v-model="searchForm.indicatorType" placeholder="请选择指标类型" clearable>
              <el-option label="趋势类" value="trend"></el-option>
              <el-option label="震荡类" value="oscillator"></el-option>
              <el-option label="成交量类" value="volume"></el-option>
              <el-option label="波动率类" value="volatility"></el-option>
              <el-option label="自定义" value="custom"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="适用周期">
            <el-select v-model="searchForm.timeframe" placeholder="请选择适用周期" clearable>
              <el-option label="分钟级别" value="minute"></el-option>
              <el-option label="小时级别" value="hour"></el-option>
              <el-option label="日线级别" value="daily"></el-option>
              <el-option label="周线级别" value="weekly"></el-option>
              <el-option label="月线级别" value="monthly"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" icon="el-icon-search">搜索</el-button>
            <el-button @click="resetSearch" icon="el-icon-refresh">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    
    <!-- 快速分类导航 -->
    <div class="category-nav-section">
      <el-card>
        <div class="category-title">快速筛选</div>
        <div class="category-tags">
          <el-tag 
            v-for="category in categories" 
            :key="category.value"
            :type="searchForm.indicatorType === category.value ? 'primary' : 'info'"
            :closable="false"
            @click="filterByCategory(category.value)"
          >
            {{ category.label }}
          </el-tag>
          <el-tag 
            :type="searchForm.indicatorType === '' ? 'success' : 'default'"
            :closable="false"
            @click="filterByCategory('')"
          >
            全部
          </el-tag>
        </div>
      </el-card>
    </div>
    
    <!-- 指标列表 -->
    <div class="indicator-list-section">
      <el-card>
        <div class="card-header">
          <span class="section-title">指标列表</span>
          <div class="header-actions">
            <el-button type="primary" @click="createIndicator" icon="el-icon-plus">创建指标</el-button>
            <el-button type="success" @click="importIndicator" icon="el-icon-upload2">导入指标</el-button>
          </div>
        </div>
        
        <el-table 
          :data="indicators" 
          style="width: 100%"
          border
          stripe
          @row-click="viewIndicatorDetail"
        >
          <el-table-column prop="id" label="指标ID" width="100" align="center"></el-table-column>
          <el-table-column prop="name" label="指标名称" width="180" align="center">
            <template slot-scope="scope">
              <div class="indicator-name-container">
                <span class="indicator-name">{{ scope.row.name }}</span>
                <el-tag v-if="scope.row.isPopular" type="success" size="mini" class="popular-tag">热门</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="指标类型" width="120" align="center">
            <template slot-scope="scope">
              <el-tag :type="getTypeTagType(scope.row.type)">{{ getTypeName(scope.row.type) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="简要描述" align="left"></el-table-column>
          <el-table-column prop="author" label="作者" width="100" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="150" align="center"></el-table-column>
          <el-table-column prop="useCount" label="使用次数" width="100" align="center"></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button @click.stop="viewIndicatorDetail(scope.row)" type="primary" size="small">查看详情</el-button>
              <el-button @click.stop="addToFavorites(scope.row)" :type="scope.row.isFavorite ? 'info' : 'success'" size="small">
                {{ scope.row.isFavorite ? '已收藏' : '收藏' }}
              </el-button>
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
    
    <!-- 指标详情对话框 -->
    <el-dialog
      title="指标详情"
      :visible.sync="detailVisible"
      width="80%"
      :close-on-click-modal="false"
    >
      <div class="indicator-detail-content">
        <!-- 基本信息 -->
        <el-card class="info-card">
          <div slot="header" class="card-header">
            <span>基本信息</span>
          </div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="指标ID">{{ selectedIndicator.id }}</el-descriptions-item>
            <el-descriptions-item label="指标名称">{{ selectedIndicator.name }}</el-descriptions-item>
            <el-descriptions-item label="指标类型">{{ getTypeName(selectedIndicator.type) }}</el-descriptions-item>
            <el-descriptions-item label="适用周期">{{ getTimeframeName(selectedIndicator.timeframe) }}</el-descriptions-item>
            <el-descriptions-item label="作者">{{ selectedIndicator.author }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ selectedIndicator.createTime }}</el-descriptions-item>
            <el-descriptions-item label="使用次数">{{ selectedIndicator.useCount }}</el-descriptions-item>
            <el-descriptions-item label="热门程度">
              <el-rate v-model="selectedIndicator.popularityScore" disabled show-score></el-rate>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
        
        <!-- 指标描述 -->
        <el-card class="description-card">
          <div slot="header" class="card-header">
            <span>指标说明</span>
          </div>
          <div class="indicator-description">{{ selectedIndicator.fullDescription }}</div>
        </el-card>
        
        <!-- 计算公式 -->
        <el-card class="formula-card">
          <div slot="header" class="card-header">
            <span>计算公式</span>
          </div>
          <div class="indicator-formula">
            <pre>{{ selectedIndicator.formula }}</pre>
          </div>
        </el-card>
        
        <!-- 参数设置 -->
        <el-card class="params-card">
          <div slot="header" class="card-header">
            <span>参数设置</span>
          </div>
          <el-table :data="selectedIndicator.parameters" border style="width: 100%">
            <el-table-column prop="name" label="参数名称" width="150"></el-table-column>
            <el-table-column prop="type" label="参数类型" width="100"></el-table-column>
            <el-table-column prop="defaultValue" label="默认值" width="100"></el-table-column>
            <el-table-column prop="min" label="最小值" width="80"></el-table-column>
            <el-table-column prop="max" label="最大值" width="80"></el-table-column>
            <el-table-column prop="description" label="参数说明"></el-table-column>
          </el-table>
        </el-card>
        
        <!-- 使用示例 -->
        <el-card class="example-card">
          <div slot="header" class="card-header">
            <span>使用示例</span>
          </div>
          <div class="indicator-example">
            <pre>{{ selectedIndicator.exampleCode }}</pre>
          </div>
        </el-card>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="success" @click="addToFavorites(selectedIndicator)">
          {{ selectedIndicator.isFavorite ? '取消收藏' : '收藏指标' }}
        </el-button>
        <el-button type="primary" @click="applyIndicator(selectedIndicator)">应用指标</el-button>
      </div>
    </el-dialog>
    
    <!-- 创建指标对话框 -->
    <el-dialog
      :title="isEditMode ? '编辑指标' : '创建指标'"
      :visible.sync="createDialogVisible"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-form :model="indicatorForm" :rules="indicatorRules" ref="indicatorForm" label-width="100px">
        <el-form-item label="指标名称" prop="name">
          <el-input v-model="indicatorForm.name" placeholder="请输入指标名称"></el-input>
        </el-form-item>
        <el-form-item label="指标类型" prop="type">
          <el-select v-model="indicatorForm.type" placeholder="请选择指标类型">
            <el-option label="趋势类" value="trend"></el-option>
            <el-option label="震荡类" value="oscillator"></el-option>
            <el-option label="成交量类" value="volume"></el-option>
            <el-option label="波动率类" value="volatility"></el-option>
            <el-option label="自定义" value="custom"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用周期" prop="timeframe">
          <el-select v-model="indicatorForm.timeframe" placeholder="请选择适用周期">
            <el-option label="分钟级别" value="minute"></el-option>
            <el-option label="小时级别" value="hour"></el-option>
            <el-option label="日线级别" value="daily"></el-option>
            <el-option label="周线级别" value="weekly"></el-option>
            <el-option label="月线级别" value="monthly"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简要描述" prop="description">
          <el-input v-model="indicatorForm.description" type="textarea" :rows="2" placeholder="请输入简要描述"></el-input>
        </el-form-item>
        <el-form-item label="详细说明" prop="fullDescription">
          <el-input v-model="indicatorForm.fullDescription" type="textarea" :rows="4" placeholder="请输入详细说明"></el-input>
        </el-form-item>
        <el-form-item label="是否热门">
          <el-switch v-model="indicatorForm.isPopular"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitIndicatorForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'IndicatorCenter',
  data() {
    return {
      // 搜索表单
      searchForm: {
        indicatorName: '',
        indicatorType: '',
        timeframe: ''
      },
      // 指标分类
      categories: [
        { label: '趋势类', value: 'trend' },
        { label: '震荡类', value: 'oscillator' },
        { label: '成交量类', value: 'volume' },
        { label: '波动率类', value: 'volatility' },
        { label: '自定义', value: 'custom' }
      ],
      // 指标列表数据
      indicators: [],
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
      // 选中的指标
      selectedIndicator: {},
      // 创建/编辑指标表单
      indicatorForm: {
        name: '',
        type: '',
        timeframe: '',
        description: '',
        fullDescription: '',
        isPopular: false
      },
      // 表单验证规则
      indicatorRules: {
        name: [
          { required: true, message: '请输入指标名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择指标类型', trigger: 'change' }
        ],
        timeframe: [
          { required: true, message: '请选择适用周期', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入简要描述', trigger: 'blur' }
        ],
        fullDescription: [
          { required: true, message: '请输入详细说明', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadIndicators()
  },
  methods: {
    // 加载指标列表
    async loadIndicators() {
      try {
        // 这里应该调用API获取数据，暂时使用模拟数据
        this.indicators = this.getMockIndicators()
        this.total = this.indicators.length
      } catch (error) {
        this.$message.error('获取指标列表失败')
        console.error('Load indicators error:', error)
      }
    },
    
    // 搜索指标
    handleSearch() {
      this.currentPage = 1
      this.loadIndicators()
    },
    
    // 重置搜索
    resetSearch() {
      this.searchForm = {
        indicatorName: '',
        indicatorType: '',
        timeframe: ''
      }
      this.loadIndicators()
    },
    
    // 按分类筛选
    filterByCategory(category) {
      this.searchForm.indicatorType = category
      this.currentPage = 1
      this.loadIndicators()
    },
    
    // 页码变化
    handleCurrentChange(page) {
      this.currentPage = page
      this.loadIndicators()
    },
    
    // 查看指标详情
    viewIndicatorDetail(indicator) {
      this.selectedIndicator = { ...indicator }
      this.detailVisible = true
    },
    
    // 添加到收藏
    addToFavorites(indicator) {
      indicator.isFavorite = !indicator.isFavorite
      this.$message.success(indicator.isFavorite ? '收藏成功' : '取消收藏成功')
    },
    
    // 应用指标
    applyIndicator(indicator) {
      this.$message.success(`已选择应用指标：${indicator.name}`)
      // 这里可以跳转到图表分析页面并传递指标ID
      this.$router.push({
        path: '/analysis',
        query: { indicatorId: indicator.id }
      })
    },
    
    // 创建指标
    createIndicator() {
      this.isEditMode = false
      this.indicatorForm = {
        name: '',
        type: '',
        timeframe: '',
        description: '',
        fullDescription: '',
        isPopular: false
      }
      this.createDialogVisible = true
    },
    
    // 提交指标表单
    submitIndicatorForm() {
      this.$refs.indicatorForm.validate((valid) => {
        if (valid) {
          // 这里应该调用API保存指标
          this.$message.success(this.isEditMode ? '指标更新成功' : '指标创建成功')
          this.createDialogVisible = false
          this.loadIndicators()
        }
      })
    },
    
    // 导入指标
    importIndicator() {
      this.$message.info('导入指标功能开发中')
      // 这里可以实现文件上传功能
    },
    
    // 获取指标类型标签类型
    getTypeTagType(type) {
      const typeMap = {
        'trend': 'primary',
        'oscillator': 'success',
        'volume': 'warning',
        'volatility': 'info',
        'custom': 'danger'
      }
      return typeMap[type] || 'default'
    },
    
    // 获取指标类型名称
    getTypeName(type) {
      const typeMap = {
        'trend': '趋势类',
        'oscillator': '震荡类',
        'volume': '成交量类',
        'volatility': '波动率类',
        'custom': '自定义'
      }
      return typeMap[type] || type
    },
    
    // 获取周期名称
    getTimeframeName(timeframe) {
      const timeframeMap = {
        'minute': '分钟级别',
        'hour': '小时级别',
        'daily': '日线级别',
        'weekly': '周线级别',
        'monthly': '月线级别'
      }
      return timeframeMap[timeframe] || timeframe
    },
    
    // 模拟数据
    getMockIndicators() {
      // 简化版模拟数据，避免JSON转义问题
      return [
        {
          id: 'IND001',
          name: '移动平均线 (MA)',
          type: 'trend',
          timeframe: 'daily',
          description: '最常用的趋势指标，计算价格的平均值',
          author: '技术分析师',
          createTime: '2024-01-10',
          useCount: 567,
          isPopular: true,
          isFavorite: false,
          popularityScore: 4.8,
          fullDescription: '移动平均线(MA)是将一定时期内的证券价格（指数）平均值连成曲线，用来显示股价的历史波动情况，进而反映股价指数未来发展趋势的技术分析方法。',
          formula: 'SMA(n) = (P1 + P2 + ... + Pn) / n',
          parameters: [
            { name: 'period', type: 'number', defaultValue: 20, min: 1, max: 250, description: '计算周期' },
            { name: 'type', type: 'select', defaultValue: 'sma', options: ['sma', 'ema', 'wma'], description: '均线类型' }
          ],
          exampleCode: '// 计算简单移动平均线\nfunction calculateSMA(prices, period) {\n  return prices.map((price, index) => {\n    if (index < period - 1) return null;\n    const slice = prices.slice(index - period + 1, index + 1);\n    return slice.reduce((sum, p) => sum + p, 0) / period;\n  });\n}'
        },
        {
          id: 'IND002',
          name: '相对强弱指标 (RSI)',
          type: 'oscillator',
          timeframe: 'daily',
          description: '衡量价格变动速度和幅度的震荡指标',
          author: '量化专家',
          createTime: '2024-01-15',
          useCount: 489,
          isPopular: true,
          isFavorite: true,
          popularityScore: 4.7,
          fullDescription: '相对强弱指标(RSI)是通过比较一段时期内的平均收盘涨幅和平均收盘跌幅来分析市场买卖力量对比，从而对市场做出预测的一种指标。',
          formula: 'RSI(n) = 100 - [100 / (1 + RS)]',
          parameters: [
            { name: 'period', type: 'number', defaultValue: 14, min: 1, max: 100, description: '计算周期' },
            { name: 'overbought', type: 'number', defaultValue: 70, min: 50, max: 90, description: '超买阈值' },
            { name: 'oversold', type: 'number', defaultValue: 30, min: 10, max: 50, description: '超卖阈值' }
          ],
          exampleCode: '// 简化的RSI计算函数\nfunction calculateRSI(prices, period) {\n  const changes = [];\n  for (let i = 1; i < prices.length; i++) {\n    changes.push(prices[i] - prices[i - 1]);\n  }\n  return changes.map((change, index) => {\n    if (index < period - 1) return null;\n    // 简化计算，实际应用中应使用平滑方法\n    const slice = changes.slice(index - period + 1, index + 1);\n    const avgGain = slice.filter(c => c > 0).reduce((sum, c) => sum + c, 0) / period;\n    const avgLoss = Math.abs(slice.filter(c => c < 0).reduce((sum, c) => sum + c, 0) / period);\n    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;\n    return 100 - (100 / (1 + rs));\n  });\n}'
        },
        {
          id: 'IND003',
          name: 'MACD指标',
          type: 'trend',
          timeframe: 'daily',
          description: '由两条指数移动平均线组成的趋势跟踪指标',
          author: '交易策略师',
          createTime: '2024-02-01',
          useCount: 456,
          isPopular: true,
          isFavorite: false,
          popularityScore: 4.6,
          fullDescription: 'MACD(Moving Average Convergence Divergence)是一种趋势跟踪和动量指标，由快线(DIF)、慢线(DEA)和柱状图(Bar)三部分组成。',
          formula: 'MACD线 = 12日EMA - 26日EMA\n信号线 = MACD线的9日EMA',
          parameters: [
            { name: 'fastPeriod', type: 'number', defaultValue: 12, min: 1, max: 50, description: '快线周期' },
            { name: 'slowPeriod', type: 'number', defaultValue: 26, min: 1, max: 100, description: '慢线周期' },
            { name: 'signalPeriod', type: 'number', defaultValue: 9, min: 1, max: 50, description: '信号线周期' }
          ],
          exampleCode: '// 简化的MACD计算函数\nfunction calculateMACD(prices) {\n  // 这里是简化示例，实际应用中需要实现EMA计算\n  return {\n    macdLine: Array(prices.length).fill(0),\n    signalLine: Array(prices.length).fill(0),\n    histogram: Array(prices.length).fill(0)\n  };\n}'
        },
        {
          id: 'IND004',
          name: '布林带 (Bollinger Bands)',
          type: 'volatility',
          timeframe: 'daily',
          description: '由移动平均线和标准差组成的波动率指标',
          author: '波动率专家',
          createTime: '2024-02-15',
          useCount: 398,
          isPopular: true,
          isFavorite: false,
          popularityScore: 4.5,
          fullDescription: '布林带(Bollinger Bands)由三条线组成：中轨、上轨和下轨，用于测量价格的波动性。',
          formula: '中轨 = n日简单移动平均线\n上轨 = 中轨 + k × 标准差\n下轨 = 中轨 - k × 标准差',
          parameters: [
            { name: 'period', type: 'number', defaultValue: 20, min: 1, max: 250, description: '移动平均周期' },
            { name: 'stdDev', type: 'number', defaultValue: 2, min: 0.1, max: 5, description: '标准差倍数' }
          ],
          exampleCode: '// 简化的布林带计算\nfunction calculateBollingerBands(prices, period, stdDev) {\n  // 简化示例\n  return {\n    middleBand: prices,\n    upperBand: prices.map(p => p * 1.02),\n    lowerBand: prices.map(p => p * 0.98)\n  };\n}'
        }
      ]
    }
  }
}
</script>

<style scoped>
.indicator-center-container {
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

.category-nav-section {
  margin-bottom: 20px;
}

.category-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 10px;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-tags .el-tag {
  cursor: pointer;
}

.indicator-list-section .card-header {
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

.indicator-name-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.popular-tag {
  margin-left: 5px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.indicator-detail-content .el-card {
  margin-bottom: 20px;
}

.indicator-detail-content .card-header {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 1px solid #ebeef5;
  background-color: #f5f7fa;
}

.indicator-description {
  line-height: 1.8;
  color: #606266;
}

.indicator-formula pre,
.indicator-example pre {
  background-color: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
