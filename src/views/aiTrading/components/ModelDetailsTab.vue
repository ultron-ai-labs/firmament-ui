<template>
  <div class="model-details-content">
    <!-- 模型选择器 -->
    <el-card class="model-selector-card" shadow="hover">
      <div class="clearfix">
        <span>策略选择 </span>
        <el-select v-model="selectedModelId" style="width: 500px;" placeholder="选择策略查看详情" @change="handleModelChange" :loading="loadingStrategies">
          <el-option v-for="model in runningStrategies" :key="model.strategyId" :label="model.strategyName" :value="model.strategyId"/>
        </el-select>
      </div>
    </el-card>

    <!-- 模型详情内容 -->
    <div v-if="selectedModelId">
      <el-tabs v-model="activeDetailTab">
        <!-- 概览 -->
        <!--        <el-tab-pane label="概览" name="overview">-->
        <!--          <el-row style="margin-top: 5px" :gutter="20">-->
        <!--            &lt;!&ndash; 统计卡片 &ndash;&gt;-->
        <!--            <el-col :span="6">-->
        <!--              <el-card class="stat-card" shadow="hover">-->
        <!--                <div class="stat-item">-->
        <!--                  <div class="stat-label">初始资产</div>-->
        <!--                  <div class="stat-value">${{ formatNumber(dashboard.totalAmount) }}</div>-->
        <!--                </div>-->
        <!--              </el-card>-->
        <!--            </el-col>-->
        <!--            <el-col :span="6">-->
        <!--              <el-card class="stat-card" shadow="hover">-->
        <!--                <div class="stat-item">-->
        <!--                  <div class="stat-label">总资产</div>-->
        <!--                  <div class="stat-value">${{ formatNumber(dashboard.currentTotalAmount) }}</div>-->
        <!--                </div>-->
        <!--              </el-card>-->
        <!--            </el-col>-->
        <!--            <el-col :span="6">-->
        <!--              <el-card class="stat-card" shadow="hover">-->
        <!--                <div class="stat-item">-->
        <!--                  <div class="stat-label">总收益（含正在进行的订单）</div>-->
        <!--                  <div class="stat-value">${{ formatNumber(dashboard.totalProfit) }}</div>-->
        <!--                </div>-->
        <!--              </el-card>-->
        <!--            </el-col>-->
        <!--            <el-col :span="6">-->
        <!--              <el-card class="stat-card" shadow="hover">-->
        <!--                <div class="stat-item">-->
        <!--                  <div class="stat-label">总收益率（含正在进行的订单）</div>-->
        <!--                  <div class="stat-value" :class="dashboard.totalProfitRatio > 0 ? 'earnings-up' : 'earnings-down'">-->
        <!--                    {{ dashboard.totalProfitRatio > 0 ? '+' : '' }}{{ dashboard.totalProfitRatio }}%-->
        <!--                  </div>-->
        <!--                </div>-->
        <!--              </el-card>-->
        <!--            </el-col>-->
        <!--          </el-row>-->

        <!--          &lt;!&ndash; 收益曲线 &ndash;&gt;-->
        <!--          <el-card class="chart-card" shadow="hover" style="margin-top: 20px;">-->
        <!--            &lt;!&ndash; <div slot="header" class="clearfix">-->
        <!--              <el-select v-model="chartPeriod" placeholder="选择周期" size="small">-->
        <!--                <el-option label="7天" value="7d"/>-->
        <!--                <el-option label="30天" value="30d"/>-->
        <!--                <el-option label="90天" value="90d"/>-->
        <!--                <el-option label="1年" value="1y"/>-->
        <!--              </el-select>-->
        <!--            </div> &ndash;&gt;-->
        <!--            <div class="chart-wrapper">-->
        <!--              <div id="lineChart" ref="lineChart" class="chart" style="width: 100%; height: 400px;">-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </el-card>-->
        <!--        </el-tab-pane>-->

        <!-- 订单列表 -->
        <el-tab-pane label="订单记录" name="orders">
          <!-- 顶部统计卡片 -->
          <el-row :gutter="20">
            <!-- 概览卡片 -->
            <el-col :span="6">
              <el-card class="overview-card" shadow="hover">
                <div class="overview-item">
                  <div class="overview-label"><b>剩余总金额(非滑点不去除佣金、不含浮动)</b></div>
                  <div class="overview-value">${{ dashboard.currentTotalAmount }}</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="overview-card" shadow="hover">
                <div class="overview-item">
                  <div class="overview-label"><b>总收益（非滑点不去除佣金、不含浮动）</b></div>
                  <div class="stat-value" :class="dashboard.totalProfit > 0 ? 'earnings-up' : 'earnings-down'">
                    ${{ dashboard.totalProfit > 0 ? '+' : '' }}{{ dashboard.totalProfit }}
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="overview-card" shadow="hover">
                <div class="overview-item">
                  <div class="overview-label"><b>总收益率（非滑点不去除佣金、不含浮动）</b></div>
                  <div class="stat-value" :class="dashboard.totalProfitRatio > 0 ? 'earnings-up' : 'earnings-down'">
                    {{ dashboard.totalProfitRatio > 0 ? '+' : '' }}{{ dashboard.totalProfitRatio }}%
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="overview-card" shadow="hover">
                <div class="overview-item">
                  <div class="overview-label"><b>滑点总收益（不去除佣金、不含浮动）</b></div>
                  <div class="stat-value" :class="dashboard.totalSlippageProfit > 0 ? 'earnings-up' : 'earnings-down'">
                    ${{ dashboard.totalSlippageProfit > 0 ? '+' : '' }}{{ dashboard.totalSlippageProfit }}
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <!-- 概览卡片 -->

            <el-col :span="6">
              <el-card class="overview-card" shadow="hover">
                <div class="overview-item">
                  <div class="overview-label"><b>滑点总收益率（不去除佣金、不含浮动）</b></div>
                  <div class="stat-value" :class="dashboard.totalSlippageProfitRatio > 0 ? 'earnings-up' : 'earnings-down'">
                    {{ dashboard.totalSlippageProfitRatio > 0 ? '+' : '' }}{{ dashboard.totalSlippageProfitRatio }}%
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="overview-card" shadow="hover">
                <div class="overview-item">
                  <div class="overview-label"><b>滑点收益差额（不去除佣金、不含浮动）</b></div>
                  <div class="stat-value" :class="dashboard.slippageProfitDifference > 0 ? 'earnings-up' : 'earnings-down'">
                    ${{ dashboard.slippageProfitDifference > 0 ? '+' : '' }}{{ dashboard.slippageProfitDifference }}
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="overview-card" shadow="hover">
                <div class="overview-item">
                  <div class="overview-label"><b>滑点差额收益率（不去除佣金、不含浮动）</b></div>
                  <div class="stat-value" :class="dashboard.slippageProfitDifferenceRatio > 0 ? 'earnings-up' : 'earnings-down'">
                    {{ dashboard.slippageProfitDifferenceRatio > 0 ? '+' : '' }}{{ dashboard.slippageProfitDifferenceRatio }}%
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="overview-card" shadow="hover">
                <div class="overview-item">
                  <div class="overview-label"><b>接近真实收益(率)</b></div>
                  <div class="stat-value" :class="dashboard.nearRealProfit > 0 ? 'earnings-up' : 'earnings-down'">
                    ${{ dashboard.nearRealProfit > 0 ? '+' : '' }}{{ dashboard.nearRealProfit }}( {{ dashboard.nearRealProfitRatio > 0 ? '+' : '' }}{{
                      dashboard.nearRealProfitRatio
                    }}%)
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>


          <el-card class="orders-card" shadow="hover">
            <div slot="header" class="clearfix" style="display: flex; align-items: center; flex-wrap: wrap; gap: 15px;">
              <span>选择币种</span>
              <el-select v-model="filterCurrency" placeholder="选择币种" clearable size="small" style="width: 120px;">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="crypto in availableCurrencies" :key="crypto" :label="crypto" :value="crypto"></el-option>
              </el-select>
              <span>选择方向</span>
              <el-select v-model="filterDirection" placeholder="方向" clearable size="small" style="width: 100px;">
                <el-option label="全部" value=""></el-option>
                <el-option label="做多" value="long"></el-option>
                <el-option label="做空" value="short"></el-option>
              </el-select>
              <!--              <span>盈亏状态</span>-->
              <!--              <el-select v-model="filterProfitStatus" placeholder="盈亏状态" clearable size="small" style="width: 120px;">-->
              <!--                <el-option label="全部" value=""></el-option>-->
              <!--                <el-option label="盈利" value="profit"></el-option>-->
              <!--                <el-option label="亏损" value="loss"></el-option>-->
              <!--              </el-select>-->
              <span>平仓状态</span>
              <el-select v-model="filterCloseStatus" placeholder="平仓状态" clearable size="small" style="width: 120px;">
                <el-option label="全部" value=""></el-option>
                <el-option label="已平仓" value="1"></el-option>
                <el-option label="持有中" value="0"></el-option>
              </el-select>
              <!--             查询按钮 -->
              <el-button type="primary" size="small" @click="handleSearchOrder">查询</el-button>
            </div>
            <el-table
              :data="allOrders"
              style="width: 100%"
              border
              stripe
              :loading="loadingOrders"
            >
              <el-table-column prop="tradeCrypto" label="币种 * 倍数" width="140">
                <template slot-scope="scope">
                  <el-tag>{{ scope.row.tradeCrypto }}({{ scope.row.tradeExchange }}) * {{ scope.row.bookMultiple }}倍</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="longOrShort" label="方向" width="80">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.longOrShort === 'long' ? 'success' : 'danger'">
                    {{ scope.row.longOrShort === 'long' ? '做多' : '做空' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="bookTime" label="下单时间" width="180">
                <template slot-scope="scope">
                  {{ formatDateTime(scope.row.bookTime) }}
                </template>
              </el-table-column>
              <el-table-column prop="bookPrice" label="下单价格" width="120">
                <template slot-scope="scope">${{ formatNumber(scope.row.bookPrice) }}</template>
              </el-table-column>
              <el-table-column prop="bookAmount" label="下单总额" width="120">
                <template slot-scope="scope">${{ formatNumber(scope.row.bookAmount) }}</template>
              </el-table-column>
              <!--      有平仓价格，再展示平仓时间        -->
              <el-table-column prop="closeTime" label="平仓时间" width="180">
                <template slot-scope="scope">
                  {{ scope.row.closePrice ? formatDateTime(scope.row.closeTime) : '-' }}
                </template>
              </el-table-column>
              <el-table-column prop="closePrice" label="平仓价格" width="120">
                <template slot-scope="scope">
                  {{ scope.row.closePrice ? '$' + formatNumber(scope.row.closePrice) : '-' }}
                </template>
              </el-table-column>

              <!-- <el-table-column prop="totalRate" label="总收益率" width="120">
                <template slot-scope="scope">
                  <span :class="scope.row.totalRate > 0 ? 'profit' : 'loss'">
                    {{ scope.row.totalRate > 0 ? '+' : '' }}{{ formatNumberRate(scope.row.totalRate) }}%
                  </span>
                </template>
              </el-table-column> -->
              <!--              <el-table-column prop="realRevenue" label="去除佣金收益额" width="140">-->
              <!--                <template slot-scope="scope">-->
              <!--                  <span :class="scope.row.realRevenue > 0 ? 'profit' : 'loss'">-->
              <!--                    {{ scope.row.realRevenue > 0 ? '+' : '' }}${{ formatNumber(scope.row.realRevenue) }}-->
              <!--                  </span>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <el-table-column prop="status" label="订单状态" width="100">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.status === 0 ? 'warning' : 'success'">
                    {{ scope.row.status === 0 ? '持有中' : '已平仓' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="totalRevenue" width="160" label="总收益额">
                <template slot-scope="scope">
                  <span :class="scope.row.totalRevenue > 0 ? 'profit' : 'loss'">
                    {{ scope.row.totalRevenue > 0 ? '+' : '' }}${{ formatNumber(scope.row.totalRevenue) }}
                  </span>
                  <span :class="scope.row.totalRate > 0 ? 'profit' : 'loss'">
                    ({{ scope.row.totalRate > 0 ? '+' : '' }}{{ formatNumberRate(scope.row.totalRate) }}%)
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="160">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="showOrderDetail(scope.row)">详情</el-button>
                  <!-- 如果是未平仓订单，展示手动平仓按钮-->
                  <el-button size="mini" type="danger" v-if="scope.row.status === 0" @click="handleCloseOrder(scope.row)">平仓</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-container" style="margin-top: 20px;">
              <el-pagination
                background
                layout="prev, pager, next, jumper, ->, sizes, total"
                :total="ordersTotal"
                :page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                @current-change="handleOrderPageChange"
                @size-change="handleOrderSizeChange"
              ></el-pagination>
            </div>
          </el-card>
        </el-tab-pane>

        <!-- AI对话 -->
        <!-- <el-tab-pane label="AI对话" name="chat">
          <el-card class="chat-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>与模型对话</span>
              <span class="model-name"><b>「{{ getSelectedModelName() }}」</b></span>
            </div>
            <div class="chat-content" ref="chatContent">
              <div v-for="(message, index) in chatMessages" :key="index" class="chat-message" :class="message.type">
                <div class="message-avatar">{{ message.type === 'user' ? '我' : 'AI' }}</div>
                <div class="message-content">{{ message.content }}</div>
              </div>
            </div>
            <div class="chat-input-container">
              <el-input
                v-model="chatInput"
                type="textarea"
                rows="3"
                placeholder="请输入消息..."
                @keyup.enter.native.ctrl="sendMessage"
              ></el-input>
              <div class="chat-actions">
                <span class="tip">按 Ctrl+Enter 发送</span>
                <el-button type="primary" @click="sendMessage">发送</el-button>
              </div>
            </div>
          </el-card>
        </el-tab-pane> -->
      </el-tabs>
    </div>

    <!-- 订单详情对话框 -->
    <el-dialog
      title="订单详情"
      :visible.sync="orderDetailDialogVisible"
      width="80%"
      class="order-detail-dialog"
      @close="closeOrderDetailDialog"
    >
      <div v-if="currentOrderDetail">
        <!-- 基本信息 -->
        <el-card class="order-detail-card">
          <div class="section-title">基本信息</div>
          <div class="detail-row">
            <div class="detail-label">订单流水号：</div>
            <div class="detail-value">{{ currentOrderDetail.orderSerialNo || '-' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">策略ID：</div>
            <div class="detail-value">{{ getStrategyName(currentOrderDetail.strategyId) || '-' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">币种：</div>
            <div class="detail-value">{{ currentOrderDetail.tradeCrypto || '-' }} ({{ currentOrderDetail.tradeExchange || '-' }})</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">方向：</div>
            <div class="detail-value">
              <el-tag :type="currentOrderDetail.longOrShort === 'long' ? 'success' : 'danger'">
                {{ currentOrderDetail.longOrShort === 'long' ? '做多' : '做空' }}
              </el-tag>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">订单状态：</div>
            <div class="detail-value">
              <el-tag :type="currentOrderDetail.status === 0 ? 'warning' : 'success'">
                {{ currentOrderDetail.status === 0 ? '持有中' : '已平仓' }}
              </el-tag>
            </div>
          </div>
        </el-card>
<!--        <div class="detail-row">-->
<!--          <div class="detail-label">交易所订单流水号：</div>-->
<!--          <div class="detail-value">{{ currentOrderDetail.exchangeOrderNo || '-' }}</div>-->
<!--        </div>-->
        <el-card class="order-detail-card">
        <!-- 下单信息 -->
        <div class="section-title">下单信息</div>
        <div class="detail-row">
          <div class="detail-label">下单时间：</div>
          <div class="detail-value">{{ formatDateTime(currentOrderDetail.bookTime) }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">下单价格：</div>
          <div class="detail-value">${{ formatNumber(currentOrderDetail.bookPrice) }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">下单滑点价格：</div>
          <div class="detail-value">${{ formatNumber(currentOrderDetail.bookSlippagePrice) }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">下单滑点：</div>
          <div class="detail-value">${{ formatNumber(currentOrderDetail.bookSlippage) }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">下单倍数：</div>
          <div class="detail-value">{{ currentOrderDetail.bookMultiple }}倍</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">下单佣金：</div>
          <div class="detail-value">${{ formatNumber(currentOrderDetail.bookCommission) }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">下单总额：</div>
          <div class="detail-value">${{ formatNumber(currentOrderDetail.bookAmount) }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">目标止盈：</div>
          <div class="detail-value">{{ currentOrderDetail.targetTakeProfit || '-' }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">目标止损：</div>
          <div class="detail-value">{{ currentOrderDetail.targetStopLoss || '-' }}</div>
        </div>
        </el-card>
        <el-card class="order-detail-card">
        <!-- 平仓信息 -->
        <div class="section-title">平仓信息</div>
        <div class="detail-row">
          <div class="detail-label">平仓时间：</div>
          <div class="detail-value">{{ currentOrderDetail.closeTime ? formatDateTime(currentOrderDetail.closeTime) : '-' }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">平仓价格：</div>
          <div class="detail-value">{{ currentOrderDetail.closePrice ? '$' + formatNumber(currentOrderDetail.closePrice) : '-' }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">平仓滑点价格：</div>
          <div class="detail-value">{{ currentOrderDetail.closeSlippagePrice ? '$' + formatNumber(currentOrderDetail.closeSlippagePrice) : '-' }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">平仓滑点：</div>
          <div class="detail-value">${{ currentOrderDetail.closeSlippage ? formatNumber(currentOrderDetail.closeSlippage) : '-' }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">平仓总额：</div>
          <div class="detail-value">{{ currentOrderDetail.closeAmount ? '$' + formatNumber(currentOrderDetail.closeAmount) : '-' }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">平仓佣金：</div>
          <div class="detail-value">{{ currentOrderDetail.closeCommission ? '$' + formatNumber(currentOrderDetail.closeCommission) : '-' }}</div>
        </div>
        </el-card>
        <el-card class="order-detail-card">
        <!-- 收益信息 -->
        <div class="section-title">收益信息</div>
        <div class="detail-row">
          <div class="detail-label">订单佣金：</div>
          <div class="detail-value">${{ formatNumber(currentOrderDetail.orderCommission) }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">总收益额：</div>
          <div class="detail-value" :class="currentOrderDetail.totalRevenue > 0 ? 'profit' : 'loss'">
            {{ currentOrderDetail.totalRevenue > 0 ? '+' : '' }}${{ formatNumber(currentOrderDetail.totalRevenue) }}
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-label">总收益率：</div>
          <div class="detail-value" :class="currentOrderDetail.totalRate > 0 ? 'profit' : 'loss'">
            {{ currentOrderDetail.totalRate > 0 ? '+' : '' }}{{ formatNumberRate(currentOrderDetail.totalRate) }}%
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-label">去除佣金收益额：</div>
          <div class="detail-value" :class="currentOrderDetail.realRevenue > 0 ? 'profit' : 'loss'">
            {{ currentOrderDetail.realRevenue > 0 ? '+' : '' }}${{ formatNumber(currentOrderDetail.realRevenue) }}
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-label">去除佣金收益率：</div>
          <div class="detail-value" :class="currentOrderDetail.realRate > 0 ? 'profit' : 'loss'">
            {{ currentOrderDetail.realRate > 0 ? '+' : '' }}{{ formatNumberRate(currentOrderDetail.realRate) }}%
          </div>
        </div>
        </el-card>
        <el-card class="order-detail-card">
        <!-- 滑点收益信息 -->
        <div class="section-title">滑点收益信息</div>
        <div class="detail-row">
          <div class="detail-label">滑点情况收益额(无手续费)：</div>
          <div class="detail-value" :class="currentOrderDetail.slippageTotalRevenue > 0 ? 'profit' : 'loss'">
            {{ currentOrderDetail.slippageTotalRevenue > 0 ? '+' : '' }}${{ formatNumber(currentOrderDetail.slippageTotalRevenue) }}
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-label">滑点情况收益率(无手续费)：</div>
          <div class="detail-value" :class="currentOrderDetail.slippageTotalRate > 0 ? 'profit' : 'loss'">
            {{ currentOrderDetail.slippageTotalRate > 0 ? '+' : '' }}{{ formatNumberRate(currentOrderDetail.slippageTotalRate) }}%
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-label">滑点情况收益额(含手续费)：</div>
          <div class="detail-value" :class="currentOrderDetail.slippageRealTotalRevenue > 0 ? 'profit' : 'loss'">
            {{ currentOrderDetail.slippageRealTotalRevenue > 0 ? '+' : '' }}${{ formatNumber(currentOrderDetail.slippageRealTotalRevenue) }}
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-label">滑点情况收益率(含手续费)：</div>
          <div class="detail-value" :class="currentOrderDetail.slippageRealTotalRate > 0 ? 'profit' : 'loss'">
            {{ currentOrderDetail.slippageRealTotalRate > 0 ? '+' : '' }}{{ formatNumberRate(currentOrderDetail.slippageRealTotalRate) }}%
          </div>
        </div>
        </el-card>
      </div>
    </el-dialog>

    <!-- 未选择模型提示 -->
    <!-- <div v-else class="no-selection">
      <el-empty description="请选择一个模型查看详情"/>
    </div> -->

  </div>
</template>

<script>
import * as echarts from 'echarts'
import {dashboard, runningRealTimeStrategy, realTimeStrategyLineChart} from "../../../api/realTimeStrategy";
import {closeOrder, getStrategyOrders} from "../../../api/order";
import {getCryptoList, getCryptos} from "../../../api/exchange";

export default {
  name: 'ModelDetailsTab',
  data() {
    return {
      lineChart: null,
      activeDetailTab: 'orders',
      chartPeriod: '30d',
      orderSearch: '',
      currentOrderPage: 1,
      pageSize: 10,
      filterCurrency: '',
      filterDirection: '',
      filterProfitStatus: '',
      filterCloseStatus: '',
      chatInput: '',
      selectedModelId: '',
      dashboard: {
        currentTotalAmount: 0,
        totalProfit: 0
      },
      chartData: {
        dates: [],
        values: []
      },
      allOrders: [],
      ordersTotal: 0,
      chatMessages: [],
      chart: null,
      runningStrategies: [],
      loadingStrategies: false,
      loadingOrders: false,
      // 订单详情对话框相关
      orderDetailDialogVisible: false,
      currentOrderDetail: null,
      strategyLineChart: {
        title: {
          text: '收益曲线'
        },
        tooltip: {},
        xAxis: {
          name: '时间',
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '最新总额',
          type: 'line',
          data: [],
          itemStyle: {
            color: '#67C23A'
          },
          smooth: true
        }]
      }
    }
  },
  beforeDestroy() {
    if (this.lineChart) {
      this.lineChart.dispose()
    }
  },
  computed: {
    // 可用的币种列表
    availableCurrencies() {
      return getCryptos()
    }
  },
  watch: {
    selectedModelId: {
      handler() {
        if (this.selectedModelId) {
          this.fetchModelDetails()
          this.fetchStrategyOrders()
        }
      },
      immediate: true
    },
    // 监听筛选条件变化
    filterCurrency() {
      this.currentOrderPage = 1
      this.fetchStrategyOrders()
    },
    filterDirection() {
      this.currentOrderPage = 1
      this.fetchStrategyOrders()
    },
    filterProfitStatus() {
      this.currentOrderPage = 1
      this.fetchStrategyOrders()
    },
    filterCloseStatus() {
      this.currentOrderPage = 1
      this.fetchStrategyOrders()
    },
    chartPeriod() {
      this.updateChart()
    },
    chartData: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  },
  mounted() {
    this.fetchRunningStrategies()
    // 初始化图表
    // this.initLineChart()
  },
  created() {
    // 定时刷新模型详情
    // setInterval(() => {
    //   this.fetchModelDetails()
    //   this.fetchStrategyOrders()
    // }, 60000*5)
  },
  methods: {
    initLineChart() {
      // 确保DOM元素已存在
      if (!this.$refs.lineChart) {
        console.warn('Chart DOM element not found, retrying...');
        setTimeout(() => this.initLineChart(), 100);
        return;
      }
      let dom = this.$refs.lineChart
      this.$nextTick(() => {
        // 初始化折线图
        this.lineChart = echarts.init(dom)
        this.lineChart.setOption(this.strategyLineChart)
        // 监听窗口大小变化，自适应图表
        window.addEventListener('resize', this.resizeCharts)
      })
    },
    resizeCharts() {
      if (this.lineChart && !this.lineChart.isDisposed()) {
        this.lineChart.resize();
      }
    },
    // 获取运行中的实时策略列表
    async fetchRunningStrategies() {
      try {
        this.loadingStrategies = true
        const response = await runningRealTimeStrategy()
        debugger
        if (response.code === 200 && response.data) {
          this.runningStrategies = response.data
          // 如果有策略，默认选中第一个
          if (this.runningStrategies.length > 0 && !this.selectedModelId) {
            this.selectedModelId = this.runningStrategies[0].strategyId
          }
          // 选中策略之后加载策略的数据
          //  await this.fetchStrategyLineChart()
        } else {
          // 如果接口调用失败，使用模拟数据
          this.runningStrategies = []
        }
      } catch (error) {
        console.error('获取实时策略失败:', error)
        // 使用模拟数据
        this.runningStrategies = []
      } finally {
        this.loadingStrategies = false
      }
    },
    handleSearchOrder() {
      this.fetchStrategyOrders()
    },
    async fetchStrategyLineChart() {
      // 查询接口数据
      await realTimeStrategyLineChart(this.selectedModelId, "").then(res => {
        if (res.code === 200 && res.data) {
          this.strategyLineChart.xAxis.data = res.data.x || []
          this.strategyLineChart.series[0].data = res.data.y || []
          this.lineChart.setOption(this.strategyLineChart)
          this.$forceUpdate()
        }
      })
    },
    // 获取策略的订单数据
    async fetchStrategyOrders() {
      if (!this.selectedModelId) return
      try {
        this.loadingOrders = true
        // 调用支持分页和筛选的API
        const response = await getStrategyOrders(
          this.selectedModelId,
          this.currentOrderPage,
          this.pageSize,
          this.filterCurrency,
          this.filterDirection,
          this.filterProfitStatus,
          this.filterCloseStatus,
        )
        console.log('获取订单数据:', response)
        if (response.code === 200 && response.data) {
          // 处理接口返回的分页数据
          this.allOrders = response.data.records || []
          this.ordersTotal = response.data.total || 0
        } else {
          console.error('获取订单数据失败')
          this.allOrders = []
          this.ordersTotal = 0
        }
      } catch (error) {
        console.error('获取订单数据失败:', error)
        // 使用模拟数据
        this.allOrders = []
        this.ordersTotal = 0
      } finally {
        this.loadingOrders = false
      }
      this.fetchModelDetails()
    },
    // 计算分页后的数据
    paginatedOrders() {
      return this.allOrders
    },

    // 获取选中模型名称
    getSelectedModelName() {
      const model = this.runningStrategies.find(m => m.strategyId === this.selectedModelId)
      return model ? model.strategyName : ''
    },

    // 处理模型选择变化
    handleModelChange() {
      debugger
      this.fetchModelDetails()
      // 重置所有状态
      this.currentOrderPage = 1
      this.pageSize = 10
      this.resetFilters()
      this.fetchStrategyOrders()
    },

    // 重置所有筛选条件
    resetFilters() {
      this.orderSearch = ''
      this.filterCurrency = ''
      this.filterDirection = ''
      this.filterProfitStatus = ''
      this.filterCloseStatus = ''
    },

    // 获取模型详情数据
    async fetchModelDetails() {
      // 查询大盘接口数据
      // 模拟获取模型统计数据
      debugger
      if (!this.selectedModelId) {
        this.dashboard = {}
        return
      }

      try {
        // 获取dashboard数据
        const response = await dashboard(this.selectedModelId)
        if (response.code === 200 && response.data) {
          this.dashboard = response.data
        } else {
          console.error('获取dashboard数据失败:', response)
          // 使用模拟数据
          this.dashboard = {
            totalAmount: 100000,
            currentTotalAmount: 125600,
            totalProfit: 25600,
            totalProfitRatio: 0.256
          }
        }
      } catch (error) {
        console.error('获取dashboard数据失败:', error)
        // 使用模拟数据
        this.dashboard = {
          totalAmount: 100000,
          currentTotalAmount: 125600,
          totalProfit: 25600,
          totalProfitRatio: 0.256
        }
      }
      // 模拟获取对话历史
      this.generateMockChatHistory()
    },

    // 生成模拟对话历史
    generateMockChatHistory() {
      this.chatMessages = [
        {
          type: 'ai',
          content: `您好，我是${this.getSelectedModelName()}，有什么可以帮助您的吗？`
        },
        {
          type: 'user',
          content: '请分析一下当前市场趋势'
        },
        {
          type: 'ai',
          content: '根据最近的数据分析，BTC价格在过去30天上涨了约15%，交易量有所增加。技术指标显示短期内可能会有小幅回调，但长期趋势仍然看好。建议保持70%的仓位，并关注美联储的最新政策动向。'
        }
      ]

      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },

    // 更新图表
    updateChart() {
      console.log('更新图表数据')

      // 直接更新echarts图表
      this.$nextTick(() => {
        // 查询数据
        this.fetchStrategyLineChart()
      });
    },

    beforeDestroy() {
      if (this.lineChart && !this.lineChart.isDisposed()) {
        this.lineChart.dispose();
        this.lineChart = null;
      }
      window.removeEventListener('resize', this.resizeCharts);
    },

    // 当组件激活时更新图表
    activated() {
      this.$nextTick(() => {
        if (this.selectedModelId) {
          console.log('组件激活，更新图表');
          // 确保图表正确初始化
          if (!this.lineChart || this.lineChart.isDisposed()) {
            this.initLineChart();
          } else {
            this.updateChart();
          }
        }
      })
    },

    // 格式化数字
    formatNumber(num) {
      if (num === undefined || num === null) return '0.00'
      return parseFloat(num).toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },

    // 格式化数字
    formatNumberRate(num) {
      num = num * 100
      if (num === undefined || num === null) return '0.00'
      return parseFloat(num).toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },

    // 格式化日期时间
    formatDateTime(date) {
      if (!date) return '-'
      const d = new Date(date)
      return d.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    },

    // 处理订单搜索
    handleOrderSearch() {
      this.currentOrderPage = 1
      this.fetchStrategyOrders()
    },

    // 处理订单分页
    handleOrderPageChange(page) {
      this.currentOrderPage = page
      // 切换页面时重新获取数据
      this.fetchStrategyOrders()
    },

    // 处理每页大小变化
    handleOrderSizeChange(size) {
      this.pageSize = size
      this.currentOrderPage = 1 // 重置到第一页
      // 改变每页大小时重新获取数据
      this.fetchStrategyOrders()
    },
    // 发送消息
    sendMessage() {
      if (!this.chatInput.trim()) return

      // 添加用户消息
      this.chatMessages.push({
        type: 'user',
        content: this.chatInput.trim()
      })

      const userMessage = this.chatInput.trim()
      this.chatInput = ''

      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom()

        // 模拟AI回复
        setTimeout(() => {
          this.chatMessages.push({
            type: 'ai',
            content: this.generateAIResponse(userMessage)
          })

          this.$nextTick(() => {
            this.scrollToBottom()
          })
        }, 1000)
      })
    },

    // 生成AI回复
    generateAIResponse(userMessage) {
      const responses = [
        '根据最新数据分析，市场呈现震荡上行趋势，建议保持当前策略。',
        '模型预测未来24小时内BTC可能有5-8%的波动，请注意风险管理。',
        '检测到多个指标出现买入信号，当前胜率约为78%。',
        '技术面显示超买，建议适当减仓，等待回调后再入场。',
        '根据历史数据回测，当前市场环境下该策略的年化收益率约为25%。'
      ]

      return responses[Math.floor(Math.random() * responses.length)]
    },

    // 滚动到底部
    scrollToBottom() {
      if (this.$refs.chatContent) {
        this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight
      }
    },

    // 显示订单详情
    showOrderDetail(order) {
      this.currentOrderDetail = JSON.parse(JSON.stringify(order));
      this.orderDetailDialogVisible = true;
    },

    // 关闭订单详情对话框
    closeOrderDetailDialog() {
      this.orderDetailDialogVisible = false;
      this.currentOrderDetail = null;
    },
    async handleCloseOrder(row) {
      // 确定平仓吗？
      try {
        await this.$confirm('确定平仓吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 手动平仓
        // 平仓之后刷新订单
        await closeOrder(row).then(response => {
          // no op
        })
        await this.fetchStrategyOrders()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('平仓失败:', error)
          this.$message.error('平仓失败')
        }
      }
    },
    getStrategyName(strategyId) {
      return this.runningStrategies.find(model => model.strategyId === strategyId)?.strategyName || '-'
    }
  }
}
</script>

<style lang="scss" scoped>
.model-details-content {
  .model-selector-card {
    margin-bottom: 20px;
  }

  .stat-card {
    .stat-item {
      text-align: center;

      .stat-label {
        font-size: 14px;
        color: #909399;
        margin-bottom: 10px;
      }

      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: #303133;
      }

      .earnings-up {
        color: #67C23A;
      }

      .earnings-down {
        color: #F56C6C;
      }
    }
  }

  .chart-card {
    .chart-container {
      width: 100%;
    }
  }

  .orders-card {
    .pagination-container {
      display: flex;
      justify-content: flex-end;
    }

    .profit {
      color: #67C23A;
    }

    .loss {
      color: #F56C6C;
    }
  }

  .order-detail-dialog {
    .detail-row {
      display: flex;
      margin-bottom: 16px;
      align-items: center;

      .detail-label {
        width: 220px;
        text-align: right;
        margin-right: 20px;
        color: #606266;
        font-size: 14px;
      }

      .detail-value {
        flex: 1;
        color: #303133;
        font-size: 14px;
        word-break: break-all;
      }

      .profit {
        color: #67C23A;
      }

      .loss {
        color: #F56C6C;
      }
    }

    .section-title {
      font-size: 16px;
      font-weight: bold;
      margin: 20px 0 10px 0;
      padding-left: 150px;
      color: #303133;
    }
  }

  .chat-card {
    .chat-content {
      height: 400px;
      overflow-y: auto;
      padding: 20px;
      background-color: #f5f7fa;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .chat-message {
      display: flex;
      margin-bottom: 15px;

      &.user {
        justify-content: flex-end;
      }

      .message-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #409EFF;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        font-size: 14px;

        .user & {
          margin-right: 0;
          margin-left: 10px;
          background-color: #67C23A;
        }
      }

      .message-content {
        max-width: 70%;
        padding: 10px 15px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        word-wrap: break-word;

        .user & {
          background-color: #409EFF;
          color: white;
        }
      }
    }

    .chat-input-container {
      .chat-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;

        .tip {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }

  .earnings-up {
    color: #13ce66;
  }

  .earnings-down {
    color: #ff4949;
  }

  .no-selection {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #909399;
  }
}
</style>
