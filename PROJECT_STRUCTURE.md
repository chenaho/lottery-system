# 專案檔案結構

```
lottery-system/
│
├── .github/                        # GitHub 相關設定
│   ├── workflows/
│   │   └── deploy.yml             # GitHub Actions 自動部署
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md          # Bug 回報模板
│   │   └── feature_request.md     # 功能請求模板
│   └── pull_request_template.md   # PR 模板
│
├── public/                         # 靜態資源
│   └── favicon.ico
│
├── src/                            # 原始碼目錄
│   ├── components/                # Vue 組件
│   │   └── Lottery.vue           # 主要抽籤組件
│   │
│   ├── services/                  # 服務層
│   │   └── googleSheets.js       # Google Sheets API 服務
│   │
│   ├── stores/                    # Pinia 狀態管理
│   │   └── lottery.js            # 抽籤狀態管理
│   │
│   ├── App.vue                    # 根組件
│   ├── main.js                    # 應用程式入口
│   └── style.css                  # 全域樣式
│
├── .env.example                    # 環境變數範例
├── .gitignore                      # Git 忽略檔案
├── CONTRIBUTING.md                 # 貢獻指南
├── GITHUB_SETUP.md                 # GitHub 設定指南
├── LICENSE                         # MIT 授權
├── README.md                       # 專案說明
├── index.html                      # HTML 入口
├── init-git.sh                     # Git 初始化腳本
├── package.json                    # NPM 設定
├── package-lock.json               # NPM 鎖定版本
└── vite.config.js                  # Vite 建置設定
```

## 核心文件說明

### 原始碼 (src/)

#### 組件 (components/)
- **Lottery.vue**: 主要抽籤組件
  - Google Sheets 設定介面
  - 參與者名單顯示
  - 抽籤邏輯與動畫
  - 自動更新功能
  - 已抽出名單管理

#### 服務 (services/)
- **googleSheets.js**: Google Sheets API 整合
  - 解析 Google Sheets URL
  - 取得工作表資料
  - 提取特定欄位資料
  - 錯誤處理

#### 狀態管理 (stores/)
- **lottery.js**: Pinia Store
  - 參與者名單管理
  - 抽籤邏輯
  - 已抽出記錄
  - 狀態重置

### GitHub 設定 (.github/)

#### Workflows
- **deploy.yml**: 自動部署到 GitHub Pages
  - 觸發條件: push to main
  - 建置步驟: npm ci → npm run build
  - 部署到 GitHub Pages

#### Issue Templates
- **bug_report.md**: 標準化的 Bug 回報格式
- **feature_request.md**: 功能建議模板

#### PR Template
- **pull_request_template.md**: Pull Request 標準格式

### 設定文件

#### .gitignore
忽略的檔案類型：
- node_modules/
- dist/
- .env
- .DS_Store
- *.log

#### vite.config.js
- Vue 插件設定
- GitHub Pages base path 設定
- 建置優化

#### package.json
依賴套件：
- vue: ^3.4.0
- pinia: ^2.1.7
- axios: ^1.6.0
- vite: ^5.0.0
- @vitejs/plugin-vue: ^5.0.0

### 文檔文件

#### README.md
- 專案介紹
- 功能特色
- 安裝與使用指南
- API 文檔
- 疑難排解

#### CONTRIBUTING.md
- 貢獻指南
- 程式碼風格
- Commit 訊息規範
- PR 流程

#### GITHUB_SETUP.md
- GitHub Repository 建立步驟
- GitHub Pages 設定
- 自動部署流程
- 常見問題

#### LICENSE
- MIT 授權條款

### 輔助腳本

#### init-git.sh
- 自動初始化 Git repository
- 第一次 commit
- 提供後續步驟指引

## 技術架構

### 前端框架
- **Vue 3**: Composition API
- **Pinia**: 狀態管理
- **Vite**: 建置工具

### 樣式
- 原生 CSS
- CSS Grid & Flexbox
- CSS 動畫與過渡效果

### API 整合
- Google Sheets JSON API
- Axios HTTP 客戶端

### 部署
- GitHub Actions
- GitHub Pages
- 自動化 CI/CD

## 開發工作流程

1. **本地開發**: `npm run dev`
2. **提交變更**: Git commit
3. **推送到 GitHub**: Git push
4. **自動部署**: GitHub Actions
5. **線上更新**: GitHub Pages

## 資料流程

```
Google Sheets (公開)
    ↓
Google Sheets API
    ↓
Axios (HTTP 請求)
    ↓
googleSheets.js (解析)
    ↓
Pinia Store (狀態管理)
    ↓
Lottery.vue (UI 顯示)
    ↓
使用者互動
```

## 狀態管理流程

```
載入名單 → setParticipants()
    ↓
participants[] (所有參與者)
    ↓
點擊抽籤 → drawLottery()
    ↓
隨機選擇 (Fisher-Yates)
    ↓
winner (中獎者)
drawnParticipants[] (已抽出)
    ↓
UI 更新與動畫
```

## 自動更新機制

```
開啟自動更新
    ↓
每 5 秒執行
    ↓
checkAndUpdateParticipants()
    ↓
比較新舊名單
    ↓
有變更? → 更新 + 保留已抽出記錄
無變更? → 繼續等待
```

---

最後更新: 2025年10月9日
