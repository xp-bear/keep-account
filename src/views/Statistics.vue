<template>
  <div class="Statistics">
    <!-- 头部标题 -->
    <!-- <van-button type="primary" color="#e8e8e8" block class="title">统计分析</van-button> -->

    <!-- 收入与支出选项 -->
    <div class="income">
      <van-button
        icon="https://xp-cdn-oss.oss-cn-wuhan-lr.aliyuncs.com/cookies/1手续费-1736610464903.png?1736610466761"
        type="primary"
        color="#de3126"
        hairline
        :plain="!Boolean(incomeState == 0)"
        block
        size="small"
        @click="switchChangeIncome(0)"
      >
        支出
      </van-button>
      <van-button
        icon="https://xp-cdn-oss.oss-cn-wuhan-lr.aliyuncs.com/cookies/总收入-1736610447466.png?1736610450995"
        type="primary"
        color="#52d181"
        hairline
        :plain="!Boolean(incomeState == 1)"
        block
        size="small"
        @click="switchChangeIncome(1)"
      >
        收入
      </van-button>
    </div>

    <!-- 选择器 -->
    <van-cell title="选择分析的月份" :value="selectMonth" @click="monthPanelState = true" is-link />
    <van-popup v-model="monthPanelState" position="bottom" :style="{ height: '50%' }">
      <van-datetime-picker v-model="currentDate" @cancel="month_cancel" @confirm="month_confirm" type="year-month" title="选择月份" :min-date="minDate" :max-date="maxDate" :formatter="formatter" />
    </van-popup>

    <!-- 展示该月收入与支出的结果。 -->
    <div class="pay" v-show="incomeState == 0">
      <div class="pay-title">本月支出</div>
      <div style="display: flex; justify-content: space-evenly; margin-top: 0.1rem">
        <div class="pay-info">
          <span>共计支出</span>
          <span>¥{{ formatMoneyTwo(accountTotalMoney) }}</span>
        </div>
        <div class="pay-info">
          <span>记账笔数</span>
          <span>{{ accountNumber }}条</span>
        </div>
        <div class="pay-info">
          <span>日均支出</span>
          <span>¥{{ dayIncome(accountTotalMoney, this.$dayjs(new Date()).format("D")) }}</span>
        </div>
      </div>
    </div>
    <div class="pay" v-show="incomeState == 1">
      <div class="pay-title">本月收入</div>
      <div style="display: flex; justify-content: space-evenly; margin-top: 0.1rem">
        <div class="pay-info">
          <span>共计收入</span>
          <span>¥{{ formatMoneyTwo(accountTotalMoney) }}</span>
        </div>
        <div class="pay-info">
          <span>记账笔数</span>
          <span>{{ accountNumber }}条</span>
        </div>
        <div class="pay-info">
          <span>日均收入</span>
          <span>¥{{ dayIncome(accountTotalMoney, 30) }}</span>
        </div>
      </div>
    </div>
    <!-- 画图 -->
    <div ref="drawLine" style="width: 7.5rem; height: 6rem"></div>
    <div ref="drawPie" style="width: 7.5rem; height: 6rem"></div>
  </div>
</template>

