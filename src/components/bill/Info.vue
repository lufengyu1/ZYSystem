<template>
  <el-dialog
    v-model="infoVisible"
    title="原料出库"
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form ref="infoRef" :model="infoList" label-width="70px">
      <el-form-item label="原料">{{ infoList.name }}</el-form-item>
      <el-form-item label="供应商">{{ infoList.supplier }}</el-form-item>
      <el-form-item label="数量">{{ infoList.quantity }}</el-form-item>
      <el-form-item label="单价">{{ infoList.price }}</el-form-item>
      <el-form-item label="总价">{{ infoList.total }}</el-form-item>
      <el-form-item label="下单人">{{ infoList.operator }}</el-form-item>
      <el-form-item label="下单时间">{{ infoList.time }}</el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="printInfo">打印</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "Info",
  setup() {
    const { proxy } = getCurrentInstance();
    let infoList = ref({});
    let infoVisible = ref(false);
    function handleClose() {
      infoVisible.value = false;
      proxy.$refs.infoRef.resetFields();
    }
    function openInfo(info) {
      infoVisible.value = true;
      infoList.value = info;
      console.log();
    }
    function printInfo() {}
    onMounted(() => {
      proxy.$bus.on("openInfo", openInfo);
    });
    return { handleClose, infoList, infoVisible, printInfo };
  },
};
</script>

<style lang="less" scoped>

</style> 