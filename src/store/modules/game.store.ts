import { defineStore } from 'pinia'
import { GameState, GameId } from '../types/game.types'
import { get } from 'http';
// import { api } from '@/api' // 假设有一个api服务

// 使用组合式API风格定义store
export const useGameeStore = defineStore('game', {
    state: (): GameState => ({
        gameId: 0,
        tableInfo: {}
    }),

    getters: {
        // 带有返回值的getter
        getGameId(): GameId {
            return this.game?.gameId || null
        },
        getTableInfo(): any {
            return this.tableInfo || {} 
        }


    },

    actions: {
        // 异步action示例 - 登录
        setGameId(gameId: GameId) {
            this.gameId = gameId;
        },
        setTableInfo(tableInfo: Object) {
            this.tableInfo = tableInfo;
        }
    },
    persist: true
})