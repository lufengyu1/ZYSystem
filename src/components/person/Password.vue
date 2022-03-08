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
      <el-form-item label="新密码" >
        <el-input v-model="pwd"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" >
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
    let pwd=ref('');
    let pwd1=ref('');
    function handleClose() {
      proxy.$refs.editRef.resetFields();
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
    function editPassword(){}
    onMounted(() => {
      proxy.$bus.on("openEditPassword", openEditPassword);
    });
    return { editPasswordVisible, handleClose ,editInfo,editPassword,editRules,pwd,pwd1};
  },
};
</script>

<style lang="less" scoped>
</style>