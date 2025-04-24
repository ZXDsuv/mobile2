import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import LayoutCom from "./components/Layout.vue";
// 多语言
// import {i18n} from './locale/index'; // 引入vue-i18n组件


// 引入 Pinia
import { setupStore } from './store';

export function createApp() {
	const app = createSSRApp(App);
	// 注册全局组件
	app.component('LayoutCom', LayoutCom);
	setupStore(app)
	// app.use(i18n) // 注册i18n实例

	return {
		app,
	};
}