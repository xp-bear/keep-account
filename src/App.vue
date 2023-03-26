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
  src: url("http://cdn.xxoutman.cn/two.ttf");
}

// 自定义字体
@font-face {
  font-family: consolas;
  src: url("http://cdn.xxoutman.cn/one.ttf");
}

// 自定义字体
@font-face {
  font-family: siyuan;
  src: url("http://cdn.xxoutman.cn/siyuan.ttf");
}
</style>
