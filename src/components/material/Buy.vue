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
      <el-form-item label="参数描述">{{ materialInfo.des }}</el-form-item>
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
    let enterpriseInfo = ref({});
    let supplierInfo = ref({});
    let number = ref(0);
    // 获取购买原料的信息
    async function openBuy(info) {
      buyVisible.value = true;
      materialInfo.value = info;
      // 获取供应商信息
      let { data } = await proxy.$http.get("/supplier/name", {
        params: { name: info.supplier },
      });
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      supplierInfo.value = data.result;
    }
    function handleClose() {
      proxy.$refs.buyRef.resetFields();
      number.value = 0;
      buyVisible.value = false;
    }
    // 获取公司信息
    async function getEnterpriseInfo() {
      let { data } = await proxy.$http.get("/enterprise");
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      enterpriseInfo.value = data.result;
    }

    // 精确乘法
    function multiply(arg1, arg2) {
      var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
      try {
        m += s1.split(".")[1].length;
      } catch (e) {}
      try {
        m += s2.split(".")[1].length;
      } catch (e) {}
      return (
        (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
        Math.pow(10, m)
      );
    }

    // 购买成功 向bill 和 register 中添加对应的信息
    async function insert() {
      if (number.value <= 0 || !number.value)
        return proxy.$message.info("购买数量必须大于0");
      let x = multiply(materialInfo.value.price, number.value);
      let billInfo = {
        name: materialInfo.value.name,
        supplier: materialInfo.value.supplier,
        PD: materialInfo.value.PD,
        EXP: materialInfo.value.EXP,
        price: materialInfo.value.price,
        des: materialInfo.value.des,
        quantity: number.value,
        total: x,
        status: 0,
        operator: JSON.parse(window.sessionStorage.getItem("loginObj"))
          .username,
        time: getCurrentTime(),
        fkcard: enterpriseInfo.value.card[0],
        skcard: supplierInfo.value.card,
        shaddress: enterpriseInfo.value.address[0],
        fhaddress: supplierInfo.value.address,
      };
      let { data } = await proxy.$http.put("/bill/insert", billInfo);
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      let registerInfo = {
        id: data.result._id,
        name: data.result.name,
        operation: 0,
        quantity: number.value,
        price: materialInfo.value.price,
        des: materialInfo.value.des,
        operator: "",
        time: "",
        status: 0,
      };
      let data1 = await proxy.$http.put("/register/insert", registerInfo);
      if (data1.data.meta.status !== 200)
        return proxy.$message.error(data1.data.meta.des);
      proxy.$message.success('账单已创建');
      number.value = 0;
      buyVisible.value = false;
    }

    onMounted(() => {
      getEnterpriseInfo();
      proxy.$bus.on("openBuy", openBuy);
    });
    return {
      buyVisible,
      handleClose,
      materialInfo,
      number,
      insert,
      enterpriseInfo,
      supplierInfo,
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