<template>
  <el-card class="card">
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
    </el-breadcrumb> -->
    <el-card class="first"
      ><div>
        欢迎使用筑优拌合站原料入库管理系统，{{
          proxy.$store.state.loginObj.username
        }}。当前时间：{{ times }}
      </div></el-card
    >

    <el-row :gutter="20">
      <el-col :span="16"
        ><div id="main" style="width: 600px; height: 400px; float: left"></div
      ></el-col>
      <el-col :span="8"
        ><el-card class="alarm some">
          <el-badge :value="number"> <h1 class="title">库存预警</h1></el-badge>
          <div>
            <template v-if="number === 0">库存充足，无需补充</template>
            <template v-else><ul><li v-for="item in alarmList" :key="item._id">原料：{{item.name}}，库存不足</li></ul></template>
          </div>
        </el-card>
        <el-card class="todo some">
          <el-badge :value="todoNumber">
            <h1 class="title">待处理</h1>
          </el-badge>
          <div>
            <template v-if="todoNumber === 0">今日待办已完成</template>
            <template v-else><ul><li v-for="item in toDoList" :key="item._id">原料：{{item.name}}，<i v-if="item.operation===0">入库</i><i v-else>入库</i>待处理</li></ul></template>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "Home",
  setup() {
    const { proxy } = getCurrentInstance();
    const getCurrentTime = require("../assets/fun/getTime");
    let stockList = ref([]);
    let names = ref([]);
    let quantities = ref([]);
    let limits = ref([]);
    let number = ref(0);
    let todoNumber = ref(0);
    let times = ref("");
    let alarmList = ref([]);
    let toDoList = ref([]);
    async function getStockList() {
      let { data } = await proxy.$http.get("/stock/stock", {
        params: { pageNum: 0, pageSize: 0 },
      });
      if (data.meta.status !== 200) return proxy.$message.error("数据错误");
      stockList.value = data.result.stockList;
      number.value = 0;

      for (let item of stockList.value) {
        if (item.quantity < item.limit) {
          number.value++;
          alarmList.value.push(item);
        }
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
      toDoList.value = data.result;
    }
    // 获取时间
    function getTime() {
      let time = getCurrentTime();
      let now = new Date();
      let day = now.getDay();
      let weeks = new Array(
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      );
      let week = weeks[day];
      times.value = time + " " + week;
    }
    setInterval(getTime, 1000);
    onMounted(() => {
      getStockList();
      todo();
      getTime();
      proxy.$bus.on("getStockList", times);
    });
    return {
      number,
      todoNumber,
      proxy,
      times,
      alarmList,
      toDoList
    };
  },
};
</script>

<style lang="less" scoped>
.card {
  height: 600px;
}

.first {
  background-color: #777;
  color: #fff;
  // height:40px;
  margin: 0;
  padding: 0 !important;
  margin-bottom: 20px;
}
.el-card__body {
  padding: 0 !important;
}
.title {
  margin-bottom: 10px;
}
#main {
  margin-left: 30px;
}
.alarm {
  margin-bottom: 20px;
}
</style>