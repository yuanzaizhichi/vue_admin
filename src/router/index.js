import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import Login from '../components/Login'
import Welcome from '../components/Welcome'
import Department from '../components/department/Department'
import Admin from '../components/admin/Admin'
import Users from '../components/user/Users'
import Params from '../components/param/Params'
import Roles from '../components/roles/Roles'
import Activity from '../components/activity/Activity'
import AdminActivity from '../components/adminActivity/AdActivity'
import AdminUser from '../components/adminUser/AdUser'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/department',
        component: Department
      },
      {
        path: '/admin',
        component: Admin
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/activity',
        component: Activity
      },
      {
        path: '/adminactivity',
        component: AdminActivity
      },
      {
        path: '/adminuser',
        component: AdminUser
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
