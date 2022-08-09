import store from "./store";
import router from "./router";
import NProgress from "nprogress"; //进度条插件
import "nprogress/nprogress.css"; // 引入进度条样式
const whiteList = ["/login", "/404"];
// 前置守卫
router.beforeEach(async(to, form, next) => {
  NProgress.start(); // 开启进度条
  const token = store.getters.token;
  if (token) {
    // 有了token，但是没有用户信息，直接去获取用户信息
    if(!store.getters.userId){
      const res=await store.dispatch('user/getInfo')
      // console.log(res.roles.menus);
      const routes=await store.dispatch('permission/filterRoutes',res.roles.menus)
      router.addRoutes([...routes,{ path: "*", redirect: "/404", hidden: true },])
      next(to.path)
    }
    if (to.path === "/login") {
      next("/");
    } else {
      next();
    }
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next("/login");
    }
  }
  NProgress.done(); // 关闭进度条
});
router.afterEach(function () {
  NProgress.done(); // 关闭进度条
});
