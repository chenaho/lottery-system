<template>
  <div class="lottery-container">
    <h1 class="title">🎉 抽籤系統 🎉</h1>

    <!-- Google Sheets 設定區 -->
    <div class="config-section" v-if="!isConfigured">
      <h2>Google Sheets 設定</h2>
      <div class="input-group">
        <label>Google Sheets 網址:</label>
        <input 
          v-model="sheetUrl" 
          type="text" 
          placeholder="貼上你的 Google Sheets 公開連結"
          class="input-field"
        />
      </div>
      <div class="input-row">
        <div class="input-group small">
          <label>欄位:</label>
          <input 
            v-model="columnLetter" 
            type="text" 
            placeholder="C"
            maxlength="2"
            class="input-field"
          />
        </div>
        <div class="input-group small">
          <label>起始列:</label>
          <input 
            v-model.number="startRow" 
            type="number" 
            placeholder="1"
            min="1"
            class="input-field"
          />
        </div>
      </div>
      <button @click="loadParticipants" class="btn btn-primary" :disabled="!sheetUrl">
        載入參與者名單
      </button>
      <p class="hint">請確保 Google Sheets 已設定為「知道連結的人都能查看」</p>
    </div>

    <!-- 抽籤主要介面 -->
    <div class="lottery-section" v-else>
      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">總參與人數:</span>
          <span class="stat-value">{{ lotteryStore.participants.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">已抽出:</span>
          <span class="stat-value">{{ lotteryStore.drawnParticipants.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">剩餘:</span>
          <span class="stat-value">{{ remainingCount }}</span>
        </div>
      </div>

      <!-- 參與者名單顯示 -->
      <div class="participants-list">
        <div class="list-header">
          <h3>📋 參與者名單</h3>
          <button @click="toggleParticipantsList" class="btn-toggle">
            {{ showParticipantsList ? '收起' : '展開' }}
          </button>
        </div>
        <div class="participants-items" v-show="showParticipantsList">
          <div 
            v-for="(name, index) in lotteryStore.participants" 
            :key="index"
            class="participant-item"
            :class="{ 'drawn': lotteryStore.drawnParticipants.includes(name) }"
          >
            <span class="participant-number">{{ index + 1 }}</span>
            <span class="participant-name">{{ name }}</span>
            <span v-if="lotteryStore.drawnParticipants.includes(name)" class="drawn-badge">已抽出</span>
          </div>
        </div>
      </div>

      <!-- 中獎者顯示 -->
      <div class="winner-container" v-if="lotteryStore.winner">
        <div class="winner-box" :class="{ 'fade-in': showWinner }">
          <div class="winner-label">🎊 中獎者 🎊</div>
          <div class="winner-name">{{ lotteryStore.winner }}</div>
        </div>
      </div>

      <!-- 抽籤按鈕 -->
      <button 
        @click="startDraw" 
        class="btn btn-draw" 
        :disabled="remainingCount === 0"
      >
        <span v-if="isDrawing">抽籤中...</span>
        <span v-else>{{ remainingCount > 0 ? '開始抽籤' : '已全部抽完' }}</span>
      </button>

      <!-- 錯誤訊息 -->
      <div class="error-message" v-if="lotteryStore.error">
        {{ lotteryStore.error }}
      </div>

      <!-- 控制按鈕 -->
      <div class="control-buttons">
        <button @click="resetDraw" class="btn btn-secondary">
          重置抽籤
        </button>
        <button @click="reloadSheet" class="btn btn-secondary">
          重新載入名單
        </button>
      </div>

      <!-- 已抽出名單 -->
      <div class="drawn-list" v-if="lotteryStore.drawnParticipants.length > 0">
        <h3>已抽出名單</h3>
        <div class="drawn-items">
          <div 
            v-for="(name, index) in lotteryStore.drawnParticipants" 
            :key="index"
            class="drawn-item"
          >
            <span class="drawn-number">{{ index + 1 }}</span>
            <span class="drawn-name">{{ name }}</span>
          </div>
        </div>
      </div>

      <!-- 自動更新設定 -->
      <div class="auto-update-section">
        <div class="auto-update-toggle">
          <label class="switch">
            <input type="checkbox" v-model="autoUpdateEnabled" @change="toggleAutoUpdate">
            <span class="slider"></span>
          </label>
          <div class="auto-update-info">
            <span class="auto-update-label">自動更新名單</span>
            <span class="auto-update-desc">每 5 秒檢查一次 Google Sheets 是否有更新</span>
          </div>
        </div>
        <div class="auto-update-status" v-if="autoUpdateEnabled">
          <span class="status-dot"></span>
          <span>下次更新: {{ nextUpdateCountdown }}秒</span>
          <span class="last-update" v-if="lastUpdateTime">
            (上次更新: {{ lastUpdateTime }})
          </span>
        </div>
      </div>
    </div>

    <!-- 載入中提示 -->
    <div class="loading" v-if="lotteryStore.isLoading">
      <div class="spinner"></div>
      <p>載入中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLotteryStore } from '../stores/lottery'
import { getColumnData } from '../services/googleSheets'

const lotteryStore = useLotteryStore()

// 設定狀態
const sheetUrl = ref('https://docs.google.com/spreadsheets/d/1FLiP_HsO-yOqo9GSHL8OCT37gGCCpU-uxucQYWFsEZM/edit?usp=sharing')
const columnLetter = ref('C')
const startRow = ref(1)
const isConfigured = ref(false)

// 抽籤動畫狀態
const isDrawing = ref(false)
const showWinner = ref(false)
const showParticipantsList = ref(true) // 預設展開參與者名單

// 自動更新相關狀態
const autoUpdateEnabled = ref(false)
const autoUpdateInterval = ref(null)
const nextUpdateCountdown = ref(5)
const countdownInterval = ref(null)
const lastUpdateTime = ref('')

// 計算剩餘人數
const remainingCount = computed(() => {
  return lotteryStore.participants.length - lotteryStore.drawnParticipants.length
})

// 載入參與者名單
const loadParticipants = async () => {
  try {
    lotteryStore.isLoading = true
    lotteryStore.error = null
    
    const names = await getColumnData(
      sheetUrl.value,
      columnLetter.value,
      startRow.value
    )
    
    if (names.length === 0) {
      throw new Error('未找到任何參與者資料，請檢查欄位設定')
    }
    
    lotteryStore.setParticipants(names)
    isConfigured.value = true
  } catch (error) {
    lotteryStore.error = error.message
    alert('載入失敗: ' + error.message)
  } finally {
    lotteryStore.isLoading = false
  }
}

// 開始抽籤
const startDraw = async () => {
  if (isDrawing.value) return
  
  isDrawing.value = true
  showWinner.value = false
  
  // 製造抽籤動畫效果
  await new Promise(resolve => setTimeout(resolve, 500))
  
  lotteryStore.drawLottery()
  
  isDrawing.value = false
  showWinner.value = true
}

// 切換參與者名單顯示
const toggleParticipantsList = () => {
  showParticipantsList.value = !showParticipantsList.value
}

// 重置抽籤
const resetDraw = () => {
  if (confirm('確定要重置抽籤嗎？所有已抽出的記錄將被清除。')) {
    lotteryStore.reset()
    showWinner.value = false
  }
}

// 重新載入名單
const reloadSheet = () => {
  if (confirm('確定要重新載入名單嗎？目前的抽籤記錄將被清除。')) {
    lotteryStore.reload()
    isConfigured.value = false
    showWinner.value = false
    stopAutoUpdate() // 停止自動更新
  }
}

// 檢查並更新參與者名單
const checkAndUpdateParticipants = async () => {
  try {
    const names = await getColumnData(
      sheetUrl.value,
      columnLetter.value,
      startRow.value
    )
    
    if (names.length === 0) {
      return
    }
    
    // 比較新舊名單
    const currentNames = lotteryStore.participants
    const hasChanges = names.length !== currentNames.length || 
                       !names.every((name, index) => name === currentNames[index])
    
    if (hasChanges) {
      // 保留已抽出的參與者資訊
      const drawnNames = [...lotteryStore.drawnParticipants]
      
      // 更新名單
      lotteryStore.setParticipants(names)
      
      // 恢復已抽出的狀態（只保留仍在新名單中的已抽出者）
      lotteryStore.drawnParticipants = drawnNames.filter(name => names.includes(name))
      
      // 更新時間
      const now = new Date()
      lastUpdateTime.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
      
      console.log('✅ 名單已更新', { 原本: currentNames.length, 現在: names.length })
    }
  } catch (error) {
    console.error('自動更新失敗:', error)
  }
}

// 開啟/關閉自動更新
const toggleAutoUpdate = () => {
  if (autoUpdateEnabled.value) {
    startAutoUpdate()
  } else {
    stopAutoUpdate()
  }
}

// 開始自動更新
const startAutoUpdate = () => {
  // 清除舊的計時器
  stopAutoUpdate()
  
  console.log('🔄 自動更新已開啟')
  
  // 重置倒數計時
  nextUpdateCountdown.value = 5
  
  // 每秒更新倒數計時
  countdownInterval.value = setInterval(() => {
    nextUpdateCountdown.value--
    if (nextUpdateCountdown.value <= 0) {
      nextUpdateCountdown.value = 5
    }
  }, 1000)
  
  // 每5秒檢查一次更新
  autoUpdateInterval.value = setInterval(async () => {
    await checkAndUpdateParticipants()
    nextUpdateCountdown.value = 5
  }, 5000)
}

// 停止自動更新
const stopAutoUpdate = () => {
  if (autoUpdateInterval.value) {
    clearInterval(autoUpdateInterval.value)
    autoUpdateInterval.value = null
  }
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
  console.log('⏸️ 自動更新已停止')
}

// 自動載入（如果已經有預設網址）
onMounted(() => {
  if (sheetUrl.value) {
    // 可以選擇自動載入或讓使用者手動載入
    // loadParticipants()
  }
})

// 組件卸載時清理計時器
onUnmounted(() => {
  stopAutoUpdate()
})
</script>

<style scoped>
.lottery-container {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #667eea;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

/* 設定區樣式 */
.config-section {
  max-width: 600px;
  margin: 0 auto;
}

.config-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
}

.input-row {
  display: flex;
  gap: 1rem;
}

.input-group.small {
  flex: 1;
}

.hint {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #666;
  text-align: center;
}

/* 統計資訊 */
.stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea15, #764ba215);
  border-radius: 12px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
}

/* 參與者名單 */
.participants-list {
  margin-bottom: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid #e9ecef;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.list-header h3 {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
}

.btn-toggle {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-toggle:hover {
  background: #5568d3;
  transform: translateY(-1px);
}

.participants-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
}

.participant-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.participant-item:hover {
  border-color: #667eea;
  transform: translateX(3px);
}

.participant-item.drawn {
  background: #e8eaf6;
  opacity: 0.6;
}

.participant-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  font-size: 0.875rem;
  font-weight: bold;
}

.participant-item.drawn .participant-number {
  background: #9e9e9e;
}

.participant-name {
  flex: 1;
  font-weight: 500;
  color: #333;
}

.participant-item.drawn .participant-name {
  text-decoration: line-through;
  color: #999;
}

.drawn-badge {
  font-size: 0.75rem;
  background: #ff9800;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
}

/* 中獎者顯示 */
.winner-container {
  margin: 2rem 0;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.winner-box {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.winner-box.fade-in {
  opacity: 1;
  transform: scale(1);
}

.winner-label {
  font-size: 1.5rem;
  color: white;
  margin-bottom: 1rem;
}

.winner-name {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
}

/* 按鈕樣式 */
.btn {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  width: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.btn-draw {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
  margin: 2rem 0;
  font-size: 1.5rem;
  padding: 1.5rem 3rem;
}

.btn-draw:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(245, 87, 108, 0.4);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.control-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

/* 自動更新區塊 */
.auto-update-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
  border-radius: 12px;
  border: 2px solid #b39ddb;
}

.auto-update-toggle {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auto-update-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.auto-update-label {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.auto-update-desc {
  font-size: 0.875rem;
  color: #666;
}

/* Toggle Switch 樣式 */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #667eea;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* 自動更新狀態 */
.auto-update-status {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #555;
}

.status-dot {
  width: 10px;
  height: 10px;
  background: #4caf50;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.last-update {
  margin-left: auto;
  color: #999;
  font-size: 0.8rem;
}

/* 錯誤訊息 */
.error-message {
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: center;
}

/* 已抽出名單 */
.drawn-list {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
}

.drawn-list h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #333;
}

.drawn-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.drawn-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8f8f8;
  border-radius: 8px;
  transition: background 0.3s;
}

.drawn-item:hover {
  background: #ececec;
}

.drawn-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  font-size: 0.875rem;
  font-weight: bold;
}

.drawn-name {
  font-weight: 500;
  color: #333;
}

/* 載入中 */
.loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading p {
  color: white;
  margin-top: 1rem;
  font-size: 1.25rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .lottery-container {
    padding: 1.5rem;
  }

  .title {
    font-size: 2rem;
  }

  .winner-name {
    font-size: 2rem;
  }

  .stats {
    flex-direction: column;
    gap: 1rem;
  }

  .participants-items {
    grid-template-columns: 1fr;
    max-height: 250px;
  }

  .list-header {
    flex-direction: row;
  }

  .list-header h3 {
    font-size: 1.125rem;
  }

  .drawn-items {
    grid-template-columns: 1fr;
  }

  .control-buttons {
    flex-direction: column;
  }

  .auto-update-toggle {
    flex-direction: row;
    align-items: flex-start;
  }

  .auto-update-status {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .last-update {
    margin-left: 0;
  }

  .input-row {
    flex-direction: column;
  }
}
</style>
