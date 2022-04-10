<template>
  <el-card>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>原料入库数据统计</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs v-model="activeName" class="demo-tabs" style="max-height: 560px">
      <el-tab-pane label="月份" name="月份">
        <!-- 1 -->
        <div class="year">
          选择年份：<el-select
            v-model="year"
            class="m-2"
            placeholder="Select"
            @change="getDoneList"
          >
            <el-option
              v-for="item in years"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
        <!-- 2 -->
        <div id="inMon" style="width: 1200px; height: 500px"></div
      ></el-tab-pane>
      <el-tab-pane label="年份" name="年份"
        ><div id="inYear" style="width: 1200px; height: 500px"></div
      ></el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import { ref, onMounted, getCurrentInstance, reactive } from "vue";
export default {
  name: "Inbound",
  setup() {
    const { proxy } = getCurrentInstance();
    let doneList = ref([]);
    let inList = reactive({});
    let yearList = reactive([]);
    let years = ref([]);
    let year = ref("2022");
    let activeName = ref("月份");
    async function getDoneList() {
      inList = {};
      yearList = [];
      let { data } = await proxy.$http.get("/register/done");
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      doneList.value = data.result;
      // 数据处理
      for (let item of doneList.value) {
        let y = item.time.split("-")[0];
        let m = item.time.split("-")[1];
        let flag1 = false;
        let flag2 = false;
        if (!(y in inList)) inList[y] = [];
        if (item.operation === 0) {
          // a判断是入库还是出库
          if (inList[y].length === 0) {
            // inList表为空时,直接插入
            let k = { name: item.name };
            k[m] = item.quantity;
            inList[y].push(k);
            // continue;
          } else {
            // b
            for (let i of inList[y]) {
              // flag1==true判断是否有该月份的数据，有就相加
              if (item.name === i.name) {
                // 判断对象i 是否有这个属性
                if (!(m in i)) {
                  i[m] = 0;
                }
                i[m] += item.quantity;
                flag1 = true;
                continue;
              }
            }
            // c
            if (!flag1) {
              // flag1==false,直接插入
              let k = { name: item.name };
              k[m] = item.quantity;
              inList[y].push(k);
              // continue;
            }
          }

          //
          //
          if (yearList.length === 0) {
            let k = { name: item.name };
            k[y] = item.quantity;
            yearList.push(k);
          } else {
            for (let i of yearList) {
              if (item.name === i.name) {
                if (!(y in i)) {
                  i[y] = 0;
                }
                i[y] += item.quantity;
                flag2 = true;
                continue;
              }
            }
            if (!flag2) {
              let k = { name: item.name };
              k[y] = item.quantity;
              yearList.push(k);
            }
          }
        }
      }
      years.value = Object.keys(inList);
      let series = [];
      for (let i = 0; i < years.value.length; i++) {
        series.push({ type: "bar" });
      }
      let option1 = {
        title: { text: year.value + "原料入库数据统计" },
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: [
            "name",
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
          ],
          source: inList[year.value],
        },
        xAxis: { type: "category" },
        yAxis: {},
        series: [
          { type: "bar" },
          { type: "bar" },
          { type: "bar" },
          { type: "bar" },
          { type: "bar" },
          { type: "bar" },
          { type: "bar" },
          { type: "bar" },
          { type: "bar" },
          { type: "bar" },
          { type: "bar" },
          { type: "bar" },
        ],
      };

      let option2 = {
        title: { text: "" },
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ["name", ...years.value],
          source: yearList,
        },
        xAxis: { type: "category" },
        yAxis: {},
        series: series,
      };
      let myChart1 = echarts.init(document.getElementById("inMon"));
      let myChart2 = echarts.init(document.getElementById("inYear"));

      myChart1.setOption(option1);
      myChart2.setOption(option2);
    }
    onMounted(() => {
      getDoneList();
    });
    return { doneList, year, years, getDoneList, activeName, yearList };
  },
};
</script>

<style lang="less" scoped>
.year {
  margin-bottom: 15px;
}
</style>