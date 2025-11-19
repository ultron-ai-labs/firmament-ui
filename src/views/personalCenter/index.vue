<template>
  <div class="personal-center-container">
    <!-- 个人中心内部标签页 -->
    <div class="personal-tabs">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="个人信息" name="profile"></el-tab-pane>
        <el-tab-pane label="AI模型" name="models"></el-tab-pane>
        <el-tab-pane label="活动记录" name="activities"></el-tab-pane>
      </el-tabs>
    </div>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="profile-card" shadow="hover">
          <div class="profile-header">
            <div class="avatar-container">
              <el-avatar :size="100" :src="userInfo.avatar" class="user-avatar">
                {{ userInfo.username ? userInfo.username.substring(0, 1).toUpperCase() : '' }}
              </el-avatar>
              <h2 class="username">{{ userInfo.username }}</h2>
              <p class="user-role">{{ userRole }}</p>
            </div>
          </div>

          <div class="profile-info">
            <ul class="info-list">
              <li class="info-item">
                <vab-icon :icon="['fas', 'user']" class="info-icon"/>
                <span class="info-label">用户名:</span>
                <span class="info-value">{{ userInfo.username }}</span>
              </li>
              <li class="info-item">
                <vab-icon :icon="['fas', 'id-card']" class="info-icon"/>
                <span class="info-label">权限角色:</span>
                <span class="info-value">{{ userRole }}</span>
              </li>
              <li class="info-item">
                <vab-icon :icon="['fas', 'calendar']" class="info-icon"/>
                <span class="info-label">注册时间:</span>
                <span class="info-value">{{ formatDate(userInfo.createTime) }}</span>
              </li>
            </ul>
          </div>
        </el-card>

        <el-card class="security-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>安全设置</span>
          </div>
          <div class="security-options">
            <div class="security-item">
              <div class="security-content">
                <div class="security-label">登录密码</div>
                <div class="security-desc">定期更改密码有助于保护账户安全</div>
              </div>
              <el-button size="mini" type="text" @click="handleChangePassword">修改</el-button>
            </div>
          </div>
        </el-card>

        <!-- 收益概览卡片 -->
        <el-card class="earnings-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>收益概览</span>
          </div>
          <div class="earnings-content">
            <div class="earnings-item">
              <div class="earnings-label">总收益</div>
              <div class="earnings-value earnings-up">+{{ totalEarnings }}</div>
            </div>
            <div class="earnings-item">
              <div class="earnings-label">本月收益</div>
              <div class="earnings-value earnings-up">+{{ monthlyEarnings }}</div>
            </div>
            <div class="earnings-item">
              <div class="earnings-label">运行模型</div>
              <div class="earnings-value">{{ activeModels }}个</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <!-- 个人信息内容 -->
        <div v-show="activeTab === 'profile'">
          <profile-tab
            :user-info="userInfo"
            :rules="rules"
            @submit="handleSubmit"
            @reset="handleReset"
          />
        </div>

        <!-- AI模型内容 -->
        <div v-show="activeTab === 'models'">
          <models-tab
            :ai-models="aiModels"
            @add-model="handleAddModel"
            @edit-model="handleEditModel"
            @delete-model="handleDeleteModel"
          />
        </div>

        <!-- 活动记录内容 -->
        <div v-show="activeTab === 'activities'">
          <activities-tab :activities="activities"/>
        </div>
      </el-col>
    </el-row>

    <!-- 修改密码对话框 -->
    <el-dialog :visible.sync="passwordDialogVisible" title="修改密码" width="400px">
      <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules" label-width="80px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" show-password/>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" show-password/>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" show-password/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="passwordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPasswordChange">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加/编辑模型对话框 -->
    <el-dialog :title="modelDialogTitle" :visible.sync="modelDialogVisible" width="500px">
      <el-form ref="modelForm" :model="currentModel" :rules="modelRules" label-width="100px">
        <el-form-item label="模型名称" prop="name">
          <el-input v-model="currentModel.name"/>
        </el-form-item>
        <el-form-item label="模型类型" prop="type">
          <el-select v-model="currentModel.type" placeholder="请选择模型类型">
            <el-option label="趋势预测" value="趋势预测"/>
            <el-option label="风险评估" value="风险评估"/>
            <el-option label="价格预测" value="价格预测"/>
            <el-option label="套利检测" value="套利检测"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="currentModel.status" placeholder="请选择状态">
            <el-option label="运行中" value="运行中"/>
            <el-option label="停止" value="停止"/>
            <el-option label="维护中" value="维护中"/>
          </el-select>
        </el-form-item>
        <el-form-item label="收益(%)" prop="earnings">
          <el-input-number v-model="currentModel.earnings" :precision="2" :step="0.1"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modelDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitModelForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import dayjs from 'dayjs'
