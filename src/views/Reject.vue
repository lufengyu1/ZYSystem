<template>
  <el-card>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>退货信息</el-breadcrumb-item>
    </el-breadcrumb>
     <!-- 搜索区 -->
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input
              placeholder="请输入订单号"
              class="input-with-select"
              v-model="queryInfo.query"
              clearable
              @clear="getRejectList"
            >
              <template #append>
                <el-button
                  icon="el-icon-search"
                  @click="getRejectList"
                ></el-button>
              </template>
            </el-input>
          </el-col>
        </el-row>
    <el-table :data="rejectList" border stripe max-height="470">
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <el-table-column prop="id" label="订单号" width="250"></el-table-column>
      <el-table-column prop="name" label="原料" width="180"></el-table-column>
      <el-table-column
        prop="quantity"
        label="数量"
        width="150"
      ></el-table-column>
      <el-table-column label="出/入库" width="180">
        <template #default="scope">
          <span v-if="scope.row.operation === 0">入库</span>
          <span v-if="scope.row.operation === 1">出库</span>
        </template></el-table-column
      >
      <el-table-column label="操作人" prop="operator"></el-table-column>
      <el-table-column label="操作时间" prop="time"></el-table-column>
      <el-table-column prop="reason" label="问题" width="180"></el-table-column>
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
  name: "Reject",
  setup() {
    const { proxy } = getCurrentInstance();
    let rejectList = ref([]);
    let queryInfo = ref({
      pageNum: 1,
      pageSize: 5,
      query:''
    });
    let total = ref(0);
    async function getRejectList() {
      let { data } = await proxy.$http.get("/reject/reject", {
        params: queryInfo.value,
      });
      console.log(data);
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      rejectList.value = data.result.rejectList;
      total.value= data.result.total
    }

    function handleSizeChange() {getRejectList()}
    function handleCurrentChange() {getRejectList()}
    onMounted(() => {
      getRejectList();
    });
    return {
      rejectList,
      total,
      queryInfo,
      handleSizeChange,
      handleCurrentChange,
      getRejectList
    };
  },
};
</script>

<style lang="less" scoped>
</style>