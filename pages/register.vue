<template>
  <div class="page-register">
    <article class="header">
      <header>
        <a href="/" class="site-logo"></a>
        <span class="login">
          <em class="blod">已有美团账号？</em>
          <a href="/login">
            <el-button type="primary" size="small">登录</el-button>
          </a>
        </span>
      </header>
    </article>
    <section>
      <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
        <el-form-item label="昵称" prop="name">
          <el-input v-model="sizeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
            <el-button size="mini" round @send="sendMsg">发送验证码</el-button>
            <span class="status">{{statusMsg}}</span>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="sizeForm.date1"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker placeholder="选择时间" v-model="sizeForm.date2" style="width: 100%;"></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="活动性质">
          <el-checkbox-group v-model="sizeForm.type">
            <el-checkbox-button label="美食/餐厅线上活动" name="type"></el-checkbox-button>
            <el-checkbox-button label="地推活动" name="type"></el-checkbox-button>
            <el-checkbox-button label="线下主题活动" name="type"></el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源">
          <el-radio-group v-model="sizeForm.resource" size="medium">
            <el-radio border label="线上品牌商赞助"></el-radio>
            <el-radio border label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
export default {
  // 可以更换模板
  data(){
      return {
          statusMsg:"",
      }
  },
  layout: "blank",
  methods:{
      sendMsg:function(){

      },
  }
};
</script>

<style lang="scss">
@import "@/assets/css/register/index.scss";
</style>
