<template>
  <el-dialog
    v-model="outVisible"
    title="原料出库"
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form ref="outRef" :model="outInfo" label-width="70px">
      <el-form-item label="原料">{{ outInfo.name }}</el-form-item>
      <el-form-item label="供应商">{{ outInfo.supplier }}</el-form-item>
      <el-form-item label="总量">{{ outInfo.quantity }}</el-form-item>
      <el-form-item label="可用">{{ outInfo.userable }}</el-form-item>
      <el-form-item label="数量">
        <el-input-number
          v-model="number"
          :step="10"
          :min="0"
          :max="outInfo.quantity"
      /></el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="insert">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "Out",
  setup() {
    const { proxy } = getCurrentInstance();
    let outInfo = ref({});
    let outVisible = ref(false);
    let number = ref(0);
    function handleClose() {
      outVisible.value = false;
      proxy.$refs.outRef.resetFields();
      number.value = 0;
    }
    async function insert() {
      if (number.value <= 0) return proxy.$message.info("出库数量必须大于0");
      let registerInfo = {
        id: outInfo.value._id,
        name: outInfo.value.name,
        operation: 1,
        quantity: number.value,
        operator: "",
        time: "",
        status: 0,
      };
      // 更新出库列表
      let data1 = await proxy.$http.put("/isssuance/update1", registerInfo);
      if (data1.data.meta.status !== 200) {
        return proxy.$message.error(data1.data.meta.des);
      } else {
        let { data } = await proxy.$http.put("/register/insert", registerInfo);
        if (data.meta.status !== 200)
          return proxy.$message.error(data.meta.des);
        proxy.$message.success(data.meta.des);
        handleClose();
        proxy.$bus.emit("getIsssuanceList");
      }
    }
    function openOut(info) {
      outVisible.value = true;
      outInfo.value = info;
    }

    onMounted(() => {
      proxy.$bus.on("openOut", openOut);
    });
    return {
      handleClose,
      insert,
      outVisible,
      outInfo,
      number,
    };
  },
};
</script>

<style lang="less" scoped>
</style>