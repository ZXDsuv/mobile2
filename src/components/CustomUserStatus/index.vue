<template>
  <view class="custom-user-status">
    <view
      class="list-area"
      :class="{ 'has-gift-area': showGiftArea, 'full-bet-box2': gameId === 8 }"
    >
      <!-- 牛牛整桌瞒住 -->
      <view v-if="gameId === 3 && fullType == 3" class="full-bet-box"> 整桌满注 </view>
      <view class="all-scroll">
        <template v-if="fullType == 3 && gameId === 3">
          <view class="user-box" v-for="(item, i) in fullList" :key="item">
            <view class="user-title">
              <view class="user-seat">{{ item.num }}</view>
              <view class="user-count">
                <image
                  src="@/static/images/index/user-icon.svg"
                  class="people-icon"
                ></image>
                <text>{{ 0 }}</text>
              </view>
            </view>
            <view class="user-list" ref="listContainer" :data-id="item.num">
              <view
                class="user-list-scroll"
                :style="getScrollStyle(item)"
                ref="scrollContent"
                :data-id="item.num"
              >
                <view
                  class="user-item ignore-vh-box"
                  :class="{ 'nn-game': gameId == 3, 'bjl-game': gameId == 1 }"
                  v-for="(num, numIndex) in item.caijinData"
                  :key="numIndex"
                >
                  <!-- 牛牛 -->
                  <template v-if="gameId == 3">
                    <template v-if="true">
                      <view
                        class="user-mes ignore-vh-user-mes color-header"
                        :class="{
                          caijin: num.area == 'jackpot',
                          'nn-pay': num.is_checkout,
                        }"
                      >
                        <span>{{ num.username }}</span>
                        <!-- 换庄图标 -->
                        <image
                          v-if="isSwap(num.user_id, item)"
                          class="changeBanker"
                          src="@/static/images/index/changeBanker.svg"
                        >
                        </image>
                        <!-- 彩金 -->
                        <image
                          v-if="num.area === 'jackpot'"
                          class="changeBanker"
                          src="@/static/images/index/caijin.svg"
                        >
                        </image>
                      </view>

                      <view
                        class="user-result color-content"
                        :class="{ 'caijin-content': num.area === 'jackpot' }"
                      >
                        <!-- 整桌满注 -->
                        <template v-if="fullType == 3">
                          <view
                            v-for="(number, nIndex) in showNumberArea(num.areaList)"
                            :key="nIndex"
                            class="nn-content-item"
                            :class="[
                              getColorClass(number.area),
                              { 'nn-pay': number.is_checkout },
                            ]"
                          >
                            {{ `${number.amount}(${number.count})` }}
                            <image
                              v-if="number.is_checkout"
                              class="checked-icon"
                              src="@/static/images/index/right-icon.svg"
                            >
                            </image>
                          </view>
                        </template>
                      </view>
                    </template>
                  </template>
                </view>

                <view
                  class="user-item ignore-vh-box"
                  :class="{ 'nn-game': gameId == 3, 'bjl-game': gameId == 1 }"
                  v-for="(num, numIndex) in 1"
                  :key="numIndex"
                >
                  <!-- 牛牛 -->
                  <template v-if="gameId == 3">
                    <template v-if="true">
                      <view
                        class="user-mes ignore-vh-user-mes color-header"
                        :class="{
                          caijin: num.area == 'jackpot',
                          'nn-pay': num.is_checkout,
                        }"
                      >
                        <span class="full-bet">{{ "满注" }}</span>
                        <!-- 换庄图标 -->
                        <image
                          v-if="isSwap(num.user_id, item)"
                          class="changeBanker"
                          src="@/static/images/index/changeBanker.svg"
                        >
                        </image>
                        <!-- 彩金 -->
                        <image
                          v-if="num.area === 'jackpot'"
                          class="changeBanker"
                          src="@/static/images/index/caijin.svg"
                        >
                        </image>
                      </view>
                      <view
                        class="user-result color-content"
                        :class="{ 'caijin-content': num.area === 'jackpot' }"
                      >
                        <!-- 整桌满注 -->
                        <template v-if="fullType == 3">
                          <view
                            v-for="(number, nIndex) in item.fullData"
                            :key="number"
                            class="nn-content-item"
                            :class="[
                              `text-color-${nIndex + 1}`,
                              { 'nn-pay': number.is_checkout },
                            ]"
                          >
                            {{ `${number.amount}(${number.count})` }}
                            <image
                              class="checked-icon"
                              v-if="number.is_checkout"
                              src="@/static/images/index/right-icon.svg"
                            >
                            </image>
                          </view>
                        </template>
                      </view>

                      <view
                        class="user-mes ignore-vh-user-mes cash-box"
                        :class="[`cash-${cashItem.area}`]"
                        v-for="cashItem in item.cashData"
                        :key="cashItem"
                      >
                        <text class="title">
                          {{
                            cashItem.area == "equal"
                              ? "平倍"
                              : cashItem.area == "double"
                              ? "翻倍"
                              : "超倍"
                          }}
                        </text>
                        <text class="content"> CASH </text>
                      </view>
                    </template>
                  </template>
                </view>
              </view>
            </view>
          </view>
        </template>
        <template v-else>
          <view class="user-box" v-for="(item, i) in list" :key="item.i">
            <view class="user-title">
              <view class="user-seat">{{ item.num }}</view>
              <view class="user-count">
                <image
                  src="@/static/images/index/user-icon.svg"
                  class="people-icon"
                ></image>
                <text>{{ item.userCount }}</text>
              </view>
            </view>
            <view class="user-list" ref="listContainer" :data-id="item.id">
              <view
                class="user-list-scroll"
                :style="getScrollStyle(item)"
                ref="scrollContent"
                :data-id="item.id"
              >
                <view
                  class="user-item ignore-vh-box"
                  :class="{ 'nn-game': gameId == 3, 'bjl-game': gameId == 1 }"
                  v-for="(num, numIndex) in numListGet(item.numList)"
                  :key="numIndex"
                >
                  <!-- 百家乐龙虎 -->
                  <template v-if="gameId == 1">
                    <template v-if="!num.is_cash">
                      <view
                        class="user-mes ignore-vh-user-mes"
                        :class="{
                          'color-header-2': num.area === 'banker',
                          'color-header-1': num.area === 'player',
                          'disable-user-box': num.is_checkout,
                        }"
                      >
                        {{ num.full_bet ? "满注" : num.username }}</view
                      >
                      <view
                        class="user-result"
                        :class="{
                          'color-content-2': num.area === 'banker',
                          'color-cash-1': num.area === 'player',
                          'disable-user-box': num.is_checkout,
                        }"
                      >
                        {{ `${numberWithCommas(num.amount)}(${num.count})` }}
                      </view>
                    </template>
                    <!-- 现金 -->
                    <template v-else>
                      <view
                        class="user-result"
                        :class="{
                          'disable-user-box': num.is_checkout,
                          'color-cash-1': num.area === 'banker',
                          'color-cash-2': num.area === 'player',
                        }"
                      >
                        {{ `CASH` }}
                      </view>
                    </template>

                    <image
                      v-if="num.is_checkout"
                      class="checked-icon"
                      src="@/static/images/index/right-icon.svg"
                    ></image>
                    <CustomWarning :active="num.isLow" v-if="num.isLow">
                      <template #content> 下注低于限红 </template>
                    </CustomWarning>
                  </template>

                  <!-- 牛牛 -->
                  <template v-else>
                    <template v-if="num.is_cash !== 1">
                      <view
                        class="user-mes ignore-vh-user-mes color-header"
                        :class="{
                          caijin: num.area == 'jackpot',
                          'nn-pay': num.is_checkout,
                        }"
                      >
                        <span v-if="showNomal(num.areaList)">{{ num.username }}</span>
                        <span
                          class="full-bet"
                          v-else-if="num.fullBetType === 1 && num.is_cash !== 1"
                          >{{ "满注" }}</span
                        >
                        <!-- 换庄图标 -->
                        <image
                          v-if="isSwap(num.user_id, item)"
                          class="changeBanker"
                          src="@/static/images/index/changeBanker.svg"
                        >
                        </image>
                        <!-- 彩金 -->
                        <image
                          v-if="num.area == 'jackpot'"
                          class="changeBanker"
                          src="@/static/images/index/caijin.svg"
                        >
                        </image>
                      </view>
                      <view
                        class="user-result color-content"
                        :class="{ 'caijin-content': num.area == 'jackpot' }"
                      >
                        <template v-if="fullType == 0">
                          <!-- 未满注 -->
                          <view
                            v-for="(number, nIndex) in showNumberArea(num.areaList)"
                            :key="nIndex"
                            class="nn-content-item"
                            :class="[
                              getColorClass(number.area),
                              { 'nn-pay': number.is_checkout },
                            ]"
                          >
                            {{ `${number.amount}(${number.count})` }}
                            <image
                              v-if="number.is_checkout"
                              class="checked-icon"
                              src="@/static/images/index/right-icon.svg"
                            >
                            </image>
                            <template v-if="num.area !== 'jackpot'">
                              <CustomWarning
                                :active="number.isHightLimit"
                                v-if="number.isHightLimit"
                              >
                                <template #content> 下注高于限红 </template>
                              </CustomWarning>
                              <CustomWarning
                                :active="number.isLowLimit"
                                v-if="number.isLowLimit"
                              >
                                <template #content> 下注低于限红 </template>
                              </CustomWarning>
                            </template>
                            <template v-if="num.area == 'jackpot'">
                                <CustomWarning
                                :active="getJackPotShow(item.numList)"
                                v-if="getJackPotShow(item.numList)"
                              >
                                <template #content>彩金区域只能一人下注</template>
                              </CustomWarning>
                            </template>
                          </view>
                          <!-- 单个区域满注 -->
                          <view
                            class="nn-content-item"
                            :class="[
                              getColorClass(num.area),
                              { 'nn-pay': num.is_checkout },
                            ]"
                            v-if="num.user_id == 0 && num.full_bet"
                            >{{ `${num.amount}(${num.count})` }}
                            <image
                              v-if="num.is_checkout"
                              class="checked-icon"
                              src="@/static/images/index/right-icon.svg"
                            >
                            </image>
                          </view>
                        </template>
                        <!-- 整桌满注 -->
                        <template v-if="fullType == 3">
                          <view
                            v-for="(number, nIndex) in 1"
                            :key="number"
                            class="nn-content-item"
                            :class="[
                              `text-color-${nIndex + 1}`,
                              { 'nn-pay': number.is_checkout },
                            ]"
                          >
                            {{ `整桌满注` }}
                            <image
                              class="checked-icon"
                              v-if="num.is_checkout"
                              src="@/static/images/index/right-icon.svg"
                            >
                            </image>
                          </view>
                        </template>
                      </view>
                    </template>
                    <template v-else>
                      <view
                        class="user-mes ignore-vh-user-mes cash-box"
                        :class="[`cash-${num.area}`]"
                      >
                        <text class="title">
                          {{
                            num.area == "equal"
                              ? "平倍"
                              : num.area == "double"
                              ? "翻倍"
                              : "超倍"
                          }}
                        </text>
                        <text class="content"> CASH </text>
                        <image
                          v-if="isSwap(num.user_id, item)"
                          class="changeBanker"
                          src="@/static/images/index/changeBanker.svg"
                        >
                        </image>
                      </view>
                    </template>
                  </template>
                </view>
                <CustomWarning :active="item.isHight" v-if="item.isHight">
                  <template #content> 下注高于限红 </template>
                </CustomWarning>
              </view>
            </view>
          </view>
        </template>
      </view>
    </view>
    <view class="user-gift-area" v-if="showGiftArea">
      <view class="gift-item" v-for="item in giftList" :key="item" :data-id="item.id">
        <view class="item-header" :class="item.className">
          {{ item.label }}
        </view>
        <view class="scroll-content" :style="getScrollStyle(item)" :data-id="item.id">
          <view
            class="item-content"
            :class="{ 'disable-user-box': i.is_checkout }"
            v-for="i in item.numList"
            :key="i.id"
          >
            <view class="content-header ignore-vh-24">{{
              i.full_bet ? "满注" : i.username
            }}</view>
            <view class="content-content ignore-vh-24">{{
              `${i.amount}(${i.count})`
            }}</view>
            <image
              v-if="i.is_checkout"
              class="checked-icon"
              src="@/static/images/index/right-icon.svg"
            >
            </image>

            <CustomWarning :active="i.isLow" v-if="i.isLow">
              <template #content> 下注低于限红 </template>
            </CustomWarning>
          </view>
        </view>
        <CustomWarning :active="item.isHight" v-if="item.isHight">
          <template #content> 下注高于限红 </template>
        </CustomWarning>
      </view>
    </view>
  </view>
