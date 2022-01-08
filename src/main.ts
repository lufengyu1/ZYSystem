import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 全局样式表
import './assets/css/global.css'
// 字体图标
import './assets/icon/iconfont.css'
// 引入elementui
import installElementPlus from './plugins/element'
import Axios from 'axios'
// 配置axios根地址
Axios.defaults.baseURL = 'http://localhost:3000/'
//配置请求拦截器，每次发送请求都携带token
Axios.interceptors.request.use((config:any )=> {
    config.headers.Authorization = window.sessionStorage.getItem('token')||null;
    return config;
})
const app = createApp(App)
// 挂载axios
app.config.globalProperties.$http = Axios
// 使用elementplus
installElementPlus(app)
app.use(store).use(router).mount('#app')

