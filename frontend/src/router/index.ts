import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        default: () => import('../views/LoginView.vue')
      },
      meta: {
        layout: 'FullLayout',
        requireAuth: false
      }
    },
    {
      path: '/graph',
      name: 'graph',
      components: {
        default: () => import('../views/HomeView.vue'),
        header: () => import('../components/MainAppBar.vue'),
        menu: () => import('../components/MainMenu.vue')
      },
      meta: {
        layout: 'MainLayout',
        requireAuth: true
      }
    },
    {
      path: '/pos',
      name: 'pos',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default: () => import('../views/pos/PosView.vue'),
        header: () => import('../components/MainAppBar.vue'),
        menu: () => import('../components/MainMenu.vue')
      },
      meta: {
        layout: 'MainLayout',
        requireAuth: true
      }
    },
    {
      path: '/receipthistory',
      name: 'receipthistory',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default: () => import('../views/receiptHistory/ReceiptHistoryView.vue'),
        header: () => import('../components/MainAppBar.vue'),
        menu: () => import('../components/MainMenu.vue')
      },
      meta: {
        layout: 'MainLayout',
        requireAuth: true
      }
    },
    {
      path: '/product',
      name: 'product',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default: () => import('../views/productManagement/ProductView.vue'),
        header: () => import('../components/MainAppBar.vue'),
        menu: () => import('../components/MainMenu.vue')
      },
      meta: {
        layout: 'MainLayout',
        requireAuth: true
      }
    },
    {
      path: '/promotion',
      name: 'promotion',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default: () => import('../views/promotionManagement/PromotionView.vue'),
        header: () => import('../components/MainAppBar.vue'),
        menu: () => import('../components/MainMenu.vue')
      },
      meta: {
        layout: 'MainLayout',
        requireAuth: true
      }
    },
    {
      path: '/user',
      name: 'user',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default: () => import('../views/userManagement/UserView.vue'),
        header: () => import('../components/MainAppBar.vue'),
        menu: () => import('../components/MainMenu.vue')
      },
      meta: {
        layout: 'MainLayout',
        requireAuth: true
      }
    },
    {
      path: '/member',
      name: 'member',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default: () => import('../views/memberManagement/MemberView.vue'),
        header: () => import('../components/MainAppBar.vue'),
        menu: () => import('../components/MainMenu.vue')
      },
      meta: {
        layout: 'MainLayout',
        requireAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default: () => import('../views/LoginView.vue')
      },
      meta: {
        layout: 'FullLayout',
        requireAuth: false
      }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default: () => import('../views/forgotPassword/ForgotPasswordView.vue')
      },
      meta: {
        layout: 'FullLayout',
        requireAuth: false
      }
    }
  ]
})

function isLogin() {
  const user = localStorage.getItem('user')
  if (user) {
    return true
  }
  return false
}

router.beforeEach((to, from) => {
  console.log(from)
  console.log(to)
  sessionStorage.setItem('pathBeforeRefresh', to.path)
  console.log('arleardy set pathBeforeRefresh')
  if (to.meta.requireAuth && !isLogin()) {
    return {
      path: '/login',
      query: { redirect: to.fullPath }
    }
  }
})

export default router
