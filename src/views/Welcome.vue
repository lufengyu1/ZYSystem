<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="" alt="" />
        <span @click="toHome" class="toHome">筑优拌合站原料入库管理系统</span>
      </div>
      <div>
        <el-dropdown trigger="click" size="small">
          <el-button type="primary">
            {{ person.username }}<i class="el-icon-arrow-right"></i>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="openEditInfoDialog"
                >个人资料</el-dropdown-item
              >
              <el-dropdown-item @click="openEditPasswordDialog"
                >修改密码</el-dropdown-item
              >
              <el-dropdown-item @click="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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
          <el-menu-item index="/home" @click="saveNavState('/home')">
            <i class="iconfont icon-homefill"></i>
            <span>首页</span>
          </el-menu-item>
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
      <el-main> <router-view></router-view></el-main>
    </el-container>
  </el-container>
  <EditInfo></EditInfo>
  <Password></Password>
</template>

<script>
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import EditInfo from "../components/person/EditInfo.vue";
import Password from "../components/person/Password.vue";
export default {
  name: "Welcome",
  components: { EditInfo, Password },
  setup() {
    const { proxy } = getCurrentInstance();
    const iconObj = ref({
      100: "iconfont icon-jichuguanli",
      200: "iconfont icon-ruku",
      300: "iconfont icon-chuku",
      400: "iconfont icon-danju",
      500: "iconfont icon-shujutongji",
      600: "iconfont icon-users",
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
        if (person.value.role !== "超级管理员") {
          let arr = [];
          for (let item of menuList.value) {
            let index = 0;
            if (item.name === "用户管理") {
              item.children = item.children.filter((item1) => {
                return (item1.name === "部门列表");
              });
            }
          }
        }
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
    // 打开个人资料
    function openEditInfoDialog() {
      proxy.$bus.emit("openEditInfo", person.value);
    }
    function openEditPasswordDialog() {
      proxy.$bus.emit("openEditPassword", person.value);
    }
    onMounted(() => {
      proxy.$bus.on("logout", logout);
    });
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
      openEditInfoDialog,
      openEditPasswordDialog,
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
.example-showcase .el-dropdown + .el-dropdown {
  margin-left: 15px;
}
</style>