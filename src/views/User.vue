<template>
  <div class="User">
    <!-- 时间选择器 -->
    <div class="time">
      <van-button color="#1bb5fe" type="primary" size="small" @click="start_show = true"> <van-icon name="ascending" /> 选择起始时间</van-button>
      <van-button color="#1bb5fe" type="primary" size="small" @click="end_show = true"> <van-icon name="descending" /> 选择结束时间</van-button>
    </div>
    <!-- 起始时间弹出层 -->
    <van-popup v-model="start_show" position="bottom" :style="{ height: '50%' }">
      <van-datetime-picker v-model="start_currentDate" @cancel="start_cancel" @confirm="start_confirm" type="date" title="选择年月日" :min-date="start_minDate" :max-date="start_maxDate" />
    </van-popup>

    <!--结束时间弹出层 -->
    <van-popup v-model="end_show" position="bottom" :style="{ height: '50%' }">
      <van-datetime-picker v-model="end_currentDate" @cancel="end_cancel" @confirm="end_confirm" type="date" title="选择年月日" :min-date="end_minDate" :max-date="end_maxDate" />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    return {
      start_minDate: new Date(2020, 0, 1),
      start_maxDate: new Date(2025, 10, 1),
      start_currentDate: new Date(), //双向绑定的时间
      start_show: false, //起始时间状态

      end_minDate: new Date(2020, 0, 1),
      end_maxDate: new Date(2025, 10, 1),
      end_currentDate: new Date(), //双向绑定的时间
      end_show: false,
    };
  },
  methods: {
    // 点击确认按钮
    start_confirm(value) {
      console.log(this.start_currentDate); //起始时间
      this.start_show = false;
    },
    start_cancel() {
      this.start_show = false;
    },
    end_confirm(value) {
      console.log(this.end_currentDate); //结束时间
      this.end_show = false;

      // 判断结束时间比起始时间大
      let start_tmp = Date.parse(this.start_currentDate); //將字符串格式日期转化为时间戳
      let end_tmp = Date.parse(this.end_currentDate); //將字符串格式日期转化为时间戳
      if (start_tmp > end_tmp) {
        this.$toast({
          type: "fail",
          duration: "2000",
          message: "选择时间范围有误",
        });
      }
      
    },
    end_cancel() {
      this.end_show = false;
    },
  },
};
</script>

<style lang="less" scoped>
.User {
  .time {
    display: flex;
    justify-content: space-between;
    .van-button {
      width: 50%;
      border: 0;
    }
  }
}
</style>
