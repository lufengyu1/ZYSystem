<template>
  <el-dialog
    v-model="disDepVisible"
    title="分配角色"
    width="50%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form :model="disDepInfo" ref="disDepRef" label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="disDepInfo.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="当前部门" prop="department">
        <el-input v-model="disDepInfo.department" disabled></el-input>
      </el-form-item>
      <el-form-item label="分配角色">
        <el-select v-model="department" class="m-2" placeholder="Select">
          <el-option
            v-for="item in depList"
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
        <el-button type="primary" @click="disDep">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "disDep",
  setup() {
    const { proxy } = getCurrentInstance();
    let disDepVisible = ref(false);
    let disDepInfo = ref({});
    let depList = ref({});
    let department = ref("开发部");
    async function openDisDep(info) {
      disDepVisible.value = true;
      disDepInfo.value = info;
      let { data } = await proxy.$http.get("/department");
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      depList.value = data.result;
    }
    function handleClose() {
      proxy.$refs.disDepRef.resetFields();
      disDepVisible.value = false;
    }
    async function disDep() {
      disDepInfo.value.department = department.value;
      let { data } = await proxy.$http.put("/user/updatedep", {
        _id: disDepInfo.value._id,
        department: department.value,
      });
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      proxy.$message.success("用户部门更新成功");
      handleClose();
      department.value = "开发部";
      proxy.$bus.emit("handleClick");
    }
    onMounted(() => {
      proxy.$bus.on("openDisDep", openDisDep);
    });
    return {
      disDepVisible,
      disDepInfo,
      depList,
      department,
      disDep,
      handleClose,
    };
  },
};
</script>

<style lang="less" scoped>
</style>