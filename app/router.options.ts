import type { RouterConfig } from '@nuxt/schema'

export default {
  routes: (_routes) => [
    {
      name: 'home',
      path: '/',
      component: () => import('~/pages/index.vue'),
      meta: {
        isAuthed: true,
      },
    },
    {
      name: 'upload',
      path: '/upload',
      component: () => import('~/pages/Upload.client.vue'),
      meta: {
        isAuthed: true,
      },
    },
    {
      name: 'view',
      path: '/view/:file',
      component: () => import('~/pages/View.client.vue'),
      meta: {
        isAuthed: false,
      },
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('~/pages/Login.client.vue'),
      meta: {
        isAuthed: false,
      },
    }
  ],
} satisfies RouterConfig;
