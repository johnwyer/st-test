import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import moment from 'vue-moment';

Vue.use(moment);

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '@/styles/global.scss';

window.$ = window.jQuery = require('jquery');

Vue.config.productionTip = false;

export const eventEmitter = new Vue();

let vueApp = new Vue({
  router,
  store,
  render: h => h(App)
});
vueApp.$mount('#app');