import type { RouterConfig } from '@nuxt/schema'

export default {
  routes: (_routes) => [
    {
      name: 'home',
      path: '/',
      component: () => import('~/pages/index.vue')
    },
    {
      name: 'upload',
      path: '/upload',
      component: () => import('~/pages/Upload.client.vue')
    },
    {
      name: 'view',
      path: '/view/:file',
      component: () => import('~/pages/View.client.vue')
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('~/pages/Login.client.vue')
    }
  ],
} satisfies RouterConfig;
