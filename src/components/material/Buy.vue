<template>
  <el-dialog
    v-model="buyVisible"
    title="购买原料"
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form ref="buyRef" :model="materialInfo" label-width="70px">
      <el-form-item label="原料">{{ materialInfo.name }}</el-form-item>
      <el-form-item label="供应商">{{ materialInfo.supplier }}</el-form-item>
      <el-form-item label="价格">{{ materialInfo.price }}元/千克</el-form-item>
      <el-form-item label="数量"
        ><el-input-number v-model="number" :step="10" :min="0"
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
  name: "Buy",
  setup() {
    const getCurrentTime = require("../../assets/fun/getTime");
    const { proxy } = getCurrentInstance();
    let buyVisible = ref(false);
    let materialInfo = ref({});
    let number = ref(0);
    // 获取购买原料的信息
    function openBuy(info) {
      buyVisible.value = true;
      materialInfo.value = info;
    }
    function handleClose() {
      proxy.$refs.buyRef.resetFields();
      number.value = 0;
      buyVisible.value = false;
    }
    function multiply(a, b) {
      let getMul = (num) =>
        num.toString().indexOf(".") == -1
          ? 0
          : num.toString().split(".")[1].length;
      let mathpow = (a) => a * 10 ** getMul(a);
      // console.log((mathpow(a) * mathpow(b)) / 10 ** (getMul(a) + getMul(b)));
      return (mathpow(a) * mathpow(b)) / 10 ** (getMul(a) + getMul(b));
    }

    // 购买成功 向bill 和 register 中添加对应的信息
    async function insert() {
      if (number.value <= 0) return proxy.$message.info("购买数量必须大于0");
      let x= multiply(materialInfo.value.price, number.value);
      let billInfo = {
        name: materialInfo.value.name,
        supplier: materialInfo.value.supplier,
        PD: materialInfo.value.PD,
        EXP: materialInfo.value.EXP,
        price: materialInfo.value.price,
        quantity: number.value,
        total:x,
        status: 0,
        operator: JSON.parse(window.sessionStorage.getItem("loginObj"))
          .username,
        time: getCurrentTime(),
      };
      let { data } = await proxy.$http.put("/bill/insert", billInfo);
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      console.log(data.result._id);
      proxy.$message.success(data.meta.des);
      let registerInfo = {
        id: data.result._id,
        name: data.result.name,
        operation: 0,
        quantity: number.value,
        operator: "",
        time: "",
        status: 0,
      };
      let data1 = await proxy.$http.put("/register/insert", registerInfo);
      if (data1.data.meta.status !== 200)
        return proxy.$message.error(data1.data.meta.des);
      proxy.$message.success(data1.data.meta.des);
      number.value = 0;
      buyVisible.value = false;
    }

    onMounted(() => {
      proxy.$bus.on("openBuy", openBuy);
    });
    return {
      buyVisible,
      handleClose,
      materialInfo,
      number,
      insert,
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