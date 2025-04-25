<template>
  <div class="home-page">
    <!-- 导航栏 -->
    <nav class="nav" :class="{ 'nav-scrolled': isScrolled }">
      <div class="nav-container">
        <div class="logo">
          <img src="" alt="CTS Logo" class="placeholder-image">
        </div>
        <!-- 移动端菜单按钮 -->
        <div class="menu-toggle" @click="toggleMenu">
          <div class="hamburger" :class="{ 'active': isMenuOpen }">
            <span>1</span>
            <span>2</span>
            <span>3</span>
          </div>
        </div>
        <!-- 导航链接 -->
        <div class="nav-links" :class="{ 'active': isMenuOpen }">
          <a v-for="(link, index) in navLinks" 
             :key="index" 
             :href="link.href" 
             :class="{ active: currentSection === link.section }"
             @click="handleNavClick(link.section)">
            {{ link.text }}
          </a>
        </div>
        <div class="nav-right" :class="{ 'active': isMenuOpen }">
          <div class="email">
            <img src="" alt="Email" class="placeholder-icon">
            <span>info@cts888.ai</span>
          </div>
          <div class="language" @click="toggleLanguage">
            <span>{{ currentLanguage }}</span>
            <img src="" alt="Language" class="placeholder-icon">
          </div>
        </div>
      </div>
    </nav>

    <!-- Banner区域 -->
    <section class="banner" ref="banner">
      <div class="banner-content" :class="{ 'animate-in': isBannerVisible }">
        <h1 class="title">驅動未來</h1>
        <p class="subtitle">賭場AI智能管理系統,開啟賭場智能管理新時代！</p>
        <h2 class="subtitle-2">領導變革</h2>
        <p class="description">全球最廣泛的獎池配置選擇</p>
        <button class="cta-button" @click="scrollToSection('products')">
          <span>了解更多</span>
          <img src="" alt="Arrow" class="placeholder-icon">
        </button>
      </div>
    </section>

    <!-- 产品展示区域 -->
    <section class="products" ref="products">
      <h2 class="section-title" :class="{ 'animate-in': isProductsVisible }">我們的產品</h2>
      <div class="product-cards">
        <div v-for="(product, index) in products" 
             :key="index" 
             class="product-card"
             :class="{ 'animate-in': isProductsVisible }"
             :style="{ 'animation-delay': `${index * 0.2}s` }"
             @mouseenter="hoverProduct(index)"
             @mouseleave="unhoverProduct(index)">
          <div class="card-image"></div>
          <div class="card-content">
            <h3>{{ product.title }}</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- 视频展示区域 -->
    <section class="video-section" ref="video">
      <h2 class="section-title" :class="{ 'animate-in': isVideoVisible }">觀看我們智能桌台的實際應用</h2>
      <div class="video-container">
        <div class="video-placeholder" @click="playVideo"></div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer" ref="footer">
      <div class="footer-content">
        <div class="footer-nav">
          <div class="nav-column">
            <h4 v-for="(link, index) in footerLinks" 
                :key="index"
                @click="scrollToSection(link.section)">
              {{ link.text }}
            </h4>
            <ul>
              <li v-for="(product, index) in products" 
                  :key="index"
                  @click="scrollToSection('products')">
                {{ product.title }}
              </li>
            </ul>
          </div>
        </div>
        <div class="contact-info">
          <h3>联系方式</h3>
          <div v-for="(contact, index) in contacts" 
               :key="index" 
               class="contact-item"
               :class="{ 'animate-in': isFooterVisible }"
               :style="{ 'animation-delay': `${index * 0.1}s` }">
            <div class="contact-icons">
              <img src="" alt="Telegram" class="placeholder-icon" @click="openTelegram(contact.telegram)">
              <img src="" alt="WhatsApp" class="placeholder-icon" @click="openWhatsApp(contact.whatsapp)">
            </div>
            <span>{{ contact.phone }}</span>
            <div class="qr-codes">
              <img src="" alt="QR Code" class="placeholder-qr" v-for="(qr, qrIndex) in contact.qrCodes" :key="qrIndex">
            </div>
          </div>
          <div class="address" :class="{ 'animate-in': isFooterVisible }">
            <img src="" alt="Location" class="placeholder-icon">
            <p>地址：香港灣仔区轩尼詩道253-261號依時商業大厦1801室<br>Rm.1801,Easey Comm.Bldg., 253-261 Hennessy Road,<br>Wanchai, Hong Kong.</p>
          </div>
          <div class="email" :class="{ 'animate-in': isFooterVisible }">
            <img src="" alt="Email" class="placeholder-icon">
            <span>info@cts888.ai</span>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© CASINO MANAGEMENT SYSTEM 2025. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 导航数据
