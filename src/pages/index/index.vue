<template>
  <LayoutCom>
    <view class="index-page-container">
      <view class="header-layout ignore-vh-header" id="header-layout">
        <text class="text-1 view-layout">{{ getTableInfo.label }}</text>
        <view class="view-1 view-layout"><text class="text-2">铺</text><text class="text-1">{{
          tableDetail?.number?.number }}</text></view>
        <view class="view-1 view-layout"><text class="text-2">靴</text><text class="text-1">{{
          tableDetail?.number?.boot_num }}</text></view>
        <view class="change-table-btn" @click="changeBindFn">
          <image src="@/static/images/index/change.svg"></image>
        </view>
      </view>
      <!-- 用户下注情况 -->
      <view class="scroll-area" id="scroll-area" :style="{ 'height': scrollHeight + 'px' }">
        <CustomUserStatus :list1="list" :commonList="commonArea"></CustomUserStatus>
      </view>
    </view>
  </LayoutCom>

</template>

<script setup>
import { onHide } from '@dcloudio/uni-app';
import { ref, onMounted, onUnmounted, computed } from 'vue';
//com
import CustomUserStatus from '@/components/CustomUserStatus/index.vue';

//api
import { getTableInfoApi } from "@/request/index"

//socket
import { socketIO } from '@/socket/index.js';

// COMMON
import COMMON_DATA from "@/utils/common";

import { groupBy } from "@/utils/tool"

//store
import { useGameeStore } from "@/store"
import { reactive } from 'vue';
const { getTableInfo } = useGameeStore();

// 桌台信息
const tableDetail = reactive({});

let nnGameList = ref(new Map());

const gameList = reactive(COMMON_DATA.GAME_LIST)

// 公共区域
let commonArea = ref(COMMON_DATA.COMMON_AREA_POSITION);

// 根据桌台信息带的游戏id获取当前桌子的信息
const socketBackType = computed(() => {
  const gameId = gameList.find(item => item.gameId === tableDetail?.table?.game_id)?.gameId || 1;
  return COMMON_DATA.GAME_SOCKET_TYPE[gameId] || null;
});

let list = ref([])

const scrollHeight = ref(0); // 滚动高度

const calcScrollHeight = () => {
  const windowHeight = uni.getSystemInfoSync().windowHeight;
  const query = uni.createSelectorQuery();
  query.select('#header-layout').boundingClientRect();
  query.select('#scroll-area').boundingClientRect();

  query.exec(res => {
    const headerHeight = res[0]?.height || 0;
    const paddingBottomValue = 30
    scrollHeight.value = windowHeight - headerHeight - paddingBottomValue;
  });
}

const changeBindFn = () => {
  uni.navigateTo({
    url: '/pages/login/index?type=2'
  });
}

const initData = async () => {
  // 加入房间

  if (socketIO.isConnected()) {

    socketIO.emit('join-room', { table_id: getTableInfo.table_id, source: 'stream' });

    socketIO.on('join-room-back', (data) => {

    });

  }
  // 获取桌台信息
  const res = await getTableInfoApi({ table_id: getTableInfo.table_id });
  if (res.code !== 200) return;
  Object.assign(tableDetail, res.data);

  // 注册socket的监听事件
  openSocketOnEvent();
}

// 通用的合并函数



