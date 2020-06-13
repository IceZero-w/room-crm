import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
    // url: '/system/dept/list',
    url: '/api/SysDepartment/GetDepartmentList',
    method: 'get',
    params: query
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    // url: '/system/dept/treeselect',
    url: '/api/SysDepartment/GetDepartmentTreeList',
    method: 'get'
  })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: '/system/dept/roleDeptTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增部门
export function addDept(data) {
  return request({
    // url: '/system/dept',
    url: '/api/SysDepartment/AddDepartment',
    method: 'post',
    data,
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    // url: '/system/dept',
    url: '/api/SysDepartment/EditDepartment',
    method: 'post',
    data,
  })
}

// 删除部门
export function delDept(data) {
  return request({
    // url: '/system/dept/' + deptId,
    url: '/api/SysDepartment/DeleteDepartment',
    method: 'post',
    data,
  })
}

// 部门分配菜单
export function editDeptMenu(data) {
  return request({
    // url: '/system/dept/' + deptId,
    url: '/api/SysDepartment/AuthorDepartMenu',
    method: 'post',
    data,
  })
}

// 查询部门已关联的菜单
export function getDepartmentMenuList(query) {
  return request({
    url: '/api/SysDepartment/GetDepartmentMenuList',
    method: 'get',
    params: query
  })
}