import { login, getInfo, getUserDetailById } from "@/api/user";
import { getToken, setToken, removeToken, setTime } from "@/utils/auth";
// 状态
const state = {
  token: getToken(), // 设置token初始状态   token持久化 => 放到缓存中
  userInfo: {},
};
// 修改状态
const mutations = {
  setToken(state, token) {
    state.token = token; // 设置token  只是修改state的数据
    setToken(token); // vuex和 缓存数据的同步
  },
  removeToken(state) {
    state.token = null; // 删除vuex的token
    removeToken(); // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  getInfo(state, userInfo) {
    state.userInfo = userInfo; //获取用户信息
  },
  removeUserInfo(state) {
    state.userInfo = {}; //删除用户信息
  },
};
// 执行异步
const actions = {
  async login(context, data) {
    const res = await login(data);
    setTime()
    console.log(res);
    context.commit("setToken", res);
  },
  async getInfo(context) {
    const res = await getInfo();
    const baseInfo = await getUserDetailById(res.userId);
    context.commit("getInfo", { ...res, ...baseInfo });
    return {...res, ...baseInfo};
  },
  logout({ commit }) {
    commit("removeToken");
    commit("removeUserInfo");// 删除用户信息
    // resRoutes()
    commit('permission/setRoutes',[],{root:true})
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
