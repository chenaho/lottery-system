# 部署疑難排解指南

## 🚨 常見問題：404 錯誤（資源無法載入）

### 問題描述
部署後出現以下錯誤：
```
GET https://luckydraw.chenaho.com/lottery-system/assets/index-xxx.css 404 (Not Found)
GET https://luckydraw.chenaho.com/lottery-system/assets/index-xxx.js 404 (Not Found)
```

### 原因分析
這是因為 `vite.config.js` 中的 `base` 路徑設定與實際部署環境不符。

## 🔧 解決方案

### 情況 1: 使用自訂網域（如 `luckydraw.chenaho.com`）

#### vite.config.js 設定
```javascript
export default defineConfig({
  plugins: [vue()],
  base: '/',  // ← 使用根路徑
})
```

#### 建置指令
```bash
npm run build
```

#### 部署後網址
```
✅ https://luckydraw.chenaho.com/
✅ https://luckydraw.chenaho.com/assets/index-xxx.css
```

---

### 情況 2: 使用 GitHub Pages 預設網域（如 `username.github.io/lottery-system/`）

#### vite.config.js 設定
```javascript
export default defineConfig({
  plugins: [vue()],
  base: '/lottery-system/',  // ← 使用 repository 名稱
})
```

#### 建置指令
```bash
npm run build
```

#### 部署後網址
```
✅ https://username.github.io/lottery-system/
✅ https://username.github.io/lottery-system/assets/index-xxx.css
```

---

## 🎯 目前的靈活配置

我們已經將 `vite.config.js` 更新為可透過環境變數控制：

### vite.config.js
```javascript
export default defineConfig({
  plugins: [vue()],
  base: process.env.VITE_BASE_PATH || '/',
})
```

### 使用方式

#### 方法 1: 建立 .env 檔案
```bash
# .env
VITE_BASE_PATH=/
```

#### 方法 2: 建置時指定
```bash
# 自訂網域
VITE_BASE_PATH=/ npm run build

# GitHub Pages 預設網域
VITE_BASE_PATH=/lottery-system/ npm run build
```

## 📋 完整部署步驟

### 步驟 1: 確認部署環境

**自訂網域** → 使用 `VITE_BASE_PATH=/`

**GitHub Pages 預設網域** → 使用 `VITE_BASE_PATH=/repository-name/`

### 步驟 2: 設定環境變數

建立或編輯 `.env` 檔案：
```bash
cp .env.example .env
```

編輯 `.env`：
```bash
# 自訂網域
VITE_BASE_PATH=/

# 或 GitHub Pages
# VITE_BASE_PATH=/lottery-system/
```

### 步驟 3: 建置專案
```bash
npm run build
```

### 步驟 4: 驗證建置結果

檢查 `dist/index.html` 中的資源路徑：

**自訂網域（正確）**：
```html
<script type="module" src="/assets/index-xxx.js"></script>
<link rel="stylesheet" href="/assets/index-xxx.css">
```

**GitHub Pages（正確）**：
```html
<script type="module" src="/lottery-system/assets/index-xxx.js"></script>
<link rel="stylesheet" href="/lottery-system/assets/index-xxx.css">
```

### 步驟 5: 部署

上傳 `dist/` 目錄到您的伺服器或 GitHub Pages。

## 🔍 驗證部署是否成功

### 檢查清單

- [ ] 網站可以正常開啟
- [ ] CSS 樣式正確載入（沒有樣式錯亂）
- [ ] JavaScript 正常執行
- [ ] 開發者工具 Console 沒有 404 錯誤
- [ ] 所有圖示和圖片正常顯示

### 測試步驟

1. **開啟網站**：訪問您的網域
2. **開啟開發者工具**：按 F12
3. **檢查 Console**：確認沒有紅色錯誤
4. **檢查 Network**：確認所有資源都是 200 狀態碼
5. **測試功能**：載入 Google Sheets、抽籤等功能

## 🆘 仍然有問題？

### 清除快取

```bash
# 清除 node_modules 和重新安裝
rm -rf node_modules package-lock.json
npm install

# 清除 dist 目錄
rm -rf dist

# 重新建置
npm run build
```

### 檢查 CNAME 設定

如果使用自訂網域，確保在 `public/CNAME` 檔案中設定：

```bash
# public/CNAME
luckydraw.chenaho.com
```

### 檢查 DNS 設定

確保您的網域 DNS 記錄指向正確的伺服器：

```
類型: CNAME
名稱: luckydraw
值: chenaho.github.io
```

或

```
類型: A
名稱: @
值: [GitHub Pages IP]
```

## 📝 快速參考

| 部署環境 | base 設定 | 範例網址 |
|---------|-----------|---------|
| 自訂網域 | `/` | `https://luckydraw.chenaho.com/` |
| GitHub Pages | `/repo-name/` | `https://user.github.io/repo-name/` |
| 本地開發 | `/` | `http://localhost:5173/` |

## 🔄 重新部署

修改設定後，請重新建置和部署：

```bash
# 1. 清除舊的建置
rm -rf dist

# 2. 重新建置
npm run build

# 3. 提交變更（如果使用 GitHub Pages）
git add .
git commit -m "fix: 更新 base path 設定"
git push

# 4. 等待 GitHub Actions 完成部署
# 前往 GitHub repository > Actions 查看進度
```

---

**最後更新**: 2025年10月10日
**版本**: 1.1.0
