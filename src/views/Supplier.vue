<template>
  <el-card style="height: 640px">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础管理</el-breadcrumb-item>
      <el-breadcrumb-item>供应商信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区 -->
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input
          placeholder="请输入供应商名"
          class="input-with-select"
          v-model="queryInfo.query"
          clearable
          v-show="rights.includes('134')"
          @clear="getSupplierList"
        >
          <template #append>
            <el-button
              icon="el-icon-search"
              @click="getSupplierList"
               v-show="rights.includes('134')"
            ></el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button
          type="primary"
          @click="openAddSupplierDialog"
          v-show="rights.includes('131')"
          >添加供应商</el-button
        >
      </el-col>
    </el-row>
    <el-table
      :data="supplierList"
      border
      stripe
      max-height="450"
      v-loading="loading"
    >
      <el-table-column type="expand">
        <template #default="scope">
          <el-button
            size="mini"
            type="primary"
            @click="openAddMaterialDialog(scope.row)"
            >添加原料</el-button
          >
          <el-table
            :data="scope.row.children"
            v-if="scope.row.children.length"
            class="customer-table"
          >
            <el-table-column prop="name" label="原料" width="180" />
            <el-table-column prop="price" label="价格" width="180" />
            <el-table-column prop="des" label="参数描述" width="180" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="openEditPriceDialog(scope.row)"
                  >修改信息</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  @click="delMaterial(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <el-table-column prop="name" label="供应商" width="180"></el-table-column>
      <el-table-column prop="des" label="描述" width="180"></el-table-column>
      <el-table-column
        prop="phone"
        label="联系方式"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="card"
        label="银行卡号"
        width="180"
      ></el-table-column>
      <el-table-column prop="CD" label="创建日期" width="180"></el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            size="mini"
            @click="openEditSupplierDialog(scope.row)"
            :disabled="!rights.includes('133')"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="del(scope.row)"
            :disabled="!rights.includes('132')"
            >删除</el-button
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
  <AddSupplier></AddSupplier>
  <EditSupplier></EditSupplier>
  <EditPrice></EditPrice>
  <AddMaterial></AddMaterial>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
import AddSupplier from "../components/supplier/AddSupplier.vue";
import EditSupplier from "../components/supplier/EditSupplier.vue";
import EditPrice from "../components/supplier/EditPrice.vue";
import AddMaterial from "../components/supplier/AddMaterial.vue";
export default {
  name: "Supplier",
  components: {
    AddSupplier,
    EditSupplier,
    EditPrice,
    AddMaterial,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    let supplierList = ref([]);
    let queryInfo = ref({
      pageNum: 1,
      pageSize: 5,
      query: "",
    });
    let total = ref(0);
    let loading = ref(true);
    let rights = ref([]);
    // 添加的原料信息
    let addInfo = ref({
      name: "",
      price: "",
      supplier: "",
    });
    // 获取供应商信息
    async function getSupplierList() {
      let { data } = await proxy.$http.get("/supplier/supplier", {
        params: queryInfo.value,
      });
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      supplierList.value = data.result.supplierList;
      total.value = data.result.total;
      loading.value = false;
    }
    function handleSizeChange() {
      getSupplierList();
    }
    function handleCurrentChange() {
      getSupplierList();
    }
    // 添加供应商
    function openAddSupplierDialog() {
      proxy.$bus.emit("openAddSupplier");
    }
    //打开添加原料dialog
    function openAddMaterialDialog(info) {
      proxy.$bus.emit("addMaterialDialog", info);
    }
    // 编辑供应商信息
    function openEditSupplierDialog(info) {
      proxy.$bus.emit("openEditSupplier", info);
    }
    // 删除供应商信息
    async function del(info) {
      let confirmResult = await proxy
        .$confirm("此操作将删除供应商：" + info.name + "，是否继续", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .catch((err) => {
          return err;
        });
      if (confirmResult === "confirm") {
        let { data } = await proxy.$http.delete("/supplier/delete", {
          params: { _id: info._id },
        });
        if (data.meta.status !== 200)
          return proxy.$message.error(data.meta.des);
        proxy.$message.success("供应商:" + info.name + "已删除");
        getSupplierList();
      } else {
        proxy.$message("已取消删除供应商:" + info.name);
      }
    }
    // 编辑原料价格
    function openEditPriceDialog(info) {
      proxy.$bus.emit("openEditPrice", info);
    }
    // 删除原料
    async function delMaterial(info) {
      let confirmResult = await proxy
        .$confirm("此操作将永久删除：" + info.name + "，是否继续", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .catch((err) => {
          return err;
        });
      if (confirmResult === "confirm") {
        let { data } = await proxy.$http.delete("/supplier/delMaterial", {
          params: info,
        });
        if (data.meta.status !== 200)
          return proxy.$message.error(data.meta.des);
        proxy.$message.success("原料：" + info.name + "已删除");
        getSupplierList();
      } else {
        proxy.$message.info("已取消删除：" + info.name);
      }
    }
    onMounted(() => {
      rights.value = JSON.parse(window.sessionStorage.getItem("role"));
      getSupplierList();
      proxy.$bus.on("getSupplierList", getSupplierList);
    });
    return {
      supplierList,
      queryInfo,
      total,
      handleSizeChange,
      handleCurrentChange,
      getSupplierList,
      openAddSupplierDialog,
      addInfo,
      openEditSupplierDialog,
      del,
      openEditPriceDialog,
      delMaterial,
      loading,
      rights,
      openAddMaterialDialog,
    };
  },
};
</script>

<style lang="less" scoped>
</style>