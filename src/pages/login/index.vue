<template>
    <Layout>
        <view class="login-page-container">
            <!-- logo -->
            <view class="login-header">
                <image src="/src/static/logo/logo.svg" />
                <text>大西洋国际娱乐</text>
            </view>
            <!-- 账号密码 -->
            <view class="login-content">
                <view class="login-form">
                    <view class="title">账号</view>
                    <view class="uni-input-wrapper">
                        <input class="uni-input" maxlength="18" placeholder="请输入账号" />
                    </view>
                </view>
                <view class="login-form">
                    <view class="title">密码</view>
                    <view class="uni-input-wrapper">
                        <input class="uni-input" maxlength="18" placeholder="请输入密码" :password="showPassword" />
                        <image class="eye" src="/src/static/logo/no.svg" v-if="showPassword"></image>
                        <image class="eye" src="/src/static/logo/no.svg" v-else></image>
                    </view>

                </view>
                <view class="form-btn">
                    登录
                </view>
            </view>
            <!-- 桌台信息 -->
            <view class="login-footer">
                <text>当前桌台号：牛牛-15号桌</text>
                <view class="debind">解绑桌台</view>
            </view>

        </view>
    </Layout>
    <!-- 提示绑定桌台 -->
    <CustomDialog ref="customPopup" title="信息">
        <view class="bind-table">
            <image class="bind-img" src="@/static/logo/table.svg"></image>
            <text>需绑定桌台</text>
        </view>
        <template #footer>
            <button class="confirm-btn common-flex" @click="confirm">去绑定</button>
        </template>
    </CustomDialog>
    <!-- 绑定桌台内容 -->
    <CustomDialog ref="customPopup2" title="绑定桌台" :width="1544">
        <view class="customPopup2-content">
            <view class="table-content">
                <view class="select-table" :class="{ 'choose-table': item.choose }" v-for="(item, i) in tableList"
                    :key="i">
                    {{ item.label }}
                </view>
            </view>

            <view class="choose-content">
                <view class="choose-item" :class="{ 'choosed': item.isChoosed }" v-for="(item, i) in chooseList"
                    :key="i">
                    <view class="choose" :class="{ 'choosed-item': item.isChoosed }">
                        <image src="/static/logo/gou.svg" v-if="item.isChoosed" />
                        <view v-if="item.choose"></view>
                    </view>
                    <view>{{ item.label }}</view>
                </view>
            </view>
        </view>
        <template #footer>
            <button class="confirm-btn2 common-flex" @click="confirm">确定</button>
        </template>
    </CustomDialog>
    <!-- 退出登录 -->
    <CustomDialog ref="customPopup3" title="信息">
        <view class="bind-table">
            <image class="bind-img" src="@/static/logo/logout.svg"></image>
            <text>确认退出登录？</text>
        </view>
    </CustomDialog>
    <!-- 解绑桌台 -->
    <CustomDialog ref="customPopup4" title="信息">
        <view class="bind-table">
            <image class="bind-img" src="@/static/logo/table.svg"></image>
            <text>您确定要解绑桌台吗？</text>
        </view>
    </CustomDialog>
    <!-- 授权 -->
    <CustomDialog ref="customPopup5" title="信息">
        <view class="shouquan-content">
            <input class="uni-input-shouquan" focus placeholder="自动获得焦点" />

        </view>
    </CustomDialog>
</template>

<script setup>
import {
    onMounted,
    reactive,
    ref
} from "vue";
import Layout from "@/components/Layout.vue"
import CustomDialog from "@/components/CustomDialog/index.vue"
const customPopup = ref(null);
const customPopup2 = ref(null);
const customPopup3 = ref(null);
const customPopup4 = ref(null);
const customPopup5 = ref(null);
const showPassword = ref(false); // 控制密码输入框的显示状态


const tableList = reactive([
    {
        label: '百家乐',
        value: '百家乐',
        choose: 1
    },
    {
        label: '德州扑克',
        value: '德州扑克'
    },
    {
        label: '龙虎斗',
        value: '龙虎斗'
    }
])
const chooseList = reactive([
    {
        label: '百家乐-1号桌',
        value: '百家乐-1号桌',
        choose: 1
    },
    {
        label: '百家乐-1号桌',
        value: '百家乐-1号桌',
        isChoosed: 1
    }, {
        label: '百家乐-1号桌',
        value: '百家乐-1号桌',
    }, {
        label: '百家乐-1号桌',
        value: '百家乐-1号桌',
    }, {
        label: '百家乐-1号桌',
        value: '百家乐-1号桌',
    },

])
onMounted(() => {
    if (customPopup5.value) {
    }
}) 
</script>

