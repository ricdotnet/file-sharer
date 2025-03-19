import type { RouterConfig } from '@nuxt/schema';

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
      component: () => import('~/pages/upload.vue'),
      meta: {
        isAuthed: true,
      },
    },
    {
      name: 'view',
      path: '/view/:file',
      component: () => import('~/pages/view.vue'),
      meta: {
        isAuthed: false,
      },
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('~/pages/login.vue'),
      meta: {
        isAuthed: false,
      },
    },
  ],
} satisfies RouterConfig;
