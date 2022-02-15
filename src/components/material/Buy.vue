<template>
  <el-dialog
    v-model="buyVisible"
    title="购买原料"
    width="30%"
    :before-close="handleClose"
  >
    <el-form ref="buyRef" :model="materialInfo" label-width="70px">
      <el-form-item label="原料">{{ materialInfo.name }}</el-form-item>
      <el-form-item label="供应商">{{ materialInfo.supplier }}</el-form-item>
      <el-form-item label="生产日期">{{ materialInfo.PD }}</el-form-item>
      <el-form-item label="有效日期">{{ materialInfo.EXP }}</el-form-item>
      <el-form-item label="数量"
        ><el-input
          v-model="quantity"
          @keyup="keyUp"
          @keydown="keyDown"
        ></el-input
      ></el-form-item>
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
  name: "Buy",
  setup() {
    const { proxy } = getCurrentInstance();
    let buyVisible = ref(false);
    let materialInfo = ref({});
    let quantity = ref(0);
    function openBuy(info) {
      buyVisible.value = true;
      materialInfo.value = info;
    }
    function handleClose() {
      proxy.$refs.buyRef.resetFields();
      quantity.value=0
      buyVisible.value = false;
      
    }
    function registerInsert() {}
    async function insert() {
      if (quantity.value <= 0) return proxy.$message.info("购买数量必须大于0");
      if (isNaN(quantity.value)) return proxy.$message.info("请输入正确的数字");
      let billInfo = {
        name: materialInfo.value.name,
        supplier: materialInfo.value.supplier,
        PD: materialInfo.value.PD,
        EXP: materialInfo.value.EXP,
        price: materialInfo.value.price,
        quantity: quantity.value,
        total: materialInfo.value.price * quantity.value,
        status: 0,
      };
      let { data } = await proxy.$http.put("/bill/insert", billInfo);
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      proxy.$message.success(data.meta.des);
      let registerInfo = {
        id: data.result._id,
        name: data.result.name,
        operation: 0,
        operator: "",
        time: "",
        status: 0,
      };
      let data1 = await proxy.$http.put("/register/insert", registerInfo);
      if (data1.data.meta.status !== 200)
        return proxy.$message.error(data1.data.meta.des);
      proxy.$message.success(data1.data.meta.des);
      quantity.value=0;
      buyVisible.value = false;
    }
    function keyUp(e) {
      e.target.value = e.target.value.replace(/[^\d]/g,"");
    }
    function keyDown(e) {
      e.target.value = e.target.value.replace(/[^\d]/g,"");
    }
    onMounted(() => {
      proxy.$bus.on("openBuy", openBuy);
    });
    return {
      buyVisible,
      handleClose,
      materialInfo,
      quantity,
      insert,
      keyUp,
      keyDown
    };
  },
};
</script>

<style lang="less" scoped>
.el-input {
  width: 50px;
}
.el-form {
  margin-left: 30%;
}
</style>