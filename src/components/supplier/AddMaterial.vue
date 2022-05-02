<template>
  <el-dialog
    v-model="addMaterialVisible"
    title="添加供应商"
    width="50%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form
      :model="addMaterialInfo"
      :rules="addMaterialRules"
      ref="addMaterialRef"
      label-width="70px"
    >
      <el-form-item label="供应商" prop="supplier">
        <el-input v-model="addMaterialInfo.supplier" disabled></el-input>
      </el-form-item>
      <el-form-item label="原料" prop="name">
        <el-input v-model="addMaterialInfo.name"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input-number v-model="addMaterialInfo.price" />
      </el-form-item>
      <el-form-item label="描述" prop="des">
        <el-input v-model="addMaterialInfo.des"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="addMaterial">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, getCurrentInstance, onMounted, reactive } from "vue";
export default {
  name: "AddMaterial",
  setup() {
    const { proxy } = getCurrentInstance();
    let addMaterialVisible = ref(false);
    let supplierInfo = ref({});
    let addMaterialInfo = ref({
      name: "",
      price: 0,
      des: "",
      supplier: "",
    });
    let addMaterialRules = ref({
      name: [{ required: true, message: "请输入供应商名", trigger: "blur" }],
      price: [{ required: true, message: "请输入供应商名", trigger: "blur" }],
      des: [{ required: true, message: "请输入供应商名", trigger: "blur" }],
    });
    function handleClose() {
      proxy.$refs.addMaterialRef.resetFields();
      addMaterialVisible.value = false;
    }
    function addMaterialDialog(info) {
      addMaterialInfo.value.supplier = info.name;
      supplierInfo.value = info;
      addMaterialVisible.value = true;
    }
    async function addMaterial() {
      proxy.$refs.addMaterialRef.validate(async (valid) => {
        if (!valid) return console.log("err");
        let { data } = await proxy.$http.put("/supplier/insertMaterial", {
          ...supplierInfo.value,
          info: addMaterialInfo.value,
        });
        if (data.meta.status !== 200)
          return proxy.$message.error(data.meta.des);
        proxy.$message.success("原料添加成功");
        handleClose();
        proxy.$bus.emit("getSupplierList");
      });
    }
    onMounted(() => {
      proxy.$bus.on("addMaterialDialog", addMaterialDialog);
    });
    return {
      addMaterialInfo,
      addMaterialVisible,
      addMaterialRules,
      handleClose,
      addMaterial,
    };
  },
};
</script>

<style lang="less" scoped>
</style>