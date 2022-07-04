import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

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
Vue.prototype.$toast = Toast;

// 引入echarts
import * as echarts from "echarts";
Vue.prototype.$echarts = echarts;

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
