<template>
  <el-card class="card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
    </el-breadcrumb>
    <div id="main" style="width: 600px; height: 400px; float: left"></div>
    <el-card class="do">
      <div>待处理：{{ todoNumber }}</div>
      <div>库存不足：{{ number }}</div>
    </el-card>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "Home",
  setup() {
    const { proxy } = getCurrentInstance();
    let stockList = ref([]);
    let names = ref([]);
    let quantities = ref([]);
    let limits = ref([]);
    let number = ref(0);
    let todoNumber = ref(0);
    async function getStockList() {
      let { data } = await proxy.$http.get("/stock/stock", {
        params: { pageNum: 0, pageSize: 0 },
      });
      if (data.meta.status !== 200) return proxy.$message.error("数据错误");
      stockList.value = data.result.stockList;
      number.value = 0;

      for (let item of stockList.value) {
        if (item.quantity < item.limit) number.value++;
        names.value.push(item.name);
        quantities.value.push(item.quantity);
        limits.value.push(item.limit);
      }
      let myChart = echarts.init(document.getElementById("main"));
      let option = {
        title: { text: "原料库存" },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: { color: "#999" },
          },
        },
        toolBox: {},
        legend: {
          data: ["库存", "最低限制"],
        },
        xAxis: {
          name: "原料",
          data: names.value,
        },
        yAxis: {
          type: "value",
          name: "",
          axisLabel: {
            formatter: "{value}kg",
          },
        },
        series: [
          {
            name: "库存",
            type: "bar",
            data: quantities.value,
            tooltip: {
              valueFormatter: (value) => {
                return value + "kg";
              },
            },
          },
          {
            name: "最低限制",
            type: "line",
            tooltip: {
              valueFormatter: (value) => {
                return value + "kg";
              },
            },
            data: limits.value,
          },
        ],
      };
      myChart.setOption(option);
    }
    async function todo() {
      let { data } = await proxy.$http.get("/register/todo");
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      todoNumber.value = data.result.length;
    }
    onMounted(() => {
      getStockList();
      todo();
      proxy.$bus.on("getStockList", getStockList);
    });
    return {
      number,
      todoNumber,
    };
  },
};
</script>

<style lang="less" scoped>
.card {
  height: 600px;
}
.el-breadcrumb {
  margin-bottom: 40px;
}
#main {
  margin-left: 30px;
}
.do {
  width: 400px;
  position: relative;
  top: 0;
  left: 200px;
}
</style>