<template>
  <!-- 卡片试图 -->
  <el-card class="box-card">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区 -->
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          v-model="queryInfo.query"
          clearable
        >
          <template #append>
            <el-button icon="el-icon-search" @click="getUserList"></el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="openAddUserDialog"
          >添加用户</el-button
        >
      </el-col>
    </el-row>
    <!-- 数据渲染区 -->
    <el-table :data="userList" border stripe max-height="470">
      <el-table-column type="index" width="50" label="#"> </el-table-column>
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column prop="phone" label="电话" width="180" />
      <el-table-column prop="role" label="角色" width="180" />
      <el-table-column label="状态" width="180">
        <template #default="scope">
          <el-switch
            v-model="scope.row.state"
            @change="updateState(scope.row)"
            :disabled="scope.row.username === 'admin'"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="">
        <template #default="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="openEditUserDialog(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteUserById(scope.row)"
            :disabled="scope.row.username === 'admin'"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区 -->
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
  <AddUser></AddUser>
  <EditUser/>
</template>

<script>
import AddUser from "../components/user/AddUser.vue";
import EditUser from "../components/user/EditUser.vue";
import { ref, onMounted, getCurrentInstance } from "vue";
export default {
  name: "User",
  components: {
    AddUser,
    EditUser
  },
  setup() {
    const { proxy } = getCurrentInstance();
    let userList = ref([]);
    let queryInfo = ref({ query: "", pageNum: 1, pageSize: 5 });
    let total = ref(0);
    // 获取用户列表
    async function getUserList() {
      const { data } = await proxy.$http.get("/user/users", {
        params: queryInfo.value,
      });
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      userList.value = data.result.users;
      total.value = data.result.total;
    }
    function handleSizeChange() {
      getUserList();
    }
    function handleCurrentChange() {
      getUserList();
    }
    // 禁用 开启 用户登录功能
    async function updateState(info) {
      let { data } = await proxy.$http.put("/user/update", {
        _id: info._id,
        userInfo: { state: info.state },
      });
      if (data.meta.status !== 200) {
        info.state = !info.state;
        return proxy.$message.error(data.meta.des);
      } else {
        if (info.state === true) return proxy.$message.success("用户已开启");
        return proxy.$message.success("用户已禁用");
      }
    }
    // 打开用户添加页面
    function openAddUserDialog() {
      proxy.$bus.emit("openAddUser");
    }
    // 打开用户更新页面
    function openEditUserDialog(info) {
      proxy.$bus.emit('openEditUser',info);
    }
    // 删除用户
    async function deleteUserById(info) {
      let confirmResult = await proxy
        .$confirm(
          "此操作将永久删除用户:" + info.username + ", 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
        .catch((err) => {
          return err;
        });
      if (confirmResult === "confirm") {
        let { data } = await proxy.$http.delete("/user/delete", {
          params: { _id: info._id },
        });
        if (data.meta.status !== 200)
          return proxy.$message.error(data.meta.des);
        proxy.$message.success("用户:" + info.username + "已删除");
        getUserList();
      } else {
        proxy.$message("已取消删除用户:" + info.username);
      }
    }
    onMounted(() => {
      getUserList();
    });
    proxy.$bus.on("getUserList", getUserList);
    return {
      userList,
      queryInfo,
      total,
      getUserList,
      handleSizeChange,
      handleCurrentChange,
      updateState,
      deleteUserById,
      openAddUserDialog,
      openEditUserDialog
    };
  },
};
</script>

<style lang="less" scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
</style>