<template>
  <div class="columns">
    <!--文章详情-->
    <div class="column is-three-quarters">
      <!--主题-->
      <el-card
          class="box-card"
          shadow="never"
      >
        <div
            slot="header"
            class="has-text-centered"
        >
          <p class="is-size-5 has-text-weight-bold">{{ topic.title }}</p>
          <div class="has-text-grey is-size-7 mt-3">
            <span>{{ dayjs(topic.createTime).format('YYYY/MM/DD HH:mm:ss') }}</span>
            <el-divider direction="vertical"/>
            <span>发布者：{{ topicUser.alias }}</span>
            <el-divider direction="vertical"/>
            <span>查看：{{ topic.view }}</span>
          </div>
        </div>

        <!--Markdown-->
        <div id="preview"/>

        <!--标签-->
        <nav class="level has-text-grey is-size-7 mt-6">
          <div class="level-left">
            <p class="level-item">
              <b-taglist>
                <router-link
                    v-for="(tag, index) in tags"
                    :key="index"
                    :to="{ name: 'tag', params: { name: tag.name } }"
                >
                  <b-tag type="is-info is-light mr-1">
                    {{ "#" + tag.name }}
                  </b-tag>
                </router-link>
              </b-taglist>
            </p>
          </div>
          <div v-if="token && (user.id === topicUser.id || user.isAdmin)"
               class="level-right"
          >
            <router-link v-if="user.id === topicUser.id"
                         :to="{name:'topic-edit',params: {id:topic.id}}"
                         class="level-item"
            >
              <span class="tag">编辑</span>
            </router-link>
            <a class="level-item">
              <el-popconfirm
                  title="确定删除这篇文章吗？"
                  @confirm="handleDelete(topic.id)"
              >
              <span v-if=" user.id === topicUser.id || user.isAdmin"
                    class="tag"
                    slot="reference"
              >删除</span>
              </el-popconfirm>
            </a>
          </div>
        </nav>
      </el-card>

      <lv-comments :slug="topic.id"/>
    </div>

    <div class="column">
      作者
      <Author
          v-if="flag"
          :user="topicUser"
      />
      <!--推荐-->
      <recommend
          v-if="flag"
          :topic-id="topic.id"
      />
    </div>
  </div>
</template>

<script>
import {deleteTopic, getTopic} from '@/api/post'
import {mapGetters} from 'vuex'
import Author from '@/views/post/Author'
import Recommend from '@/views/post/Recommend'
import LvComments from '@/components/Comment/Comments'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

export default {
  name: 'TopicDetail',
  components: {Author, Recommend, LvComments},
  computed: {
    ...mapGetters([
      'token', 'user'
    ])
  },
  data() {
    return {
      flag: false,
      topic: {
        content: '',
        id: this.$route.params.id,
        createTime: 0,
      },
      tags: [],
      topicUser: {}
    }
  },
  mounted() {
    this.fetchTopic().catch(error => {
    })
  },
  methods: {
    renderMarkdown(md) {
      Vditor.preview(document.getElementById('preview'), md, {
        hljs: {style: 'github'}
      })
    },
    // 初始化
    async fetchTopic() {
      getTopic(this.$route.params.id).then(response => {
        const {data} = response
        document.title = data.topic.title

        this.topic = data.topic
        this.tags = data.tags
        this.topicUser = data.user
        // this.comments = data.comments
        this.renderMarkdown(this.topic.content)
        this.flag = true
      }).catch(error => {
      })
    },
    handleDelete(id) {
      deleteTopic(id).then(value => {
        const {code, message} = value
        this.$message.success(message)

        if (code === 200) {
          setTimeout(() => {
            this.$router.push({path: '/'}).catch(
                error => {
                  console.log(error)
                }
            )
          }, 500)
        }
      }).catch(error => {
      })
    }
  }
}
</script>

<style>
#preview {
  min-height: 300px;
}
</style>