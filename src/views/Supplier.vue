<template>
  <el-card>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>供应商信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区 -->
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input
          placeholder="请输入供应商名"
          class="input-with-select"
          v-model="queryInfo.query"
          clearable
          @clear="getSupplierList"
        >
          <template #append>
            <el-button icon="el-icon-search" @click="getSupplierList"></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="supplierList" border stripe max-height="500">
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <el-table-column prop="name" label="供应商" width="180"></el-table-column>
      <el-table-column prop="des" label="描述" width="180"></el-table-column>
      <el-table-column
        prop="phone"
        label="联系方式"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="card"
        label="银行卡号"
        width="180"
      ></el-table-column>
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
      query:''
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
      getSupplierList
    };
  },
};
</script>

<style lang="less" scoped>
</style>