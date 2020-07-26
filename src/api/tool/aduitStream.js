import request from '@/utils/request'

/* 工作流类型 */
// 获取工作流类型列表
export function getFlowTypeList(data) {
  return request({
    url: '/api/FlowType/GetFlowTypeList',
    method: 'get',
    params: data
  })
}

// 添加工作流类型
export function createFlowType(data) {
  return request({
    url: '/api/FlowType/CreateFlowType',
    method: 'post',
    data
  })
}

// 编辑工作流类型
export function editFlowType(data) {
  return request({
    url: '/api/FlowType/EditFlowType',
    method: 'post',
    data
  })
}

// 编辑工作流类型
export function deleteFlowType(data) {
  return request({
    url: '/api/FlowType/DeleteFlowType',
    method: 'post',
    data
  })
}


/* 工作流 */
// 获取工作流列表
export function getFlowList(data) {
  return request({
    url: '/api/Flow/GetFlowList',
    method: 'get',
    params: data
  })
}

// 创建工作流
export function createFlow(data) {
  return request({
    url: '/api/Flow/CreateFlow',
    method: 'post',
    data
  })
}


// 编辑工作流
export function editFlow(data) {
  return request({
    url: '/api/Flow/EditFlow',
    method: 'post',
    data
  })
}

// 编辑工作流
export function deleteFlow(data) {
  return request({
    url: '/api/Flow/DeleteFlow',
    method: 'post',
    data
  })
}

// 获取工作流类型字典类型
export function getFlowDic(data) {
  return request({
    url: '/api/Flow/GetFlowDic',
    method: 'get',
    params: data
  })
}

/* 工作流子节点 */

// 获取工作流子节点列表
export function getFlowNodeList(data) {
  return request({
    url: '/api/FlowNode/GetFlowNodeList',
    method: 'get',
    params: data
  })
}

// 创建工作流子节点
export function createFlowNode(data) {
  return request({
    url: '/api/FlowNode/CreateFlowNode',
    method: 'post',
    data
  })
}

// 编辑工作流子节点
export function editFlowNode(data) {
  return request({
    url: '/api/FlowNode/EditFlowNode',
    method: 'post',
    data
  })
}

// 删除工作流子节点
export function deleteFlowNode(data) {
  return request({
    url: '/api/FlowNode/DeleteFlow',
    method: 'post',
    data
  })
}

// 获取工作流子节点分配的用户
export function getAuthorUserList(data) {
  return request({
    url: '/api/FlowNode/GetAuthorUserList',
    method: 'get',
    params: data
  })
}


// 分配工作流子节点分配的用户
export function authorNodeUser(data) {
  return request({
    url: '/api/FlowNode/AuthorNodeUser',
    method: 'post',
    data
  })
}

// 删除工作流子节点分配的用户
export function deleteNodeUser(data) {
  return request({
    url: '/api/FlowNode/DeleteNodeUser',
    method: 'post',
    data
  })
}


