<script>
import {
  navigateTo
} from './utils/route';
// socket
import { socketIO } from '@/socket/index.js';
export default {
  onLaunch: function () {
    navigateTo('/pages/login/index')
    console.log('App Launch')

    // 初始化socket
    if (window?.__APP_READY__) {
      this.initSocket();
    } else {
      document.addEventListener('config-ready', () => {
        this.initSocket();
      });
    }
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  methods: {
    initSocket: function () {

      socketIO.init({
        url: window?.PROXY_CONFIG?.VUE_APP_SOCKET_URL,  // 使用相同的 URL 配置
        reconnection: true,  // 自动重连
        reconnectionDelay: 1000,  // 重连延迟时间
        reconnectionAttempts: Infinity,  // 重连次数
        transports: ['websocket'],  // 使用 WebSocket 协议
        // heartbeatInterval: 10000,  // 心跳间隔
        // heartbeatMsg: '💓',  // 心跳消息内容
      });


    }
  }
}
</script>

<style lang="scss">
/*每个页面公共css */
html {
  font-size: calc(100vw / 10) !important;
  /* 让 1rem = 192px */
}

.common-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
