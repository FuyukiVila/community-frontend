<template>
    <el-card class="box-card" shadow="never">
        <div slot="header">
            <span>🔗 友情链接</span>
        </div>
        <div>
            <span v-for="(item, index) in list" :key="index" class="block">
                <a :href="item.link" target="_blank">{{ item.title }}  </a>
            </span>
        </div>
    </el-card>
</template>

<script>
import { getList } from '@/api/promotion'

export default {
    name: 'Promotion',
    data() {
        return {
            list: [
                {
                    "link": "https://www.baidu.com",
                    "title": "百度"
                }
            ]
        }
    },
    created() {
        this.fetchList()
    },
    methods: {
        fetchList() {
            getList().then((response) => {
                const { data } = response
                this.list = data
            })
        }
    }
}
</script>

<style scoped></style>