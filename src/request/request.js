


export const getUrl = () => {
	return window.PROXY_CONFIG.VUE_APP_API_URL
}
function getToken() {
  return uni.getStorageSync('token')?.value
}

function getLang() {
	return uni.getStorageSync('chooseLanguage') 
}

export const baseRequest = async (url, method, data = {}, isGlobal = true) => {

	let header = isGlobal ? {
		'lang': getLang()
	} : {
		'Authorization': getToken() || '',
		'lang': getLang() 
	}
	console.log(header);
	return new Promise((reslove, reject) => {
		uni.request({
			url: getUrl() + url,
			method: method || 'GET',
			header: header,
			timeout: 10000,
			data: data || {},
			success: (successData) => {
				const res = successData.data
				if (successData.statusCode == 200) {
					// 业务逻辑，自行修改
					reslove(res)
				} else {
					reject(res)
				}
			},
			fail: (msg) => {
				reject(msg)
			}
		})
	})
}