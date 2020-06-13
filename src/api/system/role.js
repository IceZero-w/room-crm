import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
  return request({
    // url: '/system/role/list',
    url: '/api/SysRoles/GetRoleList',
    method: 'get',
    params: query
  })
}

// 新增角色
export function addRole(data) {
  return request({
    // url: '/system/role',
    url: 'api/SysRoles/AddSysRole',
    method: 'post',
    data,
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    // url: '/system/role',
    url: 'api/SysRoles/EditRole',
    method: 'post',
    data,
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/system/role/dataScope',
    method: 'put',
    data,
  })
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  }
  return request({
    url: '/system/role/changeStatus',
    method: 'put',
    data,
  })
}

// 删除角色
export function delRole(roleId) {
  return request({
    // url: '/system/role/' + roleId,
    url: '/api/SysRoles/DeleteRole',
    method: 'post',
    data,
  })
}

// 获取角色已经关联的菜单列表
export function getRoleMenuList(query) {
  return request({
    url: '/api/SysRoles/GetRoleMenuList',
    method: 'get',
    params: query
  })
}

// 获取角色已经关联的菜单列表
export function editRoleMenu(data) {
  return request({
    url: '/api/SysRoles/AuthorRoleMenu',
    method: 'post',
    data,
  })
}



