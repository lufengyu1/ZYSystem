<template>
  <el-card>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>原料入库数据统计</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 1 -->
    <el-select v-model="year" class="m-2" placeholder="Select" @change="getDoneList">
      <el-option
        v-for="item in years"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
    <!-- 2 -->
    <div id="in" style="width: 1200px; height: 510px"></div>
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
    let inList = reactive([]);
    let years = ref([]);
    let year=ref('2022')
    async function getDoneList() {
      let { data } = await proxy.$http.get("/register/done");
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      doneList.value = data.result;
      // 数据处理
      for (let item of doneList.value) {
        let y = item.time.split("-")[0];
        let m = item.time.split("-")[1];
        let flag1 = false;
        if (!(y in inList)) inList[y] = [];
        if (item.operation === 0) {
          // 判断是入库还是出库
          // a
          if (inList[y].length === 0) {
            // inList表为空时,直接插入
            let k = { name: item.name };
            k[m] = item.quantity;
            inList[y].push(k);
            continue;
          }
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
            continue;
          }
        }
      }
      years.value = Object.keys(inList);
      console.log(year.value);
      console.log(inList[year.value]);
      let option1 = {
        title: { text: "原料入库数据统计" },
        legend: {},
        tooltip: {},
        dataset: {
          // 用 dimensions 指定了维度的顺序。直角坐标系中，如果 X 轴 type 为 category，
          // 默认把第一个维度映射到 X 轴上，后面维度映射到 Y 轴上。
          // 如果不指定 dimensions，也可以通过指定 series.encode
          // 完成映射，参见后文。
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

      let myChart1 = echarts.init(document.getElementById("in"));

      myChart1.setOption(option1);
    }
    onMounted(() => {
      getDoneList();
    });
    return { doneList,year,years ,getDoneList};
  },
};
</script>

<style lang="less" scoped>
</style>