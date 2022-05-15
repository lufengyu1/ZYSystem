<template>
  <el-card class="h640">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>入库管理</el-breadcrumb-item>
      <el-breadcrumb-item>原料出库信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区 -->
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input
          placeholder="请输入原料"
          class="input-with-select"
          v-model="queryInfo.query"
          clearable
          @clear="getInStockList"
          :disabled="!rights.includes('324')"
        >
          <template #append>
            <el-button
              icon="el-icon-search"
              @click="getInStockList"
              :disabled="!rights.includes('324')"
            ></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data="inStockList"
      border
      stripe
      max-height="410"
      v-loading="loading"
    >
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <el-table-column label="订单号" width="250px"
        ><template #default="scope">
          {{ scope.row._id }}
        </template></el-table-column
      >
      <el-table-column prop="name" label="原料" width="180"></el-table-column>
      <el-table-column
        prop="quantity"
        label="数量"
        width="180"
      ></el-table-column>
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
            @click="openInStockInfoDialog(scope.row)"
            :disabled="!rights.includes('324')"
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
  <RegisterInfo></RegisterInfo>
</template>

<script>
import { ref, getCurrentInstance, onMounted, reactive } from "vue";
import RegisterInfo from "../components/register/RegisterInfo.vue";
export default {
  name: "Outstock",
  components: { RegisterInfo },
  setup() {
    const { proxy } = getCurrentInstance();
    let inStockList = ref([]);
    let queryInfo = ref({
      query: "",
      pageSize: 5,
      pageNum: 1,
      type: 1,
    });
    let total = ref(0);
    let loading = ref(true);
    let rights = ref([]);
    async function getInStockList() {
      if (
        queryInfo.value.query.trim().length === 0 ||
        queryInfo.value.query.trim().length === 24
      ) {
        let { data } = await proxy.$http.get("/register/inout", {
          params: queryInfo.value,
        });
        if (data.meta.status != 200) return proxy.$message.error(data.meta.des);
        inStockList.value = data.result.list;
        total.value = data.result.total;
        loading.value = false;
      }else{
        return proxy.$message.info("订单号错误");
      }
    }
    function handleSizeChange() {
      getInStockList();
    }
    function handleCurrentChange() {
      getInStockList();
    }
    function openInStockInfoDialog(info) {
      proxy.$bus.emit("openRegisterInfo", info);
    }
    onMounted(() => {
      rights.value = JSON.parse(window.sessionStorage.getItem("role"));
      getInStockList();
    });
    return {
      getInStockList,
      handleCurrentChange,
      handleSizeChange,
      openInStockInfoDialog,
      inStockList,
      queryInfo,
      loading,
      total,
      rights,
    };
  },
};
</script>

<style lang="less" scoped>
</style>