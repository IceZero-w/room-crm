// 拦截路由，获取用户信息以及菜单数据
import Layout from '@/layout/index' // 整个crm框架组件
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/resetPwd', '/auth-redirect', '/bind', '/register']
// 获取按钮权限标识
const filterBtnPession = (arr) => {
  let permissionList = [];
  Array.isArray(arr) && arr.forEach((item) => {
    // 如果是按钮权限，取出所有的按钮权限标识
      if (item.loginChildrenList && item.loginChildrenList.length) {
        Array.isArray(item.loginChildrenList) && item.loginChildrenList.forEach(itemSon => {
          if (itemSon.menuType === 'B') {
            permissionList.push(itemSon.menuCode)
          }
        })
      }
  })
  return permissionList;
}
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if ((store.getters.permission_routes && store.getters.permission_routes.length) || (store.getters.permissions && store.getters.permissions.length)) {
        // 用户信息已经获取后，在跳转页面，就不需要重新获取用户信息
        next();
      } else {
        // 用户登陆或重刷页面，则重新获取用户菜单、和按钮权限
        store.dispatch('GetInfo').then(res => {
          const myRoutes = res.data || []; // 用户菜单数据
          const permissionList = filterBtnPession(myRoutes);
          store.dispatch('setPermissions', permissionList); // 设置按钮权限
          store.dispatch('GenerateRoutes', myRoutes).then(accessRoutes => {
              router.addRoutes(accessRoutes) // 动态添加可访问路由表
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
            })
        })
          .catch(err => {
            Message.error(err)
            store.dispatch('LogOut').then(() => { 
              next({ path: '/' })
            })
          })
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
