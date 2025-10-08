# 🎉 Vue 3 抽籤系統
- 🔄 自動更新功能：每 5 秒檢查 Google Sheets 是否有更新
- ♻️ 可重置抽籤或重新載入名單
- 📱 響應式設計，支援各種螢幕尺寸

## 🎮 線上 Demo

👉 [立即體驗](https://YOUR_USERNAME.github.io/lottery-system/)

## 🚀 快速開始

### 1. Clone 專案

```bash
git clone https://github.com/YOUR_USERNAME/lottery-system.git
cd lottery-system
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

### 4. 建置生產版本 開發的抽籤系統，可從公開的 Google Sheets 讀取參與者名單進行抽籤。

[![GitHub Pages](https://img.shields.io/badge/demo-online-success?style=flat-square)](https://YOUR_USERNAME.github.io/lottery-system/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

## ✨ 功能特色

- 📊 從公開的 Google Sheets 讀取參與者名單
- 🎲 公平的隨機抽籤演算法（Fisher-Yates）
- 🎨 精美的 UI 介面與動畫效果
- 📝 記錄已抽出的參與者
- � 即時顯示參與者名單（可展開/收起）
- �🔄 自動更新功能：每 5 秒檢查 Google Sheets 是否有更新
- ♻️ 可重置抽籤或重新載入名單
- 📱 響應式設計，支援各種螢幕尺寸

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 啟動開發伺服器

```bash
npm run dev
```

### 3. 建置生產版本

```bash
npm run build
```

## 📋 Google Sheets 設定

### 步驟 1: 準備 Google Sheets

1. 建立一個 Google Sheets 試算表
2. 在特定欄位（例如 C 欄）輸入參與者名字
3. 從第 2 列開始輸入資料（第 1 列通常是標題）

### 步驟 2: 設定分享權限

1. 點擊右上角的「分享」按鈕
2. 選擇「知道連結的人都能查看」
3. 複製分享連結

### 步驟 3: 在抽籤系統中使用

1. 開啟抽籤系統
2. 貼上 Google Sheets 連結
3. 設定欄位字母（預設: C）和起始列（預設: 2）
4. 點擊「載入參與者名單」

## 🎯 使用方式

### 基本流程

1. **載入名單**: 輸入 Google Sheets 網址並載入參與者
2. **開始抽籤**: 點擊「開始抽籤」按鈕進行抽籤
3. **查看結果**: 中獎者會以動畫方式顯示
4. **重複抽籤**: 可繼續抽籤直到所有人都被抽完
5. **重置**: 需要時可重置抽籤記錄

### 進階功能

- **參與者名單顯示**: 載入後可查看所有參與者，已抽出的會自動標記
- **自動更新名單**: 開啟後每 5 秒自動檢查 Google Sheets 是否有新增/移除參與者
  - 即時同步最新名單
  - 保留已抽出的記錄（若該參與者仍在新名單中）
  - 顯示倒數計時和上次更新時間
- **重置抽籤**: 清除所有已抽出記錄，重新開始
- **重新載入名單**: 從 Google Sheets 重新讀取資料
- **已抽出名單**: 顯示所有已抽出的參與者及順序

## 🛠️ 技術架構

### 技術棧

- **Vue 3**: 使用 Composition API
- **Pinia**: 狀態管理
- **Axios**: HTTP 請求
- **Vite**: 建置工具

### 專案結構

```
lottery-system/
├── src/
│   ├── components/
│   │   └── Lottery.vue          # 主要抽籤元件
│   ├── stores/
│   │   └── lottery.js           # Pinia Store
│   ├── services/
│   │   └── googleSheets.js      # Google Sheets API 服務
│   ├── App.vue                  # 根元件
│   ├── main.js                  # 應用程式入口
│   └── style.css                # 全域樣式
├── index.html
├── vite.config.js
└── package.json
```

## 📚 核心概念

### Pinia Store

使用 Pinia 管理應用程式狀態：

- `participants`: 所有參與者名單
- `winner`: 當前中獎者
- `drawnParticipants`: 已抽出的參與者
- `drawLottery()`: 執行抽籤的 action

### Google Sheets API

利用 Google Sheets 的公開 JSON API：

```javascript
// API 格式
https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid={GID}
```

### 隨機演算法

使用 Fisher-Yates 洗牌演算法確保公平性：

```javascript
const randomIndex = Math.floor(Math.random() * availableParticipants.length)
```

## 🎨 自訂樣式

可以修改 `src/components/Lottery.vue` 中的 `<style>` 部分來自訂樣式：

- 顏色主題
- 動畫效果
- 按鈕樣式
- 版面配置

## ⚠️ 注意事項

1. **Google Sheets 權限**: 必須設定為「知道連結的人都能查看」
2. **資料格式**: 確保欄位中沒有空白列
3. **瀏覽器相容性**: 建議使用現代瀏覽器（Chrome, Firefox, Safari, Edge）
4. **CORS**: Google Sheets API 支援跨域請求，無需額外設定

## 🔧 疑難排解

### 無法載入 Google Sheets 資料

- 檢查 Google Sheets 是否設定為公開
- 確認網址格式正確
- 檢查欄位字母和起始列設定

### 抽籤結果重複

- 系統會自動排除已抽出的參與者
- 如需重新抽籤，請使用「重置抽籤」功能

## 📝 範例 Google Sheets

您的範例連結：
```
https://docs.google.com/spreadsheets/d/1Wa-XF5D5ntCjo1BYIfZYzx9KZQ-6bq-o44uYaDE7ROo/edit?usp=sharing
```

確保此試算表：
- 已設定為公開
- C 欄包含參與者名字
- 從第 2 列開始有資料

## � 部署到 GitHub Pages

詳細的部署指南請參考 [GITHUB_SETUP.md](GITHUB_SETUP.md)

### 快速部署步驟

1. **初始化 Git**
   ```bash
   chmod +x init-git.sh
   ./init-git.sh
   ```

2. **建立 GitHub Repository**
   - 前往 GitHub 建立新的 repository

3. **推送到 GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/lottery-system.git
   git branch -M main
   git push -u origin main
   ```

4. **啟用 GitHub Pages**
   - 前往 Repository Settings > Pages
   - Source 選擇 "GitHub Actions"
   - 等待自動部署完成

您的網站將發布在：`https://YOUR_USERNAME.github.io/lottery-system/`

## 🤝 貢獻

歡迎貢獻！請查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何參與專案。

### 貢獻者

感謝所有為這個專案做出貢獻的人！

## 📄 授權

本專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 檔案

## 👨‍💻 開發者

由專業全端工程師使用 Vue 3 開發

## 🌟 Star History

如果這個專案對您有幫助，請給個 ⭐️ 支持一下！

## 📞 聯絡方式

- 📧 Email: your-email@example.com
- 💬 Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/lottery-system/issues)

---

如有問題或建議，歡迎提出 Issue！
