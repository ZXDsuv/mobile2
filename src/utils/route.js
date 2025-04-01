export function navigateTo(url) {
    const token = uni.getStorageSync('uni-token')
    if (!token && url !== '/pages/login/login') {
      uni.reLaunch({ url: '/pages/login/index' }) // 强制跳转
      return
    }
    uni.navigateTo({ url })
  }
  