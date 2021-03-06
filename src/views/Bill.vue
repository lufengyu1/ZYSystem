<template>
  <el-card class="h640">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>账单管理</el-breadcrumb-item>
      <el-breadcrumb-item>账单信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区 -->
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input
          placeholder="请输入订单号"
          class="input-with-select"
          v-model="queryInfo.query"
          clearable
          @clear="getBillList"
          :disabled="!rights.includes('414')"
        >
          <template #append>
            <el-button
              icon="el-icon-search"
              @click="getBillList"
              :disabled="!rights.includes('414')"
            ></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data="billList"
      border
      stripe
      max-height="450"
      v-loading="loading"
    >
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
        width="180"
      ></el-table-column>

      <el-table-column label="状态" fixed="right" width="200">
        <template #default="scope">
          <i v-if="scope.row.state === 0"
            >处理中<el-button
              size="mini"
              style="float: right"
              @click="delBill(scope.row)"
              :disabled="!rights.includes('412')"
              >取消订单</el-button
            ></i
          >
          <i v-else-if="scope.row.state === 1"
            >完成
            <el-button
              size="mini"
              style="float: right"
              @click="openInfoDialog(scope.row)"
              :disabled="!rights.includes('414')"
              >查看订单详情</el-button
            ></i
          >
          <i v-else
            >异常
            <el-button
              size="mini"
              style="float: right"
              @click="openInfoDialog(scope.row)"
              :disabled="!rights.includes('414')"
              >查看订单详情</el-button
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
    </el-pagination>
  </el-card>
  <Info></Info>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
import Info from "../components/bill/Info.vue";
export default {
  name: "Bill",
  components: { Info },
  setup() {
    const { proxy } = getCurrentInstance();
    let billList = ref([]);
    let queryInfo = ref({
      pageNum: 1,
      pageSize: 5,
      query: "",
    });
    let total = ref(0);
    let loading = ref(true);
    let rights = ref([]);
    // 获取账单信息
    async function getBillList() {
      if (
        queryInfo.value.query.trim().length === 0 ||
        queryInfo.value.query.trim().length === 24
      ) {
        let { data } = await proxy.$http.get("/bill/bill", {
          params: queryInfo.value,
        });
        if (data.meta.status !== 200)
          return proxy.$message.error(data.meta.des);
        billList.value = data.result.billList;
        total.value = data.result.total;
        loading.value = false;
      }else{
        return proxy.$message.info("订单号错误");
      }
    }
    // 分页
    function handleSizeChange() {
      getBillList();
    }
    function handleCurrentChange() {
      getBillList();
    }
    // 查看账单详情
    function openInfoDialog(info) {
      proxy.$bus.emit("openInfo", info);
    }
    // 取消订单
    async function delBill(info){
      let confirmResult = await proxy
        .$confirm(
          "此操作将永久删除订单:" + info._id + ", 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
        .catch((err) => {
          return err;
        });
        if(confirmResult === "confirm"){
          let {data}=await proxy.$http.delete('/bill/delete',{
            params:{_id:info._id}
          })
          if(data.meta.status!==200) return proxy.$message.error('订单取消失败');
          proxy.$message.success('订单已经取消');
          getBillList();
        }
    }
    onMounted(() => {
      rights.value = JSON.parse(window.sessionStorage.getItem("role"));
      getBillList();
    });
    return {
      billList,
      queryInfo,
      total,
      handleSizeChange,
      handleCurrentChange,
      getBillList,
      openInfoDialog,
      loading,
      rights,
      delBill
    };
  },
};
</script>

<style lang="less" scoped>
</style>