<template>
    <el-card class="box-card" shadow="never">
        <div slot="header">
            <span>💭 一言</span>
        </div>
        <div>
            <div class="has-text-left block">
                {{ tip.content }}
            </div>
            <div class="has-text-right block">
                ——{{ tip.author }}
            </div>
        </div>
    </el-card>
</template>

<script>
import { getTip } from '@/api/tip'

export default {
    name: 'Tip',
    data() {
        return {
            tip: {
                content: '测试',
                author: '测试'
            }
        }
    },
    created() {
        this.fetchTip()
    },
    methods: {
        fetchTip() {
            getTip().then(response => {
                const { data } = response
                this.tip = data
            })
        }
    }
}
</script>

<style scoped></style>