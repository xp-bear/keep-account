<template>
  <div class="User">
    <!-- 头部标题 -->
    <van-button type="primary" color="#e8e8e8" block class="title">个人信息</van-button>
    <!-- 头部背景区域 -->
    <div class="bg">
      <!-- 头像区域 -->
      <div class="avatar">
        <div class="title">
          <img :src="userinfo.avatar" alt="" />
          <span>{{ userinfo.username }}</span>
          <van-icon name="arrow" color="#fff" size="16" style="float: right" />
        </div>

        <!-- 下面信息区域 -->
        <div class="info">
          <div class="info-label">
            <span>{{ totalDay }}</span>
            <span>记账天数</span>
          </div>
          <div class="info-label">
            <span>¥{{ userDataObj && formatMoneyTwo(userDataObj.totalMoney) }}</span>
            <span>记账总金额</span>
          </div>
          <div class="info-label">
            <span>{{ userDataObj && userDataObj.totalCount }}</span>
            <span>记账总共笔</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 列表区域 -->
    <div class="fn-list">
      <div>
        <img src="../assets/img/1.png" alt="" style="width: 0.76rem" />
        <span>账单</span>
      </div>
      <div>
        <img src="../assets/img/2.png" alt="" style="width: 0.72rem" />
        <span>排行</span>
      </div>
      <div>
        <img src="../assets/img/3.png" alt="" style="width: 0.78rem" />
        <span>消息</span>
      </div>
      <div>
        <img src="../assets/img/4.png" alt="" style="width: 0.79rem" />
        <span>好友</span>
      </div>
    </div>

    <!-- 单元格区域 -->
    <div class="cell">
      <van-cell title="账本管理" size="24" icon="http://cdn.xxoutman.cn/t1-1679812424270.png" is-link />
      <van-cell title="记账提醒" size="24" icon="http://cdn.xxoutman.cn/t2-1679812683959.png?1679812684144" is-link />
      <van-cell title="预算提醒" size="24" icon="http://cdn.xxoutman.cn/t3-1679812692515.png?1679812692643" is-link />
      <van-cell title="邀请好友" size="24" icon="http://cdn.xxoutman.cn/t4-1679812701993.png?1679812702139" is-link />
      <van-cell title="设置" size="24" icon="http://cdn.xxoutman.cn/t5-1679812710005.png?1679812710143" is-link />
    </div>

    <!-- 退出登录 -->
    <button class="logout" @click="logout">退出登录</button>
  </div>
</template>

<script>
import { formatMoneyTwo } from "../utils/tools";
export default {
  name: "User",
  data() {
    return {
      userDataObj: null, //首页数据
      totalDay: 0, //记账天数
      userinfo: "", //用户个人信息数据
    };
  },
  mounted() {
    // 获取用户信息数据
    this.userinfo = JSON.parse(localStorage.getItem("UserInfo")) || {};
    // console.log(this.userinfo);
    // 请求天数数据接口
    // { totalCount:"xx" , totalMoney:'xx' }
    this.$axios.get(`/account/searchuser?ownerid=${this.userinfo.user_id}`).then((res) => {
      this.userDataObj = res.data[0];
    });

    // 请求天数接口
    this.$axios.get(`/account/searchtotalday?ownerid=${this.userinfo.user_id}`).then((res) => {
      this.totalDay = res.data.totalDay;
    });
  },
  methods: {
    formatMoneyTwo,
    // 退出登录
    logout() {
      this.$dialog
        .confirm({
          title: "退出登录",
          message: "是否清除登录数据",
        })
        .then(() => {
          localStorage.clear(); //清空本地缓存。
          this.$router.push({ path: "/login" });
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>

<style lang="less" scoped>
.User {
  background-color: #fafafa;
  height: 100vh;
  .title {
    .van-button__text {
      color: black;
    }
  }
  .bg {
    width: 7.5rem;
    height: 4.35rem;
    background: url(../assets/img/bg.png) no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    .avatar {
      width: 6.4rem;
      height: 2.25rem;
      // background-color: pink;
      .title {
        width: 6.4rem;
        display: flex;
        align-items: center;
        img {
          width: 1.08rem;
          height: 1.08rem;
          border-radius: 50%;
        }
        span {
          font-size: 0.38rem;
          font-weight: 400;
          font-family: "consolas";
          color: #fff;
          margin-left: 0.2rem;
          flex: 1;
        }
      }
      .info {
        margin-top: 0.3rem;
        display: flex;
        justify-content: space-between;
        .info-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          span {
            &:nth-child(1) {
              font-size: 0.38rem;
              font-weight: 600;
              color: #fff;
            }
            &:nth-child(2) {
              font-size: 0.24rem;
              font-weight: 400;
              color: rgba(255, 255, 255, 0.6);
            }
          }
        }
      }
    }
  }
  .fn-list {
    display: flex;
    justify-content: space-evenly;
    align-items: flex-end;
    width: 6.9rem;
    height: 1.82rem;
    box-sizing: border-box;
    margin: 0 auto;
    background-color: #ffffff;
    margin-top: -1rem;
    border-radius: 0.2rem;
    padding-bottom: 0.36rem;
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      span {
        font-size: 0.24rem;
        margin-top: 0.1rem;
      }
    }
  }
  .cell {
    width: 6.9rem;
    margin: 0 auto;
    margin-top: 0.24rem;
    border-radius: 0.4rem;
    overflow: hidden;
    .van-cell__left-icon {
      display: flex;
      align-items: center;
      margin-right: 0.1rem;
    }
  }
  .logout {
    width: 6.9rem;
    height: 0.7rem;
    background: #f15c5c;
    margin: 0 auto;
    border-radius: 0.4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    box-shadow: 0 0 0.06rem #ccc;
    border: 0;
  }
}
</style>
