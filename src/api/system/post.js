import request from '@/utils/request'

// 查询岗位列表
export function listPost(query) {
  return request({
    // url: '/system/post/list',
    url: '/api/SysPost/GetPostList',
    method: 'get',
    params: query
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    // url: '/system/post',
    url: '/api/SysPost/AddPost',
    method: 'post',
    data,
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    // url: '/system/post',
    url: '/api/SysPost/EditPost',
    method: 'post',
    data,
  })
}

// 删除岗位
export function delPost(data) {
  return request({
    // url: '/system/post/' + postId,
    url: '/api/SysPost/DeletePost',
    method: 'post',
    data,
  })
}

// 获取岗位关联的菜单
export function getPostMenuList(query) {
  return request({
    url: '/api/SysPost/GetPostMenuList',
    method: 'get',
    params: query
  })
}

// 岗位分配菜单权限
export function editPostMenu(data) {
  return request({
    url: '/api/SysPost/AuthorPostMenu',
    method: 'post',
    data,
  })
}

