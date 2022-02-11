<template>
  <el-card>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>原料库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>登记出入库信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="registerList" border stripe max-height="470">
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <el-table-column prop="name" label="原料" width="180"></el-table-column>
      <el-table-column label="出库/入库" width="180">
        <template #default="scope">
          {{scope.row.operation===0?'出库':'入库'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="operator"
        label="操作人"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="time"
        label="操作时间"
        width="180"
      ></el-table-column>
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
  name: "Register",
  setup() {
    const { proxy } = getCurrentInstance();
    let registerList = ref([]);
    let queryInfo = ref({
      pageNum: 1,
      pageSize: 5,
    });
    let total = ref(0);
    async function getRegisterList() {
      let { data } = await proxy.$http.get("/register/register", {
        params: queryInfo.value,
      });
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      registerList.value = data.result.registerList;
      total.value = data.result.total;
    }
    function handleSizeChange() {
      getRegisterList();
    }
    function handleCurrentChange() {
      getRegisterList();
    }
    onMounted(() => {
      getRegisterList();
    });
    return {
      registerList,
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