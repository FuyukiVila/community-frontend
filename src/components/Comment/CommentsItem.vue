
<template>
  <article class="media">
    <figure class="media-left image is-48x48">
      <el-avatar :src="`${comment.avatar}` || `https://cn.gravatar.com/avatar/${comment.userId}?s=164&d=monsterid`" alt=""/>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>{{ comment.username }}</strong>
          <small class="ml-2">{{ comment.createTime | date }}</small>
          <br/>
          <span class="comment-text">{{ comment.content }}</span>
        </p>
      </div>
    </div>
    <div v-if="token && (user.id === comment.userId || user.isAdmin)" class="media-right">
      <el-popconfirm
          title="确定删除这条评论吗？"
          @confirm="deleteComment()"
      >
        <b-button slot="reference" :disabled="isLoading" size="is-small" type="is-danger">删除</b-button>
      </el-popconfirm>
    </div>
  </article>
</template>

<script>import {mapGetters} from "vuex";
import {deleteComment} from "@/api/comment";

export default {
  name: 'LvCommentsItem',
  computed: {
    ...mapGetters([
      'token', 'user'
    ])
  },
  data() {
    return {
      isLoading: false
    }
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  methods: {
    async deleteComment() {
      this.isLoading = true
      try {
        const commentId = this.comment.id.toString()
        console.log(commentId)
        await deleteComment(commentId)
        this.$emit('loadComments', this.comment.topicId.toString())
        this.$message.success("删除成功")
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>.comment-text {
  word-break: break-word;
  white-space: pre-wrap;
}
</style>