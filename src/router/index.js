import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../vuex/store.js'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({
  showSpinner: false
})

Vue.use(VueRouter)

const Layout = () => import('components/Container.vue')

// permission
const user = 'user'
const handler = 'handler'

// 完整路由结构
const allRoutes = [{
    path: '/login',
    name: '登录',
    meta: {
      notLoad: true,
      notCatche: true,
    },
    component: () => import('../views/user/Login.vue')
  },
  {
    path: '/',
    name: 'dashbored',
    meta: {
      icon: 'el-icon-light-rain',
    },
    component: Layout,
  },
  {
    path: '/profile',
    name: '个人中心',
    component: Layout,
    meta: {
      notLoad: false,
      icon: 'el-icon-user',
    },
    children: [{
        path: 'me',
        name: '我',
        component: () => import('../views/user/Me.vue'),
        meta: {
          icon: 'el-icon-medal-1'
        }
      },
      {
        path: 'settings',
        name: '设置',
        component: () => import('../views/user/Settings.vue'),
        meta: {
          icon: 'el-icon-setting',
        },
      }
    ],
  },
  {
    path: '/home',
    name: '主页',
    component: Layout,
    redirect: '/home/submenu1/test',
    meta: {
      icon: 'el-icon-lightning'
    },
    children: [{
      path: 'submenu1',
      name: '主页子菜单1',
      component: () => import('../views/home/submenus/submenu1/index.vue'),
      redirect: '/home/submenu1/test',
      meta: {
        icon: 'el-icon-sunset'
      },
      children: [{
        path: 'router',
        name: '路由结构',
        component: () => import('../views/home/submenus/submenu1/Router.vue'),
        meta: {
          icon: 'el-icon-heavy-rain'
        }
      },{
        path: 'test',
        name: '测试',
        component: () => import('../views/home/submenus/submenu1/FilterDataTable.vue'),
        meta: {
          icon: 'el-icon-s-data'
        }
      }]
    }, {
      path: 'submenu2',
      name: '随机name',
      component: () => import('../views/home/submenus/Submenu2.vue'),
      meta: {
        icon: 'el-icon-sunrise',
        permissions: [user]
      }
    }, {
      path: 'submenu3',
      name: '随机address',
      component: () => import('../views/home/submenus/Submenu3.vue'),
      meta: {
        icon: 'el-icon-sunrise-1',
        permissions: [handler]
      }
    }]
  },
  {
    path: '*',
    name: '空',
    meta: {
      notLoad: true,
      notCatche: true,
    },
    component: () => import('../views/other/NotFound.vue')
  }
]

function maintainRouter(permission, route) {
  if (route.meta && route.meta.permissions) {
    return route.meta.permissions.includes(permission) ? true : false
  } else {
    return true
  }
}

function deepFilter(allRoutes, permission) {
  let routes = []
  allRoutes.forEach(route => {
    if (route.children) {
      let children = deepFilter(route.children, permission)
      if (children.length > 0) {
        route.children = children
        routes.push(route)
      }
    } else {
      if (maintainRouter(permission, route)) {
        routes.push(route)
      }
    }
  })
  return routes
}

let permission = 'admin';

let routes = []
if (permission === 'admin') {
  routes = allRoutes;
} else {
  routes = deepFilter(allRoutes, permission);
}

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  store.commit('addRoute', to);
  NProgress.start()
  if (to.name) {
    document.title = to.name;
  }
  next();
  NProgress.done();
})

export default router