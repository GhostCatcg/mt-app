// 数据库配置文件

export default {
    dbs: 'mongodb://127.0.0.1:27017/student',
    redis: {
        get host() {
            return '127.0.0.1'
        },
        get port() {
            return 6379
        }
    },
    smtp: {
        get host() {
            return 'smtp.qq.com'
        },
        get user() {
            return '1169518718@qq.com'
        },
        get pass() {
            return '授权码'
        },
        get code() {
            return () => {
                // 随机的验证码
                return Math.rendom().toString(16).slice(2, 6).toUpperCase()
            }
        },
        get expire() {
            // 过期时间
            return () => {
                return new Date().getTime() + 60 * 60 * 1000
            }
        }
    },
    
}