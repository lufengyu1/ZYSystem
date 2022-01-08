<template>
  <div class="body">
    <div :class="['container', classFlag ? 'right-panel-active' : '']">
      <!-- 找回密码框 -->
      <div class="container_form container--signup">
        <div class="form" id="form1">
          <h2 class="form_title">找回密码</h2>
          <input type="text" placeholder="User" class="input" />
          <input type="email" placeholder="Email" class="input" />
          <input type="password" placeholder="Password" class="input" />
          <button class="btn">确定</button>
        </div>
      </div>
      <!-- 登录框 -->
      <div class="container_form container--signin">
        <div class="form" id="form2">
          <h2 class="form_title">欢迎登录</h2>
          <el-form
            class="login_form"
            ref="loginRef"
            label-width="0px"
            :model="loginInfo"
            :rules="loginRules"
          >
            <el-form-item prop="username">
              <el-input
                prefix-icon="iconfont icon-denglu"
                v-model="loginInfo.username"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                prefix-icon="iconfont icon-mimadenglu"
                type="password"
                v-model="loginInfo.password"
              ></el-input>
            </el-form-item>
          </el-form>
          <button class="btn" @click="login">登录</button>
        </div>
      </div>
      <div class="container_overlay">
        <div class="overlay">
          <div class="overlay_panel overlay--left">
            <button class="btn" id="signin" @click="changeFlag">
              已有账号，直接登录
            </button>
          </div>
          <div class="overlay_panel overlay--right">
            <button class="btn" id="signup" @click="changeFlag">
              忘记密码，找回密码
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, getCurrentInstance } from "vue";
export default {
  name: "Login",
  setup() {
    const { proxy } = getCurrentInstance();
    let loginInfo = reactive({
      username: "admin",
      password: "123456",
    });
    let classFlag = ref(false);
    let loginRules = {
      username: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" },
      ],
      password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" },
      ],
    };
    let loginRole = reactive({});
    // 切换 登录和找回密码
    function changeFlag() {
      classFlag.value = !classFlag.value;
    }
    // 登录
    function login() {
      proxy.$http.post("/user/login", loginInfo).then((res) => {
        let { data } = res;
        if (data.meta.status !== 200) {
          return proxy.$message.error(data.meta.des);
        }
        // 登录成功
        loginRole = data.result;
        window.sessionStorage.setItem("token", data.token);
        proxy.$router.push("/home");
        proxy.$message.success(data.meta.des);
      });
    }
    return {
      changeFlag,
      classFlag,
      loginInfo,
      loginRules,
      login,
    };
  },
};
</script>

<style lang="less" scoped>
.body {
  align-items: center;
  background-color: #e9e9e9;
  background: url(../assets/bg1.jpeg);
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: grid;
  height: 100vh;
  place-items: center;
}

.form_title {
  font-weight: 300;
  margin: 0;
  margin-bottom: 3rem;
}

.link {
  color: #333;
  font-size: 0.9rem;
  margin: 1.5rem 0;
  text-decoration: none;
}

.container {
  background-color: #e9e9e9;
  border-radius: 0.7rem;
  box-shadow: 0 0.9rem 1.7rem rgba(0, 0, 0, 0.25);
  height: 420px;
  max-width: 758px;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.container_form {
  height: 100%;
  position: absolute;
  top: 0;
  transition: all 0.6s ease-in-out;
}

.container--signin {
  left: 0;
  width: 50%;
  z-index: 2;
}

.container.right-panel-active .container--signin {
  transform: translateX(100%);
}

.container--signup {
  left: 0;
  width: 50%;
  z-index: 1;
  opacity: 0;
}

.container.right-panel-active .container--signup {
  animation: show 0.6s;
  opacity: 1;
  transform: translateX(100%);
  z-index: 5;
}

.container_overlay {
  height: 100%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 0;
  transition: transform 0.6s ease-in-out;
  width: 50%;
  z-index: 100;
}

.container.right-panel-active .container_overlay {
  transform: translateX(-100%);
}

.overlay {
  background-color: #008997;
  background: url(../assets/bg1.jpeg);
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  left: -100%;
  position: relative;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  width: 200%;
}

.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay_panel {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  position: absolute;
  text-align: center;
  top: 0;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  width: 50%;
}

.overlay--left {
  transform: translateX(-20%);
}

.container.right-panel-active .overlay--left {
  transform: translateX(0);
}

.overlay--right {
  right: 0;
  transform: translateX(0);
}

.container.right-panel-active .overlay--right {
  transform: translateX(20%);
}

.btn {
  background-color: #0367a6;
  background-image: linear-gradient(90deg, #0367a6, #008997);
  border-radius: 20px;
  border: 1px solid #0367a6;
  color: #e9e9e9;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 0.1rem;
  padding: 0.9rem 4rem;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
}

.form > .btn {
  margin-top: 1.5rem;
}

.btn:active {
  transform: scale(0.95);
}

.btn:focus {
  outline: none;
}

.form {
  background-color: #e9e9e9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 3rem;
  height: 100%;
  text-align: center;
}

.input {
  background-color: #fff;
  border: none;
  padding: 0.9rem 0.9rem;
  margin: 0.5rem 0;
  width: 100%;
}

@keyframes show {
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }
  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}

.el-input{
  width: 300px;
}
</style>
