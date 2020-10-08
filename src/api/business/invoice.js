import request from '@/utils/request'

// 查询合同列表
export function listInvoice(query) {
  return request({
    url: '/api/Invoice/GetInvoiceList',
    method: 'get',
    params: query
  })
}

// 获取合同详情
export function getInvoiceDetail(data) {
  return request({
    url: '/api/Invoice/GetInvoiceDetail',
    method: 'get',
    params: data,
  })
}

// 更新合同列表
export function addInvoice(data) {
  return request({
    url: '/api/Invoice/CreateInvoice',
    method: 'post',
    data
  })
}

// 更新合同列表
export function updateInvoice(data) {
  return request({
    url: '/api/Invoice/EditInvoice',
    method: 'post',
    data
  })
}



// 获取合同的基本信息
export function queryInvoiceBase(data) {
  return request({
    url: '/api/monitor/project/queryInvoiceBase',
    method: 'post',
    data
  })
}


// 删除合同
export function delInvoice(data) {
  return request({
    url: '/api/Invoice/DeleteInvoice',
    method: 'post',
    data
  })
}

// 审核合同
export function aduitInvoice(data) {
  return request({
    url: '/api/Invoice/InvoiceAudit',
    method: 'post',
    data
  })
}

// 取消审核，让合同可修改
export function cancelApply(data) {
  return request({
    url: '/api/Invoice/InvoiceCancelAudit',
    method: 'post',
    data
  })
}



/* 子合同模块 */
// 获取子合同列表
export function getSubInvoiceList(data) {
  return request({
    url: '/api/SubInvoice/GetSubInvoiceList',
    method: 'get',
    params: data,
  })
}

// 创建子合同
export function createSubInvoice(data) {
  return request({
    url: '/api/SubInvoice/CreateSubInvoice',
    method: 'post',
    data
  })
}

// 获取子合同详情
export function getSubInvoiceDetail(data) {
  return request({
    url: '/api/SubInvoice/GetSubInvoiceDetail',
    method: 'get',
    params: data,
  })
}

// 修改子合同详情
export function editSubInvoice(data) {
  return request({
    url: '/api/SubInvoice/EditSubInvoice',
    method: 'post',
    data
  })
}


// 删除子合同详情
export function deleteSubInvoice(data) {
  return request({
    url: '/api/SubInvoice/DeleteSubInvoice',
    method: 'post',
    data
  })
}







