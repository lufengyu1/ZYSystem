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
      :model="editInfo"
      :rules="editRules"
      ref="editRef"
      label-width="70px"
    >
      <el-form-item label="用户名">
        <el-input v-model="editInfo.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="pwd"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="pwd1"></el-input>
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
    let editRules = ref({});
    let pwd = ref("");
    let pwd1 = ref("");
    function handleClose() {
      proxy.$refs.editRef.resetFields();
      pwd.value = "";
      pwd1.value = "";
      editPasswordVisible.value = false;
    }
    async function openEditPassword(info) {
      editPasswordVisible.value = true;
      let { data } = await proxy.$http.get("/user/userinfo", {
        params: { username: info.username },
      });
      if (data.meta.status !== 200)
        return proxy.$message.error("用户信息获取失败");
      editInfo.value = data.result;
    }
    async function editPassword() {
      if (pwd.value.length < 6 || pwd.value.length > 18)
        return proxy.$message.info("密码长度在6到18位");
      if (pwd.value !== pwd1.value)
        return proxy.$message.info("新密码和确认密码不一致");
      let { data } = await proxy.$http.put("/user/update", {
        _id: proxy.editInfo._id,
        userInfo: {password:pwd.value},
      });
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      proxy.$message.success("用户密码更新成功");
      editPasswordVisible.value = false;
      proxy.$bus.emit('logout');
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
      pwd,
      pwd1,
    };
  },
};
</script>

<style lang="less" scoped>
</style>