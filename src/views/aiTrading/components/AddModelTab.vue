<template>
  <div class="add-model-content">
    <el-card class="add-model-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>添加新交易模型</span>
      </div>
      <el-form ref="modelForm" :model="modelData" :rules="modelRules" label-width="120px">
        <el-form-item label="模型名称" prop="name">
          <el-input v-model="modelData.name" placeholder="请输入模型名称"/>
        </el-form-item>
        <el-form-item label="模型类型" prop="type">
          <el-select v-model="modelData.type" placeholder="请选择模型类型">
            <el-option label="MACD策略" value="macd"/>
            <el-option label="RSI策略" value="rsi"/>
            <el-option label="布林带策略" value="bollinger"/>
            <el-option label="自定义策略" value="custom"/>
          </el-select>
        </el-form-item>
        <el-form-item label="交易对" prop="pair">
          <el-input v-model="modelData.pair" placeholder="如：BTC/USDT"/>
        </el-form-item>
        <el-form-item label="初始资金" prop="initialCapital">
          <el-input v-model.number="modelData.initialCapital" type="number" placeholder="请输入初始资金"/>
        </el-form-item>
        <el-form-item label="风险等级" prop="riskLevel">
          <el-slider v-model="modelData.riskLevel" :min="1" :max="5" show-stops/>
        </el-form-item>
        <el-form-item label="参数配置" prop="parameters">
          <el-input v-model="modelData.parameters" type="textarea" :rows="4" placeholder="JSON格式的参数配置"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitModel">提交</el-button>
          <el-button @click="resetModel">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AddModelTab',
  data() {
    return {
      // 表单验证规则
      modelRules: {
        name: [{required: true, message: '请输入模型名称', trigger: 'blur'}],
        type: [{required: true, message: '请选择模型类型', trigger: 'change'}],
        pair: [{required: true, message: '请输入交易对', trigger: 'blur'}],
        initialCapital: [{required: true, message: '请输入初始资金', trigger: 'blur'}]
      }
    }
  },
  props: {
    modelData: {
      type: Object,
      default: () => ({
        name: '',
        type: '',
        pair: '',
        initialCapital: 0,
        riskLevel: 3,
        parameters: ''
      })
    }
  },
  methods: {
    // 提交新模型
    submitModel() {
      this.$refs.modelForm.validate((valid) => {
        if (valid) {
          try {
            // 验证参数格式
            if (this.modelData.parameters) {
              JSON.parse(this.modelData.parameters)
            }
            this.$emit('submit', this.modelData)
          } catch (error) {
            this.$message.error('参数配置格式错误，请输入有效的JSON格式')
          }
        } else {
          return false
        }
      })
    },

    // 重置表单
    resetModel() {
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss" scoped>
.add-model-content {
  .add-model-card {
    .el-form {
      margin-top: 20px;
    }

    .el-form-item {
      margin-bottom: 25px;
    }
  }
}
</style>
