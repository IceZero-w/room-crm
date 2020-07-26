import request from '@/utils/request'

// 查询项目列表
export function listProject(query) {
  return request({
    url: '/monitor/project/list',
    method: 'get',
    params: query
  })
}

// 更新项目列表
export function updateProject(data) {
  return request({
    url: '/monitor/project/update',
    method: 'post',
    data
  })
}

// 更新项目列表
export function addProject(data) {
  return request({
    url: '/monitor/project/add',
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
    url: '/monitor/project/delProject',
    method: 'post',
    data
  })
}

// 审核项目
export function aduitProject(data) {
  return request({
    url: '/monitor/project/aduitProject',
    method: 'post',
    data
  })
}

// 获取项目审核进度详情
export function queryAduitProjectRecord(data) {
  return request({
    url: '/monitor/project/aduitProject',
    method: 'post',
    data
  })
}
