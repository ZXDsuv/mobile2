<template>
  <div
    class="warning-flash-container"
    :class="{ 'warning-active': isActive }"
    :style="containerStyle"
    role="alert"
    aria-live="assertive"
  >
    <div class="warning-overlay" :style="overlayStyle">
      <slot name="icon">
        <image style="width: 80px" src="@/static/images/index/warning-icon.svg"></image>
      </slot>
    </div>
    <div class="warning-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, onMounted } from "vue";

const props = defineProps({
  // 控制是否激活警告
  active: {
    type: Boolean,
    default: false,
  },
  // 警告持续时间(ms)，0表示无限
  duration: {
    type: Number,
    default: 0,
  },
  // 背景颜色
  bgColor: {
    type: String,
    default: "#FF001F",
  },
  // 图标颜色
  iconColor: {
    type: String,
    default: "#ffffff",
  },
  // 闪烁速度(ms)
  speed: {
    type: Number,
    default: 500,
  },
  // 是否启用声音
  sound: {
    type: Boolean,
    default: false,
  },
  // 声音类型
  soundType: {
    type: String,
    default: "beep", // 'beep' | 'alert' | 'custom'
    validator: (val) => ["beep", "alert", "custom"].includes(val),
  },
  // 自定义声音URL
  soundUrl: {
    type: String,
    default: "",
  },
  // 覆盖层透明度
  overlayOpacity: {
    type: Number,
    default: 1,
    validator: (val) => val >= 0 && val <= 1,
  },
});

const emit = defineEmits(["started", "ended"]);

const isActive = ref(false);
let audio = null;
let timer = null;

// 计算样式
const containerStyle = computed(() => ({
  "--flash-speed": `${props.speed}ms`,
  "--flash-bg-color": props.bgColor,
}));

const overlayStyle = computed(() => ({
  "background-color": props.bgColor,
  opacity: props.overlayOpacity,
}));

// 播放声音
const playSound = () => {
  if (!props.sound) return;

  try {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    let soundSrc = "";
    if (props.soundType === "beep") {
      soundSrc =
        "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...";
    } else if (props.soundType === "alert") {
      soundSrc =
        "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQ...";
    } else if (props.soundUrl) {
      soundSrc = props.soundUrl;
    }

    if (soundSrc) {
      audio = new Audio(soundSrc);
      audio.play().catch((e) => console.warn("声音播放失败:", e));
    }
  } catch (e) {
    console.error("声音初始化失败:", e);
  }
};

// 开始警告
const start = () => {
  if (isActive.value) return;

  isActive.value = true;
//   playSound();
  emit("started");

  if (props.duration > 0) {
    timer = setTimeout(() => {
      stop();
    }, props.duration);
  }
};

// 停止警告
const stop = () => {
  isActive.value = false;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  emit("ended");
};

// 监听active prop变化
watch(
  () => props.active,
  (newVal) => {
    if (newVal) {
      start();
    } else {
      stop();
    }
  }
);

onMounted(() => {
  if (props.active) {
    start();
  }
})

// 组件卸载时清理
onUnmounted(() => {
  stop();
  if (audio) {
    audio.pause();
    audio = null;
  }
});

// 暴露方法
defineExpose({
  start,
  stop,
});
</script>

<style scoped>
.warning-flash-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  transition: opacity 0.3s ease;
  z-index: 9999;
}

.warning-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.warning-icon {
  width: 40%;
  height: 40%;
  max-width: 50px;
  max-height: 50px;
}

.warning-content {
  position: relative;
  z-index: 1;
}

.warning-active .warning-overlay {
  animation: flashAnimation var(--flash-speed) infinite alternate;
}

.warning-active .warning-icon {
  animation: pulseAnimation calc(var(--flash-speed) * 2) infinite;
}

@keyframes flashAnimation {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: v-bind("overlayOpacity");
  }
}

@keyframes pulseAnimation {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}
</style>
