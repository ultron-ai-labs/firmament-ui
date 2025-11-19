<template>
  <div class="prompt-config-container">
    <el-card>
      <!-- 搜索筛选区域 -->
      <div class="search-area">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="提示词名称">
            <el-input v-model="searchForm.name" placeholder="请输入提示词名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="handleSearch">查询</el-button>
            <el-button size="mini" @click="resetSearch">重置</el-button>
            <!-- <el-button size="mini" type="info" @click="promptDemo">提示词示例</el-button> -->
          </el-form-item>
        </el-form>
        <!-- 新增按钮 -->
        <div class="add-button">
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAddPrompt">新增提示词</el-button>
        </div>
      </div>

      <!-- 提示词列表 -->
      <div class="table-container">
        <el-table :data="promptList" style="width: 100%" v-loading="loading">
          <el-table-column prop="name" label="提示词名称" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="language" label="语言" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.language === 'zh-CN' ? '中文' : 'English' }}
            </template>
          </el-table-column>
          <el-table-column prop="systemPrompt" label="系统提示词" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="prompt-content">{{ scope.row.systemPrompt }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleEditPrompt(scope.row)">编辑</el-button>
              <!-- <el-button type="danger" size="mini" @click="handleDeletePrompt(scope.row)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页控件 -->
      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next, jumper, sizes, total"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 新增/编辑提示词对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form ref="promptForm" :model="formData" :rules="rules" label-width="140px">
        <!-- 基本信息 -->
        <el-form-item label="提示词名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入提示词名称" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="语言设置">
          <el-select v-model="formData.language">
            <el-option label="中文" value="zh-CN"></el-option>
            <el-option label="英文" value="en-US"></el-option>
          </el-select>
        </el-form-item>

        <!-- 提示词内容 -->
        <el-form-item label="系统提示词" prop="systemPrompt">
          <el-input
            v-model="formData.systemPrompt"
            type="textarea"
            placeholder="请输入系统提示词，指导AI的整体行为"
            :rows="4"
            maxlength="2000"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="风控提示词" prop="riskManagementPrompt">
          <el-input
            v-model="formData.riskManagementPrompt"
            type="textarea"
            placeholder="请输入风控提示词，定义风险控制规则"
            :rows="4"
            maxlength="2000"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="交易规则提示词" prop="tradingRulePrompt">
          <el-input
            v-model="formData.tradingRulePrompt"
            type="textarea"
            placeholder="请输入交易规则提示词，定义交易决策原则"
            :rows="4"
            maxlength="2000"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="退出策略提示词" prop="exitStrategyPrompt">
          <el-input
            v-model="formData.exitStrategyPrompt"
            type="textarea"
            placeholder="请输入退出策略提示词，定义止盈止损规则"
            :rows="4"
            maxlength="2000"
            show-word-limit
          ></el-input>
        </el-form-item>
        <!-- 禁用的默认的提示词 -->
         <!-- <el-form-item label="市场数据提示词" prop="marketPrompt">
          <el-input
           :disabled="true"
            v-model="formData.marketPrompt"
            type="textarea"
            placeholder="请输入市场数据提示词"
            :rows="4"
            maxlength="2000"
            show-word-limit
          ></el-input>
        </el-form-item>
          <el-form-item label="市场指标提示词" prop="indicatorPrompt">
          <el-input
           :disabled="true"
            v-model="formData.indicatorPrompt"
            type="textarea"
            placeholder="请输入指标数据提示词"
            :rows="4"
            maxlength="2000"
            show-word-limit
          ></el-input>
        </el-form-item>
         <el-form-item label="账户数据提示词" prop="accountPrompt">
          <el-input
           :disabled="true"
            v-model="formData.accountPrompt"
            type="textarea"
            placeholder="账户数据提示词"
            :rows="4"
            maxlength="2000"
            show-word-limit
          ></el-input>
        </el-form-item>
          <el-form-item label="运行订单数据提示词" prop="runningOrderPrompt">
          <el-input
           :disabled="true"
            v-model="formData.runningOrderPrompt"
            type="textarea"
            placeholder="运行订单数据提示词"
            :rows="4"
            maxlength="2000"
            show-word-limit
          ></el-input>
        </el-form-item>
               <el-form-item label="信号数据提示词" prop="signalPrompt">
          <el-input
           :disabled="true"
            v-model="formData.signalPrompt"
            type="textarea"
            placeholder="信号数据提示词"
            :rows="4"
            maxlength="2000"
            show-word-limit
          ></el-input>
        </el-form-item>
                     <el-form-item label="输出格式提示词" prop="outputFormatPrompt">
          <el-input
           :disabled="true"
            v-model="formData.outputFormatPrompt"
            type="textarea"
            placeholder="输出格式提示词"
            :rows="4"
            maxlength="2000"
            show-word-limit
          ></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPromptList, createPrompt, updatePrompt } from '@/api/prompt'