const navLinks = [
  { text: '首页', href: '#', section: 'banner' },
  { text: '關於', href: '#', section: 'about' },
  { text: '產品', href: '#', section: 'products' },
  { text: '聯繫我們', href: '#', section: 'footer' }
]

// 产品数据
const products = [
  { title: 'CTS賭場智能整體解決方案' },
  { title: 'CTS集成式彩金系統' },
  { title: 'AI桌台智能監控' }
]

// 页脚链接
const footerLinks = [
  { text: '首页', section: 'banner' },
  { text: '关于我们', section: 'about' },
  { text: '产品', section: 'products' },
  { text: '联系我们', section: 'footer' }
]

// 联系方式数据
const contacts = [
  {
    phone: '+853 63415118',
    telegram: '63415118',
    whatsapp: '63415118',
    qrCodes: [1, 2]
  },
  {
    phone: '+853 62170986',
    telegram: '62170986',
    whatsapp: '62170986',
    qrCodes: [3, 4]
  },
  {
    phone: '+855 67866828',
    telegram: '67866828',
    whatsapp: '67866828',
    qrCodes: [5, 6]
  }
]

// 状态变量
const isScrolled = ref(false)
const currentSection = ref('banner')
const currentLanguage = ref('繁体中文')
const isBannerVisible = ref(false)
const isProductsVisible = ref(false)
const isVideoVisible = ref(false)
const isFooterVisible = ref(false)

// 添加菜单状态
const isMenuOpen = ref(false)

// 滚动监听
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
  
  // 检查各个部分的可见性
  const banner = document.querySelector('.banner')
  const products = document.querySelector('.products')
  const video = document.querySelector('.video-section')
  const footer = document.querySelector('.footer')
  
  if (banner) {
    const rect = banner.getBoundingClientRect()
    isBannerVisible.value = rect.top < window.innerHeight * 0.8
  }
  
  if (products) {
    const rect = products.getBoundingClientRect()
    isProductsVisible.value = rect.top < window.innerHeight * 0.8
  }
  
  if (video) {
    const rect = video.getBoundingClientRect()
    isVideoVisible.value = rect.top < window.innerHeight * 0.8
  }
  
  if (footer) {
    const rect = footer.getBoundingClientRect()
    isFooterVisible.value = rect.top < window.innerHeight * 0.8
  }
}

