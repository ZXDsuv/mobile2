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
        <CustomUserStatus :list1="list" :commonList="giftAll" :fullType="fullType" :fullList="fullList">
        </CustomUserStatus>
      </view>
    </view>
  </LayoutCom>

</template>

<script setup>
import { onHide, onShow } from '@dcloudio/uni-app';
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
//com
import CustomUserStatus from '@/components/CustomUserStatus/index.vue';

//api
import { getTableInfoApi } from "@/request/index"

//socket
import { socketIO } from '@/socket/index.js';

// COMMON
import COMMON_DATA from "@/utils/common";

import { groupBy, arraysEqualIgnoreOrder } from "@/utils/tool"

//store
import { useGameeStore } from "@/store"
import { reactive } from 'vue';
const { getTableInfo } = useGameeStore();

// 桌台信息
const tableDetail = reactive({});
const tableLimit = ref([]); // 限红

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
const remot = () => {
  socketIO.emit('read-wait-baccarat-stop', { table_id: getTableInfo.table_id, source: 'stream' });

  closeSocketByKey(socketBackType.value, gameIdOneEvent)

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
  tableLimit.value = tableDetail.table.limit; // 限红
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
  function mergeDataToResultMap(data, area2) {



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

          const idx = mergedList.findIndex(u => u.user_id == newUser.user_id && u.area == newUser.area && u.username == newUser.username && u.full_bet == newUser.full_bet && u.num == newUser.num && u.is_cash == newUser.is_cash);
          if (idx !== -1) mergedList[idx] = newUser; // 更新
          else mergedList.push({ ...newUser, id: generateId() }); // 追加



          // 判断 mergedList 的数据在新数据中是否存在，如果不存在则删除
          mergedList.forEach((item, index) => {
            const exist = value.some(u => u.user_id === item.user_id && u.username === item.username && u.num === item.num && u.full_bet === item.full_bet && u.is_cash === item.is_cash && u.area === item.area);
            if (!exist) mergedList.splice(index, 1);
          })
        });


        const uniqueUserIds = mergedList
          .filter(u => u.user_id > -1)
          .map(u => u.user_id)


        const userCount = uniqueUserIds.length;


        resultMap.set(numKey, {
          ...existItem,
          numList: mergedList,
          userCount
        });
      }
    });

  }


  // 3. 更新推送的 banker 和 player 数据
  mergeDataToResultMap(bankerData, 'banker');
  mergeDataToResultMap(playerData, 'player');




  if (Object.keys(bankerData).length === 0) {
    // 3.1 如果 banker 数据为空，更新 numList（保留所有 num）
    resultMap.set(+num, {
      ...resultMap.get(+num),
      numList: resultMap.get(+num)?.numList?.filter(item => item.area !== 'banker') || []
    })
  }

  if (Object.keys(playerData).length === 0) {
    // 3.1 如果 banker 数据为空，更新 numList（保留所有 num）
    resultMap.set(+num, {
      ...resultMap.get(+num),
      numList: resultMap.get(+num)?.numList?.filter(item => item.area !== 'player') || []
    })
  }

  // 检查resultMap的各个座位，如果座位的numList为空，则删除该整个座位
  for (const [key, value] of resultMap.entries()) {
    if (value.numList.length === 0) {
      resultMap.delete(key);
    }
  }


  // 4. 直接更新 list.value（保留所有 num）
  list.value = Array.from(resultMap.values());


  // 计算限红
  caculateLimitRed();
};


