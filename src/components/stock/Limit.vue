<template>
  <el-dialog
    v-model="limitVisible"
    title="设置原料下限"
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form :model="limitInfo" ref="limitRef" label-width="70px">
      <el-form-item label="原料" prop="name"
        >{{ limitInfo.name }}
      </el-form-item>
      <el-form-item label="库存">
        {{ limitInfo.quantity }}
      </el-form-item>
      <el-form-item label="下限" prop="limit">
        <el-input-number
          v-model="limitInfo.limit"
          :min="0"
          controls-position="right"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="update">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "Limit",
  setup() {
    const { proxy } = getCurrentInstance();
    let limitVisible = ref(false);
    let limitInfo = ref({});
    function handleClose() {
      proxy.$refs.limitRef.resetFields();
      limitVisible.value = false;
    }
    function openLimit(info) {
      limitVisible.value = true;
      limitInfo.value = info;
    }
    async function update() {
      let {data}=await proxy.$http.put('/stock/update',{...limitInfo.value,type:1});
      if(data.meta.status!==200) return proxy.$message.error(data.meta.des);
      proxy.$bus.emit('getStockList');
      limitVisible.value=false;
    }
    onMounted(() => {
      proxy.$bus.on("openLimit", openLimit);
    });
    return {
      limitVisible,
      limitInfo,
      handleClose,
      update,
    };
  },
};
</script>

<style lang="less" scoped>
</style>