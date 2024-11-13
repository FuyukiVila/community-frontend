<template>
  <el-card class="" shadow="never">
    <div slot="header">
      <span class="has-text-weight-bold">🤓 随便看看</span>
    </div>
    <div>
      <p v-for="(item,index) in recommend" :key="index" :title="item.title" class="block ellipsis is-ellipsis-1">
        <router-link :to="{name:'post-detail',params: { id: item.id }}">
          <span class="tag">
            {{ (parseInt(index) + 1).toString().padStart(2, '0') }}
          </span>
          {{ item.title }}
        </router-link>
      </p>
    </div>
  </el-card>
</template>

<script>
import {getRecommendTopics} from '@/api/post'

export default {
  name: 'Recommend',
  props: {
    topicId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      recommend: []
    }
  },
  created() {
    this.fetchRecommendTopics()
  },
  methods: {
    fetchRecommendTopics() {
      getRecommendTopics(this.topicId).then(value => {
        const {data} = value
        this.recommend = data
      })
    }
  }
}
</script>

<style scoped>

</style>