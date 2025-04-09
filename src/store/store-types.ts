import { useGameeStore } from './modules/game.store'

// 定义所有store的类型
export interface AppStores {
  user: ReturnType<typeof useGameeStore>
  // 添加其他store...
}