<template>
  <el-container class="layout-default">
    <el-header height="197px">
      <my-header/>
    </el-header>
    <el-main>
      <nuxt/>
    </el-main>
    <el-footer height="100%">
      <my-footer/>      
    </el-footer>
  </el-container>
</template>

<script>
  // 此页面为默认路由首页 相当于app.vue
  import MyHeader from '@/components/public/header/index.vue'
  import MyFooter from '@/components/public/footer/index.vue'
  export default {
    components:{
      MyHeader,
      MyFooter
    }
  }
</script>
