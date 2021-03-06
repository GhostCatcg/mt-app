
module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  
  server: {
    port: 1000, // default: 3000
    host: '0.0.0.0', // default: localhost
  },
  /*

  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    'element-ui/lib/theme-chalk/reset.css',
    '~assets/css/main.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/element-ui'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // 'axios',
    '@nuxtjs/axios' // 这是一个模块，需要安装！！！ 妈的卡了我一周
    // '@nuxtjs/bulma'
  ],
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESlint on save
      // if (ctx.isDev && ctx.isClient){
      //   config.module.rules.push({
      //     enforce:'pre',
      //     test:/\.(js|vue)/,
      //     loader: 'eslint-loader',
      //     exclude:/(node_modules)/,
      //     options : {
      //         fix : true
      //     }
      //   })
      // }
    },
    // github.com/nuxt/nuxt.js/issues/3804
    cache:false
  }
}