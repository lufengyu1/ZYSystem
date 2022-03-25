<template>
  <el-dialog
    v-model="editPriceVisible"
    title="修改原料价格"
    width="50%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form
      :model="editPriceInfo"
      ref="editPriceRef"
      label-width="70px"
    >
      <el-form-item label="原料" prop="name">
        <el-input v-model="editPriceInfo.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="供应商" prop="supplier">
        <el-input v-model="editPriceInfo.supplier" disabled></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="editPriceInfo.price"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="editPrice">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "EditPrice",
  setup() {
    const { proxy } = getCurrentInstance();
    let editPriceVisible = ref(false);
    let editPriceInfo = ref({});
    function handleClose() {
      proxy.$refs.editPriceRef.resetFields();
      editPriceVisible.value = false;
    }
    function openEditPrice(info) {
      editPriceVisible.value = true;
      editPriceInfo.value = info;
    }
    async function editPrice() {
        let {data} = await proxy.$http.put('/supplier/updateMaterial',editPriceInfo.value);
        if(data.meta.status!==200) return proxy.$message.error(data.meta.des);
        proxy.$message.success("原料信息修改成功");
        proxy.$bus.emit('getSupplierList');
        editPriceVisible.value = false;
    }
    onMounted(() => {
      proxy.$bus.on("openEditPrice", openEditPrice);
    });

    return {
      handleClose,
      editPrice,
      editPriceVisible,
      editPriceInfo,
    };
  },
};
</script>

<style lang="less" scoped>
</style>