import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../views/Login.vue')
  }, {
    path: '/login',
    component: () => import('../views/Login.vue')
  }, {
    path: '/home',
    component: () => import('../views/Home.vue'),
    children: [{
      path: '/users',
      component: () => import('../views/User.vue')
    }, {
      path: '/materialinfo',
      component: () => import('../views/MaterialInfo.vue')
    }, {
      path: '/supplier',
      component: () => import('../views/Supplier.vue')
    }, {
      path: '/bill',
      component: () => import('../views/Bill.vue')
    },{
      path:'/reject',
      component:()=>import('../views/Reject.vue')
    },{
      path:'/register',
      component:()=>import('../views/Register.vue')
    },{
      path:'/stock',
      component:()=>import('../views/Stock.vue')
    },{
      path:'/isssuance',
      component:()=>import('../views/Isssuance.vue')
    },{
      path:'/question',
      component:()=>import('../views/Question.vue')
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
