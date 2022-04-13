<template>
  <el-card class="h640">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>部门列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 1 -->
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="全部" name="全部"></el-tab-pane>
      <el-tab-pane
        v-for="item in depList"
        :key="item._id"
        :label="item.name"
        :name="item.name"
      ></el-tab-pane>
    </el-tabs>
    <!-- 2 -->
    <el-table :data="userList" border stripe max-height="430">
      <el-table-column type="index" width="50" label="#"> </el-table-column>
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column prop="phone" label="号码" width="180" />
      <el-table-column prop="department" label="部门" width="100" />
      <el-table-column prop="create" label="创建时间" width="" />
      <el-table-column
        label="操作"
        width="180"
        v-if="login.role === '超级管理员'"
      >
        <template #default="scope">
          <el-button
            type="primary"
            size="mini"
            @click="openDisDepDialog(scope.row)"
            >分配部门</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 3 -->
    <el-pagination
      v-model:currentPage="queryInfo.pageNum"
      :page-sizes="[5, 10, 15, 20]"
      v-model:page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <!-- 4 -->
    <el-button class="addDep" type="primary" @click="openAddDepDialog">
      添加部门</el-button
    >
  </el-card>
  <DisDep></DisDep>
  <AddDep></AddDep>
</template>

<script >
import DisDep from "../components/department/DisDep.vue";
import AddDep from "../components/department/AddDep";
import { ref, onMounted, getCurrentInstance } from "vue";
export default {
  name: "Department",
  components: { DisDep, AddDep },
  setup() {
    const { proxy } = getCurrentInstance();
    let depList = ref([]);
    let activeName = ref("全部");
    let userList = ref([]);
    let queryInfo = ref({ query: "", pageNum: 1, pageSize: 5 });
    let total = ref(0);
    const login = ref("");
    // 获取部门列表
    async function getDepList() {
      let { data } = await proxy.$http.get("/department");
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      depList.value = data.result;
    }

    // 点击导航栏 ，重新渲染列表
    async function handleClick(tab, event) {
      if (activeName.value === "全部") {
        queryInfo.value.query = "";
      } else queryInfo.value.query = activeName.value;
      const { data } = await proxy.$http.get("/user/department", {
        params: queryInfo.value,
      });
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      userList.value = data.result.users;
      total.value = data.result.total;
    }
    // 分页
    function handleSizeChange() {
      handleClick();
    }
    function handleCurrentChange() {
      handleClick();
    }
    // 打开分配部门dialog
    function openDisDepDialog(info) {
      proxy.$bus.emit("openDisDep", info);
    }
    function openAddDepDialog() {
      proxy.$bus.emit("openAddDep");
    }
    onMounted(() => {
      login.value = JSON.parse(window.sessionStorage.getItem("loginObj"));
      getDepList();
      handleClick();
      proxy.$bus.on("handleClick", handleClick);
      proxy.$bus.on("getDepList", getDepList);
    });
    return {
      depList,
      activeName,
      handleClick,
      userList,
      queryInfo,
      total,
      login,
      handleSizeChange,
      handleCurrentChange,
      openDisDepDialog,
      openAddDepDialog,
    };
  },
};
</script>

<style lang="less" scoped>
.addDep {
  float: right;
}
</style>