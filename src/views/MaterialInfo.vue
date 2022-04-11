<template>
  <el-card class="h640">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>原料信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区 -->
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input
          placeholder="请输入原料"
          class="input-with-select"
          v-model="queryInfo.query"
          clearable
        >
          <template #append>
            <el-button
              icon="el-icon-search"
              @click="getMaterialInfoList"
            ></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="materialInfoList" border stripe max-height="500">
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <el-table-column prop="name" label="原料" width="180"></el-table-column>
      <el-table-column
        prop="supplier"
        label="供应商"
        width="180"
      ></el-table-column>

      <el-table-column
        prop="price"
        label="单价(元)"
        width="150"
      ></el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="openBuyDialog(scope.row)"
          ></el-button>
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
  <Buy></Buy>
</template>

<script>
import Buy from "../components/material/Buy";
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "MaterialInfo",
  components: {
    Buy,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    let materialInfoList = ref([]);
    let queryInfo = ref({
      query: "",
      pageSize: 5,
      pageNum: 1,
    });
    let total = ref(0);
    // 获取原料信息
    async function getMaterialInfoList() {
      const { data } = await proxy.$http.get("/materialInfo/materialInfo", {
        params: queryInfo.value,
      });
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      total.value = data.result.total;
      materialInfoList.value = data.result.materialInfo;
    }
    function handleSizeChange() {
      getMaterialInfoList();
    }
    function handleCurrentChange() {
      getMaterialInfoList();
    }
    // 打开购买页面
    function openBuyDialog(info) {
      proxy.$bus.emit("openBuy", info);
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
      openBuyDialog,
      getMaterialInfoList,
    };
  },
};
</script>

<style lang="less" scoped>
</style>