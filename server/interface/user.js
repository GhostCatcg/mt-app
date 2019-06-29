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
import axios form './utils/axios'