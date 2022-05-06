import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../views/Login.vue')
  }, {
    path: '/login',
    component: () => import('../views/Login.vue')
  }, {
    path: '/welcome',
    component: () => import('../views/Welcome.vue'),
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
    }, {
      path: '/reject',
      component: () => import('../views/Reject.vue')
    }, {
      path: '/register',
      component: () => import('../views/Register.vue')
    }, {
      path: '/stock',
      component: () => import('../views/Stock.vue')
    }, {
      path: '/isssuance',
      component: () => import('../views/Isssuance.vue')
    }, {
      path: '/question',
      component: () => import('../views/Question.vue')
    }, {
      path: '/home',
      component: () => import('../views/Home.vue')
    }, {
      path: '/role',
      component: () => import('../views/Role.vue')
    }, {
      path: '/department',
      component: () => import('../views/Department.vue')
    }, {
      path: '/inbound',
      component: () => import('../views/Inbound.vue')
    }, {
      path: '/outbound',
      component: () => import('../views/Outbound.vue')
    }, {
      path: '/right',
      component: () => import('../views/Right.vue')
    },{
      path: '/instock',
      component: () => import('../views/Instock.vue')
    },{
      path: '/outstock',
      component: () => import('../views/Outstock.vue')
    },{
      path: '/enterprise',
      component: () => import('../views/Enterprise.vue')
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
