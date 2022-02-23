<template>
  <el-card>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>原料库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>问题原料记录</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="questionList" border stripe max-height="470">
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <el-table-column prop="id" label="订单号" width="250"></el-table-column>
      <el-table-column prop="name" label="原料" width="180"></el-table-column>
      <el-table-column
        prop="quantity"
        label="数量"
        width="150"
      ></el-table-column>
      <el-table-column  label="出/入库" width="180">
      <template #default="scope">
          <span v-if="scope.row.operation===0">入库</span>
          <span v-if="scope.row.operation===1">出库</span>
      </template></el-table-column>
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
  name: "Question",
  setup() {
    const { proxy } = getCurrentInstance();
    let questionList = ref([]);
    let queryInfo = ref({
      pageNum: 1,
      pageSize: 5,
    });
    let total = ref(0);
    async function getQuestionList() {
      let { data } =await proxy.$http.get("/question/question", {
        params: queryInfo.value,
      });
      questionList.value=data.result.questionList;
    }

    function handleSizeChange() {}
    function handleCurrentChange() {}
    onMounted(() => {
      getQuestionList();
    });
    return {
      questionList,
      total,
      queryInfo,
      handleSizeChange,
      handleCurrentChange,
    };
  },
};
</script>

<style lang="less" scoped>
</style>