<template>
  <div class="alert-config-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>告警配置</span>
        <el-button type="primary" size="small" @click="handleAdd" style="float: right">
          <i class="el-icon-plus"></i> 新增告警
        </el-button>
      </div>

      <!-- 搜索条件 -->
      <div class="search-container">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="告警类型">
            <el-select v-model="searchForm.alertType" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="type in alertTypes" :key="type.value" :label="type.label" :value="type.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="告警名称">
            <el-input v-model="searchForm.alertName" placeholder="请输入" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="fetchData">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 配置列表 -->
      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column prop="alertName" label="告警名称" width="150"></el-table-column>
        <el-table-column prop="alertType" label="告警类型" width="120">
          <template slot-scope="scope">
            <el-tag :type="getAlertTypeColor(scope.row.alertType)">{{ getAlertTypeName(scope.row.alertType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="alertAddress" label="告警地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <!-- 格式化时间 -->
          <template slot-scope="scope">
            {{ scope.row.createTime ? formatDate(scope.row.createTime) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
            <el-button size="mini" icon="el-icon-chat-dot-round" type="primary" circle @click="handleTest(scope.row)"></el-button>
            <!-- <el-button size="mini" icon="el-icon-collection" type="warning" circle @click="alertRecord(scope.row)"></el-button> -->
            <el-button size="mini" icon="el-icon-delete" type="danger" circle @click="deleteRecord(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next, jumper, total"
          :total="total"
          :current-page="page"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 新增/编辑配置对话框 -->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="100px"
      >
        <el-form-item label="告警名称" prop="alertName">
          <el-input v-model="form.alertName" placeholder="请输入告警名称" type="input"></el-input>
        </el-form-item>
        <el-form-item label="告警类型" prop="alertType">
          <el-select v-model="form.alertType" placeholder="请选择告警类型">
            <el-option v-for="type in alertTypes" :key="type.value" :label="type.label" :value="type.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="告警地址" prop="alertAddress">
          <el-input v-model="form.alertAddress" placeholder="请输入告警地址" :rows="2" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="告警签名" prop="alertSign">
          <el-input v-model="form.alertSign" placeholder="请输入告警签名" type="input" :rows="2"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <!-- 测试告警 -->
        <el-button type="warning" @click="handleDialogTest">测试告警</el-button>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAlertConfigList,
  addAlert,
  updateAlert,
  deleteAlertConfig,
  testAlert,
  getAlertTypeList
} from '@/api/alert'

export default {
  name: 'AlertConfig',
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      page: 1,
      pageSize: 10,
      alertTypes: [],
      searchForm: {
        alertType: '',
        alertName: ''
      },
      dialog: {
        visible: false,
        title: '新增告警',
        type: 'add'
      },
      form: {
        id: '',
        alertType: '',
        alertAddress: '',
        alertSign: '',
        alertName: ''
      },
      rules: {
        alertName: [
          {required: true, message: '请输入告警名称', trigger: 'blur'}
        ],
        alertType: [
          {required: true, message: '请选择告警类型', trigger: 'change'}
        ],
        alertAddress: [
          {required: true, message: '请输入告警地址', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.initAlertTypes()
    this.fetchData()
  },
  methods: {
    // 初始化告警类型
    async initAlertTypes() {
      try {
        const res = await getAlertTypeList()
        this.alertTypes = res.data || []
      } catch (error) {
        console.error('获取告警类型失败:', error)
        this.$message.error('获取告警类型失败')
      }
    },

    // 获取数据
    async fetchData() {
      this.loading = true
      try {
        const params = {
          page: this.page,
          pageSize: this.pageSize,
          ...this.searchForm
        }
        // 使用API获取数据
        const res = await getAlertConfigList(params)
        this.tableData = res.data.records
        this.total = res.data.total
      } catch (error) {
        console.error('获取告警配置失败:', error)
      } finally {
        this.loading = false
      }
    },
    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    // 获取告警类型颜色
    getAlertTypeColor(type) {
      const colors = {
        wechat: 'primary',
        dingding: 'success',
        feishu: 'warning'
      }
      return colors[type] || 'info'
    },

    // 获取告警类型名称
    getAlertTypeName(type) {
      const typeMap = {
        wechat: '企业微信',
        dingding: '钉钉群',
        feishu: '飞书'
      }
      return typeMap[type] || type
    },

    // 添加配置
    handleAdd() {
      this.dialog.type = 'add'
      this.dialog.title = '新增告警'
      this.resetForm()
      this.dialog.visible = true
    },

    // 编辑配置
    handleEdit(row) {
      this.dialog.type = 'edit'
      this.dialog.title = '编辑告警'
      this.form = {...row}
      this.dialog.visible = true
    },

    // 删除配置
    async handleDelete(row) {
      try {
        await this.$confirm('确定要删除该告警配置吗？删除之后将不能再使用该配置发送告警，已经绑定的报警任务将无法触发告警。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        // 调用API删除
        await deleteAlertConfig(row)

        // 更新本地数据
        this.$message.success('删除成功')
        // 查询查询
        this.fetchData()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除告警配置失败:', error)
          this.$message.error('删除失败')
        }
      }
    },

    // 测试告警
    async handleTest(row) {
      try {
        this.loading = true
        await testAlert({
          alertType: row.alertType,
          alertAddress: row.alertAddress,
          alertSign: row.alertSign
        })
        this.loading = false
        this.$message.success('测试申请发送成功，请查看群组消息')
      } catch (error) {
        console.error('测试告警失败:', error)
        this.$message.error('测试失败：' + (error.message || '未知错误'))
      } finally {
        this.loading = false
      }
    },
    handleDialogTest() {
      this.handleTest(this.form)
    },
    alertRecord(row) {
      // TODO 查询当前记录的告警记录

    },
    deleteRecord(row) {
      this.handleDelete(row)
    },
    // 提交表单
    async submitForm() {
      try {
        await this.$refs.form.validate()
        if (this.dialog.type === 'add') {
          // 添加
          await addAlert(this.form)
        } else {
          // 修改
          await updateAlert(this.form)
        }
        this.resetSearch()
        this.dialog.visible = false
      } catch (error) {
        if (error !== 'cancel') {
          console.error('提交表单失败:', error)
          this.$message.error('操作失败：' + (error.message || '未知错误'))
        }
      } finally {
        this.loading = false
      }
    },

    // 重置表单
    resetForm() {
      this.$refs.form && this.$refs.form.resetFields()
      this.form = {
        id: '',
        alertType: '',
        alertAddress: '',
        alertSign: '',
        alertName: ''
      }
    },

    // 重置搜索
    resetSearch() {
      this.searchForm = {
        alertType: '',
        alertAddress: ''
      }
      this.fetchData()
    },

    // 分页处理
    handleCurrentChange(val) {
      this.page = val
      this.fetchData()
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.page = 1
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.alert-config-container {
  padding: 20px;

  .search-container {
    margin-bottom: 20px;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
