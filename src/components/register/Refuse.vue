<template>
  <el-dialog
    v-model="refuseVisible"
    title="拒绝原因"
    width="50%"
    :before-close="handleClose"
    :close-on-click-modal="false"
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
      <el-form-item label="原料处理">
        <template v-if="registerInfo.operation === 0">
          <el-select v-model="value" class="m-2" placeholder="选择处理方式">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
        <template v-if="registerInfo.operation === 1">
          <el-select v-model="value" class="m-2" placeholder="选择处理方式">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
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
    const value = ref("");
    const options = [
      {
        value: "退货退款",
        label: "退货退款",
      },
      {
        value: "仅退货",
        label: "仅退货",
      },
      {
        value: "仅退款",
        label: "仅退款",
      },
    ];
    const options1 = [
      {
        value: "退回仓库",
        label: "退回仓库",
      },
      {
        value: "仓库处理",
        label: "仓库处理",
      },
    ];
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
      if (reason.value.trim().length === 0 || value.value.trim().length === 0) {
        return proxy.$message.info("拒绝原因、原料处理不能为空");
      }
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
      // 向question表插入
      if (registerInfo.value.operation === 1) {
        let data1 = await proxy.$http.put("/question/insert", {
          ...registerInfo.value,
          reason: reason.value,
          action: value.value,
        });
        // 更新isssuance
        let data3 = await proxy.$http.put("/isssuance/update", {
          id: registerInfo.value.id,
          quantity: registerInfo.value.quantity,
          action: value.value,
        });
      }
      // 向reject表插入
      if (registerInfo.value.operation === 0) {
        let data2 = await proxy.$http.put("/reject/insert", {
          ...registerInfo.value,
          reason: reason.value,
          action: value.value,
        });
        // 更新bill状态
        let data4 = await proxy.$http.put("/bill/update", {
          ...registerInfo.value,
          state: 2,
        });
      }

      proxy.$bus.emit("getRegisterList");
      proxy.$bus.emit("getToDosList");

      handleClose();
    }
    return {
      refuseVisible,
      registerInfo,
      handleClose,
      reason,
      refuse,
      options,
      value,
      options1,
    };
  },
};
</script>

<style lang="less" scoped>
</style>