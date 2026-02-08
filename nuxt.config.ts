import Aura from '@primeuix/themes/aura'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  future: {
    compatibilityVersion: 4,
  },

  ssr: true,
  nitro: {
    preset: 'github-pages',
  },

  app: {
    baseURL: '/bbqassad_cookbook/',
    head: {
      title: 'BBQ Ässad Kokaraamat',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Parimad BBQ retseptid samm-sammult – BBQ Ässad kokaraamat' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/bbqassad_cookbook/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
        },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  modules: ['@primevue/nuxt-module', '@nuxt/icon'],

  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark-mode',
          cssLayer: false,
        },
      },
      ripple: true,
    },
  },

  icon: {
    serverBundle: 'remote',
  },
})
