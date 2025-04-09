import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import LayoutCom from "./components/Layout.vue";

// 引入 Pinia
import { setupStore } from './store';

export function createApp() {
	const app = createSSRApp(App);
	// 注册全局组件
	app.component('LayoutCom', LayoutCom);

	setupStore(app)

	return {
		app,
	};
}