<template>
  <el-dialog
    v-model="addRightsVisible"
    title="添加权限"
    width="50%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-tree
      ref="treeRef"
      :data="rightsList"
      show-checkbox
      default-expand-all
      node-key="id"
      highlight-current
      :props="defaultProps"
      :default-checked-keys="roleRight"
      label="name"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="addRights">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  name: "AddRights",
  setup() {
    const { proxy } = getCurrentInstance();
    let addRightsVisible = ref(false);
    let roleInfo = ref({});
    let rightsList = ref([]);
    let roleRight = ref([]);
    let defaultProps = { label: "name", children: "children" };
    // 获取树形权限列表
    async function getRightsList() {
      let { data } = await proxy.$http.get("/right/tree");
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      rightsList.value = data.result;
    }
    // 打开dialog
    function openAddRights(info) {
      roleInfo.value = info;
      //   roleRight.value = roleInfo.value.right.filters((item) => {
      //     return Array.from(item).pop() !== "0";
      //   });
      let arr = [];
      if (roleInfo.value.right.length === 0) {
        roleRight.value = [];
      } else {
        for (let item of roleInfo.value.right) {
          if (item.split("").pop() !== '0') {
            arr.push(item);
          }
        }
      }
      roleRight.value = arr;
      addRightsVisible.value = true;
    }
    // 关闭dialog
    function handleClose() {
      addRightsVisible.value = false;
      roleRight.value = [];
      // 清空默认选择
      proxy.$refs.treeRef.setCheckedKeys([]);
    }
    // 修改权限
    async function addRights() {
      const key = [
        ...proxy.$refs.treeRef.getHalfCheckedKeys(),
        ...proxy.$refs.treeRef.getCheckedKeys(),
      ];
      roleInfo.value.right = key;
      console.log(roleInfo.value);
      let { data } = await proxy.$http.put("/role/update", roleInfo.value);
      if (data.meta.status !== 200) return proxy.$message.error(data.meta.des);
      proxy.$message.success("更新成功");
      handleClose();
    }
    onMounted(() => {
      getRightsList();
      proxy.$bus.on("openAddRights", openAddRights);
    });
    return {
      addRightsVisible,
      roleInfo,
      rightsList,
      roleRight,
      defaultProps,
      handleClose,
      addRights,
    };
  },
};
</script>

<style lang="less" scoped>
</style>