import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";


/* 日志模块 */
// 查询项目列表
export function getWorkLogList(data) {
  return request({
    url: '/api/WorkLog/GetContractList',
    method: 'get',
    params: data,
  })
}

// 创建工作日志
export function createWorkLog(data) {
  return request({
    url: '/api/WorkLog/CreateWorkLog',
    method: 'post',
    data
  })
}

// 获取日志详情
export function getWorkLogDetail(data) {
  return request({
    url: '/api/WorkLog/GetWorkLogDetail',
    method: 'get',
    params: data,
  })
}

// 编辑日志详情
export function editWorkLog(data) {
  return request({
    url: '/api/WorkLog/EditWorkLog',
    method: 'post',
    data
  })
}

// 删除工作日志
export function deleteWorkLog(data) {
  return request({
    url: '/api/WorkLog/DeleteWorkLog',
    method: 'post',
    data
  })
}


// 查询用户列表
export function listUser(query) {
  return request({
    // url: '/system/user/list',
    url: '/api/SysUsers/GetUserLlist',
    method: 'get',
    params: query
  })
}

// 新增用户
export function addUser(data) {
  return request({
    // url: '/system/user',
    url: '/api/SysUsers/CreateUser',
    method: 'post',
    data,
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    // url: '/system/user',
    url: '/api/SysUsers/EditUserInfo',
    method: 'post',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}

// 导出用户
export function exportUser(query) {
  return request({
    url: '/system/user/export',
    method: 'get',
    params: query
  })
}

// 用户密码重置
export function resetUserPwd(data) {
  return request({
    // url: '/system/user/resetPwd',
    url: '/api/SysUsers/AdminPassword',
    method: 'post',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/system/user/importTemplate',
    method: 'get'
  })
}