<style lang="scss" scoped>
.login-page-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .login-header {
        image {
            width: 138px;
            height: 138px;
        }

        display: flex;
        align-items: center;
        gap: 36px;

        text {
            color: #FDE077;
            text-align: center;
            font-family: "Noto Serif SC";
            font-size: 72px;
            font-style: normal;
            font-weight: 800;
            line-height: normal;
            letter-spacing: 6.48px;
        }
    }

    .login-content {
        width: 920px;
        flex-shrink: 0;
        border-radius: 16px;
        border: 2px solid #FC9;
        background: #3D3022;
        padding: 80px;
        box-sizing: border-box;
        margin-top: 42px;

        .login-form {
            .eye {
                width: 48px;
                height: 48px;
                position: absolute;
                right: 32px;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
            }
            .title {
                color: #FFF;
                font-family: "PingFang SC";
                font-size: 40px;
                font-style: normal;
                font-weight: 500;
                line-height: 46px;
            }

            .uni-input-wrapper {
                margin-top: 16px;
                width: 760px;
                height: 104px;
                flex-shrink: 0;
                border-radius: 8px;
                background: rgba(255, 221, 153, 0.20);
                padding: 29px 32px;
                box-sizing: border-box;
                margin-bottom: 32px;
                display: flex;

                .uni-input {
                    height: 100%;
                    font-size: 36px;
                    color: #FFF;
                    background: transparent;
                }

                image {
                    width: 48px;
                    height: 48px;
                }
            }
        }

        .form-btn {
            width: 760px;
            height: 96px;
            flex-shrink: 0;
            border-radius: 100px;
            background: #9F6F2D;
            color: #FFF;
            font-family: "PingFang SC";
            font-size: 42px;
            font-style: normal;
            font-weight: 400;
            line-height: 96px;
            text-align: center;

        }
    }

    .login-footer {
        width: 920px;
        flex-shrink: 0;
        border-radius: 16px;
        border: 2px solid #FC9;
        background: #3D3022;
        padding: 36px 56px;
        box-sizing: border-box;
        margin-top: 32px;
        color: #FFF;
        font-family: "PingFang SC";
        font-size: 40px;
        font-style: normal;
        font-weight: 500;
        line-height: 46px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .debind {
            width: 240px;
            height: 86px;
            flex-shrink: 0;
            border-radius: 100px;
            background: rgba(255, 255, 255, 0.20);
            text-align: center;
            line-height: 86px;
        }
    }
}

:deep(.bind-table) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    padding: 72px 0;

    .bind-img {
        width: 128px; // 调整图片宽度
        height: 128px; // 调整图片高度;
    }

    text {
        color: #FFF;
        text-align: center;
        font-family: "PingFang SC";
        font-size: 48px;
        font-style: normal;
        font-weight: 600;
        line-height: 56px;
        /* 116.667% */
    }
}

:deep(.confirm-btn) {
    color: #502E13;
    text-shadow: 0px 1px 1.4px #FFE9BE;
    border-radius: 5px;
    width: 360px;
    height: 100px;
    flex-shrink: 0;
    border-radius: 85px;
    background: radial-gradient(190.98% 83.33% at 50% 50.51%, rgba(255, 255, 255, 0.00) 21.4%, rgba(255, 255, 255, 0.61) 83.72%), #E5981D;
    text-align: center;
    font-family: "Lantinghei SC";
    font-size: 48px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    box-sizing: border-box;
    color: #502E13;
    text-shadow: 0px 1px 1.4px #FFE9BE;
}

:deep(.customPopup2-content) {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-top: 32px;
    flex-direction: column;
    padding: 0 64px;

    .table-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .select-table {
        width: 296px;
        height: 88px;
        flex-shrink: 0;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.20);
        color: #FFF;
        text-align: center;
        font-family: "PingFang SC";
        font-size: 48px;
        font-style: normal;
        font-weight: 600;
        line-height: 56px;
        line-height: 88px;
        /* 116.667% */
    }

    .choose-table {
        background: #9F6F2D;
    }

    .choose-content {
        width: 1416px;
        border-radius: 16px;
        background: rgba(0, 0, 0, 0.50);
        padding: 40px 80px;
        box-sizing: border-box;
        margin-top: 32px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        row-gap: 32px;

        .choose-item {
            width: calc(33%);
            position: relative;
            display: flex;
            align-items: center;
            color: #FFF;
            font-size: 40px;
            column-gap: 16px;

            .choose {
                width: 48px;
                aspect-ratio: 1 / 1;
                border-radius: 50%;
                border: 4px solid #fff;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;

                image {
                    width: 100%;
                    height: 100%;
                }

                view {
                    background: #FFAE40;
                    width: 80%;
                    height: 80%;
                    border-radius: 50%;
                    position: absolute;
                }
            }

            .choosed-item {
                border: 4px solid #938e8a;
            }
        }

        .choosed {
            color: #938e8a;
            pointer-events: none;

        }


    }
}

:deep(.confirm-btn2) {
    width: 296px !important;
    height: 120px;
    flex-shrink: 0;
    display: flex;
    width: 296px;
    min-height: 46px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 100px;
    background: #9F6F2D;
    color: #FFF;
    font-family: "PingFang SC";
    font-size: 40px;
    font-style: normal;
    font-weight: 600;
    line-height: 46px;
    padding: 37px 108px;

    /* 115% */
}

:deep(.shouquan-content) {
    width: 100%;
    padding: 128px 80px;
    box-sizing: border-box;

    .uni-input-shouquan {
        border-radius: 8px;
        border: 2px solid #C19858;
        background: rgba(42, 30, 13, 0.50);
        padding: 27px 40px;
        min-height: 50px;
        font-size: 36px;

    }

    .uni-input-wrapper,
    .uni-input-form {
        text-align: left;
    }

    .uni-input-input {
        text-align: left;
    }
}
</style>