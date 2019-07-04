<template>
  <div class="page-register">
    <article class="header">
      <header>
        <a href="/" class="site-logo" />
        <span class="login">
          <em class="bold">已有美团账号？</em>
          <a href="/login">
            <el-button type="primary" size="small">登录</el-button>
          </a>
        </span>
      </header>
    </article>
    <section>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="昵称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" />
          <el-button size="mini" round @click="sendMsg">发送验证码</el-button>
          <span class="status">{{ statusMsg }}</span>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm.code" maxlength="4" />
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="ruleForm.pwd" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="cpwd">
          <el-input v-model="ruleForm.cpwd" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register">同意以下协议并注册</el-button>
          <div class="error">{{ error }}</div>
        </el-form-item>
        <el-form-item>
          <a class="f1" href="http://www.meituan.com/about/terms" target="_blank">《美团网用户协议》</a>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
// 加密方式
import CryptoJS from "crypto-js";
export default {
  data() {
    return {
      statusMsg: "",
      error: "",
      ruleForm: {
        name: "",
        code: "",
        pwd: "",
        cpwd: "",
        email: ""
      },
      rules: {
        // 饿了么组件表单验证的规则
        name: [
          {
            required: true,
            type: "string",
            message: "请输入昵称",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            type: "email",
            message: "请输入邮箱",
            trigger: "blur"
          }
        ],
        pwd: [
          {
            required: true,
            message: "创建密码",
            trigger: "blur"
          }
        ],
        cpwd: [
          {
            required: true,
            message: "确认密码",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入密码"));
              } else if (value !== this.ruleForm.pwd) {
                callback(new Error("两次输入密码不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  layout: "blank",
  methods: {
    sendMsg: function() {
      const self = this;
      let namePass
      let emailPass
      // timerid是验证码计时器
      if (self.timerid) {
        return false
      }
      // 获取当前ruleform对象
      //
      this.$refs['ruleForm'].validateField('name', (valid) => {
        namePass = valid
      })
      // 如果通过了就清空报错
      self.statusMsg = ''
      if (namePass) {
      // 如果名称没有通过，就不往下执行了
        return false
      }
      this.$refs['ruleForm'].validateField('email', (valid) => {
        // 饿了么UI提供的api
        emailPass = valid
      })
      if (!namePass && !emailPass) {
        // 用户名和邮箱都通过
        // nuxt.config - modules 已经引入axios
        self.$axios.post('/users/verify', {
          // encode 对中文进行编码
          username: window.encodeURIComponent(self.ruleForm.name),
          email: self.ruleForm.email
        }).then(({
          // then回调
          status,
          data
        }) => {
          // 判断接口状态是不是200和data是否存在和code是否为0
          if (status === 200 && data && data.code === 0) {
            // 倒计时
            let count = 60;
            self.statusMsg = `验证码已发送,剩余${count--}秒`
            // 倒计时定时器
            self.timerid = setInterval(function () {
              self.statusMsg = `验证码已发送,剩余${count--}秒`
              if (count === 0) {
                // 等于0 就清空验证码剩余时间
                clearInterval(self.timerid)
              }
            }, 1000)
          } else {
            // 报错信息返回
            self.statusMsg = data.msg
          }
        })
      }
    },
    register: function() {
      let self = this;
      // 校验函数
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          // 发起注册接口
          self.$axios.post('/users/signup', {
            username: window.encodeURIComponent(self.ruleForm.name),
            // 对密码进行加密
            password: CryptoJS.MD5(self.ruleForm.pwd).toString(),
            email: self.ruleForm.email,
            code: self.ruleForm.code
          }).then(({
            status,
            data
          }) => {
            if (status === 200) {
              if (data && data.code === 0) {
                // 成功就跳转到登录
                location.href = '/login'
              } else {
                self.error = data.msg
              }
            } else {
              // 报错信息
              self.error = `服务器出错，错误码:${status}`
            }
            // 定时清空error信息
            setTimeout(function () {
              self.error = ''
            }, 1500)
          })
        }
      })
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/register/index.scss";
</style>
