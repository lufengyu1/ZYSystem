<template>
  <el-dialog
    v-model="editSupplierVisible"
    title="编辑供应商信息"
    width="50%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form
      :model="editSupplierInfo"
      :rules="editSupplierRules"
      ref="editSupplierRef"
      label-width="70px"
    >
      <el-form-item label="供应商" prop="name">
        <el-input v-model="editSupplierInfo.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="editSupplierInfo.phone"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="editSupplierInfo.address"></el-input>
      </el-form-item>
      <el-form-item label="开户行" prop="bank">
        <el-select
          v-model="editSupplierInfo.bank"
          class="m-2"
          placeholder="请选择银行"
        >
          <el-option
            v-for="item in banks"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="银行卡" prop="card">
        <el-input v-model="editSupplierInfo.card"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="des">
        <el-input v-model="editSupplierInfo.des"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="editSupplier">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, getCurrentInstance, onMounted ,reactive} from "vue";
export default {
  name: "EditSupplier",
  setup() {
    const { proxy } = getCurrentInstance();
    const banks = reactive([
      "中国银行",
      "中国工商银行",
      "中国建设银行",
      "中国农业银行",
    ]);
    //  验证手机号规则
    let checkPhone = (rule, value, cb) => {
      const regPhone =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regPhone.test(value)) return cb();
      cb(new Error("请输入合法的号码"));
    };
    // 验证银行卡号
    let checkCard = (rule, value, cb) => {
      const regCard = /^([1-9]{1})(\d{14}|\d{18})$/;
      if (regCard.test(value)) return cb();
      cb(new Error("请输入合法的银行卡号"));
    };
    let editSupplierVisible = ref(false);
    let editSupplierInfo = ref({});
    let editSupplierRules = ref({
      phone: [
        { required: true, message: "请输入手机号码", trigger: "blur" },
        {
          validator: checkPhone,
          trigger: "blur",
        },
      ],
      card: [
        { required: true, message: "请输入银行卡号", trigger: "blur" },
        {
          validator: checkCard,
          trigger: "blur",
        },
      ],
    });
    function handleClose() {
      proxy.$refs.editSupplierRef.resetFields();
      editSupplierVisible.value = false;
    }
    function openEditSupplier(info) {
      editSupplierVisible.value = true;
      editSupplierInfo.value = info;
    }
    async function editSupplier() {
      proxy.$refs.editSupplierRef.validate(async (valid) => {
        if (!valid) return console.log("error");
        let { data } = await proxy.$http.put(
          "/supplier/update",
          editSupplierInfo.value
        );
        if (data.meta.status !== 200)
          return proxy.$message.error(data.meta.des);
        proxy.$message.success("供应商信息更新成功");
        proxy.$bus.emit("getSupplierList");
        handleClose();
      });
    }
    onMounted(() => {
      proxy.$bus.on("openEditSupplier", openEditSupplier);
    });
    return {
      editSupplierVisible,
      editSupplierInfo,
      editSupplierRules,
      banks,
      editSupplier,
      handleClose,
    };
  },
};
</script>

<style lang="less" scoped>
</style>