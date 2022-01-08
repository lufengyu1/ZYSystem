import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path:'/',
    component: () => import('../views/Login.vue')
  },{
    path: '/login',
    component: () => import('../views/Login.vue')
  },{
    path:'/home',
    component: () => import('../views/Home.vue'),
    children:[{
      path:'/users',
      component:()=>import ('../views/User.vue')
    }]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  let token = window.sessionStorage.getItem('token');
  if (!token) return next('/login');
  next();
})

export default router