const caculateLimitRed = () => {
  //  1.百家乐限红：（如果区域有现金卡，不计算最低限红）
  // 1）庄闲两个位置：
  // 最高：庄位置和闲位置中所有用户下注的单个币种的筹码总和相减的绝对值
  // 最低：庄位置和闲位置中单个用户下注的单个币种的筹码总和不能低于的值
  // 2）其他奖项
  // 最高：区域内所有用户下注的单个币种的筹码总和不能超过的值
  // 最低：区域内个人下注的单个币种的筹码总和不能低于的值


  //先算庄闲的限红
  list.value = list.value.map(item => {
    const limit = sumAmountsByAreaAndCurrency(item.numList)
    const hightLimitArr = caculateHighLimit(limit)
    // 高限红目前是算整个区域的
    // 低限红目前是算每个位置的
    const isHight = hightLimitArr.some(item => item.isHight)
    // 位置有没有cash, 有现金码就不计算最低限红
    const hasCash = item.numList.some(cash => cash.is_cash == 1)
    return {
      ...item,
      limit,
      hightLimitArr,
      isHight,
      numList: item.numList.map(item => {
        const lowLimit = tableLimit.value.find(
          citem => citem.currency_id == item.currency_id
        )?.limit_contents?.limit_low || 0;
        return {
          ...item,
          isLow: hasCash ? false : +item.amount < +lowLimit
        }
      })
    }
  })








}



// 公共区域的限红
function caculateHighLimit2(limit = {}, area = '') {
  if (Object.keys(limit).length === 0) return [];

  // 对应区域的每个币种的下注金额
  const giftObj = limit[area]

  const allCurrencyIds = new Set([
    ...Object.keys(giftObj),
  ]);

  return Array.from(allCurrencyIds).map((key) => {
    const areaAmount = giftObj[key]?.amount || 0;

    const highLimit = tableLimit.value.find(
      item => +item.currency_id == +key
    )?.limit_contents[`limit_high_${area}`] || 0;

    const isHight = areaAmount > highLimit;

    return {
      currency_id: key,
      isHight
    };
  });
}

function caculateHighLimit(limit) {
  const { banker = {}, player = {} } = limit;
  const allCurrencyIds = new Set([
    ...Object.keys(banker),
    ...Object.keys(player)
  ]);

  return Array.from(allCurrencyIds).map((key) => {
    const bankerAmount = banker[key]?.amount || 0;
    const playerAmount = player[key]?.amount || 0;

    const highLimit = tableLimit.value.find(
      item => +item.currency_id == +key
    )?.limit_contents?.limit_high || 0;

    const isHight = Math.abs(playerAmount - bankerAmount) > highLimit;

    return {
      currency_id: key,
      isHight
    };
  });
}

function sumAmountsByAreaAndCurrency2(arr, are) {
  let arr1 = arr?.reduce((acc, item) => {
    const { area, currency_id, amount, user_id } = item;

    if (!acc[area]) {
      acc[area] = {};
    }

    if (!acc[area][currency_id]) {
      acc[area][currency_id] = {
        amount: 0
      };
    }

    user_id > 0 && (acc[area][currency_id]['amount'] += Number(amount) || 0);
    return acc;
  }, {});


  if (arr1?.[are] && typeof arr1[are] === 'object') {
    Object.keys(arr1[are]).forEach(key => {
      const amount = arr1[are][key].amount;
      const limit = tableLimit.value.find(item => item.currency_id == key)?.limit_contents?.[`limit_high_${are}`] || 0;
      arr1[are][key].isHight = +amount > +limit;
    });
  }
  return arr1;
}

function sumAmountsByAreaAndCurrencyByNN(arr) {
  let arr1 = arr.reduce((acc, item) => {
    const { area, currency_id, amount, user_id } = item;

    if (!acc[area]) {
      acc[area] = {};
    }

    if (!acc[area][currency_id]) {
      acc[area][currency_id] = {
        amount: 0
      };
    }

    if (user_id > 0) {
      acc[area][currency_id]['amount'] += Number(amount) || 0;

    }
    return acc;
  }, {});

  return arr1;
}

