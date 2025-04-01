import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import postcssPxToViewport from "postcss-px-to-viewport-8-plugin";
import postcssPxtorem from "postcss-pxtorem";

export default defineConfig({
  plugins: [
    uni(),
  ],
  css: {
    postcss: {
      plugins: [
        // px 转 vw（只转换 width/height）
        postcssPxToViewport({
          unitToConvert: "px",
          viewportWidth: 1920,
          unitPrecision: 5,
          propList: ["width", "padding"], // 只转换 width/height
          viewportUnit: "vw",
          selectorBlackList: ["ignore-vw"],
          minPixelValue: 1,
          mediaQuery: false,
          replace: true,
          exclude: [/node_modules/, /uni_modules/],
        }),

          // px 转 vh（只转换 height）
          postcssPxToViewport({
            unitToConvert: "px",
            viewportWidth: 1200, // ⚠️ 这里换成 1200，模拟 viewportHeight
            unitPrecision: 5,
            propList: ["height", "min-height", "line-height", "row-gap", "column-gap", "margin-top"], // 只转换 height
            viewportUnit: "vh",
            selectorBlackList: ["ignore-vh"],
            minPixelValue: 1,
            mediaQuery: false,
            replace: true,
            exclude: [/node_modules/, /uni_modules/],
          }),

        // px 转 rem（只转换 font-size）
        postcssPxtorem({
          rootValue: 192, // 让 1rem = 192px
          unitPrecision: 5,
          propList: ["font-size"], // 只转换 font-size
          selectorBlackList: ["ignore-rem"],
          replace: true,
          mediaQuery: false,
          minPixelValue: 1,
          exclude: [/node_modules/, /uni_modules/],
        }),
      ],
    },
  }
})
