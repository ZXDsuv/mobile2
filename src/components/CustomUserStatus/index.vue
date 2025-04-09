<template>
    <view class="custom-user-status">
        <view class="list-area" :class="{ 'has-gift-area': showGiftArea }">
            <view class="user-box" v-for="item in list" :key="item">
                <view class="user-title">
                    <view class="user-seat">3</view>
                    <view class="user-count">
                        <image src="@/static/images/index/user-icon.svg" class="people-icon"></image>
                        <text>11</text>
                    </view>
                </view>
                <view class="user-list" ref="listContainer" :data-id="item.id">
                    <view class="user-list-scroll" :style="getScrollStyle(item)" ref="scrollContent" :data-id="item.id">
                        <view class="user-item ignore-vh-box "
                            :class="{ 'nn-game': gameId == 3, 'bjl-game': gameId == 1 }" v-for="num in item.num"
                            :key="num">
                            <!-- 百家乐龙虎 -->
                            <template v-if="gameId == 1">
                                <template v-if="true">
                                    <view class="user-mes ignore-vh-user-mes color-header-1 ">66666-1</view>
                                    <view class="user-result color-content-1">
                                        {{ `${numberWithCommas(2000)}(2)` }}
                                    </view>
                                </template>
                                <!-- 现金 -->
                                <template v-else>
                                    <view class="user-result color-cash-1">
                                        {{ `CASH` }}
                                    </view>
                                </template>
                                <CustomWarning v-if="item.warning" :active="item.warning"></CustomWarning>
                                <image v-if="item.isChecked" class="checked-icon"
                                    src="@/static/images/index/right-icon.svg"></image>
                            </template>
                            <!-- 牛牛 -->
                            <template v-else>
                                <template v-if="true">
                                    <view class="user-mes ignore-vh-user-mes color-header disable-box">66666-1</view>
                                    <view class="user-result color-content disable-box">
                                        <view v-for="number in 3" :key="number" class="nn-content-item text-color-1 ">{{
                                            `2000(2)` }}
                                            <image class="checked-icon" src="@/static/images/index/right-icon.svg">
                                            </image>
                                        </view>
                                    </view>
                                </template>
                            </template>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="user-gift-area" v-if="showGiftArea">
            <view class="gift-item" v-for="item in giftList" :key="item" :data-id="item.id">
                <view class="item-header" :class="item.className">
                    {{ item.name }}
                </view>
                <view class="scroll-content" :style="getScrollStyle(item)" :data-id="item.id">
                    <view class="item-content" v-for="i in item.num" :key="i">
                        <view class="content-header ignore-vh-24">666-1</view>
                        <view class="content-content ignore-vh-24">{{ `100(2)` }}</view>
                    </view>
                </view>

            </view>
        </view>
    </view>

</template>

<script setup>
import { ref, computed, onMounted, nextTick, reactive } from 'vue'

// tool
import { numberWithCommas } from "@/utils/tool"

// com
import CustomWarning from "@/components/CustomWarning/index.vue"
const gameId = ref(1)
const showGiftArea = ref(true); // 控制礼物区域的显示
const listContainer = ref(null)
const scrollContent = ref(null)
// id: 唯一标识 座位标识
// warning: 是否开启警告
// scrollSpeed: 滚动速度
// contentHeight: 内容高度
// containerHeight: 容器高度
// maxScrollOffset: 最大滚动偏移量
// isChecked: 是否赔付
let list = reactive([
    { id: 1, num: 8, warning: true, scrollSpeed: 0, contentHeight: 0, containerHeight: 0 },
    { id: 2, num: 2, scrollSpeed: 0, contentHeight: 0, containerHeight: 0 },
    { id: 3, num: 12, scrollSpeed: 0, contentHeight: 0, containerHeight: 0 },
])

let giftList = reactive([
    { id: 1, name: '庄对', className: 'gift-1', num: 8, scrollSpeed: 0, contentHeight: 0, containerHeight: 0 },
    { id: 2, name: '闲对', className: 'gift-2', num: 2, scrollSpeed: 0, contentHeight: 0, containerHeight: 0 },
    {
        id: 3, name: '和', className: 'gift-3', num: 12, scrollSpeed: 0, contentHeight: 0, containerHeight: 0,
    },
    {
        id: 4, name: '幸运6', className: 'gift-4', num: 12, scrollSpeed: 0, contentHeight: 0, containerHeight: 0,
    },
    {
        id: 5, name: '幸运7', className: 'gift-5', num: 12, scrollSpeed: 0, contentHeight: 0, containerHeight: 0,
    },
    {
        id: 6, name: '超级幸运7', className: 'gift-6', num: 12, scrollSpeed: 0, contentHeight: 0, containerHeight: 0,
    },
    {
        id: 7, name: '大老虎', className: 'gift-7', num: 12, scrollSpeed: 0, contentHeight: 0, containerHeight: 0,
    },
    {
        id: 8, name: '小老虎', className: 'gift-7', num: 12, scrollSpeed: 0, contentHeight: 0, containerHeight: 0,
    }
])

const getScrollStyle = (item) => ({
    'animation-duration': `${item.scrollSpeed}s`,
    'animation-play-state': item.scrollSpeed > 0 ? 'running' : 'paused',
    '--content-height': `${item.contentHeight}px`,
    '--container-height': `${item.containerHeight}px`,
    '--max-scroll-offset': `${Math.max(item.contentHeight - item.containerHeight, 0)}px`
})


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

    query.selectAll('.user-list').boundingClientRect();       // 容器高度
    query.selectAll('.user-list-scroll').boundingClientRect(); // 内容高度

    query.exec(res => {

        const container = res[0];
        const content = res[1];


        // 座位容器在高度
        container.forEach((item, index) => {
            const id = item.dataset.id;

            list = list.map((i) => {
                if (i.id === id) {
                    i.containerHeight = item?.height || 0;

                }
                return i;
            })
        })

        content.forEach((item, index) => {
            const id = item.dataset.id;
            list = list.map((i) => {
                if (i.id === id) {
                    i.contentHeight = item?.height || 0;
                }
                return i;
            })
        })

        list.forEach((item) => {
            item.maxScrollOffset = Math.max(item.contentHeight - item.containerHeight, 0);
            item.scrollSpeed = item.maxScrollOffset > 0
                ? Math.round(item.maxScrollOffset / 5) // 平均每 30px 1 秒，可调节
                : 0
        })

    });


};