</template>

<script setup>
import {
  ref,
  computed,
  toRef,
  onMounted,
  nextTick,
  reactive,
  defineProps,
  watch,
  watchEffect,
} from "vue";

// tool
import { numberWithCommas } from "@/utils/tool";

// com
import CustomWarning from "@/components/CustomWarning/index.vue";

// static
import COMMON from "@/utils/common";

import { useGameeStore } from "@/store";
const { getTableInfo } = useGameeStore();
const gameId = computed(() => {
  return getTableInfo?.game_id || 1;
});

const showGiftArea = computed(() => {
  return gameId.value == 1 && props.commonList.length > 0;
});
// 定义 props
const props = defineProps({
  list1: {
    type: Array,
    default: () => [],
  },
  commonList: {
    type: Array,
    default: () => [],
  },
  fullType: {
    type: Number,
    default: 0,
  },

  fullList: {
    type: Array,
    default: () => [],
  },
});

// 每个座位是否只有一个人下注彩金区域jackpot
const getJackPotShow = (list) => {
    // 统计对象数组list中有多少个对象的area === 'jackpot'
    const jackpotCount = list.filter((obj) => obj.area === 'jackpot').length;
    // 如果jackpotCount大于1，返回true，否则返回false
    return jackpotCount > 1;
};

