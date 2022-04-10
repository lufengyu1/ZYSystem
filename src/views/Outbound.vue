<template>
  <el-card>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>原料出库数据统计</el-breadcrumb-item>
    </el-breadcrumb>
    
    <div id="in" style="width: 1200px; height: 510px"></div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import { ref, onMounted, getCurrentInstance, reactive } from "vue";
export default {
  name: "Outbound",
  setup() {
    const { proxy } = getCurrentInstance();
    let doneList = ref([]);
    let outList = reactive([]);
    async function getDoneList() {
      let { data } = await proxy.$http.get("/register/done");
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      doneList.value = data.result;
      // 数据处理
      for (let item of doneList.value) {
        let y = item.time.split("-")[0];
        let m = item.time.split("-")[1];
        let flag2 = false;
        if (!(y in outList)) outList[y] = [];
        if (item.operation === 1) {
          // a
          if (outList[y].length === 0) {
            let k = { name: item.name };
            k[m] = item.quantity;
            outList[y].push(k);
            continue;
          }
          // b
          for (let i of outList[y]) {
            if (item.name === i.name) {
              // 判断对象i 是否有这个属性
              if (!(m in i)) {
                i[m] = 0;
              }
              i[m] += item.quantity;
              flag2 = true;
              continue;
            }
          }
          // c
          if (!flag2) {
            let k = { name: item.name };
            k[m] = item.quantity;
            outList[y].push(k);
            continue;
          }
        }
      }
      console.log(outList);
      let option1 = {
        title: { text: "原料出库数据统计" },
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
          source: outList[2022],
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
    return { doneList };
  },
};
</script>

<style lang="less" scoped>
</style>