<template>
  <el-dialog
    v-model="infoVisible"
    title=""
    width="50%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div id="printMe">
      <h1 style="margin-bottom: 15px">账单</h1>
      <h2 v-if="infoList.state === 0">等待原料运送</h2>

      <el-descriptions
        class="margin-top"
        :column="2"
        border
        v-if="infoList.state === 1"
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
            <div class="cell-item">供应商</div>
          </template>
          {{ infoList.supplier }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">数量</div>
          </template>
          {{ infoList.quantity }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">单价</div>
          </template>
          {{ infoList.price }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">总价</div>
          </template>
          {{ infoList.total }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">下单人</div>
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
            <div class="cell-item">收货信息</div>
          </template>
          安徽省合肥市庐阳区长江中路49号
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">付款账号</div>
          </template>
          6228482918445077111
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">收款账号</div>
          </template>
          {{ supplierInfo.card }}
        </el-descriptions-item>
      </el-descriptions>
      <el-timeline v-if="infoList.state === 2">
        <el-timeline-item :timestamp="infoList.time">
          下单时间
        </el-timeline-item>
        <el-timeline-item :timestamp="infoList.time">
          问题：{{ questionList.reason }}
        </el-timeline-item>
        <el-timeline-item :timestamp="infoList.time">
          等待退款中
        </el-timeline-item>
        <el-timeline-item> ...... </el-timeline-item>
      </el-timeline>
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
  name: "Info",
  setup() {
    const { proxy } = getCurrentInstance();
    let infoList = ref({});
    let questionList = ref({});
    let infoVisible = ref(false);
    let supplierInfo = ref({});
    function handleClose() {
      infoVisible.value = false;
      if (proxy.$refs.infoRef) {
        proxy.$refs.infoRef.resetFields();
      }
    }

    async function openInfo(info) {
      infoVisible.value = true;
      infoList.value = info;
      if (info.state === 2) {
        let { data } = await proxy.$http.get("/reject/id", {
          params: { id: info._id },
        });
        if (data.meta.status !== 200)
          return proxy.$message.error(data.meta.des);
        questionList.value = data.result;
      }
      let data1 = await proxy.$http.get("/supplier/name", {
        params: { name: info.supplier },
      });
      supplierInfo.value = data1.data.result;
    }
    onMounted(() => {
      proxy.$bus.on("openInfo", openInfo);
    });
    return { handleClose, infoList, infoVisible, questionList, supplierInfo };
  },
};
</script>

<style lang="less" scoped>
</style> 