export default {
  name: 'PromptConfigList',
  data() {
    return {
      // 搜索表单
      searchForm: {
        name: '',
      },

      // 提示词列表数据
      promptList: [],

      // 分页信息
      total: 0,
      currentPage: 1,
      pageSize: 10,

      // 对话框控制
      dialogVisible: false,
      dialogTitle: '新增提示词',

      // 表单数据
      formData: {
        id: '',
        name: '',
        language: 'zh-CN',
        status: true,
        systemPrompt: '',
        marketPrompt: '',
        indicatorPrompt: '',
        accountPrompt: '',
        runningOrderPrompt: '',
        riskManagementPrompt: '',
        tradingRulePrompt: '',
        exitStrategyPrompt: '',
        signalPrompt: '',
        outputFormatPrompt: '',
      },
      stonePrompt: {
        'zh-CN': {
          marketPrompt: '币种：{coin}，时间戳：{timestamp}，开盘价：{open}，最高价：{high}，最低价：{low}，收盘价：{close}，成交量：{vol}。',
          indicatorPrompt: '币种：{coin}，EMA9:{ema9},EMA20:{ema20},MACD:{macd},MACD_signal:{macdSignal},MACD_diff:{macdDiff},RSI12:{rsi12},RSI24:{rsi24}。',
          accountPrompt: '你的账户信息：总金额：{totalAmount}，利润总额：{totalProfit}，总占用金额：{totalOccupiedAmount}；多头订单：{longOrderCount}；空头订单：{shortOrderCount}。',
          runningOrderPrompt: '正在运行的订单，币种：{coin}，头寸：{position}，杠杆：{leverage}，开仓价：{openPrice}，预期止盈:{targetProfitPrice}，预期止损:{targetStopLoss}，%s，多头或空头：{positionType}。',
          signalPrompt: '我们需要你计算给定的信号：sell_to_enter、buy_to_enter、close_position、hold、close_short_orders、close_long_orders。注意不要倾向于多头或空头头寸，因为两者都需要平衡排序。',
          outputFormatPrompt: '如果有订单，请管理当前订单，而不是新订单。只允许以JSON格式输出（返回的信号只能是：sell_to_ine、buy_to_iner、close_position、hold、close_short_orders、close_long_orders），不允许以其他格式输出。JSON格式如下：{"BTC":{"signal":"sell_to_enter","quantity":0,"leverage":1,"profit_target":0,"current_price":0,"stop_loss":0,"confidence":0,"justification":"为EMA4/EMA12分析提供的市场数据不足。需要当前价格数据和EMA值来生成有效的交易信号。"}}.。请注意，数量代表所下订单的总金额。例如，如果账户有10000美元，需要200美元的订单，那么这个订单就是200美元，有杠杆。做多或做空时，数量不能为0，杠杆不能为0',
        },
        'en-US': {
          marketPrompt: 'Coin: {coin},timestamp: {timestamp},open: {open},high: {high},low: {low},close: {close},vol: {vol}.',
          indicatorPrompt: 'Coin: {coin},EMA9:{ema9},EMA20:{ema20},MACD:{macd},MACD_signal:{macdSignal},MACD_diff:{macdDiff},RSI12:{rsi12},RSI24:{rsi24}.',
          accountPrompt: 'Your account information: total amount: {totalAmount}, total profit: {totalProfit}, total occupied amount: {totalOccupiedAmount},Long orders:{longOrderCount},Short orders: {shortOrderCount}.',
          runningOrderPrompt: 'Runing Order,Coin: {coin},position: {position},leverage: {leverage},open price:{openPrice},targetProfitPrice: {targetProfitPrice},targetStopLoss: {targetStopLoss},side: {positionType}.',
          signalPrompt: 'We need you to calculate the given signals => sell_to_enter、buy_to_enter、close_position、hold、close_short_orders、close_long_orders. Be careful not to lean towards long or short positions, as both require balanced ordering.',
          outputFormatPrompt: 'If there are orders, manage the current orders instead of new ones. Only allow output in JSON format(The returned signal can only be: sell_to_enter、buy_to_enter、close_position、hold、close_short_orders、close_long_orders), do not output in other formats. The JSON format is as follows：{"BTC":{"signal":"sell_to_enter","quantity":0,"leverage":1,"profit_target":0,"current_price":0,"stop_loss":0,"confidence":0,"justification":"Insufficient market data provided for EMA4/EMA12 analysis. Need current price data and EMA values to generate valid trading signals."}}. Note that quantity represents the total amount of the order placed. For example, if the account has $10000 and requires an order of $200, then this order is $200, with leverage.When going long or short, the quantity cannot be 0 and the leverage cannot be 0',
        },
      },
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入提示词名称', trigger: 'blur' },
          { min: 1, max: 100, message: '提示词名称长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        systemPrompt: [
          { required: true, message: '请输入系统提示词', trigger: 'blur' },
          { min: 10, message: '系统提示词长度至少10个字符', trigger: 'blur' }
        ],
        riskManagementPrompt: [
          { required: true, message: '请输入风控提示词', trigger: 'blur' },
          { min: 10, message: '风控提示词长度至少10个字符', trigger: 'blur' }
        ],
        tradingRulePrompt: [
          { required: true, message: '请输入交易规则提示词', trigger: 'blur' },
          { min: 10, message: '交易规则提示词长度至少10个字符', trigger: 'blur' }
        ],
        exitStrategyPrompt: [
          { required: true, message: '请输入退出策略提示词', trigger: 'blur' },
          { min: 10, message: '退出策略提示词长度至少10个字符', trigger: 'blur' }
        ]
      },

      // 加载状态
      loading: false
    }
  },

  created() {
    this.fetchPromptList()
  },

  methods: {
    promptDemo(){
      // TODO 待定
    },
    // 获取提示词列表
    async fetchPromptList() {
      this.loading = true
      // 构建查询参数
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          name: this.searchForm.name,
        }
      try {
        // 调用API获取列表数据
        const { data } = await getPromptList(params)
        debugger
        if (data) {
          this.promptList = data.records
          this.total = data.total
        }
      } catch (error) {
        console.error('获取提示词列表失败:', error)
        // 出错时使用模拟数据
      } finally {
        this.loading = false
      }
    },

    // 搜索
    handleSearch() {
      this.currentPage = 1
      this.fetchPromptList()
    },

    // 重置搜索
    resetSearch() {
      this.searchForm = {
        name: '',
        status: ''
      }
      this.currentPage = 1
      this.fetchPromptList()
    },

    // 分页大小变化
    handleSizeChange(size) {
      this.pageSize = size
      this.fetchPromptList()
    },

    // 当前页码变化
    handleCurrentChange(current) {
      this.currentPage = current
      this.fetchPromptList()
    },

    // 打开新增对话框
    handleAddPrompt() {
      this.dialogTitle = '新增提示词'
      this.resetFormData()
      this.dialogVisible = true
    },

    // 打开编辑对话框
    handleEditPrompt(row) {
      this.dialogTitle = '编辑提示词'
      this.formData = { ...row }
      this.dialogVisible = true
    },

    // 重置表单数据
    resetFormData() {
      this.formData = {
        promptId: '',
        name: '',
        language: 'zh-CN',
        status: true,
        systemPrompt: '',
        marketPrompt: '',
        indicatorPrompt: '',
        accountPrompt: '',
        runningOrderPrompt: '',
        riskManagementPrompt: '',
        tradingRulePrompt: '',
        exitStrategyPrompt: '',
        signalPrompt: '',
        outputFormatPrompt: '',
      }
      this.$refs.promptForm?.resetFields()
    },

    // 提交表单
    async handleSubmit() {
      this.$refs.promptForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            // 准备提交数据
            const submitData = {
              promptId: this.formData.promptId,
              name: this.formData.name,
              language: this.formData.language,
              status: this.formData.status,
              systemPrompt: this.formData.systemPrompt,
              riskManagementPrompt: this.formData.riskManagementPrompt,
              tradingRulePrompt: this.formData.tradingRulePrompt,
              exitStrategyPrompt: this.formData.exitStrategyPrompt
            }

            // 判断语种
            if (this.formData.language === 'zh-CN') {
              // 中文
              submitData.marketPrompt = this.stonePrompt['zh-CN'].marketPrompt
              submitData.indicatorPrompt = this.stonePrompt['zh-CN'].indicatorPrompt
              submitData.accountPrompt = this.stonePrompt['zh-CN'].accountPrompt
              submitData.runningOrderPrompt = this.stonePrompt['zh-CN'].runningOrderPrompt
              submitData.signalPrompt = this.stonePrompt['zh-CN'].signalPrompt
              submitData.outputFormatPrompt = this.stonePrompt['zh-CN'].outputFormatPrompt
            }

            if (this.formData.language === 'en-US') {
              // 英文
              submitData.marketPrompt = this.stonePrompt['en-US'].marketPrompt
              submitData.indicatorPrompt = this.stonePrompt['en-US'].indicatorPrompt
              submitData.accountPrompt = this.stonePrompt['en-US'].accountPrompt
              submitData.runningOrderPrompt = this.stonePrompt['en-US'].runningOrderPrompt
              submitData.signalPrompt = this.stonePrompt['en-US'].signalPrompt
              submitData.outputFormatPrompt = this.stonePrompt['en-US'].outputFormatPrompt
            }

            let result
            // 根据是否有ID判断是新增还是编辑
            if (this.formData.promptId) {
              // 编辑操作
              result = await updatePrompt(submitData)
            } else {
              // 新增操作
              result = await createPrompt(submitData)
            }
            console.log(result)
            if(result.code === 200){
          this.loading = false
            this.dialogVisible = false
            this.fetchPromptList() // 重新加载列表
            }

          } catch (error) {
            console.error('操作提示词失败:', error)
            this.$message.error('网络错误，请稍后重试')
          } finally {
            this.loading = false
          }
        }
      })
    },

    // 删除提示词
    handleDeletePrompt(row) {
      this.$confirm(`确定要删除提示词「${row.name}」吗？`, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.loading = true
        try {
          const { data } = await deletePrompt(row.id)
          if (data && data.code === 200) {
            this.$message.success('删除成功')
            this.fetchPromptList() // 重新加载列表
          } else {
            this.$message.error(data && data.msg ? data.msg : '删除失败')
          }
        } catch (error) {
          console.error('删除提示词失败:', error)
          this.$message.error('网络错误，请稍后重试')
        } finally {
          this.loading = false
        }
      }).catch(() => {
        // 取消删除
      })
    }
  }
}
</script>

<style scoped>
.prompt-config-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 500;
}

.page-header p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.search-area {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.add-button {
  margin-top: 10px;
}

.table-container {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
}

.prompt-content {
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.dialog-footer .el-button {
  margin-left: 12px;
}

@media (max-width: 768px) {
  .search-area {
    flex-direction: column;
    align-items: stretch;
  }

  .add-button {
    margin-top: 15px;
    text-align: right;
  }
}
</style>
