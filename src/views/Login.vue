<template>
  <div class="Login">
    <div class="top">
      <img class="clock" src="http://cdn.xxoutman.cn/clock-1680950517610.png?1680950517914" alt="" style="width: 1.28rem; height: 1.28rem" />
      <img class="nan" src="http://cdn.xxoutman.cn/nanzhen-1680950542391.png?1680950542677" alt="" style="width: 2.56rem; height: 2.56rem" />
      <img class="zhang" src="http://cdn.xxoutman.cn/image-1680950576709.png?1680950576873" alt="" style="width: 3.44rem; height: 3.44rem" />
      <img class="star" src="http://cdn.xxoutman.cn/star-1680950559746.png?1680950559931" alt="" style="width: 3.66rem; height: 3.94rem" />
    </div>
    <!-- 内容区域 -->
    <div class="content">
      <div class="title">登录</div>
      <!-- 登录/注册框 -->
      <div class="user">
        <div class="userone" style="border-bottom: 0.01rem solid #cccccc60">
          <img src="http://cdn.xxoutman.cn/user-1680953168370.png?1680953168599" alt="" />
          <input v-model="username" type="text" placeholder="用户名" />
        </div>
        <div class="userone">
          <img src="http://cdn.xxoutman.cn/lock-1680953833142.png?1680953833351" alt="" />
          <input v-model="password" type="password" placeholder="密码" />
        </div>
      </div>

      <div class="info">
        <span @click="toRegister">没有账号,去注册</span>
        <button @click="Login">登录</button>
      </div>
      <!-- 脚部区域 -->
      <div class="footer">
        <div class="phone">
          <img src="../assets/img/phone.png" style="width: 0.6rem; height: 0.56rem" alt="" />
        </div>
        <div class="qq" style="margin: 0 0.6rem">
          <img src="../assets/img/qq.png" style="width: 0.6rem; height: 0.6rem" alt="" />
        </div>
        <div class="weixin">
          <img src="../assets/img/weixin.png" style="width: 0.6rem; height: 0.6rem" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "", //用户名。
      password: "", //密码。
    };
  },
  methods: {
    // 跳转去注册
    toRegister() {
      this.$router.push({ path: "/register" });
    },
    // 点击登录按钮。
    Login() {
      // 登陆盼空校验。
      if (this.username.length <= 0 || this.password.length <= 0) {
        return this.$notify({
          message: "用户名或密码不可以为空",
          duration: 1000,
        });
      }
      // 长度校验
      if (this.password.length < 6) {
        return this.$notify({
          message: "密码的长度至少是6位",
          duration: 1000,
        });
      }

      // 发起请求
      this.$axios.post("/user/login", { username: this.username, password: this.password }).then((res) => {
        // console.log(res.data);
        if (res.data.code == 200) {
          // 保存数据到本地
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("UserInfo", JSON.stringify(res.data.result));
          // 跳转到首页tag标签
          setTimeout(() => {
            this.$router.push({ path: "/tag" });
          }, 1000);
          return this.$notify({ type: "success", message: res.data.message, duration: 1000 });
        } else {
          return this.$notify({ type: "danger", message: res.data.message, duration: 1000 });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.Login {
  width: 100%;
  height: 100vh;
  background-color: #9dbff3;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .top {
    width: 100%;
    height: 5rem;
    position: relative;
    .clock {
      position: absolute;
      top: 1rem;
      left: 0.72rem;
    }
    .nan {
      position: absolute;
      top: 1.1rem;
      right: -0.8rem;
    }
    .zhang {
      position: absolute;
      bottom: -1.3rem;
      left: -1.3rem;
    }
    .star {
      position: absolute;
      bottom: -0.6rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 4;
    }
  }
  .content {
    position: relative;
    flex: 1;
    width: 7.5rem;
    background-color: #ffffff;
    background-image: linear-gradient(254deg, #ffffff 0%, #f4e5e2 33%, #e5e2ee 66%, #ffffff 100%);
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    z-index: 3;
    .title {
      font-size: 0.64rem;
      font-weight: 400;
      color: rgba(25, 28, 50, 1);
      text-align: center;
      padding-top: 1rem;
      font-family: "consolas";
    }
    .user {
      width: 6.5rem;
      height: 2.6rem;
      background-color: #fff;
      margin: 0.2rem auto 0;
      border-radius: 0.5rem;
      padding: 0.36rem 0.4rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .userone {
        flex: 1;
        display: flex;
        align-items: center;
        img {
          width: 0.64rem;
          height: 0.64rem;
          margin-right: 0.4rem;
        }
        input {
          height: 0.64rem;
          border: 0;
          font-family: consolas;
          &::placeholder {
            color: rgba(147, 149, 164, 1);
          }
        }
      }
    }
    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.5rem 0 0.9rem;
      margin-top: 0.5rem;
      box-sizing: border-box;
      span {
        font-size: 0.28rem;
        color: rgba(154, 157, 216, 1);
      }
      button {
        width: 2.9rem;
        height: 1.1rem;
        background: rgba(13, 43, 68, 1);
        border-radius: 0.6rem;
        box-shadow: 0px 20px 30px 0px rgba(25, 28, 50, 0.1);
        border: 0;
        color: #fff;
      }
    }
  }
  .footer {
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 0.6rem;
    left: 50%;
    transform: translateX(-50%);
    div {
      width: 1.08rem;
      height: 1.08rem;
      background-color: #fff;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0px 20px 60px 0px rgba(55, 62, 125, 0.05);
    }
  }
}
</style>
