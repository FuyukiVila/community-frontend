import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
        meta: {title: '首页'}
    },
    {
        path: "/register",
        name: "register",
        component: () => import("@/views/auth/Register.vue"),
        meta: {title: '注册'}
    },
    // 登录
    {
        name: "login",
        path: "/login",
        component: () => import("@/views/auth/Login"),
        meta: {title: "登录"},
    },
    // 发布
    {
        name: "post-create",
        path: "/post/create",
        component: () => import("@/views/post/Create.vue"),
        meta: {title: "信息发布", requiresAuth: true}
    },
    // 详情
    {
        name: "post-detail",
        path: "/post/:id",
        component: () => import("@/views/post/Detail.vue"),
    },
    {
        path: "/404",
        name: "404",
        component: () => import("@/views/error/404.vue"),
        meta: {title: '404-Not Found'}
    },
    {
        path: "*",
        redirect: "/404",
        hidden: true
    }
]

const router = new VueRouter({
    routes
})

export default router
