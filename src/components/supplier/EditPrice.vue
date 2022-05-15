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
      :rules="editMaterialRules"
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
        <el-input-number v-model="editPriceInfo.price" :min="0" />
      </el-form-item>
      <el-form-item label="描述" prop="des">
        <el-input v-model="editPriceInfo.des"></el-input>
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
    const checkPrice = (rule, value, cb) => {
      if (value <= 0) return cb(new Error("数量不能为0"));
      return cb();
    };
    let editMaterialRules = ref({
      name: [{ required: true, message: "请输入供应商名", trigger: "blur" }],
      price: [{ required: true, message: "请输入供应商名", trigger: "blur" }],
      des: [{ required: true, message: "请输入供应商名", trigger: "blur" }],
      price: [{ validator: checkPrice, trigger: "blur" }],
    });
    function handleClose() {
      proxy.$refs.editPriceRef.resetFields();
      editPriceVisible.value = false;
    }
    function openEditPrice(info) {
      editPriceVisible.value = true;
      editPriceInfo.value = info;
    }
    async function editPrice() {
      if(!editPriceInfo.value.price||editPriceInfo.value.price<=0) return proxy.$message.info('请设置合理的价格');
      let { data } = await proxy.$http.put(
        "/supplier/updateMaterial",
        editPriceInfo.value
      );
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      proxy.$message.success("原料信息修改成功");
      proxy.$bus.emit("getSupplierList");
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
      editMaterialRules,
    };
  },
};
</script>

<style lang="less" scoped>
</style>