function smartUpdateList(targetList, newList) {
  // 如果长度不一样或 key 不一样才整体替换
  if (
    targetList.length !== newList.length ||
    targetList.some((item, index) => item.id !== newList[index].id)
  ) {
    targetList.splice(0, targetList.length, ...newList); // 保持引用不变
  } else {
    // 否则只替换每一项的内容
    newList.forEach((newItem, index) => {
      Object.assign(targetList[index], newItem);
    });
  }
}

const showNomal = (numList) => {
  // 全部的fullBetType 都等于 0 ，那么就显示
  return numList?.some((item) => item.fullBetType === 0);
};
const numListGet = (numList) => {
  if (gameId.value !== 3) return numList;
  // 如果item.areaList每一个都 == 0，那么
  if (props.fullType == 3) {
    return [
      {
        user_id: 0,
        fullBetType: 3,
        amount: 0,
      },
    ];
  }
  return numList.filter(
    (item) => item.user_id == 0 || !item.areaList.every((area) => area.fullBetType > 0)
  );
};
let list = ref([]);
const listContainer = ref(null);
const scrollContent = ref(null);
// id: 唯一标识 座位标识
// warning: 是否开启警告
// scrollSpeed: 滚动速度
// contentHeight: 内容高度
// containerHeight: 容器高度
// maxScrollOffset: 最大滚动偏移量
// isChecked: 是否赔付

