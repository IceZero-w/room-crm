import request from '@/utils/request'

// 登录方法
export function login(data) {
  return request({
    // url: '/login',
    url: '/api/Login/Login',
    method: 'get',
    params: data
  })
}

// 获取用户详细信息
export function getInfo(data) {
  return request({
    // url: '/getInfo',
    url: '/api/Login/GetUserMenuList',
    method: 'get',
    params: data
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 重置密码
export function resetPwd(data) {
  return request({
    // url: '/resetPwd',
    url: '/api/SysUsers/RestPassword',
    method: 'post',
    data,
  })
}