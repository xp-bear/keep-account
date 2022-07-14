<template>
  <div class="Account">
    <!-- 头部标题 -->
    <van-button type="primary" color="#e8e8e8" block class="title">生活记账</van-button>

    <!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item>
        <img src="//m15.360buyimg.com/mobilecms/s1062x420_jfs/t1/102522/29/23302/471300/621f1a74Ee5eb33e3/6b996cd7a38e97f5.png!cr_1053x420_4_0!q70.jpg" alt="" />
      </van-swipe-item>
      <van-swipe-item>
        <img src="//m15.360buyimg.com/mobilecms/jfs/t1/108595/21/17303/262085/5eb8badbE63787505/7467da98b3f3dacb.jpg!cr_1125x449_0_166!q70.jpg" alt="" />
      </van-swipe-item>
      <van-swipe-item>
        <img src="//m15.360buyimg.com/mobilecms/s1062x420_jfs/t1/102522/29/23302/471300/621f1a74Ee5eb33e3/6b996cd7a38e97f5.png!cr_1053x420_4_0!q70.jpg" alt="" />
      </van-swipe-item>
      <van-swipe-item>
        <img src="//m15.360buyimg.com/mobilecms/jfs/t1/108595/21/17303/262085/5eb8badbE63787505/7467da98b3f3dacb.jpg!cr_1125x449_0_166!q70.jpg" alt="" />
      </van-swipe-item>
    </van-swipe>
    <!-- 收入与支出选项 -->
    <div class="income">
      <van-button type="primary" color="#1bb5fe" :plain="!Boolean(incomeState == 0)" block size="small" @click="switchChangeIncome(0)">支出</van-button>
      <van-button type="primary" color="#1bb5fe" :plain="!Boolean(incomeState == 1)" block size="small" @click="switchChangeIncome(1)">收入</van-button>
    </div>
    <!-- 金额 -->
    <van-field class="money" placeholder="请输入金额!" label="金额:" label-width="0.8rem" readonly clickable :value="value | valueForamte" @touchstart.native.stop="money_show = true" />
    <van-number-keyboard v-model="value" title="金额数字键盘" extra-key="." :show="money_show" :maxlength="6" @blur="money_show = false" />

    <!-- 选择日期 -->
    <van-field class="clander" label="日期:" placeholder="请选择日期!" label-width="0.8rem" :value="date" @click="getCalendar" />
    <van-calendar v-model="calendar_show" :min-date="minDate" color="#1bb5fe" @confirm="onConfirm" />

    <!-- 选择时间 -->
    <van-field class="clander" label="时间:" placeholder="请选择时间!" label-width="0.8rem" :value="currentTime" @click="toGetTime" />
    <van-popup v-model="time_show" position="bottom" :style="{ height: '50%' }">
      <van-datetime-picker v-model="currentTime" type="time" title="选择时间" :min-hour="0" :max-hour="23" @confirm="timeConfirm" />
    </van-popup>

    <!-- 文本域输入框 autosize自动化高度 -->
    <van-field v-model="message" label-width="0.8rem" rows="3" label="备注:" type="textarea" maxlength="50" placeholder="请输入备注!" show-word-limit />
    <!-- 标签选项 -->
    <div class="tags">
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="!Boolean(tag_index == 0)" @click="changeTag(0)">服饰鞋帽</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="!Boolean(tag_index == 1)" @click="changeTag(1)">交通出行</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="!Boolean(tag_index == 2)" @click="changeTag(2)">食物小吃</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="!Boolean(tag_index == 3)" @click="changeTag(3)">学习提升</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="!Boolean(tag_index == 4)" @click="changeTag(4)">外出旅行</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="!Boolean(tag_index == 5)" @click="changeTag(5)">娱乐消费</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="!Boolean(tag_index == 6)" @click="changeTag(6)">其他项目</van-tag>
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
      message: "", //文本输入框(备注)
      value: "", //金额数字
      date: "", //记账日期
      calendar_show: false, //日期显示
      time_show: false,
      currentTime: "", //当前时间
      minDate: new Date(), //最小选择的时间
      incomeState: 0, //当前收入与支出的状态 0-支出  1-收入
      tag_index: 2, //标签标志位 0-服饰鞋帽 1-交通出行 2-食物小吃 3-学习提升 4-外出旅行 5-娱乐消费 6-其他项目
    };
  },
  mounted() {
    let time = new Date();
    // 获取年
    let year = time.getFullYear();
    // 获取月份
    let month = time.getMonth();
    // 获取天数
    let day = time.getDate();

    // console.log(year, month, day); //日期显示
    this.minDate = new Date(year, month - 1, day);
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
      // console.log("记账日期: ", this.date);
    },
    timeConfirm() {
      console.log(11);
      this.time_show = false;
    },
    // 提交按钮的回调函数
    onSubmit() {
      //向后端提交添加的数据
      console.log(this.value, this.date, this.currentTime, this.message, this.incomeState, this.tag_index);
      // 非空校验
      if (this.value.length <= 0) {
        return this.$toast.fail("金额为必填");
      } else if (this.date.length <= 0) {
        return this.$toast.fail("日期为必填");
      } else if (this.currentTime.length <= 0) {
        return this.$toast.fail("时间为必填");
      } else {
        //像接口发起添加数据的请求
        this.$axios
          .post("/account/add", {
            value: this.value,
            date: this.date,
            currentTime: this.currentTime,
            message: this.message,
            incomeState: this.incomeState,
            tag_index: this.tag_index,
          })
          .then((res) => {
            console.log(res.data);
            this.$toast.success({
              message: "添加成功",
              forbidClick: true,
              duration: "1000",
            });
          });
      }
    },
    // 当前时间
    toGetTime() {
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();

      this.time_show = true;
      this.currentTime = "" + hours + ":" + minutes;
    },
    //获取日期
    getCalendar() {
      this.calendar_show = true;
    },
    //收入与支出切换
    switchChangeIncome(value) {
      this.incomeState = value;
      console.log("收入状态:", this.incomeState);
    },

    // 标签切换
    changeTag(value) {
      this.tag_index = value;
      console.log("tag状态: ", this.tag_index);
      //  0-服饰鞋帽 1-交通出行 2-食物小吃 3-学习提升 4-外出旅行 5-娱乐消费 6-其他项目
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
    width: 7.5rem;
    margin: 0 auto;
    // left: 50%;
    position: static;
    // transform: translate(-50%);
    // bottom: 1.12rem;
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
    height: 3rem;
    text-align: center;
    // background-color: #39a9ed;
    img {
      // width: 7.5rem;
      height: 3rem;
    }
  }
}
</style>
