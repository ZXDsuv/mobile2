export default {
	//app中大部分配置从全局配置接口中获取
	//请求接口
	// 生产
	// apiBaseUrl: "https://api.hsh666.net",
	// 宝塔
	apiBaseUrl: "http://192.168.88.250:5000/mobile",
	// 预生产
	// apiBaseUrl: "https://game-w1-api.166188.net",

	//启动加载图
	initLogo: "/static/loading.webp",
	
	//预加载启动图
	preLoadingLogo: "/static/loading-pre.png", 

	// 网站logo   
	siteLogo: "/static/siteLogo.png",

	//网站标题由后端配置, 后端不返回默认
	siteTitle: "游戏平台",

	// 默认语言
	defaultLanguage: 'vi',

	//登录窗口Logo
	loginLogo: "/static/init-text2.svg",

	// 充值接口成功页面链接前缀
	su_url: 'https://api.hsh666.net',
	
	// 点击音效
	clickAudio: "/static/click.mp3"
}