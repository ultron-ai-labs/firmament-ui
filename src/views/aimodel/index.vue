<template>
  <div class="aiModel-container">
    <!-- 搜索和操作栏 -->
    <div class="aiModel-header">
      <div class="search-group">
        <el-input
          v-model="searchQuery"
          placeholder="搜索模型名称"
          prefix-icon="el-icon-search"
          clearable
          class="search-input"
          @keyup.enter.native="handleSearch"
        />
      </div>
      <el-button type="primary" @click="handleAddModel">
        <i class="el-icon-plus"></i> 添加模型
      </el-button>
      <el-button @click="handleSearch">
        <i class="el-icon-search"></i> 搜索
      </el-button>
    </div>

    <!-- 模型列表 -->
    <el-table
      v-loading="loading"
      :data="paginatedModels"
      style="width: 100%"
      border
      stripe
    >
      <el-table-column prop="name" label="模型名称" width="180">
        <template slot-scope="scope">
          <span class="model-name">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="modelType" label="模型类型" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.modelType === 'DeepSeek' ? 'success' : 'primary'">{{ scope.row.modelType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="testCategory" label="测试分类" width="150">
        <template slot-scope="scope">
          <el-tag type="info">{{ scope.row.testCategory }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="apiUrl" label="API地址" min-width="200">
        <template slot-scope="scope">
          <span class="truncate-text">{{ scope.row.apiUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEditModel(scope.row)">
            编辑
          </el-button>
          <el-button :loading="testing" type="success" size="mini" @click="testModelConn(scope.row)">
            测试连接
          </el-button>
          <!--          TODO 暂时不可删除-->
          <!--          <el-button type="danger" size="small" @click="handleDeleteModel(scope.row)">-->
          <!--            删除-->
          <!--          </el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        layout="prev, pager, next, jumper, sizes, total"
        :total="totalModels"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 添加/编辑模型对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="模型名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入模型名称"/>
        </el-form-item>
        <el-form-item label="模型类型" prop="modelType">
          <el-select v-model="form.modelType" placeholder="请选择模型类型">
            <el-option
              v-for="item in modelList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测试分类" prop="testCategory">
          <el-input v-model="form.testCategory" placeholder="请输入模型测试分类"/>
        </el-form-item>
        <el-form-item label="API地址" prop="apiUrl">
          <el-input v-model="form.apiUrl" placeholder="请输入模型API地址"/>
        </el-form-item>
        <el-form-item label="API Key" prop="apiKey">
          <el-input v-model="form.apiKey" placeholder="请输入模型安全Key" show-password/>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="handleTestModel" :loading="testing">
            <i class="el-icon-refresh"></i> 测试模型连接
          </el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getModelTypeList, currentModels, testModelConnection, addModel, updateModel, deleteModel} from "../../api/model";

export default {
  name: 'AiModel',
  data() {
    return {
      show: true,
      loading: false,
      searchQuery: '',
      currentPage: 1,
      pageSize: 10,
      totalModels: 0,
      dialogVisible: false,
      dialogTitle: '添加模型',
      editingModel: null,
      models: [],
      form: {
        name: '',
        modelType: '',
        testCategory: '',
        apiUrl: '',
        apiKey: '',
      },
      modelList: [],
      testing: false,
      rules: {
        name: [
          {required: true, message: '请输入模型名称', trigger: 'blur'},
          {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
        ],
        modelType: [
          {required: true, message: '请选择模型类型', trigger: 'change'},
        ],
        apiUrl: [
          {required: true, message: '请输入模型API地址', trigger: 'blur'},
        ],
        apiKey: [
          {required: true, message: '请输入模型安全Key', trigger: 'blur'},
        ],
        testCategory: [
          {required: true, message: '请输入模型测试分类', trigger: 'blur'},
        ],
      },
    }
  },
  created() {
    this.modelList = getModelTypeList().data
    this.fetchModels()
  },
  mounted() {
  },
  computed: {


    // 直接使用后端返回的分页数据
    paginatedModels() {
      return this.models
    },
  },
  methods: {
    // 获取模型列表
    fetchModels() {
      this.loading = true
      // 查询模型接口，传递分页参数
      currentModels({
        page: this.currentPage,
        pageSize: this.pageSize,
        name: this.searchQuery
      }).then((res) => {
        // 假设后端返回格式: {data: {records: [], total: 0, pageNum: 1, pageSize: 10}}
        if (res.code === 200 && res.data) {
          this.models = res.data.records || res.data.data || []
          this.totalModels = res.data.total || 0
          this.currentPage = res.data.page || this.currentPage
          this.pageSize = res.data.pageSize || this.pageSize
          this.loading = false
          // this.$message.success('模型列表获取成功')
          this.$nextTick(() => {
            this.dialogVisible = false
          })
        } else {
          this.models = []
          this.totalModels = 0
          this.loading = false
          this.$message.error('获取模型列表失败')
        }
      }).catch(error => {
        this.models = []
        this.totalModels = 0
        this.loading = false
        this.$message.error('获取模型列表失败')
        console.error('Error fetching models:', error)
      })
    },

    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },

    // 测试模型连接
    handleTestModel() {
      // 验证必要字段
      if (!this.form.apiUrl || !this.form.modelType) {
        this.$message.warning('请填写API地址和模型类型')
        return
      }
      // 需要验证API Key
      if (!this.form.apiKey) {
        this.$message.warning('请填写API Key')
        return
      }
      // 需要验证API Key
      if (!this.form.testCategory) {
        this.$message.warning('请填写测试分类')
        return
      }
      this.testing = true
      testModelConnection(this.form).then((res) => {
        this.testing = false
        if (res.data.result) {
          this.$message.success('模型连接测试成功')
        } else {
          this.$message.error('模型连接测试失败')
        }
      })
    },

    // 处理分页大小变化
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1 // 重置到第一页
      this.fetchModels() // 重新获取数据
    },

    // 处理当前页变化
    handleCurrentChange(current) {
      this.currentPage = current
      this.fetchModels() // 重新获取数据
    },

    // 处理搜索
    handleSearch() {
      this.currentPage = 1
      this.fetchModels()
    },

    // 打开添加模型对话框
    handleAddModel() {
      this.editingModel = null
      this.dialogTitle = '添加模型'
      this.resetForm()
      this.dialogVisible = true
    },

    // 打开编辑模型对话框
    handleEditModel(model) {
      this.editingModel = model
      this.dialogTitle = '编辑模型'
      this.form = {...model}
      this.dialogVisible = true
    },
    testModelConn(model) {
      this.testing = true
      testModelConnection(model).then((res) => {
        this.testing = false
        if (res.data.result) {
          this.$message.success('模型连接测试成功')
        } else {
          this.$message.error('模型连接测试失败')
        }
      })
    },
    // 重置表单
    resetForm() {
      this.form = {
        name: '',
        modelType: '',
        testCategory: '',
        apiUrl: '',
        apiKey: '',
      }
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields()
      }
    },

    // 提交表单
    async handleSubmit() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          try {
            // 显示加载状态
            if (this.editingModel) {
              // 编辑现有模型 - 调用更新接口
              const updateData = {
                ...this.form,
                // 确保包含原始模型名称用于标识
                originalName: this.editingModel.name
              }
              await updateModel(updateData)
              this.$message.success('模型更新成功')
            } else {
              // 添加新模型 - 调用新增接口
              await addModel(this.form)
              this.fetchModels()
              this.$message.success('模型添加成功')
            }

            // 关闭对话框
            this.dialogVisible = false

            // 重新加载模型列表，确保数据同步
            await this.fetchModels()
          } catch (error) {
            console.error('操作模型失败:', error)
            this.$message.error(
              error.response?.data?.msg ||
              (this.editingModel ? '模型更新失败' : '模型添加失败')
            )
          } finally {
            // 隐藏加载状态
          }
        }
      })
    },


    // 删除模型
    async handleDeleteModel(model) {
      this.$confirm('确定要删除该模型吗？此操作不可恢复。', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      }).then(async () => {
        try {
          // 显示加载状态

          // 调用删除接口
          await deleteModel(model.name)

          // 从本地列表中移除（可选，因为会重新加载）
          const index = this.models.findIndex((m) => m.name === model.name)
          if (index !== -1) {
            this.models.splice(index, 1)
          }

          this.$message.success('模型删除成功')

          // 重新加载模型列表
          await this.fetchModels()
        } catch (error) {
          console.error('删除模型失败:', error)
          this.$message.error(error.response?.data?.msg || '模型删除失败')
        } finally {
        }
      }).catch(() => {
        // 取消删除
      })
    },
  }
}
</script>

<style scoped>
.aiModel-container {
  padding: 20px;
}

.aiModel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-group {
  display: flex;
  gap: 12px;
}

.search-input {
  width: 300px;
}

.truncate-text {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.model-name {
  font-weight: 500;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
