<template>
  <el-card style="height:640px">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>原料库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>原料库存检查</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="stockList" border stripe max-height="470">
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <el-table-column prop="name" label="原料" width="180"></el-table-column>
      <el-table-column
        prop="quantity"
        label="库存"
        width="150"
      ></el-table-column>
      <el-table-column prop="limit" label="下限" width="150"></el-table-column>
      <el-table-column label="设置下限" width="150">
        <template #default="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="openLimitDialog(scope.row)"></el-button>
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
  <Limit></Limit>
</template>

<script>
import Limit from '../components/stock/Limit.vue'
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "Stock",
  components:{Limit},
  setup() {
    const { proxy } = getCurrentInstance();
    let stockList = ref([]);
    let queryInfo = ref({
      pageNum: 1,
      pageSize: 5,
    });
    let total = ref(0);
    // 获取库存信息
    async function getStockList() {
      let { data } = await proxy.$http.get("/stock/stock", {
        params: queryInfo.value,
      });
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      stockList.value = data.result.stockList;
      total.value = data.result.total;
    }
    function handleSizeChange() {
      getStockList();
    }
    function handleCurrentChange() {
      getStockList();
    }
    //openLimitDialog
    function openLimitDialog(info){
      proxy.$bus.emit('openLimit',info);
    }
    onMounted(() => {
      getStockList();
    });
    proxy.$bus.on('getStockList',getStockList)
    return {
      stockList,
      queryInfo,
      total,
      handleSizeChange,
      handleCurrentChange,
      openLimitDialog
    };
  },
};
</script>

<style lang="less" scoped>
</style>