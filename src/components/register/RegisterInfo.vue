<template>
  <el-dialog
    v-model="infoVisible"
    title=""
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div id="printMe">
      <h1 v-if="infoList.operation === 0">入库单</h1>
      <h1 v-if="infoList.operation === 1">出库单</h1>
      <el-form ref="infoRef" :model="infoList" label-width="70px">
        <el-form-item label="订单号">{{ infoList._id }}</el-form-item>
        <el-form-item label="原料">{{ infoList.name }}</el-form-item>
        <el-form-item label="操作类型"
          ><template v-if="infoList.operation === 0">入库</template>
          <template v-if="infoList.operation === 1"
            >出库</template
          ></el-form-item
        >
        <el-form-item label="数量">{{ infoList.quantity }}</el-form-item>
        <el-form-item label="制单人">{{ infoList.operator }}</el-form-item>
        <el-form-item label="制单时间">{{ infoList.time }}</el-form-item>
        <el-form-item label="状态">
          <template v-if="infoList.status === 1">已接受</template
          ><template v-if="infoList.status === 2"
            >已拒收</template
          ></el-form-item
        >
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button v-print="'#printMe'" type="primary">打印</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "RegisterInfo",
  setup() {
    const { proxy } = getCurrentInstance();
    let infoList = ref({});
    let infoVisible = ref(false);
    function handleClose() {
      infoVisible.value = false;
      proxy.$refs.infoRef.resetFields();
    }
    function openRegisterInfo(info) {
      infoVisible.value = true;
      infoList.value = info;
    }
    onMounted(() => {
      proxy.$bus.on("openRegisterInfo", openRegisterInfo);
    });
    return { handleClose, infoList, infoVisible };
  },
};
</script>

<style lang="less" scoped>
</style>