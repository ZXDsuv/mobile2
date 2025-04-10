<script>
import {
  navigateTo
} from './utils/route';
// socket
import { socketIO } from '@/socket/index.js';
export default {
  onLaunch: function () {
    navigateTo('/pages/login/index')

    // 初始化socket
    this.initSocket()
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  methods: {
    initSocket: function () {
      console.log(window.PROXY_CONFIG.VUE_APP_SOCKET_URL);
      
      socketIO.init({
        url: window.PROXY_CONFIG.VUE_APP_SOCKET_URL,  // 使用相同的 URL 配置
        reconnection: true,  // 自动重连
        reconnectionDelay: 1000,  // 重连延迟时间
        reconnectionAttempts: Infinity,  // 重连次数
        transports: ['websocket'],  // 使用 WebSocket 协议
        heartbeatInterval: 10000,  // 心跳间隔
        heartbeatMsg: '💓',  // 心跳消息内容
      });

      // // 可在此注册全局的系统消息监听等
      // socketIO.on('system', (msg) => {
      //   console.log('🖥️ 系统通知:', msg);
      // });
    }
  }
}
</script>

<style>
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
