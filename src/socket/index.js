import io from 'socket.io-client';

class SocketIOClient {
  constructor() {
    this.socket = null; // 保存 socket 实例
    this.options = {}; // 初始化配置项
    this.events = new Map(); // 事件列表，记录所有注册的事件
    this.heartbeatTimer = null; // 心跳定时器引用
    this.joinQueue = []; // 加入房间的请求队列
    this.type = "stream"; // 默认通信类型标识（用于房间功能传参）
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


    this.connect(); // 建立连接
  }
  // 建立 socket.io 连接
  connect() {
    const {
      url,
      auth,
      query,
      socketOptions,
      onConnect,
      onDisconnect,
    } = this.options;
    // 创建 socket 实例
    this.socket = io(url, {
      auth,
      query,
      ...socketOptions,
    });
    // 连接成功时的回调
    this.socket.on('connect', () => {
      console.log('✅ Socket.io 已连接:');
      // this.startHeartbeat(); // 如需自动开启心跳，可取消注释
      this.rebindEvents(); // 重新绑定事件
      onConnect && onConnect(); // 执行用户自定义回调
      // 🔁 处理等待中的加入房间请求
      while (this.joinQueue.length) {
        const joinData = this.joinQueue.shift();
        console.log("🔁 处理等待中的加入房间请求:", joinData);
        this.emit('join-room', joinData);
      }
    });
    // 连接断开时的回调
    this.socket.on('disconnect', (reason) => {
      console.warn('⚠️ Socket.io 已断开:', reason);
      this.stopHeartbeat(); // 停止心跳
      onDisconnect && onDisconnect(reason); // 执行断开回调
    });
    // 尝试重连时打印信息
    this.socket.on('reconnect_attempt', (attempt) => {
      console.log(`🔁 第 ${attempt} 次重连...`);
    });
    // 连接出错时打印错误
    this.socket.on('connect_error', (err) => {
      console.error('❌ Socket.io 连接出错:', err);
    });
  }
  // 启动心跳机制
  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      this.emit('heartbeat', this.options.heartbeatMsg);
    }, this.options.heartbeatInterval);
  }
  // 停止心跳
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
  /**
   * 发送事件
   * @param {String} event - 事件名
   * @param {any} data - 发送的数据
   */
  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('📭 Socket.io 未连接，无法发送：', event);
    }
  }
  /**
   * 注册事件监听
   * @param {String} event - 事件名
   * @param {Function} callback - 回调函数
   */
  on(event, callback) {
    this.events.set(event, callback); // 保存事件和回调
    if (this.socket) {
      console.log('📥 监听事件：', event);
      this.socket.on(event, callback); // 注册到 socket 实例
    }
  }
  /**
   * 移除事件监听
   * @param {String} event - 事件名
   * @param {Function} [callBack] - 指定回调（不传则移除之前注册的）
   */
  off(event, callBack) {
    const callback = callBack || this.events.get(event);
    if (callback && this.socket) {
      console.log('📤 移除事件：', event);
      this.socket.off(event, callback);
    }
    this.events.delete(event); // 移除事件缓存
  }
  // 重新绑定所有注册的事件（用于断线重连后）
  rebindEvents() {
    this.events.forEach((callback, event) => {
      this.socket ?.off(event); // 先移除旧的
      this.socket ?.on(event, callback); // 再重新绑定
    });
  }
  // 主动断开 socket 连接
  close() {
    this.stopHeartbeat(); // 停止心跳
    if (this.socket) {
      this.socket.disconnect(); // 断开连接
      this.socket = null;
      console.log('❎ Socket.io 已断开');
    }
  }

  // 加入房间
  join(data) {
    const joinData = {
      ...data,
      source: this.type
    };
    if (this.isConnected()) {
      console.log("✅ 已连接，直接加入房间:", joinData);
      this.emit('join-room', joinData);
    } else {
      console.log("🕒 尚未连接，加入房间操作将排队:", joinData);
      this.joinQueue.push(joinData);
    }
  }

  // 离开房间
  leave(data) {
    this.emit('leave-room', {
      ...data,
      "source": this.type
    });
  }
  // 检查是否已连接
  isConnected() {
    return !!this.socket?.connected;
  }
}

export const socketIO = new SocketIOClient();