function sumAmountsByAreaAndCurrency(arr) {
  let arr1 = arr.reduce((acc, item) => {
    const { area, currency_id, amount, user_id } = item;

    if (!acc[area]) {
      acc[area] = {};
    }

    if (!acc[area][currency_id]) {
      acc[area][currency_id] = {
        amount: 0
      };
    }

    if (user_id > 0) {
      acc[area][currency_id]['amount'] += Number(amount) || 0;

    }
    return acc;
  }, {});


  // 计算每个

  return arr1;
}
const giftAll = ref([])
const constructCommonArea = (info) => {
  // 这个是奖项的key
  const keys = Object.keys(info)[0];

  commonArea.value = commonArea.value
    .filter(item => {
      // 如果 key 匹配并且 info[keys] 是空数组，就过滤掉（不保留）
      // if (item.key === keys && Array.isArray(info[keys]) && info[keys].length === 0) {
      //   return false;
      // }
      return true;
    })
    .map(item => {
      const newItem = { ...item };
      if (item.key === keys) {

        // 给numList里的每一个对象加上一个唯一的id
        newItem.numList = info[keys].map((user, i) => ({ ...user, id: generateId() }));
      }
      return newItem;
    });

  // 公共区域的限红commonArea
  commonArea.value = commonArea.value.map(item => {

    const limit = sumAmountsByAreaAndCurrency2(item.numList, item.key)
    // 区域每个币种的高限红情况
    const hightLimitArr = caculateHighLimit2(limit, item.key)

    const isHight = hightLimitArr.some(item => item.isHight)

    // 位置有没有cash
    const hasCash = item?.numList?.some(cash => cash.is_cash == 1)
    return {
      ...item,
      limit,
      isHight,
      numList: item?.numList?.map(nitem => {
        const lowLimit = tableLimit.value.find(
          citem => citem.currency_id == nitem.currency_id
        )?.limit_contents[`limit_low_${nitem.area}`] || 0;
        return {
          ...nitem,
          lowLimit,
          isLow: hasCash ? false : +nitem.amount < +lowLimit
        }
      })
    }

  })

  giftAll.value = commonArea.value.filter(item => item.numList && item.numList.length > 0)

}

function generateId() {
  return crypto.randomUUID(); // 现代浏览器支持
}


// 百家乐下注事件
const gameIdOneEvent = (data) => {

  const { info, num, table_id } = data;

  if (getTableInfo.game_id === 1) {
    // 庄闲按座位分组
    // 非公共区域
    if (+num > 0) {
      fenzuFn(info, num);
    } else {
      // 公共区域
      constructCommonArea(info, num);
    }
  } else if (getTableInfo.game_id === 3) {
    // 牛牛
    constructGameNN(data);
  }

}

// 注册socket的监听事件
const openSocketOnEvent = () => {
  // 监听用户下注
  if (!socketBackType.value) return;

  // 下注状态
  socketIO.on(socketBackType.value, gameIdOneEvent);
  openNext()


}

const reConsctruct = (bet) => {
  if (getTableInfo.game_id === 1) {
    // 百家乐
    list.value = list.value.map(item => {
      return {
        ...item,
        numList: item.numList.map(user => {
          const betInfo = bet.find(b => b.user_id === user.user_id && b.username === user.username && b.area === user.area && b.num === user.num && b.is_cash === user.is_cash && b.full_bet === user.full_bet);

          return {
            ...user,
            ...{ ...betInfo }, // 如果没有找到对应的下注信息，设置为0
          };
        }),
      }
    })

    commonArea.value = commonArea.value.map(item => {
      return {
        ...item,
        numList: item?.numList ? item?.numList?.map(user => {
          const betInfo = bet.find(b => b.user_id === user.user_id && b.username === user.username && b.area === user.area && b.num == user.num && b.is_cash == user.is_cash && b.full_bet == user.full_bet);
          return {
            ...user,
            ...{ ...betInfo }, // 如果没有找到对应的下注信息，设置为0 
          }
        }) : []
      }
    })

    console.log("重组百家乐", list.value, commonArea.value);


  } else {
    // 牛牛
    list.value = list.value.map(item => {
      const betInfo = bet.find(be => be.num == item.num)

      // 存在相关座位下注信息
      if (betInfo) {
        return {
          ...item,
          numList: item.numList.map(user => {
            return {
              ...user,
              areaList: user.areaList.map(a => {
                const betAreaInfo = bet.find(areaInfo => areaInfo.area == a.area && areaInfo.user_id == a.user_id && areaInfo.num == a.num && areaInfo.is_cash == a.is_cash);

                return {
                  ...a,
                  ...(betAreaInfo ? { ...betAreaInfo } : {}), // 如果没有找到对应的下注信息，设置为0
                };
              })
            }
          })
        }
      }
      return {
        ...item
      }
    })
    console.log("重组牛牛", list.value);
    nnGameList.value.forEach((value, key) => {
      // 在这里更新 value
      const updatedValue = list.value.find(item => item.num == key);
      if (updatedValue) {
        nnGameList.value.set(key, updatedValue);
      }
    });

  }
}

