<template>
  <div class="Tag">
    <!-- 标题选项 -->
    <div class="income">
      <van-button type="primary" color="#1bb5fe" :plain="false" block size="small">支出</van-button>
      <van-button type="primary" color="#1bb5fe" :plain="true" block size="small">收入</van-button>
    </div>

    <!-- 查询三天的消费金额 -->
    <van-collapse v-model="activeNames">
      <van-collapse-item name="1" icon="shop-o">
        <template #title>
          <div style="display: flex; justify-content: space-between">
            <span>{{ date }}</span>
            <span>总消费:<van-icon name="balance-o" /> {{ totalMoney }}</span>
          </div>
        </template>
        <ul class="detail">
          <li v-for="item in datas" :key="item.id">
            <span>{{ item.tag | tagValue }}</span>
            <span>{{ item.time }}</span>
            <span>{{ item.comment }}</span>
            <span>¥{{ item.money }}</span>
          </li>
        </ul>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: "Tag",
  components: {},
  mounted() {
    this.$axios.get("/account/everyday").then((res) => {
      // console.log(res.data);
      // this.date = res.data[0].date;
      this.datas = res.data;
      // console.log(this.datas);
      this.date = this.$dayjs(res.data[0]?.date).format("YYYY-MM-DD"); //处理时间格式
      res.data.forEach((item) => {
        this.totalMoney += +item.money;
      });
    });
  },
  data() {
    return {
      activeNames: ["1"],
      totalMoney: 0, //使用的金额
      date: null, //日期
      datas: [], //每一天的消费
    };
  },
  filters: {
    // 标签过滤器
    tagValue(value) {
      let tag = "";
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
      return tag;
    },
  },
};
</script>
<style lang="less" scoped>
.Tag {
  .income {
    display: flex;
    .van-button {
      border-radius: 0;
    }
    .van-button__text {
      font-size: 0.32rem;
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
