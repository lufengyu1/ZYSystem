<template>
  <el-dialog
    v-model="refuseVisible"
    title="拒收原因"
    width="50%"
    :before-close="handleClose"
  >
    <el-form :model="registerInfo" ref="refuseRef" label-width="70px">
      <el-form-item label="订单号" prop="id"
        >{{ registerInfo.id }}
      </el-form-item>
      <el-form-item label="原料" prop="name"
        >{{ registerInfo.name }}
      </el-form-item>
      <el-form-item label="拒收原因">
        <el-input
          v-model="reason"
          :rows="2"
          type="textarea"
          placeholder="Please input"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="refuse">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "Refuse",
  setup() {
    const { proxy } = getCurrentInstance();
    const getCurrentTime = require("../../assets/fun/getTime");
    proxy.$bus.on("openRefuse", openRefuse);
    let refuseVisible = ref(false);
    let registerInfo = ref({});
    let reason = ref("");
    // 拒绝原料的信息
    function openRefuse(info) {
      refuseVisible.value = true;
      registerInfo.value = info;
    }
    function handleClose() {
      refuseVisible.value = false;
      proxy.$refs.refuseRef.resetFields();
      reason.value = "";
    }
    // 拒绝原料入库 填写原因
    async function refuse() {
      let time = getCurrentTime();
      let name = JSON.parse(window.sessionStorage.getItem("loginObj")).username;
      registerInfo.value.time = time;
      registerInfo.value.operator = name;
      registerInfo.value.status = 2;
      let { data } = await proxy.$http.put(
        "/register/update",
        registerInfo.value
      );
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      proxy.$message.success(data.meta.des);
      proxy.$bus.emit("getRegisterList");
      let data1 = await proxy.$http.put("/question/insert", {
        ...registerInfo.value,
        reason: reason.value,
      });
      if(registerInfo.value.operation===0){
        
      }
      handleClose();
    }
    return { refuseVisible, registerInfo, handleClose, reason, refuse };
  },
};
</script>

<style lang="less" scoped>
</style>