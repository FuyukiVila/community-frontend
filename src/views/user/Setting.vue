<template>
  <section>
    <el-card shadow="never">
      <div slot="header">
        个人设置
      </div>
      <div class="columns">
        <div class="column is-full">
          <el-form ref="form" :label-position="labelPosition" :model="user" label-width="100px">
            <el-form-item label="账号">
              <el-input v-model="user.username" disabled/>
            </el-form-item>
            <el-form-item :rules="rules.alias" label="昵称" prop="alias">
              <el-input v-model="user.alias"/>
            </el-form-item>
            <el-form-item :rules="rules.bio" label="简介" prop="bio">
              <el-input v-model="user.bio"/>
            </el-form-item>
            <el-form-item :rules="rules.email" label="邮箱" prop="email">
              <el-input v-model="user.email"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('form')">提交</el-button>
              <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </section>
</template>

<script>
import {getInfo, update} from '@/api/user'

export default {
  name: 'Setting',
  data() {
    return {
      activeName: 'first',
      labelPosition: 'right',
      user: {
        id: '',
        username: '',
        alias: '',
        bio: '',
        email: '',
        mobile: '',
      },
      rules: {
        alias: [
          {required: true, message: '请输入昵称', trigger: 'blur'},
          {min: 2, max: 15, message: '昵称长度应在2到15个字符之间', trigger: 'blur'}
        ],
        bio: [
          {max: 100, message: '最多100个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
        ],
      }
    }
  },
  created() {
    this.fetchInfo()
  },
  methods: {
    fetchInfo() {
      getInfo(this.$route.params.username).then(res => {
        console.log(res)
        const {data} = res
        this.user = data
      }).catch(error => {
        console.log(error)
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          update(this.user).then(res => {
            this.$message.success('信息修改成功')
            this.fetchInfo()
          }).catch(error => {
            console.log(error)
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.fetchInfo()
    }
  }
}
</script>