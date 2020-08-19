import request from '@/utils/request'

// 查询项目列表
export function listContract(query) {
  return request({
    url: '/api/Contract/GetContractList',
    method: 'get',
    params: query
  })
}

// 更新项目列表
export function updateContract(data) {
  return request({
    url: '/api/Contract/EditContract',
    method: 'post',
    data
  })
}

// 更新项目列表
export function addContract(data) {
  return request({
    url: '/api/Contract/CreateContract',
    method: 'post',
    data
  })
}

// 获取项目的基本信息
export function queryContractBase(data) {
  return request({
    url: '/api/monitor/project/queryContractBase',
    method: 'post',
    data
  })
}


// 删除项目
export function delContract(data) {
  return request({
    url: '/api/Contract/DeleteContract',
    method: 'post',
    data
  })
}

// 审核项目
export function aduitContract(data) {
  return request({
    url: '/api/Contract/ContractAudit',
    method: 'post',
    data
  })
}

// 取消审核，让项目可编辑
export function cancelApply(data) {
  return request({
    url: '/api/Contract/ContractCancelAudit',
    method: 'post',
    data
  })
}

// 获取项目详情
export function getContractDetail(data) {
  return request({
    url: '/api/Contract/GetContracDetail',
    method: 'get',
    params: data,
  })
}
