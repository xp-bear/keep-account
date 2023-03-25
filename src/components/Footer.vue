<template>
  <div class="Footer">
    <div class="iconfont icon-biaoqian footer" :class="current_index == 0 ? 'active' : ''" @click="redirectPage(0)"></div>
    <div class="iconfont icon-jinqian footer" :class="current_index == 1 ? 'active' : ''" @click="redirectPage(1)"></div>
    <div class="iconfont icon-tongji1 footer" :class="current_index == 2 ? 'active' : ''" @click="redirectPage(2)"></div>
    <div class="iconfont icon-guanliyuan_guanliyuanliebiao footer" :class="current_index == 3 ? 'active' : ''" @click="redirectPage(3)"></div>
  </div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      current_index: 0, //标志每一个tab栏位置
    };
  },
  mounted() {
    this.redirectPage(0); //默认加载的是记账页面
  },
  methods: {
    // 跳转每一个tab栏
    redirectPage(index) {
      // console.log("当前页面tab栏: ", index);
      this.current_index = index;

      //   页面切换
      if (index == 0) {
        this.$router.push({ path: "/" });
        this.current_index = 0;
      } else if (index == 1) {
        this.$router.push({ path: "/account" });
        this.current_index = 1;
      } else if (index == 2) {
        this.$router.push({ path: "/statistics" });
        this.current_index = 2;
      } else if (index == 3) {
        this.$router.push({ path: "/user" });
        this.current_index = 3;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.Footer {
  position: absolute;
  width: 100%;
  height: 1.12rem;
  bottom: 0;
  display: flex;
  align-items: center;
  border-top: 1px solid #ccc;
  box-shadow: 0 0 5px #ccc;
  z-index: 2;
  background-color: #fff;
  .footer {
    height: 100%;
    font-size: 0.64rem;
    flex: 1;
    text-align: center;
    line-height: 1.12rem;
  }
  .active {
    color: #1bb5fe;
    // background-color: #cccccc90;
  }
}
</style>
