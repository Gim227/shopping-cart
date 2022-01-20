import Vue from 'vue';
import App from './App.vue';
import router from "./router";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from "element-ui/lib/locale/lang/zh-TW";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import jQuery from 'jquery';
import "./assets/css/main.css";

// vue-router 報錯：Navigation cancelled from“/...“ to “/...“ with a new navigation.
import Router from 'vue-router'
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.config.productionTip = false;
window.$ = window.jQuery = jQuery;
Vue.use(ElementUI, { locale });

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
