<template>
  <el-card class="h640">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础管理</el-breadcrumb-item>
      <el-breadcrumb-item>企业信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="info" ref="infoRef" :rules="infoRules" label-width="120px">
      <el-form-item label="企业" prop="name">
        <el-input v-model="info.name" disabled />
      </el-form-item>
      <el-form-item label="法人" prop="corporation">
        <el-input v-model="info.corporation" />
      </el-form-item>
      <el-form-item label="联系方式" prop="number">
        <el-input v-model="info.number" />
      </el-form-item>
      <el-form-item label="描述" prop="des">
        <el-input v-model="info.des" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input
          v-for="(item, index) in info.address"
          :key="index"
          v-model="info.address[index]"
        ></el-input>
      </el-form-item>
      <el-form-item label="银行卡号" prop="card">
        <el-input
          v-for="(item, index) in info.card"
          :key="index"
          v-model="info.card[index]"
        ></el-input>
      </el-form-item>
    </el-form>
    <div style="float: right">
      <el-button @click="handleClose">重置</el-button>
      <el-button type="primary" @click="updateInfo">确定</el-button>
    </div>
  </el-card>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "Enterprise",
  setup() {
    const { proxy } = getCurrentInstance();
    let info = ref({});
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
    let infoRules = ref({
      corporation: [
        { required: true, message: "请输入法人姓名", trigger: "blur" },
      ],
      number: [
        {
          required: true,
          message: "请输入电话",
          trigger: "blur",
        },
        {
          validator: checkPhone,
          trigger: "blur",
        },
      ],
      des: [
        { required: true, message: "请输入企业描述信息", trigger: "blur" },
      ],
      adddress: [
        { required: true, message: "请输入企业地址信息", trigger: "blur" },
      ],
    });
    async function getInfo() {
      let { data } = await proxy.$http.get("/enterprise");
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      info.value = data.result;
    }
    function handleClose() {
      getInfo();
    }
    async function updateInfo() {
      let { data } = await proxy.$http.put("/enterprise/update", info.value);
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      proxy.$message.success("企业信息更新成功");
      getInfo();
    }
    onMounted(() => {
      getInfo();
    });
    return { info, handleClose, updateInfo, infoRules };
  },
};
</script>

<style lang="less" scoped>
</style>