let giftList = ref(props.commonList);

const getScrollStyle = (item) => ({
  "animation-duration": `${item.scrollSpeed}s`,
  "animation-play-state": item.scrollSpeed > 0 ? "running" : "paused",
  "--content-height": `${item.contentHeight}px`,
  "--container-height": `${item.containerHeight}px`,
  "--max-scroll-offset": `${Math.max(item.contentHeight - item.containerHeight, 0)}px`,
});

const showNumberArea = (list) => {
  // 这里要展示未瞒住的数据
  return list.filter((item) => item.fullBetType == 0);
};

// const calculateHeights = async () => {
//     await nextTick();
//     const query = uni.createSelectorQuery().in(this); // `in(this)` 重要！作用域是当前组件

//     query.select('.user-list').boundingClientRect();       // 容器高度
//     query.select('.user-list-scroll').boundingClientRect(); // 内容高度

//     query.exec(res => {
//         console.log(res);

//         const container = res[0];
//         const content = res[1];

//         containerHeight.value = container?.height || 0;
//         contentHeight.value = content?.height || 0;
//         maxScrollOffset.value = Math.max(contentHeight.value - containerHeight.value, 0);
//         scrollSpeed.value = maxScrollOffset.value > 0
//             ? Math.round(maxScrollOffset.value / 5) // 平均每 30px 1 秒，可调节
//             : 0
//         console.log('containerHeight:', containerHeight.value);
//         console.log('contentHeight:', contentHeight.value);
//         console.log('maxScrollOffset:', maxScrollOffset.value);
//     });

