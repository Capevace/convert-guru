importScripts('/convert-guru/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/convert-guru/_nuxt/247579435e42bd5e4fa6.js",
    "revision": "78cf07019e34444c8e783732fe5f2c60"
  },
  {
    "url": "/convert-guru/_nuxt/46ebeacaa9adf4b8b117.js",
    "revision": "5e18149c1d723a17fc50ffe58757abaf"
  },
  {
    "url": "/convert-guru/_nuxt/9f1b3494694b3b3a2840.js",
    "revision": "7556ee63f764576b9f0a741df14a42be"
  },
  {
    "url": "/convert-guru/_nuxt/b963a32de74e137bbdea.js",
    "revision": "ffbe182ee3b12bf6376fef8133548138"
  },
  {
    "url": "/convert-guru/_nuxt/c5a88e05212860407db1.js",
    "revision": "3d309c956b6db79df209d859eb962249"
  }
], {
  "cacheId": "ConvertGuru",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/convert-guru/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/convert-guru/.*'), workbox.strategies.networkFirst({}), 'GET')
