<script setup>
import { ref, defineExpose, defineEmits, defineProps } from "vue";
const props = defineProps({
  title: {
    type: String,
    required: true, // 标题是必须的
    default: '标题'
  },
  width: {
    type: [String, Number],
    default: '920' // 默认宽度为 80%
  },
  maskClick: {
    type: Boolean,
    default: false // 默认不允许点击遮罩关闭
  }
});
const popup = ref(null);
const isOpen = ref(false); // 新增 isOpen 属性来表示是否打开
// 动态生成宽度类
const widthClass = ref(`dialog-width-${props.width}`);

const open = () => {

  popup.value && popup.value.open();
  isOpen.value = true; // 打开时设置 isOpen 为 true
};

const close = () => {
  popup.value.close();
  isOpen.value = false; // 关闭时设置 isOpen 为 false
};

defineExpose({ open, close, isOpen  });
</script>

<template>
  <uni-popup ref="popup" type="center" background-color="transparent" :mask-click="maskClick">
    <view :class="['dialog', widthClass]">
      <!-- 标题 -->
      <view class="dialog-header">{{ title }}</view>

      <!-- 内容插槽 -->
      <view class="dialog-content">
        <slot>
        </slot>
      </view>

      <!-- 底部按钮 -->
      <view class="dialog-footer">
        <slot name="footer">
          <button class="cancel-btn common-flex" @click="close">取消</button>
          <button class="confirm-btn common-flex" @click="confirm">确认</button> 
        </slot>
      </view>
    </view>
  </uni-popup>
</template>



<style scoped>
/* 弹窗样式 */
.dialog {
  text-align: center;
  padding-bottom: 20px;
  border-radius: 16px;
  border: 2px solid #E1D6BA;
  background: radial-gradient(100% 100% at 50% 0%, #795C35 0%, #57412C 100%);
}

/* 标题 */
.dialog-header {
  background: #9F6F2D;
  color: white;
  padding: 12px;
  font-size: 18px;
  height: 104px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  font-size: 48px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center
}



/* 底部按钮 */
.dialog-footer {
  display: flex;
  justify-content: space-around;
  padding: 10px 20px;
}

.cancel-btn {
  background: #4a3220;
  color: white;
  border-radius: 5px;
  width: 360px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 85px;
  background: rgba(41, 25, 6, 0.70);
  text-align: center;
  font-family: "Lantinghei SC";
  font-size: 48px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  box-sizing: border-box;
}

.confirm-btn {
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

/* 根据不同的宽度生成对应的类 */
.dialog-width-920 {
  width: 920px;
}

.dialog-width-1544 {
  width: 1544px;
}
</style>