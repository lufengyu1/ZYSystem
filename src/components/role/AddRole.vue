<template>
  <el-dialog
    v-model="addRoleVisible"
    title="添加角色"
    width="50%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form
      :model="addRoleInfo"
      :rules="addRoleRules"
      ref="addRoleRef"
      label-width="70px"
    >
      <el-form-item label="角色名" prop="name">
        <el-input v-model="addRoleInfo.name"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="des">
        <el-input v-model="addRoleInfo.des"></el-input> </el-form-item
    ></el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="addRole">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "AddRole",
  setup() {
    const { proxy } = getCurrentInstance();
    let addRoleVisible = ref(false);
    let addRoleInfo = ref({});
    let addRoleRules = ref({
      name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    });

    function addRole() {
      proxy.$refs.addRoleRef.validate(async (valid) => {
        if (!valid) return console.log(err);
        let { data } = await proxy.$http.put("/role/insert", addRoleInfo.value);
        if (data.meta.status !== 200) {
          return proxy.$message.error(data.meta.des);
        }
        proxy.$message.success("角色:"+addRoleInfo.value.name+",添加成功");
        proxy.addRoleVisible = false;
        proxy.$bus.emit('getRoleList');
      });
    }
    function openAddRole() {
      addRoleVisible.value = true;
    }
    function handleClose() {
      proxy.$refs.addRoleRef.resetFields();
      addRoleVisible.value = false;
    }
    onMounted(() => {
      proxy.$bus.on("openAddRole", openAddRole);
    });
    return { addRoleVisible, addRoleInfo, addRoleRules, addRole, handleClose };
  },
};
</script>

<style lang="less" scoped>
</style>