<template>
  <el-dialog
    title="个人信息"
    v-model="editInfoVisible"
    width="50%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <!-- 内容主题 -->
    <el-form
      :model="editInfo"
      :rules="editRules"
      ref="editRef"
      label-width="70px"
    >
      <el-form-item label="用户名">
        <el-input v-model="editInfo.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editInfo.email"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="editInfo.phone"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="editPerson">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "EditInfo",
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
    const { proxy } = getCurrentInstance();
    let editInfoVisible = ref(false);
    let editInfo = ref({});
    let editRules = ref({
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
    });
    function handleClose() {
      proxy.$refs.editRef.resetFields();
      editInfoVisible.value = false;
    }
    function editPerson() {
      proxy.$refs.editRef.validate(async (valid) => {
        if (!valid) return console.log("error");
        let { data } = await proxy.$http.put("/user/update", {
          _id: proxy.editInfo._id,
          userInfo: editInfo.value,
        });
        if (data.meta.status !== 200)
          return proxy.$message.error(data.meta.des);
        proxy.$message.success("用户信息更新成功");
        editInfoVisible.value = false;
      });
    }
    async function openEditInfo(info) {
      editInfoVisible.value = true;
      let { data } = await proxy.$http.get("/user/userinfo", {
        params: { username: info.username },
      });
      if (data.meta.status !== 200)
        return proxy.$message.error("用户信息获取失败");
      editInfo.value = data.result;
    }
    onMounted(() => {
      proxy.$bus.on("openEditInfo", openEditInfo);
    });
    return { editInfoVisible, editInfo, editRules, handleClose, editPerson };
  },
};
</script>

<style lang="less" scoped>
</style>