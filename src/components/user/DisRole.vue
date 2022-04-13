<template>
  <el-dialog
    v-model="disRoleVisible"
    title="分配角色"
    width="50%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form :model="disRoleInfo" ref="disRoleRef" label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="disRoleInfo.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="当前角色" prop="role">
        <el-input v-model="disRoleInfo.role" disabled></el-input>
      </el-form-item>
      <el-form-item label="分配角色">
        <el-select v-model="role" class="m-2" placeholder="Select">
          <el-option
            v-for="item in roleList"
            :key="item.name"
            :label="item.name"
            :value="item.name"
            :disabled="item.name === '超级管理员'"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="disRole">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "DisRole",
  setup() {
    const { proxy } = getCurrentInstance();
    let disRoleVisible = ref(false);
    let disRoleInfo = ref({});
    let roleList = ref({});
    let role = ref("普通成员");
    async function openDisRole(info) {
      disRoleVisible.value = true;
      disRoleInfo.value = info;
      let { data } = await proxy.$http.get("/role/role");
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      roleList.value = data.result;
    }
    function handleClose() {
      proxy.$refs.disRoleRef.resetFields();
      disRoleVisible.value = false;
    }
    async function disRole() {
      disRoleInfo.value.role = role.value;
      let { data } = await proxy.$http.put("/user/updaterole", {
        _id: disRoleInfo.value._id,
        role:role.value,
      });
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      proxy.$message.success("用户:"+disRoleInfo.value.username+",角色更新成功");
      handleClose();
      role.value='普通成员';
      proxy.$bus.emit("getUserList");
    }
    onMounted(() => {
      proxy.$bus.on("openDisRole", openDisRole);
    });
    return {
      disRoleVisible,
      disRoleInfo,
      roleList,
      role,
      handleClose,
      disRole,
    };
  },
};
</script>

<style lang="less" scoped>
</style>