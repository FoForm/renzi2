// import { config } from '@vue/test-utils'
import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import { getTime } from "@/utils/auth";
import router from "@/router";
const requset = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
});
const TimeOut = 3600; // 定义超时时间 单位s
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
  var currentTime = Date.now(); // 当前时间戳
  var timeStamp = getTime(); // 缓存时间戳
  return (currentTime - timeStamp) / 1000 < TimeOut;
}
// 请求拦截器
requset.interceptors.request.use(
  (config) => {
    const token = store.getters.token;
    if (token) {
      if (IsCheckTimeOut()) {
        // 如果token存在 注入token
        config.headers["Authorization"] = `Bearer ${store.getters.token}`;
      } else {
        Message('token超时了')
        store.dispatch("user/logout");
        router.push("/login");
        return Promise.reject(new Error("token超时了"));
      }
      // config.headers["Authorization"] = `Bearer ${store.getters.token}`;
    }
    return config; // 必须返回配置
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
requset.interceptors.response.use((response) => {
  const {
    data: { success, data, message },
  } = response;
  if (success) {
    return data;
  }
  Message.error(message || "系统错误");
  return Promise.reject(message || "系统错误");
},error=>{
  if(error.response.status===401){
    store.dispatch('user/logout')
    router.push('/login')
  }
  Message.error(error.response?.data?.message || '系统错误')
  return Promise.reject(error)
});

export default requset;
