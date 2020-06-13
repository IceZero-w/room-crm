import request from '@/utils/request'

// 查询菜单列表
export function listMenu(params) {
  return request({
    // url: '/system/menu/list',
    url: '/api/SysMenus/GetMenuByKey',
    method: 'get',
    params,
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    // url: '/system/menu/treeselect',
    url: '/api/SysMenus/GetAllSystemMenus',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/system/menu/roleMenuTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    // url: '/system/menu',
    url: '/api/SysMenus/AddSysMenu',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    // url: '/system/menu',
    url: '/api/SysMenus/EditSysMenu',
    method: 'post',
    data,
  })
}

// 删除菜单
export function delMenu(params) {
  return request({
    // url: '/system/menu/' + menuId,
    url: '/api/SysMenus/DeleteSysMenu',
    params,
    method: 'get'
  })
}