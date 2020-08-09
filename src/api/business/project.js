import request from '@/utils/request'

// 查询项目列表
export function listProject(data) {
  return request({
    url: '/api/Project/GetProjectList',
    method: 'get',
    params: data
  })
}

// 更新项目列表
export function updateProject(data) {
  return request({
    url: '/api/Project/EditProjectInfo',
    method: 'post',
    data
  })
}

// 更新项目列表
export function addProject(data) {
  return request({
    url: '/api/Project/AddProject',
    method: 'post',
    data
  })
}

// 获取项目的基本信息
export function queryProjectBase(data) {
  return request({
    url: '/monitor/project/queryProjectBase',
    method: 'post',
    data
  })
}


// 删除项目
export function delProject(data) {
  return request({
    url: '/api/Project/DeleteProject',
    method: 'post',
    data
  })
}

// 获取项目分配用户列表
export function getProjectUserList(data) {
  return request({
    url: '/api/Project/GetProjectUserList',
    method: 'get',
    params: data
  })
}

// 项目分配用户
export function addProjectUser(data) {
  return request({
    url: '/api/Project/AssignPersonnel',
    method: 'post',
    data
  })
}

// 项目分配用户
export function delProjectUser(data) {
  return request({
    url: '/api/Project/UnbundePrijectUser',
    method: 'post',
    data
  })
}


// 审核项目
export function aduitProject(data) {
  return request({
    url: '/api/Project/ProjectAudit',
    method: 'post',
    data
  })
}

