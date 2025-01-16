import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import * as dayjs from "dayjs";
import * as isLeapYear from "dayjs/plugin/isLeapYear"; // import plugin
import "dayjs/locale/zh-cn"; // import locale

import { Button } from "vant";
import { Field } from "vant";
import { Tag } from "vant";
import { NumberKeyboard } from "vant";
import { Cell, CellGroup } from "vant";
import { Calendar } from "vant";
import { Swipe, SwipeItem } from "vant";
import { SubmitBar } from "vant";
import { Toast } from "vant";
import { Tab, Tabs } from "vant";
import { Collapse, CollapseItem } from "vant";
import { Icon } from "vant";
import { DatetimePicker } from "vant";
import { Popup } from "vant";
import { ActionSheet } from "vant";
import { Empty } from "vant";
import { Picker } from "vant";
import { Form } from "vant";
import { RadioGroup, Radio } from "vant";
import { Dialog } from "vant";
import { Notify } from "vant";

Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Form);
Vue.use(Picker);
Vue.use(Empty);
Vue.use(ActionSheet);
Vue.use(Popup);
Vue.use(DatetimePicker);
Vue.use(Icon);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(SubmitBar);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Calendar);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(NumberKeyboard);
Vue.use(Tag);
Vue.use(Field);
Vue.use(Button);

// 全局注册
Vue.prototype.$notify = Notify;
Vue.prototype.$toast = Toast;
Vue.prototype.$axios = axios;
Vue.prototype.$dialog = Dialog;

Vue.prototype.$dayjs = dayjs;

dayjs.extend(isLeapYear); // use plugin
dayjs.locale("zh-cn"); // use locale

// 引入echarts
import * as echarts from "echarts";
Vue.prototype.$echarts = echarts;

if (process.env.NODE_ENV == "development") {
  // 开发环境
  //配置默认IP地址
  axios.defaults.baseURL = "http://1.94.161.15:9999";
} else {
  // 打包环境
  axios.defaults.baseURL = "http://1.94.161.15:9999";
}

// 引入reset.css
import "./assets/css/reset.css";

// 引入vant的css
import "vant/lib/index.css";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