// };

const calculateHeights = async () => {
  await nextTick();
  const query = uni.createSelectorQuery().in(this); // `in(this)` 重要！作用域是当前组件

  query.selectAll(".user-list").boundingClientRect(); // 容器高度
  query.selectAll(".user-list-scroll").boundingClientRect(); // 内容高度

  query.exec((res) => {
    const container = res[0];
    const content = res[1];

    // 座位容器在高度
    container.forEach((item, index) => {
      const id = item.dataset.id;

      list.value = list.value.map((i) => {
        if (i.id === id) {
          i.containerHeight = item?.height || 0;
        }
        return i;
      });
    });

    content.forEach((item, index) => {
      const id = item.dataset.id;
      list.value = list.value.map((i) => {
        if (i.id === id) {
          i.contentHeight = item?.height || 0;
        }
        return i;
      });
    });

    list.value.forEach((item) => {
      item.maxScrollOffset = Math.max(item.contentHeight - item.containerHeight, 0);
      item.scrollSpeed =
        item.maxScrollOffset > 0
          ? Math.round(item.maxScrollOffset / 10) // 平均每 30px 1 秒，可调节
          : 0;
    });
  });
};

const calculateHeights2 = async () => {
  await nextTick();
  const query = uni.createSelectorQuery().in(this); // `in(this)` 重要！作用域是当前组件

  query.selectAll(".gift-item").boundingClientRect(); // 容器高度
  query.selectAll(".scroll-content").boundingClientRect(); // 内容高度

  query.exec((res) => {
    const container = res[0];
    const content = res[1];
    console.log(res[0], res[1]);

    // 座位容器在高度
    container.forEach((item, index) => {
      const id = item.dataset.id;

      giftList.value = giftList.value.map((i) => {
        if (i.id === id) {
          i.containerHeight = item?.height || 0;
        }
        return i;
      });
    });

    content.forEach((item, index) => {
      const id = item.dataset.id;
      giftList.value = giftList.value.map((i) => {
        if (i.id === id) {
          i.contentHeight = item?.height || 0;
        }
        return i;
      });
    });

    giftList.value.forEach((item) => {
      item.maxScrollOffset = Math.max(item.contentHeight - item.containerHeight, 0);
      item.scrollSpeed =
        item.maxScrollOffset > 0
          ? Math.round(item.maxScrollOffset / 5) // 平均每 30px 1 秒，可调节
          : 0;
    });
  });
};

const getColorClass = (area) => {
  switch (area) {
    case "equal":
      return "text-color-1";
    case "double":
      return "text-color-2";
    case "super":
      return "text-color-3";
    default:
      return ""; // 或者其他默认样式
  }
};

const isSwap = (user_id, item) => {
  const eR = item?.equal?.find((i) => i.swap);
  const dR = item?.double?.find((i) => i.swap);
  const sR = item?.super?.find((i) => i.swap);
  const swap = eR || dR || sR;
  return swap;
};
// 节流更新函数
let updateTimer = null;
watch(
  () => props.list1,
  (newVal) => {
    if (updateTimer) return;
    updateTimer = setTimeout(() => {
      smartUpdateList(list.value, newVal);
      updateTimer = null;
      calculateHeights();
    }, 1000); // 每 100ms 最多更新一次
  },
  { deep: true }
);
let updateCommonTimer = null;
watch(
  () => props.commonList,
  (newVal) => {
    if (updateCommonTimer) return;
    updateCommonTimer = setTimeout(() => {
      console.log(newVal);

      smartUpdateList(giftList.value, newVal);
      updateCommonTimer = null;

      calculateHeights2();
    }, 1000); // 每 100ms 最多更新一次
  },
  { deep: true }
);
// 生命周期
onMounted(() => {
  // list.value = [
  //     {
  //         num: 1, // 座位号
  //         id: 1, // 座位标识
  //         scrollSpeed: 0, // 滚动速度
  //         contentHeight: 0, // 内容高度
  //         containerHeight: 0, // 容器高度
  //         warning: false, // 是否开启警告
  //         userCount: 12, // 用户数量
  //     },
  //     {
  //         num: 2, // 座位号
  //         id: 2, // 座位标识
  //         scrollSpeed: 0, // 滚动速度
  //         contentHeight: 0, // 内容高度
  //         containerHeight: 0, // 容器高度
  //         warning: false, // 是否开启警告,
  //         userCount: 0, // 用户数量
  //     },
  //     {
  //         num: 3, // 座位号
  //         id: 3, // 座位标识
  //         contentHeight: 0, // 内容高度
  //         containerHeight: 0, // 容器高度
  //         warning: false, // 是否开启警告,
  //         userCount: 0, // 用户数量
  //           scrollSpeed: 0, // 滚动速度
  //   }
  // ]
  window.addEventListener("resize", calculateHeights);
  window.addEventListener("resize", calculateHeights2);
});
</script>

