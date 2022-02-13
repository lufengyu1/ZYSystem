<template>
  <el-card>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>原料信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="materialInfoList" border stripe max-height="500">
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <el-table-column prop="name" label="原料" width="180"></el-table-column>
      <el-table-column prop="supplier" label="供应商" width="180"></el-table-column>
      <el-table-column prop="PD" label="生产日期" width="180"></el-table-column>
      <el-table-column
        prop="EXP"
        label="有效日期"
        width="180"
      ></el-table-column>
      <el-table-column prop="price" label="单价" width="150"></el-table-column>
      <el-table-column
        prop="quantity"
        label="数量"
        width="150"
      ></el-table-column>
      <el-table-column label="操作">
        <template #default=""> 
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
        </template>
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
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "MaterialInfo",
  setup() {
    const { proxy } = getCurrentInstance();
    let materialInfoList = ref([]);
    let queryInfo = ref({
      pageSize: 5,
      pageNum: 1,
    });
    let total = ref(0);
    async function getMaterialInfoList() {
      const { data } = await proxy.$http.get("/materialInfo/materialInfo", {
        params: queryInfo.value,
      });
      console.log(data);
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      total.value=data.result.total
      materialInfoList.value = data.result.materialInfo;
    }
    function handleSizeChange() {
      getMaterialInfoList();
    }
    function handleCurrentChange() {
      getMaterialInfoList();
    }
    onMounted(() => {
      getMaterialInfoList();
    });
    return {
      materialInfoList,
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