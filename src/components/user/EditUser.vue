<template>
  <el-dialog
    title="编辑用户"
    v-model="editUserVisible"
    width="50%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <!-- 内容主题 -->
    <el-form
      :model="editUserInfo"
      :rules="editUserRules"
      ref="editUserRef"
      label-width="70px"
    >
      <el-form-item label="用户名">
        <el-input v-model="editUserInfo.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="editUserInfo.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editUserInfo.email"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="editUserInfo.phone"></el-input>
      </el-form-item>
      <el-form-item label="银行卡" prop="card">
        <el-input v-model="editUserInfo.card"></el-input>
      </el-form-item>
      <el-form-item label="身份证" prop="idcard">
        <el-input v-model="editUserInfo.idcard"></el-input>
      </el-form-item>
      <el-form-item label="住址" prop="address">
        <el-input v-model="editUserInfo.address"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="editUser">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "EditUser",
  setup() {
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
    // 验证银行卡号
    let checkCard = (rule, value, cb) => {
      const regCard = /^([1-9]{1})(\d{14}|\d{18})$/;
      if (regCard.test(value)) return cb();
      cb(new Error("请输入合法的银行卡号"));
    };
    // 验证身份证
    let checkIdcard = (rule, value, cb) => {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (reg.test(value)) return cb();
      cb(new Error("请输入正确的身份证号"));
    };
    const { proxy } = getCurrentInstance();
    let editUserVisible = ref(false);
    let editUserInfo = ref({});
    let editUserRules = ref({
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
      card: [
        { required: true, message: "请输入银行卡号", trigger: "blur" },
        {
          validator: checkCard,
          trigger: "blur",
        },
      ],
      idcard: [
        { required: true, message: "请输入身份证号", trigger: "blur" },
        {
          validator: checkIdcard,
          trigger: "blur",
        },
      ],
      address:[ { required: true, message: "请输入住址", trigger: "blur" },]
    });
    async function openEditUser(info) {
      let { data } = await proxy.$http.get("/user/userinfo", {
        params: { _id: info._id },
      });
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      editUserInfo.value = data.result;
      editUserVisible.value = true;
    }
    function handleClose() {
      proxy.$refs.editUserRef.resetFields();
      editUserVisible.value = false;
    }
    async function editUser() {
      proxy.$refs.editUserRef.validate(async (valid) => {
        if (!valid) return console.log("error");
        let { data } = await proxy.$http.put("/user/update", {
          _id: proxy.editUserInfo._id,
          userInfo: editUserInfo.value,
        });
        if (data.meta.status !== 200)
          return proxy.$message.error(data.meta.des);
        proxy.$message.success("用户信息更新成功");
        editUserVisible.value = false;
        proxy.$bus.emit("getUserList");
      });
    }
    onMounted(() => {});
    proxy.$bus.on("openEditUser", openEditUser);
    return {
      editUserVisible,
      editUserInfo,
      editUserRules,
      handleClose,
      editUser,
    };
  },
};
</script>

<style lang="less" scoped>
</style>