const openResult = async () => {
  // 由下注状态进入赔付状态
  socketIO.on('open-result', async (data) => {
    closeSocketByKey(socketBackType.value);
    socketIO.emit('read-wait-baccarat-stop', { table_id: getTableInfo.table_id, source: 'stream' });
    console.log('进入赔付状态==》open-result', data);
    const { table_id } = data;
    // 根据table_id 获取桌台信息
    const res = await getTableInfoApi({ table_id });

    if (res.code !== 200) return;
    const { bet } = res.data;
    // 重组事件
    reConsctruct(bet)
    // 赔付结果
    openDoBet();
    openBack();
    // 下一局
    openNext()
  });
}

const openNext = () => {
  // 牛牛
  if (getTableInfo.game_id === 3) {
    // 由下注状态进入赔付状态
    openResult()
  }

  // 由下注状态进入赔付状态
  socketIO.on('start-bet', (data) => {
    console.log('开始下注停止下注==》start-bet', data);
    const { status } = data;
    if (status == 2) {
      // 注册socket的监听事件
      closeSocketByKey(socketBackType.value, gameIdOneEvent);
      openResult()

    } else {
      openSocketOnEvent();

    }
  });
}
const openDoBet = () => {
  // 在赔付状态中监听赔付结果
  socketIO.on('do-bet-success-back', (data) => {
    console.log('赔付结果==》do-bet-success-back', data, list.value);
    const { bet_ids, table_id } = data;
    if (getTableInfo.game_id === 1) {
      // 百家乐
      list.value = list.value.map(item => {
        return {
          ...item,
          numList: item.numList.map(user => {
            const includesBetId = bet_ids.includes(user.bet_id);
            return {
              ...user,
              is_checkout: includesBetId ? 1 : user.is_checkout, // 如果 bet_ids 包含 user.bet_id，则设置 is_win 为 1，否则为 0
            };
          })
        }
      })

      commonArea.value = commonArea.value.map(item => {
        return {
          ...item,
          numList: item?.numList?.map(user => {
            const includesBetId = bet_ids.includes(user.bet_id);
            return {
              ...user,
              is_checkout: includesBetId ? 1 : user.is_checkout, // 如果 bet_ids 包含 user.bet_id，则设置 is_win 为 1，否则为 0
            };
          })
        }
      })


      giftAll.value = commonArea.value.filter(item => item.numList && item.numList.length > 0)

      console.log("百家乐赔付", list.value, commonArea.value, bet_ids);

    }

    if (getTableInfo.game_id === 3) {
      list.value = list.value.map(item => {
        return {
          ...item,
          numList: item.numList.map(user => {
            return {
              ...user,
              areaList: user.areaList.map(a => {
                const includesBetId = bet_ids.includes(a.bet_id);
                return {
                  ...a,
                  is_checkout: includesBetId ? 1 : a.is_checkout, // 如果 bet_ids 包含 user.bet_id，则设置 is_win 为 1，否则为 0 
                }
              })
            }
          })
        }
      })
      console.log("牛牛赔付", list.value, bet_ids);


    }
  })
}

const openBack = () => {
  // 由赔付状态返回下注状态
  socketIO.on('chip-in-back', (data) => {
    console.log('由赔付状态返回下注状态==》chip-in-back', data);
    openSocketOnEvent();
    openResult()
  });


}

let fullType = ref(0);
let fullList = ref([]);



