<template>
  <div class="Tag">
    <!-- 头部标题 -->
    <van-button type="primary" color="#e8e8e8" block class="title">记录查询</van-button>

    <!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item>
        <img src="http://cdn.xxoutman.cn/image-1679842151298.png?1679842151834" alt="" style="width: 100%; object-fit: cover" />
      </van-swipe-item>
      <van-swipe-item>
        <img src="http://cdn.xxoutman.cn/image-1679842135181.png?1679842135368" alt="" style="width: 100%; object-fit: cover" />
      </van-swipe-item>
      <van-swipe-item>
        <img src="http://cdn.xxoutman.cn/image-1679842085405.png?1679842085631" alt="" style="width: 100%; object-fit: cover" />
      </van-swipe-item>
      <van-swipe-item>
        <img src="http://cdn.xxoutman.cn/image-1679842048569.png?1679842049064" alt="" style="width: 100%; object-fit: cover" />
      </van-swipe-item>
    </van-swipe>

    <!-- 标题选项 -->
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

    <!-- 查询日期选择 -->
    <van-cell title="按日期查询" :value="selectDate" @click="selectDateShow = true" is-link />
    <van-calendar color="#1bb5fe" v-model="selectDateShow" @confirm="onConfirm" :min-date="new Date('2023/1/1')" />

    <!-- 查询日期消费金额 -->
    <van-collapse v-model="activeNames" v-if="selectDate">
      <van-collapse-item icon="shop-o">
        <template #title>
          <div style="display: flex; justify-content: space-between; align-items: center; vertical-align: bottom">
            <span style="letter-spacing: 0.012em; line-height: 0.48rem">{{ selectDate }}</span>
            <span v-show="incomeState == 0" style="color: red; font-weight: 700">总消费: <van-icon name="balance-o" size="16" />{{ totalMoney }}</span>
            <span v-show="incomeState == 1" style="color: green; font-weight: 700">总收入: <van-icon name="balance-o" size="16" />{{ totalMoney }}</span>
          </div>
        </template>
        <ul class="detail">
          <li v-for="item in datas" :key="item.record_id" @click="changeActionPanel(item)">
            <span>{{ tagValue(item.record_tag) }}</span>
            <span>{{ item.record_time }}</span>
            <span>{{ item.record_comment }}</span>
            <span style="width: 20%">¥ {{ item.record_money }}</span>
          </li>
        </ul>
      </van-collapse-item>
    </van-collapse>

    <!-- 按月份查询 -->
    <van-cell title="按月份查询" :value="selectMonth" @click="monthPanelState = true" is-link />
    <van-popup v-model="monthPanelState" position="bottom" :style="{ height: '50%' }">
      <van-datetime-picker v-model="currentDate" @cancel="month_cancel" @confirm="month_confirm" type="year-month" title="选择月份" :min-date="minDate" :max-date="maxDate" :formatter="formatter" />
    </van-popup>

    <!-- 月份查询 -->
    <van-collapse v-model="activeMonthNames" v-if="selectMonth" style="padding-bottom: 1.12rem">
      <van-collapse-item icon="shop-o" v-for="(value, key) in monthDatas" :index="key">
        <template #title>
          <div style="display: flex; justify-content: space-between; align-items: center; vertical-align: bottom">
            <span style="letter-spacing: 0.012em; line-height: 0.48rem">{{ timeFormat(key) }}</span>
            <span v-show="incomeState == 0" style="color: red; font-weight: 700">总消费: <van-icon name="balance-o" size="16" />{{ value[value.length - 1] }}</span>
            <span v-show="incomeState == 1" style="color: green; font-weight: 700">总收入: <van-icon name="balance-o" size="16" />{{ value[value.length - 1] }}</span>
          </div>
        </template>
        <ul class="detail">
          <li v-for="(item, index) in value" :key="item.record_id" @click="changeActionPanel(item)">
            <template v-if="index < value.length - 1">
              <span>{{ tagValue(item.record_tag) }}</span>
              <span>{{ item.record_time }}</span>
              <span>{{ item.record_comment }}</span>
              <span style="width: 20%">¥ {{ item.record_money }}</span>
            </template>
          </li>
        </ul>
      </van-collapse-item>
    </van-collapse>

    <!-- 动作面板 -->
    <van-action-sheet v-model="ActionShow" :actions="actions" @select="onSelect" description="是否要删除当前该条记录？" cancel-text="取消" />
  </div>
</template>

