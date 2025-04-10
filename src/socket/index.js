import io from 'socket.io-client';

class SocketIOClient {
  constructor() {
    this.socket = null;
    this.options = {};
    this.events = new Map();
    this.heartbeatTimer = null;
  }

  /**
   * 初始化 socket.io 客户端
   * @param {Object} options - 配置项
   * @param {String} options.url - socket 地址
   * @param {Object} [options.auth] - 鉴权
   * @param {Object} [options.query] - 查询参数
   * @param {Number} [options.heartbeatInterval] - 心跳间隔（默认 10000）
   * @param {any} [options.heartbeatMsg] - 心跳消息（默认 'ping'）
   * @param {Function} [options.onConnect] - 连接成功回调
   * @param {Function} [options.onDisconnect] - 断开连接回调
   * @param {...any} [options.xxx] - 其他 socket.io-client 原生支持的参数，如 transports、reconnection 等
   */
  init(options) {
    const {
      url,
      auth = {},
      query = {},
      heartbeatInterval = 10000,
      heartbeatMsg = 'ping',
      ...socketOptions
    } = options;

    this.options = {
      url,
      auth,
      query,
      heartbeatInterval,
      heartbeatMsg,
      onConnect: options.onConnect,
      onDisconnect: options.onDisconnect,
      socketOptions,
    };

    this.connect();
  }

  connect() {
    const {
      url,
      auth,
      query,
      socketOptions,
      onConnect,
      onDisconnect,
    } = this.options;
    console.log(url);
    
    this.socket = io(url, {
      auth,
      query,
      ...socketOptions,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.io 已连接:');
      this.startHeartbeat();
      this.rebindEvents();
      onConnect && onConnect();
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('⚠️ Socket.io 已断开:', reason);
      this.stopHeartbeat();
      onDisconnect && onDisconnect(reason);
    });

    this.socket.on('reconnect_attempt', (attempt) => {
      console.log(`🔁 第 ${attempt} 次重连...`);
    });

    this.socket.on('connect_error', (err) => {
      console.error('❌ Socket.io 连接出错:', err);
    });
  }

  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      this.emit('heartbeat', this.options.heartbeatMsg);
    }, this.options.heartbeatInterval);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('📭 Socket.io 未连接，无法发送：', event);
    }
  }

  on(event, callback) {
    this.events.set(event, callback);
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event) {
    const callback = this.events.get(event);
    if (callback && this.socket) {
      this.socket.off(event, callback);
    }
    this.events.delete(event);
  }

  rebindEvents() {
    this.events.forEach((callback, event) => {
      this.socket?.off(event);
      this.socket?.on(event, callback);
    });
  }

  close() {
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('❎ Socket.io 已断开');
    }
  }
}

export const socketIO = new SocketIOClient();
