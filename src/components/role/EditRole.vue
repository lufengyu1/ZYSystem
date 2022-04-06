<template>
  <el-dialog
    title="编辑角色"
    v-model="editRoleVisible"
    width="50%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form :model="editRoleInfo" ref="editRoleRef" label-width="70px">
      <el-form-item label="角色名">
        <el-input v-model="editRoleInfo.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="editRoleInfo.des"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="editRole">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from "@vue/runtime-core";
export default {
  name: "EditRole",
  setup() {
    const { proxy } = getCurrentInstance();
    let editRoleVisible = ref(false);
    let editRoleInfo = ref({});
    function handleClose() {
      proxy.$refs.editRoleRef.resetFields();
      editRoleVisible.value = false;
    }
    function editRole() {
      proxy.$refs.editRoleRef.validate(async (valid) => {
        if (!valid) return console.log("error");
        let { data } = await proxy.$http.put("/role/update", editRoleInfo.value);
        if (data.meta.status !== 200)
          return proxy.$message.error(data.meta.des);
        proxy.$message.success("角色信息更新成功");
        editRoleVisible.value = false;
        proxy.$bus.emit("getRoleList");
      });
    }
    function openEditRole(info) {
      editRoleInfo.value = info;
      editRoleVisible.value = true;
    }
    onMounted(() => {
      proxy.$bus.on("openEditRole", openEditRole);
    });
    return { editRoleVisible, editRoleInfo, handleClose, editRole };
  },
};
</script>

<style lang="less" scoped>
</style>