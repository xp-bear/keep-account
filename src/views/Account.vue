<template>
  <div class="Account">
    <!-- 头部标题 -->
    <van-button type="primary" color="#e8e8e8" block class="title">生活记账</van-button>

    <!-- 收入与支出选项 -->
    <div class="income">
      <van-button
        icon="http://cdn.xxoutman.cn/pay-1679804063180.png?1679804063362"
        type="primary"
        color="#1bb5fe"
        hairline
        :plain="!Boolean(incomeState == 0)"
        block
        size="small"
        @click="switchChangeIncome(0)"
      >
        支出
      </van-button>
      <van-button
        icon="http://cdn.xxoutman.cn/income-1679804092077.png?1679804092248"
        type="primary"
        color="#1bb5fe"
        hairline
        :plain="!Boolean(incomeState == 1)"
        block
        size="small"
        @click="switchChangeIncome(1)"
      >
        收入
      </van-button>
    </div>

    <!-- 金额 -->
    <van-cell
      class="money"
      placeholder="请输入金额!"
      title="输入金额"
      value="金额为必填项"
      label-width="1.2rem"
      readonly
      clickable
      :value="value | valueForamte"
      @touchstart.native.stop="money_show = true"
    />
    <van-number-keyboard v-model="value" title="金额数字键盘" extra-key="." :show="money_show" :maxlength="6" @blur="money_show = false" />

    <!-- 选择日期 -->
    <van-cell class="clander" title="选择日期" placeholder="请选择日期!" label-width="0.8rem" :value="date" @click="getCalendar" />
    <van-calendar v-model="calendar_show" :min-date="minDate" color="#1bb5fe" @confirm="onConfirm" />

    <!-- 选择时间 -->
    <van-cell class="clander" title="选择时间" placeholder="请选择时间!" label-width="0.8rem" :value="currentTime" @click="toGetTime" />
    <van-popup v-model="time_show" position="bottom" :style="{ height: '50%' }">
      <van-datetime-picker v-model="currentTime" type="time" title="选择时间" :min-hour="0" :max-hour="23" @confirm="timeConfirm" @cancel="timeCanel" />
    </van-popup>

    <!-- 文本域输入框 autosize自动化高度 -->
    <van-field v-model="message" label-width="0.8rem" rows="3" label="备注:" type="textarea" maxlength="50" placeholder="请输入备注!" show-word-limit />
    <!--支出 标签选项 -->
    <div class="tags" v-show="incomeState == 0">
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="!Boolean(tag_index == 0)" @click="changeTag(0)">服饰鞋帽</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="!Boolean(tag_index == 1)" @click="changeTag(1)">交通出行</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="!Boolean(tag_index == 2)" @click="changeTag(2)">食物小吃</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="!Boolean(tag_index == 3)" @click="changeTag(3)">学习提升</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="!Boolean(tag_index == 4)" @click="changeTag(4)">外出旅行</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="!Boolean(tag_index == 5)" @click="changeTag(5)">娱乐消费</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="!Boolean(tag_index == 6)" @click="changeTag(6)">其他项目</van-tag>
    </div>

    <!-- 收入 标签选项 -->
    <div class="tags" v-show="incomeState == 1">
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="!Boolean(tag_index == 0)" @click="changeTag(0)">工资薪金</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="!Boolean(tag_index == 1)" @click="changeTag(1)">劳务报酬</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="!Boolean(tag_index == 2)" @click="changeTag(2)">偶然所得</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="!Boolean(tag_index == 3)" @click="changeTag(3)">企业红利</van-tag>
      <van-tag type="primary" color="#1bb5fe" size="large" :plain="!Boolean(tag_index == 4)" @click="changeTag(4)">其他项目</van-tag>
    </div>

    <!-- 确认按钮 -->
    <van-submit-bar button-text="确认添加" :price="+this.value * 100" @submit="onSubmit" button-color="#39a9ed" class="confirm" />
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
      date: this.formatDate(new Date()), //记账日期
      dateMonth: this.formatMonth(new Date()), //记账月份
      calendar_show: false, //日期显示面板
      time_show: false, //时间显示面板
      currentTime: this.formatTime(new Date()), //当前时间
      minDate: new Date(), //最小选择的时间
      incomeState: 0, //当前收入与支出的状态 0-支出  1-收入
      tag_index: 0, //(收入与支出)标签标志位 0-服饰鞋帽 1-交通出行 2-食物小吃 3-学习提升 4-外出旅行 5-娱乐消费 6-其他项目
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

    this.minDate = new Date(year, month - 1, day);
    // console.log(this.minDate); //日期显示
  },
  methods: {
    // 格式化月份
    formatMonth(date) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      return `${year}/${month}`;
    },
    // 格式化日期
    formatDate(date) {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
    // 格式化时间
    formatTime(date) {
      return `${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
    },
    // 日期确定
    onConfirm(date) {
      this.calendar_show = false;
      this.date = this.formatDate(date);
      this.dateMonth = this.$dayjs(this.date).format("YYYY/MM");
      console.log("记账日期: ", this.dateMonth);
    },
    timeConfirm() {
      this.time_show = false;
    },
    timeCanel() {
      this.time_show = false;
    },
    // 提交按钮的回调函数
    onSubmit() {
      //向后端提交添加的数据
      /**
       * this.value 金额
       * this.incomeState 收入与支出 0-支出 1-收入
       * this.tag_index 消费与收入标签: 0-服饰鞋帽
       * this.date 数据创建时间 2023/2/23
       * this.message 数据备注信息
       * dateMonth: 数据所属的月份 2023/03
       * this.currentTime :  当前时间 19:30
       */
      // console.log(this.dateMonth, this.value, this.incomeState, this.tag_index, this.date, this.currentTime, this.message);
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
            record_state: this.incomeState,
            record_tag: this.tag_index,
            record_create_time: this.date,
            record_comment: this.message,
            record_money: this.value,
            record_date: this.dateMonth,
            record_time: this.currentTime,
          })
          .then((res) => {
            // 清空数据
            this.value = "";
            this.message = "";
            this.tag_index = 0;
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
      // 重置标签状态
      this.tag_index = 0;
      this.incomeState = value;
      // console.log("收入状态:", this.incomeState);
    },

    // 标签切换
    changeTag(value) {
      this.tag_index = value;
      // console.log("tag状态: ", this.tag_index);
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
  position: relative;
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
    // display: flex;
    // flex-wrap: wrap;
    // padding: 0 0.1rem;
    // justify-content: center;
    padding-left: 0.5rem;
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
  .confirm {
    position: fixed;
    margin: 0 auto;
    left: 50%;
    transform: translateX(-50%);
    bottom: 1.44rem;
  }
}
</style>
