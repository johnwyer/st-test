import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(require('vue-moment'));

require('@/styles/global.scss');
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
window.$ = window.jQuery = require('jquery');

Vue.config.productionTip = false;

export const eventEmitter = new Vue();

let vueApp = new Vue({
  router,
  store,
  render: h => h(App)
});
vueApp.$mount('#app');