const fenzuFn = (info, num) => {
  const { banker, player } = info;
  const bankerData = groupBy(banker, 'num');
  const playerData = groupBy(player, 'num');
  const resultMap = new Map();


  // 1. 初始化 resultMap（保留所有 num 的原始数据）
  list.value.forEach(item => {
    resultMap.set(+item.num, {
      ...item,
      id: item.num,
      scrollSpeed: item.scrollSpeed || 0,
      contentHeight: item.contentHeight || 0,
      containerHeight: item.containerHeight || 0,
      warning: item.warning || false
    });
  });

  // 2. 合并 banker 数据（仅更新推送的 num）
  function mergeDataToResultMap(data) {

    Object.entries(data).forEach(([key, value]) => {
      const numKey = +num;
      const existItem = resultMap.get(numKey);

      if (!existItem) {
        // 如果 num 不存在（理论上不会发生，因为 num 是固定的）
        resultMap.set(numKey, {
          num: numKey,
          id: numKey,
          numList: value,
          scrollSpeed: 0,
          contentHeight: 0,
          containerHeight: 0,
          warning: false
        });
      } else {
        // 合并 numList（更新或追加 user）
        const mergedList = [...existItem.numList];
        value.forEach(newUser => {

          const idx = mergedList.findIndex(u => u.user_id === newUser.user_id && u.area === newUser.area);
          if (idx !== -1) mergedList[idx] = newUser; // 更新
          else mergedList.push(newUser); // 追加
        });

        const uniqueUserIds = new Set(mergedList.map(u => u.user_id));
        const userCount = uniqueUserIds.size;

        resultMap.set(numKey, {
          ...existItem,
          numList: mergedList,
          userCount
        });
      }
    });
  }

  // 3. 更新推送的 banker 和 player 数据
  mergeDataToResultMap(bankerData);
  mergeDataToResultMap(playerData);


  if (Object.keys(bankerData).length === 0 && Object.keys(playerData).length === 0) {

    resultMap.delete(+num);

  }
  // 4. 直接更新 list.value（保留所有 num）
  list.value = Array.from(resultMap.values());

};

const constructCommonArea = (info) => {
  const keys = Object.keys(info)[0];

  commonArea.value = commonArea.value
    .filter(item => {
      // 如果 key 匹配并且 info[keys] 是空数组，就过滤掉（不保留）
      if (item.key === keys && Array.isArray(info[keys]) && info[keys].length === 0) {
        return false;
      }
      return true;
    })
    .map(item => {
      const newItem = { ...item };
      if (item.key === keys) {
        newItem.numList = info[keys];
      }
      return newItem;
    });


  commonArea.value = commonArea.value.filter(item => item.numList && item.numList.length > 0)

}


// 注册socket的监听事件
const openSocketOnEvent = () => {
  // 监听用户下注
  if (!socketBackType.value) return;

  socketIO.on(socketBackType.value, (data) => {

    const { info, num, table_id } = data;

    if (getTableInfo.game_id === 1) {
      // 庄闲按座位分组
      // 非公共区域
      if (+num > 0) {
        fenzuFn(info, num);
      } else {
        // 公共区域
        constructCommonArea(info);
      }
    } else if (getTableInfo.game_id === 3) {
      // 牛牛
      constructGameNN(data);
    }

  });
}


const constructGameNN = (data) => {
  const { info = [], num, table_id, area, swap, full_bet_type } = data;
  const numKey = +num;
  const numData = nnGameList.value.get(numKey) || {};

  // 添加 fullBetType 到每条 info 数据
  const infoWithType = info.map(item => ({
    ...item,
    fullBetType: full_bet_type
  }));

  // 如果 info 有的数据原来没有了需要更新
  const hasZero = info.some(item => item.user_id === 0);
  if (!hasZero) {
    infoWithType.filter(item => item.user_id !== 0)
  }
  console.log(infoWithType, info, numData);
  if(numData?.numList?.length > 0 && infoWithType.length > 0) {
    numData.numList = numData.numList.filter(item => {
      const has = infoWithType.some(i => i.user_id === 0 && i.area === item.area) && numData.numList.some(i => i.user_id === 0 && i.area === item.area);
      return !has
    })
  }


  // ✅ 更新当前区域的下注信息
  numData[area] = [...infoWithType];
  // numData.numList = numData?.numList?.filter(item => {
  //   const has = infoWithType.some(i => i.user_id === 0 && i.area === item.area);
  //   return has
  // })

  // ✅ 构建/更新用户下注数据
  const userBetList = numData.numList || [];

  infoWithType.forEach(item => {
    let user = userBetList.find(u => u.user_id === item.user_id);

    if (user) {
      const areaIndex = user.areaList.findIndex(a => a.area === area);

      if (areaIndex > -1) {
        // 更新该区域下注
        user.areaList.splice(areaIndex, 1, item);
      } else {
        // 新增该区域下注
        user.areaList.push(item);
      }
    } else {
      // 新增用户
      userBetList.push({
        user_id: item.user_id,
        ...item,
        areaList: [item]
      });
    }
  });

  // ✅ 如果 info 是空数组，说明该区域被清空了，移除所有用户的对应区域下注
  if (info.length === 0) {
    userBetList.forEach(user => {
      if (user.areaList) {
        user.areaList = user.areaList.filter(a => a.area !== area);
      }
    });
  }

  // ✅ 更新公共数据
  Object.assign(numData, {
    swap,
    full_bet_type,
    table_id,
    num: numKey,
    numList: userBetList,
    userCount: userBetList.length
  });

  // ✅ 设置更新回 map
  nnGameList.value.set(numKey, numData);

  // ✅ 生成游戏列表并处理满注可见性
  const gameArray = Array.from(nnGameList.value.values());
  const fullBetData = handleFullBetData(gameArray, area, num);

  // ✅ 过滤空数据
  list.value = fullBetData.filter(item => item.num !== 0 && item.userCount !== 0);
};

