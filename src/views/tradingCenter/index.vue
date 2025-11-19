<template>
  <div class="trading-center">
    <div class="page-header">
      <h2>交易中心</h2>
      <el-button type="primary" @click="openCreateDialog">新增账户</el-button>
    </div>
    
    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="交易所">
          <el-input v-model="searchForm.exchange" placeholder="请输入交易所名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="API名称">
          <el-input v-model="searchForm.apiName" placeholder="请输入API名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="模拟盘">
          <el-select v-model="searchForm.simulation" placeholder="请选择" clearable>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 数据表格 -->
    <div class="table-section">
      <el-table v-loading="loading" :data="accountList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="exchange" label="交易所" width="120"></el-table-column>
        <el-table-column prop="apiName" label="API名称"></el-table-column>
        <el-table-column prop="apiKey" label="API Key" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ maskApiKey(scope.row.apiKey) }}
          </template>
        </el-table-column>
        <el-table-column prop="secretKey" label="Secret Key" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ maskSecretKey(scope.row.secretKey) }}
          </template>
        </el-table-column>
        <el-table-column prop="passphrase" label="Passphrase" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ maskPassphrase(scope.row.passphrase) }}
          </template>
        </el-table-column>
        <el-table-column prop="simulation" label="模拟盘">
          <template slot-scope="scope">
            <el-tag :type="scope.row.simulation === 1 ? 'warning' : 'success'">
              {{ scope.row.simulation === 1 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180"></el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteAccount(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 分页 -->
    <div class="pagination-section">
      <el-pagination
        v-if="total > 0"
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    
    <!-- 创建/编辑对话框 -->
    <el-dialog
      :title="isEdit ? '编辑账户' : '新增账户'"
      :visible.sync="dialogVisible"
      width="50%"
      @close="handleClose"
    >
      <el-form ref="accountForm" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="交易所" prop="exchange">
          <el-input v-model="formData.exchange" placeholder="请输入交易所名称"></el-input>
        </el-form-item>
        <el-form-item label="API名称" prop="apiName">
          <el-input v-model="formData.apiName" placeholder="请输入API名称"></el-input>
        </el-form-item>
        <el-form-item label="API Key" prop="apiKey">
          <el-input v-model="formData.apiKey" placeholder="请输入API Key"></el-input>
        </el-form-item>
        <el-form-item label="Secret Key" prop="secretKey">
          <el-input v-model="formData.secretKey" placeholder="请输入Secret Key"></el-input>
        </el-form-item>
        <el-form-item label="Passphrase" prop="passphrase">
          <el-input v-model="formData.passphrase" placeholder="请输入Passphrase（可选）"></el-input>
        </el-form-item>
        <el-form-item label="模拟盘" prop="simulation">
          <el-radio-group v-model="formData.simulation">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTradingAccounts, createTradingAccount, updateTradingAccount, deleteTradingAccount } from '@/api/realTradingAccount'

export default {
  name: 'TradingCenter',
  data() {
    return {
      loading: false,
      dialogVisible: false,
      isEdit: false,
      accountList: [],
      total: 0,
      searchForm: {
        exchange: '',
        apiName: '',
        simulation: ''
      },
      pagination: {
        currentPage: 1,
        pageSize: 10
      },
      formData: {
        id: '',
        exchange: '',
        apiKey: '',
        secretKey: '',
        apiName: '',
        passphrase: '',
        simulation: '0'
      },
      formRules: {
        exchange: [
          { required: true, message: '请输入交易所名称', trigger: 'blur' }
        ],
        apiKey: [
          { required: true, message: '请输入API Key', trigger: 'blur' }
        ],
        secretKey: [
          { required: true, message: '请输入Secret Key', trigger: 'blur' }
        ],
        apiName: [
          { required: true, message: '请输入API名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取数据
    async fetchData() {
      this.loading = true
      try {
        const params = {
          ...this.searchForm,
          page: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        }
        const response = await getTradingAccounts(params)
        this.accountList = response.data.list || []
        this.total = response.data.total || 0
      } catch (error) {
        this.$message.error('获取数据失败')
        console.error('获取账户列表失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 搜索
    search() {
      this.pagination.currentPage = 1
      this.fetchData()
    },
    
    // 重置
    reset() {
      this.searchForm = {
        exchange: '',
        apiName: '',
        simulation: ''
      }
      this.pagination.currentPage = 1
      this.fetchData()
    },
    
    // 分页大小变化
    handleSizeChange(size) {
      this.pagination.pageSize = size
      this.fetchData()
    },
    
    // 当前页码变化
    handleCurrentChange(current) {
      this.pagination.currentPage = current
      this.fetchData()
    },
    
    // 打开创建对话框
    openCreateDialog() {
      this.isEdit = false
      this.resetForm()
      this.dialogVisible = true
    },
    
    // 打开编辑对话框
    openEditDialog(row) {
      this.isEdit = true
      this.formData = { ...row }
      this.dialogVisible = true
    },
    
    // 重置表单
    resetForm() {
      this.formData = {
        id: '',
        exchange: '',
        apiKey: '',
        secretKey: '',
        apiName: '',
        passphrase: '',
        simulation: '0'
      }
      if (this.$refs.accountForm) {
        this.$refs.accountForm.resetFields()
      }
    },
    
    // 关闭对话框
    handleClose() {
      this.resetForm()
    },
    
    // 提交表单
    async submitForm() {
      try {
        await this.$refs.accountForm.validate()
        
        const formDataCopy = { ...this.formData }
        formDataCopy.simulation = parseInt(formDataCopy.simulation)
        
        if (this.isEdit) {
          await updateTradingAccount(formDataCopy)
          this.$message.success('编辑成功')
        } else {
          await createTradingAccount(formDataCopy)
          this.$message.success('创建成功')
        }
        
        this.dialogVisible = false
        this.fetchData()
      } catch (error) {
        if (error !== false) { // 排除表单验证失败的情况
          this.$message.error(this.isEdit ? '编辑失败' : '创建失败')
          console.error(this.isEdit ? '编辑账户失败:' : '创建账户失败:', error)
        }
      }
    },
    
    // 删除账户
    async deleteAccount(id) {
      try {
        await this.$confirm('确定要删除该账户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await deleteTradingAccount(id)
        this.$message.success('删除成功')
        this.fetchData()
      } catch (error) {
        if (error !== 'cancel') { // 排除取消删除的情况
          this.$message.error('删除失败')
          console.error('删除账户失败:', error)
        }
      }
    },
    
    // 掩码API Key
    maskApiKey(key) {
      if (!key) return ''
      if (key.length <= 8) return '****'
      return key.substring(0, 4) + '****' + key.substring(key.length - 4)
    },
    
    // 掩码Secret Key
    maskSecretKey(key) {
      if (!key) return ''
      return '****'
    },
    
    // 掩码Passphrase
    maskPassphrase(passphrase) {
      if (!passphrase) return ''
      return '****'
    }
  }
}
</script>

<style lang="scss" scoped>
.trading-center {
  padding: 20px;
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
    }
  }
  
  .search-section {
    background: #f5f7fa;
    padding: 16px;
    border-radius: 4px;
    margin-bottom: 20px;
    
    .search-form {
      margin-bottom: 0;
    }
  }
  
  .table-section {
    margin-bottom: 20px;
    
    ::v-deep .el-table {
      .el-table__header {
        th {
          background-color: #fafafa;
          font-weight: 500;
        }
      }
    }
  }
  
  .pagination-section {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>