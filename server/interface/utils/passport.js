import passport from 'koa-passport'  // passport 
import LocalStrategy from 'passport-local'
import UserModel from '../../dbs/models/users'
// 注册8-3
passport.use(new LocalStrategy(async function (username, password, done) {
	let where = {
		username
	}
	let result = await UserModel.findOne(where)
	if (result != null) {
		if (result.password === password) {
			return done(null, result)
		} else {
			return done(null, false, '密码错误')
		}
	} else {
		return done(null, false, '用户不存在')
	}
}))

// 通过session验证
passport.serializeUser(function (user, done) {
	done(null, user)
})
// 序列化
passport.deserializeUser(function (user, done) {
	return done(null, user)
})

export default passport 