const handleFullBetData = (gameArray, area, num) => {
  return gameArray.map(game => {
    if (game.num === +num) {
      game.numList = game.numList.map(user => ({
        ...user,
        areaList: user.areaList.map(a => ({
          ...a,
          hiddenByFullBet: a.fullBetType !== 0
        }))
      }));
    }
    return game;
  });
};


const fullBetTypeFn = (numData) => {
  console.log(numData);

  let arr1 = JSON.parse(JSON.stringify(numData));
  const arr = arr1?.equal?.concat(arr1?.double).concat(arr1?.super);
  const hasFull = arr?.some(item => item?.fullBetType === 3); // 全场
  if (hasFull) return 3; // 全场

  const singleFull = arr?.some(item => item?.fullBetType === 1); // 单
  if (singleFull) return 1; // 单

  const doubleFull = arr?.every(item => item?.fullBetType === 0); // 无
  if (doubleFull) return 0; // 无

  return 0
}


onMounted(() => {
  calcScrollHeight();

  // 初始化
  initData()

  // 监听窗口变化
  uni.onWindowResize(() => {
    calcScrollHeight();
  });
})

onHide(() => {
  uni.offWindowResize(calcScrollHeight);
  socketBackType.value && socketIO.off(socketBackType.value);
})


</script>

<style lang="scss" scoped>
.index-page-container {
  width: 100%;
  height: 100%;
  background-image: url('@/static/images/index/logo.svg'), url('@/static/images/index/bg.svg');
  background-repeat: no-repeat, no-repeat;
  background-position: center center, center center;
  background-size: 25%, cover;
  display: flex;
  flex-direction: column;

  .header-layout {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 54px;
    width: 100vw;
    background:
      linear-gradient(180deg, rgba(22, 16, 9, 1) 0%, rgba(22, 16, 9, 1) 20%, #ecdecf 50%, rgba(22, 16, 9, 1) 80%, rgba(22, 16, 9, 1) 100%),
      radial-gradient(circle at 50% 50%, #8d7d4a 0%, #000000 100%);
    background-blend-mode: multiply;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 8px;
      /* 核心实现 */
      background: radial-gradient(circle at 50% 50%,
          #8e8a84 50%, #000000 70%);
      /* 边缘透明 */
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      padding: 1px;
      /* 边框厚度 */
    }

    .view-layout {
      min-width: 280px;
    }

    .view-1 {
      display: grid;
      gap: 20px;
      grid-auto-flow: column;
      /* 横向流动 */
      grid-auto-columns: max-content;
      /* 子项根据自身内容决定宽度 */
      justify-content: center;
      /* 水平居中 */
      align-items: center;
      /* 垂直居中 */
    }

    .text-1 {
      color: #D9C4B0;
      text-align: center;
      font-family: "PingFang SC";
      font-size: 24px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      text-transform: uppercase;
    }

    .text-2 {
      color: #D9C4B0;
      font-family: "PingFang SC";
      font-size: 24px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      text-transform: uppercase;
    }

    .change-table-btn {
      color: #D9C4B0;
      text-align: center;
      font-family: "PingFang SC";
      font-size: 24px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      text-transform: uppercase;
      margin-left: 20px;
      padding: 6px;
      position: absolute;
      right: 4rpx;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      display: flex;
      justify-content: center;
      align-items: center;

      >image {
        width: 32px;
        height: 32px;
      }
    }
  }

  .ignore-vh-header {
    flex-shrink: 0;
  }

  .scroll-area {
    // height: calc(100% - 54px);
  }
}
</style>