// 滚动到指定部分
const scrollToSection = (section) => {
  const element = document.querySelector(`.${section}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    currentSection.value = section
  }
}

// 切换语言
const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === '繁体中文' ? 'English' : '繁体中文'
}

// 产品卡片悬停效果
const hoverProduct = (index) => {
  const card = document.querySelectorAll('.product-card')[index]
  if (card) {
    card.style.transform = 'translateY(-10px)'
    card.style.boxShadow = '0 10px 20px rgba(195, 24, 31, 0.3)'
  }
}

const unhoverProduct = (index) => {
  const card = document.querySelectorAll('.product-card')[index]
  if (card) {
    card.style.transform = 'translateY(0)'
    card.style.boxShadow = 'none'
  }
}

// 打开社交链接
const openTelegram = (username) => {
  window.open(`https://t.me/${username}`, '_blank')
}

const openWhatsApp = (number) => {
  window.open(`https://wa.me/${number}`, '_blank')
}

// 播放视频
const playVideo = () => {
  // 这里添加视频播放逻辑
}

// 处理导航点击
const handleNavClick = (section) => {
  scrollToSection(section)
  isMenuOpen.value = false
}

// 切换菜单
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// 监听窗口大小变化
const handleResize = () => {
  if (window.innerWidth > 768) {
    isMenuOpen.value = false
  }
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
  handleScroll() // 初始检查
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.home-page {
  width: 100%;
  min-height: 100vh;
  background-color: #000;
  color: #fff;
}

/* 导航栏样式 */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #000;
  z-index: 1000;
}

.nav-container {
  max-width: 1920px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo img {
  height: 40px;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-links a {
  color: #fff;
  text-decoration: none;
  font-size: 20px;
  padding: 10px;
}

.nav-links a.active {
  color: #FF000A;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.email, .language {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Banner区域样式 */
.banner {
  height: 100vh;
  background: linear-gradient(180deg, #000 0%, #0F101C 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-content {
  max-width: 1920px;
  width: 100%;
  padding: 0 20px;
  text-align: center;
}

.title {
  font-size: 80px;
  font-weight: 600;
  margin-bottom: 20px;
  background: linear-gradient(180deg, #FFFFFF 60%, #999999 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 32px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 20px;
}

.subtitle-2 {
  font-size: 80px;
  font-weight: 600;
  margin-bottom: 20px;
  background: linear-gradient(180deg, #FF071F 60%, #8C000D 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.description {
  font-size: 32px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 40px;
}

.cta-button {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 36px;
  background: #000;
  border: 1px solid #C3181F;
  border-radius: 48px;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
}

/* 产品展示区域样式 */
.products {
  padding: 100px 20px;
  max-width: 1920px;
  margin: 0 auto;
}

.section-title {
  font-size: 80px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 60px;
}

.product-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.product-card {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #C3181F;
  border-radius: 4px;
  overflow: hidden;
}

.card-image {
  height: 300px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px dashed rgba(255, 255, 255, 0.3);
  background-size: cover;
  background-position: center;
}

.card-content {
  padding: 32px;
  text-align: center;
}

.card-content h3 {
  font-size: 32px;
  line-height: 1.4;
}

/* 视频展示区域样式 */
.video-section {
  padding: 100px 20px;
  max-width: 1920px;
  margin: 0 auto;
}

.video-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 宽高比 */
}

.video-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px dashed rgba(255, 255, 255, 0.3);
}

/* 页脚样式 */
.footer {
  background-color: #000;
  padding: 100px 20px 20px;
}

.footer-content {
  max-width: 1920px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 60px;
}

.footer-nav {
  width: 544px;
}

.nav-column h4 {
  font-size: 20px;
  margin-bottom: 25px;
}

.nav-column ul {
  list-style: none;
  padding: 0;
  margin: 0 0 25px 0;
}

.nav-column li {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 10px;
}

.contact-info {
  flex: 1;
}

.contact-info h3 {
  font-size: 20px;
  margin-bottom: 40px;
}

.contact-item {
  margin-bottom: 40px;
}

.contact-icons {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.contact-icons img {
  width: 44px;
  height: 44px;
  border: 1px solid #fff;
  border-radius: 28px;
  padding: 12px;
}

.qr-codes {
  display: flex;
  gap: 24px;
  margin-top: 16px;
}

.qr-codes img {
  width: 100px;
  height: 100px;
  border-radius: 2px;
}

.address, .email {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.address p {
  font-size: 14px;
  line-height: 1.4;
}

.footer-bottom {
  max-width: 1920px;
  margin: 60px auto 0;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
}

.footer-bottom p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .product-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .nav-links, .nav-right {
    position: fixed;
    top: 80px;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.95);
    padding: 20px;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
  }

  .nav-links.active, .nav-right.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-links {
    top: 80px;
  }

  .nav-right {
    top: 300px;
  }

  .nav-container {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .nav-links a {
    font-size: 24px;
    padding: 15px 0;
  }

  .email, .language {
    font-size: 18px;
  }

  .nav-right {
    flex-direction: column;
    gap: 20px;
  }

  .banner {
    padding-top: 80px;
  }

  .banner-content {
    padding: 0 20px;
  }

  .title, .subtitle-2 {
    font-size: 36px;
  }

  .subtitle, .description {
    font-size: 20px;
  }

  .cta-button {
    font-size: 18px;
    padding: 12px 24px;
  }

  .section-title {
    font-size: 36px;
  }

  .product-card {
    margin-bottom: 20px;
  }

  .card-content h3 {
    font-size: 24px;
  }

  .footer {
    padding: 60px 20px 20px;
  }

  .footer-content {
    flex-direction: column;
    gap: 40px;
  }

  .footer-nav {
    width: 100%;
  }

  .nav-column h4 {
    font-size: 18px;
  }

  .nav-column li {
    font-size: 16px;
  }

  .contact-info h3 {
    font-size: 18px;
  }

  .contact-item {
    margin-bottom: 30px;
  }

  .qr-codes {
    gap: 15px;
  }

  .qr-codes img {
    width: 80px;
    height: 80px;
  }
}

/* 占位图片样式 */
.placeholder-image {
  width: 200px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px dashed rgba(255, 255, 255, 0.3);
}

.placeholder-icon {
  width: 24px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 50%;
}

.placeholder-qr {
  width: 100px;
  height: 100px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px dashed rgba(255, 255, 255, 0.3);
}

.card-image {
  height: 300px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px dashed rgba(255, 255, 255, 0.3);
  background-size: cover;
  background-position: center;
}

.video-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px dashed rgba(255, 255, 255, 0.3);
}

/* 移动端菜单按钮样式 */
.menu-toggle {
  display: none;
  cursor: pointer;
  padding: 10px;
  z-index: 1001;
}

.hamburger {
  width: 30px;
  height: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background-color: #fff;
  transition: all 0.3s ease;
}

.hamburger.active span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

/* 添加过渡效果 */
.nav-links a, .nav-right {
  transition: all 0.3s ease;
}

.nav-links a:hover {
  transform: translateY(-2px);
  color: #FF000A;
}
</style>
