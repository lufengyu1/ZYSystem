<template>
  <el-card>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>部门列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 1 -->
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
       <el-tab-pane label="全部" name=""></el-tab-pane>
      <el-tab-pane v-for="item in depList" :key="item._id" :label="item.name" :name="item.name">{{item.name}}</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script >
import { ref, onMounted, getCurrentInstance } from "vue";
export default {
  name: "Department",
  setup() {
    const { proxy } = getCurrentInstance();
    let depList = ref([]);
    let activeName = ref("全部");
    async function getDepList() {
      let { data } =await proxy.$http.get("/department");
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      depList.value = data.result;
    }
    const handleClick = (tab, event) => {
      console.log(tab.props.name);
    };
    onMounted(() => {
      getDepList();
    });
    return { depList, activeName, handleClick };
  },
};
</script>

<style lang="less" scoped>
</style>