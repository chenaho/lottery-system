#!/bin/bash

# 初始化 Git Repository 的腳本

echo "🚀 開始初始化 Git Repository..."

# 初始化 Git
git init

# 添加所有檔案
git add .

# 第一次 commit
git commit -m "feat: 初始化抽籤系統專案

- Vue 3 + Pinia 架構
- Google Sheets API 整合
- 抽籤功能與動畫
- 參與者名單管理
- 自動更新功能
- 響應式設計"

echo "✅ Git repository 初始化完成！"
echo ""
echo "📝 下一步："
echo "1. 在 GitHub 建立新的 repository"
echo "2. 執行以下指令連接到遠端 repository："
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/lottery-system.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. 啟用 GitHub Pages："
echo "   - 前往 repository 的 Settings > Pages"
echo "   - Source 選擇 'GitHub Actions'"
echo "   - 等待部署完成"
echo ""
