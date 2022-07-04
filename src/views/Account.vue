<template>
  <div class="Account">
    <!-- 头部标题 -->
    <van-button type="primary" color="#e8e8e8" block class="title">生活记账</van-button>

    <!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item>1</van-swipe-item>
      <van-swipe-item>2</van-swipe-item>
      <van-swipe-item>3</van-swipe-item>
      <van-swipe-item>4</van-swipe-item>
    </van-swipe>
    <!-- 收入与支出选项 -->
    <div class="income">
      <van-button type="primary" color="#1bb5fe" :plain="false" block size="small">支出</van-button>
      <van-button type="primary" color="#1bb5fe" :plain="true" block size="small">收入</van-button>
    </div>
    <!-- 金额 -->
    <van-field class="money" placeholder="请输入金额!" label="金额:" label-width="0.8rem" readonly clickable :value="value | valueForamte" @touchstart.native.stop="money_show = true" />
    <van-number-keyboard v-model="value" title="金额数字键盘" extra-key="." :show="money_show" :maxlength="6" @blur="money_show = false" />

    <!-- 选择日期 -->
    <van-field class="clander" label="日期:" placeholder="请选择日期!" label-width="0.8rem" :value="date" @click="calendar_show = true" />
    <van-calendar v-model="calendar_show" color="#1bb5fe" @confirm="onConfirm" />

    <!-- 选择时间 -->
    <van-field class="clander" label="时间:" placeholder="请选择时间!" label-width="0.8rem" :value="currentTime" @click="toGetTime" />
    <van-popup v-model="time_show" position="bottom" :style="{ height: '50%' }">
      <van-datetime-picker v-model="currentTime" type="time" title="选择时间" :min-hour="0" :max-hour="23" @confirm="timeConfirm" />
    </van-popup>

    <!-- 文本域输入框 autosize自动化高度 -->
    <van-field v-model="message" label-width="0.8rem" rows="3" label="备注:" type="textarea" maxlength="50" placeholder="请输入备注!" show-word-limit />
    <!-- 标签选项 -->
    <div class="tags">
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="true">服饰鞋帽</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="true">交通出行</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="false">食物小吃</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="true">学习提升</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="true">外出旅行</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="true">娱乐消费</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="true">其他项目</van-tag>
    </div>

    <!-- 确认按钮 -->
    <van-submit-bar button-text="确认添加" @submit="onSubmit" button-color="#39a9ed" />
  </div>
</template>

<script>
export default {
  name: "Account",
  data() {
    return {
      money_show: false, //数字输入键盘显示
      message: "", //文本输入框
      value: "", //金额数字
      date: "", //记账日期
      calendar_show: false, //日期显示
      time_show: false,
      currentTime: "", //当前时间
    };
  },
  mounted() {
    // let date = new Date();
    // // 获取到当前的时间
    // this.onConfirm(date);
  },
  methods: {
    // 格式化日期
    formatDate(date) {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
    // 日期确定
    onConfirm(date) {
      this.calendar_show = false;
      this.date = this.formatDate(date);
      console.log("记账日期: ", this.date);
    },
    timeConfirm() {
      console.log(11);
      this.time_show = false;
    },
    // 提交按钮的回调函数
    onSubmit() {
      this.$toast.success({
        message: "添加成功",
        forbidClick: true,
        duration: "1000",
      });
    },
    // 当前时间
    toGetTime() {
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();

      this.time_show = true;
      this.currentTime = "" + hours + ":" + minutes;
    },
  },
  // 过滤器
  filters: {
    valueForamte(value) {
      if (value.length > 0) {
        return "¥ " + value;
      } else {
        return "";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.Account {
  .van-submit-bar {
    bottom: 1.12rem;
  }
  .van-submit-bar__button {
    width: 3.75rem;
  }
  .van-submit-bar {
    z-index: 1;
  }
  .title {
    .van-button__text {
      color: black;
    }
  }
  .money {
    .van-field__control {
      color: red !important;
    }
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    padding: 0 0.1rem;
    justify-content: center;
    .van-tag {
      margin-bottom: 0.2rem;
      margin-right: 0.2rem;
    }
  }
  .income {
    display: flex;
    // margin-top: 0.2rem;

    .van-button {
      border-radius: 0;
    }
    .van-button__text {
      font-size: 0.32rem;
    }
  }
  .confirm_button {
    margin-top: 0.2rem;
  }
  .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 0.4rem;
    line-height: 3rem;
    text-align: center;
    background-color: #39a9ed;
  }
}
</style>
