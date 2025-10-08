import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLotteryStore = defineStore('lottery', () => {
  // 狀態定義
  const participants = ref([])
  const winner = ref('')
  const drawnParticipants = ref([]) // 已經抽過的參與者
  const isLoading = ref(false)
  const error = ref(null)

  // 設定參與者名單
  const setParticipants = (names) => {
    participants.value = names.filter(name => name && name.trim() !== '')
    drawnParticipants.value = []
    winner.value = ''
  }

  // 抽籤 action
  const drawLottery = () => {
    // 取得尚未被抽到的參與者
    const availableParticipants = participants.value.filter(
      name => !drawnParticipants.value.includes(name)
    )

    if (availableParticipants.length === 0) {
      error.value = '所有參與者都已經被抽過了！'
      return null
    }

    // 使用 Fisher-Yates 演算法隨機選擇
    const randomIndex = Math.floor(Math.random() * availableParticipants.length)
    const selectedWinner = availableParticipants[randomIndex]

    // 更新狀態
    winner.value = selectedWinner
    drawnParticipants.value.push(selectedWinner)
    error.value = null

    return selectedWinner
  }

  // 重置抽籤
  const reset = () => {
    drawnParticipants.value = []
    winner.value = ''
    error.value = null
  }

  // 重新載入參與者
  const reload = () => {
    participants.value = []
    drawnParticipants.value = []
    winner.value = ''
    error.value = null
  }

  return {
    // 狀態
    participants,
    winner,
    drawnParticipants,
    isLoading,
    error,
    // Actions
    setParticipants,
    drawLottery,
    reset,
    reload
  }
})
