<template>
  <div class="body">
    <div :class="['container', classFlag ? 'right-panel-active' : '']">
      <!-- 找回密码框 -->
      <div class="container_form container--signup">
        <div class="form" id="form1">
          <h2 class="form_title2">找回密码</h2>
          <!-- <input type="text" placeholder="User" class="input" />
          <input type="email" placeholder="Email" class="input" />
          <input type="password" placeholder="Password" class="input" /> -->
          <el-form
            class=""
            ref="forgetRef"
            :rules="forgetRules"
            label-width="0px"
            :model="forget"
          >
            <el-form-item prop="username">
              <el-input
                v-model="forget.username"
                placeholder="用户名"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                show-password
                v-model="forget.password"
                placeholder="新密码"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input
                type="password"
                show-password
                v-model="forget.confirmPassword"
                placeholder="确认密码"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="yzm">
              <el-input
                v-model="forget.yzm"
                placeholder="验证码"
                clearable
              ></el-input>
            </el-form-item>
          </el-form>
          <!-- 1 -->
          <div class="img-verify">
            <canvas
              ref="verify"
              :width="width"
              :height="height"
              @click="handleDraw"
            ></canvas>
          </div>
          <!-- 2 -->
          <button class="btn" @click="newPassword">确定</button>
        </div>
      </div>
      <!-- 登录框 -->
      <div class="container_form container--signin">
        <div class="form" id="form2">
          <h2 class="form_title1">欢迎登录</h2>
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
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                prefix-icon="iconfont icon-mimadenglu"
                type="password"
                show-password
                v-model="loginInfo.password"
                clearable
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
import { ref, reactive, getCurrentInstance, onMounted, toRefs } from "vue";
export default {
  name: "Login",
  setup() {
    const { proxy } = getCurrentInstance();
    let loginInfo = reactive({
      username: "admin",
      password: "123456",
    });
    let forget = ref({
      username: "admin1",
      password: "123456",
      confirmPassword: "123456",
      yzm: "",
    });
    let classFlag = ref(false);
    //随机数
    let yzm = ref("");
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
    let yzmRule = (rule, value, cb) => {
      if (value !== forget.value.password)
        return cb(new Error("两次密码不一致"));

      return cb();
    };
    let forgetRules = reactive({
      username: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" },
      ],
      password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" },
      ],
      confirmPassword: [
        { required: true, message: "请再次输入密码", trigger: "blur" },
        { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" },
        { validator: yzmRule, trigger: "blur" },
      ],
      yzm: [{ required: true, message: "请输入验证码", trigger: "blur" }],
    });
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
        window.sessionStorage.setItem(
          "loginObj",
          JSON.stringify({
            username: data.result.username,
            role: data.result.role,
          })
        );
        proxy.$store.dispatch(
          "logining",
          JSON.parse(window.sessionStorage.getItem("loginObj"))
        );
        proxy.$router.push("/home");
        proxy.$message.success(data.meta.des);
      });
    }
    //生成画布
    const verify = ref(null);
    const state = reactive({
      pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz", // 字符串
      width: 120, // canvas宽
      height: 40, // canvas高
    });
    // 点击图片重新绘制
    const handleDraw = () => {
      draw();
    };
    // 随机数
    const randomNum = (min, max) => {
      return parseInt(Math.random() * (max - min) + min);
    };
    // 随机颜色
    const randomColor = (min, max) => {
      const r = randomNum(min, max);
      const g = randomNum(min, max);
      const b = randomNum(min, max);
      return `rgb(${r},${g},${b})`;
    };
    // 绘制图片
    const draw = () => {
      yzm.value = "";
      const ctx = verify.value.getContext("2d");
      // 填充颜色
      ctx.fillStyle = randomColor(180, 230);
      // 填充的位置
      ctx.fillRect(0, 0, state.width, state.height);
      // 随机产生字符串，并且随机旋转
      for (let i = 0; i < 4; i++) {
        // 随机的一个字符
        let text = state.pool[randomNum(0, state.pool.length)];
        yzm.value += text;
        // 随机的字体大小
        const fontSize = randomNum(18, 40);
        // 字体随机的旋转角度
        const deg = randomNum(-30, 30);
        ctx.font = fontSize + "px Simhei";
        ctx.textBaseline = "top";
        ctx.fillStyle = randomColor(80, 150);
        ctx.save();
        ctx.translate(30 * i + 15, 15);
        ctx.rotate((deg * Math.PI) / 180);
        ctx.fillText(text, -15 + 5, -15);
        ctx.restore();
      }
    };
    onMounted(() => {
      // 初始化绘制图片验证码
      draw();
    });
    //生成画布
    // 重新设置密码
    function newPassword() {
      console.log(1);
      proxy.$refs.forgetRef.validate(async (valid) => {
        console.log(2);
        if (!valid) return console.log("err");
        if (forget.value.yzm.toLowerCase() !== yzm.value.toLowerCase()) {
          return proxy.$message.info("验证码错误");
        } else {
          let { data } = await proxy.$http.put(
            "/user/newpassword",
            forget.value
          );
          if (data.meta.status !== 200) {
            draw();
            return proxy.$message.error(data.meta.des);
          }
          proxy.$message.success("密码设置成功");
          proxy.$refs.forgetRef.resetFields();
          draw();
        }
      });
    }
    return {
      changeFlag,
      classFlag,
      loginInfo,
      loginRules,
      login,
      forget,
      ...toRefs(state),
      verify,
      handleDraw,
      newPassword,
      forgetRules,
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

.form_title1 {
  font-weight: 300;
  margin: 0;
  margin-bottom: 3rem;
}
.form_title2 {
  font-weight: 300;
  margin: 0;
  margin-bottom: 0rem;
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

.el-input {
  width: 300px;
}
</style>
