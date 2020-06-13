// 获取当前用户的菜单路由
import { constantRoutes } from '@/router' // 基本路由
import { getRouters } from '@/api/menu' // 获取用户能访问的路由
import Layout from '@/layout/index' // 整个crm框架组件

const permission = {
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }, myRoutes) {
      return new Promise(resolve => {
        const accessedRoutes = filterMenu(myRoutes)
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
const filterMenu = (arr) => {
  let menuList = [];
  Array.isArray(arr) && arr.forEach((item, index) => {
    // 如果是按钮权限，取出所有的按钮权限标识
    if (item.menuType === 'M') {
      const { routeUrl, component, menuName, icon } = item;
      const obj = {
        path: '',
        component: Layout,
        children: [
          {
            path: routeUrl,
            component: (resolve) => require([`@/views${component}`], resolve),
            name: menuName,
            meta: { title: menuName, icon: icon }
          }
        ]
      };
      menuList.push(obj);
    }
  })
  return menuList;
}
// function filterAsyncRouter(asyncRouterMap) {
//   return asyncRouterMap.filter(route => {
//     if (route.component) {
//       // Layout组件特殊处理
//       if (route.component === 'Layout') {
//         route.component = Layout
//       } else {
//         route.component = loadView(route.component)
//       }
//     }
//     if (route.children != null && route.children && route.children.length) {
//       route.children = filterAsyncRouter(route.children)
//     }
//     return true
//   })
// }

export const loadView = (view) => { // 路由懒加载
  return (resolve) =>  require([`@/views/${view}`], resolve)
}

export default permission
