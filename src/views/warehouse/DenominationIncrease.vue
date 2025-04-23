<template>
  <div class="denomination-increase">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="logo">
        <img src="" alt="logo" class="logo-img">
        <span class="title">Simple Information Management·大账房</span>
      </div>
      <div class="user-info">
        <div class="service-point">
          <img src="" alt="icon" class="icon">
          <span>未绑定服务点</span>
        </div>
        <div class="service-point">
          <img src="" alt="icon" class="icon">
          <span>服务点名字</span>
        </div>
        <div class="actions">
          <div class="action-item">
            <img src="" alt="mode" class="icon">
          </div>
          <div class="action-item">
            <img src="" alt="download" class="icon">
          </div>
          <div class="action-item">
            <img src="" alt="message" class="icon">
            <span class="badge"></span>
          </div>
          <div class="action-item">
            <img src="" alt="language" class="icon">
          </div>
          <div class="action-item">
            <img src="" alt="logout" class="icon">
          </div>
        </div>
        <div class="avatar">
          <img src="" alt="avatar" class="avatar-img">
          <span>rch11111o</span>
        </div>
      </div>
    </div>

    <!-- 导航路径 -->
    <div class="nav-path">
      <div class="back">
        <img src="" alt="back" class="icon">
      </div>
      <div class="path">
        <span class="home">首页</span>
        <span class="separator">/</span>
        <span class="warehouse">仓库</span>
        <span class="separator">/</span>
        <span class="current">入库</span>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 币种选择 -->
      <div class="section">
        <div class="section-header">
          <span class="label">币种</span>
          <img src="" alt="info" class="info-icon">
        </div>
        <div class="currency-options">
          <div class="option" :class="{ active: selectedCurrency === 'RMB' }" @click="selectedCurrency = 'RMB'">
            RMB
          </div>
          <div class="option" :class="{ active: selectedCurrency === 'TWD' }" @click="selectedCurrency = 'TWD'">
            TWD
          </div>
        </div>
      </div>

      <!-- 筹码类型选择 -->
      <div class="section">
        <div class="section-header">
          <span class="label">筹码类型</span>
          <img src="" alt="info" class="info-icon">
        </div>
        <div class="chip-type-options">
          <div class="option" :class="{ active: selectedChipType === 'RMB' }" @click="selectedChipType = 'RMB'">
            RMB
          </div>
          <div class="option" :class="{ active: selectedChipType === 'TWD' }" @click="selectedChipType = 'TWD'">
            TWD
          </div>
        </div>
      </div>

      <!-- 面额选择 -->
      <div class="section">
        <div class="section-header">
          <span class="label">面额选择</span>
          <img src="" alt="info" class="info-icon">
          <span class="hint">请选择筹码面额</span>
        </div>
        <div class="denomination-grid">
          <div v-for="(denomination, index) in denominations" 
               :key="index"
               class="denomination-item"
               :class="{ selected: selectedDenomination === denomination }"
               @click="selectedDenomination = denomination">
            <div class="chip">
              <img src="" alt="chip" class="chip-img">
              <span class="value">{{ denomination }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="action-buttons">
        <button class="btn cancel">取消</button>
        <button class="btn next">下一步</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedCurrency = ref('RMB')
const selectedChipType = ref('RMB')
const selectedDenomination = ref('')
const denominations = ['0.5', '1', '5', '10', '20', '50', '100', '500', '1000', '5000', '10000']
</script>

<style scoped>
.denomination-increase {
  width: 100%;
  min-height: 100vh;
  background: #000000;
  color: #FFFFFF;
  padding: 20px;
  font-family: 'PingFang SC', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.title {
  font-size: 24px;
  font-weight: 500;
  background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.6) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.service-point {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 1px 12px;
  background: #2C2832;
  border: 1px solid #413E47;
  border-radius: 48px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.actions {
  display: flex;
  gap: 12px;
}

.action-item {
  position: relative;
  width: 40px;
  height: 40px;
  background: #2C2832;
  border: 1px solid #413E47;
  border-radius: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.action-item:hover {
  background: #413E47;
}

.badge {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: #F53F3F;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(245, 63, 63, 0.5);
}

.avatar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-path {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 20px;
  padding: 0 20px;
}

.back {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back:hover {
  background: rgba(255, 255, 255, 0.2);
}

.path {
  display: flex;
  align-items: center;
  gap: 8px;
}

.separator {
  color: rgba(255, 255, 255, 0.4);
  font-size: 20px;
}

.home, .warehouse {
  color: rgba(255, 255, 255, 0.7);
  font-size: 20px;
  font-weight: 400;
}

.current {
  color: #FFFFFF;
  font-size: 24px;
  font-weight: 500;
}

.main-content {
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 9px;
}

.label {
  font-size: 20px;
  font-weight: 500;
  color: #FFFFFF;
}

.info-icon {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.hint {
  font-size: 14px;
  color: #F54E4E;
  margin-left: auto;
}

.currency-options,
.chip-type-options {
  display: flex;
  gap: 10px;
}

.option {
  flex: 1;
  padding: 12px 44px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  transition: all 0.3s ease;
}

.option:hover {
  background: rgba(255, 255, 255, 0.15);
}

.option.active {
  background: #715CFF;
  font-weight: 500;
}

.denomination-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 20px;
}

.denomination-item {
  width: 100px;
  height: 100px;
  padding: 13px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.denomination-item:hover {
  background: rgba(255, 255, 255, 0.15);
}

.denomination-item.selected {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #715CFF;
  box-shadow: 0 0 10px rgba(113, 92, 255, 0.3);
}

.chip {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chip-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.value {
  position: absolute;
  font-size: 20px;
  font-weight: 700;
  color: #FFFFFF;
  text-shadow: 0px 1px 0px rgba(0, 0, 0, 1);
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 20px;
}

.btn {
  padding: 10px 48px;
  border-radius: 52px;
  font-size: 20px;
  cursor: pointer;
  border: none;
  color: #FFFFFF;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel {
  background: linear-gradient(180deg, rgba(89, 64, 255, 0.1) 0%, rgba(255, 255, 255, 0.2) 100%);
}

.cancel:hover {
  background: linear-gradient(180deg, rgba(89, 64, 255, 0.2) 0%, rgba(255, 255, 255, 0.3) 100%);
}

.next {
  background: #5940FF;
}

.next:hover {
  background: #715CFF;
  box-shadow: 0 0 10px rgba(113, 92, 255, 0.5);
}
</style> 