import ProfileTab from './components/ProfileTab.vue'
import ModelsTab from './components/AIModelsTab.vue'
import ActivitiesTab from './components/ActivitiesTab.vue'
import CryptoPriceTab from "../index/CryptoPriceTab.vue";
import BacktestTab from "../index/BacktestTab.vue";
import OverviewTab from "../index/OverviewTab.vue";
import AiModel from "../aimodel/index.vue";

export default {
  components: {
    AiModel,
    OverviewTab, BacktestTab, CryptoPriceTab,
    ProfileTab,
    ModelsTab,
    ActivitiesTab
  },
  name: 'PersonalCenter',
  data() {
    return {
      activeTab: 'profile', // 默认激活的标签页
      userInfo: {
        username: '',
        avatar: '',
        email: '',
        phone: '',
        createTime: new Date()
      },
      rules: {
        email: [
          {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
        ],
        phone: [
          {pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur'}
        ]
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        oldPassword: [
          {required: true, message: '请输入原密码', trigger: 'blur'}
        ],
        newPassword: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
          {min: 6, message: '密码长度至少6位', trigger: 'blur'}
        ],
        confirmPassword: [
          {required: true, message: '请确认新密码', trigger: 'blur'},
          {validator: this.validateConfirmPassword, trigger: 'blur'}
        ]
      },
      passwordDialogVisible: false,
      // 收益数据
      totalEarnings: '12.6%',
      monthlyEarnings: '2.3%',
      activeModels: 5,
      // AI模型数据
      aiModels: [
        {
          id: 1,
          name: '比特币趋势预测模型',
          type: '趋势预测',
          status: '运行中',
          earnings: 8.5,
          createTime: '2025-01-15'
        },
        {
          id: 2,
          name: '以太坊价格预测模型',
          type: '价格预测',
          status: '运行中',
          earnings: 5.7,
          createTime: '2025-02-20'
        },
        {
          id: 3,
          name: '风险控制系统',
          type: '风险评估',
          status: '停止',
          earnings: -1.2,
          createTime: '2025-03-10'
        },
        {
          id: 4,
          name: '套利检测模型',
          type: '套利检测',
          status: '维护中',
          earnings: 3.8,
          createTime: '2025-04-05'
        },
        {
          id: 5,
          name: '市场情绪分析模型',
          type: '趋势预测',
          status: '运行中',
          earnings: 12.4,
          createTime: '2025-05-12'
        }
      ],
      // 模型表单相关
      modelDialogVisible: false,
      modelDialogTitle: '',
      currentModel: {
        id: undefined,
        name: '',
        type: '',
        status: '',
        earnings: 0,
        createTime: ''
      },
      modelRules: {
        name: [
          {required: true, message: '请输入模型名称', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择模型类型', trigger: 'change'}
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'change'}
        ]
      },
      activities: [
        {
          timestamp: '2025-10-28',
          title: '登录系统',
          content: '您在公司办公室登录了系统'
        },
        {
          timestamp: '2025-10-25',
          title: '更新个人信息',
          content: '您更新了个人联系方式'
        },
        {
          timestamp: '2025-10-20',
          title: '修改密码',
          content: '您修改了登录密码，增强了账户安全性'
        },
        {
          timestamp: '2025-10-15',
          title: '首次登录',
          content: '您注册并首次登录系统'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      username: 'user/username',
      avatar: 'user/avatar',
      permissions: 'user/permissions',
      email: 'user/email',
      phone: 'user/phone'
    }),
    userRole() {
      if (this.permissions.includes('admin')) return '管理员'
      if (this.permissions.includes('editor')) return '普通用户'
      return this.permissions.join(', ')
    }
  },
  created() {
    this.fetchUserInfo()
  },
  mounted() {
  },
  methods: {
    handleTabClick(tab) {
      // 标签页切换时的处理逻辑
      console.log('切换到标签页:', tab.name)
    },
    fetchUserInfo() {
      // 模拟获取用户信息
      this.userInfo = {
        username: this.username,
        avatar: this.avatar,
        email: this.email,
        phone: this.phone,
        createTime: new Date()
      }
    },
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD')
    },
    handleSubmit() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.$message.success('信息保存成功')
        } else {
          this.$message.error('请检查填写的信息')
        }
      })
    },
    handleReset() {
      this.$refs.userForm.resetFields()
      this.fetchUserInfo()
    },
    handleChangePassword() {
      this.passwordDialogVisible = true
      this.$nextTick(() => {
        this.$refs.passwordForm.resetFields()
      })
    },
    validateConfirmPassword(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    },
    submitPasswordChange() {
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          this.$message.success('密码修改成功')
          // TODO 调用修改密码接口 这里等待实现
          this.passwordDialogVisible = false
        } else {
          this.$message.error('请检查填写的信息')
        }
      })
    },
    // 模型相关方法
    handleAddModel() {
      this.activeTab = 'models' // 切换到模型标签页
      this.modelDialogTitle = '添加模型'
      this.currentModel = {
        id: undefined,
        name: '',
        type: '',
        status: '',
        earnings: 0,
        createTime: dayjs().format('YYYY-MM-DD')
      }
      this.modelDialogVisible = true
      this.$nextTick(() => {
        this.$refs.modelForm.resetFields()
      })
    },
    handleEditModel(model) {
      this.activeTab = 'models' // 切换到模型标签页
      this.modelDialogTitle = '编辑模型'
      this.currentModel = {...model}
      this.modelDialogVisible = true
    },
    handleDeleteModel(model) {
      this.$confirm(`确定要删除模型 "${model.name}" 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.aiModels.findIndex(item => item.id === model.id)
        if (index > -1) {
          this.aiModels.splice(index, 1)
          this.$message.success('删除成功')
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    submitModelForm() {
      this.$refs.modelForm.validate((valid) => {
        if (valid) {
          if (this.currentModel.id) {
            // 编辑模型
            const index = this.aiModels.findIndex(item => item.id === this.currentModel.id)
            if (index > -1) {
              this.aiModels.splice(index, 1, this.currentModel)
              this.$message.success('模型更新成功')
            }
          } else {
            // 添加模型
            const newModel = {
              ...this.currentModel,
              id: this.aiModels.length + 1
            }
            this.aiModels.push(newModel)
            this.$message.success('模型添加成功')
          }
          this.modelDialogVisible = false
        } else {
          this.$message.error('请检查填写的信息')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.personal-center-container {
  padding: 20px;

  // 固定标签页样式
  .personal-tabs {
    position: sticky;
    top: 0;
    z-index: 100;
    background: #ffffff;
    margin: -20px -20px 20px -20px;
    padding: 0 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    ::v-deep .el-tabs__header {
      margin-bottom: 0;
    }
  }

  .profile-card {
    .profile-header {
      text-align: center;
      padding: 20px 0;

      .avatar-container {
        .user-avatar {
          margin-bottom: 15px;
          background-color: #409eff;
        }

        .username {
          margin: 10px 0;
          font-size: 20px;
          font-weight: 500;
        }

        .user-role {
          color: #909399;
          font-size: 14px;
        }
      }
    }

    .profile-info {
      .info-list {
        padding: 0;
        margin: 0;

        .info-item {
          list-style: none;
          padding: 10px 0;
          display: flex;
          align-items: center;

          .info-icon {
            margin-right: 10px;
            color: #409eff;
            width: 16px;
            height: 16px;
          }

          .info-label {
            width: 80px;
            font-weight: 500;
          }

          .info-value {
            flex: 1;
          }
        }
      }
    }
  }

  .security-card, .earnings-card {
    margin-top: 20px;

    .security-options {
      .security-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }

        .security-content {
          .security-label {
            font-weight: 500;
            margin-bottom: 5px;
          }

          .security-desc {
            color: #909399;
            font-size: 12px;
          }
        }
      }
    }

    .earnings-content {
      .earnings-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;

        .earnings-label {
          font-weight: 500;
        }

        .earnings-value {
          font-weight: 600;
        }

        .earnings-up {
          color: #13ce66;
        }

        .earnings-down {
          color: #ff4949;
        }
      }
    }
  }

  .details-card {
    margin-bottom: 20px;
  }

  .models-card {
    margin-bottom: 20px;

    ::v-deep .el-table .el-button {
      padding: 4px 8px;
      font-size: 12px;
    }

    ::v-deep .el-table .el-button--mini {
      padding: 4px 8px;
    }
  }

  .activity-card {
    .activity-list {
      ::v-deep .el-timeline-item__timestamp {
        color: #909399;
      }

      ::v-deep .el-card {
        cursor: default;
      }
    }
  }

  .dialog-footer {
    text-align: right;
  }
}
</style>
