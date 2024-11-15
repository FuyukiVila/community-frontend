<template>
  <div class="member">
    <div class="columns">
      <div class="column is-one-quarter">
        <el-card shadow="never">
          <div slot="header" class="has-text-centered">
            <el-upload
                :before-upload="beforeAvatarUpload"
                :disabled="!token || topicUser.id !== user.id"
                :headers="{Authorization: 'Bearer ' + token}"
                :multiple="false"
                :on-success="handleAvatarSuccess"
                :show-file-list="false"
                action="http://127.0.0.1:8081/ums/user/upload_avatar"
                class="avatar-uploader"
            >
              <el-avatar v-if="imageURL" :size="128" :src="imageURL" class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>

            <el-popconfirm
                v-if="token && user.isAdmin && !topicUser.isAdmin"
                title="确定删除这个头像吗？"
                @confirm="handleDeleteAvatar"
            >
              <el-button slot="reference" circle icon="el-icon-delete"></el-button>
            </el-popconfirm>

            <p class="mt-3">{{ topicUser.alias || topicUser.username }}</p>
            <b-tag v-if="!topicUser.status" type="is-danger">
              封禁中
            </b-tag>
          </div>
          <div>
            <p class="content">积分：<code>{{ topicUser.score }}</code></p>
            <p class="content">文章：<code>{{ profile.topicCount }}</code></p>
            <p class="content">粉丝：<code>{{ profile.followerCount }}</code></p>
            <p class="content">入驻：{{ dayjs(topicUser.createTime).format("YYYY/MM/DD HH:MM:ss") }}</p>
            <p class="content">简介：{{ topicUser.bio }}</p>
            <p class="content">
              <el-button v-if="topicUser.status && user.isAdmin && !topicUser.isAdmin" type="danger" @click="handleBan()">
                封禁
              </el-button>
              <el-button v-if="!topicUser.status && user.isAdmin && !topicUser.isAdmin" type="success" @click="handleUnban()">
                解封
              </el-button>
            </p>
          </div>
        </el-card>
      </div>

      <div class="column">
        <!--用户发布的话题-->
        <el-card class="box-card content" shadow="never">
          <div slot="header" class="has-text-weight-bold">
            <span>话题</span>
          </div>

          <div v-if="topics.length===0">
            暂无话题
          </div>

          <div v-else class="topicUser-info">
            <article v-for="(item, index) in topics" :key="index" class="media">
              <div class="media-content">
                <div class="content ellipsis is-ellipsis-1">
                  <el-tooltip :content="item.title" class="item" effect="dark" placement="top">
                    <router-link :to="{ name: 'post-detail', params: { id: item.id } }">
                      {{ item.title }}
                    </router-link>
                  </el-tooltip>
                </div>
                <nav class="level has-text-grey is-size-7">
                  <div class="level-left">
                    <span class="mr-1">
                      发布于:{{ dayjs(item.createTime).format("YYYY/MM/DD HH:mm:ss") }}
                    </span>
                  </div>
                </nav>
              </div>
              <div v-if="token" class="media-right">
                <div v-if="topicUser.username === user.username || user.isAdmin" class="level">
                  <div v-if="topicUser.username === user.username" class="level-item mr-1">
                    <router-link :to="{name:'topic-edit',params: {id:item.id}}">
                      <span class="tag is-warning">编辑</span>
                    </router-link>
                  </div>
                  <div v-if="topicUser.username === user.username || user.isAdmin" class="level-item">
                    <a @click="handleDelete(item.id)">
                      <span class="tag is-danger">删除</span>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <!--分页-->
          <pagination
              v-show="page.total > 0"
              :limit.sync="page.size"
              :page.sync="page.current"
              :total="page.total"
              class="mt-5"
              @pagination="fetchUserById"
          />
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import {ban, deleteAvatar, getInfoByName, unban} from '@/api/user'
import pagination from '@/components/Pagination/index'
import {mapGetters} from 'vuex'
import {deleteTopic} from '@/api/post'

export default {
  name: 'Profile',
  components: {pagination},
  data() {
    return {
      imageURL: null,
      topicUser: {},
      topics: {},
      profile: {},
      page: {
        current: 1,
        size: 5,
        total: 0
      }
    }
  },
  computed: {
    ...mapGetters(['token', 'user'])
  },
  created() {
    this.fetchUserById()
  },
  methods: {
    fetchUserById() {
      getInfoByName(this.$route.params.username, this.page.current, this.page.size).then((res) => {
        const {data} = res
        this.topicUser = data.user
        this.profile = data.profile
        this.page.current = data.topics.current
        this.page.size = data.topics.size
        this.page.total = data.topics.total
        this.topics = data.topics.records
        this.imageURL = data.user.avatar
      }).catch(error => {
        console.log(error)
      })
    },
    handleDelete(id) {
      deleteTopic(id).then(value => {
        const {code, message} = value
        this.$message.success(message)
        this.fetchUserById()
      })
    },
    handleBan() {
      if (this.topicUser.status) {
        ban(this.topicUser.username).then(value => {
          const {code, message} = value
          this.$message.success(message)
          this.fetchUserById()
        }).catch(error => {
          console.log(error)
        })
      }
    },
    handleUnban() {
      if (!this.topicUser.status) {
        unban(this.topicUser.username).then(value => {
          const {code, message} = value
          this.$message.success(message)
          this.fetchUserById()
        }).catch(error => {
          console.log(error)
        })
      }
    },
    beforeAvatarUpload(file) {
      const maxSize = 5;

      if (!["image/jpg", "image/png", "image/jpeg", "image/bmp"].includes(file.type)) {
        this.$message.error('只能上传JPG/JPEG/PNG/BMP格式！');
      }
      if (!file.size > maxSize) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
      }
      return true
    },
    handleAvatarSuccess(res, file) {
      const {code, message} = res;
      if (code === 200) {
        this.$message.success(message)
        this.fetchUserById()
      } else {
        this.$message.error(message)
      }
    },
    handleDeleteAvatar() {
      deleteAvatar(this.topicUser.username).then(value => {
        const {code, message} = value
        this.$message.success(message)
        this.fetchUserById()
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>

</style>