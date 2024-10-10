// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'File Sharer',
    },
  },
  devtools: {
    enabled: true,
  },
  modules: ['@pinia/nuxt', 'nuxt-cron', 'nuxt-api-shield'],
  cron: {
    timeZone: 'Europe/London',
    jobsDir: 'cron',
  },
  nuxtApiShield: {
    limit: {
      max: 1000000,
      duration: 60 * 30,
      ban: 3600,
    },
    log: {
      path: 'Logs',
      attempts: 100,
    },
  },
  nitro: {
    storage: {
      shield: {
        driver: 'memory',
      },
    },
  },
});
