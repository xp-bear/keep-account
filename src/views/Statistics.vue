<template>
  <div class="Statistics">
    <!-- 头部标题 -->
    <van-button type="primary" color="#e8e8e8" block class="title">统计分析</van-button>
    <div ref="drawLine" style="width: 7.5rem; height: 6rem"></div>
    <div ref="drawPie" style="width: 7.5rem; height: 6rem"></div>
  </div>
</template>

<script>
export default {
  name: "Statistics",
  data() {
    return {};
  },
  mounted() {
    this.drawLine(); //折线图
    this.drawPie(); //饼图
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const chart = this.$refs.drawLine;
      let drawLineChart = this.$echarts.init(chart);

      let drawLineOptions = {
        title: { text: "7月份金额分析折线图", left: "center" },
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
          text: "7月份金额分析饼图",
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
  .title {
    .van-button__text {
      color: black;
    }
  }
}
</style>
