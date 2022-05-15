<template>
  <el-card style="height: 640px">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>人力资源管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 1 -->
    <!-- <el-row :gutter="20">
      <el-col :span="7">
        <el-input
          placeholder="请输入权限名"
          class="input-with-select"
          v-model="queryInfo.query"
          clearable
           :disabled="!rights.includes('644')"
          @clear="getRightList"
        >
          <template #append>
            <el-button icon="el-icon-search" @click="getRightList" :disabled="!rights.includes('644')"></el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="openAddRightDialog" :disabled="!rights.includes('641')"
          >添加权限</el-button
        >
      </el-col>
    </el-row> -->
    <!-- 2 -->
    <el-table
      :data="rightList"
      border
      stripe
      max-height="470"
      v-loading="loading"
    >
      <el-table-column type="index" width="50" label="#"> </el-table-column>
      <el-table-column width="300" label="权限" prop="name"> </el-table-column>
      <el-table-column
        width="300"
        label="等级"
        prop="level"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.level === 0">一级权限</el-tag>
          <el-tag v-else-if="scope.row.level === 1" type="warning"
            >二级权限</el-tag
          >
          <el-tag v-else type="danger">三级权限</el-tag>
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
  </el-card>
</template>

<script>
import { ref, onMounted, getCurrentInstance, reactive } from "vue";
export default {
  name: "Right",
  setup() {
    const { proxy } = getCurrentInstance();
    let rightList = ref([]);
    let queryInfo = reactive({
      query: "",
      pageNum: 1,
      pageSize: 5,
      type: "level",
      num: 1,
    });
    let loading = ref(true);
    let total = ref(0);
    let rights = ref([]);
    async function getRightList() {
      const { data } = await proxy.$http.get("/right", { params: queryInfo });
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      rightList.value = data.result.rights;
      total.value = data.result.total;
      loading.value = false;
    }
    function openAddRightDialog() {}
    function handleSizeChange() {
      getRightList();
    }
    function handleCurrentChange() {
      getRightList();
    }
    onMounted(() => {
      rights.value = JSON.parse(window.sessionStorage.getItem("role"));
      getRightList();
    });
    return {
      rightList,
      queryInfo,
      loading,
      total,
      getRightList,
      openAddRightDialog,
      handleCurrentChange,
      handleSizeChange,
      rights,
    };
  },
};
</script>

<style lang="less" scoped>
</style>