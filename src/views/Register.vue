<template>
  <div class="Register">
    <div>
      <div class="top"></div>
    </div>
    <!-- 登录/注册框 -->
    <div class="user">
      <div class="title">注册</div>

      <div class="userone">
        <img src="https://xp-cdn-oss.oss-cn-wuhan-lr.aliyuncs.com/cookies/icon 32px_light_user-1736580472144.svg?1736580502555" alt="" />
        <input v-model="username" type="text" placeholder="用户名" />
      </div>
      <div class="userone">
        <img src="https://xp-cdn-oss.oss-cn-wuhan-lr.aliyuncs.com/cookies/icon 32px_light_email.svg?1736580804416" alt="" />
        <input v-model="email" type="text" placeholder="邮箱" />
      </div>
      <div class="userone">
        <img src="https://xp-cdn-oss.oss-cn-wuhan-lr.aliyuncs.com/cookies/icon 32px_light_password.svg?1736580557363" alt="" />
        <input v-model="password" type="password" placeholder="密码" />
      </div>
      <button @click="Register">注册</button>
      <span @click="toLogin">已有账号,去登录</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      username: "", //用户名。
      password: "", //密码。
      email: "", //邮箱
    };
  },
  methods: {
    // 跳转登录
    toLogin() {
      this.$router.push({ path: "/login" });
    },
    // 注册用户
    Register() {
      // 判空校验
      if (this.username.length <= 0 || this.password.length <= 0 || this.email.length <= 0) {
        return this.$notify({
          message: "用户名、邮箱或密码不可以为空",
          duration: 1000,
        });
      }
      // 密码长度校验
      if (this.password.length < 6) {
        return this.$notify({
          message: "密码的长度至少是6位",
          duration: 1000,
        });
      }
      // 邮箱校验
      // 使用正则表达式进行校验
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        return this.$notify({
          message: "邮箱地址格式不正确",
          duration: 1000,
        });
      }

      // 发起请求
      this.$axios.post("/user/register", { username: this.username, email: this.email, password: this.password }).then((res) => {
        console.log(res.data);
        if (res.data.affectedRows == 1) {
          // 跳转到登录页面
          setTimeout(() => {
            this.$router.push({ path: "/login" });
          }, 1000);
          return this.$notify({
            type: "success",
            message: "注册成功",
            duration: 1000,
          });
        } else {
          return this.$notify({
            message: "注册失败",
            duration: 1000,
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.Register {
  position: relative;
  width: 100%;
  height: 100vh;
  z-index: 3;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  background-image: linear-gradient(254deg, #ffffff 0%, #f4e5e2 33%, #e5e2ee 66%, #ffffff 100%);
  .top {
    width: 5.72rem;
    height: 5.72rem;
    margin: 0.4rem auto 0;
    background: url("https://xp-cdn-oss.oss-cn-wuhan-lr.aliyuncs.com/cookies/编组-1736580714607.svg?1736580717238");
    background-size: cover;
  }
  .title {
    font-size: 0.64rem;
    font-weight: 400;
    color: rgba(25, 28, 50, 1);
    text-align: center;
    // padding-top: 1rem;
    font-family: "consolas";
    margin-bottom: 0.4rem;
  }
  .user {
    flex: 1;
    .userone {
      flex: 1;
      display: flex;
      align-items: center;
      background-color: #fff;
      width: 6.34rem;
      height: 1.08rem;
      margin: 0 auto 0.3rem;
      border-radius: 1.08rem;
      img {
        width: 0.64rem;
        height: 0.64rem;
        margin-left: 0.2rem;
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
    button {
      display: block;
      overflow: hidden;
      width: 6.34rem;
      height: 1.08rem;
      margin: 0rem auto 0;
      background: rgba(13, 43, 68, 1);
      border-radius: 0.6rem;
      box-shadow: 0px 20px 30px 0px rgba(25, 28, 50, 0.1);
      border: 0;
      color: #fff;
    }
    span {
      display: block;
      font-size: 0.28rem;
      color: rgba(154, 157, 216, 1);
      text-align: center;
      margin-top: 0.2rem;
    }
  }
}
</style>
