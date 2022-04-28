<template>
  <el-dialog
    title="修改密码"
    v-model="editPasswordVisible"
    width="50%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <!-- 内容主题 -->
    <el-form
      :model="userInfo"
      :rules="editRules"
      ref="editRef"
      label-width="80px"
    >
      <el-form-item label="用户名">
        <el-input v-model="userInfo.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="pwd">
        <el-input
          v-model="userInfo.pwd"
          show-password
          type="password"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="newPwd">
        <el-input
          v-model="userInfo.newPwd"
          show-password
          type="password"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="editPassword">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "Password",
  setup() {
    const { proxy } = getCurrentInstance();
    let editPasswordVisible = ref(false);
    let editInfo = ref({});
    let yzmRule = (rule, value, cb) => {
      if (value !== userInfo.value.pwd) return cb(new Error("两次密码不一致"));
      return cb();
    };
    let editRules = ref({
      pwd: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" },
      ],
      newPwd: [
        { required: true, message: "请再次输入密码", trigger: "blur" },
        { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" },
        { validator: yzmRule, trigger: "blur" },
      ],
    });
    let userInfo = ref({ username: "", pwd: "", newPwd: "" });
    function handleClose() {
      proxy.$refs.editRef.resetFields();
      editPasswordVisible.value = false;
    }
    // 打开dialog
    async function openEditPassword(info) {
      editPasswordVisible.value = true;
      let { data } = await proxy.$http.get("/user/userinfo", {
        params: { username: info.username },
      });
      if (data.meta.status !== 200)
        return proxy.$message.error("用户信息获取失败");
      editInfo.value = data.result;
      userInfo.value.username = editInfo.value.username;
    }
    // 更新密码
    async function editPassword() {
      if (userInfo.value.pwd === editInfo.value.password)
        return proxy.$message.info("密码不能与近期相同");
      proxy.$refs.editRef.validate(async (valid) => {
        if (!valid) return console.log("err");
        let { data } = await proxy.$http.put("/user/update", {
          _id: proxy.editInfo._id,
          userInfo: { password: userInfo.value.pwd },
        });
        if (data.meta.status !== 200)
          return proxy.$message.error(data.meta.des);
        proxy.$message.success("用户密码更新成功");
        editPasswordVisible.value = false;
        proxy.$bus.emit("logout");
      });
    }
    onMounted(() => {
      proxy.$bus.on("openEditPassword", openEditPassword);
    });
    return {
      editPasswordVisible,
      handleClose,
      editInfo,
      editPassword,
      editRules,

      userInfo,
    };
  },
};
</script>

<style lang="less" scoped>
</style>