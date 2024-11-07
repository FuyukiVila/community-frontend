<template>
    <footer class="footer has-text-grey-light has-background-grey-darker">
        <div class="container">
            <div class="">
                <span>A simple community</span>

                <span style="float: right">
                    <router-link :to="{ path: '/admin/login' }">
                        管理员登录
                    </router-link>
                    |
                    <a href="/?lang=zh_CN">中文</a> |
                    <a href="/?lang=en_US">English</a>
                </span>
            </div>

            <div>
                <span>{{ title }} ALL RIGHTS RESERVED</span>
                <div style="float: right">
                    <template>
                        <b-taglist attached>
                            <b-tag type="is-dark" size="is-normal">Design By</b-tag>
                            <a href="https://github.com/fuyukivila" target="_blank"><b-tag type="is-info" size="is-normal">{{ author
                                    }}</b-tag></a>
                        </b-taglist>
                    </template>
                </div>
            </div>
        </div>
        <back-top></back-top>
    </footer>
</template>

<script>
import BackTop from "@/components/Backtop/BackTop";

export default {
    name: "Footer",
    components: {
        BackTop
    },
    data() {
        return {
            author: 'Fuyuki_Vila',
            title: "© " + new Date().getFullYear() + ' Fuyuki_Vila',
        };
    },
};
</script>

<style scoped>
footer {
    margin-top: 120px;
    height: 150px;
}

footer a {
    color: #bfbfbf;
}
</style>