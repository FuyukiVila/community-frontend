<template>
  <div class="columns py-6">
    <div class="column is-half is-offset-one-quarter">
      <el-card shadow="never">
        <div slot="header" class="has-text-centered has-text-weight-bold">
          新用户入驻
        </div>
        <div>
          <el-form ref="ruleForm" v-loading="loading" :model="ruleForm" :rules="rules" class="demo-ruleForm"
                   label-width="100px" status-icon>
            <el-form-item label="账号" prop="name">
              <el-input v-model="ruleForm.name"/>
            </el-form-item>

            <el-form-item label="密码" prop="pass">
              <el-input v-model="ruleForm.pass" autocomplete="off" type="password"/>
            </el-form-item>

            <el-form-item label="确认密码" prop="checkPass">
              <el-input v-model="ruleForm.checkPass" autocomplete="off" type="password"/>
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input v-model="ruleForm.email" autocomplete="off"/>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">立即注册</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {userRegister} from '@/api/auth/auth'

export default {
  name: 'Register',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      ruleForm: {
        name: '',
        pass: '',
        checkPass: '',
        email: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入账号', trigger: 'blur'},
          {
            min: 2,
            max: 15,
            message: '长度在 2 到 15 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: '账号只能包含字母、数字和下划线',
            trigger: 'blur'
          }
        ],
        pass: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: '密码只能包含字母、数字和下划线',
            trigger: 'blur'
          }
        ],
        checkPass: [
          {required: true, message: '请再次输入密码', trigger: 'blur'},
          {validator: validatePass, trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.ruleForm.name.trim().toLowerCase()
          userRegister(this.ruleForm)
              .then((value) => {
                const {code, message} = value
                if (code === 200) {
                  this.$message({
                    message: '账号注册成功',
                    type: 'success'
                  })
                  setTimeout(() => {
                    this.loading = false
                    this.$router.replace({path: '/login'}).catch(error => {
                      console.log(error)
                    })
                  }, 0.1 * 1000)
                } else {
                  this.$message.error('注册失败，' + message)
                }
              })
              .catch(() => {
                this.loading = false
              })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped></style>