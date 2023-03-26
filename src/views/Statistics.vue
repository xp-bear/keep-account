<template>
  <div class="Statistics">
    <!-- 头部标题 -->
    <van-button type="primary" color="#e8e8e8" block class="title">统计分析</van-button>

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

    <!-- 选择器 -->
    <van-cell title="选择分析的月份" :value="selectMonth" @click="monthPanelState = true" is-link />
    <van-popup v-model="monthPanelState" position="bottom" :style="{ height: '50%' }">
      <van-datetime-picker v-model="currentDate" @cancel="month_cancel" @confirm="month_confirm" type="year-month" title="选择月份" :min-date="minDate" :max-date="maxDate" :formatter="formatter" />
    </van-popup>

    <!-- 画图 -->
    <div ref="drawLine" style="width: 7.5rem; height: 6rem"></div>
    <div ref="drawPie" style="width: 7.5rem; height: 6rem"></div>
  </div>
</template>

<script>
export default {
  name: "Statistics",
  data() {
    return {
      monthPanelState: false, //默认月份面板没有展开。
      selectMonth: "", //选择的月份 2023/11月
      minDate: new Date(2023, 0, 1),
      maxDate: new Date(2030, 11, 30),
      currentDate: "", //选中的时间格式
      monthDatas: {}, //请求回来的月份数据
      incomeState: 0, //0-支出 1-收入。
      lineChartX: [], //折线图x轴数据集合
      lineChartY: [], //折线图y轴数据集合

      pieDatas: [], //饼图数据集合
    };
  },
  mounted() {
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
    //收入与支出切换
    switchChangeIncome(value) {
      this.incomeState = value;
      console.log("支出与收入状态:", this.incomeState);
      // 重置选择的时间
      this.currentDate = new Date();
      this.month_confirm();
    },
    // 请求数据
    getData() {
      this.lineChartX = [];
      this.lineChartY = [];
      // 请求查询的月份
      this.$axios.get(`/account/searchmonth?monthdata=${this.selectMonth}&flag=${this.incomeState}`).then((res) => {
        this.monthDatas = res.data;
        for (let key in this.monthDatas) {
          this.lineChartX.push(this.$dayjs(key).format("MM/DD"));
          let totalMoney = 0;
          this.monthDatas[key].forEach((item) => {
            totalMoney += +item.record_money;
          });
          this.lineChartY.push(totalMoney);
        }
      });
    },

    // 请求饼图数据
    getPieData() {
      this.$axios.get(`/account/searchpie?monthdata=${this.selectMonth}&flag=${this.incomeState}`).then((res) => {
        this.pieDatas = res.data;
      });
    },
    month_cancel() {
      this.monthPanelState = false;
    },
    month_confirm() {
      this.selectMonth = this.$dayjs(this.currentDate).format("YYYY/MM");
      console.log(this.currentDate, this.selectMonth); //月份
      this.monthPanelState = false;

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
        series: [
          {
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
  .title {
    .van-button__text {
      color: black;
    }
  }
}
</style>
