import type { RouterConfig } from '@nuxt/schema'

export default {
  routes: (_routes) => [
    {
      name: 'login',
      path: '/login',
      component: () => import('~/pages/Login.client.vue')
    }
  ],
} satisfies RouterConfig;
