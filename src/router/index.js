import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
Vue.use(VueRouter);

export const routes = [{
    //     path: "/",
    //     name: "Home",
    //     component: Home,
    // },
    // {
        path: "*",
        name: "Home",
        component: Home,
        meta: { title: 'Shopping List' },
    },
];

const router = new VueRouter({
    routes,
    // mode: "history",
    base: process.env.BASE_URL,
});
// 設定 每頁的 title 
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next();
})

export default router;