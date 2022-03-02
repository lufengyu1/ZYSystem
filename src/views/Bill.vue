<template>
  <el-card>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>账单信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="billList" border stripe max-height="500">
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <el-table-column prop="_id" width="220" label="订单号"></el-table-column>
      <el-table-column
        prop="supplier"
        label="供应商"
        width="180"
      ></el-table-column>
      <el-table-column prop="name" label="材料" width="180"></el-table-column>
      <el-table-column
        prop="quantity"
        label="数量/千克"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="price"
        label="单价/元"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="total"
        label="总价/元"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="operator"
        label="操作人"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="time"
        label="下单时间"
        width="150"
      ></el-table-column>

      <el-table-column label="状态">
        <template #default="scope">
          <i v-if="scope.row.state === 0">处理中</i>
          <i v-else-if="scope.row.state === 1">完成</i>
          <i v-else>异常</i>
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
  name: "Bill",
  setup() {
    const { proxy } = getCurrentInstance();
    let billList = ref([]);
    let queryInfo = ref({
      pageNum: 1,
      pageSize: 5,
    });
    let total = ref(0);
    // 获取账单信息
    async function getBillList() {
      let { data } = await proxy.$http.get("/bill/bill", {
        params: queryInfo.value,
      });
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      billList.value = data.result.billList;
      total.value = data.result.total;
    }

    function handleSizeChange() {
      getBillList();
    }
    function handleCurrentChange() {
      getBillList();
    }
    onMounted(() => {
      getBillList();
    });
    return {
      billList,
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