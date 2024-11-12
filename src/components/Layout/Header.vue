<template>
  <header class="header has-background-white has-text-black">
    <b-navbar :fixed-top="true" class="container is-white">
      <template slot="start">
        <b-navbar-item :to="{ path: '/' }" tag="router-link">
          🌐 主页
        </b-navbar-item>
      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          <b-field position="is-centered">
            <b-input v-model="searchKey" class="s_input" clearable placeholder="搜索帖子、标签和用户" rounded
                     width="80%" @keyup.enter.native="search()"/>

            <p class="control">
              <b-button class="is-info" @click="search()">检索
              </b-button>
            </p>
          </b-field>
        </b-navbar-item>

        <b-navbar-item tag="div">
          <b-switch v-model="darkMode" passive-type="is-warning" type="is-dark">
            {{ darkMode ? "🌙" : "☀️" }}
          </b-switch>
        </b-navbar-item>

        <b-navbar-item v-if="token == null || token === ''" tag="div">
          <div class="buttons">
            <b-button :to="{ path: '/register' }" outlined tag="router-link" type="is-primary">注册</b-button>
            <b-button :to="{ path: '/login' }" class="ml-2" outlined tag="router-link"
                      type="is-danger">登录
            </b-button>
          </div>
        </b-navbar-item>

        <b-navbar-dropdown v-else :label="user.alias">
          <b-navbar-item :to="{ path: `/member/${user.username}/home` }" tag="router-link">
            😊 个人中心
          </b-navbar-item>
          <hr class="dropdown-divider">
          <b-navbar-item :to="{ path: `/member/${user.username}/setting` }" tag="router-link">
            ⚙ 设置中心
          </b-navbar-item>
          <hr v-if="user.isAdmin" class="dropdown-divider">
          <b-navbar-item v-if="user.isAdmin" :to="{path:`/admin`}" tag="router-link">
            👑 管理中心
          </b-navbar-item>
          <hr class="dropdown-divider">
          <b-navbar-item tag="a" @click="logout"> 👋 退出登录
          </b-navbar-item>
        </b-navbar-dropdown>
      </template>
    </b-navbar>
  </header>
</template>

<script>
import {disable as disableDarkMode, enable as enableDarkMode} from 'darkreader'
import {getDarkMode, setDarkMode} from '@/utils/auth'
import {mapGetters} from 'vuex'

export default {
  name: 'Header',
  data() {
    return {
      // logoUrl: require('@/assets/logo.png'),
      // logo: require('@/assets/logo.png'),
      searchKey: '',
      darkMode: false
    }
  },
  computed: {
    ...mapGetters(['token', 'user'])
  },
  watch: {
    // 监听Theme模式
    darkMode(val) {
      if (val) {
        enableDarkMode({})
      } else {
        disableDarkMode()
      }
      setDarkMode(this.darkMode)
    }
  },
  created() {
    // 获取cookie中的夜间还是白天模式
    this.darkMode = getDarkMode()
    if (this.darkMode) {
      enableDarkMode({})
    } else {
      disableDarkMode()
    }
  },
  methods: {
    async logout() {
      this.$store.dispatch('user/logout').then(() => {
        this.$message.info('退出登录成功')
        setTimeout(() => {
          if (this.$route.path !== '/') {
            this.$router.replace({path: '/'})
          }
        }, 500)
      })
    },
    search() {
      console.log(this.token)
      if (this.searchKey.trim() === null || this.searchKey.trim() === '') {
        this.$message.info({
          showClose: true,
          message: '请输入关键字搜索！',
          type: 'warning'
        })
        return false
      }
      this.$router.replace({path: '/search?key=' + this.searchKey})
    }
  }
}
</script>

<style scoped>
input {
  width: 80%;
  height: 86%;
}
</style>