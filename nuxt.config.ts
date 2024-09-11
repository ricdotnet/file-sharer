// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'File Sharer',
    },
  },
  runtimeConfig: {
    public: {
      listViewEnabled: process.env.NUXT_LIST_VIEW_ENABLED === 'true',
    },
  },
  devtools: {
    enabled: true,
  },
  modules: [
    '@pinia/nuxt',
  ],
});