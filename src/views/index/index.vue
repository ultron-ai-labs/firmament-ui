<!-- 大盘首页 -->
<template>
  <div class="dashboard-container">
    <!-- Tab切换 -->
    <el-tabs v-model="activeTab" class="dashboard-tabs">
      <el-tab-pane label="实时AI模拟交易总览" name="overview">
        <overview-tab/>
      </el-tab-pane>
      <!-- <el-tab-pane label="回测模型" name="backtest">
        <backtest-tab />
      </el-tab-pane> -->
      <!-- <el-tab-pane label="币价走势" name="crypto">
        <crypto-price-tab />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import OverviewTab from './OverviewTab.vue'
import BacktestTab from './BacktestTab.vue'
import CryptoPriceTab from './CryptoPriceTab.vue'
import {mapState} from 'vuex'

export default {
  name: 'Dashboard',
  components: {
    OverviewTab,
    BacktestTab,
    CryptoPriceTab
  },
  data() {
    return {
      activeTab: 'overview'
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
}

.dashboard-tabs {
  .el-tabs__content {
    padding: 20px 0 0;
  }
}
</style>
