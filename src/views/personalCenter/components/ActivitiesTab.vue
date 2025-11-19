<template>
  <el-card class="activity-card">
    <el-timeline class="activity-list">
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :timestamp="activity.timestamp"
      >
        <el-card shadow="hover">
          <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 16px; font-weight: 500;">{{ activity.title }}</h3>
          <p style="color: #606266; margin-bottom: 0;">{{ activity.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <!-- 空状态提示 --->
    <div v-if="activities.length === 0" class="empty-state">
      <el-empty description="暂无活动记录"></el-empty>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'ActivitiesTab',
  props: {
    activities: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.activity-card {
  .activity-list {
    ::v-deep .el-timeline-item__timestamp {
      color: #909399;
    }

    ::v-deep .el-card {
      cursor: default;
      transition: box-shadow 0.3s ease;
    }

    ::v-deep .el-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  .empty-state {
    padding: 40px 0;
    text-align: center;
  }
}
</style>
