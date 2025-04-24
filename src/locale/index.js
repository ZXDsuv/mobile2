import en from './en.json' // 英语
import zhTw from './zh-Tw.json' // 中文繁体
import zh from './zh.json' // 中文简体
import { createI18n } from 'vue-i18n' // 引入vue-i18n组件

//导出i18n实例
export const i18n = createI18n({
    legacy: false, // 使用 Composition API 模式
    locale: 'zh', // 设置语言环境
    fallbackLocale: 'zh', // 如果切换的语言没有资源，就会显示默认语言 zh 中文简体
    globalInjection: true, // 全局生效$t方法
    missingWarn: false, // 关闭警告
    fallbackWarn: false, // 关闭警告
    silentTranslationWarn: true, // 关闭警告
    silentFallbackWarn: true, // 关闭警告
    messages: { // 语言包
        en,
        zh,
        zhTw
    }
})
