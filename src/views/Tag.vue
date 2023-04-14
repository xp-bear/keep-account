<template>
  <div class="Tag">
    <!-- 头部标题 -->
    <van-button type="primary" color="#e8e8e8" block class="title" style="background-color: #dce2e7"> 记录查询 </van-button>

    <!-- 轮播图 -->
    <!-- <van-swipe class="my-swipe" :autoplay="2000" indicator-color="white">
      <van-swipe-item>
        <img src="http://cdn.xxoutman.cn/image-1679842151298.png?1679842151834" alt="" style="width: 100%; object-fit: cover" />
      </van-swipe-item>
      <van-swipe-item>
        <img src="http://cdn.xxoutman.cn/image-1679842135181.png?1679842135368" alt="" style="width: 100%; object-fit: cover" />
      </van-swipe-item>
      <van-swipe-item>
        <img src="http://cdn.xxoutman.cn/image-1679842085405.png?1679842085631" alt="" style="width: 100%; object-fit: cover" />
      </van-swipe-item>
      <van-swipe-item>
        <img src="http://cdn.xxoutman.cn/image-1679842048569.png?1679842049064" alt="" style="width: 100%; object-fit: cover" />
      </van-swipe-item>
    </van-swipe> -->

    <!-- 本年信息展示 -->
    <div class="card">
      <div class="analy">年度金额统计分析</div>
      <div style="display: flex; align-items: center; justify-content: center; height: 0.6rem">
        <input type="number" v-model="yearNumber" @blur="getYearFn" />
        <span style="font-family: xp">年</span>
      </div>
      <div class="info">
        <div class="left">
          <div><van-icon name="down" size="16" color="#52d181" /></div>
          <div style="display: flex; flex-direction: column; margin: 0 0.4rem">
            <span style="color: rgba(119, 119, 125, 1); font-size: 0.22rem; margin-bottom: 0.1rem">年度收入</span>
            <span style="font-size: 0.28rem; color: rgba(21, 20, 31, 1); font-weight: 700">¥{{ yaerIncome ? yaerIncome : 0 }}</span>
          </div>
        </div>
        <div class="center" style="width: 0.01rem; height: 100%; background-color: rgba(232, 235, 238, 1)"></div>
        <div class="right">
          <div><van-icon name="down" size="16" color="#db1f26" style="transform: rotate(180deg)" /></div>
          <div style="display: flex; flex-direction: column; margin: 0 0.4rem">
            <span style="color: rgba(119, 119, 125, 1); font-size: 0.22rem; margin-bottom: 0.1rem">年度支出</span>
            <span style="font-size: 0.28rem; color: rgba(21, 20, 31, 1); font-weight: 700">¥{{ yearPay ? yearPay : 0 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 标题选项 -->
    <div class="income">
      <van-button
        icon="http://cdn.xxoutman.cn/pay-1679804063180.png?1679804063362"
        type="primary"
        color="#de3126"
        hairline
        :plain="!Boolean(incomeState == 0)"
        block
        size="small"
        @click="switchChangeIncome(0)"
      >
        支出
      </van-button>
      <van-button
        icon="http://cdn.xxoutman.cn/income-1679804092077.png?1679804092248"
        type="primary"
        color="#52d181"
        hairline
        :plain="!Boolean(incomeState == 1)"
        block
        size="small"
        @click="switchChangeIncome(1)"
      >
        收入
      </van-button>
    </div>

    <!-- 按日期查询 -->
    <van-cell title="按日期查询" :value="selectDate" @click="selectDateShow = true" is-link />
    <van-calendar color="#1bb5fe" v-model="selectDateShow" @confirm="onConfirm" :min-date="dayMinData" />

    <!-- 查询日期详细列表 -->
    <van-collapse v-model="activeNames" v-if="selectDate">
      <van-collapse-item icon="shop-o" v-if="datas.length > 0">
        <template #title>
          <div style="display: flex; justify-content: space-between; align-items: center; vertical-align: bottom">
            <span style="letter-spacing: 0.012em; line-height: 0.48rem">{{ selectDate }}</span>
            <span v-show="incomeState == 0" style="color: red; font-weight: 700">总消费: <van-icon name="balance-o" size="16" />{{ Math.round(totalMoney * 100) / 100 }}</span>
            <span v-show="incomeState == 1" style="color: green; font-weight: 700">总收入: <van-icon name="balance-o" size="16" />{{ Math.round(totalMoney * 100) / 100 }}</span>
          </div>
        </template>
        <ul class="detail">
          <li v-for="item in datas" :key="item.record_id" @click="changeActionPanel()" @touchstart="gtouchstart(item)" @touchmove="gtouchmove()" @touchend="showDeleteButton(item)">
            <span>{{ tagValue(item.record_tag) }}</span>
            <span>{{ item.record_time }}</span>
            <span>{{ item.record_comment }}</span>
            <span style="width: 20%">¥ {{ item.record_money }}</span>
          </li>
        </ul>
      </van-collapse-item>

      <!-- 日期空状态显示 -->
      <van-empty v-else class="custom-image" image="http://cdn.xxoutman.cn/empty-1680012688890.gif" description="该日期暂无记录" />
    </van-collapse>

    <!-- 按月份查询 -->
    <van-cell title="按月份查询" :value="selectMonth" @click="monthPanelState = true" is-link />
    <van-popup v-model="monthPanelState" position="bottom" :style="{ height: '50%' }">
      <van-datetime-picker v-model="currentDate" @cancel="month_cancel" @confirm="month_confirm" type="year-month" title="选择月份" :min-date="minDate" :max-date="maxDate" :formatter="formatter" />
    </van-popup>

    <!-- 月份查询详细列表 -->
    <van-collapse v-model="activeMonthNames" v-if="selectMonth">
      <van-collapse-item icon="shop-o" v-for="(value, key) in monthDatas" :index="key">
        <template #title>
          <div style="display: flex; justify-content: space-between; align-items: center; vertical-align: bottom">
            <span style="letter-spacing: 0.012em; line-height: 0.48rem">{{ timeFormat(key) }}</span>
            <span v-show="incomeState == 0" style="color: red; font-weight: 700">总消费: <van-icon name="balance-o" size="16" />{{ Math.round(value[value.length - 1] * 100) / 100 }}</span>
            <span v-show="incomeState == 1" style="color: green; font-weight: 700">总收入: <van-icon name="balance-o" size="16" />{{ Math.round(value[value.length - 1] * 100) / 100 }}</span>
          </div>
        </template>
        <ul class="detail">
          <!-- 每一个列表长按 移动端事件 -->
          <li v-for="(item, index) in value" :key="item.record_id" @click="changeActionPanel()" @touchstart="gtouchstart(item)" @touchmove="gtouchmove()" @touchend="showDeleteButton(item)">
            <template v-if="index < value.length - 1">
              <span>{{ tagValue(item.record_tag) }}</span>
              <span>{{ item.record_time }}</span>
              <span>{{ item.record_comment }}</span>
              <span style="width: 20%">¥ {{ item.record_money }}</span>
            </template>
          </li>
        </ul>
      </van-collapse-item>

      <!-- 空状态显示 -->
      <van-empty v-if="Object.keys(monthDatas).length === 0" class="custom-image" image="http://cdn.xxoutman.cn/empty-1680012743090.gif" description="未查询到当月数据" />
    </van-collapse>

    <!-- 按类别查询 -->
    <van-cell title="按类别查询" :value="typeValue" @click="isTypeShow = true" is-link />

    <!-- 类别查询详细列表 -->
    <van-collapse v-model="activeMonthNames" v-if="typeValue">
      <van-collapse-item icon="shop-o" v-for="(value, key) in typeDatas" :index="key">
        <template #title>
          <div style="display: flex; justify-content: space-between; align-items: center; vertical-align: bottom">
            <span style="letter-spacing: 0.012em; line-height: 0.48rem">{{ timeFormat(key) }}</span>
            <span v-show="incomeState == 0" style="color: red; font-weight: 700">总消费: <van-icon name="balance-o" size="16" />{{ Math.round(value[value.length - 1] * 100) / 100 }}</span>
            <span v-show="incomeState == 1" style="color: green; font-weight: 700">总收入: <van-icon name="balance-o" size="16" />{{ Math.round(value[value.length - 1] * 100) / 100 }}</span>
          </div>
        </template>
        <ul class="detail">
          <!-- 每一个列表长按 移动端事件 -->
          <li v-for="(item, index) in value" :key="item.record_id" @click="changeActionPanel()" @touchstart="gtouchstart(item)" @touchmove="gtouchmove()" @touchend="showDeleteButton(item)">
            <template v-if="index < value.length - 1">
              <span>{{ tagValue(item.record_tag) }}</span>
              <span>{{ item.record_time }}</span>
              <span>{{ item.record_comment }}</span>
              <span style="width: 20%">¥ {{ item.record_money }}</span>
            </template>
          </li>
        </ul>
      </van-collapse-item>

      <!-- 空状态显示 -->
      <van-empty v-if="Object.keys(typeDatas).length === 0" class="custom-image" image="http://cdn.xxoutman.cn/empty-1680775619747.gif?1680775620066" description="该类别未查询到数据" />
    </van-collapse>

    <!-- 底部站位div盒子 -->
    <div style="height: 1.2rem"></div>
    <!-- -------------------------------------- -->
    <!-- 动作面板 -->
    <van-action-sheet v-model="ActionShow" :actions="actions" @select="onSelect" description="是否要删除当前该条记录？" cancel-text="取消" />

    <!-- 对话框弹出层,修改当前数据 -->
    <van-popup v-model="showPopup" style="border-radius: 0.3rem">
      <div style="width: 7rem">
        <div v-show="incomeState == 0" style="text-align: center; padding-top: 0.2rem; font-family: consolas; font-weight: 700; color: red">支出详情</div>
        <div v-show="incomeState == 1" style="text-align: center; padding-top: 0.2rem; font-family: consolas; font-weight: 700; color: green">收入详情</div>
        <van-form @submit="onSubmit">
          <van-field v-model="up_date" name="日期" label="日期:" :rules="[{ required: true, message: '请填写日期' }]" />
          <!-- <van-field v-model="up_type" name="类别" label="类别:" :rules="[{ required: true, message: '请填写类别' }]" /> -->
          <van-field v-model="up_money" name="金额" label="金额:" :rules="[{ required: true, message: '请填写金额' }]" />
          <van-field v-model="up_comment" name="备注" label="备注:" :rules="[{ required: true, message: '请填写备注' }]" />
          <!-- 类别选择 支出 -->
          <van-radio-group v-if="incomeState == 0" v-model="up_type" direction="horizontal" style="font-family: consolas; padding: 0 0.32rem; font-size: 0.32rem">
            <van-radio name="0" icon-size="0.28rem" checked-color="#de3126"><span style="font-size: 0.28rem">服饰鞋帽</span> </van-radio>
            <van-radio name="1" icon-size="0.28rem" checked-color="#de3126"><span style="font-size: 0.28rem">交通出行</span></van-radio>
            <van-radio name="2" icon-size="0.28rem" checked-color="#de3126"><span style="font-size: 0.28rem">食物小吃</span></van-radio>
            <van-radio name="3" icon-size="0.28rem" checked-color="#de3126"><span style="font-size: 0.28rem">学习提升</span></van-radio>
            <van-radio name="4" icon-size="0.28rem" checked-color="#de3126"><span style="font-size: 0.28rem">外出旅行</span></van-radio>
            <van-radio name="5" icon-size="0.28rem" checked-color="#de3126"><span style="font-size: 0.28rem">娱乐消费</span></van-radio>
            <van-radio name="6" icon-size="0.28rem" checked-color="#de3126"><span style="font-size: 0.28rem">其他项目</span></van-radio>
          </van-radio-group>
          <!-- 类别选择 收入 -->
          <van-radio-group v-else v-model="up_type" direction="horizontal" style="font-family: consolas; padding: 0 0.32rem; font-size: 0.32rem">
            <van-radio name="0" icon-size="0.28rem" checked-color="#52d181"><span style="font-size: 0.28rem">工资薪金</span></van-radio>
            <van-radio name="1" icon-size="0.28rem" checked-color="#52d181"><span style="font-size: 0.28rem">奖金提成</span></van-radio>
            <van-radio name="2" icon-size="0.28rem" checked-color="#52d181"><span style="font-size: 0.28rem">偶然所得</span></van-radio>
            <van-radio name="3" icon-size="0.28rem" checked-color="#52d181"><span style="font-size: 0.28rem">投资收益</span></van-radio>
            <van-radio name="4" icon-size="0.28rem" checked-color="#52d181"><span style="font-size: 0.28rem">劳务报酬</span></van-radio>
            <van-radio name="5" icon-size="0.28rem" checked-color="#52d181"><span style="font-size: 0.28rem">其他项目</span></van-radio>
          </van-radio-group>

          <div style="margin: 0.32rem">
            <van-button round block type="info" native-type="submit" size="small" :color="incomeState == 0 ? '#de3126' : '#52d181'">确认修改</van-button>
          </div>
        </van-form>
      </div>
    </van-popup>

    <!-- 底部弹出对话框,查询条件 -->
    <van-popup v-model="isTypeShow" position="bottom" :style="{ height: '50%' }">
      <van-picker title="按类别查询" show-toolbar :columns="incomeState == 0 ? payColumns : incomeColumns" @confirm="onConfirmTag" @cancel="onCancelTag" />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "Tag",
  components: {},
  data() {
    return {
      activeNames: [0],
      activeMonthNames: [""],
      totalMoney: 0, //每一天金额的统计总数.
      datas: [], //每一天的消费查询
      selectDate: "", //选择查询的日期
      selectDateShow: false, //是否展示日历面板
      incomeState: 0, //收入与支出状态 0-支出 1-收入
      // 月份
      minDate: new Date(2023, 0, 1),
      maxDate: new Date(2030, 11, 30),
      // 日期的minData
      dayMinData: new Date(this.$dayjs(new Date()).format("YYYY"), +this.$dayjs(new Date()).format("MM") - 3, this.$dayjs(new Date()).format("DD")),
      currentDate: "",
      monthPanelState: false, //月份面板状态
      selectMonth: "", //选择的月份 2023/11月
      monthDatas: {}, //当前月份数据
      dataOnce: "", //一条数据
      ActionShow: false, //动作面板展开状态。
      actions: [{ name: "删除", color: "#ee0a24" }],

      yearNumber: this.$dayjs(new Date()).format("YYYY"), //默认年度
      yearPay: 0, //支出
      yaerIncome: 0, //收入

      timeOutEvent: null, //定时器状态
      showPopup: false, //对话框默认状态

      // 修改数据绑定的值
      up_date: "", //修改的日期
      up_type: "", // 类别
      up_money: "", //金额
      up_comment: "", //备注
      up_id: -1, //要删除数据的id

      isTypeShow: false, //按类别查询状态对话框
      payColumns: [
        // 第一列
        {
          values: ["服饰鞋帽", "交通出行", "食物小吃", "学习提升", "外出旅行", "娱乐消费", "其他项目"],
          defaultIndex: 2,
        },
        // 第二列
        {
          values: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          defaultIndex: 1,
        },
        {
          values: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
          defaultIndex: 5,
        },
      ],
      incomeColumns: [
        // 第一列
        {
          values: ["工资薪金", "奖金提成", "偶然所得", "投资收益", "劳务报酬", "娱乐消费", "其他项目"],
          defaultIndex: 2,
        },
        // 第二列
        {
          values: ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"],
          defaultIndex: 1,
        },
        {
          values: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
          defaultIndex: 1,
        },
      ],
      typeValue: "", //类别数据展示
      typeDatas: {}, //当前月份类别数据
      typeArr: [],
    };
  },
  mounted() {
    this.getInitData();
    this.getYearData();

    // 禁止选中事件
    // 如果是想禁用长按弹出菜单, 用js的话,阻止默认事件
    window.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });
  },
  methods: {
    // 类别查询确认
    onConfirmTag(value, index) {
      // console.log(`当前值：${value}, 当前索引：${index}`);
      this.isTypeShow = false;
      this.typeValue = value.join(",");
      this.getTypeData(value[1], value[2], index[0]);
      this.typeArr = this.typeArr.concat([value[1], value[2], index[0]]);
    },

    getTypeData(year, month, tag) {
      // 请求类别月份数据
      this.$axios
        .get(`/account/searchmonth?monthdata=${year}/${month}&flag=${this.incomeState}&tag=${tag}`)
        .then((res) => {
          this.typeDatas = res.data;

          for (let key in this.typeDatas) {
            let totalMoney = 0;
            this.typeDatas[key].forEach((item) => {
              totalMoney += +item.record_money;
            });
            this.typeDatas[key].push(totalMoney);
          }
          // console.log(this.typeDatas);
        })
        .catch((err) => {
          // console.log(err);
        });
    },
    //类别查询取消
    onCancelTag() {
      // console.log("取消");
      this.isTypeShow = false;
    },
    // 修改数据的对话框点击确认按钮
    onSubmit() {
      this.$dialog
        .confirm({
          title: "弹窗提示",
          message: "是否确认修改相关数据?",
        })
        .then(() => {
          this.showPopup = false; //关闭对话框
          this.$axios
            .post("/account/update", {
              record_state: this.incomeState,
              record_id: this.up_id,
              record_comment: this.up_comment,
              record_money: this.up_money,
              record_tag: +this.up_type,
            })
            .then((res) => {
              // 修改数据
              this.$toast.success({
                message: "修改成功",
                forbidClick: true,
                duration: "1000",
              });
              // 请求初始数据
              this.totalMoney = 0;
              this.getInitData();
              this.getYearData();
              this.getMonthDatas(); //初始月分数据
              this.getTypeData(...this.typeArr); //初始类别数据
            });
        })
        .catch(() => {
          // on cancel
        });
    },

    // 请求每一个的消费情况
    getYearFn() {
      this.getYearData();
    },
    // 请求年度数据
    getYearData() {
      this.$axios.get(`/account/searchyear?year=${this.yearNumber}&flag=0`).then((res) => {
        this.yearPay = res.data[0].total_money;
      });
      this.$axios.get(`/account/searchyear?year=${this.yearNumber}&flag=1`).then((res) => {
        // console.log(res.data);
        this.yaerIncome = res.data[0].total_money;
      });
    },

    // 请求初始数据
    getInitData() {
      this.selectDate = this.formatDate(new Date());
      // 请求查询的时间
      this.$axios.get(`/account/searchday?date=${this.selectDate}&flag=${this.incomeState}`).then((res) => {
        this.datas = res.data;

        this.date = this.$dayjs(res.data[0]?.record_create_time).format("YYYY-MM-DD"); //处理时间格式
        res.data.forEach((item) => {
          this.totalMoney += +item.record_money;
        });
      });
    },

    //长按事件（起始）
    gtouchstart(item) {
      this.dataOnce = item; //赋值

      var self = this;
      this.timeOutEvent = setTimeout(function () {
        self.longPress(item);
      }, 500); //这里设置定时器，定义长按500毫秒触发长按事件
      return false;
    },
    //真正长按后应该执行的内容
    longPress(item) {
      this.timeOutEvent = 0; //重置定时器状态
      //执行长按要执行的内容，如弹出菜单
      // 打开弹出层
      this.showPopup = true;

      // 进行赋值操作
      this.up_date = this.$dayjs(item.record_create_time).format("YYYY-MM-DD") + " " + item.record_time;
      this.up_type = item.record_tag + "";
      this.up_money = item.record_money;
      this.up_comment = item.record_comment;
      this.up_id = item.record_id;

      // console.log("长按", this.up_type);
    },
    //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
    gtouchmove() {
      clearTimeout(this.timeOutEvent); //清除定时器
      this.timeOutEvent = 0;
    },
    //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
    showDeleteButton(item) {
      clearTimeout(this.timeOutEvent); //清除定时器
      if (this.timeOutEvent != 0) {
        //这里写要执行的内容（如onclick事件）
        // console.log("点击但未长按");
      }
      return false;
    },

    // 点击每一个详细列表出来弹出层。
    changeActionPanel() {
      this.ActionShow = true;
    },
    // 点击动态面板删除之后执行的操作
    onSelect() {
      // console.log(this.dataOnce);
      this.ActionShow = false;
      // 调用接口删除数据
      this.$axios.post("/account/delete", { record_id: this.dataOnce.record_id }).then((res) => {
        this.$toast.success({
          message: "删除成功",
          forbidClick: true,
          duration: "1000",
        });
        this.selectDate = ""; //选择日期置为空。
        this.selectMonth = ""; //选择月份置为空。
        this.typeValue = ""; //重置类别value
        this.totalMoney = 0;
        this.getInitData();
        this.getYearData(); //重新请求年度接口数据
      });
    },
    // 按月份查询取消。
    month_cancel() {
      this.monthPanelState = false;
    },
    // 按月份查询确认。
    month_confirm() {
      this.selectMonth = this.$dayjs(this.currentDate).format("YYYY/MM");
      // console.log(this.selectMonth); //月份
      this.monthPanelState = false;

      // 请求查询的月份
      this.getMonthDatas();
    },
    // 请求查询的月份
    getMonthDatas() {
      this.$axios.get(`/account/searchmonth?monthdata=${this.selectMonth}&flag=${this.incomeState}`).then((res) => {
        this.monthDatas = res.data;

        for (let key in this.monthDatas) {
          let totalMoney = 0;
          this.monthDatas[key].forEach((item) => {
            totalMoney += +item.record_money;
          });
          this.monthDatas[key].push(totalMoney);
        }
      });
    },
    // 选择月份
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      }
      return val;
    },
    //收入与支出切换
    switchChangeIncome(value) {
      this.selectDate = ""; // 重置查询的日期
      this.selectMonth = ""; //重置查询的月份
      this.typeValue = ""; //重置类别显示
      this.totalMoney = 0; //初始金额为0
      this.incomeState = value; //赋值操作
      this.getInitData();
    },
    // 格式化日期格式。
    formatDate(date) {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
    // 重新选择时间
    onConfirm(date) {
      this.totalMoney = 0; //总金额重新设置为0
      this.selectDateShow = false;
      this.selectDate = this.formatDate(date);
      // console.log("确定的时间:", this.selectDate);
      // 请求查询的时间
      this.$axios.get(`/account/searchday?date=${this.selectDate}&flag=${this.incomeState}`).then((res) => {
        this.datas = res.data;
        // if (this.datas.length <= 0) {
        //   this.activeNames = ["0"];
        // } else {
        //   this.activeNames = ["1"];
        // }
        this.date = this.$dayjs(res.data[0]?.record_create_time).format("YYYY-MM-DD"); //处理时间格式
        res.data.forEach((item) => {
          this.totalMoney += +item.record_money;
        });
      });
    },
    // 标签过滤器
    tagValue(value) {
      let tag = "";
      if (this.incomeState == 0) {
        switch (value) {
          case 0:
            tag = "服饰鞋帽";
            break;
          case 1:
            tag = "交通出行";
            break;
          case 2:
            tag = "食物小吃";
            break;
          case 3:
            tag = "学习提升";
            break;
          case 4:
            tag = "外出旅行";
            break;
          case 5:
            tag = "娱乐消费";
            break;
          case 6:
            tag = "其他项目";
            break;
        }
      } else {
        switch (value) {
          case 0:
            tag = "工资薪金";
            break;
          case 1:
            tag = "奖金提成";
            break;
          case 2:
            tag = "偶然所得";
            break;
          case 3:
            tag = "投资收益";
            break;
          case 4:
            tag = "劳务报酬";
            break;
          case 5:
            tag = "其他项目";
            break;
        }
      }
      return tag;
    },
    // 时间格式化处理
    timeFormat(time) {
      return this.$dayjs(time).format("YYYY-MM-DD");
    },
  },
};
</script>
<style lang="less" scoped>
.Tag {
  /*如果是禁用长按选择文字功能，用css*/
  * {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  // 这是input
  input {
    -webkit-user-select: auto; /*webkit浏览器*/
  }
  // ---------------------------------------
  // 轮播图
  .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 0.4rem;
    line-height: 3rem;
    height: 3rem;
    text-align: center;
    // background-color: #39a9ed;
    img {
      // width: 7.5rem;
      height: 3rem;
    }
  }
  .title {
    .van-button__text {
      color: black;
    }
  }
  .card {
    overflow: hidden;
    width: 7.5rem;
    height: 3.1rem;
    // margin: 0.2rem auto;
    padding: 0 0.2rem;
    box-sizing: border-box;
    // border-radius: 0.16rem;
    background-color: #8ec5fc;
    background-image: linear-gradient(62deg, #8ec5fc 0%, #e0c3fc 100%);
    .analy {
      margin-top: 0.2rem;
      width: 6.7rem;
      height: 0.4rem;
      line-height: 0.4rem;
      text-align: center;
      letter-spacing: 0.02rem;
      font-size: 0.24rem;
    }
    input {
      width: 1.5rem;
      height: 0.4rem;
      border: 0;
      font-size: 0.4rem;
      font-family: digital;
      border-radius: 0.1rem;
      margin-right: 0.1rem;
      text-align: center;
      background-color: transparent;
      border: 0.01rem solid #fff;
    }
    .info {
      width: 6.22rem;
      margin: 0.2rem auto 0;
      height: 1.44rem;
      background-color: #fff;
      border-radius: 0.16rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: 0.28rem 0.4rem;
      .left {
        display: flex;
        align-items: center;
        .van-icon {
          width: 0.56rem;
          height: 0.56rem;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #e5f8ec;
          border-radius: 0.08rem;
        }
      }
      .right {
        display: flex;
        align-items: center;
      }
      .van-icon {
        width: 0.56rem;
        height: 0.56rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fbe4e5;
        border-radius: 0.08rem;
      }
    }
  }
  .income {
    display: flex;
    .van-button {
      border-radius: 0;
    }
    .van-button__text {
      font-size: 0.32rem;
    }
  }
  .time {
    display: flex;
    justify-content: space-between;
    .van-button {
      width: 50%;
      border: 0;
    }
  }
  .consumer {
    width: 7.5rem;
    li {
      height: 0.8rem;
      background-color: pink;
    }
  }
  .detail {
    li {
      display: flex;
      span {
        &:nth-child(1) {
          width: 20%;
        }
        &:nth-child(2) {
          width: 20%;
        }
        &:nth-child(3) {
          width: 45%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:nth-child(4) {
          width: 15%;
          padding-left: 0.1rem;
        }
      }
    }
  }
}
</style>
