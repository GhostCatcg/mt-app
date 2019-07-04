// const Koa = require('koa')
import Koa from 'koa'
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
// 导入数据库
import mongoose from 'mongoose'
// 处理和post相关的请求
import bodyParser from 'koa-bodyparser'
// 操作session和cookie
import session from 'koa-generic-session'
// 分布式管理
import Redis from 'koa-redis'
// 解决服务端向客户端发送json美化的效果
import json from 'koa-json'
// 导入数据库相关的配置
import dbConfig from './dbs/config'
// 导入passport
import passport from './interface/utils/passport'
// 导入接口
import users from './interface/user'
const app = new Koa()

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

app.keys=['mt','keyskeys']
app.proxy = true
app.use(session({key:"mt",prefix:"mt:uid",store:new Redis()}))
app.use(bodyParser({
  extendTypes:['json', 'form','text']
}))
app.use(json())

mongoose.connect(dbConfig.dbs,{
  useNewUrlParser:true
})
app.use(passport.initialize())
app.use(passport.session())


async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(ctx => {
    // ctx.status = 200
    // ctx.respond = false // Bypass Koa's built-in response handling
    // ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    // nuxt.render(ctx.req, ctx.res)
    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject)
      })
    })
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
