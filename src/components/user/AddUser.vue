<template>
  <el-dialog
    v-model="addUserVisible"
    title="添加用户"
    width="50%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form
      :model="addUserInfo"
      :rules="addUserRules"
      ref="addUserRef"
      label-width="70px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addUserInfo.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addUserInfo.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addUserInfo.email"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="addUserInfo.phone"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="addUser">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "AddUser",
  setup() {
    const { proxy } = getCurrentInstance();
    //  验证邮箱规则
    let checkEmail = (rule, value, cb) => {
      const regEmail =
        /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
      if (regEmail.test(value)) return cb();
      cb(new Error("请输入合法的邮箱"));
    };
    //  验证手机号规则
    let checkPhone = (rule, value, cb) => {
      const regPhone =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regPhone.test(value)) return cb();
      cb(new Error("请输入合法的号码"));
    };
    let addUserVisible = ref(false);
    let addUserInfo = ref({
      username: "panjie",
      password: "123456",
      email: "123@qq.com",
      phone: "13888888888",
      role: "普通管理员",
      state: true,
      isLogin: 0,
    });
    let addUserRules = {
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
        {
          min: 3,
          max: 12,
          message: "长度在 3 到 12 个字符",
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
        {
          min: 6,
          max: 18,
          message: "长度在 6 到 18 个字符",
          trigger: "blur",
        },
      ],
      email: [
        {
          required: true,
          message: "请输入邮箱",
          trigger: "blur",
        },
        {
          validator: checkEmail,
          trigger: "blur",
        },
      ],
      phone: [
        {
          required: true,
          message: "请输入电话",
          trigger: "blur",
        },
        {
          validator: checkPhone,
          trigger: "blur",
        },
      ],
    };
    function handleClose() {
      proxy.$refs.addUserRef.resetFields();
      addUserVisible.value = false;
    }
    function openAddUser() {
      addUserVisible.value = true;
    }
    function addUser() {
      proxy.$refs.addUserRef.validate(async (valid) => {
        if (!valid) return;
        let { data } = await proxy.$http.put("/user/add", addUserInfo.value);
        if (data.meta.status !== 200) {
          return proxy.$message.error(data.meta.des);
        }
        proxy.$message.success("用户添加成功");
        proxy.addUserVisible = false;
        proxy.$bus.emit("getUserList");
      });
    }
    onMounted(() => {
      proxy.$bus.on("openAddUser", openAddUser);
    });
    return {
      addUserVisible,
      addUserInfo,
      addUserRules,
      handleClose,
      addUser,
    };
  },
};
</script>

<style lang="less" scoped>
</style>