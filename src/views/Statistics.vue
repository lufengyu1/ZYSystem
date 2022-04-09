<template>
  <el-card>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>原料出入库统计</el-breadcrumb-item>
    </el-breadcrumb>
    <div id="main" style="width: 600px; height: 400px; float: left"></div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import { ref, onMounted, getCurrentInstance } from "vue";
export default {
  name: "Statistics",
  setup() {
    const { proxy } = getCurrentInstance();
    let doneList = ref([]);
    let inList = ref([]);
    let outList = ref([]);
    async function getDoneList() {
      let { data } = await proxy.$http.get("/register/done");
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      doneList.value = data.result;

      for (let item of doneList.value) {
        let y = item.time.split("-")[1];
        let flag1 = false;
        let flag2 = false;

        // 1
        if (item.operation === 0) {
          // a
          if (inList.value.length === 0) {
            let k = { name: item.name };
            k[y] = item.quantity;
            inList.value.push(k);
            continue;
          }
          // b
          for (let i of inList.value) {
            if (item.name === i.name) {
              // 判断对象i 是否有这个属性
              if (!(y in i)) {
                i[y] = 0;
              }
              i[y] += item.quantity;
              flag1 = true;
              continue;
            }
          }
          // c
          if (!flag1) {
            let k = { name: item.name };
            k[y] = item.quantity;
            inList.value.push(k);
            continue;
          }
        }
        if (item.operation === 1) {
          // a
          if (outList.value.length === 0) {
            let k = { name: item.name };
            k[y] = item.quantity;
            outList.value.push(k);
            continue;
          }
          // b
          for (let i of outList.value) {
            if (item.name === i.name) {
              // 判断对象i 是否有这个属性
              if (!(y in i)) {
                i[y] = 0;
              }
              i[y] += item.quantity;
              flag2 = true;
              continue;
            }
          }
          // c
          if (!flag2) {
            let k = { name: item.name };
            k[y] = item.quantity;
            outList.value.push(k);
            continue;
          }
        }
      }
      console.log(outList.value);
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