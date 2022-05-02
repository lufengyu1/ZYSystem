<template>
  <el-dialog
    v-model="addDepVisible"
    title="添加部门"
    width="50%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form :model="addDepInfo" ref="addDepRef" label-width="70px">
      <el-form-item label="部门名" prop="name">
        <el-input v-model="addDepInfo.name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="addDep">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, onMounted, getCurrentInstance, reactive } from "vue";
export default {
  name: "AddDep",
  setup() {
    const { proxy } = getCurrentInstance();
    let addDepVisible = ref(false);
    let addDepInfo = reactive({});
    function openAddDep() {
      addDepVisible.value = true;
    }
    function handleClose() {
      proxy.$refs.addDepRef.resetFields();
      addDepVisible.value = false;
    }
    async function addDep() {
      let { data } = await proxy.$http.put("/department/insert", addDepInfo);
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      proxy.$message.success("新部门创建成功");
      handleClose();
      proxy.$bus.emit("getDepList");
    }
    onMounted(() => {
      proxy.$bus.on("openAddDep", openAddDep);
    });
    return { addDepInfo, addDepVisible, handleClose, addDep };
  },
};
</script>

<style lang="less" scoped>
</style>