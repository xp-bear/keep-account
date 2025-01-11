<template>
  <div id="app">
    <router-view />
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "@/components/Footer.vue";
export default {
  name: "App",
  mounted() {},
  components: {
    Footer,
  },
};
</script>

<style lang="less">
#app {
  position: relative;
  width: 7.5rem;
  min-height: 100vh;
  margin: 0 auto;
  box-sizing: border-box;
  font-size: 0.32rem;
}
// 自定义字体
@font-face {
  font-family: xp;
  src: url("https://xp-cdn-oss.oss-cn-wuhan-lr.aliyuncs.com/common/consolas.ttf");
}

// 自定义字体
@font-face {
  font-family: consolas;
  src: url("https://xp-cdn-oss.oss-cn-wuhan-lr.aliyuncs.com/common/consolas.ttf");
}

// 自定义字体
@font-face {
  font-family: siyuan;
  src: url("https://xp-cdn-oss.oss-cn-wuhan-lr.aliyuncs.com/common/consolas.ttf");
}
// 自定义字体
@font-face {
  font-family: digital;
  src: url("https://xp-cdn-oss.oss-cn-wuhan-lr.aliyuncs.com/common/digital.ttf");
}
</style>