const constructGameNN = (data) => {
  const { info = [], num, table_id, area, swap, full_bet_type } = data;
  // 如果area == common的清空，判断full_bet_type是不是等于3，如果等于3，则把所有数据的fullBetType设置为3

  // 座位号 
  const numKey = +num;
  // 已经存储的座位号相关的信息
  const numData = nnGameList.value.get(numKey) || {};

  // info: 当前座位号当前区域的所有用户的下注信息
  const infoWithType = info.map(item => ({
    ...item,
    fullBetType: full_bet_type
  }));

  // ✅ 更新当前区域的下注信息
  // 当前座位号指定区域的下注信息
  numData[area] = [...infoWithType];
  const isSameBet = (a, b) =>
    a.area === b.area &&
    a.num === b.num &&
    a.user_id === b.user_id &&
    a.is_cash === b.is_cash &&
    a.full_bet === b.full_bet;
  // ✅ 构建/更新用户下注数据
  // userBetList: 当前座位的所有用户在所有区域的下注信息
  const userBetList = numData.numList || [];
  infoWithType.forEach(item => {

    const { tags } = item;
    // 判断是否是现金下注
    const isCash = item.is_cash === 1;

    // user_id == 0：有可能是现金码，有可能是满注卡
    // is_cash == 1 && full_bet == 0：现金码
    // is_cash == 0 && full_bet == 1：满注卡
    const isAnonymous = item.user_id === 0;

    // 满注卡 
    const isFullBet = item.full_bet === 1;
    let user;

    // 同一个区域可以下多个现金卡 ， 所以不判断区域
    if (isAnonymous && isCash) {
      // 匹配 user_id 为 0 且 is_cash == 1 的匿名现金下注, 且筹码uid相同，因为所有的现金码的user_id和is_cash都一样
      user = userBetList?.find(u => u?.user_id == 0 && u?.is_cash == 1 && arraysEqualIgnoreOrder(u.tags, tags));
    } else if (!isCash && isFullBet) {
      // 匹配 user_id 为 0 且 is_cash == 0 的满注卡
      user = userBetList.find(u => u.user_id == 0 && u.is_cash == 0 && u.full_bet && arraysEqualIgnoreOrder(u.tags, tags));
    } else {
      // 普通用户， 判断用户id和tag数组即可，多加条件，区域和座位号
      // 普通用户不能从userBetList里找, 因为numList里的每一条，除去上面的几种情况，一条就是用户的所有下注情况，具体是在里面的areaList里
      // 所有只需要判断用户id存不存在之后，再从里面的areaLisst里去比较
      // 普通用户：user_id > 0 && is_cash == 0 && full_bet == 0 && area == item.area && num == item.num
      // 普通用户（非匿名）：直接找 u 和目标 item 对应的 area 是否存在
      // 如果area是jackpot就要分区域
      user = userBetList.find(u => u?.user_id === item?.user_id && (item.area == 'jackpot' ? u.area === item.area : u.area !== 'jackpot'));



    }

    // 定义是否是完全相同的一条下注（目标是用于 areaList 的去重或更新）


    // 这里是如果旧数据中已经存在了该下注信息，就更新，否则就新增
    if (user) {
      const existingIndex = user?.areaList?.findIndex(a => isSameBet(a, item));
      if (existingIndex > -1) {
        // 更新原下注
        user.areaList.splice(existingIndex, 1, { ...user.areaList[existingIndex], ...item });
      } else {
        // 新增下注记录
        user.areaList.push(item);
      }


      const index2 = userBetList.findIndex(u =>
        u?.user_id === item?.user_id &&
        (item.area === 'jackpot' ? u.area === 'jackpot' : true)
      );

      if (index2 > -1) {
        userBetList.splice(index2, 1, user);
      } else if (item.area === 'jackpot') {
        // 同一个 user_id 已存在非 jackpot，新增一条 jackpot 数据
        userBetList.push({
          ...item,
          area: 'jackpot',
          areaList: [item]
        });
      }


    } else {
      // 不存在该用户，新增
      const newUser = {
        user_id: item.user_id,
        is_cash: item.is_cash,
        full_bet: item.full_bet,
        tags: item.tags,
        num: item.num, // 记录当前这个座位号
        ...item,
        area: item.area,
        areaList: [item]
      };
      userBetList.push(newUser);

    }



  });
  userBetList.forEach((user, userIndex) => {
    // 新下注中当前用户在该区域的所有下注
    const newAreaItems = infoWithType.filter(i => i.user_id === user.user_id && i.area === area);

    // 当前用户下注中该区域的所有老数据索引
    user.areaList = user.areaList.filter(oldItem => {
      // 如果是当前区域才判断是否删除
      if (oldItem.area === area) {
        // 如果旧下注在新数据中不存在，就删掉
        return newAreaItems.some(newItem => isSameBet(oldItem, newItem));
      }
      // 非当前区域的保留
      return true;
    });

    // 如果 areaList 被清空，可以删掉整个 user
    if (user.areaList.length === 0) {
      userBetList.splice(userIndex, 1);
    }
  });

  // ✅ 如果 info 是空数组，说明该座位该区域被清空了，移除所有用户的对应区域下注
  if (info.length === 0) {
    userBetList.forEach(user => {
      if (user?.areaList) {
        user.areaList = user?.areaList?.filter(a => a.area !== area);
      }
    });
  }


  // 将userBetList里的旧数据，在info中不存在的删掉
  //userBetList: 当前座位的所有用户在所有区域的下注信息
  // info是当前区域当前座位的用户下注信息，是最新的
  // 其实上面已经处理过了，这里又处理了一遍
  const userBetListFilter = userBetList.filter(user => {
    // const isEqualNum = user.num === num;
    // const isEqualArea = user.area === area;
    // if (isEqualNum && isEqualArea) {
    //   return user.areaList.some(a => {
    //     return info.some(i => i.user_id == a.user_id && i.area === a.area && i.num === a.num && i.is_cash == a.is_cash && i.full_bet == a.full_bet && arraysEqualIgnoreOrder(a.tags, i.tags));
    //   })
    // }
    return true;
  })

  const tList = userBetListFilter.filter(item => {
    // if (item.user_id === 0) {
    //   const isNo = numData[item.area]?.some(i => i.user_id === 0 && i.is_cash === 1 && i.area === item.area)
    //   if (isNo) {
    //     return true
    //   }
    //   return false
    // }
    return true
  })

  // ✅ 更新公共数据
  Object.assign(numData, {
    swap,
    full_bet_type,
    table_id,
    num: numKey,
    numList: tList,
    userCount: tList.length
  });



  // ✅ 设置更新回 map
  nnGameList.value.set(numKey, numData);
  // 如果value的jackpot属性是空数组或者没有，需要将value里的numList数组中的area为jackpot的对象删掉

  // 如果value的jackpot属性的数组长度大于0，那么需要根据jackpot属性的对象数组中的对象的user_id,在value的numList寻找有没有user_id相等且area为jackpot的对象
  // .如果有，那么将value的numList中的对象的area为jackpot的对象的全部属性的值替换成value的jackpot属性的对象的全部属性的值;
  // 如果没有area == jackpot但是有user_id跟value中的jackpot中的对象的user_id有相同的，则需要在numList中新增一个对象，对象的属性值为原numList数组中对象的user_id与jackpot中对象的user_id相同
  // 的全部属性，并且area设置为jackpot，然后更新该areaList，将value中的jackpot属性的对象添加到numList中新增的对象中的areaList中;
  // 如果没有area == jackpot且没有user_id跟value中的jackpot中的对象的user_id有相同的，则需要在numList中新增一个对象，对象的属性值为原numList数组中对象的user_id与jackpot中对象的user_id相同的全部属性，并且area设置为jackpot，然后更新该areaList，将value中的jackpot属性的对象添加到numList中新增的对象中的areaList中;

  // nnGameList.value.forEach((value, key) => {
  //   if (!value.jackpot) return;
  //     if (value.jackpot.length === 0) {
  //       // 移除 numList 中 area 为 jackpot 的对象
  //       value.numList = value.numList.filter(item => item.area !== 'jackpot');

  //     } else {

  //       value.jackpot.forEach(item => {
  //         // 查找是否已有相同 user_idb并且是彩金区域的 的用户,
  //         const user = value?.numList?.find(u => u?.user_id === item?.user_id && u?.area === 'jackpot');
  //         // 有用户的下注数据
  //         if (user) {
  //           // 是否有彩金用户的彩金数据
  //           // const numListAreaIndex = value.numList.findIndex(a => a.area === 'jackpot' && a.user_id === item.user_id);
  //           // 在用户的下注信息里去找彩金相关的信息
  //           const numListAreaIndex = user?.areaList?.findIndex(a => a.area === 'jackpot' && a.area === item.area && a.user_id === item.user_id);

  //           if (numListAreaIndex > -1) {
  //             // 如果有，在用户的下注数据里找彩金用户的下注数据
  //             user?.areaList.splice(numListAreaIndex, 1, item);
  //           } else {
  //             user?.areaList.push({
  //               ...item,
  //             }); // 新增一个带 jackpot 属性的对象到 areaList 中
  //           }

  //         } else {
  //           // 没有找到用户，则直接新增
  //           value.numList.push({
  //             user_id: item.user_id,
  //             ...item,
  //             area: 'jackpot',
  //             areaList: [item]
  //           });
  //         }
  //       });

  //       console.log(value.numList);

  //       // 删除numList中每个对象中的areaList中的对象，numList中每个对象中的areaList中的对象的area与numList对象的area不一致，则删除该对象


  //       // 对numList数组进行排序，area == 'jackpot'的对象排在前面, 排序之后再根据user_id进行排序，大的在后


  //       // value.numList.sort((a, b) => {
  //       //   const isJackpotA = a.area === 'jackpot';
  //       //   const isJackpotB = b.area === 'jackpot';

  //       //   if (isJackpotA && !isJackpotB) return -1;  // jackpot 在前
  //       //   if (!isJackpotA && isJackpotB) return 1;   // 非 jackpot 在后

  //       //   // 同一类（都是 jackpot 或都不是），按 user_id 升序排
  //       //   return +a.user_id > +b.user_id;
  //       // });

  //     }

  //     // value.numList.forEach(item => {
  //     //   if (item.area === 'jackpot') {
  //     //     item.areaList = item.areaList.filter(a => a.area === 'jackpot');
  //     //   }else {
  //     //     item.areaList = item.areaList.filter(a => a.area !== 'jackpot');
  //     //   }
  //     // })


  //     nnGameList.value.set(key, value);

  //   // }
  // });




  // ✅ 生成游戏列表并处理满注可见性
  const gameArray = Array.from(nnGameList.value.values());

  let fullBetData = handleFullBetData(gameArray, area, num);

  // ✅ 计算满注类型
  fullType.value = fullBetData.some(i => i.full_bet_type == 3) ? 3 : 0
  if (fullType.value == 3 && area === 'common') {
    fullList.value = groupBy(info, 'num');

    // 重新构造数据，将座位彩金相关添加到
    // 遍历fullList.value，将fullList.value中的每个对象的numList数组中的对象的area为seat_cash的对象的全部属性的值替换成fullList.value中对象的全部属性的值;
    const res = Object.keys(fullList.value).map(key => {
      const fullData = fullList.value[key];
      const caijinData = fullBetData.find(i => i.num === +key)?.numList?.filter(i => i.area === 'jackpot') || [];
      const cashData = []
      // 牛牛如果每个座位中的numList中有user_id 为0并且is_cash为 1，则为现金卡，添加到对应座位的fullData中
      nnGameList.value.forEach((value, key2) => {
        if (key2 === +key) {
          const isCash = value.numList?.find(i => i.user_id === 0 && i.is_cash === 1);
          if (isCash) {
            cashData.push({
              ...isCash,
            });
          }
        }
      })

      return {
        num: +key,
        fullData,
        caijinData,
        cashData
      }
    })
    fullList.value = res

  } else {
    // ✅ 过滤空数据
    list.value = fullBetData.filter(item => item.userCount !== 0);

    // list.value是一个对象数组，是所有座位，numList数组就是每个座位每个玩家的下注数据，numList里的每个对象的areaList是那个座位玩家在不同区域的下注数据
    // 再删选一下，当areaList为空的时候，删除他的父层级，也就是用户没有下注数据的时候，删除numList里的用户数据
    // 如果numList为空数组了，那么也要从list里删掉
    list.value = list.value.map(item => {
      return {
        ...item,
        numList: item.numList.filter(user => user.areaList && user.areaList.length > 0)
      }
    })
    list.value = list.value.filter(item => item.numList && item.numList.length > 0)
    list.value = list.value.map(item => {
      // 为每个用户添加 totalBet 属性

      const uniqueMap = new Map();
      item.numList.forEach(bet => {
        const key = `${bet.user_id}_${bet.area}_${bet.num}_${bet.is_cash}_${bet.full_bet}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, bet);
        }
      });

      let numList = Array.from(uniqueMap.values());

      numList = numList.map(user => {
        user.areaList = user.area === 'jackpot'
          ? user.areaList.filter(i => i.area === 'jackpot')
          : user.areaList.filter(i => i.area !== 'jackpot');
        return user;
      });

      // ✅ 排序逻辑：jackpot 在前，其它按 user_id 升序
      numList.sort((a, b) => {
        if (a.area === 'jackpot' && b.area !== 'jackpot') return -1;
        if (a.area !== 'jackpot' && b.area === 'jackpot') return 1;
        return a.user_id - b.user_id;
      });

      return {
        ...item,
        numList
      };
    });
    console.log(list.value);

    // 计算牛牛限红
    // caculateHightLowRedForNN()
  }



};

// 牛牛限红
function caculateHightLowRedForNN() {
  //   2.牛牛限红：（如果区域有现金卡，不计算最低限红）
  // 最高：同个座位的同一区域内所有用户下注的单个币种的所有筹码总和不能超过的值
  // 最低：同个座位的同一区域内单个用户下注的单个币种的筹码总和不能低于的值
  const reConstructNnDataByLimitRed = list.value.map(item => {
    const { num } = item;
    // 构造用户下注每个币种对应的金额情况
    const limit = sumAmountsByAreaAndCurrencyByNN(item.numList)
    // 计算用户下注的每个币种的高限红情况
    const hightLimitArr = caculateHighLimitByNn(limit, item.area)

  })

}

function caculateHighLimitByNn(limit) {
  if (Object.keys(limit).length === 0) return [];

  // 对应区域的每个币种的下注金额
  const giftObj = limit[area]

  const allCurrencyIds = new Set([
    ...Object.keys(giftObj),
  ]);

  return Array.from(allCurrencyIds).map((key) => {
    const areaAmount = giftObj[key]?.amount || 0;

    const highLimit = tableLimit.value.find(
      item => +item.currency_id == +key
    )?.limit_contents[`limit_high_${area}`] || 0;

    const isHight = areaAmount > highLimit;

    return {
      currency_id: key,
      isHight
    };
  });
}

const handleFullBetData = (gameArray, area, num) => {

  return gameArray.map(game => {

    return {
      ...game,
      numList: game.numList.map(user => {
        return {
          ...user,
          areaList: user?.areaList?.map(a => {
            return {
              ...a,
              hiddenByFullBet: a.num == num ? a.fullBetType == 0 : true
            }
          })
        }
      })
    }
  });
};




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
  closeSocketByKey(socketBackType.value)
  closeSocketByKey('open-result')
  closeSocketByKey('do-bet-success-back')
  closeSocketByKey('chip-in-back')

})

onShow(() => {
  // calcScrollHeight();
  // 初始化
  initData()
  // 监听窗口变化
  uni.onWindowResize(() => {
    calcScrollHeight();
  });
})

const closeSocketByKey = (key, event) => {
  key && socketIO.off(key, event);
}


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
