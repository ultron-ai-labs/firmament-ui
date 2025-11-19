<template>
  <div class="kline-history">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>历史K线数据</h2>
      <p style="color: black">查看和分析历史K线数据，支持多交易所、多币种和多时间周期查询</p>
    </div>

    <!-- 查询表单 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" :inline="true" label-width="100px">
        <el-form-item label="交易所">
          <el-select v-model="searchForm.exchange" placeholder="请选择交易所">
            <el-option
              v-for="item in exchanges"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="币种代码">
          <el-select v-model="searchForm.cryptoCode" placeholder="请输入币种代码">
            <el-option
              v-for="item in cryptos"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="时间周期">
          <el-select v-model="searchForm.timeUnit" placeholder="请选择时间周期">
            <el-option
              v-for="item in timeUnits"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开始时间">
          <el-date-picker
            v-model="searchForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            value-format="timestamp"
            clearable
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间">
          <el-date-picker
            v-model="searchForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            value-format="timestamp"
            clearable
          ></el-date-picker>
        </el-form-item>
        <!--  输入框查询成交量大小，不能小于0    -->
        <!--        <el-form-item label="成交量">-->
        <!--          <el-input v-model="searchForm.volume" type="number" placeholder="请输入成交量大小"></el-input>-->
        <!--        </el-form-item>-->

        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never" class="table-card">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="cryptoCode" label="币种代码" width="200"></el-table-column>
        <el-table-column prop="exchange" label="交易所" width="100"></el-table-column>
        <el-table-column prop="timeUnit" label="时间周期" width="100"></el-table-column>
        <el-table-column prop="openTime" label="开盘时间" width="180">
          <template slot-scope="scope">
            {{ formatDateTime(scope.row.openTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="open" label="开盘价" width="120">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.open) }}
          </template>
        </el-table-column>
        <el-table-column prop="high" label="最高价" width="120">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.high) }}
          </template>
        </el-table-column>
        <el-table-column prop="low" label="最低价" width="120">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.low) }}
          </template>
        </el-table-column>
        <el-table-column prop="close" label="收盘价" width="120">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.close) }}
          </template>
        </el-table-column>
        <el-table-column prop="volume" label="成交量" width="120">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.volume) }}
          </template>
        </el-table-column>
        <el-table-column prop="priceChange" label="涨跌幅" width="120">
          <template slot-scope="scope">
            <span :class="{ 'price-down': scope.row.priceChange > 0, 'price-up': scope.row.priceChange < 0 }">
              {{ scope.row.priceChange > 0 ? '+' : '' }}{{ formatPercent(scope.row.priceChange) }}
            </span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-card>

    <!-- K线图表 -->
    <!--    <el-card shadow="never" class="kline-chart-card" v-if="!loading || klineData.length > 0">-->
    <!--      <div class="chart-header">-->
    <!--        <div class="chart-title">{{ currentCryptoLabel }} K线图</div>-->
    <!--        <div class="chart-info">-->
    <!--          交易所：{{ currentExchangeLabel }} | 时间周期：{{ currentTimeUnitLabel }}-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="chart-content">-->
    <!--        <KlineChart :chart-data="klineData" />-->
    <!--      </div>-->
    <!--    </el-card>-->

    <!-- 加载中 -->
    <!--    <div v-if="loading" class="loading-overlay">-->
    <!--      <el-loading-spinner></el-loading-spinner>-->
    <!--      <p>正在加载数据...</p>-->
    <!--    </div>-->
  </div>
</template>

<script>
import {getKlineHistoryData} from '@/api/exchange'
import dayjs from 'dayjs'
import {getCryptoList, getExchangeList, getTimeUnitList} from "../../../api/exchange";
import KlineChart from '@/views/index/components/KlineChart.vue';

