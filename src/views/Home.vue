<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="" alt="" />
        <span @click="toHome" class="toHome">筑优原料入库管理系统</span>
        <!-- <a href="http://localhost:8080/#/home">筑优拌合站原料入库管理系统</a> -->
      </div>
      <div>
        <span class="user">当前用户：{{ person.username }}</span>
        <el-button type="info" @click="logout" size="small">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#606266"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="defaultActive"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单模板区域 -->
            <template #title>
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.name }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + item1.path + ''"
              v-for="item1 in item.children"
              :key="item1.id"
              @click="saveNavState('/' + item1.path)"
            >
              <template #title>
                <i class="el-icon-menu"></i>
                <span>{{ item1.name }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题区域 -->
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
export default {
  name: "Home",
  setup() {
    const { proxy } = getCurrentInstance();
    const iconObj = ref({
      100: "iconfont icon-users",
      200: "iconfont icon-tijikongjian",
      300: "iconfont icon-danju",
      400: "iconfont icon-shangpin",
    });
    let menuList = ref([]);
    let person = ref({});
    let isCollapse = ref(false);
    let defaultActive = ref("12");
    // 加载菜单
    onMounted(() => {
      proxy.$store.dispatch(
        "logining",
        JSON.parse(window.sessionStorage.getItem("loginObj"))
      );
      person.value = proxy.$store.state.loginObj;
      proxy.$http.get("/menu").then((res) => {
        let { data } = res;
        if (data.meta.status !== 200) {
          return proxy.$message.error(data.meta.des);
        }
        menuList.value = data.result;
        defaultActive.value = window.sessionStorage.getItem("activePath");
      });
    });
    // 保存当前的页面
    function saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      defaultActive.value = activePath;
    }
    // 侧边栏缩放
    function toggleCollapse() {
      isCollapse.value = !isCollapse.value;
    }
    // 退出
    function logout() {
      window.sessionStorage.clear();
      proxy.$router.push("/login");
    }
    // 跳转
    function toHome() {
      proxy.$router.push("/home");
      window.sessionStorage.setItem("activePath", "");
      defaultActive.value = window.sessionStorage.getItem("activePath");
    }
    return {
      menuList,
      isCollapse,
      defaultActive,
      iconObj,
      person,
      saveNavState,
      toggleCollapse,
      logout,
      toHome,
    };
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #303133;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  padding-left: 0;
  > div {
    display: flex;
    align-items: center;
  }
}
.user {
  margin-right: 20px;
}

.el-aside {
  background-color: #606266;
}

.el-main {
  background-color: #ffffff;
}
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border-right: none;
}
.toggle-button {
  background-color: #606266;
  color: #fff;
  text-align: center;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.toHome {
  cursor: pointer;
}
</style>