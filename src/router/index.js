import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
// 修改 原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const routes = [
  {
    path: "/",
    redirect: "/tag",
  },
  {
    path: "/tag",
    name: "Tag",
    component: () => import(/* webpackChunkName: "tag" */ "../views/Tag.vue"),
  },
  {
    path: "/account",
    name: "Account",
    component: () => import(/* webpackChunkName: "account" */ "../views/Account.vue"),
  },
  {
    path: "/statistics",
    name: "Statistics",
    component: () => import(/* webpackChunkName: "statistics" */ "../views/Statistics.vue"),
  },
  {
    path: "/user",
    name: "User",
    component: () => import(/* webpackChunkName: "user" */ "../views/User.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
