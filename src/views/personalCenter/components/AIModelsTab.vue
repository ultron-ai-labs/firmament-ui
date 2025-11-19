<template>
  <el-card class="models-card">
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-row>
        <el-table :data="aiModels" style="width: 100%">
          <el-table-column prop="name" label="模型名称" width="140"></el-table-column>
          <el-table-column label="模型类型" width="120">
            <template slot-scope="scope">
              <el-tag type="success">{{ scope.row.modelType }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="testCategory" label="测试模型分类" width="160">
          </el-table-column>
          <!-- <el-table-column prop="earnings" label="收益(%)" width="100">
            <template slot-scope="scope">
              <span :class="scope.row.earnings > 0 ? 'earnings-up' : 'earnings-down'">
                {{ scope.row.earnings }}
              </span>
            </template>
          </el-table-column> -->
          <el-table-column prop="createTime" label="创建时间" width="120"></el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleTestModel(scope.row)">测试</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-row>

  </el-card>
</template>

<script>
import {currentAllModels, testModelConnection} from "../../../api/model";

export default {
  name: 'AIModelsTab',
  props: {},
  data() {
    return {
      aiModels: []
    }
  },
  created() {
    this.fetchAIModels()
  },
  methods: {
    // 获取AI模型列表
    fetchAIModels() {
      currentAllModels().then(res => {
        this.aiModels = res.data || []
      })
    },
    getTagType(status) {
      const statusMap = {
        '运行中': 'success',
        '未运行': 'warning',
        '已停用': 'danger'
      }
      return statusMap[status] || 'info'
    },
    async handleTestModel(model) {
      await testModelConnection(model).then(res => {
        this.$message({type: 'success', message: '模型测试成功'})
      })
    }
  }
}
</script>

<style scoped>
.earnings-up {
  color: #13ce66;
}

.earnings-down {
  color: #ff4949;
}
</style>