<script>
export default {
  name: "Tag",
  components: {},
  data() {
    return {
      activeNames: ["0"],
      activeMonthNames: [""],
      totalMoney: 0, //每一天金额的统计总数.
      datas: [], //每一天的消费查询
      selectDate: "", //选择查询的日期
      selectDateShow: false, //是否展示日历面板
      incomeState: 0, //收入与支出状态 0-支出 1-收入
      // 月份
      minDate: new Date(2023, 0, 1),
      maxDate: new Date(2030, 11, 30),
      currentDate: "",
      monthPanelState: false, //月份面板状态
      selectMonth: "", //选择的月份 2023/11月
      monthDatas: {}, //当前月份数据

      ActionShow: false, //动作面板展开状态。
      actions: [{ name: "删除该条记录", color: "#ee0a24" }],
      dataOnce: {}, //一条数据
    };
  },
  mounted() {
    this.getInitData();
  },
  methods: {
    // 请求初始数据
    getInitData() {
      this.selectDate = this.formatDate(new Date());
      // 请求查询的时间
      this.$axios.get(`/account/searchday?date=${this.selectDate}&flag=${this.incomeState}`).then((res) => {
        this.datas = res.data;

        this.date = this.$dayjs(res.data[0]?.record_create_time).format("YYYY-MM-DD"); //处理时间格式
        res.data.forEach((item) => {
          this.totalMoney += +item.record_money;
        });
      });
    },
    changeActionPanel(item) {
      this.dataOnce = item;
      this.ActionShow = true;
    },
    onSelect() {
      // console.log(this.dataOnce);
      this.ActionShow = false;
      // 调用接口删除数据
      this.$axios.post("/account/delete", { record_id: this.dataOnce.record_id }).then((res) => {
        this.$toast.success({
          message: "删除成功",
          forbidClick: true,
          duration: "1000",
        });
        this.selectDate = ""; //选择日期置为空。
        this.selectMonth = ""; //选择月份置为空。
        this.totalMoney = 0;
        this.getInitData();
      });
    },
    month_cancel() {
      this.monthPanelState = false;
    },
    month_confirm() {
      this.selectMonth = this.$dayjs(this.currentDate).format("YYYY/MM");
      // console.log(this.selectMonth); //月份
      this.monthPanelState = false;

      // 请求查询的月份
      this.$axios.get(`/account/searchmonth?monthdata=${this.selectMonth}&flag=${this.incomeState}`).then((res) => {
        this.monthDatas = res.data;

        for (let key in this.monthDatas) {
          let totalMoney = 0;
          this.monthDatas[key].forEach((item) => {
            totalMoney += +item.record_money;
          });
          this.monthDatas[key].push(totalMoney);
        }
      });
    },
    // 选择月份
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      }
      return val;
    },
    //收入与支出切换
    switchChangeIncome(value) {
      this.selectDate = ""; // 重置查询的日期
      this.selectMonth = ""; //重置查询的月份
      this.totalMoney = 0; //初始金额为0
      this.incomeState = value; //赋值操作
      this.getInitData();
    },
    formatDate(date) {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
    // 重新选择时间
    onConfirm(date) {
      this.totalMoney = 0; //总金额重新设置为0
      this.selectDateShow = false;
      this.selectDate = this.formatDate(date);
      // console.log("确定的时间:", this.selectDate);
      // 请求查询的时间
      this.$axios.get(`/account/searchday?date=${this.selectDate}&flag=${this.incomeState}`).then((res) => {
        this.datas = res.data;
        if (this.datas.length <= 0) {
          this.activeNames = ["0"];
        } else {
          this.activeNames = ["1"];
        }
        this.date = this.$dayjs(res.data[0]?.record_create_time).format("YYYY-MM-DD"); //处理时间格式
        res.data.forEach((item) => {
          this.totalMoney += +item.record_money;
        });
      });
    },
    // 标签过滤器
    tagValue(value) {
      let tag = "";
      if (this.incomeState == 0) {
        switch (value) {
          case 0:
            tag = "服饰鞋帽";
            break;
          case 1:
            tag = "交通出行";
            break;
          case 2:
            tag = "食物小吃";
            break;
          case 3:
            tag = "学习提升";
            break;
          case 4:
            tag = "外出旅行";
            break;
          case 5:
            tag = "娱乐消费";
            break;
          case 6:
            tag = "其他项目";
            break;
        }
      } else {
        switch (value) {
          case 0:
            tag = "工资薪金";
            break;
          case 1:
            tag = "劳务报酬";
            break;
          case 2:
            tag = "食物小吃";
            break;
          case 3:
            tag = "偶然所得";
            break;
          case 4:
            tag = "企业红利";
            break;
          case 5:
            tag = "其他项目";
            break;
        }
      }
      return tag;
    },
    // 时间格式化处理
    timeFormat(time) {
      return this.$dayjs(time).format("YYYY-MM-DD");
    },
  },
};
</script>
<style lang="less" scoped>
.Tag {
  // 轮播图
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
  .title {
    .van-button__text {
      color: black;
    }
  }
  .income {
    display: flex;
    .van-button {
      border-radius: 0;
    }
    .van-button__text {
      font-size: 0.32rem;
    }
  }
  .time {
    display: flex;
    justify-content: space-between;
    .van-button {
      width: 50%;
      border: 0;
    }
  }
  .consumer {
    width: 7.5rem;
    li {
      height: 0.8rem;
      background-color: pink;
    }
  }
  .detail {
    li {
      display: flex;
      span {
        &:nth-child(1) {
          width: 20%;
        }
        &:nth-child(2) {
          width: 20%;
        }
        &:nth-child(3) {
          width: 45%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:nth-child(4) {
          width: 15%;
          padding-left: 0.1rem;
        }
      }
    }
  }
}
</style>