<style scoped lang="scss">
.custom-user-status {
  height: 100%;
  flex: 1;
  padding: 0 20px 0px 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .all-scroll {
    width: 100%;
    display: flex;
    gap: 15px;
    height: 100%;
  }

  .list-area {
    width: 100%;
    display: flex;
    height: calc(100% - var(--gift-area-height, 0px));
    flex-direction: column;

    .full-bet-box {
      width: 100%;
      height: 116px;
      background: #6d0705;
      color: #fff;
      font-family: Arial;
      font-size: 36px;
      font-style: normal;
      font-weight: 700;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      justify-content: center;
      // position: absolute;
      flex-shrink: 0;
    }

    .user-box {
      display: flex;
      flex-direction: column;
      max-width: 50%;
      height: 100%;
      flex-grow: 1;
      flex-shrink: 1;

      .user-title {
        width: 100%;
        background: #1a1a1d;
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-height: 58px;
        min-height: 58px;
        z-index: 10086;

        .user-seat {
          background: linear-gradient(180deg, #f3dcb3 0%, #dcb57e 100%);
          color: #2e1f22;
          text-align: center;
          font-family: "Microsoft YaHei UI";
          font-size: 52px;
          font-style: normal;
          line-height: 58px;
          font-weight: 700;
          text-transform: uppercase;
          width: 15%;
        }

        .user-count {
          color: #efd5a9;
          text-align: center;
          font-family: "Microsoft YaHei UI";
          font-size: 36px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 20px;
          padding-right: 16px;

          image {
            width: 40px;
            height: 40px;
          }
        }
      }

      .user-list {
        background: rgba(0, 0, 0, 0.25);
        width: 100%;
        flex: 1;
        // overflow-y: auto; // 重点：超出后滚动
        overflow-y: hidden; // 重点：超出后滚动

        -webkit-overflow-scrolling: touch; // iOS 平滑滚动（可选）
        position: relative;

        &::-webkit-scrollbar {
          width: 0; // 隐藏滚动条
          height: 0; // 隐藏滚动条
        }

        .user-item {
          width: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          height: 106px;
          border-bottom: 1px solid #c0c0c0;
          position: relative;

          .user-mes {
            display: flex;
            box-sizing: border-box;
            width: 100%;
            height: 44px;
            align-items: center;
            gap: 10px;
            flex-shrink: 0;
            justify-content: center;
            color: #fff;
            font-family: Arial;
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
            text-transform: uppercase;
            position: relative;

            .changeBanker {
              position: absolute;
              width: 32px;
              height: 32px;
              right: 10px;
            }

            .full-bet {
              color: red;
            }
          }

          .cash-box {
            display: flex;
            flex-direction: column;
            height: 88px;
          }

          .cash-equal {
            border-bottom: 1px solid #c0c0c0;
            background: linear-gradient(180deg, #093cd9 0%, #052073 100%);
          }

          .cash-double {
            border-bottom: 1px solid #c0c0c0;
            background: linear-gradient(180deg, #e54d00 0%, #872302 100%);
          }

          .cash-super {
            border-bottom: 1px solid #c0c0c0;
            background: linear-gradient(180deg, #e8af00 0%, #805602 100%);
          }

          .user-result {
            flex: 1;
            color: #fff;
            text-align: center;
            font-family: Arial;
            font-size: 32px;
            font-style: normal;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
          }

          .ignore-vh-user-mes {
            min-height: 44px;
          }

          .checked-icon {
            width: 32px;
            height: 32px;
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
          }
        }

        .ignore-vh-box {
          // height: 106px;
        }

        .user-list-scroll {
          animation: scrollBackAndForth linear infinite;

          .nn-game {
            height: auto;

            .color-header {
              background: #2c2823;
            }

            // 彩金
            .caijin {
              background: #d1a626;
            }

            .color-header-2 {
              background: #c84034;
            }

            .color-content {
              background: #010101;
            }

            .caijin-content {
              background: #92741b;
            }

            .color-content-2 {
              background: #c22b1d;
            }

            .color-cash-1 {
              background: linear-gradient(180deg, #093cd9 0%, #052073 100%), #0d2673;
            }

            .color-cash-2 {
              background: linear-gradient(180deg, #c61500 0%, #871002 100%), #c2372b;
            }

            .text-color-1 {
              color: #51cbff;
            }

            .text-color-2 {
              color: #f53;
            }

            .text-color-3 {
              color: #fd3;
            }

            .nn-content-item {
              width: 100%;
              line-height: 44px;
              position: relative;
            }

            .disable-box {
              opacity: 0.4 !important;
              background: transparent !important;
            }
          }

          .bjl-game {
            .color-header-1 {
              background: #19358d;
            }

            .color-header-2 {
              background: #c84034;
            }

            .color-content-1 {
              background: #001f80;
            }

            .color-content-2 {
              background: #c22b1d;
            }

            .color-cash-1 {
              background: linear-gradient(180deg, #093cd9 0%, #052073 100%), #0d2673;
            }

            .color-cash-2 {
              background: linear-gradient(180deg, #c61500 0%, #871002 100%), #c2372b;
            }
          }
        }

        .disable-user-box {
          color: #73716c !important;
          background: transparent !important;
        }

        .nn-pay {
          opacity: 0.4 !important;
        }
      }
    }
  }

  .full-bet-box2 {
    height: calc(90% - var(--gift-area-height, 0px));
  }

  .list-area.has-gift-area {
    --gift-area-height: 188px;
  }

  .user-gift-area {
    display: flex;
    gap: 16px;
    position: relative;

    .gift-item {
      position: relative;
      height: 188px;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden; // 隐藏超出部分
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;

      .item-header {
        height: 44px;
        width: 100%;
        background: #000;
        color: #cc2929;
        text-align: center;
        font-family: "PingFang SC";
        font-style: normal;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        z-index: 1;
        white-space: nowrap;
        font-size: clamp(12px, 18px, 18px);
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .scroll-content {
        flex: 1;
        background: #201903;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      }

      .gift-1 {
        color: #cc2929;
      }

      .gift-2 {
        color: #05f;
      }

      .gift-3 {
        color: #00d949;
      }

      .gift-4 {
        color: #faff00;
      }

      .gift-5 {
        color: #ff6a00;
      }

      .gift-6 {
        color: #f50;
      }

      .gift-7 {
        color: #fa0;
      }

      .item-content {
        flex: 1;
        background: #201903;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        position: relative;

        .content-header {
          width: 100%;
          background: #201802;
          color: #fff;
          font-family: Arial;
          font-size: 16px;
          font-style: normal;
          font-weight: 700;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .content-content {
          width: 100%;
          background: #161102;
          color: #fff;
          text-align: center;
          font-family: Arial;
          font-size: 20px;
          font-style: normal;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 24px;
        }

        .ignore-vh-24 {
          // height: 24px;
        }

        .checked-icon {
          width: 32px;
          height: 32px;
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }

    .gift-1 {
      color: #cc2929;
    }

    .gift-2 {
      color: #05f;
    }

    .gift-3 {
      color: #00d949;
    }

    .gift-4 {
      color: #faff00;
    }

    .gift-5 {
      color: #ff6a00;
    }

    .gift-6 {
      color: #f50;
    }

    .gift-7 {
      color: #fa0;
    }

    .scroll-content {
      animation: scrollBackAndForth linear infinite;
    }
  }

  @keyframes scrollAnimation {
    0%,
    10% {
      transform: translateY(0);
    }

    90%,
    100% {
      transform: translateY(calc(-100% + var(--container-height)));
    }
  }

  @keyframes scrollBackAndForth {
    0% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(calc(-1 * var(--max-scroll-offset, 0px)));
    }

    100% {
      transform: translateY(0);
    }
  }
}
</style>
