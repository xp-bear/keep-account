<template>
  <div class="Home">
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
            <span>2022/7/3</span><span>总消费:<van-icon name="balance-o" /> 50</span>
          </div>
        </template>
        <ul class="detail">
          <li><span>服饰鞋帽</span><span>17:00</span><span>暂无留言</span><span>¥20</span></li>
          <li><span>交通出行</span><span>17:00</span><span>暂无留言</span><span>¥20000</span></li>
          <li><span>服饰鞋帽</span><span>17:00</span><span>自己买衣服</span><span>¥20</span></li>
        </ul>
      </van-collapse-item>
    </van-collapse>

    <van-collapse v-model="activeNames">
      <van-collapse-item name="2" icon="shop-o">
        <template #title>
          <div style="display: flex; justify-content: space-between">
            <span>2022/7/3</span><span>总消费:<van-icon name="balance-o" /> 50</span>
          </div>
        </template>
        <ul class="detail">
          <li><span>服饰鞋帽</span><span>17:00</span><span>暂无留言</span><span>¥20</span></li>
          <li><span>交通出行</span><span>17:00</span><span>暂无留言</span><span>¥20000</span></li>
          <li><span>服饰鞋帽</span><span>17:00</span><span>自己买衣服</span><span>¥20</span></li>
        </ul>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: "Home",
  components: {},
  data() {
    return {
      activeNames: ["1"],
    };
  },
};
</script>
<style lang="less" scoped>
.Home {
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
          width: 15%;
        }
        &:nth-child(3) {
          width: 50%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:nth-child(4) {
          width: 15%;
        }
      }
    }
  }
}
</style>
