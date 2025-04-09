import {
  defineConfig,
  loadEnv
} from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import postcssPxToViewport from 'postcss-px-to-viewport-8-plugin'
import postcssPxtorem from 'postcss-pxtorem'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 需要安装 @types/node


export default defineConfig(({
  mode
}) => {
  console.log(loadEnv(mode, process.cwd()).VITE_BASE_URL);

  // 设定默认值为 1920×1080
  let viewportWidth = 1920
  let viewportHeight = 1080
  let rootFontSize = 192

  // 如果是 4K 模式，替换参数
  if (mode === 'prod4k' || mode === 'dev4k') {
    viewportWidth = 3840
    viewportHeight = 2160
    rootFontSize = 384
  }

  return {
    plugins: [uni()],
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'socket.io-parser': require.resolve('socket.io-parser')
      }
    },
    optimizeDeps: {
      include: ['socket.io-client', 'socket.io-parser']
    },
    define: {
      __BASE_URL__: JSON.stringify(process.env.BASE_URL || '/')
    },
    css: {
      postcss: {
        plugins: [
          // px 转 vw
          postcssPxToViewport({
            unitToConvert: 'px',
            viewportWidth,
            unitPrecision: 5,
            propList: ['width', 'padding', 'min-width'],
            viewportUnit: 'vw',
            selectorBlackList: ['ignore-vw'],
            minPixelValue: 1,
            mediaQuery: false,
            replace: true,
            exclude: [/node_modules/, /uni_modules/],
          }),

          // px 转 vh
          postcssPxToViewport({
            unitToConvert: 'px',
            viewportWidth: viewportHeight, // 注意这里是 height！
            unitPrecision: 5,
            propList: ['height', 'min-height', 'line-height', 'row-gap', 'column-gap', 'margin-top', '--gift-area-height'],
            viewportUnit: 'vh',
            selectorBlackList: ['ignore-vh', 'ignore-vh-*'],
            minPixelValue: 1,
            mediaQuery: false,
            replace: true,
            exclude: [/node_modules/, /uni_modules/],
          }),

          // px 转 rem
          postcssPxtorem({
            rootValue: rootFontSize,
            unitPrecision: 5,
            propList: ['font-size'],
            selectorBlackList: ['ignore-rem'],
            replace: true,
            mediaQuery: false,
            minPixelValue: 1,
            exclude: [/node_modules/, /uni_modules/],
          }),
        ],
      },
    },
  }
})