const calculateHeights2 = async () => {
    await nextTick();
    const query = uni.createSelectorQuery().in(this); // `in(this)` 重要！作用域是当前组件

    query.selectAll('.gift-item').boundingClientRect();       // 容器高度
    query.selectAll('.scroll-content').boundingClientRect(); // 内容高度

    query.exec(res => {
        const container = res[0];
        const content = res[1];


        // 座位容器在高度
        container.forEach((item, index) => {
            const id = item.dataset.id;

            giftList = giftList.map((i) => {
                if (i.id === id) {
                    i.containerHeight = item?.height || 0;

                }
                return i;
            })
        })

        content.forEach((item, index) => {
            const id = item.dataset.id;
            giftList = giftList.map((i) => {
                if (i.id === id) {
                    i.contentHeight = item?.height || 0;
                }
                return i;
            })
        })

        giftList.forEach((item) => {
            item.maxScrollOffset = Math.max(item.contentHeight - item.containerHeight, 0);
            item.scrollSpeed = item.maxScrollOffset > 0
                ? Math.round(item.maxScrollOffset / 5) // 平均每 30px 1 秒，可调节
                : 0
        })

    });


};


// 生命周期
onMounted(() => {
    calculateHeights()
    calculateHeights2()
    window.addEventListener('resize', calculateHeights)
    window.addEventListener('resize', calculateHeights2)

})
</script>

<style scoped lang="scss">
.custom-user-status {
    height: 100%;
    flex: 1;
    padding: 0 20px 0px 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;

    .list-area {
        width: 100%;
        display: flex;
        gap: 15px;
        height: calc(100% - var(--gift-area-height, 0px));

        .user-box {
            display: flex;
            flex-direction: column;
            max-width: 50%;
            height: 100%;
            flex-grow: 1;
            flex-shrink: 1;

            .user-title {
                width: 100%;
                background: #1A1A1D;
                display: flex;
                align-items: center;
                justify-content: space-between;
                max-height: 58px;
                min-height: 58px;

                .user-seat {
                    background: linear-gradient(180deg, #F3DCB3 0%, #DCB57E 100%);
                    color: #2E1F22;
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
                    color: #EFD5A9;
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
                    border-bottom: 1px solid #C0C0C0;
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
                        color: #FFF;
                        font-family: Arial;
                        font-size: 20px;
                        font-style: normal;
                        font-weight: 700;
                        text-transform: uppercase;
                    }



                    .user-result {
                        flex: 1;
                        color: #FFF;
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
                        ;
                    }

                    .ignore-vh-user-mes {
                        min-height: 44px;
                    }

                    .checked-icon {
                        width: 32px;
                        height: 32px;
                        position: absolute;
                        right: 0;
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
                            background: #2C2823;
                        }

                        .color-header-2 {
                            background: #c84034;
                        }

                        .color-content {
                            background: #010101;
                        }

                        .color-content-2 {
                            background: #c22b1d;
                        }

                        .color-cash-1 {
                            background: linear-gradient(180deg, #093CD9 0%, #052073 100%), #0D2673;
                        }

                        .color-cash-2 {
                            background: linear-gradient(180deg, #C61500 0%, #871002 100%), #C2372B;
                        }

                        .text-color-1 {
                            color: #51CBFF;
                        }

                        .text-color-2 {
                            color: #F53;

                        }

                        .text-color-3 {
                            color: #FD3;

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
                            background: linear-gradient(180deg, #093CD9 0%, #052073 100%), #0D2673;
                        }

                        .color-cash-2 {
                            background: linear-gradient(180deg, #C61500 0%, #871002 100%), #C2372B;
                        }
                    }
                }

                .disable-user-box {
                    color: #73716c !important;
                    background: transparent !important;
                }


            }



        }
    }

    .list-area.has-gift-area {
        --gift-area-height: 188px;
    }

    .user-gift-area {
        display: flex;
        gap: 16px;
        .gift-item {
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
                color: #CC2929;
                text-align: center;
                font-family: "PingFang SC";
                font-size: 24px;
                font-style: normal;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                z-index: 1;
            }

            .scroll-content {
                flex: 1;
                background: #201903;
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
            }

            .gift-1 {
                color: #CC2929
            }

            .gift-2 {
                color: #05F;
            }

            .gift-3 {
                color: #00D949;
            }

            .gift-4 {
                color: #FAFF00;
            }

            .gift-5 {
                color: #FF6A00;
            }

            .gift-6 {
                color: #F50;
            }

            .gift-7 {
                color: #FA0;
            }

            .item-content {
                flex: 1;
                background: #201903;
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;

                .content-header {
                    width: 100%;
                    background: #201802;
                    color: #FFF;
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
                    color: #FFF;
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
            }
        }

        .gift-1 {
            color: #CC2929
        }

        .gift-2 {
            color: #05F;
        }

        .gift-3 {
            color: #00D949;
        }

        .gift-4 {
            color: #FAFF00;
        }

        .gift-5 {
            color: #FF6A00;
        }

        .gift-6 {
            color: #F50;
        }

        .gift-7 {
            color: #FA0;
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