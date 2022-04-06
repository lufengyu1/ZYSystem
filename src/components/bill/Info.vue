<template>
  <el-dialog
    v-model="infoVisible"
    title=""
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div id="printMe">
      <h1 style="margin-bottom: 15px">账单</h1>
      <el-form
        ref="infoRef"
        :model="infoList"
        label-width="70px"
        v-show="infoList.state === 1"
      >
        <el-form-item label="订单号">{{ infoList._id }}</el-form-item>
        <el-form-item label="原料">{{ infoList.name }}</el-form-item>
        <el-form-item label="供应商">{{ infoList.supplier }}</el-form-item>
        <el-form-item label="数量">{{ infoList.quantity }}</el-form-item>
        <el-form-item label="单价">{{ infoList.price }}</el-form-item>
        <el-form-item label="总价">{{ infoList.total }}</el-form-item>
        <el-form-item label="下单人">{{ infoList.operator }}</el-form-item>
        <el-form-item label="下单时间">{{ infoList.time }}</el-form-item>
        <el-form-item label="收货信息">
          安徽省合肥市庐阳区长江中路49号</el-form-item
        >
        <el-form-item label="付款账号"> 6228482918445077111</el-form-item>
        <el-form-item label="收款账号"> {{ supplierInfo.card}}</el-form-item>
      </el-form>
      <el-timeline v-show="infoList.state === 0">
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
      proxy.$refs.infoRef.resetFields();
    }
    
    async function openInfo(info) {
      infoVisible.value = true;
      infoList.value = info;
      if (info.state === 0) {
        let { data } = await proxy.$http.get("/reject/id", {
          params: { id: info._id },
        });
        if (data.meta.status !== 200)
          return proxy.$message.error(data.meta.des);
        questionList.value = data.result;
      }
         let data1 = await proxy.$http.get("/supplier/name", {
        params: { name: info.supplier }});
        supplierInfo.value=data1.data.result;
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