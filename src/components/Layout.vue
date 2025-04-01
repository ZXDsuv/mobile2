<template>
    <view class="layout">
        <view class="content">
            <slot></slot>
        </view>
    </view>
</template>

<style>
.layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
	width: 100vw;
	background: radial-gradient(100% 100% at 50% 0%, rgba(255, 255, 255, 0.00) 0%, rgba(255, 193, 0, 0.20) 100%), #000;
}

.content {
    flex: 1;
    overflow-y: auto;
}

</style>