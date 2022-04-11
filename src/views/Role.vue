<template>
  <el-card style="height:640px">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 1 -->
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input
          placeholder="请输入角色名"
          class="input-with-select"
          v-model="queryInfo.query"
          clearable
          @clear="getRoleList"
        >
          <template #append>
            <el-button icon="el-icon-search" @click="getRoleList"></el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="openAddRoleDialog"
          >添加角色</el-button
        >
      </el-col>
    </el-row>
    <!-- 2 -->
    <el-table :data="roleList" border stripe max-height="470">
      <el-table-column type="index" width="50" label="#"> </el-table-column>
      <el-table-column width="300" label="角色" prop="name"> </el-table-column>
      <el-table-column width="300" label="描述" prop="des"> </el-table-column>
      <el-table-column width="" label="操作">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" size="mini" @click="del(scope.row)"
            >删除</el-button
          ></template
        >
      </el-table-column>
    </el-table>
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
  </el-card>
  <AddRole></AddRole>
  <EditRole></EditRole>
</template>

<script >
import { ref, onMounted, getCurrentInstance } from "vue";
import AddRole from "../components/role/AddRole";
import EditRole from "../components/role/EditRole";
export default {
  name: "Role",
  components: { AddRole, EditRole },
  setup() {
    const { proxy } = getCurrentInstance();
    let roleList = ref([]);
    let queryInfo = ref({ query: "", pageNum: 1, pageSize: 5 });
    let total = ref(0);
    // 获取角色列表
    async function getRoleList() {
      const { data } = await proxy.$http.get("/role", {
        params: queryInfo.value,
      });
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      roleList.value = data.result.users;
      total.value = data.result.total;
    }
    function openAddRoleDialog() {
      proxy.$bus.emit("openAddRole");
    }
    function edit(info) {
      proxy.$bus.emit("openEditRole", info);
    }
    async function del(info) {
      let confirmResult = await proxy
        .$confirm("此操作将永久删除角色：" + info.name + ",是否继续", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .catch((err) => {
          return err;
        });
      if (confirmResult === "confirm") {
        let { data } = await proxy.$http.delete("role/delete", {
          params: { _id: info._id },
        });
        if (data.meta.status !== 200) {
          return proxy.$message.error(data.meta.des);
        }
        proxy.$message.success("角色：" + info.name + "已删除");
        getRoleList();
      }else{
        proxy.$message("已取消删除角色:" + info.name);
      }
    }
    function handleSizeChange() {
      getRoleList();
    }
    function handleCurrentChange() {
      getRoleList();
    }
    onMounted(() => {
      getRoleList();
      proxy.$bus.on("getRoleList", getRoleList);
    });
    return {
      roleList,
      openAddRoleDialog,
      edit,
      del,
      getRoleList,
      queryInfo,
      handleCurrentChange,
      handleSizeChange,
      total,
    };
  },
};
</script>

<style lang="less" scoped>
</style>