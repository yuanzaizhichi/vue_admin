import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入全局样式表
import './assets/css/global.css'

// element-ui按需引入
import './plugins/element'
import 'element-ui/lib/theme-chalk/index.css'

// 图标库
import './assets/fonts/iconfont.css'

import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:9002/'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = 'Bearer ' + window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
