<template>
  <el-card>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>供应商信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="supplierList" border stripe max-height="500">
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <el-table-column prop="name" label="供应商" width="180"></el-table-column>
      <el-table-column prop="des" label="描述" width="180"></el-table-column>
      <el-table-column prop="CD" label="创建日期" width="180"></el-table-column>
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
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "Supplier",
  setup() {
    const { proxy } = getCurrentInstance();
    let supplierList = ref([]);
    let queryInfo = ref({
      pageNum: 1,
      pageSize: 5,
    });
    let total = ref(0);
    // 获取供应商信息
    async function getSupplierList() {
      let { data } = await proxy.$http.get("/supplier/supplier", {
        params: queryInfo.value,
      });
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      supplierList.value = data.result.supplierList;
      total.value = data.result.total;
    }
    function handleSizeChange() {
      getSupplierList();
    }
    function handleCurrentChange() {
      getSupplierList();
    }
    onMounted(() => {
      getSupplierList();
    });
    return {
      supplierList,
      queryInfo,
      total,
      handleSizeChange,
      handleCurrentChange,
    };
  },
};
</script>

<style lang="less" scoped>
</style>