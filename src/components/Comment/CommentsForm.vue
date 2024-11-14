<template>
  <article class="media">
    <div class="media-content">
      <form @submit.prevent="onSubmit">
        <b-field>
          <b-input
              v-model.lazy="commentText"
              :disabled="isLoading"
              maxlength="400"
              placeholder="Add a comment..."
              type="textarea"
          ></b-input>
        </b-field>
        <nav class="level">
          <div class="level-left">
            <b-button
                :disabled="isLoading"
                class="level-item"
                native-type="submit"
                type="is-primary"
            >
              留言
            </b-button>
          </div>
        </nav>
      </form>
    </div>
  </article>
</template>

<script>
import {pushComment} from '@/api/comment'

export default {
  name: 'LvCommentsForm',
  data() {
    return {
      commentText: '',
      isLoading: false
    }
  },
  props: {
    slug: {
      type: String,
      default: null
    }
  },
  methods: {
    async onSubmit() {
      this.isLoading = true
      try {
        let postData = {}
        console.log(this.commentText)
        postData['content'] = this.commentText
        postData['topic_id'] = this.slug
        await pushComment(postData)
        this.$emit('loadComments', this.slug)
        this.$message.success('留言成功')
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>