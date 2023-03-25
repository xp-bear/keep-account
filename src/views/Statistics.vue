<template>
  <div class="Statistics">
    <!-- 头部标题 -->
    <van-button type="primary" color="#e8e8e8" block class="title">统计分析</van-button>

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
    };
  },
  mounted() {
    // 选择默认的月份
    this.selectMonth = this.$dayjs(new Date()).format("YYYY/MM");

    this.drawLine(); //折线图
    this.drawPie(); //饼图
  },
  methods: {
    month_cancel() {
      this.monthPanelState = false;
    },
    month_confirm() {
      this.selectMonth = this.$dayjs(this.currentDate).format("YYYY/MM");
      console.log(this.currentDate, this.selectMonth); //月份
      this.monthPanelState = false;

      // 重新绘制图
      this.drawLine(); //折线图
      this.drawPie(); //饼图
      
      // 请求查询的月份
      // this.$axios.get(`/account/searchmonth?monthdata=${this.selectMonth}&flag=${this.incomeState}`).then((res) => {
      //   this.monthDatas = res.data;

      //   for (let key in this.monthDatas) {
      //     let totalMoney = 0;
      //     this.monthDatas[key].forEach((item) => {
      //       totalMoney += +item.record_money;
      //     });
      //     this.monthDatas[key].push(totalMoney);
      //   }
      // });
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
        title: { text: `${this.selectMonth}支出金额分析折线图`, left: "center" },
        xAxis: {
          type: "category",
          data: ["第一周", "第二周", "第三周", "第四周"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [560, 932, 901, 934],
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
          text: `${this.selectMonth}支出金额分析饼图`,
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
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: [
              { value: 1048, name: "第一周" },
              { value: 735, name: "第二周" },
              { value: 580, name: "第三周" },
              { value: 484, name: "第四周" },
            ],
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
  .title {
    .van-button__text {
      color: black;
    }
  }
}
</style>