<script>
import { formatMoneyTwo } from "../utils/tools";
export default {
  name: "Statistics",
  data() {
    return {
      monthPanelState: false, //默认月份面板没有展开。
      selectMonth: "", //选择的月份 2023/11月
      minDate: new Date(2025, 0, 1),
      maxDate: new Date(2030, 11, 30),
      currentDate: "", //选中的时间格式
      monthDatas: {}, //请求回来的月份数据
      incomeState: 0, //0-支出 1-收入。
      lineChartX: [], //折线图x轴数据集合
      lineChartY: [], //折线图y轴数据集合

      pieDatas: [], //饼图数据集合

      accountNumber: 0, //记账笔数
      accountTotalMoney: 0, //记账总金额
      userinfo: "", //个人信息
    };
  },
  mounted() {
    // 获取当前用户所属ID。
    this.userinfo = JSON.parse(localStorage.getItem("UserInfo")) || {};

    // 选择默认的月份
    this.selectMonth = this.$dayjs(new Date()).format("YYYY/MM");

    // 请求数据
    this.getData();
    this.getPieData();

    setTimeout(() => {
      this.drawLine(); //折线图
      this.drawPie(); //饼图
    }, 300);
  },
  methods: {
    formatMoneyTwo,
    // 收入与支出金额显示
    dayIncome(money, number) {
      return number == 0 ? 0 : (money / number).toFixed(2);
    },
    //收入与支出切换
    switchChangeIncome(value) {
      this.incomeState = value;
      // console.log("支出与收入状态:", this.incomeState);
      // 重置选择的时间
      this.currentDate = new Date();
      this.accountNumber = 0;
      this.accountTotalMoney = 0;
      this.month_confirm();
    },
    // 请求数据
    getData() {
      this.lineChartX = [];
      this.lineChartY = [];
      // 请求查询的月份
      this.$axios.get(`/account/searchmonth?monthdata=${this.selectMonth}&flag=${this.incomeState}&ownerid=${this.userinfo.user_id}`).then((res) => {
        this.monthDatas = res.data;
        // console.log(this.monthDatas);
        let counter = 0; //统计记账笔数
        let total = 0; //记账总金额
        for (let key in this.monthDatas) {
          this.lineChartX.push(this.$dayjs(key).format("MM/DD"));
          let totalMoney = 0;
          this.monthDatas[key].forEach((item) => {
            totalMoney += +item.record_money;
            counter += 1; //记账笔数+1
            total += +item.record_money; //增加每一笔记账的金额
          });
          this.lineChartY.push(Math.round(totalMoney * 100) / 100);
          this.accountNumber = counter;
          this.accountTotalMoney = total;
          // console.log("记账笔数: ", this.accountNumber, this.accountTotalMoney);
        }
      });
    },

    // 请求饼图数据
    getPieData() {
      this.$axios.get(`/account/searchpie?monthdata=${this.selectMonth}&flag=${this.incomeState}&ownerid=${this.userinfo.user_id}`).then((res) => {
        this.pieDatas = res.data;
      });
    },
    month_cancel() {
      this.monthPanelState = false;
    },
    month_confirm() {
      this.selectMonth = this.$dayjs(this.currentDate).format("YYYY/MM");
      // console.log(this.currentDate, this.selectMonth); //月份
      this.monthPanelState = false;
      // 重置金额
      this.accountNumber = 0;
      this.accountTotalMoney = 0;

      // 重新请求数据
      this.getData();
      this.getPieData();

      setTimeout(() => {
        // 重新绘制图
        this.drawLine(); //折线图
        this.drawPie(); //饼图
      }, 300);
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

    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const chart = this.$refs.drawLine;
      let drawLineChart = this.$echarts.init(chart);

      let drawLineOptions = {
        title: { text: `${this.selectMonth}${this.incomeState == 0 ? "支出" : "收入"}折线图`, left: "center" },
        xAxis: {
          type: "category",
          data: this.lineChartX,
        },
        yAxis: {
          type: "value",
        },
        tooltip: {
          trigger: "item", // axis   item   none三个值
        },
        series: [
          {
            name: "金额统计",
            data: this.lineChartY,
            type: "line",
            smooth: true,
          },
        ],
      };
      // 绘制图表
      drawLineChart.setOption(drawLineOptions);
    },

    drawPie() {
      // 基于准备好的dom，初始化echarts实例
      const chart = this.$refs.drawPie;
      let drawPieChart = this.$echarts.init(chart);

      let drawPieOptions = {
        title: {
          text: `${this.selectMonth}${this.incomeState == 0 ? "支出" : "收入"}饼图`,
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        // legend: {
        //   orient: "vertical",
        //   left: "left",
        // },
        series: [
          {
            name: "金额统计",
            type: "pie",
            radius: "50%",
            data: this.pieDatas,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      // 绘制图表
      drawPieChart.setOption(drawPieOptions);
    },
  },
};
</script>

<style lang="less" scoped>
.Statistics {
  background-color: #fafafa;
  padding-bottom: 0.2rem;
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
  .pay {
    width: 6.9rem;
    height: 2.05rem;
    box-sizing: border-box;
    background-color: #fff;
    background: url(../assets/img/bg.png) no-repeat;
    background-size: cover;
    border-radius: 0.2rem;
    padding: 0.2rem;
    font-family: "siyuan";
    margin: 0.1rem auto;
    .pay-title {
      font-size: 0.34rem;
      // color: rgba(51, 51, 51, 1);
      color: #fff;
      font-weight: 500;
    }
    .pay-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      span {
        &:nth-child(1) {
          font-size: 0.24rem;
          color: #fff;
          margin-bottom: 0.06rem;
        }
        &:nth-child(2) {
          font-size: 0.38rem;
          font-weight: 700;
          color: #ffff;
        }
      }
    }
  }
  .title {
    .van-button__text {
      color: black;
    }
  }
}
</style>
