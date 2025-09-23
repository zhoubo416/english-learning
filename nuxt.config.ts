export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: '新概念英语学习网站',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '新概念英语在线学习平台，提供新概念英语第一册至第四册的音频、文本、LRC同步歌词，帮助您高效学习英语。' },
        { name: 'keywords', content: '新概念英语, 英语学习, 英语听力, 英语口语, 英语教材, 英语课程, 新概念第一册, 新概念第二册, 新概念第三册, 新概念第四册, 英语音频, 英语文本, LRC歌词' },
        
        // Open Graph / Facebook
        { property: 'og:title', content: '新概念英语学习网站 - 在线音频与文本同步学习' },
        { property: 'og:description', content: '新概念英语在线学习平台，提供新概念英语第一册至第四册的音频、文本、LRC同步歌词，帮助您高效学习英语。' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://yourwebsite.com' },
        { property: 'og:image', content: 'https://yourwebsite.com/og-image.jpg' },

        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: '新概念英语学习网站 - 在线音频与文本同步学习' },
        { name: 'twitter:description', content: '新概念英语在线学习平台，提供新概念英语第一册至第四册的音频、文本、LRC同步歌词，帮助您高效学习英语。' },
        { name: 'twitter:image', content: 'https://yourwebsite.com/twitter-image.jpg' },
      ],
      link: [
        { rel: 'canonical', href: 'https://yourwebsite.com' }
      ]
    }
  }
})