export default {
  name: 'KlineHistory',
  components: {
    KlineChart
  },
  data() {
    return {
      // 查询表单
      searchForm: {
        exchange: 'binance',
        cryptoCode: 'BTC',
        timeUnit: '_5M',
        startTime: new Date().getTime() - 3600 * 1000 * 24,
        endTime: new Date().getTime(),
        // volume: 0
      },
      // 表格数据
      tableData: [],
      // K线图表数据
      klineData: [],
      // 分页信息
      pagination: {
        currentPage: 1,
        pageSize: 20,
        total: 0
      },
      exchanges: [],
      timeUnits: [],
      cryptos: [],
      // 加载状态
      loading: false,
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      }
    }
  },
  async created() {
    this.exchanges = await getExchangeList().data
    this.timeUnits = await getTimeUnitList().data
    this.cryptos = await getCryptoList(this.searchForm.exchange).data
    // 组件创建时加载默认数据
    this.fetchKlineData()
  },
  computed: {
    // 当前币种显示名称
    currentCryptoLabel() {
      const crypto = this.cryptos.find(c => c.value === this.searchForm.cryptoCode);
      return crypto ? crypto.label : this.searchForm.cryptoCode;
    },
    // 当前交易所显示名称
    currentExchangeLabel() {
      const exchange = this.exchanges.find(e => e.value === this.searchForm.exchange);
      return exchange ? exchange.label : this.searchForm.exchange;
    },
    // 当前时间周期显示名称
    currentTimeUnitLabel() {
      const timeUnit = this.timeUnits.find(t => t.value === this.searchForm.timeUnit);
      return timeUnit ? timeUnit.label : this.searchForm.timeUnit;
    }
  },
  methods: {
    // 获取K线数据
    async fetchKlineData() {
      this.loading = true
      try {
        // 构建请求参数
        const params = {
          ...this.searchForm,
          page: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        }

        // 调用API获取数据
        const response = await getKlineHistoryData(params)

        this.$message.success(response.msg || '获取数据成功')
        // 处理返回数据
        if (response.code === 200) {
          // 更新表格数据
          this.tableData = response.data.records.map(item => ({
            ...item,
            // 计算涨跌幅
            priceChange: item.open ? (item.close - item.open) / item.open * 100 : 0
          }))
          this.pagination.total = response.data.total

          // 转换数据格式用于K线图表
          this.klineData = response.data.records.map(item => ({
            time: dayjs(item.openTime).format('YYYY-MM-DD HH:mm:ss'),
            open: parseFloat(item.open),
            high: parseFloat(item.high),
            low: parseFloat(item.low),
            close: parseFloat(item.close)
          })).sort((a, b) => new Date(a.time) - new Date(b.time));
        } else {
          this.$message.error(response.msg || '获取数据失败')
          // 如果API失败，生成模拟数据用于显示
          this.generateMockKlineData();
        }
      } catch (error) {
        console.error('获取K线历史数据失败:', error)
        this.$message.error('获取数据失败，请重试')
        // 生成模拟数据
        this.generateMockKlineData();
      } finally {
        this.loading = false
      }
    },

    // 生成模拟K线数据
    generateMockKlineData() {
      const now = Date.now();
      const interval = this.getTimeUnitInterval();
      const data = [];

      // 生成最近的100个K线数据点
      for (let i = 99; i >= 0; i--) {
        const timestamp = now - i * interval;
        const basePrice = 40000 + Math.random() * 1000;
        const open = basePrice + (Math.random() - 0.5) * 500;
        const close = open + (Math.random() - 0.5) * 300;
        const high = Math.max(open, close) + Math.random() * 200;
        const low = Math.min(open, close) - Math.random() * 200;

        data.push({
          time: dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss'),
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          close: parseFloat(close.toFixed(2))
        });
      }

      this.klineData = data;
    },

    // 根据时间周期获取毫秒数
    getTimeUnitInterval() {
      const timeUnit = this.searchForm.timeUnit;
      if (timeUnit.includes('M')) {
        return parseInt(timeUnit.replace('_', '')) * 60 * 1000;
      } else if (timeUnit.includes('H')) {
        return parseInt(timeUnit.replace('_', '')) * 60 * 60 * 1000;
      } else if (timeUnit.includes('D')) {
        return parseInt(timeUnit.replace('_', '')) * 24 * 60 * 60 * 1000;
      }
      return 5 * 60 * 1000; // 默认5分钟
    },

    // 格式化日期时间
    formatDateTime(timestamp) {
      if (!timestamp) return '-'
      return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
    },

    // 格式化数字
    formatNumber(value) {
      if (value === null || value === undefined) return '-'
      return Number(value).toFixed(2)
    },

    // 格式化百分比
    formatPercent(value) {
      if (value === null || value === undefined) return '-'
      return Number(value).toFixed(2) + '%'
    },

    // 查询
    handleSearch() {
      this.pagination.currentPage = 1
      this.fetchKlineData()
    },

    // 重置
    handleReset() {
      this.searchForm = {
        exchange: 'binance',
        cryptoCode: 'BTC',
        timeUnit: '_5M',
        startTime: new Date().getTime() - 3600 * 1000 * 24,
        endTime: new Date().getTime()
      }
      this.pagination.currentPage = 1
      this.fetchKlineData()
    },

    // 分页大小变化
    handleSizeChange(size) {
      this.pagination.pageSize = size
      this.fetchKlineData()
    },

    // 分页页码变化
    handleCurrentChange(current) {
      this.pagination.currentPage = current
      this.fetchKlineData()
    }
  }
}
</script>

<style scoped>
.kline-history {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.kline-chart-card {
  margin-bottom: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
}

.chart-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.chart-info {
  font-size: 14px;
  color: #666;
}

.chart-content {
  height: 400px;
}

.loading-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

<style scoped>
.kline-history {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 120px);
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.page-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-overlay p {
  margin-top: 16px;
  color: #606266;
}

.price-up {
  color: #f56c6c;
}

.price-down {
  color: #67c23a;
}

/* 响应式布局 */
@media screen and (max-width: 1200px) {
  .kline-history {
    padding: 15px;
  }

  .el-form--inline .el-form-item {
    margin-right: 15px;
    margin-bottom: 10px;
  }
}

@media screen and (max-width: 768px) {
  .el-form--inline {
    display: block;
  }

  .el-form--inline .el-form-item {
    width: 100%;
    margin-right: 0;
  }

  .el-table {
    font-size: 12px;
  }
}
</style>
