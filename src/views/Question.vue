<template>
  <el-card style="height: 640px">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>原料库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>问题原料记录</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区 -->
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input
          placeholder="请输入订单号"
          class="input-with-select"
          v-model="queryInfo.query"
          clearable
          @clear="getQuestionList"
        >
          <template #append>
            <el-button
              icon="el-icon-search"
              @click="getQuestionList"
            ></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data="questionList"
      border
      stripe
      max-height="470"
      v-loading="loading"
    >
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <el-table-column prop="_id" label="订单号" width="250"></el-table-column>
      <el-table-column prop="name" label="原料" width="180"></el-table-column>
      <el-table-column
        prop="quantity"
        label="数量"
        width="150"
      ></el-table-column>
      <el-table-column label="出/入库" width="130">
        <template #default="scope">
          <span v-if="scope.row.operation === 0">入库</span>
          <span v-if="scope.row.operation === 1">出库</span>
        </template></el-table-column
      >
      <el-table-column label="操作人" prop="operator"></el-table-column>
      <el-table-column
        label="操作时间"
        prop="time"
        width="180"
      ></el-table-column>
      <el-table-column prop="reason" label="问题" width="180"></el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button size="mini" @click="openQuestionInfoDialog(scope.row)"
            >查看详情</el-button
          >
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
  <Info></Info>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
import Info from "../components/question/questionInfo.vue";
export default {
  name: "Question",
  components: { Info },
  setup() {
    const { proxy } = getCurrentInstance();
    let questionList = ref([]);
    let queryInfo = ref({
      pageNum: 1,
      pageSize: 5,
      query: "",
    });
    let total = ref(0);
    let loading = ref(true);
    async function getQuestionList() {
      if (
        queryInfo.value.query.trim().length === 0 ||
        queryInfo.value.query.trim().length === 24
      ) {
        let { data } = await proxy.$http.get("/question/question", {
          params: queryInfo.value,
        });
        if (data.meta.status !== 200)
          return proxy.$message.error(data.meta.des);
        questionList.value = data.result.questionList;
        total.value = data.result.total;
        loading.value = false;
      } else {
        return proxy.$message.info("订单号错误");
      }
    }

    function handleSizeChange() {
      getQuestionList();
    }
    function handleCurrentChange() {
      getQuestionList();
    }
    function openQuestionInfoDialog(info) {
      proxy.$bus.emit("openQuestionInfo", info);
    }
    onMounted(() => {
      getQuestionList();
    });
    return {
      questionList,
      total,
      queryInfo,
      handleSizeChange,
      handleCurrentChange,
      getQuestionList,
      openQuestionInfoDialog,
      loading,
    };
  },
};
</script>

<style lang="less" scoped>
</style>