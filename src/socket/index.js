// utils/socket.io.js
import {
    io,
    Socket
} from 'socket.io-client';

class SocketIOClient {
    constructor() {
        /** @type {Socket | null} */
        this.socket = null;
        this.options = {};
        this.events = new Map();
        this.heartbeatTimer = null;
    }

    /**
     * 初始化 socket.io 客户端
     * @param {Object} options
     * @param {String} options.url - socket服务器地址
     * @param {Object} [options.auth] - 鉴权信息（可选）
     * @param {Object} [options.query] - query参数（可选）
     * @param {Number} [options.heartbeatInterval] - 心跳间隔时间
     * @param {any} [options.heartbeatMsg] - 心跳内容
     */
    init(options) {
        const {
            url,
            auth = {},
            query = {},
            heartbeatInterval = 10000,
            heartbeatMsg = 'ping',
        } = options;

        this.options = {
            url,
            auth,
            query,
            heartbeatInterval,
            heartbeatMsg,
        };

        this.connect();
    }

    /**
     * 建立连接
     */
    connect() {
        const {
            url,
            auth,
            query
        } = this.options;

        // 创建连接实例
        this.socket = io(url, {
            transports: ['websocket'],
            auth,
            query,
        });

        // 连接成功
        this.socket.on('connect', () => {
            console.log('✅ Socket.io 已连接:', this.socket.id);
            this.startHeartbeat();
        });

        // 自动重连中
        this.socket.on('reconnect_attempt', (attempt) => {
            console.log(`🔁 第 ${attempt} 次重连...`);
        });

        // 出错
        this.socket.on('connect_error', (err) => {
            console.error('❌ Socket.io 连接出错:', err);
        });

        // 连接关闭
        this.socket.on('disconnect', (reason) => {
            console.warn('⚠️ Socket.io 已断开:', reason);
            this.stopHeartbeat();
        });

        // 注册已添加的事件
        this.events.forEach((callback, event) => {
            this.socket.on(event, callback);
        });
    }

    /**
     * 启动心跳机制
     */
    startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatTimer = setInterval(() => {
            this.emit('heartbeat', this.options.heartbeatMsg);
        }, this.options.heartbeatInterval);
    }

    /**
     * 停止心跳机制
     */
    stopHeartbeat() {
        clearInterval(this.heartbeatTimer);
    }

    /**
     * 发送消息
     * @param {string} event 事件名
     * @param {any} data 数据
     */
    emit(event, data) {
        if (this.socket?.connected) {
            this.socket.emit(event, data);
        } else {
            console.warn('📭 Socket.io 未连接，无法发送：', event);
        }
    }

    /**
     * 监听事件
     * @param {string} event 事件名
     * @param {Function} callback 回调
     */
    on(event, callback) {
        this.events.set(event, callback);
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    /**
     * 移除事件监听
     * @param {string} event 事件名
     */
    off(event) {
        const callback = this.events.get(event);
        if (callback && this.socket) {
            this.socket.off(event, callback);
        }
        this.events.delete(event);
    }

    /**
     * 主动关闭连接
     */
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