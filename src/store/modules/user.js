// 获取用户的信息
import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    name: '', // 用户名
    avatar: '', // 头像
    roles: '', // 角色
    permissions: [] // 按钮权限
  },

  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    setPermissions({ commit }, params) {
      commit('SET_PERMISSIONS', params);
    },
    // 登录
    Login({ commit }, params) {
      return new Promise((resolve, reject) => {
        login(params).then(res => {
          const userInfo = res.data || {};
          setToken(userInfo.id); // 缓存用户id
          const userName = userInfo.userName
          const avatar = !userInfo.headPhoto ? require("@/assets/image/myLogo.png") : user.avatar;
          commit('SET_NAME', userName)
          commit('SET_AVATAR', avatar)
          localStorage.setItem('userInfo', JSON.stringify({
            ...userInfo,
            avatar,
          }));
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        const params = {
          userId: getToken(),
        };
        getInfo(params).then(res => {
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    
    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        removeToken()
        localStorage.clear();
        resolve()
      })
    },
  }
}

export default user
