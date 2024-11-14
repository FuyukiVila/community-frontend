<template>
    <div class="columns mt-6">
        <div class="column mt-6">
            <div class="mt-6">
                <p class="content">UH OH! 页面丢失</p>
                <p class="content subtitle mt-6">
                    您所寻找的页面不存在， {{ times }} 秒后，将返回首页!
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "404",
    data() {
        return {
            times: 10,
            timer: null
        }
    },
    created() {
        this.goHome();
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    methods: {
        goHome: function () {
            this.timer = setInterval(() => {
                this.times--;
                if (this.times === 0) {
                    clearInterval(this.timer);
                  this.$router.replace({path: '/'}).catch(error => {
                    console.log(error)
                  });

                }
            }, 1000);
        }
    }
}
</script>

<style scoped></style>