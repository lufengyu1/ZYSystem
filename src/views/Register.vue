<template >
  <el-card style="height: 640px">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础管理</el-breadcrumb-item>
      <el-breadcrumb-item>登记出入库信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  Badege -->
    <el-tabs class="demo-tabs">
      <el-tab-pane label="全部信息">
        <!-- 搜索区 -->
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input
              placeholder="请输入订单号"
              class="input-with-select"
              v-model="queryInfo.query"
              clearable
              @clear="getRegisterList"
            >
              <template #append>
                <el-button
                  icon="el-icon-search"
                  @click="getRegisterList"
                ></el-button>
              </template>
            </el-input>
          </el-col>
        </el-row>
        <el-table
          :data="registerList"
          border
          stripe
          max-height="410"
          @sort-change="sort"
          v-loading="loading"
        >
          <el-table-column type="index" width="50" label="#"></el-table-column>
          <el-table-column label="订单号" width="250px"
            ><template #default="scope">
              {{ scope.row._id }}
            </template></el-table-column
          >
          <el-table-column
            prop="name"
            label="原料"
            width="180"
            sortable="custom"
            :sort-orders="['ascending', 'descending']"
          ></el-table-column>
          <el-table-column label="出库/入库" width="130">
            <template #default="scope">
              {{ scope.row.operation === 0 ? "入库" : "出库" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="quantity"
            label="数量"
            sortable="custom"
            :sort-orders="['ascending', 'descending']"
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
            sortable="custom"
            :sort-orders="['ascending', 'descending']"
            width="180"
          ></el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template #default="scope">
              <el-button
                size="mini"
                type="primary"
                v-if="scope.row.status === 0"
                @click="receive(scope.row)"
                >接受</el-button
              >
              <el-button
                size="mini"
                type="danger"
                v-if="scope.row.status === 0"
                @click="refuse(scope.row)"
                >拒绝</el-button
              >
              <i v-if="scope.row.status === 1"
                >已入库
                <el-button
                  size="mini"
                  @click="openRegisterInfoDialog(scope.row)"
                  style="float: right"
                >
                  查看详情</el-button
                ></i
              >
              <i v-if="scope.row.status === 2"
                >已拒收
                <el-button
                  size="mini"
                  @click="openRegisterInfoDialog(scope.row)"
                  style="float: right"
                  >查看详情</el-button
                ></i
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
        </el-pagination
      ></el-tab-pane>
      <el-tab-pane
        ><template #label>
          <el-badge :value="total1" v-if="total1" class="item" :max="99"
            >待处理</el-badge
          >
          <span v-if="!total1"> 待处理</span>
        </template>
        <!-- 搜索区 -->
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input
              placeholder="请输入订单号"
              class="input-with-select"
              v-model="queryInfo1.query1"
              clearable
              clear="getToDosList"
            >
              <template #append>
                <el-button
                  icon="el-icon-search"
                  @click="getToDosList"
                ></el-button>
              </template>
            </el-input>
          </el-col>
        </el-row>
        <el-table :data="registerList1" border stripe max-height="410">
          <el-table-column type="index" width="50" label="#"></el-table-column>
          <el-table-column label="订单号" width="250px"
            ><template #default="scope">
              {{ scope.row._id }}
            </template></el-table-column
          >
          <el-table-column
            prop="name"
            label="原料"
            width="180"
          ></el-table-column>
          <el-table-column label="出库/入库" width="130">
            <template #default="scope">
              {{ scope.row.operation === 0 ? "入库" : "出库" }}
            </template>
          </el-table-column>
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
          <el-table-column label="操作" fixed="right" width="200">
            <template #default="scope">
              <el-button
                size="mini"
                type="primary"
                v-if="scope.row.status === 0"
                @click="receive(scope.row)"
                >接受</el-button
              >
              <el-button
                size="mini"
                type="danger"
                v-if="scope.row.status === 0"
                @click="refuse(scope.row)"
                >拒绝</el-button
              >
              <i v-if="scope.row.status === 1">已入库</i>
              <i v-if="scope.row.status === 2">已拒收</i>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:currentPage="queryInfo1.pageNum1"
          :page-sizes="[5, 10, 15, 20]"
          v-model:page-size="queryInfo1.pageSize1"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total1"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination
      ></el-tab-pane>
    </el-tabs>
  </el-card>
  <Refuse></Refuse>
  <RegisterInfo></RegisterInfo>
</template>

<script>
import { ref, getCurrentInstance, onMounted, reactive } from "vue";
import Refuse from "../components/register/Refuse.vue";
import RegisterInfo from "../components/register/RegisterInfo.vue";
export default {
  name: "Register",
  components: { Refuse, RegisterInfo },
  setup() {
    const getCurrentTime = require("../assets/fun/getTime");
    const { proxy } = getCurrentInstance();
    let registerList = ref([]);
    let registerList1 = ref([]);
    let queryInfo = ref({
      query: "",
      pageSize: 5,
      pageNum: 1,
      type: "time",
      num: 1,
    });
    let queryInfo1 = ref({
      query1: "",
      pageSize1: 5,
      pageNum1: 1,
      type: "time",
      num: 1,
    });
    let total = ref(0);
    let total1 = ref(0);
    let loading=ref(true);
    // 获取全部出入库信息
    async function getRegisterList() {
      if (
        queryInfo.value.query.trim().length === 0 ||
        queryInfo.value.query.trim().length === 24
      ) {
        let { data } = await proxy.$http.get("/register/all", {
          params: queryInfo.value,
        });
        if (data.meta.status !== 200)
          return proxy.$message.error(data.meta.des);
        registerList.value = data.result.registerList;
        total.value = data.result.total;
        loading.value=false;
      } else {
        return proxy.$message.info("订单号错误");
      }
    }
    // 获取未处理的出入库信息
    async function getToDosList() {
      if (
        queryInfo1.value.query1.trim().length === 0 ||
        queryInfo1.value.query1.trim().length === 24
      ) {
        let { data } = await proxy.$http.get("/register/todos", {
          params: queryInfo1.value,
        });
        if (data.meta.status !== 200)
          return proxy.$message.error(data.meta.des);
        registerList1.value = data.result.registerList1;
        total1.value = data.result.total1;
      } else {
        return proxy.$message.info("订单号错误");
      }
    }
    function handleSizeChange() {
      getRegisterList();
    }
    function handleCurrentChange() {
      getRegisterList();
    }
    // 原料可以入库  更新stock 和bill
    async function receive(info) {
      let time = getCurrentTime();
      let name = JSON.parse(window.sessionStorage.getItem("loginObj")).username;
      info.time = time;
      info.operator = name;
      info.status = 1;
      let { data } = await proxy.$http.put("/register/update", info);
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      proxy.$message.success(data.meta.des);
      let data1 = await proxy.$http.put("/stock/update", { ...info, type: 0 });
      let data2 = await proxy.$http.put("/bill/update", {...info,state:1});
      if (info.operation === 0) {
        let data3 = await proxy.$http.put("/isssuance/insert", info);
        proxy.$bus.emit("getStockList");
      } else if (info.operation === 1) {
        let data4 = await proxy.$http.put("/isssuance/update", info);
        proxy.$bus.emit("getStockList");
      }
      getRegisterList();
      getToDosList();
    }
    // 拒绝入库时 打开详细页面
    function refuse(info) {
      proxy.$bus.emit("openRefuse", info);
    }
    // 排序
    async function sort(val) {
      let key = val.prop;
      let value = val.order === "ascending" ? 1 : -1;
      queryInfo.value.type = key;
      queryInfo.value.num = value;
      //
      let { data } = await proxy.$http.get("/register/all", {
        params: queryInfo.value,
      });
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      registerList.value = data.result.registerList;
      total.value = data.result.total;
    }
    function openRegisterInfoDialog(info) {
      proxy.$bus.emit("openRegisterInfo", info);
    }
    onMounted(() => {
      getRegisterList();
      getToDosList();
      proxy.$bus.on("getRegisterList", getRegisterList);
      proxy.$bus.on("getToDosList", getToDosList);
    });
    return {
      registerList,
      registerList1,
      queryInfo,
      queryInfo1,
      total,
      total1,
      handleSizeChange,
      handleCurrentChange,
      getRegisterList,
      getToDosList,
      receive,
      refuse,
      sort,
      openRegisterInfoDialog,
      loading
    };
  },
};
</script>

<style lang="less" scoped>
</style>