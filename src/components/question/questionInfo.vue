<template>
  <el-dialog
    v-model="infoVisible"
    title=""
    width="50%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div id="printMe">
     
      <el-descriptions class="margin-top" :column="2" title="问题账单" border>
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
          出库
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">数量</div>
          </template>
          {{ infoList.quantity }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">问题原因</div>
          </template>
          {{ infoList.reason }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">原料处理</div>
          </template>
          {{ infoList.action }}
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
  name: "QuestionInfo",
  setup() {
    const { proxy } = getCurrentInstance();
    let infoList = ref({});
    let infoVisible = ref(false);
    function handleClose() {
      infoVisible.value = false;
    }
    function openQuestionInfo(info) {
      infoVisible.value = true;
      infoList.value = info;
    }
    onMounted(() => {
      proxy.$bus.on("openQuestionInfo", openQuestionInfo);
    });
    return { handleClose, infoList, infoVisible };
  },
};
</script>

<style lang="less" scoped>
</style> 