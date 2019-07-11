module.exports = {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: 'ConvertGuru - Convert Videos to GIFs in your browser for free!',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'ConvertGuru allows you to convert video files (.mov, .mp4, .avi, etc.) to GIFs for free directly in your browser! You\'re not uploading anything to our servers so your privacy is protected.'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/guru-colored.png' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#5f71df' },
  /*
   ** Global CSS
   */
  css: ['~/assets/css/tailwind.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/pwa'],
  /*
   ** Build configuration
   */
  build: {
    postcss: {
      plugins: {
        'postcss-simple-vars': true,
        tailwindcss: './tailwind.config.js',
        'postcss-hexrgba': true
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
