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
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserInfo.username"></el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="addUserInfo.name"></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12"></el-col>
        <el-col :span="12"></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12"
          ><el-form-item label="密码" prop="password">
            <el-input v-model="addUserInfo.password"></el-input> </el-form-item
        ></el-col>
        <el-col :span="12"
          ><el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserInfo.email"></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12"
          ><el-form-item label="电话" prop="phone">
            <el-input v-model="addUserInfo.phone"></el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item label="银行卡" prop="card">
            <el-input v-model="addUserInfo.card"></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12"
          ><el-form-item label="身份证" prop="idcard">
            <el-input v-model="addUserInfo.idcard"></el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item label="住址" prop="address">
            <el-input v-model="addUserInfo.address"></el-input> </el-form-item
        >
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12"
          ><el-form-item label="分配角色">
            <el-select
              v-model="addUserInfo.role"
              class="m-2"
              placeholder="Select"
            >
              <el-option
                v-for="item in roleList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
                :disabled="item.name === '超级管理员'"
              />
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="12"
          ><el-form-item label="分配小组">
            <el-select
              v-model="addUserInfo.department"
              class="m-2"
              placeholder="Select"
            >
              <el-option
                v-for="item in depList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select> </el-form-item
        ></el-col>
      </el-row>
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
    const getTime = require("../../assets/fun/getTime");
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
    let addUserVisible = ref(false);
    let addUserInfo = ref({
      username: "",
      password: "",
      email: "",
      phone: "",
      role: "普通成员",
      state: true,
      isLogin: 0,
      create: "",
      department: "A组",
      card: "",
      idcard: "",
    });
    let addUserRules = {
      name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
        {
          min: 3,
          max: 18,
          message: "长度在 3 到 18 个字符",
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
      address:[{required: true, message: "请输入住址", trigger: "blur"}]
    };
    let roleList = ref([]);
    let depList = ref([]);
    function handleClose() {
      proxy.$refs.addUserRef.resetFields();
      addUserVisible.value = false;
    }
    // 打开dialog
    function openAddUser() {
      addUserVisible.value = true;
    }
    // 发送添加用户请求
    function addUser() {
      proxy.$refs.addUserRef.validate(async (valid) => {
        if (!valid) return console.log("err");
        addUserInfo.value.create = getTime();
        let { data } = await proxy.$http.put("/user/add", addUserInfo.value);
        if (data.meta.status !== 200) {
          return proxy.$message.error(data.meta.des);
        }
        proxy.$message.success("用户添加成功");
        handleClose();
        proxy.$bus.emit("getUserList");
      });
    }
    // 获取角色列表
    async function getRoleList() {
      let { data } = await proxy.$http.get("/role/role");
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      roleList.value = data.result;
    }
    // 获取部门列表
    async function getDepList() {
      let { data } = await proxy.$http.get("/department");
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      depList.value = data.result;
    }
    onMounted(() => {
      proxy.$bus.on("openAddUser", openAddUser);
      getRoleList();
      getDepList();
    });
    return {
      addUserVisible,
      addUserInfo,
      addUserRules,
      handleClose,
      addUser,
      roleList,
      depList,
    };
  },
};
</script>

<style lang="less" scoped>
</style>