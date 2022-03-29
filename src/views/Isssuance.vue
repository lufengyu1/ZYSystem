<template>
  <el-card>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>原料库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>原料出库</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区 -->
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input
          placeholder="请输入原料"
          class="input-with-select"
          v-model="queryInfo.query"
          clearable
          @clear="getIsssuanceList"
        >
          <template #append>
            <el-button icon="el-icon-search" @click="getIsssuanceList"></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data="isssuanceList"
      border
      stripe
      max-height="450"
      @sort-change="sort"
    >
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <el-table-column prop="name" width="150" label="原料"></el-table-column>
      <el-table-column
        prop="supplier"
        width="220"
        label="供应商"
      ></el-table-column>
      <el-table-column prop="time" width="220" label="入库时间"></el-table-column>
     
      <el-table-column
        prop="quantity"
        width="150"
        label="数量"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
      ></el-table-column>
      <el-table-column width="220" label="出库"
        ><template #default="scope">
          <el-button
            v-if="scope.row.state === 0"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="openOutDialog(scope.row)"
          >
          </el-button>
          <i v-if="scope.row.state === 1">处理中</i>
        </template></el-table-column
      >
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
  <Out></Out>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
import Out from "../components/isssuance/Out.vue";
export default {
  name: "Isssuance",
  components: {
    Out,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    let isssuanceList = ref([]);
    let queryInfo = ref({
      pageNum: 1,
      pageSize: 5,
      query:''
    });
    let total = ref(0);
    async function getIsssuanceList() {
      let { data } = await proxy.$http.get("/isssuance/isssuance", {
        params: queryInfo.value,
      });
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      isssuanceList.value = data.result.isssuance;
      total.value = data.result.total;
    }
    function handleSizeChange() {
      getIsssuanceList();
    }
    function handleCurrentChange() {
      getIsssuanceList();
    }
    function openOutDialog(info) {
      proxy.$bus.emit("openOut", info);
    }
    async function sort() {}
    onMounted(() => {
      getIsssuanceList();
    });
    return {
      isssuanceList,
      queryInfo,
      total,
      handleSizeChange,
      handleCurrentChange,
      openOutDialog,
      sort,
      getIsssuanceList
    };
  },
};
</script>

<style lang="less" scoped>
</style>