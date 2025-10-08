# GitHub Repository 設定指南

本文件將指導您如何將此專案上傳到 GitHub 並設定自動部署。

## 📋 前置準備

- GitHub 帳號
- Git 已安裝在本機
- 專案已在本機準備好

## 🚀 步驟 1: 初始化 Git Repository

### 方法 A: 使用自動化腳本（推薦）

在專案根目錄執行：

```bash
chmod +x init-git.sh
./init-git.sh
```

### 方法 B: 手動執行

```bash
# 初始化 Git
git init

# 添加所有檔案
git add .

# 第一次 commit
git commit -m "feat: 初始化抽籤系統專案"
```

## 🌐 步驟 2: 在 GitHub 建立 Repository

1. 前往 [GitHub](https://github.com)
2. 點擊右上角的 `+` → `New repository`
3. 填寫 Repository 資訊：
   - **Repository name**: `lottery-system` （或您喜歡的名稱）
   - **Description**: `Vue 3 抽籤系統 - 整合 Google Sheets`
   - **Public** 或 **Private**（如果要使用免費的 GitHub Pages，請選 Public）
   - **不要**勾選 "Initialize this repository with a README"
4. 點擊 `Create repository`

## 🔗 步驟 3: 連接本地與遠端 Repository

複製 GitHub 提供的指令，或使用以下指令：

```bash
# 添加遠端 repository（替換成您的 GitHub 用戶名）
git remote add origin https://github.com/YOUR_USERNAME/lottery-system.git

# 重命名分支為 main
git branch -M main

# 推送到 GitHub
git push -u origin main
```

## 🚀 步驟 4: 設定 GitHub Pages 自動部署

### 4.1 啟用 GitHub Pages

1. 前往您的 GitHub repository
2. 點擊 `Settings` 標籤
3. 在左側選單找到 `Pages`
4. 在 **Source** 部分：
   - 選擇 `GitHub Actions`
5. 點擊 `Save`

### 4.2 觸發部署

GitHub Actions 會在您推送程式碼時自動執行。

要手動觸發部署：
1. 前往 repository 的 `Actions` 標籤
2. 選擇 `Deploy to GitHub Pages` workflow
3. 點擊 `Run workflow` → `Run workflow`

### 4.3 查看部署狀態

1. 在 `Actions` 標籤可以看到部署進度
2. 部署完成後，您的網站將可在以下網址訪問：
   ```
   https://YOUR_USERNAME.github.io/lottery-system/
   ```

## 📝 步驟 5: 更新 vite.config.js（如果 repository 名稱不同）

如果您的 repository 名稱不是 `lottery-system`，請更新 `vite.config.js`：

```javascript
export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/',
})
```

## 🔄 日常工作流程

### 推送更新

```bash
# 添加變更
git add .

# 提交變更
git commit -m "feat: 新增某功能"

# 推送到 GitHub
git push
```

### 查看部署

每次推送後，GitHub Actions 會自動：
1. 建置專案
2. 部署到 GitHub Pages
3. 更新網站

## 🎯 Repository 結構說明

```
lottery-system/
├── .github/
│   ├── workflows/
│   │   └── deploy.yml              # GitHub Actions 自動部署設定
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md           # Bug 回報模板
│   │   └── feature_request.md      # 功能請求模板
│   └── pull_request_template.md    # PR 模板
├── src/                            # 原始碼
├── .gitignore                      # Git 忽略檔案
├── LICENSE                         # MIT 授權
├── CONTRIBUTING.md                 # 貢獻指南
├── README.md                       # 專案說明
└── init-git.sh                     # Git 初始化腳本
```

## 📌 重要提示

### 修改 Repository 名稱後

如果您修改了 repository 名稱，記得：

1. 更新 `vite.config.js` 中的 `base` 路徑
2. 重新部署

### 使用自訂網域

如果要使用自訂網域：

1. 在專案根目錄建立 `public/CNAME` 檔案
2. 內容填入您的網域名稱：`your-domain.com`
3. 在網域提供商設定 DNS 記錄

## 🆘 常見問題

### Q: GitHub Pages 顯示 404

**A**: 檢查以下項目：
- `vite.config.js` 的 `base` 設定是否正確
- GitHub Pages 是否已啟用
- 部署是否成功完成

### Q: 樣式或圖片無法載入

**A**: 確認 `vite.config.js` 中的 `base` 路徑設定正確。

### Q: 如何使用 SSH 而非 HTTPS

**A**: 使用以下指令更改：
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/lottery-system.git
```

## 🎉 完成！

現在您的抽籤系統已經：
- ✅ 上傳到 GitHub
- ✅ 設定自動部署
- ✅ 可以透過網址公開訪問

每次推送程式碼時，網站都會自動更新！

---

如有任何問題，請查看 [CONTRIBUTING.md](CONTRIBUTING.md) 或建立 Issue。
