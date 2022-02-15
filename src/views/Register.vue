<template>
  <el-card>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>原料库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>登记出入库信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  Badege -->
    <el-tabs class="demo-tabs">
      <el-tab-pane label="全部信息"
        ><el-table :data="registerList" border stripe max-height="450">
          <el-table-column type="index" width="50" label="#"></el-table-column>
          <el-table-column
            prop="name"
            label="原料"
            width="180"
          ></el-table-column>
          <el-table-column label="出库/入库" width="180">
            <template #default="scope">
              {{ scope.row.operation === 0 ? "出库" : "入库" }}
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
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                size="mini"
                type="primary"
                v-if="scope.row.status === 0"
                >接受</el-button
              >
              <el-button size="mini" type="danger" v-if="scope.row.status === 0"
                >拒绝</el-button
              >
              <i v-if="scope.row.status === 1">已入库</i>
              <i v-if="scope.row.status === 2">已拒收</i>
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
        </el-pagination
      ></el-tab-pane>
      <el-tab-pane label="待处理"
        ><el-table :data="registerList1" border stripe max-height="450">
          <el-table-column type="index" width="50" label="#"></el-table-column>
          <el-table-column
            prop="name"
            label="原料"
            width="180"
          ></el-table-column>
          <el-table-column label="出库/入库" width="180">
            <template #default="scope">
              {{ scope.row.operation === 0 ? "出库" : "入库" }}
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
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                size="mini"
                type="primary"
                v-if="scope.row.status === 0"
                >接受</el-button
              >
              <el-button size="mini" type="danger" v-if="scope.row.status === 0"
                >拒绝</el-button
              >
              <i v-if="scope.row.status === 1">已入库</i>
              <i v-if="scope.row.status === 2">已拒收</i>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:currentPage="queryInfo.pageNum"
          :page-sizes="[5, 10, 15, 20]"
          v-model:page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total1"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination
      ></el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "Register",
  setup() {
    const { proxy } = getCurrentInstance();
    let registerList = ref([]);
    let registerList1 = ref([]);
    let queryInfo = ref({
      pageNum: 1,
      pageSize: 5,
      pageNum1: 1,
      pageSize1: 5,
    });

    let total = ref(0);
    let total1 = ref(0);
    // 全部信息
    async function getRegisterList() {
      let { data } = await proxy.$http.get("/register/register", {
        params: queryInfo.value,
      });
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      registerList.value = data.result.registerList;
      registerList1.value = data.result.registerList1;
      total.value = data.result.total;
      total1.value = data.result.total1;
      // 带处理
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
      registerList1,
      queryInfo,
      total,
      total1,
      handleSizeChange,
      handleCurrentChange,
    };
  },
};
</script>

<style lang="less" scoped>
</style>