<template>
  <el-card class="details-card">
    <el-form
      ref="userForm"
      :model="userInfo"
      :rules="rules"
      label-width="100px"
      class="user-info-form"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userInfo.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userInfo.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="userInfo.phone" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <!--      <el-form-item label="创建时间" prop="createTime">-->
      <!--        <el-input v-model="formattedCreateTime" disabled></el-input>-->
      <!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'ProfileTab',
  props: {
    userInfo: {
      type: Object,
      default: () => ({
        username: '',
        email: '',
        phone: '',
        createTime: null
      })
    }
  },
  data() {
    return {
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入联系电话', trigger: 'blur'},
          {pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    formattedCreateTime() {
      // if (!this.userInfo.createTime) return ''
      // return this.formatDate(this.userInfo.createTime)
      return ''
    }
  },
  methods: {
    formatDate(date) {
      return this.$dayjs(date).format('YYYY-MM-DD')
    },
    handleSubmit() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          // TODO 调用更新接口
          this.$message.success('信息保存成功')
          // 可以发出事件通知父组件更新数据
          this.$emit('update-info', this.userInfo)
        } else {
          this.$message.error('请检查填写的信息')
        }
      })
    },
    handleReset() {
      this.$refs.userForm.resetFields()
      this.$emit('reset-info')
    }
  }
}
</script>

<style scoped>
.user-info-form {
  max-width: 600px;
}
</style>
