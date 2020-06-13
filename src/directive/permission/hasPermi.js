 /**
 * 判断按钮是否有操作权限
 * Copyright (c) 2019 ruoyi
 */
 
import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const all_permission = "*:*:*";
    const permissions = store.getters && store.getters.permissions
    if (localStorage.getItem('showAllFlag') === '1') { return } // 如果缓存中showAllFlag为true的时候，全局按钮权限限制
    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      const hasPermissions = permissions.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission)
      })

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  }
}
