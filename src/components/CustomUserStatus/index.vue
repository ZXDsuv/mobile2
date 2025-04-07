<template>
    <div class="custom-user-status">
        <view class="user-box" v-for="item in 5" :key="item">
            <view class="user-title">
                <view class="user-seat">3</view>
                <view class="user-count">
                    <image src="@/static/images/index/user-icon.svg" class="people-icon"></image>
                    <text>11</text>
                </view>
            </view>
            <view class="user-list">
                <view class="user-item ignore-vh-box" v-for="item in 16" :key="item">
                    <view class="user-mes ignore-vh-user-mes">66666-1</view>
                    <view class="user-result"></view>
                </view>
            </view>
        </view>
    </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
.custom-user-status {
    height: 100%;
    flex: 1;
    padding: 0 20px 0px 20px;
    display: flex;
    justify-content: center;
    gap: 15px;

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
            overflow-y: auto; // 重点：超出后滚动
            -webkit-overflow-scrolling: touch; // iOS 平滑滚动（可选）
            max-height: calc(100% - 54px - 58px); // 计算剩余高度
            .user-item {
                width: 100%;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;

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
                    background: blue;

                }

                .user-result {
                    flex: 1;
                    background: red;
                }

                .ignore-vh-user-mes {
                    min-height: 44px;
                }
            }

            >.ignore-vh-box {
                height: 106px;
            }
        }

    }
}
</style>