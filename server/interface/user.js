import Router from 'koa-router'
// 引入koa的路由
import Redis from 'koa-redis'
// 分布式用户管理，不冲突
import nodeMailer from 'nodemailer'
// node操作邮箱工具
import User from '../dbs/models/users'
// 导入用户模板
import Passport from './utils/passport'
import Email from '../dbs/config'
import axios from './utils/axios'

// 写接口
// 创建一个路由对象
let router = new Router({
  // 路由地址前缀,所有这个文件里面创建的路由前缀都是prefix
  prefix: "/users"
})

// 获取redis的客户端
let Store = new Redis().client

// 注册接口
router.post("/signup", async (ctx) => {
  // 解构赋值
  const {
    username,
    password,
    email,
    code
  } = ctx.requst.body

  if (code) {
    // 从redis获取验证码
    // 判断验证码
    const saveCode = await Store.hget(`nodemail:${username}`, 'code')

    // 还要获取一个过期时间
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')

    // 把输入的验证码和获取到的验证码进行对比
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body={
          code: -1,
          msg : '验证码已过期，请重新尝试'
        }
      }
      return false
    } else {
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }

  // 如果说你的用户名在数据库中能查到
  // 就说明已存在用户
  let user = await User.find({
    username
  })

  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '已被注册'
    }
    return
  }

  // 通过验证码验证和用户名不存在数据库
  // 接下来把用户注册信息写入数据库

  let nuser = await User.create({
    username,
    password,
    email
  })

  // 写入数据库之后就要直接跳转到登录之后的页面
  if (nuser) {
    let res = await axios.post('/users/signin', {
      username,
      password
    })

    if (res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'error'
      }
    }
  } else {
    // 写入数据库失败
    // 就要返回注册失败
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})

  // 登录接口
  router.post('/signin', async (ctx, next) => {
    // 固定的写法
    return Passport.authenticate('local', function (err, user, info, status) {
      if (err) {
        ctx.body = {
          code: -1,
          msg: err
        }
      } else {
        if (user) {
          ctx.body = {
            code: 0,
            msg: '登录成功',
            user
          }
          return ctx.login(user)
        } else {
          ctx.body = {
            code: 1,
            msg: info
          }
        }
      }
    })(ctx, next)
  })

  // 验证码验证s
  router.post('/verify', async (ctx, next) => {
    let username = ctx.request.body.username
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    if (saveExpire && new Date().getTime() - saveExpire < 0) {
      ctx.body = {
        code: -1,
        msg: '验证请求过于频繁，1分钟内1次'
      }
      return false
    }
    // 发送验证码
    let transporter = nodeMailer.createTransport({
      service: 'qq',
      auth: {
        user: Email.smtp.user,
        pass: Email.smtp.pass
      }
    })
    // 要发送的验证码
    // 要接受的一些信息
    let ko = {
      code: Email.smtp.code(),
      expire: Email.smtp.expire(),
      email: ctx.request.body.email,
      user: ctx.request.body.username
    }
    // 邮件中要发送的内容
    let mailOptions = {
      from: `"认证邮件" <${Email.smtp.user}>`,
      to: ko.email,
      subject: '《GhostCat美团网》注册码',
      html: `您在《GhostCat美团网》中注册，您的邀请码是${ko.code}`
    }

    // 发送邮件
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error)
      } else {
        // 成功就存储验证码和过期时间和邮箱
        Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
      }
    })

    // 接口响应
    ctx.body = {
      code: 0,
      msg: '验证码已发送，有效期1分钟'
    }
  })
  // 用户退出
router.get('/exit', async (ctx, next) => {
  // 注销的动作
  await ctx.logout()
  // 判断是否成功注销掉
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})

// 获取用户信息
router.get('/getUser', async (ctx) => {
  // 检查是否是登录状态 passport定义的api isAuthenticated
  if (ctx.isAuthenticated()) {
    // 如果是登录状态，session中就一定有用户名
    const { username, email } = ctx.session.passport.user
    ctx.body = {
      user: username,
      email
    }
  } else {
    ctx.body = {
      user: '',
      email: ''
    }
  }
})

// 路由导出
// export default router
export default router

