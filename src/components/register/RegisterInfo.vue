<template>
  <el-dialog
    v-model="infoVisible"
    title=""
    width="50%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div id="printMe">
      <el-descriptions
        class="margin-top"
        :column="2"
        :title="infoList.operation === 0 ? '入库单' : '出库单'"
        border
      >
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">订单号</div>
          </template>
          {{ infoList._id }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">原料</div>
          </template>
          {{ infoList.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">操作类型</div>
          </template>
          {{ infoList.operation === 0 ? "入库" : "出库" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">数量</div>
          </template>
          {{ infoList.quantity }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">参数描述</div>
          </template>
          {{ infoList.des }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">制单人</div>
          </template>
          {{ infoList.operator }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">下单时间</div>
          </template>
          {{ infoList.time }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">状态</div>
          </template>
          {{ infoList.status === 1 ? "已接受" : "已拒收" }}
        </el-descriptions-item>
      </el-descriptions>
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